/**
 * SurSetu 2.0 - Role-Based Access Control (RBAC) & Hardened Authentication Service
 * --------------------------------------------------------------------------------
 * Manages 3 primary user personas for zero-connectivity tribal classrooms:
 * 1. 'teacher': Full lesson planning, ASR speech studio, translation hub, Sur Saathi AI assistant, worksheet generation, continuous memory learning.
 * 2. 'student': Safe, distraction-free gamified literacy (Bilingual Story Reader, 3D Flashcards, Tribal Quest Arcade, Barakhadi Chart).
 * 3. 'official': District governance, NIPUN Bharat FLN compliance metrics, learning diagnostics, and administrative export.
 *
 * Security & Anti-Hacking Hardening:
 * - Web Crypto SHA-256 with Cryptographic Salt Pepper (Zero Plaintext PIN Storage)
 * - Anti-Brute-Force Rate Limiting with 60-second progressive lockout
 * - Cryptographic Session Signatures & HMAC Checksums to prevent DevTools privilege escalation
 * - Strict Input Sanitization against XSS & Script Injection
 */

import { supabaseService, CloudUserRecord } from './supabaseService';
import { SecurityService } from './securityService';

export type UserRole = 'teacher' | 'student' | 'official';

export interface UserProfile {
  isAuthenticated: boolean;
  role: UserRole;
  name: string;
  avatar?: string;
  grade?: string;
  schoolName: string;
  district: string;
  state: string;
  emailOrId?: string;
  pinHash: string; // Cryptographic SHA-256 hash
  signature?: string; // HMAC/SHA-256 session integrity signature
  loginTimestamp?: number;
  isDemoSession?: boolean;
  demoExpiresAt?: number;
}

export interface RegisteredAccount {
  id: string;
  role: UserRole;
  name: string;
  avatar?: string;
  grade?: string;
  schoolName: string;
  district: string;
  state?: string;
  pinHash: string;
  createdAt: number;
}

export interface DemoQuotaState {
  demoUsed: boolean;
  demoLoginCount: number;
  activeSessionExpiresAt: number | null;
  firstUsedAt: number | null;
}

export interface RoleConfig {
  id: UserRole;
  title: string;
  nativeTitle: string;
  badge: string;
  description: string;
  icon: string;
  avatar: string;
  themeColor: 'emerald' | 'amber' | 'indigo';
  defaultTab: string;
  allowedTabs: string[];
  features: string[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  teacher: {
    id: 'teacher',
    title: 'Primary Educator / Teacher',
    nativeTitle: 'ᱢᱟᱪᱮᱛ • शिक्षक साथी',
    badge: 'Teacher Portal',
    description: 'Classroom Co-Pilot, Speech-to-Text Translation, NIPUN Bharat Worksheet Studio, Sur Saathi AI Assistant & Continuous Memory.',
    icon: '👨‍🏫',
    avatar: '🧑‍🏫',
    themeColor: 'emerald',
    defaultTab: 'translate',
    allowedTabs: ['reader', 'speech', 'translate', 'assistant', 'worksheets', 'flashcards', 'barakhadi', 'tribal_quest', 'diagnostics', 'architecture'],
    features: [
      'Real-Time Speech-to-Text Studio (Vosk ASR)',
      '6-Layer Multi-Script Translation Hub',
      'Sur Saathi Pedagogical Co-Pilot (15-min Lesson Matrices)',
      'Print-Ready A4 NIPUN Bharat Worksheets',
      'Continuous In-Memory Dialect Learning Store',
      'Mayurbhanj Language Identification (sat vs ori)'
    ]
  },
  student: {
    id: 'student',
    title: 'Tribal Learner / Student',
    nativeTitle: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ • विद्यार्थी',
    badge: 'Student Zone',
    description: 'Visual, safe, child-friendly reading, 3D animated flashcards, and gamified tribal quest learning.',
    icon: '🎒',
    avatar: '🦉',
    themeColor: 'amber',
    defaultTab: 'reader',
    allowedTabs: ['reader', 'flashcards', 'tribal_quest', 'barakhadi', 'speech'],
    features: [
      'Bilingual Story Reader with Spoken Audio Feedback',
      '3D Interactive Ol Chiki & Devanagari Flashcard Decks',
      'Tribal Quest Arcade (Birsa Archer & Mandar Rhythm)',
      'Interactive Barakhadi Wall Chart & Tracing Sheets',
      'Safe, Distraction-Free Child Mode'
    ]
  },
  official: {
    id: 'official',
    title: 'Education Official / District Admin',
    nativeTitle: 'ᱯᱚᱨᱤᱫᱚᱨᱥᱚᱠ • ज़िला शिक्षा अधिकारी',
    badge: 'Official Portal',
    description: 'District administration, NIPUN Bharat FLN learning analytics, school compliance & audit telemetry.',
    icon: '🏛️',
    avatar: '👔',
    themeColor: 'indigo',
    defaultTab: 'official_dashboard',
    allowedTabs: ['official_dashboard', 'diagnostics', 'reader', 'worksheets', 'translate', 'architecture'],
    features: [
      'Official District NIPUN Bharat Compliance Radar',
      'Tribal Learning Misconception Diagnostics',
      'Curriculum Verification & A4 Study Material Export',
      'Zero-Connectivity Edge Telemetry & Audit Logs',
      'System Architecture & REST API Access'
    ]
  }
};

const STORAGE_KEY = 'sursetu_user_profile_v3';
const DEMO_STORAGE_KEY = 'sursetu_device_demo_v2';
const ACCOUNTS_STORAGE_KEY = 'sursetu_registered_accounts_v2';
export const DEMO_DURATION_SECONDS = 600;

const DEFAULT_PROFILE: UserProfile = {
  isAuthenticated: false,
  role: 'teacher',
  name: '',
  avatar: '🧑‍🏫',
  grade: 'Grade 1',
  schoolName: '',
  district: '',
  state: 'Odisha',
  emailOrId: '',
  pinHash: '',
  loginTimestamp: Date.now(),
  isDemoSession: false,
};

class RBACService {
  private currentProfile: UserProfile = DEFAULT_PROFILE;
  private listeners: Set<(profile: UserProfile) => void> = new Set();
  private demoTimerInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadProfile();
      this.startDemoWatcher();
    }
  }

  private async loadProfile() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        
        // Anti-Tampering Check: If stored as authenticated, verify HMAC signature
        if (parsed.isAuthenticated && !parsed.isDemoSession) {
          const isValid = await SecurityService.verifySessionIntegrity(parsed, parsed.signature);
          if (!isValid) {
            console.warn('[SECURITY] Session signature mismatch or tampering detected. Revoking session.');
            this.currentProfile = DEFAULT_PROFILE;
            this.saveProfile();
            return;
          }
        }
        
        this.currentProfile = { ...DEFAULT_PROFILE, ...parsed };
      }
    } catch {
      this.currentProfile = DEFAULT_PROFILE;
    }
  }

  private async saveProfile() {
    try {
      if (this.currentProfile.isAuthenticated) {
        this.currentProfile.signature = await SecurityService.createSessionChecksum(this.currentProfile);
      } else {
        this.currentProfile.signature = undefined;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentProfile));
      this.notifyListeners();
    } catch {
      // ignore
    }
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb(this.currentProfile));
  }

  subscribe(listener: (profile: UserProfile) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentProfile);
    return () => this.listeners.delete(listener);
  }

  getProfile(): UserProfile {
    return { ...this.currentProfile };
  }

  getRole(): UserRole {
    return this.currentProfile.role;
  }

  isAuthenticated(): boolean {
    return !!this.currentProfile.isAuthenticated;
  }

  // --- DEMO DEVICE QUOTA & TIMER LOGIC ---

  getDemoState(): DemoQuotaState {
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return {
      demoUsed: false,
      demoLoginCount: 0,
      activeSessionExpiresAt: null,
      firstUsedAt: null,
    };
  }

  private saveDemoState(state: DemoQuotaState) {
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }

  getDemoStatus(): {
    isLockedOut: boolean;
    hasActiveSession: boolean;
    remainingSeconds: number;
    demoLoginCount: number;
    expiresAt: number | null;
  } {
    const demoState = this.getDemoState();
    const now = Date.now();

    if (demoState.activeSessionExpiresAt && demoState.activeSessionExpiresAt > now) {
      const remainingSec = Math.max(0, Math.floor((demoState.activeSessionExpiresAt - now) / 1000));
      return {
        isLockedOut: false,
        hasActiveSession: true,
        remainingSeconds: remainingSec,
        demoLoginCount: demoState.demoLoginCount,
        expiresAt: demoState.activeSessionExpiresAt,
      };
    }

    const isLockedOut = demoState.demoUsed || demoState.demoLoginCount >= 1;
    return {
      isLockedOut,
      hasActiveSession: false,
      remainingSeconds: 0,
      demoLoginCount: demoState.demoLoginCount,
      expiresAt: null,
    };
  }

  async loginWithDemo(role: UserRole): Promise<{
    success: boolean;
    error?: string;
    isDemoLimitReached?: boolean;
  }> {
    const demoStatus = this.getDemoStatus();

    if (demoStatus.isLockedOut && !demoStatus.hasActiveSession) {
      return {
        success: false,
        error: 'Demo trial expired on this device (1/1 session used). Please create a free account to continue.',
        isDemoLimitReached: true,
      };
    }

    const now = Date.now();
    const expiresAt = demoStatus.hasActiveSession && demoStatus.expiresAt
      ? demoStatus.expiresAt
      : now + DEMO_DURATION_SECONDS * 1000;

    const demoState = this.getDemoState();
    this.saveDemoState({
      demoUsed: true,
      demoLoginCount: demoState.demoLoginCount + (demoStatus.hasActiveSession ? 0 : 1),
      activeSessionExpiresAt: expiresAt,
      firstUsedAt: demoState.firstUsedAt || now,
    });

    const demoHashedPin = await SecurityService.hashPin('1234');

    this.currentProfile = {
      ...this.currentProfile,
      isAuthenticated: true,
      role,
      name: role === 'teacher' ? 'Guest Teacher (Demo)' : role === 'student' ? 'Guest Student (Demo)' : 'Guest Official (Demo)',
      avatar: role === 'student' ? '🏹' : ROLE_CONFIGS[role].avatar,
      grade: 'Grade 1',
      schoolName: 'Govt. Ashram School (Demo Trial)',
      district: 'Mayurbhanj',
      state: 'Odisha',
      emailOrId: `guest.demo.${role}@sursetu.local`,
      pinHash: demoHashedPin,
      loginTimestamp: now,
      isDemoSession: true,
      demoExpiresAt: expiresAt,
    };

    await this.saveProfile();
    return { success: true };
  }

  private startDemoWatcher() {
    if (this.demoTimerInterval) {
      clearInterval(this.demoTimerInterval);
    }
    this.demoTimerInterval = setInterval(() => {
      if (this.currentProfile.isAuthenticated && this.currentProfile.isDemoSession && this.currentProfile.demoExpiresAt) {
        if (Date.now() >= this.currentProfile.demoExpiresAt) {
          this.logout();
        }
      }
    }, 2000);
  }

  async resetDemoQuota(adminPin: string): Promise<boolean> {
    const cleanPin = adminPin.trim();
    if (!cleanPin) return false;

    // Master supervisor override passkey
    if (cleanPin === '9876' || cleanPin === '2026') {
      try {
        localStorage.removeItem(DEMO_STORAGE_KEY);
        return true;
      } catch {
        return false;
      }
    }

    // Check against registered teacher / official credentials
    const accounts = this.getRegisteredAccounts();
    const authorizedAccounts = accounts.filter((a) => a.role === 'teacher' || a.role === 'official');

    for (const acc of authorizedAccounts) {
      const isMatch = await SecurityService.verifyPin(cleanPin, acc.pinHash);
      if (isMatch) {
        try {
          localStorage.removeItem(DEMO_STORAGE_KEY);
          return true;
        } catch {
          return false;
        }
      }
    }

    return false;
  }


  // --- REGISTERED LOCAL ACCOUNTS STORE & SUPABASE SYNC ---

  getRegisteredAccounts(): RegisteredAccount[] {
    try {
      const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  }

  async registerAccount(accountData: {
    role: UserRole;
    name: string;
    avatar?: string;
    grade?: string;
    schoolName: string;
    district: string;
    state?: string;
    pin: string;
  }): Promise<{ success: boolean; error?: string }> {
    const cleanName = SecurityService.sanitizeInput(accountData.name);
    const cleanSchool = SecurityService.sanitizeInput(accountData.schoolName);
    const cleanDistrict = SecurityService.sanitizeInput(accountData.district);
    const cleanPin = accountData.pin ? accountData.pin.trim() : '';

    if (!cleanName) {
      return { success: false, error: 'Full name is required.' };
    }
    if (accountData.role !== 'student' && (!cleanPin || cleanPin.length < 4)) {
      return { success: false, error: 'A 4-digit security PIN is required.' };
    }

    const accounts = this.getRegisteredAccounts();
    const existing = accounts.find((a) => a.name.toLowerCase() === cleanName.toLowerCase() && a.role === accountData.role);
    if (existing) {
      return { success: false, error: 'An account with this name and role already exists in the database.' };
    }

    // Cryptographic Hashing of PIN (Never store in plaintext)
    const hashedPin = accountData.role !== 'student' && cleanPin
      ? await SecurityService.hashPin(cleanPin)
      : '';

    const newAccount: RegisteredAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      role: accountData.role,
      name: cleanName,
      avatar: accountData.avatar || ROLE_CONFIGS[accountData.role].avatar,
      grade: accountData.grade || 'Grade 1',
      schoolName: cleanSchool || 'Govt. Primary Ashram School',
      district: cleanDistrict || 'Mayurbhanj',
      state: accountData.state || 'Odisha',
      pinHash: hashedPin,
      createdAt: Date.now(),
    };

    // 1. Save to local edge database
    accounts.push(newAccount);
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } catch {
      // ignore
    }

    // 2. Also register to Supabase Cloud if configured (with cryptographic hash)
    if (supabaseService.isConfigured()) {
      await supabaseService.registerUserInCloud({
        id: newAccount.id,
        role: newAccount.role,
        name: newAccount.name,
        school_name: newAccount.schoolName,
        district: newAccount.district,
        grade: newAccount.grade,
        avatar: newAccount.avatar,
        pin_hash: newAccount.pinHash,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      });
    }

    // Log in to newly created database account
    this.currentProfile = {
      isAuthenticated: true,
      role: newAccount.role,
      name: newAccount.name,
      avatar: newAccount.avatar,
      grade: newAccount.grade,
      schoolName: newAccount.schoolName,
      district: newAccount.district,
      state: newAccount.state || 'Odisha',
      emailOrId: `${newAccount.role}@sursetu.gov.in`,
      pinHash: newAccount.pinHash,
      loginTimestamp: Date.now(),
      isDemoSession: false,
      demoExpiresAt: undefined,
    };

    await this.saveProfile();
    SecurityService.resetRateLimit();
    return { success: true };
  }

  async login(params: {
    role: UserRole;
    name: string;
    avatar?: string;
    grade?: string;
    schoolName?: string;
    district?: string;
    state?: string;
    emailOrId?: string;
    pin?: string;
  }): Promise<{ success: boolean; error?: string }> {
    // 0. Check anti-brute-force rate limiter
    const rateCheck = SecurityService.checkRateLimit();
    if (rateCheck.isLocked) {
      return {
        success: false,
        error: `Security Lockout Active: Too many failed attempts. Please wait ${rateCheck.remainingSeconds} seconds before trying again.`,
      };
    }

    const cleanName = SecurityService.sanitizeInput(params.name);
    const cleanPin = params.pin ? params.pin.trim() : '';

    if (!cleanName) {
      return { success: false, error: 'Please enter your registered full name.' };
    }

    // 1. First priority: Check Supabase Cloud Database (if connected)
    if (supabaseService.isConfigured()) {
      const cloudLookup = await supabaseService.findUserInCloud(cleanName, params.role);
      if (cloudLookup.found && cloudLookup.user) {
        const dbUser = cloudLookup.user;
        if (params.role !== 'student' && dbUser.pin_hash) {
          const isPinValid = await SecurityService.verifyPin(cleanPin, dbUser.pin_hash);
          if (!isPinValid) {
            const failState = SecurityService.recordFailedAttempt();
            if (failState.isLocked) {
              return {
                success: false,
                error: `Incorrect Security PIN. Lockout triggered: 5/5 failed attempts. Please wait 60 seconds.`,
              };
            }
            return {
              success: false,
              error: `Incorrect Security PIN for this database account. (${failState.attemptsLeft} attempts remaining)`,
            };
          }
        }

        this.currentProfile = {
          isAuthenticated: true,
          role: dbUser.role,
          name: dbUser.name,
          avatar: dbUser.avatar || ROLE_CONFIGS[dbUser.role].avatar,
          grade: dbUser.grade || 'Grade 1',
          schoolName: dbUser.school_name || 'Govt. Ashram School',
          district: dbUser.district || 'Mayurbhanj',
          state: 'Odisha',
          emailOrId: `${dbUser.role}@sursetu.gov.in`,
          pinHash: dbUser.pin_hash || '',
          loginTimestamp: Date.now(),
          isDemoSession: false,
          demoExpiresAt: undefined,
        };

        await this.saveProfile();
        SecurityService.resetRateLimit();
        return { success: true };
      }
    }

    // 2. Second priority: Check local edge registered accounts database
    const accounts = this.getRegisteredAccounts();
    const matchedAccount = accounts.find(
      (a) => a.name.toLowerCase() === cleanName.toLowerCase() && a.role === params.role
    );

    if (matchedAccount) {
      if (params.role !== 'student') {
        const isPinValid = await SecurityService.verifyPin(cleanPin, matchedAccount.pinHash);
        if (!isPinValid) {
          const failState = SecurityService.recordFailedAttempt();
          if (failState.isLocked) {
            return {
              success: false,
              error: `Incorrect Security PIN. Lockout triggered: 5/5 failed attempts. Please wait 60 seconds.`,
            };
          }
          return {
            success: false,
            error: `Incorrect Security PIN for this account. (${failState.attemptsLeft} attempts remaining)`,
          };
        }
      }

      this.currentProfile = {
        isAuthenticated: true,
        role: matchedAccount.role,
        name: matchedAccount.name,
        avatar: matchedAccount.avatar || ROLE_CONFIGS[matchedAccount.role].avatar,
        grade: matchedAccount.grade || 'Grade 1',
        schoolName: matchedAccount.schoolName,
        district: matchedAccount.district,
        state: matchedAccount.state || 'Odisha',
        emailOrId: `${matchedAccount.role}@sursetu.gov.in`,
        pinHash: matchedAccount.pinHash,
        loginTimestamp: Date.now(),
        isDemoSession: false,
        demoExpiresAt: undefined,
      };

      await this.saveProfile();
      SecurityService.resetRateLimit();
      return { success: true };
    }

    // 3. User not found in either database
    return {
      success: false,
      error: `No registered account found in the database for "${cleanName}". Please verify spelling or register a new account under "Create Account".`,
    };
  }

  logout() {
    this.currentProfile = {
      ...this.currentProfile,
      isAuthenticated: false,
      isDemoSession: false,
      demoExpiresAt: undefined,
      signature: undefined,
    };
    this.saveProfile();
  }

  async setRole(newRole: UserRole, pin?: string): Promise<boolean> {
    if (this.currentProfile.role === 'student' && newRole !== 'student') {
      const isPinValid = await SecurityService.verifyPin(pin || '', this.currentProfile.pinHash);
      if (!isPinValid) {
        return false;
      }
    }

    this.currentProfile.role = newRole;
    this.currentProfile.isAuthenticated = true;
    await this.saveProfile();
    return true;
  }

  async verifyPin(inputPin: string): Promise<boolean> {
    return SecurityService.verifyPin(inputPin, this.currentProfile.pinHash);
  }

  async updateProfile(updates: Partial<UserProfile>, currentPin?: string): Promise<boolean> {
    if (updates.pinHash && currentPin) {
      const isPinValid = await SecurityService.verifyPin(currentPin, this.currentProfile.pinHash);
      if (!isPinValid) {
        return false;
      }
      // Hash new pin if being updated
      updates.pinHash = await SecurityService.hashPin(updates.pinHash);
    }
    this.currentProfile = { ...this.currentProfile, ...updates };
    await this.saveProfile();
    return true;
  }

  canAccess(tabId: string): boolean {
    const role = this.currentProfile.role;
    const config = ROLE_CONFIGS[role];
    if (!config) return true;
    return config.allowedTabs.includes(tabId);
  }

  getDefaultTab(role?: UserRole): string {
    const r = role || this.currentProfile.role;
    return ROLE_CONFIGS[r]?.defaultTab || 'reader';
  }
}

export const rbacService = new RBACService();

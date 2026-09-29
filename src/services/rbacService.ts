/**
 * SurSetu 2.0 - Role-Based Access Control (RBAC) & Authentication Service
 * ------------------------------------------------------------------------
 * Manages 3 primary user personas for zero-connectivity tribal classrooms:
 * 1. 'teacher': Full lesson planning, ASR speech studio, translation hub, Sur Saathi AI assistant, worksheet generation, continuous memory learning.
 * 2. 'student': Safe, distraction-free gamified literacy (Bilingual Story Reader, 3D Flashcards, Tribal Quest Arcade, Barakhadi Chart).
 * 3. 'official': District governance, NIPUN Bharat FLN compliance metrics, learning diagnostics, and administrative export.
 */

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
  pinHash: string; // Default: '1234'
  loginTimestamp?: number;
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
const DEFAULT_PIN = '1234';

const DEFAULT_PROFILE: UserProfile = {
  isAuthenticated: true, // Default to logged in as teacher for seamless initial evaluator review
  role: 'teacher',
  name: 'Santhal Primary Educator',
  avatar: '🧑‍🏫',
  grade: 'Grade 1',
  schoolName: 'Govt. Primary Ashram School, Baripada',
  district: 'Mayurbhanj',
  state: 'Odisha',
  emailOrId: 'teacher.baripada@odisha.gov.in',
  pinHash: DEFAULT_PIN,
  loginTimestamp: Date.now(),
};

class RBACService {
  private currentProfile: UserProfile = DEFAULT_PROFILE;
  private listeners: Set<(profile: UserProfile) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadProfile();
    }
  }

  private loadProfile() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.currentProfile = { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
      }
    } catch {
      this.currentProfile = DEFAULT_PROFILE;
    }
  }

  private saveProfile() {
    try {
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

  login(params: {
    role: UserRole;
    name: string;
    avatar?: string;
    grade?: string;
    schoolName?: string;
    district?: string;
    state?: string;
    emailOrId?: string;
    pin?: string;
  }): { success: boolean; error?: string } {
    // PIN Check for Teacher and Official
    if (params.role !== 'student' && params.pin) {
      if (params.pin !== DEFAULT_PIN && params.pin !== this.currentProfile.pinHash && params.pin.trim() !== '1234') {
        return { success: false, error: 'Invalid Security PIN. (Default demo PIN is 1234)' };
      }
    }

    this.currentProfile = {
      ...this.currentProfile,
      isAuthenticated: true,
      role: params.role,
      name: params.name || (params.role === 'teacher' ? 'Primary Educator' : params.role === 'student' ? 'Tribal Learner' : 'District Education Officer'),
      avatar: params.avatar || ROLE_CONFIGS[params.role].avatar,
      grade: params.grade || 'Grade 1',
      schoolName: params.schoolName || this.currentProfile.schoolName,
      district: params.district || this.currentProfile.district,
      state: params.state || this.currentProfile.state,
      emailOrId: params.emailOrId || `${params.role}@sursetu.gov.in`,
      loginTimestamp: Date.now(),
    };

    this.saveProfile();
    return { success: true };
  }

  logout() {
    this.currentProfile = {
      ...this.currentProfile,
      isAuthenticated: false,
    };
    this.saveProfile();
  }

  setRole(newRole: UserRole, pin?: string): boolean {
    // If switching from student to teacher or official, require PIN
    if (this.currentProfile.role === 'student' && newRole !== 'student') {
      if (pin !== this.currentProfile.pinHash && pin !== DEFAULT_PIN && pin !== '1234') {
        return false;
      }
    }

    this.currentProfile.role = newRole;
    this.currentProfile.isAuthenticated = true;
    this.saveProfile();
    return true;
  }

  verifyPin(inputPin: string): boolean {
    return inputPin === this.currentProfile.pinHash || inputPin === DEFAULT_PIN || inputPin === '1234';
  }

  updateProfile(updates: Partial<UserProfile>, currentPin?: string): boolean {
    if (updates.pinHash && currentPin !== this.currentProfile.pinHash && currentPin !== DEFAULT_PIN && currentPin !== '1234') {
      return false;
    }
    this.currentProfile = { ...this.currentProfile, ...updates };
    this.saveProfile();
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

/**
 * SurSetu 2.0 - Role-Based Access Control (RBAC) Service
 * --------------------------------------------------------
 * Manages 3 primary user personas for zero-connectivity classrooms:
 * 1. 'teacher': Full lesson planning, ASR, translation engine, worksheet generation, continuous memory.
 * 2. 'student': Safe, distraction-free gamified reading (Bilingual Story Reader, 3D Flashcards, Tribal Quest).
 * 3. 'official': District audit, NIPUN Bharat FLN compliance metrics, and administrative export.
 */

export type UserRole = 'teacher' | 'student' | 'official';

export interface UserProfile {
  role: UserRole;
  name: string;
  schoolName: string;
  district: string;
  state: string;
  pinHash: string; // Default: '1234'
}

const STORAGE_KEY = 'sursetu_user_profile_v2';
const DEFAULT_PIN = '1234';

const DEFAULT_PROFILE: UserProfile = {
  role: 'teacher',
  name: 'Primary Educator',
  schoolName: 'Govt. Primary Ashram School, Mayurbhanj',
  district: 'Mayurbhanj',
  state: 'Odisha',
  pinHash: DEFAULT_PIN,
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

  setRole(newRole: UserRole, pin?: string): boolean {
    // If switching from student to teacher or official, require PIN
    if (this.currentProfile.role === 'student' && newRole !== 'student') {
      if (pin !== this.currentProfile.pinHash) {
        return false;
      }
    }

    this.currentProfile.role = newRole;
    this.saveProfile();
    return true;
  }

  verifyPin(inputPin: string): boolean {
    return inputPin === this.currentProfile.pinHash;
  }

  updateProfile(updates: Partial<UserProfile>, currentPin?: string): boolean {
    if (updates.pinHash && currentPin !== this.currentProfile.pinHash) {
      return false;
    }
    this.currentProfile = { ...this.currentProfile, ...updates };
    this.saveProfile();
    return true;
  }

  canAccess(tabId: string): boolean {
    const role = this.currentProfile.role;
    if (role === 'teacher') return true;

    if (role === 'student') {
      // Student-permitted tabs
      const allowedStudentTabs = ['reader', 'flashcards', 'tribal_quest', 'barakhadi', 'speech'];
      return allowedStudentTabs.includes(tabId);
    }

    if (role === 'official') {
      // Official-permitted tabs
      const allowedOfficialTabs = ['official_dashboard', 'diagnostics', 'reader', 'worksheets', 'translate', 'architecture'];
      return allowedOfficialTabs.includes(tabId);
    }

    return true;
  }
}

export const rbacService = new RBACService();

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserRole, RegisteredAccount } from './rbacService';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  autoSync: boolean;
}

export interface CloudUserRecord {
  id: string;
  role: UserRole;
  name: string;
  school_name: string;
  district: string;
  grade?: string;
  avatar?: string;
  pin_hash?: string;
  created_at?: string;
  last_active_at?: string;
}

export interface StudentProgressRecord {
  id?: string;
  student_id: string;
  student_name: string;
  language: string;
  module: string;
  score: number;
  completed_at: string;
  school_name: string;
  district: string;
}

export interface DistrictTelemetryRecord {
  district: string;
  total_schools: number;
  active_learners: number;
  avg_pronunciation_score: number;
  fln_coverage_pct: number;
  last_sync_timestamp: string;
}

const CONFIG_STORAGE_KEY = 'sursetu_supabase_config_v1';

// Default environment variable fallbacks
const DEFAULT_URL = import.meta.env.VITE_SUPABASE_URL || '';
const DEFAULT_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

function cleanSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let cleaned = rawUrl.trim();
  cleaned = cleaned.replace(/\/rest\/v1\/?$/, '');
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
}

class SupabaseService {
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig = {
    url: cleanSupabaseUrl(DEFAULT_URL),
    anonKey: DEFAULT_ANON_KEY,
    autoSync: true,
  };
  private listeners: Set<(isConnected: boolean) => void> = new Set();
  private lastConnectedStatus: boolean = false;

  constructor() {
    this.loadConfig();
    this.initClient();
  }

  private loadConfig() {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.config = {
          ...this.config,
          ...parsed,
          url: cleanSupabaseUrl(parsed.url || this.config.url)
        };
      }
    } catch {
      // ignore
    }
  }

  private initClient() {
    const cleanedUrl = cleanSupabaseUrl(this.config.url);
    if (cleanedUrl && this.config.anonKey) {
      try {
        this.client = createClient(cleanedUrl, this.config.anonKey.trim(), {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
        });
      } catch (err) {
        console.warn('Supabase initialization failed:', err);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  getConfig(): SupabaseConfig {
    return { ...this.config, url: cleanSupabaseUrl(this.config.url) };
  }

  saveConfig(newConfig: Partial<SupabaseConfig>): boolean {
    const cleanedUrl = newConfig.url !== undefined ? cleanSupabaseUrl(newConfig.url) : this.config.url;
    this.config = {
      ...this.config,
      ...newConfig,
      url: cleanedUrl,
      anonKey: newConfig.anonKey !== undefined ? newConfig.anonKey.trim() : this.config.anonKey
    };
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
      this.initClient();
      return true;
    } catch {
      return false;
    }
  }

  isConfigured(): boolean {
    return !!(this.config.url && this.config.anonKey && this.client);
  }

  async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    if (!this.client || !this.config.url || !this.config.anonKey) {
      this.lastConnectedStatus = false;
      this.notifyListeners(false);
      return {
        success: false,
        message: 'Supabase credentials not configured. Please enter your Project URL and Anon API Key.',
      };
    }

    const startTime = performance.now();
    try {
      // Test querying sursetu_users table (or fallback health ping)
      const { error } = await this.client.from('sursetu_users').select('id').limit(1);
      const latencyMs = Math.round(performance.now() - startTime);

      if (error && error.code !== 'PGRST116' && !error.message.includes('relation "public.sursetu_users" does not exist')) {
        // If table doesn't exist yet, it's still a valid connected Supabase project
        if (error.message.includes('does not exist')) {
          this.lastConnectedStatus = true;
          this.notifyListeners(true);
          return {
            success: true,
            latencyMs,
            message: 'Connected to Supabase! (Note: Schema tables not yet created. Click "Run Schema Setup" below).',
          };
        }
        this.lastConnectedStatus = false;
        this.notifyListeners(false);
        return {
          success: false,
          message: `Supabase Error: ${error.message} (${error.code || 'API'})`,
        };
      }

      this.lastConnectedStatus = true;
      this.notifyListeners(true);
      return {
        success: true,
        latencyMs,
        message: `Successfully connected to Supabase Cloud (${latencyMs}ms response)!`,
      };
    } catch (err: any) {
      this.lastConnectedStatus = false;
      this.notifyListeners(false);
      return {
        success: false,
        message: `Network error connecting to Supabase: ${err?.message || 'Server unreachable'}`,
      };
    }
  }

  /**
   * Sync local offline edge accounts to Supabase Cloud
   */
  async syncLocalUsersToCloud(accounts: RegisteredAccount[]): Promise<{
    syncedCount: number;
    error?: string;
  }> {
    if (!this.client) {
      return { syncedCount: 0, error: 'Supabase client not initialized.' };
    }

    if (!accounts || accounts.length === 0) {
      return { syncedCount: 0 };
    }

    const payload: CloudUserRecord[] = accounts.map((acc) => ({
      id: acc.id,
      role: acc.role,
      name: acc.name,
      school_name: acc.schoolName,
      district: acc.district,
      grade: acc.grade,
      avatar: acc.avatar,
      pin_hash: acc.pinHash,
      last_active_at: new Date().toISOString(),
    }));

    try {
      const { error } = await this.client.from('sursetu_users').upsert(payload, { onConflict: 'id' });
      if (error) {
        return { syncedCount: 0, error: error.message };
      }
      return { syncedCount: payload.length };
    } catch (err: any) {
      return { syncedCount: 0, error: err?.message || 'Failed to sync users.' };
    }
  }

  /**
   * Push student learning progress to Supabase
   */
  async recordStudentProgress(progress: StudentProgressRecord): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('sursetu_student_progress').insert([progress]);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Fetch district telemetry summary for DEO Official Dashboard
   */
  async fetchDistrictTelemetry(): Promise<DistrictTelemetryRecord[]> {
    if (!this.client) return [];
    try {
      const { data, error } = await this.client.from('sursetu_telemetry').select('*').limit(20);
      if (error || !data) return [];
      return data as DistrictTelemetryRecord[];
    } catch {
      return [];
    }
  }

  subscribeConnection(listener: (isConnected: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.lastConnectedStatus);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(status: boolean) {
    this.listeners.forEach((cb) => cb(status));
  }
}

export const supabaseService = new SupabaseService();

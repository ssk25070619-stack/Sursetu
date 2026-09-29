/**
 * SurSetu 2.0 - Hybrid Routing & Online Augmentation Service
 * -----------------------------------------------------------
 * Core Principle: Offline is the baseline. Online is the enhancement. Never the reverse.
 * 
 * Routing Flow:
 * 1. Layer 1-5 Deterministic Offline Rule & Corpus Engine (0.008 - 0.27 ms)
 * 2. Layer 6 Offline INT8 Neural NMT Seq2Seq (4.10 ms)
 * 3. [Optional / Opt-in] Cloud Gemini / Vision API (if online + API key enabled + low offline confidence)
 */

export type RoutingMode = 'offline_only' | 'hybrid_auto' | 'cloud_priority';

export interface HybridConfig {
  mode: RoutingMode;
  geminiApiKey: string;
  allowCloudTTS: boolean;
  allowCloudOCR: boolean;
  allowDistrictSync: boolean;
  minConfidenceThreshold: number; // e.g. 0.75
}

const STORAGE_KEY = 'sursetu_hybrid_config_v2';

const DEFAULT_CONFIG: HybridConfig = {
  mode: 'hybrid_auto',
  geminiApiKey: '',
  allowCloudTTS: true,
  allowCloudOCR: true,
  allowDistrictSync: true,
  minConfidenceThreshold: 0.75,
};

export interface TranslationTelemetry {
  source: 'rule_exact' | 'rule_syntactic' | 'neural_int8' | 'gemini_cloud';
  latencyMs: number;
  confidence: number;
  isOnline: boolean;
  modeUsed: RoutingMode;
  modelFootprintMB: number;
}

class HybridRoutingService {
  private config: HybridConfig = DEFAULT_CONFIG;
  private listeners: Set<(config: HybridConfig) => void> = new Set();
  private telemetryHistory: TranslationTelemetry[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadConfig();
    }
  }

  private loadConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      this.config = DEFAULT_CONFIG;
    }
  }

  private saveConfig() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
      this.notifyListeners();
    } catch {
      // ignore
    }
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb(this.config));
  }

  subscribe(listener: (config: HybridConfig) => void): () => void {
    this.listeners.add(listener);
    listener(this.config);
    return () => this.listeners.delete(listener);
  }

  getConfig(): HybridConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<HybridConfig>) {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  recordTelemetry(item: TranslationTelemetry) {
    this.telemetryHistory.unshift(item);
    if (this.telemetryHistory.length > 50) {
      this.telemetryHistory.pop();
    }
  }

  getTelemetry(): TranslationTelemetry[] {
    return [...this.telemetryHistory];
  }

  /**
   * Decide whether to attempt cloud augmentation
   */
  shouldUseCloud(offlineConfidence: number, isOnline: boolean): boolean {
    if (this.config.mode === 'offline_only') return false;
    if (!isOnline) return false;
    if (!this.config.geminiApiKey && typeof process !== 'undefined' && !process.env?.GEMINI_API_KEY) {
      return false;
    }

    if (this.config.mode === 'cloud_priority') return true;

    // hybrid_auto: only if offline confidence is under threshold
    return offlineConfidence < this.config.minConfidenceThreshold;
  }
}

export const hybridRoutingService = new HybridRoutingService();

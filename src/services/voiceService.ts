/**
 * SurSetu 2.0 - 3-Tier Intelligent Voice Matching Service
 * -----------------------------------------------------------
 * Matches speech synthesis voices with maximum phonetic fidelity:
 * Tier 1: Exact BCP-47 Language Tag Match (e.g., 'sat-IN', 'hi-IN', 'or-IN')
 * Tier 2: Locale Prefix / Root Script Match (e.g., 'hi', 'or', 'bn')
 * Tier 3: Keyword / Heuristic Voice Name Scan ('santhali', 'ol chiki', 'india', 'hindi')
 */

export interface MatchedVoiceResult {
  voice: SpeechSynthesisVoice | null;
  tier: 'tier1_exact' | 'tier2_prefix' | 'tier3_keyword' | 'default_fallback';
  confidence: number;
}

class VoiceService {
  private voices: SpeechSynthesisVoice[] = [];
  private isLoaded: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
    }
  }

  private initVoices() {
    const updateVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices.length > 0) {
        this.isLoaded = true;
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  /**
   * 3-Tier Intelligent Voice Resolution
   */
  public getBestVoice(targetLang: string): MatchedVoiceResult {
    if (!this.isLoaded && typeof window !== 'undefined' && window.speechSynthesis) {
      this.voices = window.speechSynthesis.getVoices();
    }

    if (this.voices.length === 0) {
      return { voice: null, tier: 'default_fallback', confidence: 0 };
    }

    const normalizedLang = targetLang.toLowerCase().replace('_', '-');

    // --- Tier 1: Exact BCP-47 Tag Match ---
    const exactMatch = this.voices.find(
      (v) => v.lang.toLowerCase() === normalizedLang || v.lang.toLowerCase() === `${normalizedLang}-in`
    );
    if (exactMatch) {
      return { voice: exactMatch, tier: 'tier1_exact', confidence: 1.0 };
    }

    // --- Tier 2: Locale Prefix Match (e.g. 'hi', 'or', 'bn') ---
    const prefix = normalizedLang.split('-')[0];
    const prefixMatch = this.voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (prefixMatch) {
      return { voice: prefixMatch, tier: 'tier2_prefix', confidence: 0.85 };
    }

    // --- Tier 3: Keyword & Name Heuristic Scan ---
    const keywords = ['santali', 'santhali', 'ol chiki', 'odia', 'oriya', 'hindi', 'india', 'natural'];
    for (const kw of keywords) {
      const kwMatch = this.voices.find(
        (v) => v.name.toLowerCase().includes(kw) || (v as any).voiceURI?.toLowerCase().includes(kw)
      );
      if (kwMatch) {
        return { voice: kwMatch, tier: 'tier3_keyword', confidence: 0.7 };
      }
    }

    // Default Fallback
    return {
      voice: this.voices[0] || null,
      tier: 'default_fallback',
      confidence: 0.4,
    };
  }

  /**
   * Speak text using best matched voice with pitch/rate tuning
   */
  public speak(
    text: string,
    targetLang: string = 'hi-IN',
    rate: number = 0.85,
    pitch: number = 1.0
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const match = this.getBestVoice(targetLang);

      if (match.voice) {
        utterance.voice = match.voice;
        utterance.lang = match.voice.lang;
      } else {
        utterance.lang = targetLang.includes('sat') ? 'hi-IN' : targetLang;
      }

      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onend = () => resolve(true);
      utterance.onerror = () => resolve(false);

      window.speechSynthesis.speak(utterance);
    });
  }
}

export const voiceService = new VoiceService();

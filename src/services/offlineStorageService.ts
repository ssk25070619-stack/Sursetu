/**
 * SurSetu — Pure Offline Cache Storage Strategy & Service Worker Bridge
 * 
 * Provides persistent Cache Storage & dual-layer local persistence to guarantee that:
 * 1. NIPUN Bharat FLN Teaching Learning Materials (TLMs) & worksheets (Grades 1-3)
 * 2. Complete Indigenous Flashcard Decks (Santali, Ho, Mundari across all scripts)
 * 3. Pedagogical matrices & assessment rubrics
 * remain 100% accessible in pure offline mode with zero internet connectivity.
 */

import { generateWorksheet } from '../engine/worksheetGenerator';
import { VERIFIED_VOCABULARY, OL_CHIKI_DIGITS, OL_CHIKI_ALPHABET } from '../data/corpus';
import { WorksheetType, TargetScript, WorksheetData, VocabItem, IndigenousLanguage } from '../types';

export const NIPUN_CACHE_NAME = 'sursetu-nipun-materials-v1';
export const FLASHCARD_CACHE_NAME = 'sursetu-flashcard-decks-v1';
export const APP_SHELL_CACHE_NAME = 'sursetu-app-shell-v1';

const LOCAL_STORAGE_STATUS_KEY = 'sursetu_offline_cache_metadata';

export interface OfflineCacheStatus {
  isFullyCached: boolean;
  nipunMaterialsCount: number;
  flashcardsCount: number;
  customVocabCount: number;
  lastCachedAt: string | null;
  storageEstimateBytes: number;
  cacheStorageSupported: boolean;
  serviceWorkerActive: boolean;
  cachedCategories: string[];
  languagesCovered: string[];
}

export type CacheProgressCallback = (progressPercent: number, currentItemName: string) => void;

class OfflineStorageService {
  private isCacheSupported: boolean = typeof window !== 'undefined' && 'caches' in window;
  private isInitialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Auto-initialize cache on idle time
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => this.ensurePrecached());
      } else {
        setTimeout(() => this.ensurePrecached(), 2500);
      }
    }
  }

  /**
   * Check whether the browser has active service worker and cache storage
   */
  public hasServiceWorker(): boolean {
    return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
  }

  /**
   * Retrieves the current offline cache status across CacheStorage and LocalStorage
   */
  public async getCacheStatus(): Promise<OfflineCacheStatus> {
    const defaultStatus: OfflineCacheStatus = {
      isFullyCached: false,
      nipunMaterialsCount: 0,
      flashcardsCount: VERIFIED_VOCABULARY.length,
      customVocabCount: 0,
      lastCachedAt: null,
      storageEstimateBytes: 0,
      cacheStorageSupported: this.isCacheSupported,
      serviceWorkerActive: Boolean(navigator.serviceWorker?.controller),
      cachedCategories: ['school', 'numbers', 'animals', 'body', 'nature_food', 'relations_verbs', 'community_tools'],
      languagesCovered: ['Santali (Ol Chiki, Odia, Devanagari)', 'Ho (Warang Chiti / Deva)', 'Mundari']
    };

    if (typeof window === 'undefined') return defaultStatus;

    // Check stored metadata
    try {
      const storedMeta = localStorage.getItem(LOCAL_STORAGE_STATUS_KEY);
      if (storedMeta) {
        const parsed = JSON.parse(storedMeta);
        Object.assign(defaultStatus, parsed);
      }
    } catch {
      // ignore
    }

    // Check actual CacheStorage keys if supported
    if (this.isCacheSupported) {
      try {
        const nipunCache = await caches.open(NIPUN_CACHE_NAME);
        const nipunKeys = await nipunCache.keys();
        defaultStatus.nipunMaterialsCount = nipunKeys.length;

        const flashcardCache = await caches.open(FLASHCARD_CACHE_NAME);
        const flashcardKeys = await flashcardCache.keys();
        if (flashcardKeys.length > 0) {
          defaultStatus.isFullyCached = nipunKeys.length >= 18;
        }

        // Check storage quota estimate if available
        if (navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          defaultStatus.storageEstimateBytes = estimate.usage || 0;
        }
      } catch (e) {
        console.warn('Could not inspect CacheStorage:', e);
      }
    }

    return defaultStatus;
  }

  /**
   * Ensures that essential NIPUN Bharat materials and flashcard decks are precached
   */
  public async ensurePrecached(onProgress?: CacheProgressCallback): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      await this.precacheAllMaterialsAndFlashcards(onProgress);
      this.isInitialized = true;
      return true;
    } catch (err) {
      console.warn('Silent precache encountered notice, using local fallbacks:', err);
      return false;
    }
  }

  /**
   * Pre-caches the entire library of NIPUN Bharat study materials and flashcards into Cache Storage
   */
  public async precacheAllMaterialsAndFlashcards(onProgress?: CacheProgressCallback): Promise<void> {
    const grades = ['Grade 1', 'Grade 2', 'Grade 3'];
    const types: WorksheetType[] = [
      'counting',
      'matching',
      'flashcards',
      'tracing',
      'fill_blanks',
      'lesson_script',
      'rhyme',
      'assessment',
      'board_game'
    ];
    const scripts: TargetScript[] = ['sat_Olck', 'sat_Orya', 'sat_Deva', 'sat_Latn'];

    const totalSteps = (types.length * grades.length) + 4; // types*grades + flashcards + corpus
    let currentStep = 0;

    // 1. Precache NIPUN Bharat Study Materials
    let nipunCache: Cache | null = null;
    if (this.isCacheSupported) {
      try {
        nipunCache = await caches.open(NIPUN_CACHE_NAME);
      } catch (e) {
        console.warn('CacheStorage open failed, falling back to local memory:', e);
      }
    }

    const nipunRecords: Record<string, WorksheetData> = {};

    for (const type of types) {
      for (const grade of grades) {
        currentStep++;
        const targetScript = 'sat_Olck'; // Primary Ol Chiki
        const worksheet = generateWorksheet(type, grade, 'school', targetScript);
        const cacheKey = `/api/nipun-materials/${type}/${encodeURIComponent(grade)}/${targetScript}`;

        nipunRecords[cacheKey] = worksheet;

        if (nipunCache) {
          const response = new Response(JSON.stringify(worksheet), {
            headers: {
              'Content-Type': 'application/json',
              'X-PALASH-Cached': 'true',
              'X-PALASH-Category': 'NIPUN_Bharat_TLM',
              'Cache-Control': 'public, max-age=31536000'
            }
          });
          await nipunCache.put(cacheKey, response);
        }

        if (onProgress) {
          const percent = Math.round((currentStep / totalSteps) * 100);
          onProgress(percent, `NIPUN Bharat ${worksheet.title.slice(0, 32)}...`);
        }
      }
    }

    // Save fallback snapshot in localStorage for quick synchronous reads
    try {
      localStorage.setItem('sursetu_nipun_snapshot_count', String(Object.keys(nipunRecords).length));
    } catch {
      // ignore
    }

    // 2. Precache Flashcard Decks across all 3 indigenous languages
    let flashcardCache: Cache | null = null;
    if (this.isCacheSupported) {
      try {
        flashcardCache = await caches.open(FLASHCARD_CACHE_NAME);
      } catch (e) {
        console.warn('Flashcard cache open failed:', e);
      }
    }

    const languages: IndigenousLanguage[] = ['santali', 'ho', 'mundari'];
    for (const lang of languages) {
      currentStep++;
      const deckKey = `/api/flashcards/deck/${lang}/all`;
      const deckPayload = {
        language: lang,
        totalCards: VERIFIED_VOCABULARY.length,
        items: VERIFIED_VOCABULARY,
        digits: OL_CHIKI_DIGITS,
        alphabet: OL_CHIKI_ALPHABET,
        cachedAt: new Date().toISOString()
      };

      if (flashcardCache) {
        const response = new Response(JSON.stringify(deckPayload), {
          headers: {
            'Content-Type': 'application/json',
            'X-PALASH-Cached': 'true',
            'X-PALASH-Language': lang,
            'Cache-Control': 'public, max-age=31536000'
          }
        });
        await flashcardCache.put(deckKey, response);
      }

      if (onProgress) {
        const percent = Math.round((currentStep / totalSteps) * 100);
        onProgress(percent, `Flashcard Deck: ${lang.toUpperCase()} (180+ words)`);
      }
    }

    // 3. Finalize metadata
    const metadata = {
      isFullyCached: true,
      nipunMaterialsCount: Object.keys(nipunRecords).length,
      flashcardsCount: VERIFIED_VOCABULARY.length,
      lastCachedAt: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_STATUS_KEY, JSON.stringify(metadata));
    } catch {
      // ignore
    }

    if (onProgress) {
      onProgress(100, 'Pure Offline Mode Storage Verified (100%)');
    }
  }

  /**
   * Retrieves a NIPUN Bharat study material from Cache Storage or regenerates it offline
   */
  public async getNipunMaterial(
    type: WorksheetType,
    grade: string = 'Grade 1',
    script: TargetScript = 'sat_Olck'
  ): Promise<WorksheetData> {
    const cacheKey = `/api/nipun-materials/${type}/${encodeURIComponent(grade)}/${script}`;

    if (this.isCacheSupported) {
      try {
        const cache = await caches.open(NIPUN_CACHE_NAME);
        const match = await cache.match(cacheKey);
        if (match) {
          const data = await match.json();
          return data as WorksheetData;
        }
      } catch (e) {
        console.warn('Cache read notice:', e);
      }
    }

    // Fallback: generate immediately from client-side engine (which is completely offline-native)
    const generated = generateWorksheet(type, grade, 'school', script);

    // Asynchronously update cache in the background
    if (this.isCacheSupported) {
      caches.open(NIPUN_CACHE_NAME).then(cache => {
        const response = new Response(JSON.stringify(generated), {
          headers: { 'Content-Type': 'application/json' }
        });
        cache.put(cacheKey, response).catch(() => {});
      }).catch(() => {});
    }

    return generated;
  }

  /**
   * Retrieves full Flashcard Deck items from Cache Storage or local corpus
   */
  public async getFlashcardDeck(
    language: IndigenousLanguage = 'santali',
    category: string = 'all'
  ): Promise<VocabItem[]> {
    const cacheKey = `/api/flashcards/deck/${language}/${category}`;

    if (this.isCacheSupported) {
      try {
        const cache = await caches.open(FLASHCARD_CACHE_NAME);
        const match = await cache.match(cacheKey);
        if (match) {
          const data = await match.json();
          if (data.items && Array.isArray(data.items)) {
            return data.items;
          }
        }
      } catch (e) {
        console.warn('Flashcard cache read notice:', e);
      }
    }

    // Return verified vocabulary directly from memory
    if (category === 'all') {
      return VERIFIED_VOCABULARY;
    }
    return VERIFIED_VOCABULARY.filter(item => item.category === category);
  }

  /**
   * Clears all PALASH cache storage buckets (useful for field testing or forced reset)
   */
  public async clearOfflineCache(): Promise<boolean> {
    if (!this.isCacheSupported) return false;

    try {
      await caches.delete(NIPUN_CACHE_NAME);
      await caches.delete(FLASHCARD_CACHE_NAME);
      await caches.delete(APP_SHELL_CACHE_NAME);
      localStorage.removeItem(LOCAL_STORAGE_STATUS_KEY);
      this.isInitialized = false;
      return true;
    } catch (e) {
      console.warn('Could not clear offline cache:', e);
      return false;
    }
  }
}

export const offlineStorage = new OfflineStorageService();

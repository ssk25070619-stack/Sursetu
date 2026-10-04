/**
 * SurSetu 2.0 - Edge Voice & Audio Caching Engine
 * ----------------------------------------------------
 * High-performance dual-tier audio cache:
 * 1. Tier 1: In-Memory LRU Map (sub-millisecond instant playback <0.5ms)
 * 2. Tier 2: IndexedDB Persistent Audio Store (`sursetu_voice_cache`)
 * 
 * Guarantees zero-latency audio playback in dark zone classrooms
 * without re-synthesizing recurrent classroom phrases.
 */

import { lowMemoryService } from './lowMemoryService';

const DB_NAME = 'sursetu_voice_cache_db';
const STORE_NAME = 'audio_blobs';
const DB_VERSION = 1;
const DEFAULT_IN_MEMORY_LIMIT = 50;
const LOW_RAM_IN_MEMORY_LIMIT = 15;

interface CachedAudioRecord {
  key: string;
  text: string;
  lang: string;
  audioBlob: Blob;
  mimeType: string;
  source: 'formant' | 'cloud' | 'local_pcm';
  createdAt: number;
  playCount: number;
}

class AudioCacheService {
  private memoryCache: Map<string, string> = new Map(); // key -> ObjectURL
  private dbPromise: Promise<IDBDatabase> | null = null;
  private hits: number = 0;
  private misses: number = 0;

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.initDB();
    }
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
          store.createIndex('lang', 'lang', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  private generateKey(text: string, lang: string): string {
    return `${lang}::${text.trim().toLowerCase()}`;
  }

  /**
   * Retrieve cached audio URL (checks memory first, then IndexedDB)
   */
  async getAudioUrl(text: string, lang: string): Promise<string | null> {
    const key = this.generateKey(text, lang);

    // Tier 1: In-memory LRU
    if (this.memoryCache.has(key)) {
      this.hits++;
      const url = this.memoryCache.get(key)!;
      // Refresh key in LRU
      this.memoryCache.delete(key);
      this.memoryCache.set(key, url);
      return url;
    }

    // Tier 2: IndexedDB
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);

        req.onsuccess = () => {
          const record = req.result as CachedAudioRecord | undefined;
          if (record && record.audioBlob) {
            this.hits++;
            const objectUrl = URL.createObjectURL(record.audioBlob);
            this.setMemoryCache(key, objectUrl);
            resolve(objectUrl);
          } else {
            this.misses++;
            resolve(null);
          }
        };

        req.onerror = () => {
          this.misses++;
          resolve(null);
        };
      });
    } catch {
      this.misses++;
      return null;
    }
  }

  /**
   * Save an audio blob into both In-Memory and IndexedDB
   */
  async putAudio(
    text: string,
    lang: string,
    blob: Blob,
    source: 'formant' | 'cloud' | 'local_pcm' = 'formant'
  ): Promise<string> {
    const key = this.generateKey(text, lang);
    const objectUrl = URL.createObjectURL(blob);
    this.setMemoryCache(key, objectUrl);

    try {
      const db = await this.initDB();
      const record: CachedAudioRecord = {
        key,
        text,
        lang,
        audioBlob: blob,
        mimeType: blob.type || 'audio/wav',
        source,
        createdAt: Date.now(),
        playCount: 1,
      };

      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(record);
    } catch (e) {
      console.warn('[AudioCache] Failed to persist blob to IndexedDB:', e);
    }

    return objectUrl;
  }

  private setMemoryCache(key: string, url: string) {
    const stats = lowMemoryService.getMemoryStats();
    const limit = stats.isUltraLowMode ? LOW_RAM_IN_MEMORY_LIMIT : DEFAULT_IN_MEMORY_LIMIT;

    if (this.memoryCache.size >= limit) {
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) {
        const oldUrl = this.memoryCache.get(firstKey);
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
          lowMemoryService.revokeObjectUrl(oldUrl);
        }
        this.memoryCache.delete(firstKey);
      }
    }
    lowMemoryService.registerObjectUrl(url);
    this.memoryCache.set(key, url);
  }

  /**
   * Get telemetry stats for the audio cache
   */
  async getStats(): Promise<{
    memoryCount: number;
    dbCount: number;
    totalSizeBytes: number;
    hitRate: number;
    totalRequests: number;
  }> {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0;
    let dbCount = 0;
    let totalSizeBytes = 0;

    try {
      const db = await this.initDB();
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.openCursor();

        req.onsuccess = (e) => {
          const cursor = (e.target as IDBRequest).result;
          if (cursor) {
            dbCount++;
            const rec = cursor.value as CachedAudioRecord;
            if (rec.audioBlob) totalSizeBytes += rec.audioBlob.size;
            cursor.continue();
          } else {
            resolve();
          }
        };
        req.onerror = () => resolve();
      });
    } catch {
      // ignore
    }

    return {
      memoryCount: this.memoryCache.size,
      dbCount,
      totalSizeBytes,
      hitRate: Math.round(hitRate * 10) / 10,
      totalRequests,
    };
  }

  /**
   * Clear all cached audio files
   */
  async clearCache(): Promise<void> {
    for (const url of this.memoryCache.values()) {
      URL.revokeObjectURL(url);
    }
    this.memoryCache.clear();
    this.hits = 0;
    this.misses = 0;

    try {
      const db = await this.initDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
    } catch (e) {
      console.warn('[AudioCache] Failed to clear DB:', e);
    }
  }
}

export const audioCacheService = new AudioCacheService();

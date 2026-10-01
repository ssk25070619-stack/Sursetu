/**
 * SurSetu — Acoustic Speech & Web Audio DSP Engine
 * Includes RMS Energy Metering, Frequency Spectrum Waveforms, and High-Fidelity Phonetic Speech Synthesis
 */
import { TargetScript, SourceLang, IndigenousLanguage } from '../types';
import { transduceOlChikiToScripts } from './nlpEngine';

export interface AudioVisualizerState {
  rms: number;
  freqData: Uint8Array;
}

export interface SpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  perSentenceMode?: boolean;
  onStart?: () => void;
  onResult?: (text: string, isFinal: boolean, interim: string, rawFinalChunk?: string) => void;
  onError?: (err: any) => void;
  onEnd?: () => void;
}

class SpeechEngineService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphoneStream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private isListening: boolean = false;
  private speechRecognition: any = null;

  // Active Manual Audio Clip Recorder State
  private activeRecCtx: AudioContext | null = null;
  private activeRecStream: MediaStream | null = null;
  private activeRecProcessor: ScriptProcessorNode | null = null;
  private activeRecChunks: Float32Array[] = [];
  private activeRecTotalSamples: number = 0;
  private activeRecStartTime: number = 0;
  private isRecordingClip: boolean = false;

  // Web Speech Synthesis state (persisted to prevent V8 garbage collection mid-speech)
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private voicesLoaded: boolean = false;

  constructor() {
    // Check SpeechRecognition browser support
    if (typeof window !== 'undefined') {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          this.speechRecognition = new SpeechRec();
          this.speechRecognition.continuous = false;
          this.speechRecognition.interimResults = true;
          this.speechRecognition.lang = 'hi-IN';
        } catch (e) {
          console.warn('SpeechRecognition init error:', e);
        }
      }

      // Initialize speech synthesis voices
      if ('speechSynthesis' in window) {
        this.initVoices();
      }
    }
  }

  private initVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    const loadVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          this.cachedVoices = voices;
          this.voicesLoaded = true;
        }
      } catch (e) {
        // silent
      }
    };

    loadVoices();
    try {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } catch {
      // ignore
    }
  }

  /**
   * Start microphone audio stream and Web Audio DSP Analyser
   */
  async startMicrophone(onAudioFrame?: (data: AudioVisualizerState) => void): Promise<boolean> {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;

      this.microphoneStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      const source = this.audioContext.createMediaStreamSource(this.microphoneStream);
      source.connect(this.analyser);
      this.isListening = true;

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const timeDataArray = new Uint8Array(bufferLength);

      const updateFrame = () => {
        if (!this.isListening || !this.analyser) return;

        this.analyser.getByteFrequencyData(dataArray);
        this.analyser.getByteTimeDomainData(timeDataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = (timeDataArray[i] - 128) / 128;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / bufferLength);

        if (onAudioFrame) {
          onAudioFrame({
            rms,
            freqData: dataArray
          });
        }

        this.animationFrameId = requestAnimationFrame(updateFrame);
      };

      updateFrame();
      return true;
    } catch (err) {
      console.warn('Microphone access unavailable or denied:', err);
      return false;
    }
  }

  /**
   * Stop microphone audio stream
   */
  stopMicrophone(): void {
    this.isListening = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(track => track.stop());
      this.microphoneStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  /**
   * Check if the browser supports the Web Speech SpeechRecognition API
   */
  isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && Boolean(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Start speech recognition for teacher & tribal learner input
   */
  startSpeechRecognition(
    param: ((text: string, isFinal: boolean, interim?: string, rawFinalChunk?: string) => void) | SpeechRecognitionOptions,
    onErrorFallback?: (err: any) => void,
    defaultLang?: string
  ): boolean {
    if (!this.isSpeechRecognitionSupported()) {
      const err = new Error('Web Speech SpeechRecognition API is not supported in this browser');
      if (typeof param === 'function') {
        if (onErrorFallback) onErrorFallback(err);
      } else if (param.onError) {
        param.onError(err);
      }
      return false;
    }

    this.stopSpeechRecognition();

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognizer = new SpeechRecognition();

      let onResultCallback: (text: string, isFinal: boolean, interim: string, rawFinalChunk?: string) => void;
      let onErrorCallback: ((err: any) => void) | undefined;
      let onStartCallback: (() => void) | undefined;
      let onEndCallback: (() => void) | undefined;
      let lang = defaultLang || 'hi-IN';
      let continuous = true;
      let interimResults = true;
      let perSentenceMode = false;

      if (typeof param === 'function') {
        onResultCallback = (text, isFinal, interim, rawFinal) => param(text, isFinal, interim, rawFinal);
        onErrorCallback = onErrorFallback;
      } else {
        onResultCallback = param.onResult || (() => {});
        onErrorCallback = param.onError;
        onStartCallback = param.onStart;
        onEndCallback = param.onEnd;
        if (param.lang) lang = param.lang;
        if (param.continuous !== undefined) continuous = param.continuous;
        if (param.interimResults !== undefined) interimResults = param.interimResults;
        if (param.perSentenceMode !== undefined) perSentenceMode = param.perSentenceMode;
      }

      recognizer.continuous = continuous;
      recognizer.interimResults = interimResults;
      recognizer.lang = lang;
      recognizer.maxAlternatives = 1;

      this.isListening = true;
      let accumulatedFinalText = '';

      recognizer.onstart = () => {
        if (onStartCallback) onStartCallback();
      };

      recognizer.onresult = (event: any) => {
        let interimTranscript = '';
        let currentFinalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            currentFinalChunk += trans;
          } else {
            interimTranscript += trans;
          }
        }

        if (perSentenceMode) {
          const activeText = (currentFinalChunk || interimTranscript).trim();
          if (activeText) {
            onResultCallback(activeText, Boolean(currentFinalChunk), interimTranscript, currentFinalChunk.trim());
          }
        } else {
          if (currentFinalChunk) {
            accumulatedFinalText = (accumulatedFinalText + ' ' + currentFinalChunk).trim();
          }

          const combinedText = (accumulatedFinalText + ' ' + interimTranscript).trim();
          if (combinedText) {
            onResultCallback(combinedText, Boolean(currentFinalChunk), interimTranscript, currentFinalChunk.trim());
          }
        }
      };

      recognizer.onerror = (event: any) => {
        console.warn('SpeechRecognition event error:', event.error);
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          if (onErrorCallback) {
            onErrorCallback(event.error);
          }
        }
      };

      recognizer.onend = () => {
        if (this.isListening && continuous && this.speechRecognition === recognizer) {
          try {
            recognizer.start();
            return;
          } catch (reErr) {
            // ignore
          }
        }
        this.speechRecognition = null;
        if (onEndCallback) onEndCallback();
      };

      this.speechRecognition = recognizer;
      recognizer.start();
      return true;
    } catch (e) {
      console.warn('SpeechRecognition start error:', e);
      this.isListening = false;
      if (typeof param === 'function' && onErrorFallback) {
        onErrorFallback(e);
      } else if (typeof param === 'object' && param.onError) {
        param.onError(e);
      }
      return false;
    }
  }

  /**
   * Stop speech recognition
   */
  stopSpeechRecognition(): void {
    this.isListening = false;
    if (this.speechRecognition) {
      try {
        this.speechRecognition.abort();
      } catch (e) {
        // ignore
      }
      this.speechRecognition = null;
    }
  }

  abortSpeechRecognition(): void {
    this.stopSpeechRecognition();
  }

  /**
   * Downsample audio Float32 buffer from source sample rate to target (16k)
   */
  private downsampleBuffer(buffer: Float32Array, inputRate: number, outputRate: number = 16000): Float32Array {
    if (inputRate === outputRate || buffer.length === 0) return buffer;
    const ratio = inputRate / outputRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : buffer[Math.min(offsetBuffer, buffer.length - 1)];
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  /**
   * Start manual audio recording (push-to-talk or click-to-record)
   */
  async startAudioClipRecording(onAudioFrame?: (data: AudioVisualizerState) => void): Promise<boolean> {
    if (this.isRecordingClip) {
      await this.cancelAudioClipRecording();
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      this.activeRecCtx = ctx;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      this.activeRecStream = stream;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const scriptProcessor = ctx.createScriptProcessor(4096, 1, 1);
      this.activeRecProcessor = scriptProcessor;
      this.activeRecChunks = [];
      this.activeRecTotalSamples = 0;
      this.activeRecStartTime = Date.now();
      this.isRecordingClip = true;

      scriptProcessor.onaudioprocess = (e) => {
        if (!this.isRecordingClip) return;
        const channelData = e.inputBuffer.getChannelData(0);
        const copy = new Float32Array(channelData.length);
        copy.set(channelData);
        this.activeRecChunks.push(copy);
        this.activeRecTotalSamples += copy.length;
      };

      source.connect(scriptProcessor);
      scriptProcessor.connect(ctx.destination);

      if (onAudioFrame) {
        const bufferLen = analyser.frequencyBinCount;
        const freqArr = new Uint8Array(bufferLen);
        const timeArr = new Uint8Array(bufferLen);

        const frameTick = () => {
          if (!this.isRecordingClip) return;
          analyser.getByteFrequencyData(freqArr);
          analyser.getByteTimeDomainData(timeArr);

          let sum = 0;
          for (let i = 0; i < bufferLen; i++) {
            const v = (timeArr[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / bufferLen);
          onAudioFrame({ rms, freqData: freqArr });
          requestAnimationFrame(frameTick);
        };
        requestAnimationFrame(frameTick);
      }

      return true;
    } catch (err) {
      console.warn('Failed to start audio clip recording:', err);
      this.isRecordingClip = false;
      return false;
    }
  }

  /**
   * Stop manual audio recording and return Base64 + Audio URL + Duration
   */
  async stopAudioClipRecording(): Promise<{ base64: string; blob: Blob; url: string; durationSec: number }> {
    if (!this.isRecordingClip || !this.activeRecCtx) {
      throw new Error('No active recording in progress');
    }

    this.isRecordingClip = false;
    const ctx = this.activeRecCtx;
    const inputSampleRate = ctx.sampleRate;
    const stream = this.activeRecStream;
    const processor = this.activeRecProcessor;
    const durationSec = (Date.now() - this.activeRecStartTime) / 1000;

    if (processor) processor.disconnect();
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (ctx.state !== 'closed') await ctx.close();

    this.activeRecCtx = null;
    this.activeRecStream = null;
    this.activeRecProcessor = null;

    const merged = new Float32Array(this.activeRecTotalSamples);
    let offset = 0;
    for (const chunk of this.activeRecChunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    this.activeRecChunks = [];
    this.activeRecTotalSamples = 0;

    const downsampled = this.downsampleBuffer(merged, inputSampleRate, 16000);
    const wavBlob = this.encodeWavPcm16(downsampled, 16000);
    const audioUrl = URL.createObjectURL(wavBlob);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve({
          base64,
          blob: wavBlob,
          url: audioUrl,
          durationSec
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(wavBlob);
    });
  }

  /**
   * Cancel in-progress recording without processing
   */
  async cancelAudioClipRecording(): Promise<void> {
    this.isRecordingClip = false;
    if (this.activeRecProcessor) this.activeRecProcessor.disconnect();
    if (this.activeRecStream) this.activeRecStream.getTracks().forEach(t => t.stop());
    if (this.activeRecCtx && this.activeRecCtx.state !== 'closed') {
      await this.activeRecCtx.close();
    }
    this.activeRecCtx = null;
    this.activeRecStream = null;
    this.activeRecProcessor = null;
    this.activeRecChunks = [];
    this.activeRecTotalSamples = 0;
  }

  /**
   * Record a 16kHz Mono WAV audio clip with fixed timer and progress callback
   */
  async recordAudioClipAsWavBase64(
    durationMs: number = 3500,
    onProgress?: (progressPct: number, remainingMs: number) => void
  ): Promise<string> {
    await this.startAudioClipRecording();

    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, durationMs - elapsed);
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      if (onProgress) onProgress(pct, remaining);
    }, 100);

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        clearInterval(intervalId);
        try {
          const res = await this.stopAudioClipRecording();
          resolve(res.base64);
        } catch (e) {
          reject(e);
        }
      }, durationMs);
    });
  }

  /**
   * Helper: Encode raw Float32 audio samples into 16-bit Mono WAV format
   */
  private encodeWavPcm16(samples: Float32Array, sampleRate: number = 16000): Blob {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([view], { type: 'audio/wav' });
  }

  /**
   * Send recorded WAV audio to backend Vosk model for offline neural speech transcription
   */
  async transcribeAudioWithVosk(
    audioBase64: string,
    targetLang: string = 'sat_Olck'
  ): Promise<{ success: boolean; hindi_text: string; translated_text: string; confidence?: number; mode?: string; error?: string }> {
    try {
      const res = await fetch('/api/asr/transcribe_audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_base64: audioBase64,
          target_lang: targetLang,
          samplerate: 16000
        })
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, hindi_text: '', translated_text: '', error: `HTTP ${res.status}` };
    } catch (err: any) {
      return { success: false, hindi_text: '', translated_text: '', error: err?.message || 'Network error' };
    }
  }

  /**
   * Trigger direct hardware microphone recording on Python backend server
   */
  async recordServerHardwareMic(
    duration: number = 3.5,
    targetLang: string = 'sat_Olck'
  ): Promise<{ success: boolean; hindi_text: string; translated_text: string; error?: string }> {
    try {
      const res = await fetch('/api/asr/record_hardware_mic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration,
          target_lang: targetLang
        })
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, hindi_text: '', translated_text: '', error: `HTTP ${res.status}` };
    } catch (err: any) {
      return { success: false, hindi_text: '', translated_text: '', error: err?.message || 'Server mic recording error' };
    }
  }

  // =========================================================================
  // Web Speech Synthesis (TTS) - Resilient, Multi-Script & Offline-Ready
  // =========================================================================

  /**
   * Check if Web Speech API SpeechSynthesis is available in the current browser
   */
  isWebSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /**
   * Cancel any active or queued speech synthesis utterances safely
   */
  cancelSpeech(): void {
    if (this.isWebSpeechSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.activeUtterance = null;
  }

  stopSpeech(): void {
    this.cancelSpeech();
  }

  /**
   * Find the most acoustically suited voice for the given language tag
   */
  getBestVoiceForLang(langCode: string): SpeechSynthesisVoice | null {
    if (!this.isWebSpeechSupported()) return null;
    let voices = this.cachedVoices;
    if (!voices || voices.length === 0) {
      voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) this.cachedVoices = voices;
    }
    if (!voices || voices.length === 0) return null;

    const normalized = langCode.toLowerCase().replace('_', '-');

    // 1. Exact match (e.g. 'hi-IN', 'en-IN', 'or-IN')
    const exact = voices.find(v => v.lang.toLowerCase().replace('_', '-') === normalized);
    if (exact) return exact;

    // 2. Language prefix match (e.g. 'hi', 'en', 'or')
    const prefix = normalized.split('-')[0];
    const prefixMatch = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (prefixMatch) return prefixMatch;

    // 3. Indian accent voice fallback
    const indianVoice = voices.find(v => 
      v.lang.toLowerCase().includes('in') || 
      v.name.toLowerCase().includes('india') ||
      v.name.toLowerCase().includes('hindi')
    );
    if (indianVoice) return indianVoice;

    return voices[0] || null;
  }

  /**
   * Universal Speech Synthesis for Hindi, English, Santali, Ho, Mundari
   */
  async speakText(
    text: string,
    lang: TargetScript | SourceLang | string = 'hin_Deva',
    rateOrCb?: number | (() => void) | { rate?: number; pitch?: number; onStart?: () => void },
    onEndOrOpts?: (() => void) | { rate?: number; pitch?: number; onStart?: () => void },
    options?: { rate?: number; pitch?: number; onStart?: () => void }
  ): Promise<boolean> {
    if (!text || typeof window === 'undefined') return false;

    let rate = 0.88;
    let onEnd: (() => void) | undefined = undefined;
    let opts: { rate?: number; pitch?: number; onStart?: () => void } | undefined = options;

    if (typeof rateOrCb === 'number') {
      rate = rateOrCb;
    } else if (typeof rateOrCb === 'function') {
      onEnd = rateOrCb;
    } else if (typeof rateOrCb === 'object' && rateOrCb !== null) {
      opts = rateOrCb;
    }

    if (typeof onEndOrOpts === 'function') {
      onEnd = onEndOrOpts;
    } else if (typeof onEndOrOpts === 'object' && onEndOrOpts !== null) {
      opts = onEndOrOpts;
    }

    if (opts?.rate) rate = opts.rate;
    const pitch = opts?.pitch ?? 1.0;

    try {
      if (!this.isWebSpeechSupported()) {
        console.warn('SpeechSynthesis is not supported in this browser');
        if (onEnd) onEnd();
        return false;
      }

      // Unpause / resume SpeechSynthesis if browser has paused it
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      // Transliterate Ol Chiki characters to fluent phonetic Devanagari representation for Hindi/Indian TTS voices
      const hasOlChiki = /[\u1C50-\u1C7F]/.test(text);
      let textToSpeak = text;
      let targetLocale = 'hi-IN';

      if (hasOlChiki) {
        const transduced = transduceOlChikiToScripts(text);
        textToSpeak = transduced.sat_Deva || text;
        targetLocale = 'hi-IN';
      } else if (lang === 'eng_Latn' || (typeof lang === 'string' && lang.includes('eng'))) {
        targetLocale = 'en-IN';
      } else if (lang === 'sat_Orya') {
        targetLocale = 'or-IN';
      } else {
        targetLocale = 'hi-IN';
      }

      // Clean up string for TTS
      textToSpeak = textToSpeak.replace(/[|।]/g, ' ').trim();
      if (!textToSpeak) {
        if (onEnd) onEnd();
        return false;
      }

      // Cancel previous speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = targetLocale;
      utterance.rate = Math.max(0.4, Math.min(1.6, rate));
      utterance.pitch = Math.max(0.6, Math.min(1.4, pitch));

      const voice = this.getBestVoiceForLang(targetLocale);
      if (voice) {
        utterance.voice = voice;
      }

      if (options?.onStart) {
        utterance.onstart = () => {
          options.onStart?.();
        };
      }

      let hasFinished = false;
      const finish = () => {
        if (!hasFinished) {
          hasFinished = true;
          this.activeUtterance = null;
          if (onEnd) onEnd();
        }
      };

      utterance.onend = finish;
      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        finish();
      };

      // Keep utterance in persistent reference to prevent Chrome garbage-collection bug
      this.activeUtterance = utterance;

      // Small tick before speak to ensure cancel was processed cleanly
      setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.warn('SpeechSynthesis.speak failed, falling back to server TTS:', e);
          this.playServerTtsAudio(textToSpeak, targetLocale, onEnd);
        }
      }, 20);

      return true;
    } catch (e) {
      console.warn('speakText error, trying server TTS fallback:', e);
      return this.playServerTtsAudio(text, typeof lang === 'string' ? lang : 'sat_Olck', onEnd);
    }
  }

  private ttsAudioCache: Map<string, string> = new Map();

  /**
   * High-Fidelity Server/Local Audio Stream Player with Cache & Parameter Support
   */
  async playServerTtsAudio(
    text: string,
    lang: string = 'sat_Olck',
    onEnd?: () => void,
    options?: { pitch?: number; rate?: number }
  ): Promise<boolean> {
    try {
      const pitch = options?.pitch ?? 145.0;
      const speed = options?.rate ?? 1.0;
      const cacheKey = `${text}_${lang}_${pitch}_${speed}`;

      let url = this.ttsAudioCache.get(cacheKey);
      if (!url) {
        url = `/api/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}&pitch=${pitch}&speed=${speed}`;
      }

      const audio = new Audio(url);
      audio.onended = () => {
        if (onEnd) onEnd();
      };
      audio.onerror = (e) => {
        console.warn('Server TTS audio stream playback failed, falling back to Web Audio procedural synthesis:', e);
        this.synthesizeProceduralFormantAudio(text, lang, onEnd);
      };
      await audio.play();
      this.ttsAudioCache.set(cacheKey, url);
      return true;
    } catch (e) {
      console.warn('playServerTtsAudio failed, falling back to Web Audio procedural synthesis:', e);
      return this.synthesizeProceduralFormantAudio(text, lang, onEnd);
    }
  }

  /**
   * 100% Offline Client-Side Procedural 3-Formant Web Audio Acoustic Synthesizer
   */
  synthesizeProceduralFormantAudio(text: string, lang: string = 'sat_Olck', onEnd?: () => void): boolean {
    if (typeof window === 'undefined') {
      if (onEnd) onEnd();
      return false;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // Formant frequency definitions
      const formants: Record<string, [number, number, number, number]> = {
        'a': [780, 1250, 2600, 0.12],
        'i': [310, 2250, 3050, 0.10],
        'u': [340, 850, 2300, 0.10],
        'e': [520, 1850, 2750, 0.12],
        'o': [510, 920, 2450, 0.12],
        'k': [320, 1800, 2600, 0.05],
        't': [350, 1650, 2600, 0.05],
        'p': [260, 850, 2300, 0.05],
        'm': [260, 1100, 2300, 0.08],
        'n': [290, 1550, 2400, 0.08],
        's': [420, 3300, 4200, 0.08],
        'h': [650, 1450, 2600, 0.06],
        'sil': [0, 0, 0, 0.06]
      };

      // Simple token extraction
      const tokens = text.toLowerCase().split('');
      let now = ctx.currentTime;

      tokens.forEach((ch, idx) => {
        const ph = formants[ch] ? ch : (ch === ' ' ? 'sil' : 'a');
        const [f1, f2, f3, dur] = formants[ph];
        if (f1 > 0) {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc1.type = 'sawtooth';
          osc1.frequency.setValueAtTime(140 + (idx % 3) * 5, now);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(f1, now);

          gainNode.gain.setValueAtTime(0.01, now);
          gainNode.gain.linearRampToValueAtTime(0.2, now + dur * 0.2);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.95);

          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + dur);
          osc2.stop(now + dur);
        }
        now += dur;
      });

      setTimeout(() => {
        if (onEnd) onEnd();
      }, (now - ctx.currentTime) * 1000 + 50);

      return true;
    } catch (e) {
      console.warn('synthesizeProceduralFormantAudio failed:', e);
      if (onEnd) onEnd();
      return false;
    }
  }

  /**
   * High-Fidelity Phonetic Santali Speech Synthesis
   */
  async speakSantaliText(text: string, script: TargetScript = 'sat_Olck', onEnd?: () => void): Promise<boolean> {
    if (!text || typeof window === 'undefined') {
      if (onEnd) onEnd();
      return false;
    }

    try {
      // 1. Direct browser phonetic speech synthesis
      const spoke = await this.speakText(text, script, onEnd);
      if (spoke) return true;
    } catch (e) {
      console.warn('speakText failed, trying server TTS:', e);
    }

    // 2. Direct server audio fallback
    return await this.playServerTtsAudio(text, script, onEnd);
  }

  /**
   * Dedicated Web Speech API tribal word pronunciation method for flashcards and learning studios.
   */
  async speakTribalWord({
    word,
    phonetic,
    devaFallback,
    script = 'sat_Olck',
    language = 'santali',
    rate = 0.85,
    pitch = 1.05,
    onStart,
    onEnd,
    onError
  }: {
    word: string;
    phonetic?: string;
    devaFallback?: string;
    script?: TargetScript;
    language?: IndigenousLanguage;
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  }): Promise<boolean> {
    if (onStart) onStart();

    const hasOlChiki = /[\u1C50-\u1C7F]/.test(word);
    let textToSpeak = word;
    let targetLang = 'hin_Deva';

    if (hasOlChiki) {
      if (devaFallback) {
        textToSpeak = devaFallback;
      } else {
        const transduced = transduceOlChikiToScripts(word);
        textToSpeak = transduced.sat_Deva || (phonetic ? phonetic.replace(/[-–]/g, ' ') : word);
      }
      targetLang = 'hin_Deva';
    } else if (script === 'sat_Latn' && phonetic) {
      textToSpeak = phonetic.replace(/[-–]/g, ' ');
      targetLang = 'eng_Latn';
    } else if (devaFallback) {
      textToSpeak = devaFallback;
      targetLang = 'hin_Deva';
    }

    const success = await this.speakText(
      textToSpeak,
      targetLang,
      rate,
      () => {
        if (onEnd) onEnd();
      },
      {
        rate,
        pitch,
        onStart
      }
    );

    if (!success && onError) {
      onError(new Error('Speech playback failed'));
    }

    return success;
  }

  // =========================================================================
  // Procedural Web Audio API Synthesizers (100% Offline)
  // =========================================================================

  /**
   * Procedural Audio: Low-frequency Mandar Drum Beat (100% Offline Web Audio API)
   */
  playMandarDrumBeat(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      // silent
    }
  }

  /**
   * Procedural Audio: Victory Chime
   */
  playVictoryChime(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.4, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.38);
      });
    } catch (e) {
      // silent
    }
  }

  /**
   * Procedural Audio: Celebratory Tribal Fanfare for Badge & Digital Token Unlock
   * Uses pentatonic frequencies resonant with tribal flutes (Tirio) and Mandar bass.
   */
  playBadgeUnlockFanfare(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      // Deep Mandar resonant foundation
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(110, now);
      bassOsc.frequency.exponentialRampToValueAtTime(55, now + 0.5);
      bassGain.gain.setValueAtTime(0.7, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.65);

      // Ascending Tirio flute melody in Santali pentatonic scale (Sa, Re, Ga, Pa, Dha, Sa')
      const notes = [440, 523.25, 659.25, 783.99, 880, 1046.5, 1318.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.06 * idx);

        gain.gain.setValueAtTime(0.35, now + 0.06 * idx);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06 * idx + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + 0.06 * idx);
        osc.stop(now + 0.06 * idx + 0.45);
      });
    } catch (e) {
      // silent
    }
  }
}

export const speechEngine = new SpeechEngineService();

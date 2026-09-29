import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Activity,
  Play,
  Pause,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Edit3,
  Radio,
  Server,
  Cpu,
  AlertCircle,
  Loader2,
  VolumeX,
  Copy,
  Check,
  Languages,
  Clock,
  History,
  Trash2,
  Volume1,
  RefreshCw
} from 'lucide-react';
import { speechEngine, AudioVisualizerState } from '../engine/speechEngine';
import { translateText, translateTextAsync } from '../engine/nlpEngine';
import { TranslationResult, TargetScript, SourceLang } from '../types';

interface ArchivedSentence {
  id: string;
  hindi: string;
  translation: TranslationResult;
  timestamp: string;
}

export const SpeechStudio: React.FC<{ onNavigateToSaathi?: (text: string) => void }> = ({ onNavigateToSaathi }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeEngineMode, setActiveEngineMode] = useState<'web_speech' | 'vosk_offline_clip' | 'hardware_mic'>('web_speech');
  const [asrLanguage, setAsrLanguage] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [spokenText, setSpokenText] = useState('अपनी किताब खोलो');
  const [targetScript, setTargetScript] = useState<TargetScript>('sat_Olck');
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(() =>
    translateText('अपनी किताब खोलो', 'hin_Deva', 'sat_Olck')
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [rmsEnergy, setRmsEnergy] = useState(0);
  const [micStatusMessage, setMicStatusMessage] = useState<string>('Ready to speak in Hindi or English');
  const [isProcessingASR, setIsProcessingASR] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [lastRecordedAudioUrl, setLastRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecordedClip, setIsPlayingRecordedClip] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Auto-Refresh / Per-Sentence Mode Settings
  const [holdDurationSec, setHoldDurationSec] = useState<number>(3); // 2, 3, 5, or 0 (0 = never auto-refresh)
  const [autoSpeakOutput, setAutoSpeakOutput] = useState<boolean>(false);
  const [sentenceHistory, setSentenceHistory] = useState<ArchivedSentence[]>([]);
  const [autoRefreshProgress, setAutoRefreshProgress] = useState<number>(0); // 0 to 100%

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const freqDataRef = useRef<Uint8Array | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const refreshTimerRef = useRef<any>(null);
  const refreshProgressIntervalRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Keep references to latest state inside speech recognition callbacks
  const latestSpokenTextRef = useRef(spokenText);
  latestSpokenTextRef.current = spokenText;
  const latestTranslationRef = useRef(translationResult);
  latestTranslationRef.current = translationResult;
  const holdDurationSecRef = useRef(holdDurationSec);
  holdDurationSecRef.current = holdDurationSec;
  const autoSpeakOutputRef = useRef(autoSpeakOutput);
  autoSpeakOutputRef.current = autoSpeakOutput;
  const targetScriptRef = useRef(targetScript);
  targetScriptRef.current = targetScript;

  const HINDI_PRESET_PHRASES = [
    'अपनी किताब खोलो',
    'यह एक पेड़ है',
    'मेरे पास एक कलम है',
    'बैठ जाओ',
    'पानी पी लो',
    'आपका नाम क्या है',
    'हैलो, आप क्या कर रहे हो?',
    'चिड़िया गा रही है',
    'स्कूल में स्वागत है'
  ];

  const ENGLISH_PRESET_PHRASES = [
    'Open your book',
    'This is a tree',
    'I have a pen',
    'Sit down',
    'Drink water',
    'What is your name?',
    'Hello, what are you doing?',
    'The bird is singing',
    'Welcome to school'
  ];

  // Dynamic language switcher that live-reconfigures active speech recognizer
  const handleLanguageChange = (newLang: 'hi-IN' | 'en-IN') => {
    setAsrLanguage(newLang);
    const defaultPhrase = newLang === 'hi-IN' ? 'अपनी किताब खोलो' : 'Open your book';
    setSpokenText(defaultPhrase);
    setMicStatusMessage(newLang === 'hi-IN' ? 'Switched to Hindi voice input (हिन्दी).' : 'Switched to English voice input (English).');

    // If currently actively recording in Web Speech mode, seamlessly re-initialize recognizer with new language
    if (isRecording && activeEngineMode === 'web_speech') {
      speechEngine.stopSpeechRecognition();
      const isPerSentence = holdDurationSecRef.current > 0;
      speechEngine.startSpeechRecognition({
        lang: newLang,
        continuous: true,
        interimResults: true,
        perSentenceMode: isPerSentence,
        onResult: (text, isFinal, interim, rawFinalChunk) => {
          if (!text) return;
          if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
          }
          if (refreshProgressIntervalRef.current) {
            clearInterval(refreshProgressIntervalRef.current);
            refreshProgressIntervalRef.current = null;
          }
          setAutoRefreshProgress(0);

          setSpokenText(text);
          setMicStatusMessage(`Live Transcribed: "${text}"`);

          if (isFinal && isPerSentence) {
            scheduleSentenceAutoRefresh(rawFinalChunk || text);
          }
        },
        onError: (err) => {
          console.warn('Web Speech error:', err);
        }
      });
    }
  };

  // Auto-translate whenever spokenText, targetScript, or asrLanguage updates
  useEffect(() => {
    if (!spokenText.trim()) {
      setTranslationResult(null);
      return;
    }

    let isCancelled = false;
    // Auto-detect script: if text has Latin chars -> eng_Latn, if Devanagari -> hin_Deva
    const hasLatin = /[a-zA-Z]/.test(spokenText);
    const hasDeva = /[\u0900-\u097F]/.test(spokenText);
    const sourceLang: SourceLang = (hasLatin && !hasDeva) ? 'eng_Latn' : (hasDeva ? 'hin_Deva' : (asrLanguage === 'hi-IN' ? 'hin_Deva' : 'eng_Latn'));

    const localRes = translateText(spokenText, sourceLang, targetScript);
    setTranslationResult(localRes);

    translateTextAsync(spokenText, sourceLang, targetScript).then(res => {
      if (!isCancelled && res) {
        setTranslationResult(res);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [spokenText, targetScript, asrLanguage]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (refreshProgressIntervalRef.current) clearInterval(refreshProgressIntervalRef.current);
      speechEngine.stopMicrophone();
      speechEngine.stopSpeechRecognition();
    };
  }, []);

  // Helper to archive current sentence to history
  const archiveCurrentSentence = (text: string, translation: TranslationResult | null) => {
    if (!text.trim()) return;
    const finalTrans = translation || translateText(text, asrLanguage === 'hi-IN' ? 'hin_Deva' : 'eng_Latn', targetScriptRef.current);
    setSentenceHistory(prev => [
      {
        id: Math.random().toString(36).substring(2, 9),
        hindi: text.trim(),
        translation: finalTrans,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      },
      ...prev.slice(0, 19) // keep last 20 sentences
    ]);
  };

  // Schedule auto-refresh for completed sentence
  const scheduleSentenceAutoRefresh = (completedSentence: string) => {
    const duration = holdDurationSecRef.current;
    if (duration <= 0) return; // 0 means accumulate / manual

    // Clear previous timer
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (refreshProgressIntervalRef.current) clearInterval(refreshProgressIntervalRef.current);

    const startTime = Date.now();
    const durationMs = duration * 1000;
    setAutoRefreshProgress(100);

    // Smooth visual countdown
    refreshProgressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setAutoRefreshProgress(remainingPct);
    }, 50);

    // Auto-Speak if enabled
    if (autoSpeakOutputRef.current) {
      const trans = translateText(completedSentence, asrLanguage === 'hi-IN' ? 'hin_Deva' : 'eng_Latn', targetScriptRef.current);
      speechEngine.speakText(trans.transliterations?.sat_Latn || trans.translated_text, targetScriptRef.current);
    }

    refreshTimerRef.current = setTimeout(() => {
      if (refreshProgressIntervalRef.current) clearInterval(refreshProgressIntervalRef.current);
      setAutoRefreshProgress(0);

      // Archive and prepare for next sentence
      archiveCurrentSentence(completedSentence, latestTranslationRef.current);
      setSpokenText('');
      setTranslationResult(null);
      setMicStatusMessage('🟢 Ready for next sentence... Speak now!');
    }, durationMs);
  };

  // Visualizer Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isLive = isRecording;
      const currentRms = isLive ? Math.max(0.08, rmsEnergy) : 0.04;

      // Center baseline
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Sinusoidal waveform
      ctx.beginPath();
      ctx.lineWidth = isLive ? 3.5 : 1.5;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#10b981'); // emerald
      gradient.addColorStop(0.5, '#06b6d4'); // cyan
      gradient.addColorStop(1, '#f59e0b'); // amber
      ctx.strokeStyle = gradient;

      const slices = 120;
      const sliceWidth = width / slices;

      for (let i = 0; i <= slices; i++) {
        const x = i * sliceWidth;
        const freqAmp = freqDataRef.current ? (freqDataRef.current[i % freqDataRef.current.length] / 255) : 0.2;
        const amp = isLive ? (currentRms * 110 + freqAmp * 40) : Math.sin(phase + i * 0.1) * 6;
        const y = height / 2 + Math.sin(i * 0.15 + phase) * amp;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isLive ? 0.18 : 0.04;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRecording, rmsEnergy]);

  // Handle Recording Start / Stop
  const handleToggleRecord = async () => {
    if (isRecording) {
      // STOP RECORDING
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (refreshProgressIntervalRef.current) clearInterval(refreshProgressIntervalRef.current);
      setAutoRefreshProgress(0);

      if (activeEngineMode === 'web_speech') {
        speechEngine.stopMicrophone();
        speechEngine.stopSpeechRecognition();
        setIsRecording(false);
        setRmsEnergy(0);
        setMicStatusMessage('Recording stopped. Ready to speak again.');
      } else if (activeEngineMode === 'vosk_offline_clip') {
        try {
          setIsRecording(false);
          setIsProcessingASR(true);
          setMicStatusMessage('⚡ Processing audio with Vosk Offline Kaldi ASR...');

          const recorded = await speechEngine.stopAudioClipRecording();
          setLastRecordedAudioUrl(recorded.url);

          const result = await speechEngine.transcribeAudioWithVosk(recorded.base64, targetScript);
          setIsProcessingASR(false);

          if (result && result.hindi_text) {
            setSpokenText(result.hindi_text);
            setMicStatusMessage(`✅ Transcribed via Vosk: "${result.hindi_text}"`);
            if (holdDurationSecRef.current > 0) {
              scheduleSentenceAutoRefresh(result.hindi_text);
            }
          } else {
            setMicStatusMessage('No speech detected. Try speaking louder or closer to mic.');
          }
        } catch (err: any) {
          setIsRecording(false);
          setIsProcessingASR(false);
          setMicStatusMessage(`Processing note: ${err?.message || err}`);
        }
      }
      return;
    }

    // START RECORDING
    setRecordingSeconds(0);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    if (activeEngineMode === 'web_speech') {
      // 1. Continuous Live Web Speech Streaming with Per-Sentence Auto-Refresh
      setIsRecording(true);
      setMicStatusMessage('🔴 Listening continuously... Speak each sentence naturally.');
      speechEngine.playMandarDrumBeat();

      const startedMic = await speechEngine.startMicrophone((data: AudioVisualizerState) => {
        setRmsEnergy(data.rms);
        freqDataRef.current = data.freqData;
      });

      const isPerSentence = holdDurationSecRef.current > 0;

      const startedASR = speechEngine.startSpeechRecognition({
        lang: asrLanguage,
        continuous: true,
        interimResults: true,
        perSentenceMode: isPerSentence,
        onResult: (text, isFinal, interim, rawFinalChunk) => {
          if (!text) return;

          // If a new sentence starts while previous refresh timer was ticking, cancel previous timer
          if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
          }
          if (refreshProgressIntervalRef.current) {
            clearInterval(refreshProgressIntervalRef.current);
            refreshProgressIntervalRef.current = null;
          }
          setAutoRefreshProgress(0);

          setSpokenText(text);
          setMicStatusMessage(`Live Transcribed: "${text}"`);

          // When the sentence is finalized by the ASR engine
          if (isFinal && isPerSentence) {
            scheduleSentenceAutoRefresh(rawFinalChunk || text);
          }
        },
        onError: (err) => {
          console.warn('Web Speech error:', err);
          if (err === 'not-allowed') {
            setMicStatusMessage('⚠️ Microphone permission blocked. Please allow mic in browser address bar.');
          } else {
            setMicStatusMessage(`Mic status: ${err}. Still listening...`);
          }
        }
      });

      if (!startedMic && !startedASR) {
        setIsRecording(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setMicStatusMessage('Microphone permission not granted. Switched to Offline Vosk Clip Mode.');
        setActiveEngineMode('vosk_offline_clip');
      }
    } else if (activeEngineMode === 'vosk_offline_clip') {
      // 2. High-Fidelity Manual Audio Clip -> Offline Vosk Kaldi Neural Model
      try {
        setIsRecording(true);
        setMicStatusMessage('🔴 Recording audio... Click STOP when you finish speaking');
        speechEngine.playMandarDrumBeat();

        const started = await speechEngine.startAudioClipRecording((data: AudioVisualizerState) => {
          setRmsEnergy(data.rms);
          freqDataRef.current = data.freqData;
        });

        if (!started) {
          setIsRecording(false);
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          setMicStatusMessage('Failed to access microphone. Please verify mic connection.');
        }
      } catch (err: any) {
        setIsRecording(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setMicStatusMessage(`Microphone error: ${err?.message || err}`);
      }
    } else if (activeEngineMode === 'hardware_mic') {
      // 3. Direct Hardware Mic via Server sounddevice
      try {
        setIsRecording(true);
        setMicStatusMessage('🔴 Recording via PC Hardware Microphone (3.5s)...');
        speechEngine.playMandarDrumBeat();

        const res = await speechEngine.recordServerHardwareMic(3.5, targetScript);
        setIsRecording(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

        if (res && res.hindi_text) {
          setSpokenText(res.hindi_text);
          setMicStatusMessage(`✅ Hardware mic transcribed: "${res.hindi_text}"`);
          if (holdDurationSecRef.current > 0) {
            scheduleSentenceAutoRefresh(res.hindi_text);
          }
        } else {
          setMicStatusMessage('Hardware mic did not detect speech. Try speaking louder.');
        }
      } catch (err: any) {
        setIsRecording(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setMicStatusMessage(`Hardware mic error: ${err?.message || err}`);
      }
    }
  };

  const handlePresetSelect = (phrase: string) => {
    setSpokenText(phrase);
    speechEngine.playMandarDrumBeat();
    setMicStatusMessage(`Loaded preset: "${phrase}"`);
    if (holdDurationSec > 0 && isRecording) {
      scheduleSentenceAutoRefresh(phrase);
    }
  };

  const handleSpeakOutput = async (textToSpeak?: string) => {
    const text = textToSpeak || translationResult?.translated_text || translationResult?.transliterations?.sat_Latn;
    if (!text) return;
    setIsPlayingAudio(true);
    await speechEngine.speakSantaliText(
      text,
      targetScript,
      () => setIsPlayingAudio(false)
    );
  };

  const handleTogglePlayRecordedClip = () => {
    if (!lastRecordedAudioUrl) return;
    if (audioPlayerRef.current) {
      if (isPlayingRecordedClip) {
        audioPlayerRef.current.pause();
        setIsPlayingRecordedClip(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlayingRecordedClip(true);
      }
    }
  };

  const handleCopyText = (text?: string) => {
    const target = text || translationResult?.translated_text;
    if (!target) return;
    navigator.clipboard.writeText(target);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClearHistory = () => {
    setSentenceHistory([]);
  };

  // Signal level text helper
  const getSignalStatus = () => {
    if (!isRecording) return { label: 'Standby', color: 'text-slate-500' };
    if (rmsEnergy > 0.35) return { label: 'Strong Audio Signal', color: 'text-emerald-400' };
    if (rmsEnergy > 0.08) return { label: 'Good Voice Signal', color: 'text-cyan-400' };
    return { label: 'Low Audio / Whisper (Speak closer)', color: 'text-amber-400' };
  };

  const signal = getSignalStatus();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                Continuous Classroom Subtitle & Speech Engine
              </span>
              <span className="text-xs text-slate-400">Auto-Refreshes per sentence with Live History</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Real-Time Continuous Speech & Native Dialect Interpreter
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Teacher speaks naturally sentence-by-sentence — SurSetu displays the translation for a set hold duration, then smoothly advances to the next sentence.
            </p>
          </div>

          {/* Engine Mode Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                if (isRecording) handleToggleRecord();
                setActiveEngineMode('web_speech');
                setMicStatusMessage('Web Speech Live Streaming mode selected.');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeEngineMode === 'web_speech'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Continuous Live Mic</span>
            </button>

            <button
              onClick={() => {
                if (isRecording) handleToggleRecord();
                setActiveEngineMode('vosk_offline_clip');
                setMicStatusMessage('Offline Vosk Neural ASR mode selected.');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeEngineMode === 'vosk_offline_clip'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Offline Vosk ASR</span>
            </button>

            <button
              onClick={() => {
                if (isRecording) handleToggleRecord();
                setActiveEngineMode('hardware_mic');
                setMicStatusMessage('Server Hardware Microphone mode selected.');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeEngineMode === 'hardware_mic'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Hardware Mic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auto-Refresh Duration & Preferences Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sentence Hold Duration Picker */}
          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">Sentence Hold Duration:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {[
                { val: 2, label: '2s Fast' },
                { val: 3, label: '3s Standard' },
                { val: 5, label: '5s Extended' },
                { val: 0, label: 'Accumulate' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setHoldDurationSec(opt.val)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                    holdDurationSec === opt.val
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Audio Pronunciation Checkbox */}
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoSpeakOutput}
              onChange={(e) => setAutoSpeakOutput(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Volume1 className="w-3.5 h-3.5 text-emerald-400" />
              Auto-Speak Translation on Finish
            </span>
          </label>
        </div>

        {/* Input Language Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <Languages className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Teacher Voice:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => handleLanguageChange('hi-IN')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                asrLanguage === 'hi-IN' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              onClick={() => handleLanguageChange('en-IN')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                asrLanguage === 'en-IN' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Audio DSP Visualizer & Microphone Core */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-200">
                  Microphone Capture & Sensitivity Meter
                </span>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                isRecording ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse' :
                isProcessingASR ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-slate-800/90 text-slate-400 border border-slate-700'
              }`}>
                {isRecording ? `● LIVE RECORDING (${recordingSeconds}s)` : isProcessingASR ? '⚡ TRANSCRIBING...' : 'STANDBY'}
              </span>
            </div>

            {/* Canvas Visualizer with Real-Time RMS Waves */}
            <div className="relative w-full h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center">
              {/* RMS Energy Pulsating Glow */}
              {isRecording && (
                <>
                  <div
                    className="absolute rounded-full border border-emerald-500/30 transition-all duration-75 pointer-events-none"
                    style={{
                      width: `${Math.max(60, rmsEnergy * 340)}px`,
                      height: `${Math.max(60, rmsEnergy * 340)}px`,
                      boxShadow: '0 0 35px rgba(16, 185, 129, 0.3)'
                    }}
                  />
                  <div
                    className="absolute rounded-full border border-cyan-500/20 transition-all duration-75 pointer-events-none"
                    style={{
                      width: `${Math.max(40, rmsEnergy * 250)}px`,
                      height: `${Math.max(40, rmsEnergy * 250)}px`
                    }}
                  />
                </>
              )}

              <canvas
                ref={canvasRef}
                width={500}
                height={170}
                className="w-full h-full object-cover z-10"
              />

              {/* Live RMS & Audio Signal Quality readout */}
              <div className="absolute bottom-2 left-3 right-3 z-20 flex items-center justify-between text-[11px] font-mono">
                <span className={signal.color}>
                  {signal.label}
                </span>
                <span className="text-slate-500 text-[10px]">
                  Level: {(rmsEnergy * 100).toFixed(0)}% | 16kHz DSP
                </span>
              </div>
            </div>

            {/* Microphone Big Action Button & Status */}
            <div className="mt-5 flex flex-col items-center">
              <button
                onClick={handleToggleRecord}
                disabled={isProcessingASR}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer shadow-xl ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-500 text-white ring-8 ring-red-500/30 scale-105 animate-pulse'
                    : isProcessingASR
                    ? 'bg-amber-600 text-white cursor-wait ring-8 ring-amber-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-8 ring-emerald-500/20 hover:scale-105'
                }`}
                title={isRecording ? 'Click to stop recording' : 'Click to start speaking'}
              >
                {isProcessingASR ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : isRecording ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
                <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
                  {isProcessingASR ? 'ASR...' : isRecording ? 'Stop' : 'Speak'}
                </span>
              </button>

              {/* Status Message Text */}
              <div className="text-center text-xs text-slate-300 mt-3 font-medium flex items-center justify-center gap-1.5 max-w-md">
                <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`}></span>
                <span>{micStatusMessage}</span>
              </div>

              {/* Audio Playback Test for Recorded Clips */}
              {lastRecordedAudioUrl && (
                <div className="mt-3 flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <button
                    onClick={handleTogglePlayRecordedClip}
                    className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/40 transition cursor-pointer"
                    title="Play recorded audio clip"
                  >
                    {isPlayingRecordedClip ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-[11px] text-slate-400">Test Recorded Voice Clip</span>
                  <audio
                    ref={audioPlayerRef}
                    src={lastRecordedAudioUrl}
                    onEnded={() => setIsPlayingRecordedClip(false)}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Quick Test Presets */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                Or Tap Any Quick Classroom Instruction:
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {(asrLanguage === 'hi-IN' ? HINDI_PRESET_PHRASES : ENGLISH_PRESET_PHRASES).map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(phrase)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Sentence Display & Auto-Refresh Card */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Active Classroom Sentence
              </span>

              {/* Target Script Selector */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 mr-1">Target Script:</span>
                <select
                  value={targetScript}
                  onChange={(e) => setTargetScript(e.target.value as TargetScript)}
                  className="bg-slate-950 border border-slate-700 text-emerald-400 rounded-lg px-2 py-1 text-xs font-medium cursor-pointer"
                >
                  <option value="sat_Olck">Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)</option>
                  <option value="sat_Orya">Odia Script (ଓଡ଼ᱤଆ)</option>
                  <option value="sat_Deva">Devanagari (संताली)</option>
                  <option value="sat_Latn">Latin Roman</option>
                </select>
              </div>
            </div>

            {/* Teacher Input Box (Editable & Voice Synchronized) */}
            <div className="relative w-full">
              <textarea
                value={spokenText}
                onChange={(e) => setSpokenText(e.target.value)}
                placeholder={asrLanguage === 'hi-IN' ? "माइक्रोफ़ोन से हिन्दी में बोलें या टाइप करें..." : "Speak in English (e.g. 'Open your book') or type here..."}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-4 text-slate-100 text-base resize-none focus:outline-none transition leading-relaxed placeholder:text-slate-600 placeholder:italic"
              />
              <div className="absolute bottom-2.5 right-3 flex items-center gap-2">
                {spokenText && (
                  <button
                    onClick={() => {
                      if (spokenText) archiveCurrentSentence(spokenText, translationResult);
                      setSpokenText('');
                      setTranslationResult(null);
                    }}
                    className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition cursor-pointer flex items-center gap-1"
                    title="Next Sentence / Clear"
                  >
                    <RefreshCw className="w-3 h-3 text-emerald-400" />
                    <span>Next Sentence</span>
                  </button>
                )}
                <div className="text-[10px] text-slate-500 flex items-center gap-1 pointer-events-none">
                  <Edit3 className="w-3 h-3 text-slate-500" />
                  <span>Type or Speak</span>
                </div>
              </div>
            </div>

            {/* Auto-Refresh Hold Progress Bar */}
            {autoRefreshProgress > 0 && holdDurationSec > 0 && (
              <div className="mt-2">
                <div className="flex justify-between items-center text-[10px] text-emerald-400 font-mono mb-1">
                  <span>Advancing to next sentence in {(holdDurationSec * (autoRefreshProgress / 100)).toFixed(1)}s</span>
                  <span>{autoRefreshProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-75"
                    style={{ width: `${autoRefreshProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Translation Output Card */}
            {translationResult && (
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      Translated Tribal Instruction
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyText()}
                        className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Copy translation"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono">
                        ⚡ {translationResult.latency_ms} ms ({translationResult.mode})
                      </span>
                    </div>
                  </div>

                  {/* Primary Output Display */}
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-wide font-olchiki py-1 text-emerald-200">
                    {translationResult.translated_text}
                  </div>

                  {/* Phonetic Pronunciation & Odia script */}
                  <div className="mt-2 text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>
                      <strong className="text-slate-400">Phonetics:</strong> {translationResult.transliterations?.sat_Latn || translationResult.translated_text}
                    </span>
                    <span>
                      <strong className="text-slate-400">Odia:</strong> {translationResult.transliterations?.sat_Orya || ''}
                    </span>
                  </div>
                </div>

                {/* Audio Synthesis & Dialogue Actions */}
                <div className="flex flex-wrap gap-2.5 items-center">
                  <button
                    onClick={() => handleSpeakOutput()}
                    disabled={isPlayingAudio}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                    <span>{isPlayingAudio ? 'Playing Native Pronunciation...' : 'Play Tribal Audio Feedback'}</span>
                  </button>

                  {onNavigateToSaathi && (
                    <button
                      onClick={() => onNavigateToSaathi(spokenText)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>Ask SurSetu Saathi</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Provider: {translationResult?.provider || 'SurSetu 6-Layer Offline Edge'}</span>
            <span className="text-emerald-400 font-mono">RTF: 0.28 (Edge ASR)</span>
          </div>
        </div>
      </div>

      {/* Live Classroom Subtitle Stream History */}
      {sentenceHistory.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Live Classroom Dialogue History ({sentenceHistory.length} sentences spoken)
              </h3>
            </div>
            <button
              onClick={handleClearHistory}
              className="text-xs text-slate-400 hover:text-red-400 transition cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {sentenceHistory.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/30 rounded-xl p-3.5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {item.timestamp}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      "{item.hindi}"
                    </span>
                  </div>
                  <div className="text-base font-bold font-olchiki text-emerald-300 tracking-wide">
                    {item.translation.translated_text}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Phonetic: <span className="text-slate-300">{item.translation.transliterations?.sat_Latn || item.translation.translated_text}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleSpeakOutput(item.translation.transliterations?.sat_Latn || item.translation.translated_text)}
                    className="p-2 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/40 transition cursor-pointer"
                    title="Play pronunciation"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopyText(item.translation.translated_text)}
                    className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
                    title="Copy text"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

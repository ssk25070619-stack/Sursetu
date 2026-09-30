import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Copy,
  Check,
  Sparkles,
  ArrowRightLeft,
  BookMarked,
  Search,
  Layers,
  Compass,
  Mic,
  MicOff,
  AlertCircle,
  Globe,
  Languages
} from 'lucide-react';
import { translateText, translateTextAsync, classifyMayurbhanjOdiaSantali } from '../engine/nlpEngine';
import { speechEngine } from '../engine/speechEngine';
import {
  TargetScript,
  SourceLang,
  TranslationResult,
  MayurbhanjLIDResult,
  IndigenousLanguage
} from '../types';

export const TranslationHub: React.FC<{ language?: IndigenousLanguage }> = ({
  language = 'english'
}) => {
  // Target Indigenous/English Language State
  const [targetLang, setTargetLang] = useState<IndigenousLanguage>(language);
  const [inputText, setInputText] = useState('यह एक पेड़ है');
  const [sourceLang, setSourceLang] = useState<SourceLang>('hin_Deva');

  // Derive initial target script from target language
  const getDefaultScript = (lang: IndigenousLanguage): TargetScript => {
    switch (lang) {
      case 'english':
        return 'eng_Latn';
      case 'ho':
        return 'ho_Wara';
      case 'mundari':
        return 'mun_Bani';
      case 'santali':
      default:
        return 'sat_Olck';
    }
  };

  const [targetScript, setTargetScript] = useState<TargetScript>(getDefaultScript(language));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sync when top-level language prop changes
  useEffect(() => {
    if (language) {
      setTargetLang(language);
      setTargetScript(getDefaultScript(language));
    }
  }, [language]);

  // Real-time Voice-to-Text SpeechRecognition States
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Mayurbhanj LID test state
  const [lidInput, setLidInput] = useState('ଆମ ଓଲଗ ପଢ଼ହବ ଏମ ବଦୟ ସେ ?');
  const [lidResult, setLidResult] = useState<MayurbhanjLIDResult | null>(null);

  // Stop speech recognition when unmounting
  useEffect(() => {
    return () => {
      speechEngine.stopSpeechRecognition();
    };
  }, []);

  // Async Translation with 0ms sync fallback
  const [result, setResult] = useState<TranslationResult>(() =>
    translateText(inputText, sourceLang, targetScript, targetLang)
  );

  useEffect(() => {
    let isCancelled = false;
    const syncRes = translateText(inputText, sourceLang, targetScript, targetLang);
    setResult(syncRes);

    translateTextAsync(inputText, sourceLang, targetScript, targetLang).then((res) => {
      if (!isCancelled && res) {
        setResult(res);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [inputText, sourceLang, targetScript, targetLang]);

  // Handle target language change
  const handleSelectTargetLang = (newLang: IndigenousLanguage) => {
    setTargetLang(newLang);
    const newScript = getDefaultScript(newLang);
    setTargetScript(newScript);
  };

  // Swap Source and Target Language
  const handleSwapLanguages = () => {
    if (sourceLang === 'hin_Deva') {
      setSourceLang('eng_Latn');
      if (targetLang === 'english') {
        setTargetLang('santali');
        setTargetScript('sat_Olck');
      }
    } else {
      setSourceLang('hin_Deva');
    }
  };

  // Toggle voice recognition
  const handleToggleVoiceInput = () => {
    if (isListening) {
      speechEngine.stopSpeechRecognition();
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    setSpeechError(null);
    setInterimTranscript('');

    const targetLangCode = sourceLang === 'hin_Deva' ? 'hi-IN' : 'en-IN';

    const started = speechEngine.startSpeechRecognition({
      lang: targetLangCode,
      continuous: true,
      interimResults: true,
      onStart: () => {
        setIsListening(true);
        speechEngine.playMandarDrumBeat();
      },
      onResult: (text, isFinal, interim) => {
        setInterimTranscript(interim);
        if (text) {
          setInputText(text);
        }
      },
      onError: (err) => {
        console.warn('SpeechRecognition error in TranslationHub:', err);
        setIsListening(false);
        setInterimTranscript('');
        if (err === 'not-allowed') {
          setSpeechError(
            'Microphone permission was denied. Please allow microphone access in browser settings.'
          );
        } else if (err === 'no-speech') {
          setSpeechError('No speech detected. Please speak closer to your microphone.');
        } else {
          setSpeechError(`Voice input issue: ${err}`);
        }
        setTimeout(() => setSpeechError(null), 4500);
      },
      onEnd: () => {
        setIsListening(false);
        setInterimTranscript('');
      }
    });

    if (!started) {
      setSpeechError(
        'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.'
      );
      setTimeout(() => setSpeechError(null), 4500);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSpeak = async (text: string, script: TargetScript) => {
    if (!text) return;
    setIsSpeaking(true);
    if (script === 'eng_Latn') {
      await speechEngine.speakText(text, 'eng_Latn');
    } else {
      await speechEngine.speakSantaliText(text, script);
    }
    setTimeout(() => setIsSpeaking(false), 1200);
  };

  const handleRunLID = () => {
    const res = classifyMayurbhanjOdiaSantali(lidInput);
    setLidResult(res);
  };

  // Get script display class
  const getScriptFontClass = (script: TargetScript): string => {
    switch (script) {
      case 'sat_Olck':
        return 'font-olchiki';
      case 'sat_Orya':
        return 'font-odia';
      case 'sat_Deva':
      case 'ho_Deva':
      case 'mun_Deva':
        return 'font-deva';
      default:
        return 'font-sans';
    }
  };

  // Quick canonical phrases
  const quickExamples = [
    { label: 'This is a tree', src: 'eng_Latn' as SourceLang },
    { label: 'यह एक पेड़ है', src: 'hin_Deva' as SourceLang },
    { label: 'Open your book', src: 'eng_Latn' as SourceLang },
    { label: 'अपनी किताब खोलो', src: 'hin_Deva' as SourceLang },
    { label: 'I have a pen', src: 'eng_Latn' as SourceLang },
    { label: 'स्कूल में स्वागत है', src: 'hin_Deva' as SourceLang },
    { label: 'The bird is singing', src: 'eng_Latn' as SourceLang },
    { label: 'पानी', src: 'hin_Deva' as SourceLang }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider border border-teal-500/30">
                SurSetu Universal Multi-Language Engine
              </span>
              <span className="text-xs text-slate-400">100% Offline Edge • Zero Latency</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Languages className="w-6 h-6 text-emerald-400" />
              Multilingual Indigenous Translation Hub
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Authentic grammar, vocabulary, and indigenous scripts for{' '}
              <strong className="text-teal-300">English (Default)</strong>,{' '}
              <strong className="text-emerald-300">Santali (Ol Chiki)</strong>,{' '}
              <strong className="text-amber-300">Ho (Warang Citi)</strong>, and{' '}
              <strong className="text-cyan-300">Mundari (Mundari Bani)</strong>.
            </p>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Test Sentences:
            </span>
            <div className="flex flex-wrap gap-1.5 max-w-xs">
              {quickExamples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(ex.label);
                    setSourceLang(ex.src);
                  }}
                  className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white transition cursor-pointer border border-slate-700/50"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Target Language Selection Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Choose Target Language:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* English Button */}
            <button
              onClick={() => handleSelectTargetLang('english')}
              className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                targetLang === 'english'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-md shadow-blue-950/50 ring-2 ring-blue-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <span>🌐</span>
              <span>English (Default)</span>
            </button>

            {/* Santali Button */}
            <button
              onClick={() => handleSelectTargetLang('santali')}
              className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                targetLang === 'santali'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-950/50 ring-2 ring-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <span>🌿</span>
              <span>Santali (ᱥᱟᱱᱛᱟᱲᱤ)</span>
            </button>

            {/* Ho Button */}
            <button
              onClick={() => handleSelectTargetLang('ho')}
              className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                targetLang === 'ho'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400 shadow-md shadow-amber-950/50 ring-2 ring-amber-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <span>🏹</span>
              <span>Ho (𑢹𑣉 / हो)</span>
            </button>

            {/* Mundari Button */}
            <button
              onClick={() => handleSelectTargetLang('mundari')}
              className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                targetLang === 'mundari'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-teal-400 shadow-md shadow-teal-950/50 ring-2 ring-teal-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <span>🌾</span>
              <span>Mundari (𞓚𞓟𞓗𞓘𞓒𞓙)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Translation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Input Column */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
                Source Input Language
              </label>

              <div className="flex items-center gap-2">
                {/* Voice-to-Text Microphone Button */}
                <button
                  onClick={handleToggleVoiceInput}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-900/40 border border-red-400'
                      : 'bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  }`}
                  title={
                    isListening
                      ? 'Click to stop listening'
                      : 'Click to speak via Web SpeechRecognition API'
                  }
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Speak ({sourceLang === 'hin_Deva' ? 'बोलें' : 'Speak'})</span>
                    </>
                  )}
                </button>

                {/* Source Language Switcher */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => {
                      setSourceLang('hin_Deva');
                      if (isListening) handleToggleVoiceInput();
                    }}
                    className={`px-2.5 py-1 rounded transition cursor-pointer ${
                      sourceLang === 'hin_Deva'
                        ? 'bg-emerald-600 text-white font-medium shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Hindi (हिंदी)
                  </button>
                  <button
                    onClick={() => {
                      setSourceLang('eng_Latn');
                      if (isListening) handleToggleVoiceInput();
                    }}
                    className={`px-2.5 py-1 rounded transition cursor-pointer ${
                      sourceLang === 'eng_Latn'
                        ? 'bg-emerald-600 text-white font-medium shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            {/* Real-time Voice-to-Text Listening Banner */}
            {isListening && (
              <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-red-950/70 via-slate-950 to-red-950/70 border border-red-500/40 flex items-center justify-between text-xs animate-fade-in shadow-inner">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="flex items-end gap-0.5 h-3.5 shrink-0">
                    <span className="w-1 bg-red-400 rounded-full animate-pulse h-3" />
                    <span className="w-1 bg-amber-400 rounded-full animate-pulse h-3.5 delay-75" />
                    <span className="w-1 bg-red-400 rounded-full animate-pulse h-2 delay-150" />
                  </div>
                  <span className="text-red-300 font-semibold shrink-0">
                    Listening ({sourceLang === 'hin_Deva' ? 'hi-IN' : 'en-IN'}):
                  </span>
                  <span className="text-white italic truncate font-mono">
                    {interimTranscript ? `"${interimTranscript}"` : 'Awaiting speech input...'}
                  </span>
                </div>
                <button
                  onClick={handleToggleVoiceInput}
                  className="px-2.5 py-1 rounded-md bg-red-800 hover:bg-red-700 text-white text-[11px] font-bold uppercase transition cursor-pointer shrink-0 ml-2"
                >
                  Done
                </button>
              </div>
            )}

            {/* Speech error indicator */}
            {speechError && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{speechError}</span>
              </div>
            )}

            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter Hindi or English sentence or phrase here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none text-base font-medium"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Character count: {inputText.length}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSwapLanguages}
                className="text-slate-400 hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
                title="Swap source language"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Toggle Source</span>
              </button>
              <button
                onClick={() => setInputText('')}
                className="text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Target Output Column */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Target Translation: <strong className="text-white capitalize">{targetLang}</strong>
                </span>
              </label>

              {/* Dynamic Script Sub-selector */}
              <select
                value={targetScript}
                onChange={(e) => setTargetScript(e.target.value as TargetScript)}
                className="bg-slate-950 border border-slate-700 text-emerald-300 rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer focus:ring-1 focus:ring-emerald-400"
              >
                {targetLang === 'english' && (
                  <option value="eng_Latn">English (Standard Latin Script)</option>
                )}

                {targetLang === 'santali' && (
                  <>
                    <option value="sat_Olck">Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ) — Primary</option>
                    <option value="sat_Orya">Odia Script (ଓଡ଼ିଆ)</option>
                    <option value="sat_Deva">Devanagari (संताली)</option>
                    <option value="sat_Latn">Latin Phonetic</option>
                  </>
                )}

                {targetLang === 'ho' && (
                  <>
                    <option value="ho_Wara">Warang Citi (𑢹𑣉 𑢵𑢫𑢶) — Lako Bodra Native</option>
                    <option value="ho_Deva">Devanagari (हो भाषा)</option>
                    <option value="ho_Latn">Latin Phonetic (Ho)</option>
                  </>
                )}

                {targetLang === 'mundari' && (
                  <>
                    <option value="mun_Bani">Mundari Bani (𞓚𞓟𞓗𞓘𞓒𞓙) — Rohidas Singh Nag</option>
                    <option value="mun_Deva">Devanagari (मुंडारी भाषा)</option>
                    <option value="mun_Latn">Latin Phonetic (Mundari)</option>
                  </>
                )}
              </select>
            </div>

            {/* Primary Translation Box */}
            <div className="w-full min-h-[110px] bg-slate-950 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-center">
              <div
                className={`text-2xl sm:text-3xl font-bold text-white tracking-wide text-emerald-300 ${getScriptFontClass(
                  targetScript
                )}`}
              >
                {result.translated_text || '—'}
              </div>

              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
                <span>
                  <strong className="text-slate-500">Phonetics / Romanized:</strong>{' '}
                  <span className="text-slate-300 font-mono">
                    {targetLang === 'english'
                      ? result.translated_text
                      : targetLang === 'ho'
                      ? result.transliterations.ho_Deva
                      : targetLang === 'mundari'
                      ? result.transliterations.mun_Deva
                      : result.transliterations.sat_Latn}
                  </span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  Target: {targetLang.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSpeak(result.translated_text, targetScript)}
                disabled={isSpeaking || !result.translated_text}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer shadow-sm shadow-emerald-950/40"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeaking ? 'Speaking...' : 'Pronounce'}</span>
              </button>

              <button
                onClick={() => handleCopy(result.translated_text, 'primary')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              >
                {copiedKey === 'primary' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedKey === 'primary' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Latency: <span className="text-emerald-400 font-bold">{result.latency_ms} ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Language Synchronized Parallel Translation Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowRightLeft className="w-4.5 h-4.5 text-teal-400" />
              Synchronized 4-Language Parallel Translation Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Parallel translations across all indigenous languages and their dedicated native scripts.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono">
            4 Languages • 8 Scripts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: English (Classroom Default) */}
          <div
            className={`p-4 rounded-xl border transition flex flex-col justify-between ${
              targetLang === 'english'
                ? 'bg-blue-950/40 border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
                : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-blue-400 flex items-center gap-1.5">
                  <span>🌐</span> English (Default)
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      result.transliterations.eng_Latn || result.english_equivalent || '',
                      'eng'
                    )
                  }
                  className="text-slate-500 hover:text-slate-300 text-[11px] cursor-pointer"
                >
                  {copiedKey === 'eng' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="text-base font-semibold text-white">
                {result.transliterations.eng_Latn || result.english_equivalent || '—'}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Standard Pan-Indian Medium</span>
              <button
                onClick={() => handleSpeak(result.transliterations.eng_Latn || '', 'eng_Latn')}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Listen
              </button>
            </div>
          </div>

          {/* Card 2: Santali (Ol Chiki & Odia) */}
          <div
            className={`p-4 rounded-xl border transition flex flex-col justify-between ${
              targetLang === 'santali'
                ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>🌿</span> Santali (ᱥᱟᱱᱛᱟᱲᱤ)
                </span>
                <button
                  onClick={() => handleCopy(result.transliterations.sat_Olck, 'sat_olck')}
                  className="text-slate-500 hover:text-slate-300 text-[11px] cursor-pointer"
                >
                  {copiedKey === 'sat_olck' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="text-lg font-bold text-emerald-300 font-olchiki">
                {result.transliterations.sat_Olck || '—'}
              </div>
              <div className="mt-1.5 text-xs text-slate-300 font-odia">
                ଓଡ଼ିଆ: {result.transliterations.sat_Orya}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Deva: {result.transliterations.sat_Deva}</span>
              <button
                onClick={() => handleSpeak(result.transliterations.sat_Olck, 'sat_Olck')}
                className="text-emerald-400 hover:underline cursor-pointer"
              >
                Listen
              </button>
            </div>
          </div>

          {/* Card 3: Ho (Warang Citi & Devanagari) */}
          <div
            className={`p-4 rounded-xl border transition flex flex-col justify-between ${
              targetLang === 'ho'
                ? 'bg-amber-950/40 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span>🏹</span> Ho (𑢹𑣉 / हो)
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      result.transliterations.ho_Wara || result.transliterations.ho_Deva || '',
                      'ho'
                    )
                  }
                  className="text-slate-500 hover:text-slate-300 text-[11px] cursor-pointer"
                >
                  {copiedKey === 'ho' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="text-lg font-bold text-amber-300 font-mono tracking-wide">
                {result.transliterations.ho_Wara || result.transliterations.ho_Deva || '—'}
              </div>
              <div className="mt-1.5 text-xs text-slate-300 font-deva">
                देवनागरी: {result.transliterations.ho_Deva || result.ho_equivalent}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Warang Citi (Lako Bodra)</span>
              <button
                onClick={() => handleSpeak(result.transliterations.ho_Deva || '', 'ho_Deva')}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Listen
              </button>
            </div>
          </div>

          {/* Card 4: Mundari (Mundari Bani & Devanagari) */}
          <div
            className={`p-4 rounded-xl border transition flex flex-col justify-between ${
              targetLang === 'mundari'
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span>🌾</span> Mundari (𞓚𞓟𞓗𞓘𞓒𞓙)
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      result.transliterations.mun_Bani || result.transliterations.mun_Deva || '',
                      'mun'
                    )
                  }
                  className="text-slate-500 hover:text-slate-300 text-[11px] cursor-pointer"
                >
                  {copiedKey === 'mun' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="text-lg font-bold text-cyan-300 font-mono tracking-wide">
                {result.transliterations.mun_Bani || result.transliterations.mun_Deva || '—'}
              </div>
              <div className="mt-1.5 text-xs text-slate-300 font-deva">
                देवनागरी: {result.transliterations.mun_Deva || result.mundari_equivalent}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Mundari Bani (Rohidas Nag)</span>
              <button
                onClick={() => handleSpeak(result.transliterations.mun_Deva || '', 'mun_Deva')}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                Listen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Engine Diagnostic & Linguistic Pipeline Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Layer Diagnostics */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-200">
                Inference Path & Grammar Synthesizer
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Activated Mode:</span>
                <span className="font-mono text-emerald-300 font-semibold">{result.mode}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 mb-0.5 font-medium">Linguistic Explanation:</div>
                <div className="text-slate-300 leading-relaxed">{result.explanation}</div>
              </div>

              {result.postpositions_applied && result.postpositions_applied.length > 0 && (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 mb-0.5 font-medium">Agglutinated Postpositions:</div>
                  <div className="text-amber-300 font-mono">
                    {result.postpositions_applied.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Confidence: {(result.confidence * 100).toFixed(0)}%</span>
            <span className="text-emerald-400 font-medium">Verified FLN Ground Truth</span>
          </div>
        </div>

        {/* Mayurbhanj Language Identifier (LID: sat vs ori) Tool */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Mayurbhanj Language Identifier (LID: sat vs ori)
                </h3>
              </div>
              <button
                onClick={handleRunLID}
                className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <Search className="w-3 h-3" />
                <span>Classify</span>
              </button>
            </div>

            <textarea
              rows={2}
              value={lidInput}
              onChange={(e) => setLidInput(e.target.value)}
              placeholder="Paste Odia script text here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 text-xs font-odia focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none"
            />

            <div className="mt-1 flex gap-2 text-[10px]">
              <button
                onClick={() => setLidInput('ଆମ ଓଲଗ ପଢ଼ହବ ଏମ ବଦୟ ସେ ?')}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Sample 1 (Santali in Odia)
              </button>
              <button
                onClick={() =>
                  setLidInput('ଏହି ବିଦ୍ୟାଳୟରେ ପିଲାମାନେ ପଢୁଛନ୍ତି ଏବଂ ସେଠାରେ ଶିକ୍ଷକ ଅଛନ୍ତି।')
                }
                className="text-teal-400 hover:underline cursor-pointer"
              >
                Sample 2 (Standard Odia)
              </button>
            </div>

            {lidResult && (
              <div className="mt-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Classification:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      lidResult.detected_language === 'sat'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    }`}
                  >
                    {lidResult.language_name}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">{lidResult.explanation}</div>
              </div>
            )}
          </div>

          <div className="pt-2 text-[11px] text-slate-500">
            Dossier Page 12 • Resolves script vs language ambiguity
          </div>
        </div>
      </div>
    </div>
  );
};

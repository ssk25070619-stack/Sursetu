import React, { useState, useEffect } from 'react';
import { Volume2, Copy, Check, Sparkles, ArrowRightLeft, BookMarked, Search, Layers, Compass, Mic, MicOff, AlertCircle } from 'lucide-react';
import { translateText, translateTextAsync, classifyMayurbhanjOdiaSantali } from '../engine/nlpEngine';
import { speechEngine } from '../engine/speechEngine';
import { TargetScript, SourceLang, TranslationResult, MayurbhanjLIDResult, IndigenousLanguage } from '../types';

export const TranslationHub: React.FC<{ language?: IndigenousLanguage }> = ({ language = 'santali' }) => {
  const [inputText, setInputText] = useState('This is a tree');
  const [sourceLang, setSourceLang] = useState<SourceLang>('eng_Latn');
  const [targetScript, setTargetScript] = useState<TargetScript>(
    language === 'ho' ? 'sat_Deva' : language === 'mundari' ? 'sat_Deva' : 'sat_Olck'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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
    translateText(inputText, sourceLang, targetScript)
  );

  useEffect(() => {
    let isCancelled = false;
    setResult(translateText(inputText, sourceLang, targetScript));

    translateTextAsync(inputText, sourceLang, targetScript).then(res => {
      if (!isCancelled && res) {
        setResult(res);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [inputText, sourceLang, targetScript]);

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
          setSpeechError('Microphone permission was denied. Please allow microphone access in browser settings.');
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
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
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
    await speechEngine.speakSantaliText(text, script);
    setTimeout(() => setIsSpeaking(false), 1200);
  };

  const handleRunLID = () => {
    const res = classifyMayurbhanjOdiaSantali(lidInput);
    setLidResult(res);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/30 to-slate-900 border border-teal-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider border border-teal-500/30">
                6-Layer Hybrid Inference
              </span>
              <span className="text-xs text-slate-400">Zero Internet Required (0ms Local Loopback)</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Grammar-Aware Multi-Script Linguistic Engine
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Handles Austroasiatic vs Indo-Aryan syntactic divergence (SVO to SOV), agglutinative postpositions (-re, -khon, -lagid), and multi-script transliteration.
            </p>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap gap-1.5 max-w-xs">
            {[
              { label: 'This is a tree', src: 'eng_Latn' as SourceLang },
              { label: 'अपनी किताब खोलो', src: 'hin_Deva' as SourceLang },
              { label: 'I have a pen', src: 'eng_Latn' as SourceLang },
              { label: 'स्कूल में स्वागत है', src: 'hin_Deva' as SourceLang }
            ].map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputText(ex.label);
                  setSourceLang(ex.src);
                }}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white transition cursor-pointer"
              >
                {ex.label}
              </button>
            ))}
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
                Source Classroom Language
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
                  title={isListening ? 'Click to stop listening' : 'Click to speak via Web SpeechRecognition API'}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 animate-bounce-short" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Speak ({sourceLang === 'hin_Deva' ? 'बोलें' : 'Speak'})</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => {
                      setSourceLang('hin_Deva');
                      if (isListening) handleToggleVoiceInput();
                    }}
                    className={`px-2.5 py-1 rounded transition cursor-pointer ${
                      sourceLang === 'hin_Deva' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400'
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
                      sourceLang === 'eng_Latn' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400'
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none text-base"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Character count: {inputText.length}</span>
            <button
              onClick={() => setInputText('')}
              className="text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Target Output Column */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Target Indigenous Translation
              </label>

              <select
                value={targetScript}
                onChange={(e) => setTargetScript(e.target.value as TargetScript)}
                className="bg-slate-950 border border-slate-700 text-emerald-300 rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer"
              >
                <option value="sat_Olck">Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)</option>
                <option value="sat_Orya">Odia Script (ଓଡ଼ିଆ)</option>
                <option value="sat_Deva">Devanagari (संताली)</option>
                <option value="sat_Latn">Latin Phonetic</option>
              </select>
            </div>

            {/* Primary Translation Box */}
            <div className="w-full min-h-[105px] bg-slate-950 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-center">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-wide font-olchiki text-emerald-300">
                {result.translated_text || '—'}
              </div>

              <div className="mt-2 text-xs text-slate-400 flex items-center gap-3">
                <span>
                  <strong className="text-slate-500">Pronunciation:</strong> {result.transliterations.sat_Latn}
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeaking ? 'Playing...' : 'Pronounce'}</span>
              </button>

              <button
                onClick={() => handleCopy(result.translated_text, 'primary')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              >
                {copiedKey === 'primary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'primary' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Latency: <span className="text-emerald-400 font-bold">{result.latency_ms} ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Layer Engine Breakdown & Multi-Script Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Layer 6: Multi-Script Transliteration Matrix */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              Layer 6: Deep Phonetic Multi-Script Transduction
            </h3>
            <span className="text-[11px] text-slate-400">Synchronized across 4 scripts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Ol Chiki */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-[11px] text-amber-400 mb-1">
                <span className="font-semibold">Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)</span>
                <button
                  onClick={() => handleCopy(result.transliterations.sat_Olck, 'olck')}
                  className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {copiedKey === 'olck' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="text-lg font-bold text-white font-olchiki">
                {result.transliterations.sat_Olck}
              </div>
            </div>

            {/* Odia Script */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-[11px] text-teal-400 mb-1">
                <span className="font-semibold">Odia Script (ଓଡ଼ିଆ)</span>
                <button
                  onClick={() => handleCopy(result.transliterations.sat_Orya, 'orya')}
                  className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {copiedKey === 'orya' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="text-lg font-bold text-white font-odia">
                {result.transliterations.sat_Orya}
              </div>
            </div>

            {/* Devanagari */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-[11px] text-emerald-400 mb-1">
                <span className="font-semibold">Devanagari (देवनागरी संताली)</span>
                <button
                  onClick={() => handleCopy(result.transliterations.sat_Deva, 'deva')}
                  className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {copiedKey === 'deva' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="text-lg font-bold text-white font-deva">
                {result.transliterations.sat_Deva}
              </div>
            </div>

            {/* Roman Latin */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-[11px] text-cyan-400 mb-1">
                <span className="font-semibold">Roman Latin Phonetics</span>
                <button
                  onClick={() => handleCopy(result.transliterations.sat_Latn, 'latn')}
                  className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {copiedKey === 'latn' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="text-lg font-bold text-white font-mono text-sm">
                {result.transliterations.sat_Latn}
              </div>
            </div>
          </div>

          {/* Sibling Dialects */}
          <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className={language === 'ho' ? 'text-amber-300 font-semibold px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 shadow-sm' : ''}>
              <strong className="text-amber-300">🏹 Ho Dialect:</strong> {result.ho_equivalent || 'मियाद दारू तना'}
            </span>
            <span className={language === 'mundari' ? 'text-teal-300 font-semibold px-2 py-1 rounded-lg bg-teal-500/20 border border-teal-500/40 shadow-sm' : ''}>
              <strong className="text-teal-300">🌾 Mundari:</strong> {result.mundari_equivalent || 'मियाद दारू तना'}
            </span>
            {language === 'santali' && (
              <span className="text-emerald-300 font-semibold px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 shadow-sm">
                <strong>🌿 Santali Primary:</strong> {result.transliterations.sat_Olck}
              </span>
            )}
          </div>
        </div>

        {/* Engine Diagnostic & Applied Layer */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-200">
                Inference Path & Grammar Resolution
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 mb-0.5 font-medium">Activated Mode:</div>
                <div className="font-mono text-emerald-300 font-semibold">{result.mode}</div>
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
            <span className="text-emerald-400 font-medium">Precision Verified</span>
          </div>
        </div>
      </div>

      {/* Mayurbhanj Language Identifier (LID: sat vs ori) Tool */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Mayurbhanj Language Identifier (LID: sat vs ori)
              </h3>
              <p className="text-xs text-slate-400">
                Disambiguates whether text printed in Odia script is Santali (Mayurbhanj tribal dialect) or Standard Odia.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunLID}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition cursor-pointer shadow-md shadow-amber-900/30 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Classify Odia Text</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <textarea
              rows={2}
              value={lidInput}
              onChange={(e) => setLidInput(e.target.value)}
              placeholder="Paste Odia script text here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm font-odia focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
            <div className="mt-1 flex gap-2">
              <button
                onClick={() => setLidInput('ଆମ ଓଲଗ ପଢ଼ହବ ଏମ ବଦୟ ସେ ?')}
                className="text-[11px] text-amber-400 hover:underline cursor-pointer"
              >
                Sample 1 (Santali in Odia)
              </button>
              <button
                onClick={() => setLidInput('ଏହି ବିଦ୍ୟାଳୟରେ ପିଲାମାନେ ପଢୁଛନ୍ତି ଏବଂ ସେଠାରେ ଶିକ୍ଷକ ଅଛନ୍ତି।')}
                className="text-[11px] text-teal-400 hover:underline cursor-pointer"
              >
                Sample 2 (Standard Odia)
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center text-xs">
            {lidResult ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Detected Language:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    lidResult.detected_language === 'sat'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  }`}>
                    {lidResult.language_name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Confidence:</span>
                  <span className="font-mono text-emerald-400">{(lidResult.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  {lidResult.explanation}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 italic text-center">
                Click "Classify Odia Text" to evaluate morphological enclitics.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

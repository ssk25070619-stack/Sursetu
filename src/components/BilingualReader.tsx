import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Award,
  Layers,
  Columns,
  AlignLeft,
  ChevronRight,
  ChevronLeft,
  Printer,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  ArrowRight,
} from 'lucide-react';
import { BILINGUAL_STORIES, BilingualStory, StorySentence } from '../data/bilingualStories';
import { IndigenousLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { audioCacheService } from '../services/audioCacheService';
import { speechEngine } from '../engine/speechEngine';
import confetti from 'canvas-confetti';

interface BilingualReaderProps {
  language: IndigenousLanguage;
  onNavigateToWorksheets?: () => void;
}

type ReaderMode = 'split' | 'interlinear' | 'vernacular';

export const BilingualReader: React.FC<BilingualReaderProps> = ({
  language,
  onNavigateToWorksheets,
}) => {
  const [selectedStory, setSelectedStory] = useState<BilingualStory>(BILINGUAL_STORIES[0]);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [readerMode, setReaderMode] = useState<ReaderMode>('split');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [isPlayingSentence, setIsPlayingSentence] = useState<number | null>(null);
  const [scriptChoice, setScriptChoice] = useState<'olchiki' | 'odia' | 'deva'>('olchiki');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [revealedTranslations, setRevealedTranslations] = useState<Record<number, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isPreCaching, setIsPreCaching] = useState<boolean>(false);
  const [cacheStatusMessage, setCacheStatusMessage] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.id === language) || SUPPORTED_LANGUAGES[0];

  const filteredStories =
    selectedGrade === 'All'
      ? BILINGUAL_STORIES
      : BILINGUAL_STORIES.filter((s) => s.grade === selectedGrade);

  // Helper to get tribal text based on script choice and active language
  const getTribalText = (sentence: StorySentence): string => {
    if (language === 'ho') return sentence.ho;
    if (language === 'mundari') return sentence.mundari;
    if (scriptChoice === 'odia') return sentence.santali_odia;
    return sentence.santali_olchiki;
  };

  // Play audio for a specific sentence using voice cache, server TTS, or speechEngine
  const playSentenceAudio = async (sentence: StorySentence, index: number) => {
    setIsPlayingSentence(index);
    setActiveSentenceIndex(index);

    const tribalText = getTribalText(sentence);
    const langCode = language === 'ho' ? 'hoc_Deva' : language === 'mundari' ? 'unr_Deva' : 'sat_Olck';

    const onSentenceEnd = () => {
      setIsPlayingSentence(null);
      if (isPlayingAll && index < selectedStory.sentences.length - 1) {
        playTimerRef.current = setTimeout(() => {
          playSentenceAudio(selectedStory.sentences[index + 1], index + 1);
        }, 600);
      } else if (isPlayingAll) {
        setIsPlayingAll(false);
      }
    };

    try {
      // 1. Check client-side IndexedDB cache
      const cachedUrl = await audioCacheService.getAudioUrl(tribalText, langCode);
      const audioUrl = cachedUrl || `/api/tts?text=${encodeURIComponent(tribalText)}&lang=${encodeURIComponent(langCode)}`;
      
      const audio = audioRef.current || new Audio();
      audio.src = audioUrl;
      audio.onended = onSentenceEnd;
      audio.onerror = async () => {
        // Fallback to Web Speech API synthesizer
        await speechEngine.speakSantaliText(tribalText, 'sat_Olck', onSentenceEnd);
      };
      
      await audio.play();
      return;
    } catch {
      // 2. Play via resilient speechEngine synthesizer
      await speechEngine.speakSantaliText(tribalText, 'sat_Olck', onSentenceEnd);
    }
  };

  const speakBrowserFallback = (text: string, onEnd?: () => void) => {
    speechEngine.speakText(text, 'hin_Deva', onEnd);
  };

  const handleTogglePlayAll = () => {
    if (isPlayingAll) {
      setIsPlayingAll(false);
      if (audioRef.current) audioRef.current.pause();
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
      setIsPlayingSentence(null);
    } else {
      setIsPlayingAll(true);
      playSentenceAudio(selectedStory.sentences[0], 0);
    }
  };

  const toggleRevealTranslation = (sentenceId: number) => {
    setRevealedTranslations((prev) => ({ ...prev, [sentenceId]: !prev[sentenceId] }));
  };

  const handlePreCacheAll = async () => {
    setIsPreCaching(true);
    setCacheStatusMessage('Caching story audio into IndexedDB...');

    let cachedCount = 0;
    const langCode = language === 'ho' ? 'hoc_Deva' : language === 'mundari' ? 'unr_Deva' : 'sat_Olck';

    for (const story of BILINGUAL_STORIES) {
      for (const sent of story.sentences) {
        const text = getTribalText(sent);
        try {
          const existing = await audioCacheService.getAudioUrl(text, langCode);
          if (!existing) {
            const resp = await fetch(`/api/tts?text=${encodeURIComponent(text)}&lang=${langCode}`);
            if (resp.ok) {
              const blob = await resp.blob();
              await audioCacheService.putAudio(text, langCode, blob, 'formant');
              cachedCount++;
            }
          }
        } catch {
          // ignore
        }
      }
    }

    setIsPreCaching(false);
    setCacheStatusMessage(`✅ Successfully pre-cached ${cachedCount} audio phrases for 100% offline playback!`);
    setTimeout(() => setCacheStatusMessage(''), 4000);
  };

  const handleQuizOptionSelect = (qIndex: number, optIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let correct = 0;
    selectedStory.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correct++;
    });

    if (correct === selectedStory.quiz.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const getFontSizeClasses = () => {
    if (fontSize === 'normal') return 'text-lg leading-relaxed';
    if (fontSize === 'xlarge') return 'text-2xl leading-loose';
    return 'text-xl leading-relaxed';
  };

  return (
    <div className="space-y-6">
      <audio ref={audioRef} className="hidden" />

      {/* Top Banner & Mode Control with Aurora Glow */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-emerald-500/30">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl text-emerald-400">
                📖
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Bilingual Story Reader
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold glow-emerald">
                    3 Pedagogical Modes
                  </span>
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  NIPUN Bharat FLN Graded
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Synchronized dual-language audio reader bridging Hindi/English with Santali (*Ol Chiki* & *Odia*), Ho, and Mundari.
              </p>
            </div>
          </div>

          {/* Quick Pre-Cache Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePreCacheAll}
              disabled={isPreCaching}
              className="btn-shimmer px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-sm"
              title="Cache all story audio blobs for instant zero-latency offline playback"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isPreCaching ? 'Pre-caching...' : 'Pre-Cache Story Audio'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="btn-shimmer px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print A4 Reader</span>
            </button>
          </div>
        </div>

        {cacheStatusMessage && (
          <div className="mt-3 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2.5 flex items-center gap-2 animate-fadeIn">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{cacheStatusMessage}</span>
          </div>
        )}

        {/* Story Selector Carousel & Filter */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Select Graded Story:</span>
              <div className="flex items-center gap-1">
                {['All', 'Grade 1', 'Grade 2', 'Grade 3'].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                      selectedGrade === grade
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Script Toggle for Santali */}
            {language === 'santali' && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 mr-1">Script:</span>
                <button
                  onClick={() => setScriptChoice('olchiki')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    scriptChoice === 'olchiki' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
                  }`}
                >
                  Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)
                </button>
                <button
                  onClick={() => setScriptChoice('odia')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    scriptChoice === 'odia' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
                  }`}
                >
                  Odia Script (ଓଡ଼ିଆ)
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filteredStories.map((story) => {
              const isSelected = selectedStory.id === story.id;
              return (
                <button
                  key={story.id}
                  onClick={() => {
                    setSelectedStory(story);
                    setActiveSentenceIndex(0);
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                    if (isPlayingAll) setIsPlayingAll(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer relative ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{story.coverEmoji}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-semibold">
                      {story.grade}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 truncate">{story.title}</h4>
                  <p className="text-xs text-amber-300/90 font-serif truncate mt-0.5">
                    {scriptChoice === 'odia' && language === 'santali' ? story.title_odia : story.title_native}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>{story.sentences.length} Sentences</span>
                    <span>⏱ {story.estimatedMinutes} min</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reader Controls Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setReaderMode('split')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              readerMode === 'split'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>1. Split View</span>
          </button>

          <button
            onClick={() => setReaderMode('interlinear')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              readerMode === 'interlinear'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Interlinear</span>
          </button>

          <button
            onClick={() => setReaderMode('vernacular')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              readerMode === 'vernacular'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>3. Vernacular Focus</span>
          </button>
        </div>

        {/* Narration & Font Controls */}
        <div className="flex items-center gap-2">
          {/* Read All Button */}
          <button
            onClick={handleTogglePlayAll}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              isPlayingAll
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPlayingAll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlayingAll ? 'Pause Narration' : 'Read Aloud All'}</span>
          </button>

          {/* Font Size Adjust */}
          <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded ${fontSize === 'large' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-0.5 rounded ${fontSize === 'xlarge' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              A++
            </button>
          </div>
        </div>
      </div>

      {/* Main Story Reading Viewport */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 lg:p-8 backdrop-blur-md shadow-2xl">
        {/* Story Header */}
        <div className="text-center pb-6 border-b border-slate-800 mb-6">
          <div className="inline-block p-3 rounded-2xl bg-emerald-500/10 text-4xl mb-3">
            {selectedStory.coverEmoji}
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white">{selectedStory.title}</h3>
          <h4 className="text-lg lg:text-xl font-bold text-emerald-400 mt-1 font-serif">
            {scriptChoice === 'odia' && language === 'santali' ? selectedStory.title_odia : selectedStory.title_native}
          </h4>
          <p className="text-sm text-slate-400 mt-1">{selectedStory.title_hindi}</p>
          <div className="mt-3 inline-flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-1 rounded-full text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{selectedStory.culturalNote}</span>
          </div>
        </div>

        {/* ----------------- MODE 1: SPLIT VIEW ----------------- */}
        {readerMode === 'split' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <div className="flex items-center gap-2">
                <span>Regional Source (Hindi / English)</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300">
                <Globe className="w-3.5 h-3.5" />
                <span>Indigenous Mother Tongue ({langConfig.name})</span>
              </div>
            </div>

            {selectedStory.sentences.map((sentence, idx) => {
              const isActive = activeSentenceIndex === idx;
              const isPlaying = isPlayingSentence === idx;
              const tribalText = getTribalText(sentence);

              return (
                <div
                  key={sentence.id}
                  onClick={() => setActiveSentenceIndex(idx)}
                  className={`grid grid-cols-2 gap-4 p-4 rounded-xl border transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Left: Hindi & English */}
                  <div className="space-y-1.5 pr-2">
                    <p className={`text-slate-200 font-medium ${getFontSizeClasses()}`}>
                      {sentence.hindi}
                    </p>
                    <p className="text-xs text-slate-400 italic">{sentence.english}</p>
                  </div>

                  {/* Right: Tribal Mother Tongue */}
                  <div className="space-y-1.5 pl-2 border-l border-slate-800/80 relative">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-amber-300 font-bold font-serif ${getFontSizeClasses()}`}>
                        {tribalText}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {isPlaying && (
                          <div className="flex items-end gap-1 h-5 px-1.5 py-0.5 rounded bg-amber-500/20">
                            <span className="w-1 bg-amber-400 rounded-full animate-eq-1" />
                            <span className="w-1 bg-amber-400 rounded-full animate-eq-2" />
                            <span className="w-1 bg-amber-400 rounded-full animate-eq-3" />
                            <span className="w-1 bg-amber-400 rounded-full animate-eq-4" />
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playSentenceAudio(sentence, idx);
                          }}
                          className={`p-2.5 rounded-xl transition cursor-pointer ${
                            isPlaying
                              ? 'bg-amber-500 text-slate-950 scale-105 shadow-md shadow-amber-500/30'
                              : 'bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white'
                          }`}
                          title="Listen to phonetic pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">/{sentence.phonetic}/</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ----------------- MODE 2: INTERLINEAR VIEW ----------------- */}
        {readerMode === 'interlinear' && (
          <div className="space-y-6">
            {selectedStory.sentences.map((sentence, idx) => {
              const isActive = activeSentenceIndex === idx;
              const isPlaying = isPlayingSentence === idx;
              const tribalText = getTribalText(sentence);

              return (
                <div
                  key={sentence.id}
                  onClick={() => setActiveSentenceIndex(idx)}
                  className={`p-5 rounded-2xl border transition ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500/50 ring-1 ring-emerald-500/20'
                      : 'bg-slate-950/50 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-mono font-bold">
                      Sentence #{idx + 1}
                    </span>
                    <button
                      onClick={() => playSentenceAudio(sentence, idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlaying ? 'Playing...' : 'Audio'}</span>
                    </button>
                  </div>

                  {/* Primary Tribal Script */}
                  <div className="text-amber-300 font-bold font-serif text-2xl lg:text-3xl mb-2">
                    {tribalText}
                  </div>

                  {/* Phonetic Pronunciation */}
                  <div className="text-sm font-mono text-emerald-400/90 mb-3 bg-slate-900/80 p-2 rounded-lg inline-block border border-slate-800">
                    Phonetics: /{sentence.phonetic}/
                  </div>

                  {/* Hindi & English Gloss */}
                  <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-200">
                      <span className="text-slate-400 text-xs font-semibold mr-2">HINDI:</span>
                      {sentence.hindi}
                    </div>
                    <div className="text-slate-400">
                      <span className="text-slate-400 text-xs font-semibold mr-2">ENGLISH:</span>
                      {sentence.english}
                    </div>
                  </div>

                  {/* Vocabulary Chips */}
                  {sentence.vocabulary && sentence.vocabulary.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-slate-400 font-semibold">Key Words:</span>
                      {sentence.vocabulary.map((vocab, vIdx) => (
                        <span
                          key={vIdx}
                          className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-medium"
                        >
                          {vocab.word} = <span className="text-slate-300">{vocab.translation}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ----------------- MODE 3: VERNACULAR FOCUS (CHILD IMMERSION) ----------------- */}
        {readerMode === 'vernacular' && (
          <div className="space-y-6">
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Child-Immersion Mode:</strong> Read purely in {langConfig.name} script. Tap any sentence to listen or click "Reveal Hindi" if you get stuck.
              </span>
            </div>

            {selectedStory.sentences.map((sentence, idx) => {
              const isRevealed = !!revealedTranslations[sentence.id];
              const isPlaying = isPlayingSentence === idx;
              const tribalText = getTribalText(sentence);

              return (
                <div
                  key={sentence.id}
                  className="bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 p-6 rounded-2xl transition space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-2xl lg:text-3xl font-serif font-bold text-amber-300 leading-relaxed">
                      {tribalText}
                    </p>

                    <button
                      onClick={() => playSentenceAudio(sentence, idx)}
                      className={`p-3 rounded-xl transition cursor-pointer shrink-0 ${
                        isPlaying
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-800 hover:bg-emerald-600 text-slate-200'
                      }`}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-400 font-mono">/{sentence.phonetic}/</span>
                    <button
                      onClick={() => toggleRevealTranslation(sentence.id)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
                    >
                      {isRevealed ? 'Hide Hindi Meaning' : 'Reveal Hindi Meaning'}
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="bg-slate-900/90 border border-emerald-500/30 p-3.5 rounded-xl text-slate-200 text-sm animate-fadeIn">
                      <p className="font-medium text-emerald-300">{sentence.hindi}</p>
                      <p className="text-xs text-slate-400 italic mt-0.5">{sentence.english}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ----------------- COMPREHENSION QUIZ ----------------- */}
        <div className="mt-10 pt-8 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-400" />
            <h4 className="text-lg font-bold text-white">Story Comprehension Check (FLN Assessment)</h4>
          </div>

          <div className="space-y-4">
            {selectedStory.quiz.map((q, qIdx) => {
              const selectedOpt = quizAnswers[qIdx];
              const isSubmitted = quizSubmitted;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div key={qIdx} className="bg-slate-950/70 border border-slate-800 p-5 rounded-xl">
                  <p className="text-sm font-bold text-slate-100">
                    {qIdx + 1}. {q.question}
                  </p>
                  <p className="text-xs text-amber-300 font-serif mt-0.5">{q.question_olchiki}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (isSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-red-950/80 border-red-500 text-red-300';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                          className={`p-2.5 rounded-lg border text-xs text-left transition cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="mt-3 text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-between pt-2">
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Answers</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Player Element */}
      <audio ref={audioRef} className="hidden" preload="auto" />
    </div>
  );
};

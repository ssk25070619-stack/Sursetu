import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Rotate3d,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Sparkles,
  Filter,
  Sliders,
  Play,
  Square,
  Zap,
  BookOpen
} from 'lucide-react';
import { VERIFIED_VOCABULARY } from '../data/corpus';
import { speechEngine } from '../engine/speechEngine';
import { offlineStorage } from '../services/offlineStorageService';
import { TargetScript, VocabItem, IndigenousLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface FlashcardDeckProps {
  language?: IndigenousLanguage;
}

type SpeakingTarget = 'tribal' | 'slow' | 'phonetic' | 'example' | 'hindi' | 'english' | 'ho' | 'mundari' | 'kurukh' | null;

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ language = 'santali' }) => {
  const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.id === language) || SUPPORTED_LANGUAGES[0];

  const [items, setItems] = useState<VocabItem[]>(VERIFIED_VOCABULARY);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [targetScript, setTargetScript] = useState<TargetScript>(
    language === 'ho' ? 'sat_Deva' : language === 'mundari' ? 'sat_Deva' : 'sat_Olck'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  // Web Speech API States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingTarget, setSpeakingTarget] = useState<SpeakingTarget>(null);
  const [speechSpeed, setSpeechSpeed] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sursetu_flashcard_speech_speed');
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 1.3) {
          return Math.round(parsed * 100) / 100;
        }
      }
    } catch (e) {}
    return 0.85; // Default standard learning pace
  });
  const [autoPronounce, setAutoPronounce] = useState<boolean>(false);
  const [activeUtteranceText, setActiveUtteranceText] = useState<string>('');
  const [webSpeechSupported] = useState<boolean>(() => speechEngine.isWebSpeechSupported());

  const autoPronounceTimerRef = useRef<number | null>(null);

  // Speed persistence helper
  const handleSpeedChange = (newSpeed: number) => {
    const clamped = Math.max(0.5, Math.min(1.2, Math.round(newSpeed * 100) / 100));
    setSpeechSpeed(clamped);
    try {
      localStorage.setItem('sursetu_flashcard_speech_speed', String(clamped));
    } catch (err) {
      console.warn('Failed to save speech speed to localStorage', err);
    }
  };

  // Descriptive label for language learning pace
  const getSpeedPaceDescriptor = (speed: number) => {
    if (speed <= 0.55) {
      return {
        label: 'Very Slow (Foundational FLN)',
        icon: '🐢',
        badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
        hint: 'Extra articulated syllables for beginner learners'
      };
    }
    if (speed <= 0.70) {
      return {
        label: 'Slow (Phonics & Syllables)',
        icon: '🐢',
        badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
        hint: 'Great for phoneme separation and clear acoustic cues'
      };
    }
    if (speed <= 0.90) {
      return {
        label: 'Standard Practice',
        icon: '🚶',
        badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
        hint: 'Balanced pace for general vocabulary learning'
      };
    }
    return {
      label: 'Natural / Conversational',
      icon: '🐇',
      badgeClass: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
      hint: 'Realistic conversational rhythm'
    };
  };

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(it => it.category === selectedCategory);

  const currentItem = filteredItems[currentIndex] || filteredItems[0] || VERIFIED_VOCABULARY[0];

  // Derive active tribal word representation
  const getDisplayedTribalWord = (item: VocabItem) => {
    if (language === 'ho' && item.ho) {
      return item.ho;
    }
    if (language === 'mundari' && item.mundari) {
      return item.mundari;
    }
    if (language === 'kurukh' && item.kurukh) {
      return item.kurukh;
    }
    switch (targetScript) {
      case 'sat_Olck':
        return item.santali_olchiki;
      case 'sat_Orya':
        return item.santali_odia;
      case 'sat_Deva':
        return item.santali_deva;
      case 'sat_Latn':
      default:
        return item.santali_latin;
    }
  };

  // Primary Web Speech API Pronunciation Handler
  const handleSpeakTribal = (speed: number = speechSpeed, target: SpeakingTarget = 'tribal', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentItem) return;

    // If already speaking, cancel first
    speechEngine.cancelSpeech();

    setIsSpeaking(true);
    setSpeakingTarget(target);

    let wordToPronounce = currentItem.santali_olchiki;
    let fallbackDeva = currentItem.santali_deva;

    if (language === 'ho' && currentItem.ho) {
      wordToPronounce = currentItem.ho;
      fallbackDeva = currentItem.ho;
    } else if (language === 'mundari' && currentItem.mundari) {
      wordToPronounce = currentItem.mundari;
      fallbackDeva = currentItem.mundari;
    } else if (language === 'kurukh' && currentItem.kurukh) {
      wordToPronounce = currentItem.kurukh;
      fallbackDeva = currentItem.kurukh;
    } else {
      if (targetScript === 'sat_Deva') wordToPronounce = currentItem.santali_deva;
      else if (targetScript === 'sat_Orya') wordToPronounce = currentItem.santali_odia;
      else if (targetScript === 'sat_Latn') wordToPronounce = currentItem.santali_latin;
    }

    setActiveUtteranceText(`${wordToPronounce} (${currentItem.phonetic})`);

    speechEngine.speakTribalWord({
      word: wordToPronounce,
      phonetic: currentItem.phonetic,
      devaFallback: fallbackDeva,
      script: targetScript,
      language: language,
      rate: speed,
      onStart: () => {
        setIsSpeaking(true);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setSpeakingTarget(null);
        setActiveUtteranceText('');
      },
      onError: () => {
        setIsSpeaking(false);
        setSpeakingTarget(null);
        setActiveUtteranceText('');
      }
    });
  };

  // Speak phonetic syllable breakdown
  const handleSpeakPhonetics = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentItem?.phonetic) return;

    speechEngine.cancelSpeech();
    setIsSpeaking(true);
    setSpeakingTarget('phonetic');
    setActiveUtteranceText(`Syllables: ${currentItem.phonetic}`);

    speechEngine.speakText(
      currentItem.phonetic.replace(/[-–]/g, '  '),
      'eng_Latn',
      () => {
        setIsSpeaking(false);
        setSpeakingTarget(null);
        setActiveUtteranceText('');
      },
      { rate: Math.max(0.5, Math.min(1.2, speechSpeed * 0.8)) }
    );
  };

  // Speak Example Sentence
  const handleSpeakSentence = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentItem?.exampleSentence) return;

    speechEngine.cancelSpeech();
    setIsSpeaking(true);
    setSpeakingTarget('example');
    setActiveUtteranceText(currentItem.exampleSentence.hindi);

    speechEngine.speakText(
      currentItem.exampleSentence.hindi,
      'hin_Deva',
      () => {
        setIsSpeaking(false);
        setSpeakingTarget(null);
        setActiveUtteranceText('');
      },
      { rate: Math.max(0.5, Math.min(1.2, speechSpeed)) }
    );
  };

  // Speak Hindi or English meaning on back face
  const handleSpeakTranslation = (text: string, langType: 'hin_Deva' | 'eng_Latn', target: SpeakingTarget, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    speechEngine.cancelSpeech();
    setIsSpeaking(true);
    setSpeakingTarget(target);
    setActiveUtteranceText(text);

    speechEngine.speakText(
      text,
      langType,
      () => {
        setIsSpeaking(false);
        setSpeakingTarget(null);
        setActiveUtteranceText('');
      },
      { rate: Math.max(0.5, Math.min(1.2, speechSpeed)) }
    );
  };

  // Stop current speech playback
  const handleStopSpeech = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    speechEngine.cancelSpeech();
    setIsSpeaking(false);
    setSpeakingTarget(null);
    setActiveUtteranceText('');
  };

  const handleNext = () => {
    speechEngine.cancelSpeech();
    setIsSpeaking(false);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    speechEngine.cancelSpeech();
    setIsSpeaking(false);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleShuffle = () => {
    speechEngine.cancelSpeech();
    setIsSpeaking(false);
    setIsFlipped(false);
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setCurrentIndex(0);
  };

  const handleToggleMastery = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMasteredIds((prev) => {
      const isNowMastered = !prev.includes(id);
      if (isNowMastered) {
        speechEngine.playVictoryChime();
      } else {
        speechEngine.playMandarDrumBeat();
      }
      return isNowMastered ? [...prev, id] : prev.filter(x => x !== id);
    });
  };

  // Auto-pronounce when changing cards if enabled
  useEffect(() => {
    if (autoPronounce && currentItem) {
      if (autoPronounceTimerRef.current) {
        window.clearTimeout(autoPronounceTimerRef.current);
      }
      autoPronounceTimerRef.current = window.setTimeout(() => {
        handleSpeakTribal(speechSpeed, 'tribal');
      }, 350);
    }
    return () => {
      if (autoPronounceTimerRef.current) {
        window.clearTimeout(autoPronounceTimerRef.current);
      }
    };
  }, [currentIndex, autoPronounce]);

  // Keyboard accessibility: Space or 'S' to pronounce, Left/Right arrows, Up/Down or 'F' to flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.code === 'Space' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (isSpeaking) {
          handleStopSpeech();
        } else {
          handleSpeakTribal(speechSpeed, 'tribal');
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, speechSpeed, targetScript, language, currentItem, isSpeaking]);

  const CATEGORIES = [
    { id: 'all', label: 'All Words' },
    { id: 'numbers', label: '🔢 Numerals & Counting' },
    { id: 'colours', label: '🎨 Colours' },
    { id: 'fruits', label: '🍎 Fruits & Produce' },
    { id: 'shapes', label: '📐 Shapes' },
    { id: 'school', label: '🏫 School' },
    { id: 'nature', label: '🌿 Nature' },
    { id: 'animals', label: '🐘 Animals' },
    { id: 'family', label: '👨‍👩‍👧 Family' },
    { id: 'actions', label: '🏃 Actions' },
    { id: 'dialogues', label: '💬 Dialogues & Gratitude' }
  ];

  const displayedWord = getDisplayedTribalWord(currentItem);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                <span>{currentLangConfig.icon}</span>
                <span>Interactive 3D TLM • {currentLangConfig.name}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>Web Speech API Synthesis</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>100% Offline Cached</span>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              3D Digital Flashcards with Native Pronunciation
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Tap card to flip 360°. Click the speaker icon or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-xs border border-slate-700">Space</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-xs border border-slate-700">S</kbd> to hear genuine indigenous phonetics.
            </p>
          </div>

          {/* Mastery Progress Bar */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-right shrink-0">
            <div className="text-slate-400 mb-1 flex items-center justify-between gap-3">
              <span>Deck Mastery:</span>
              <strong className="text-emerald-400 font-bold">
                {masteredIds.length} / {items.length} words
              </strong>
            </div>
            <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300"
                style={{ width: `${(masteredIds.length / items.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter bar & Speech Settings Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                  speechEngine.cancelSpeech();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Controls: Script Selector & Auto-Pronounce */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Script selector (relevant for Santali) */}
            {language === 'santali' && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Script:</span>
                <select
                  value={targetScript}
                  onChange={(e) => setTargetScript(e.target.value as TargetScript)}
                  className="bg-slate-950 border border-slate-800 text-emerald-300 rounded-lg px-2.5 py-1 text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="sat_Olck">Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)</option>
                  <option value="sat_Orya">Odia Script (ଓଡ଼ᱤଆ)</option>
                  <option value="sat_Deva">Devanagari (संताली)</option>
                  <option value="sat_Latn">Latin Phonetic</option>
                </select>
              </div>
            )}

            {/* Auto-Pronounce Checkbox */}
            <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={autoPronounce}
                onChange={(e) => setAutoPronounce(e.target.checked)}
                className="w-3.5 h-3.5 text-emerald-500 rounded focus:ring-0 cursor-pointer"
              />
              <span>Auto-Play</span>
            </label>
          </div>
        </div>

        {/* Playback Speed Slider Control Panel */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pronunciation Speed:</span>
            </div>

            {/* Slider Control */}
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 shadow-inner">
              <span className="text-xs" title="Very slow (0.50x)">🐢</span>
              <input
                type="range"
                min="0.5"
                max="1.2"
                step="0.05"
                value={speechSpeed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-28 sm:w-36 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                aria-label="Adjust text-to-speech pronunciation playback speed"
              />
              <span className="text-xs" title="Conversational (1.20x)">🐇</span>

              {/* Speed Multiplier Badge */}
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-950 text-emerald-300 border border-emerald-500/30">
                {speechSpeed.toFixed(2)}x
              </span>
            </div>

            {/* Pace Descriptor Badge */}
            {(() => {
              const descriptor = getSpeedPaceDescriptor(speechSpeed);
              return (
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${descriptor.badgeClass}`}>
                  <span>{descriptor.icon}</span>
                  <span>{descriptor.label}</span>
                </span>
              );
            })()}
          </div>

          {/* Presets and Preview Test Button */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono">
              {[
                { label: '0.5x', speed: 0.50, title: 'Very Slow (0.50x) for foundational phonics' },
                { label: '0.7x', speed: 0.70, title: 'Slow (0.70x) for syllable learning' },
                { label: '0.85x', speed: 0.85, title: 'Standard (0.85x)' },
                { label: '1.0x', speed: 1.00, title: 'Natural (1.00x)' },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleSpeedChange(p.speed)}
                  className={`px-2 py-1 rounded transition cursor-pointer ${
                    Math.abs(speechSpeed - p.speed) < 0.03
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={p.title}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Live Audio Sample Preview */}
            <button
              onClick={() => handleSpeakTribal(speechSpeed, 'tribal')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition cursor-pointer"
              title="Test current pronunciation speed with active card"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Test Audio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Web Speech Synthesis Active Indicator */}
      {isSpeaking && (
        <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border border-emerald-500/40 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            {/* Pulsing Audio Equalizer */}
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-4" />
              <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-5 delay-75" />
              <span className="w-1 bg-amber-400 rounded-full animate-pulse h-3 delay-150" />
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-5 delay-100" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 animate-bounce-short text-emerald-400" />
                <span>Web Speech API Playing:</span>
                <span className="text-white font-mono">{activeUtteranceText}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Acoustic Edge Synthesizer • Rate: {speechSpeed}x • Accent: {currentLangConfig.name}
              </p>
            </div>
          </div>

          <button
            onClick={handleStopSpeech}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 text-xs font-semibold transition cursor-pointer"
            title="Stop Speech Output"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop</span>
          </button>
        </div>
      )}

      {/* 3D Flashcard Stage */}
      <div className="flex flex-col items-center justify-center py-2">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="perspective-1000 w-full max-w-md h-84 sm:h-96 cursor-pointer select-none"
        >
          <div
            className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT FACE */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backface-hidden">
              {/* Card Top Row */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
                  {currentItem.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleToggleMastery(currentItem.id, e)}
                    className={`p-2 rounded-full border transition cursor-pointer ${
                      masteredIds.includes(currentItem.id)
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                    title={masteredIds.includes(currentItem.id) ? 'Mastered!' : 'Mark as Mastered'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Center Content: Emoji, Tribal Word, and Phonetics */}
              <div className="text-center my-auto space-y-2 sm:space-y-3">
                <div className="text-6xl sm:text-7xl filter drop-shadow-lg animate-bounce-short">
                  {currentItem.emoji}
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold text-white font-olchiki tracking-wider text-emerald-200">
                  {displayedWord}
                </div>

                {/* Phonetic Syllable Pill with Audio Trigger */}
                <button
                  onClick={handleSpeakPhonetics}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white transition cursor-pointer"
                  title="Click to hear syllable-by-syllable phonetics"
                >
                  <span className="font-mono italic">"{currentItem.phonetic}"</span>
                  <Volume2 className="w-3 h-3 text-cyan-400" />
                </button>
              </div>

              {/* Bottom Pronunciation Action Toolbar */}
              <div className="border-t border-slate-800/80 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Main Speech Trigger Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={(e) => handleSpeakTribal(speechSpeed, 'tribal', e)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md ${
                      isSpeaking && speakingTarget === 'tribal'
                        ? 'bg-amber-600 text-white animate-pulse shadow-amber-900/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 hover:scale-[1.02]'
                    }`}
                    title={`Pronounce tribal word at ${speechSpeed.toFixed(2)}x speed`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>
                      {isSpeaking && speakingTarget === 'tribal'
                        ? 'Speaking...'
                        : `Pronounce (${speechSpeed.toFixed(2)}x)`}
                    </span>
                  </button>

                  {/* Slow Phonics Pronounce Button */}
                  <button
                    onClick={(e) => handleSpeakTribal(Math.max(0.5, +(speechSpeed * 0.75).toFixed(2)), 'slow', e)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                      isSpeaking && speakingTarget === 'slow'
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-slate-950/80 hover:bg-slate-850 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                    title="Listen to slower, articulated pronunciation for teaching and phonetic recognition"
                  >
                    <span>🐢</span>
                    <span className="hidden sm:inline">
                      Extra Slow ({Math.max(0.5, +(speechSpeed * 0.75).toFixed(2))}x)
                    </span>
                    <span className="sm:hidden">Slow</span>
                  </button>
                </div>

                {/* In-Card Mini Speed Slider & Flip Hint */}
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  {/* Slider directly on card */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 bg-slate-950/90 border border-slate-800 rounded-xl px-2.5 py-1 text-xs shadow-inner"
                    title="Adjust pronunciation playback speed directly on card"
                  >
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <span>🐢</span>
                      <span className="hidden md:inline">Speed:</span>
                    </span>
                    <input
                      type="range"
                      min="0.5"
                      max="1.2"
                      step="0.05"
                      value={speechSpeed}
                      onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                      className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                      aria-label="In-card playback speed slider"
                    />
                    <span className="font-mono text-[11px] font-bold text-emerald-300">
                      {speechSpeed.toFixed(2)}x
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
                    <Rotate3d className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Flip</span>
                  </span>
                </div>
              </div>
            </div>

            {/* BACK FACE */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/80 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backface-hidden rotate-y-180">
              {/* Back Top Row */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/20">
                  Hindi & English Translation
                </span>
                <span className="text-xs text-slate-400">Card #{currentIndex + 1} of {filteredItems.length}</span>
              </div>

              {/* Center Content: Hindi, English & Example Sentence */}
              <div className="text-center my-auto space-y-3">
                <div className="space-y-1">
                  {/* Hindi with TTS button */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {currentItem.hindi}
                    </span>
                    <button
                      onClick={(e) => handleSpeakTranslation(currentItem.hindi, 'hin_Deva', 'hindi', e)}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition cursor-pointer"
                      title="Pronounce Hindi via Web Speech API"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* English with TTS button */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-base sm:text-lg font-medium text-amber-300">
                      {currentItem.english}
                    </span>
                    <button
                      onClick={(e) => handleSpeakTranslation(currentItem.english, 'eng_Latn', 'english', e)}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition cursor-pointer"
                      title="Pronounce English via Web Speech API"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Example Sentence with Audio Reader */}
                {currentItem.exampleSentence && (
                  <div className="bg-slate-950/85 border border-slate-800 rounded-xl p-3 text-left text-xs space-y-1 relative group">
                    <div className="flex items-center justify-between">
                      <div className="text-emerald-300 font-olchiki font-bold text-sm">
                        {currentItem.exampleSentence.olchiki}
                      </div>
                      <button
                        onClick={handleSpeakSentence}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold hover:bg-emerald-900 transition cursor-pointer"
                        title="Pronounce example sentence"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      {currentItem.exampleSentence.hindi}
                    </div>
                    <div className="text-slate-500 text-[10px] italic">
                      "{currentItem.exampleSentence.english}"
                    </div>
                  </div>
                )}

                {/* Cultural Note */}
                {currentItem.culturalNote && (
                  <p className="text-[11px] text-slate-400 italic">
                    💡 {currentItem.culturalNote}
                  </p>
                )}
              </div>

              {/* Bottom Row on Back */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                {/* Sibling Dialects with Pronounce */}
                <div className="flex items-center gap-3 text-[11px]">
                  {currentItem.ho && (
                    <button
                      onClick={(e) => handleSpeakTranslation(currentItem.ho!, 'hin_Deva', 'ho', e)}
                      className="hover:text-amber-300 flex items-center gap-1 transition cursor-pointer"
                      title="Pronounce Ho equivalent"
                    >
                      <span className="text-amber-400 font-semibold">Ho:</span>
                      <span>{currentItem.ho}</span>
                      <Volume2 className="w-3 h-3 text-amber-400" />
                    </button>
                  )}
                  {currentItem.mundari && (
                    <button
                      onClick={(e) => handleSpeakTranslation(currentItem.mundari!, 'hin_Deva', 'mundari', e)}
                      className="hover:text-teal-300 flex items-center gap-1 transition cursor-pointer"
                      title="Pronounce Mundari equivalent"
                    >
                      <span className="text-teal-400 font-semibold">Mundari:</span>
                      <span>{currentItem.mundari}</span>
                      <Volume2 className="w-3 h-3 text-teal-400" />
                    </button>
                  )}
                  {currentItem.kurukh && (
                    <button
                      onClick={(e) => handleSpeakTranslation(currentItem.kurukh!, 'hin_Deva', 'kurukh', e)}
                      className="hover:text-purple-300 flex items-center gap-1 transition cursor-pointer"
                      title="Pronounce Kurukh equivalent"
                    >
                      <span className="text-purple-400 font-semibold">Kurukh:</span>
                      <span>{currentItem.kurukh}</span>
                      <Volume2 className="w-3 h-3 text-purple-400" />
                    </button>
                  )}
                </div>

                <span className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
                  <Rotate3d className="w-3.5 h-3.5" />
                  <span>Tap to flip</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation & Controls Bar */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition cursor-pointer active:scale-95"
            title="Previous Card (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleShuffle}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-2 active:scale-95"
            title="Shuffle Deck"
          >
            <Shuffle className="w-4 h-4 text-amber-400" />
            <span>Shuffle</span>
          </button>

          {/* Quick Pronounce Button in Controls Bar */}
          <button
            onClick={(e) => handleSpeakTribal(speechSpeed, 'tribal', e)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-2 active:scale-95 ${
              isSpeaking
                ? 'bg-amber-600 border-amber-500 text-white'
                : 'bg-emerald-950/60 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-300'
            }`}
            title="Pronounce current word (Spacebar)"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Playing...' : 'Pronounce (Space)'}</span>
          </button>

          <button
            onClick={handleNext}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition cursor-pointer active:scale-95"
            title="Next Card (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Keyboard navigation helper */}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500">
          <span>Shortcuts: <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">Space</kbd> Pronounce</span>
          <span>•</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">← / →</kbd> Prev / Next</span>
          <span>•</span>
          <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">F / ↑ / ↓</kbd> Flip Card</span>
        </div>
      </div>
    </div>
  );
};

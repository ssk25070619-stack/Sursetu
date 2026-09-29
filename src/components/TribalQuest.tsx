import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  Volume2,
  Sparkles,
  Target,
  Music,
  Puzzle,
  Award,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { VERIFIED_VOCABULARY } from '../data/corpus';
import { speechEngine } from '../engine/speechEngine';
import { VocabItem, AchievementBadge, QuestStats } from '../types';
import { achievementsEngine } from '../engine/achievementsEngine';
import { AchievementsView } from './AchievementsView';
import { AchievementUnlockBanner } from './AchievementUnlockBanner';
import { AchievementInspectModal } from './AchievementInspectModal';
import { DigitalTokenIcon } from './DigitalTokenIcon';
import { TribalLearningPatternsView } from './analytics/TribalLearningPatternsView';
import { BarChart3 } from 'lucide-react';

type GameMode = 'birsa_archer' | 'mandar_drum' | 'word_jumble' | 'achievements' | 'analytics';

export const TribalQuest: React.FC = () => {
  const [stats, setStats] = useState<QuestStats>(achievementsEngine.getStats());
  const [badges, setBadges] = useState<AchievementBadge[]>(achievementsEngine.getBadges());
  const [mode, setMode] = useState<GameMode>('birsa_archer');
  const [score, setScore] = useState<number>(stats.totalScore);
  const [streak, setStreak] = useState<number>(stats.currentStreak);
  const [salLeaves, setSalLeaves] = useState<number>(stats.salLeaves);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Modal / Celebration states
  const [justUnlockedBadge, setJustUnlockedBadge] = useState<AchievementBadge | null>(null);
  const [inspectingBadge, setInspectingBadge] = useState<AchievementBadge | null>(null);

  // Question State
  const [currentQuestion, setCurrentQuestion] = useState<{
    targetItem: VocabItem;
    options: VocabItem[];
    jumbledLetters?: string[];
    userSpelled?: string[];
  } | null>(null);

  const refreshBadgesAndStats = () => {
    const currentStats = achievementsEngine.getStats();
    setStats(currentStats);
    setBadges(achievementsEngine.getBadges());
    setScore(currentStats.totalScore);
    setSalLeaves(currentStats.salLeaves);
    setStreak(currentStats.currentStreak);
  };

  // Initialize or generate next question
  const generateNewQuestion = () => {
    setFeedback(null);
    const shuffled = [...VERIFIED_VOCABULARY].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const distractors = shuffled.slice(1, 4);
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    // Jumble for Mode 3
    const glyphs = Array.from(target.santali_olchiki.replace(/\s+/g, ''));
    const jumbled = [...glyphs].sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      targetItem: target,
      options,
      jumbledLetters: jumbled,
      userSpelled: [],
    });

    if (mode === 'mandar_drum') {
      speechEngine.playMandarDrumBeat();
    }
  };

  useEffect(() => {
    if (mode !== 'achievements' && mode !== 'analytics') {
      generateNewQuestion();
    }
  }, [mode]);

  // Rank progression
  const getRank = (leaves: number) => {
    if (leaves >= 50) return { title: 'Master Guru (ᱢᱟᱪᱮᱛ ᱜᱩᱨᱩ)', color: 'text-amber-400', badge: '👑' };
    if (leaves >= 30) return { title: 'Birsa Champion (ᱵᱤᱨᱥᱟ ᱵᱤᱨ)', color: 'text-emerald-400', badge: '🏹' };
    if (leaves >= 15) return { title: 'Dhamsa Tracker (ᱫᱷᱟᱢᱥᱟ ᱜᱟᱛᱮ)', color: 'text-teal-400', badge: '🥁' };
    return { title: 'Forest Explorer (ᱵᱤᱨ ᱫᱟᱬᱟᱸ)', color: 'text-cyan-400', badge: '🍃' };
  };

  const rank = getRank(salLeaves);
  const nextMilestone = achievementsEngine.getNextMilestone();
  const unlockedBadgesCount = badges.filter(b => b.isUnlocked).length;

  const handleSelectOption = (selected: VocabItem) => {
    if (!currentQuestion || mode === 'achievements' || mode === 'analytics') return;

    if (selected.id === currentQuestion.targetItem.id) {
      // Correct!
      const points = 50 * Math.max(1, streak + 1);
      const newStreak = streak + 1;
      const newLeaves = salLeaves + 2;

      setScore(prev => prev + points);
      setStreak(newStreak);
      setSalLeaves(newLeaves);
      speechEngine.playVictoryChime();

      // Confetti FX
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#f59e0b', '#06b6d4'],
      });

      setFeedback({
        isCorrect: true,
        text: `🎯 ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! Correct! +${points} pts & +2 Sal Leaves 🍃`,
      });

      // Record in achievements engine & store in localStorage
      const { updatedStats, newUnlocks } = achievementsEngine.recordQuestAnswer({
        mode,
        isCorrect: true,
        pointsAwarded: points,
        leavesChange: 2,
        newStreak,
      });

      setStats(updatedStats);
      setBadges(achievementsEngine.getBadges());

      if (newUnlocks.length > 0) {
        setJustUnlockedBadge(newUnlocks[0]);
      }

      setTimeout(() => {
        generateNewQuestion();
      }, 1400);
    } else {
      // Wrong
      setStreak(0);
      speechEngine.playMandarDrumBeat();
      setFeedback({
        isCorrect: false,
        text: `❌ Incorrect. Correct answer was: ${currentQuestion.targetItem.santali_olchiki} (${currentQuestion.targetItem.hindi})`,
      });

      const { updatedStats } = achievementsEngine.recordQuestAnswer({
        mode,
        isCorrect: false,
        pointsAwarded: 0,
        leavesChange: 0,
        newStreak: 0,
      });
      setStats(updatedStats);
      setBadges(achievementsEngine.getBadges());

      setTimeout(() => {
        generateNewQuestion();
      }, 1600);
    }
  };

  const handleJumbleTileClick = (letter: string, tileIdx: number) => {
    if (!currentQuestion || !currentQuestion.jumbledLetters || !currentQuestion.userSpelled) return;

    const nextSpelled = [...currentQuestion.userSpelled, letter];
    const nextJumbled = currentQuestion.jumbledLetters.filter((_, i) => i !== tileIdx);

    const targetClean = currentQuestion.targetItem.santali_olchiki.replace(/\s+/g, '');
    const currentBuilt = nextSpelled.join('');

    speechEngine.playMandarDrumBeat();

    if (currentBuilt === targetClean) {
      // Completed the word jumble!
      const points = 70 * Math.max(1, streak + 1);
      const newStreak = streak + 1;
      const newLeaves = salLeaves + 3;

      setScore(prev => prev + points);
      setStreak(newStreak);
      setSalLeaves(newLeaves);
      speechEngine.playVictoryChime();

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });

      setFeedback({
        isCorrect: true,
        text: `🧩 Word Assembled Perfectly: ${currentBuilt}! +${points} pts & +3 Leaves 🍃`,
      });

      // Record in achievements engine & store in localStorage
      const { updatedStats, newUnlocks } = achievementsEngine.recordQuestAnswer({
        mode: 'word_jumble',
        isCorrect: true,
        pointsAwarded: points,
        leavesChange: 3,
        newStreak,
      });

      setStats(updatedStats);
      setBadges(achievementsEngine.getBadges());

      if (newUnlocks.length > 0) {
        setJustUnlockedBadge(newUnlocks[0]);
      }

      setTimeout(() => {
        generateNewQuestion();
      }, 1500);
    } else {
      setCurrentQuestion({
        ...currentQuestion,
        userSpelled: nextSpelled,
        jumbledLetters: nextJumbled,
      });
    }
  };

  const handleResetJumble = () => {
    if (!currentQuestion) return;
    const glyphs = Array.from(currentQuestion.targetItem.santali_olchiki.replace(/\s+/g, ''));
    setCurrentQuestion({
      ...currentQuestion,
      jumbledLetters: [...glyphs].sort(() => Math.random() - 0.5),
      userSpelled: [],
    });
  };

  const handleListenPrompt = () => {
    if (!currentQuestion) return;
    speechEngine.playMandarDrumBeat();
    speechEngine.speakText(currentQuestion.targetItem.santali_latin, 'sat_Olck');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Game Banner & HUD */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
                Gamified Multi-Script Learning
              </span>
              <span className="text-xs text-slate-400">Tactile FLN Retention</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-mono border border-emerald-500/20">
                Offline LocalStorage
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Tribal Quest (ᱴᱨᱟᱭᱵᱟᱞ ᱠᱣᱮᱥᱴ)
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Reinforces tribal vocabulary retention through archery targets, listening drum beats, and Ol Chiki word puzzles.
            </p>
          </div>

          {/* Gamification HUD */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-950/90 border border-slate-800 p-2.5 sm:p-3 rounded-2xl shadow-inner shrink-0 flex-wrap sm:flex-nowrap">
            <div className="text-center px-2.5 sm:px-3 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Score</div>
              <div className="text-xl font-extrabold text-amber-400 font-mono">{score}</div>
            </div>

            <div className="text-center px-2.5 sm:px-3 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-0.5">
                <Flame className="w-3 h-3 text-orange-500" />
                Streak
              </div>
              <div className="text-xl font-extrabold text-orange-400 font-mono">{streak}x</div>
            </div>

            <div className="text-center px-2.5 sm:px-3 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Sal Leaves</div>
              <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1 justify-center">
                <span>🍃</span>
                <span>{salLeaves}</span>
              </div>
            </div>

            <button
              onClick={() => setMode('achievements')}
              className="text-center px-2.5 sm:px-3 border-r border-slate-800 hover:bg-slate-900 rounded-xl transition cursor-pointer"
              title="View Digital Tokens & Achievements"
            >
              <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-0.5">
                <Award className="w-3 h-3 text-amber-400" />
                Tokens
              </div>
              <div className="text-sm font-black text-amber-300 font-mono flex items-center justify-center gap-1">
                <span>{unlockedBadgesCount}</span>
                <span className="text-[10px] text-slate-500">/{badges.length}</span>
              </div>
            </button>

            {/* D3 Teacher Analytics HUD Shortcut */}
            <button
              onClick={() => setMode('analytics')}
              className="text-center px-2.5 sm:px-3 border-r border-slate-800 hover:bg-slate-900 rounded-xl transition cursor-pointer"
              title="View D3.js Student Learning Patterns & Progress Analytics"
            >
              <div className="text-[10px] text-indigo-400 font-semibold uppercase flex items-center justify-center gap-0.5">
                <BarChart3 className="w-3 h-3 text-indigo-400" />
                D3 Progress
              </div>
              <div className="text-xs font-bold text-indigo-300 font-mono flex items-center justify-center">
                Analytics
              </div>
            </button>

            <div className="text-center pl-1 sm:pl-2">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Rank</div>
              <div className={`text-xs font-bold ${rank.color} flex items-center gap-1`}>
                <span>{rank.badge}</span>
                <span className="truncate max-w-[85px] sm:max-w-[100px]">{rank.title.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Tracker Bar */}
        {nextMilestone && mode !== 'achievements' && mode !== 'analytics' && (
          <div
            onClick={() => setInspectingBadge(nextMilestone)}
            className="mt-4 p-2.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between text-xs cursor-pointer hover:border-amber-400 transition group shadow-inner"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <DigitalTokenIcon
                badge={nextMilestone}
                size="sm"
                showProgressRing={true}
                className="shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Next Milestone:
                  </span>
                  <span className="font-bold text-white group-hover:text-amber-300 transition truncate">
                    {nextMilestone.title}
                  </span>
                  <span className="font-olchiki text-emerald-400 text-xs hidden sm:inline">
                    ({nextMilestone.tribalTitle})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {nextMilestone.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pl-2">
              <span className="font-mono text-xs font-bold text-amber-400">
                {nextMilestone.progress} / {nextMilestone.target}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
          <button
            onClick={() => setMode('birsa_archer')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              mode === 'birsa_archer'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4 text-amber-300" />
            <span>Mode 1: 🏹 Birsa Archer</span>
          </button>

          <button
            onClick={() => setMode('mandar_drum')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              mode === 'mandar_drum'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4 text-teal-300" />
            <span>Mode 2: 🥁 Mandar Drum (Audio)</span>
          </button>

          <button
            onClick={() => setMode('word_jumble')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              mode === 'word_jumble'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Puzzle className="w-4 h-4 text-emerald-300" />
            <span>Mode 3: 🧩 Ol Chiki Word Jumble</span>
          </button>

          <button
            onClick={() => setMode('achievements')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              mode === 'achievements'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400'
                : 'bg-slate-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-950/40'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>🏆 Badges & Digital Tokens</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-900 text-[10px] font-mono font-bold text-amber-300 border border-slate-700">
              {unlockedBadgesCount}/{badges.length}
            </span>
          </button>

          {/* New Mode: D3 Student Progress Analytics */}
          <button
            onClick={() => setMode('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              mode === 'analytics'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 ring-1 ring-indigo-400'
                : 'bg-slate-950 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-950/40'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-300" />
            <span>📊 D3 Student Progress</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-950 text-[10px] font-mono font-bold text-indigo-300 border border-indigo-700/50">
              Teacher
            </span>
          </button>
        </div>
      </div>

      {/* RENDER MODE: ACHIEVEMENTS & DIGITAL TOKENS */}
      {mode === 'achievements' && (
        <AchievementsView
          stats={stats}
          badges={badges}
          onPlayMode={targetMode => setMode(targetMode)}
          onRefresh={refreshBadgesAndStats}
          onOpenAnalytics={() => setMode('analytics')}
        />
      )}

      {/* RENDER MODE: D3 STUDENT PROGRESS & LEARNING PATTERNS */}
      {mode === 'analytics' && (
        <TribalLearningPatternsView
          stats={stats}
          badges={badges}
          onPlayMode={targetMode => setMode(targetMode)}
        />
      )}

      {/* RENDER MODES 1-3: ACTIVE QUEST QUESTIONS */}
      {mode !== 'achievements' && mode !== 'analytics' && currentQuestion && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Background decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-3 rounded-xl text-center text-sm font-semibold transition-all ${
                feedback.isCorrect
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 animate-pulse'
                  : 'bg-red-950/80 text-red-300 border border-red-500/40'
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* MODE 1: BIRSA ARCHER */}
          {mode === 'birsa_archer' && (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  🏹 Shoot the correct Ol Chiki target for:
                </span>
                <div className="text-3xl sm:text-5xl font-extrabold text-white flex items-center justify-center gap-4">
                  <span className="text-4xl sm:text-6xl">{currentQuestion.targetItem.emoji}</span>
                  <span>{currentQuestion.targetItem.hindi}</span>
                  <span className="text-xl sm:text-2xl text-amber-400 font-medium">
                    ({currentQuestion.targetItem.english})
                  </span>
                </div>
              </div>

              {/* Target Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
                {currentQuestion.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 hover:border-amber-500/80 hover:bg-slate-900 transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-between group shadow-lg"
                  >
                    <div className="text-left">
                      <div className="text-2xl font-bold font-olchiki text-emerald-300 group-hover:text-amber-300">
                        {opt.santali_olchiki}
                      </div>
                      <div className="text-xs text-slate-500 font-mono italic">
                        "{opt.phonetic}"
                      </div>
                    </div>
                    <span className="text-xl opacity-40 group-hover:opacity-100 transition">🎯</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 2: MANDAR DRUM */}
          {mode === 'mandar_drum' && (
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  🥁 Listen to the tribal pronunciation, then pick the word:
                </span>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleListenPrompt}
                    className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 to-teal-500 hover:from-amber-500 hover:to-teal-400 text-white flex flex-col items-center justify-center gap-1 shadow-2xl ring-8 ring-amber-900/30 hover:scale-105 transition cursor-pointer"
                  >
                    <Volume2 className="w-8 h-8" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Play Audio</span>
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
                {currentQuestion.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 hover:border-teal-500/80 hover:bg-slate-900 transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-between group shadow-lg"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-3xl">{opt.emoji}</span>
                      <div>
                        <div className="text-lg font-bold text-white">{opt.hindi}</div>
                        <div className="text-xs text-slate-400 font-olchiki text-emerald-300">
                          {opt.santali_olchiki}
                        </div>
                      </div>
                    </div>
                    <span className="text-xl opacity-40 group-hover:opacity-100 transition">🥁</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 3: WORD JUMBLE */}
          {mode === 'word_jumble' && (
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  🧩 Tap the floating Ol Chiki characters in sequence to spell:
                </span>
                <div className="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
                  <span className="text-4xl">{currentQuestion.targetItem.emoji}</span>
                  <span>{currentQuestion.targetItem.hindi}</span>
                  <span className="text-slate-400 text-lg">({currentQuestion.targetItem.english})</span>
                </div>
              </div>

              {/* User Assembled Tiles Box */}
              <div className="min-h-[70px] bg-slate-950 border-2 border-dashed border-emerald-500/40 rounded-2xl p-3 flex items-center justify-center gap-2 max-w-lg mx-auto">
                {currentQuestion.userSpelled && currentQuestion.userSpelled.length > 0 ? (
                  currentQuestion.userSpelled.map((char, idx) => (
                    <span
                      key={idx}
                      className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold font-olchiki shadow-md animate-scale"
                    >
                      {char}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">
                    Tap characters below in order...
                  </span>
                )}
              </div>

              {/* Floating Jumbled Character Tiles */}
              <div className="flex flex-wrap items-center justify-center gap-3 max-w-md mx-auto pt-2">
                {currentQuestion.jumbledLetters?.map((glyph, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleJumbleTileClick(glyph, idx)}
                    className="w-14 h-14 bg-slate-800 hover:bg-amber-600 border border-slate-700 text-amber-300 hover:text-white rounded-2xl flex items-center justify-center text-2xl font-bold font-olchiki shadow-lg hover:scale-110 active:scale-95 transition cursor-pointer"
                  >
                    {glyph}
                  </button>
                ))}
              </div>

              {/* Reset button */}
              <div className="pt-2">
                <button
                  onClick={handleResetJumble}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Tiles</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Achievement Unlock Celebration Banner */}
      <AchievementUnlockBanner
        unlockedBadge={justUnlockedBadge}
        onClose={() => setJustUnlockedBadge(null)}
        onInspect={badge => setInspectingBadge(badge)}
      />

      {/* Achievement Deep Inspect Modal */}
      <AchievementInspectModal
        badge={inspectingBadge}
        onClose={() => setInspectingBadge(null)}
        onPlayMode={targetMode => setMode(targetMode)}
      />
    </div>
  );
};

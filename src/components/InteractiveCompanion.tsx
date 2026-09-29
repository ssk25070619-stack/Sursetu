import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Music,
  Flame,
  Star,
  X,
  Play,
  Pause,
  MessageCircle,
  HelpCircle,
  Trophy,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechEngine } from '../engine/speechEngine';

export const InteractiveCompanion: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPlayingMandar, setIsPlayingMandar] = useState<boolean>(false);
  const [isPlayingFlute, setIsPlayingFlute] = useState<boolean>(false);
  const [xpPoints, setXpPoints] = useState<number>(240);
  const [streakDays, setStreakDays] = useState<number>(5);
  const [dailyGoalCompleted, setDailyGoalCompleted] = useState<boolean>(false);
  const [companionDialogue, setCompanionDialogue] = useState<string>(
    'ᱡᱚᱦᱟᱨ! (Johar!) Ready to practice Santali, Ho, or Mundari today?'
  );

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const WORDS_OF_DAY = [
    { olchiki: 'ᱫᱟᱜ', deva: 'दाग', mean: 'Water (पानी)', tip: 'Essential resource in tribal forest geography' },
    { olchiki: 'ᱫᱟᱨᱮ', deva: 'दारे', mean: 'Tree (पेड़)', tip: 'Sacred Sal tree represents tribal vitality' },
    { olchiki: 'ᱢᱤᱫ', deva: 'मिद', mean: 'One (एक)', tip: 'First cardinal digit in Ol Chiki (᱑)' },
    { olchiki: 'ᱥᱮᱛᱟ', deva: 'सेता', mean: 'Morning / Dog', tip: 'Common greeting lemma' },
    { olchiki: 'ᱚᱞ', deva: 'ओल', mean: 'Write / Script', tip: 'Root of Ol Chiki writing system' },
  ];

  const [wordIdx, setWordIdx] = useState<number>(0);
  const currentWord = WORDS_OF_DAY[wordIdx];

  // Initialize Web Audio Context on user interaction
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Synthesize tribal flute note using Web Audio API (Offline native sound synthesis)
  const playFluteNote = (freq: number, duration: number) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // ignore
    }
  };

  // Toggle synthesized Mandar Drum Beat loop
  const toggleMandarRhythm = () => {
    if (isPlayingMandar) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlayingMandar(false);
    } else {
      setIsPlayingMandar(true);
      speechEngine.playMandarDrumBeat();
      intervalRef.current = setInterval(() => {
        speechEngine.playMandarDrumBeat();
      }, 1200);
    }
  };

  // Toggle ambient bamboo flute melody loop
  const toggleFluteMelody = () => {
    if (isPlayingFlute) {
      setIsPlayingFlute(false);
    } else {
      setIsPlayingFlute(true);
      // Play 5-note pentatonic tribal raga
      const notes = [440, 494, 554, 659, 740];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          playFluteNote(freq, 0.8);
        }, idx * 400);
      });
      setTimeout(() => setIsPlayingFlute(false), 2400);
    }
  };

  const handleClaimDailyXP = () => {
    if (!dailyGoalCompleted) {
      setXpPoints((prev) => prev + 50);
      setDailyGoalCompleted(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      speechEngine.playMandarDrumBeat();
      setCompanionDialogue('🎉 Superb! +50 XP claimed. Keep learning everyday!');
    }
  };

  return (
    <div className="no-print fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Interactive Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-slate-900/95 border-2 border-emerald-500/40 p-5 shadow-2xl backdrop-blur-2xl text-slate-100 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-lg">
                  🦜
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  Palash Co-Pilot
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </h4>
                <span className="text-[10px] text-emerald-400 font-medium">Live Indigenous Companion</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dialogue Bubble */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-amber-300 font-medium">
            &ldquo;{companionDialogue}&rdquo;
          </div>

          {/* Daily Learning Streak & XP */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-amber-500/30 flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="font-black text-white font-mono">{streakDays} Days</div>
                <span className="text-[10px] text-slate-400">Daily Streak</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-emerald-500/30 flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="font-black text-white font-mono">{xpPoints} XP</div>
                <span className="text-[10px] text-slate-400">Learner Level 3</span>
              </div>
            </div>
          </div>

          {/* Interactive Word of the Day */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              <span>Word of the Day</span>
              <button
                onClick={() => setWordIdx((prev) => (prev + 1) % WORDS_OF_DAY.length)}
                className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1 text-[10px]"
              >
                <RotateCcw className="w-3 h-3" /> Next
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-white font-olchiki">{currentWord.olchiki}</div>
                <p className="text-xs text-emerald-300 font-semibold mt-0.5">
                  {currentWord.deva} • {currentWord.mean}
                </p>
              </div>

              <button
                onClick={() => speechEngine.speakSantaliText(currentWord.olchiki, 'sat_Olck')}
                className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/30 cursor-pointer"
                title="Hear native audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 italic">{currentWord.tip}</p>
          </div>

          {/* Ambient Soundscapes (Mandar Drum & Flute) */}
          <div className="pt-1 border-t border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Ambient Soundscape</span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMandarRhythm}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  isPlayingMandar
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <span>🥁</span>
                <span>{isPlayingMandar ? 'Mandar Drum (Playing)' : 'Mandar Rhythm'}</span>
              </button>

              <button
                onClick={toggleFluteMelody}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  isPlayingFlute
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <span>🎶</span>
                <span>{isPlayingFlute ? 'Flute Raga' : 'Tribal Flute'}</span>
              </button>
            </div>
          </div>

          {/* Daily Goal Reward Claim */}
          <button
            onClick={handleClaimDailyXP}
            disabled={dailyGoalCompleted}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
              dailyGoalCompleted
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/30 animate-pulse'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{dailyGoalCompleted ? '✅ Daily +50 XP Claimed' : 'Claim Daily Goal (+50 XP)'}</span>
          </button>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-xs shadow-2xl shadow-emerald-950/80 border-2 border-amber-400/40 hover:scale-105 active:scale-95 transition-all cursor-pointer glow-emerald"
      >
        <span className="text-lg">🦜</span>
        <span className="hidden sm:inline">Palash Companion</span>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 text-amber-300 text-[10px] font-mono border border-amber-400/40">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{xpPoints} XP</span>
        </div>
      </button>
    </div>
  );
};

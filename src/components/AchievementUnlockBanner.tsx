import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Check, ArrowRight, X } from 'lucide-react';
import { AchievementBadge } from '../types';
import { DigitalTokenIcon } from './DigitalTokenIcon';
import { speechEngine } from '../engine/speechEngine';

interface AchievementUnlockBannerProps {
  unlockedBadge: AchievementBadge | null;
  onClose: () => void;
  onInspect: (badge: AchievementBadge) => void;
}

export const AchievementUnlockBanner: React.FC<AchievementUnlockBannerProps> = ({
  unlockedBadge,
  onClose,
  onInspect,
}) => {
  useEffect(() => {
    if (unlockedBadge) {
      // Play celebratory fanfare
      speechEngine.playBadgeUnlockFanfare();

      // Launch vibrant confetti bursts
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#8b5cf6'],
      });
    }
  }, [unlockedBadge]);

  if (!unlockedBadge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-50 pointer-events-none"
          style={{ background: unlockedBadge.tokenDesign.glowColor }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Milestone Unlocked Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/40">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Milestone Achieved (ᱢᱤᱞᱥᱴᱚᱱ ᱡᱤᱛᱠᱟᱹᱨ)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
            New Digital Token Unlocked!
          </h3>
          <p className="text-xs text-slate-400">
            Saved to offline local storage for persistent classroom continuity
          </p>
        </div>

        {/* Dynamic Token Icon with glow animation */}
        <div className="py-2 flex justify-center">
          <div className="relative">
            <DigitalTokenIcon
              badge={unlockedBadge}
              size="xl"
              showProgressRing={true}
              className="animate-bounce-short"
            />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950 border border-amber-400/80 text-[10px] font-mono text-amber-300 font-bold uppercase shadow-lg whitespace-nowrap">
              {unlockedBadge.tokenSerial || 'PLSH-VERIFIED'}
            </div>
          </div>
        </div>

        {/* Token Details */}
        <div className="space-y-1.5 pt-2">
          <h4 className="text-lg font-bold text-white flex items-center justify-center gap-2">
            <span>{unlockedBadge.title}</span>
            <span className="font-olchiki text-emerald-400">({unlockedBadge.tribalTitle})</span>
          </h4>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            {unlockedBadge.description}
          </p>
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-amber-400 font-mono">
              +100 Quest XP & Permanent Digital Token
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            onClick={() => {
              onInspect(unlockedBadge);
              onClose();
            }}
            className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <span>Inspect Token</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/50"
          >
            <span>Continue Quest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

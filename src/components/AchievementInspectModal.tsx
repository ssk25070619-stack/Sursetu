import React from 'react';
import { X, Volume2, ShieldCheck, Calendar, Hash, Sparkles, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { AchievementBadge } from '../types';
import { DigitalTokenIcon } from './DigitalTokenIcon';
import { speechEngine } from '../engine/speechEngine';

interface AchievementInspectModalProps {
  badge: AchievementBadge | null;
  onClose: () => void;
  onPlayMode?: (mode: 'birsa_archer' | 'mandar_drum' | 'word_jumble') => void;
}

export const AchievementInspectModal: React.FC<AchievementInspectModalProps> = ({
  badge,
  onClose,
  onPlayMode,
}) => {
  if (!badge) return null;

  const handleSpeakTitle = () => {
    speechEngine.playVictoryChime();
    speechEngine.speakText(badge.title, 'sat_Olck');
  };

  const getTargetMode = (badge: AchievementBadge): 'birsa_archer' | 'mandar_drum' | 'word_jumble' => {
    switch (badge.category) {
      case 'combat':
        return 'birsa_archer';
      case 'rhythm':
        return 'mandar_drum';
      case 'puzzle':
        return 'word_jumble';
      default:
        return 'birsa_archer';
    }
  };

  const targetMode = getTargetMode(badge);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-slate-100">
        {/* Decorative Top Accent Bar */}
        <div
          className="h-2 w-full"
          style={{
            background: badge.isUnlocked
              ? `linear-gradient(90deg, ${badge.tokenDesign.primaryColor}, ${badge.tokenDesign.ringColor}, #ffffff)`
              : '#334155',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
          {/* Large Dynamic Token Icon */}
          <div className="relative pt-2">
            <DigitalTokenIcon
              badge={badge}
              size="xl"
              showProgressRing={true}
              className="drop-shadow-2xl"
            />
            {badge.isUnlocked && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950/90 border border-emerald-500/50 text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Unlocked & Cached</span>
              </div>
            )}
          </div>

          {/* Titles & Tier */}
          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: `${badge.tokenDesign.primaryColor}20`,
                  color: badge.tokenDesign.ringColor,
                  borderColor: `${badge.tokenDesign.ringColor}40`,
                }}
              >
                {badge.tierLabel}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {badge.tokenDesign.glyphMeaning}
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
              <span>{badge.title}</span>
              <button
                onClick={handleSpeakTitle}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition cursor-pointer"
                title="Pronounce Title"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </h3>

            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="font-olchiki text-emerald-400 font-bold text-lg">
                {badge.tribalTitle}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{badge.hindiTitle}</span>
            </div>
          </div>

          {/* Milestone Description */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed text-left w-full space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Milestone Objective:</span>
            </div>
            <p>{badge.description}</p>

            {/* Progress Bar */}
            <div className="pt-2 space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Progress:</span>
                <span className={badge.isUnlocked ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {badge.progress} / {badge.target}{' '}
                  {badge.isUnlocked ? '(100% Done)' : `(${Math.round((badge.progress / badge.target) * 100)}%)`}
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(100, (badge.progress / badge.target) * 100)}%`,
                    backgroundColor: badge.isUnlocked ? badge.tokenDesign.ringColor : badge.tokenDesign.primaryColor,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Offline Authenticity & Metadata Stamp */}
          {badge.isUnlocked ? (
            <div className="grid grid-cols-2 gap-3 w-full text-left text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <Hash className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Digital Token Serial</div>
                  <div className="font-mono text-emerald-400 font-bold text-[11px]">
                    {badge.tokenSerial || 'PLSH-VERIFIED-OFFLINE'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Unlocked On</div>
                  <div className="text-slate-200 font-medium text-[11px]">
                    {badge.unlockedAt || 'Today'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Complete quest challenges to unlock this token.</span>
              </div>
              {onPlayMode && (
                <button
                  onClick={() => {
                    onPlayMode(targetMode);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[11px] transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Play</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Footer Close / Action */}
          <div className="w-full pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

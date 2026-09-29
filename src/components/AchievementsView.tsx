import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Lock,
  Flame,
  ArrowRight,
  Filter,
  Layers,
  Database,
  BarChart3
} from 'lucide-react';
import { AchievementBadge, BadgeCategory, QuestStats } from '../types';
import { DigitalTokenIcon } from './DigitalTokenIcon';
import { achievementsEngine } from '../engine/achievementsEngine';
import { AchievementInspectModal } from './AchievementInspectModal';

interface AchievementsViewProps {
  stats: QuestStats;
  badges: AchievementBadge[];
  onPlayMode?: (mode: 'birsa_archer' | 'mandar_drum' | 'word_jumble') => void;
  onRefresh?: () => void;
  onOpenAnalytics?: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  stats,
  badges,
  onPlayMode,
  onRefresh,
  onOpenAnalytics,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [inspectingBadge, setInspectingBadge] = useState<AchievementBadge | null>(null);

  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const totalCount = badges.length;
  const completionPct = Math.round((unlockedCount / totalCount) * 100);

  // Filtered badges
  const filteredBadges = badges.filter(b => {
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unlocked' && b.isUnlocked) ||
      (statusFilter === 'locked' && !b.isUnlocked);
    return matchesCategory && matchesStatus;
  });

  const handleReset = () => {
    if (confirm('Reset your Tribal Quest achievements and token collection? This is useful for classroom student testing.')) {
      achievementsEngine.resetAchievements();
      if (onRefresh) onRefresh();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Stats Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Indigenous Token System</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-950/80 text-teal-300 text-[11px] font-mono border border-slate-800 flex items-center gap-1">
                <Database className="w-3 h-3 text-teal-400" />
                <span>Offline LocalStorage Synced</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Tribal Quest Badges & Digital Tokens</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Unlock authentic digital tokens inscribed with sacred Ol Chiki glyphs (ᱚ, ᱛ, ᱯ, ᱥ, ᱜ, ᱢ) by conquering indigenous literacy challenges across Eastern India.
            </p>
          </div>

          {/* Metric Cards Banner */}
          <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 p-3.5 rounded-2xl shadow-inner shrink-0">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Tokens Minted</div>
              <div className="text-xl font-extrabold text-amber-400 font-mono">
                {unlockedCount} / {totalCount}
              </div>
            </div>

            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Mastery</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">
                {completionPct}%
              </div>
            </div>

            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-0.5">
                <Flame className="w-3 h-3 text-orange-500" />
                Peak Streak
              </div>
              <div className="text-xl font-extrabold text-orange-400 font-mono">
                {stats.highestStreak}x
              </div>
            </div>

            <div className="text-center pl-2">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Sal Leaves</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono flex items-center justify-center gap-1">
                <span>🍃</span>
                <span>{stats.salLeaves}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Token Collection Completion:</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {unlockedCount} of {totalCount} Milestones Claimed
            </span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.max(5, completionPct)}%` }}
            />
          </div>
        </div>

        {/* Link to D3 Progress Analytics */}
        {onOpenAnalytics && (
          <div className="mt-4 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-slate-300">
                Track student learning velocity, accuracy trends, and milestone pins on the <strong>D3 Progress Analytics</strong> dashboard.
              </span>
            </div>
            <button
              onClick={onOpenAnalytics}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm self-start sm:self-auto"
            >
              <span>View D3 Trajectory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Filter and Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'combat', label: '🏹 Birsa Archer' },
            { id: 'rhythm', label: '🥁 Mandar Drum' },
            { id: 'puzzle', label: '🧩 Ol Chiki Jumble' },
            { id: 'streak', label: '🔥 Streaks' },
            { id: 'mastery', label: '👑 Mastery' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-850'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Filter Toggle & Reset Button */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-0.5 flex">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                statusFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({badges.length})
            </button>
            <button
              onClick={() => setStatusFilter('unlocked')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                statusFilter === 'unlocked' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setStatusFilter('locked')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                statusFilter === 'locked' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Locked ({totalCount - unlockedCount})
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-red-400 border border-slate-800 transition cursor-pointer"
            title="Reset quest tokens for fresh classroom session"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Dynamic Tokens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map(badge => {
          return (
            <div
              key={badge.id}
              onClick={() => setInspectingBadge(badge)}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                badge.isUnlocked
                  ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-950/30 hover:-translate-y-1'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              {/* Top Row: Token Icon & Header Details */}
              <div className="flex items-start gap-4">
                <DigitalTokenIcon
                  badge={badge}
                  size="md"
                  interactive={true}
                  showProgressRing={true}
                  className="shrink-0"
                />

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="px-2 py-0.2 rounded-md text-[9px] font-bold uppercase tracking-wider border"
                      style={{
                        backgroundColor: `${badge.tokenDesign.primaryColor}20`,
                        color: badge.tokenDesign.ringColor,
                        borderColor: `${badge.tokenDesign.ringColor}40`,
                      }}
                    >
                      {badge.tier}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono truncate">
                      {badge.tokenDesign.glyphMeaning}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition truncate">
                    {badge.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-olchiki text-emerald-400 font-semibold">
                      {badge.tribalTitle}
                    </span>
                    <span className="text-slate-500 text-[10px]">•</span>
                    <span className="text-slate-400 text-[11px] truncate">
                      {badge.hindiTitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Requirement Text */}
              <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                {badge.description}
              </p>

              {/* Bottom Row: Status / Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {badge.isUnlocked ? (
                  <>
                    <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Minted: {badge.tokenSerial || 'PLSH-VERIFIED'}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {badge.unlockedAt || 'Ready'}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex-1 mr-3 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Progress:</span>
                        <span>{badge.progress} / {badge.target}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (badge.progress / badge.target) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 flex items-center gap-0.5 shrink-0">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Token Inspect Modal */}
      <AchievementInspectModal
        badge={inspectingBadge}
        onClose={() => setInspectingBadge(null)}
        onPlayMode={onPlayMode}
      />
    </div>
  );
};

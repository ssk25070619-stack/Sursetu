import React, { useState } from 'react';
import {
  Users,
  Award,
  Flame,
  CheckCircle2,
  TrendingUp,
  Target,
  Music,
  Puzzle,
  FileText,
  Sparkles,
  ArrowRight,
  BookOpen,
  Printer,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { AchievementBadge, QuestStats, StudentLearningProfile } from '../../types';
import {
  buildActiveUserProfile,
  CLASSROOM_STUDENT_PROFILES,
} from '../../data/studentAnalyticsData';
import { TribalRadarChart } from './TribalRadarChart';
import { TribalTimelineChart } from './TribalTimelineChart';
import { DigitalTokenIcon } from '../DigitalTokenIcon';

interface TribalLearningPatternsViewProps {
  stats: QuestStats;
  badges: AchievementBadge[];
  onPlayMode?: (mode: 'birsa_archer' | 'mandar_drum' | 'word_jumble') => void;
}

export const TribalLearningPatternsView: React.FC<TribalLearningPatternsViewProps> = ({
  stats,
  badges,
  onPlayMode,
}) => {
  // Build active profile from live user quest stats
  const activeUserProfile = buildActiveUserProfile(stats, badges);

  // Combine active user with classroom cohort profiles
  const allProfiles: StudentLearningProfile[] = [
    activeUserProfile,
    ...CLASSROOM_STUDENT_PROFILES,
  ];

  const [selectedStudentId, setSelectedStudentId] = useState<string>(activeUserProfile.id);

  // Find currently selected student
  const currentStudent =
    allProfiles.find((p) => p.id === selectedStudentId) || activeUserProfile;

  const totalQuestions = currentStudent.stats.totalQuestionsAnswered;
  const accuracyPct =
    totalQuestions > 0
      ? Math.round((currentStudent.stats.correctAnswers / totalQuestions) * 100)
      : 80;

  const unlockedBadges = badges.filter((b) =>
    currentStudent.stats.unlockedBadgeIds.includes(b.id)
  );

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Teacher Dashboard Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Teacher Analytics Dashboard</span>
              </span>
              <span className="text-xs text-slate-400">
                D3.js Learning Trajectory & FLN Competency Tracker
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-mono border border-emerald-500/20">
                NIPUN Bharat Aligned
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Student Learning Patterns & Milestones</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Visualizes longitudinal skill formation, auditory phonological retention, and Ol Chiki orthographic mastery across student learning sessions.
            </p>
          </div>

          {/* Quick Print / Export Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrintReport}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Print classroom student progress report"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Print Diagnostic Sheet</span>
            </button>
          </div>
        </div>

        {/* Student Profile Switcher Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Select Student Profile for Diagnostic Review:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allProfiles.map((student) => {
              const isSelected = student.id === selectedStudentId;
              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-950'
                      : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{student.name}</span>
                  <span className="font-olchiki text-[11px] opacity-80">
                    ({student.tribalName})
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/80 border border-slate-700 font-mono">
                    {student.grade}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Student Profile Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
            {currentStudent.name.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{currentStudent.name}</span>
                <span className="font-olchiki text-emerald-400 text-base font-normal">
                  ({currentStudent.tribalName})
                </span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                {currentStudent.nipunLevel}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
              <span>Roll No: <strong className="text-slate-200">{currentStudent.rollNo}</strong></span>
              <span>•</span>
              <span>{currentStudent.grade}</span>
              <span>•</span>
              <span>{currentStudent.schoolVillage}</span>
            </div>
          </div>
        </div>

        {/* Student Metric Badges */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-950/90 border border-slate-800 p-2.5 rounded-2xl shrink-0">
          <div className="text-center px-3 border-r border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total XP</div>
            <div className="text-lg font-black text-amber-400 font-mono">
              {currentStudent.stats.totalScore}
            </div>
          </div>

          <div className="text-center px-3 border-r border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Accuracy</div>
            <div className="text-lg font-black text-emerald-400 font-mono">
              {accuracyPct}%
            </div>
          </div>

          <div className="text-center px-3 border-r border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-0.5">
              <Flame className="w-3 h-3 text-orange-500" />
              Streak
            </div>
            <div className="text-lg font-black text-orange-400 font-mono">
              {currentStudent.stats.highestStreak}x
            </div>
          </div>

          <div className="text-center px-2">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Tokens</div>
            <div className="text-lg font-black text-amber-300 font-mono flex items-center justify-center gap-1">
              <span>🏆</span>
              <span>{currentStudent.stats.unlockedBadgeIds.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* D3 VISUAL PROGRESS CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: D3 Learning Velocity Timeline (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <TribalTimelineChart student={currentStudent} width={580} height={360} />

          {/* Mode-by-Mode Mastery Bars */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Modal Proficiency Breakdown</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                Win Rate Across Challenge Types
              </span>
            </div>

            {/* Mode 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>Birsa Archer (Visual Word Target)</span>
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  {currentStudent.stats.mode1Wins} Wins
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (currentStudent.stats.mode1Wins / 12) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Mode 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-teal-400" />
                  <span>Mandar Drum (Auditory Decoding)</span>
                </span>
                <span className="font-mono text-teal-300 font-bold">
                  {currentStudent.stats.mode2Wins} Wins
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (currentStudent.stats.mode2Wins / 12) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Mode 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Puzzle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ol Chiki Jumble (Orthographic Sequence)</span>
                </span>
                <span className="font-mono text-emerald-300 font-bold">
                  {currentStudent.stats.mode3Wins} Wins
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (currentStudent.stats.mode3Wins / 12) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: D3 FLN Competency Radar (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <TribalRadarChart student={currentStudent} width={380} height={360} />

          {/* Teacher Diagnostic Observations Card */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Pedagogical Diagnostic Card</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                MTB-MLE Focus
              </span>
            </div>

            {/* Strengths & Growth Areas */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
                <div className="font-semibold text-emerald-300 text-[11px] mb-0.5">
                  ⭐ Core Strength:
                </div>
                <p>{currentStudent.strengthArea}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200">
                <div className="font-semibold text-amber-300 text-[11px] mb-0.5">
                  🎯 Targeted Remediation:
                </div>
                <p>{currentStudent.growthArea}</p>
              </div>
            </div>

            {/* Teacher Notes */}
            <div className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Teacher Observation Notes:
              </div>
              <p>{currentStudent.teacherNotes}</p>
            </div>

            {/* Actionable Quest Link */}
            {onPlayMode && (
              <button
                onClick={() => {
                  const target =
                    currentStudent.competencyScores.orthographicAssembly < 65
                      ? 'word_jumble'
                      : currentStudent.competencyScores.auditoryDecoding < 75
                      ? 'mandar_drum'
                      : 'birsa_archer';
                  onPlayMode(target);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40"
              >
                <span>Launch Targeted Classroom Exercise</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Unlocked Digital Tokens Showcase for this Student */}
      {unlockedBadges.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Earned Milestone Tokens ({unlockedBadges.length})
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Permanent Offline Verified Cryptographic Badges
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-2 group hover:border-amber-400 transition"
              >
                <DigitalTokenIcon badge={badge} size="sm" showProgressRing={false} />
                <div className="text-[11px] font-bold text-white truncate max-w-full">
                  {badge.title}
                </div>
                <div className="font-olchiki text-[10px] text-emerald-400">
                  {badge.tribalTitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

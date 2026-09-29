import React, { useState, useEffect } from 'react';
import {
  Activity,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Target,
  FileText,
  Download,
  Sparkles,
  Zap,
  ArrowRight,
  Printer,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import {
  adaptiveWorksheetService,
  StudentMasteryProfile,
  CompetencyId,
  DEFAULT_COMPETENCIES,
} from '../services/adaptiveWorksheetService';
import { AnswerNormalizationPipeline, EvaluationResult } from '../engine/answerNormalization';
import { DocxExportService } from '../services/docxExportService';
import confetti from 'canvas-confetti';

export const LearningDiagnosticsView: React.FC = () => {
  const [profiles, setProfiles] = useState<StudentMasteryProfile[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std_02');
  const [testInput, setTestInput] = useState<string>('1/2');
  const [testExpected, setTestExpected] = useState<string>('0.5');
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [generatedAdaptivePlan, setGeneratedAdaptivePlan] = useState<any>(null);

  useEffect(() => {
    const all = adaptiveWorksheetService.getAllProfiles();
    setProfiles(all);
    if (all.length > 0) {
      setSelectedStudentId(all[1]?.studentId || all[0].studentId);
    }
    handleRunSandboxEval('1/2', '0.5');
  }, []);

  const handleRunSandboxEval = (input: string, expected: string) => {
    const res = AnswerNormalizationPipeline.evaluate(input, expected);
    setEvalResult(res);
  };

  const handleGenerateAdaptiveWorksheet = (studentId: string) => {
    const plan = adaptiveWorksheetService.generateAdaptivePlan(studentId);
    setGeneratedAdaptivePlan(plan);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleExportDocx = (plan: any) => {
    DocxExportService.exportWorksheetDocx({
      title: `Personalized Remedial Worksheet for ${plan.studentName}`,
      grade: 'Grade 1',
      langLabel: 'Santali (Ol Chiki) & Hindi Bilingual',
      items: [
        { num: 1, prompt: 'संख्या पहचान एवं गिनती (Numeracy & Counting):', promptNative: 'ᱢᱤᱫ (1) + ᱵᱟᱨ (2) = ?', answerLine: '_______' },
        { num: 2, prompt: 'सही कारक चिन्ह पहचानें (Case Marker):', promptNative: 'ᱫᱟᱨᱮ + ᱨᱮ = ? (In the tree)', answerLine: '_______' },
        { num: 3, prompt: 'ओल चिकी वर्णमाला अभ्यास (Grapheme formation):', promptNative: 'ᱚᱞ ᱪᱤᱠᱤ: ᱫ ᱟ ᱜ (Water)', answerLine: '_______' },
        { num: 4, prompt: 'वाक्य क्रम सही करें (SOV Order):', promptNative: 'ᱱᱚᱶᱟ ᱫᱚ ᱫᱟᱨᱮ ᱠᱟᱱᱟ (This is a tree)', answerLine: '_______' },
      ],
      answerKey: ['1. ᱯᱮ (3)', '2. ᱫᱟᱨᱮᱨᱮ (Dare-re)', '3. ᱫᱟᱜ (Da-k\')', '4. ᱱᱚᱶᱟ ᱫᱚ ᱫᱟᱨᱮ ᱠᱟᱱᱟ'],
    });
  };

  const selectedProfile = profiles.find((p) => p.studentId === selectedStudentId) || profiles[0];

  return (
    <div className="space-y-6">
      {/* Top Banner with Aurora Glow */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-amber-500/30">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-950/50 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Brain className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">Pedagogical Learning Diagnostics & Misconception Engine</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                  SurSetu 3.0 Adaptive Core
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                5-Tier Answer Normalization, Student Mastery Tensors, and Automated Remedial Worksheet Synthesis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleGenerateAdaptiveWorksheet(selectedStudentId)}
              className="btn-shimmer px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/50 glow-emerald"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Adaptive Worksheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Total Students
          </span>
          <div className="text-2xl font-extrabold text-white mt-2 font-mono">{profiles.length || 4} Tracked</div>
          <span className="text-[10px] text-emerald-400 mt-1">Classroom Section A (Grade 1-2)</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-amber-400" /> Avg. FLN Mastery
          </span>
          <div className="text-2xl font-extrabold text-amber-300 mt-2 font-mono">
            {profiles.length > 0 ? Math.round((profiles.reduce((acc, p) => acc + p.overallMastery, 0) / profiles.length) * 100) : 68}%
          </div>
          <span className="text-[10px] text-amber-400 mt-1">NIPUN Bharat Target: 75%</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Normalization Engine
          </span>
          <div className="text-2xl font-extrabold text-cyan-300 mt-2 font-mono">5 Tiers Active</div>
          <span className="text-[10px] text-cyan-400 mt-1">Voice • Unicode • Fuzzy Ratcliff</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Critical Gap Rate
          </span>
          <div className="text-2xl font-extrabold text-red-400 mt-2 font-mono">18.5%</div>
          <span className="text-[10px] text-red-400 mt-1">Targeted by Adaptive Engine</span>
        </div>
      </div>

      {/* 1. Classroom Competency Mastery Heatmap */}
      <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Classroom FLN Competency Mastery Heatmap</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Mastered (≥70%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Transitioning (50-70%)
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical Gap (&lt;50%)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3 pl-4">Student</th>
                <th className="p-3 text-center">Numeracy (०-९ ⇄ ᱐-᱙)</th>
                <th className="p-3 text-center">Vocabulary Lemmas</th>
                <th className="p-3 text-center">Ol Chiki Tracing</th>
                <th className="p-3 text-center">SOV Syntax & -re</th>
                <th className="p-3 text-center">Story Reading</th>
                <th className="p-3 text-center">Overall</th>
                <th className="p-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {profiles.map((p) => {
                const isSelected = p.studentId === selectedStudentId;
                return (
                  <tr
                    key={p.studentId}
                    onClick={() => setSelectedStudentId(p.studentId)}
                    className={`cursor-pointer transition ${isSelected ? 'bg-emerald-950/40' : 'hover:bg-slate-800/40'}`}
                  >
                    <td className="p-3 pl-4 font-bold text-white flex items-center gap-2">
                      <span>{p.studentName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({p.grade})</span>
                    </td>

                    {/* Heatmap Cells */}
                    {(['FLN_NUMERACY', 'VOCABULARY_LEMMAS', 'OL_CHIKI_TRACING', 'SYNTAX_GRAMMAR', 'ORAL_READING'] as CompetencyId[]).map((cid) => {
                      const comp = p.competencies[cid];
                      const score = comp?.masteryScore || 0;
                      let bg = 'bg-red-500/20 text-red-400 border-red-500/30';
                      if (score >= 0.7) bg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold';
                      else if (score >= 0.5) bg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';

                      return (
                        <td key={cid} className="p-2 text-center">
                          <span className={`inline-block px-2 py-1 rounded-md text-[11px] font-mono border ${bg}`}>
                            {Math.round(score * 100)}%
                          </span>
                        </td>
                      );
                    })}

                    <td className="p-3 text-center font-mono font-bold text-white">
                      {Math.round(p.overallMastery * 100)}%
                    </td>

                    <td className="p-3 pr-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudentId(p.studentId);
                          handleGenerateAdaptiveWorksheet(p.studentId);
                        }}
                        className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-[11px] font-medium transition cursor-pointer"
                      >
                        Adaptive Plan
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Adaptive Remedial Plan Generated Preview */}
      {generatedAdaptivePlan && (
        <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/50 rounded-2xl p-6 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Adaptive Remedial Worksheet Synthesized for {generatedAdaptivePlan.studentName}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportDocx(generatedAdaptivePlan)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Word (.DOCX)</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print A4</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-emerald-300 font-medium">
            🎯 <strong>Diagnostic Prescription:</strong> {generatedAdaptivePlan.remedialFocus}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-red-500/30 text-xs space-y-1">
              <span className="font-bold text-red-400 uppercase tracking-wider text-[10px]">Critical Gaps Targeted:</span>
              <p className="text-slate-200">
                {generatedAdaptivePlan.criticalGaps.length > 0
                  ? generatedAdaptivePlan.criticalGaps.map((g: any) => g.name).join(', ')
                  : 'None (Student performing above 50%)'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30 text-xs space-y-1">
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">Worksheet Types Assembled:</span>
              <p className="text-slate-200 uppercase font-mono">
                {generatedAdaptivePlan.recommendedWorksheetTypes.join(' • ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. 5-Tier Answer Normalization Sandbox & Live Misconception Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">5-Tier Answer Normalization Sandbox</h3>
              <p className="text-[11px] text-slate-400">
                Test how SurSetu 3.0 evaluates multi-script, fraction, and phonetic answers across all 5 tiers.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="text-xs text-slate-300 font-semibold">Student Spoken / Typed Input:</label>
              <input
                type="text"
                value={testInput}
                onChange={(e) => {
                  setTestInput(e.target.value);
                  handleRunSandboxEval(e.target.value, testExpected);
                }}
                className="w-full text-xs font-mono p-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-amber-300 mt-1.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold">Expected Standard Answer:</label>
              <input
                type="text"
                value={testExpected}
                onChange={(e) => {
                  setTestExpected(e.target.value);
                  handleRunSandboxEval(testInput, e.target.value);
                }}
                className="w-full text-xs font-mono p-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-200 mt-1.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Quick Test Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Presets:</span>
              <button
                onClick={() => {
                  setTestInput('1/2');
                  setTestExpected('0.5');
                  handleRunSandboxEval('1/2', '0.5');
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer"
              >
                Fraction (1/2 ⇄ 0.5)
              </button>
              <button
                onClick={() => {
                  setTestInput('ᱢᱤᱫ');
                  setTestExpected('1');
                  handleRunSandboxEval('ᱢᱤᱫ', '1');
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer"
              >
                Vernacular Word (ᱢᱤᱫ ⇄ 1)
              </button>
              <button
                onClick={() => {
                  setTestInput('ᱫᱟᱨᱮ');
                  setTestExpected('ᱫᱟᱨᱮ-ᱨᱮ');
                  handleRunSandboxEval('ᱫᱟᱨᱮ', 'ᱫᱟᱨᱮ-ᱨᱮ');
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer"
              >
                Postposition Misconception
              </button>
            </div>
          </div>
        </div>

        {/* Evaluation Output Card */}
        {evalResult && (
          <div className="glass-card rounded-2xl p-6 shadow-xl space-y-4 border border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Diagnostic Evaluation Output</h4>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  evalResult.isCorrect
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 glow-emerald'
                    : 'bg-red-950/80 text-red-300 border-red-500/50'
                }`}
              >
                {evalResult.isCorrect ? '✅ ACCEPTED / CORRECT' : '❌ MISCONCEPTION DETECTED'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Matched Tier:</span>
                <span className="font-mono font-bold text-amber-300 uppercase">{evalResult.matchedTier}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Score & Similarity:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {evalResult.score} / 1.0 ({Math.round(evalResult.similarityRatio * 100)}%)
                </span>
              </div>

              {evalResult.misconception && (
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-red-300 font-bold">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Archetype: {evalResult.misconception.label}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{evalResult.misconception.explanation}</p>
                  <div className="pt-2 border-t border-red-900/40 text-[11px] text-emerald-300 font-medium">
                    <strong>Prescription:</strong> {evalResult.misconception.remedialAction}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

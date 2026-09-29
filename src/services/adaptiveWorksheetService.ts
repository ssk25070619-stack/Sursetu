/**
 * SurSetu 3.0 - Adaptive Worksheet & Diagnostic Generator
 * ----------------------------------------------------------
 * Computes individual student mastery tensors across 6 core FLN competencies:
 * 1. FLN_NUMERACY: Math counting & digits (0-9 ⇄ ᱐-᱙ ⇄ ୦-୯)
 * 2. VOCABULARY_LEMMAS: Primary nouns & everyday objects
 * 3. OL_CHIKI_TRACING: Grapheme formation & diacritics
 * 4. SYNTAX_GRAMMAR: SOV word order & postposition fusion (-re, -khon, -ak)
 * 5. ORAL_READING: Bilingual story reading fluency
 * 6. CULTURAL_RHYMES: Folk idioms & action songs
 * 
 * Automatically synthesizes targeted remedial worksheets prioritizing Critical Gaps (<50%).
 */

export type CompetencyId =
  | 'FLN_NUMERACY'
  | 'VOCABULARY_LEMMAS'
  | 'OL_CHIKI_TRACING'
  | 'SYNTAX_GRAMMAR'
  | 'ORAL_READING'
  | 'CULTURAL_RHYMES';

export interface CompetencyStatus {
  id: CompetencyId;
  name: string;
  nameHindi: string;
  masteryScore: number; // 0.0 - 1.0
  status: 'critical_gap' | 'transitioning' | 'mastered';
  attemptsCount: number;
  lastAttemptDate: string;
}

export interface StudentMasteryProfile {
  studentId: string;
  studentName: string;
  grade: string;
  schoolName: string;
  competencies: Record<CompetencyId, CompetencyStatus>;
  overallMastery: number;
  recentMisconceptions: string[];
}

const STORAGE_KEY = 'sursetu_student_mastery_profiles_v3';

export const DEFAULT_COMPETENCIES: Record<CompetencyId, { name: string; nameHindi: string }> = {
  FLN_NUMERACY: { name: 'FLN Numeracy & Digits', nameHindi: 'संख्या ज्ञान एवं गिनती (०-९ ⇄ ᱐-᱙)' },
  VOCABULARY_LEMMAS: { name: 'Core Vocabulary Lemmas', nameHindi: 'प्राथमिक शब्द भंडार' },
  OL_CHIKI_TRACING: { name: 'Ol Chiki Script Formation', nameHindi: 'ओल चिकी वर्णमाला अभ्यास' },
  SYNTAX_GRAMMAR: { name: 'SOV Grammar & Postpositions', nameHindi: 'वाक्य रचना एवं कारक (-re, -khon)' },
  ORAL_READING: { name: 'Bilingual Story Fluency', nameHindi: 'द्विभाषी पठन प्रवाह' },
  CULTURAL_RHYMES: { name: 'Cultural Rhymes & Folklore', nameHindi: 'पारंपरिक बालगीत एवं संस्कृति' },
};

class AdaptiveWorksheetService {
  private profiles: Record<string, StudentMasteryProfile> = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadProfiles();
    }
  }

  private loadProfiles() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.profiles = JSON.parse(stored);
      } else {
        this.initDemoProfiles();
      }
    } catch {
      this.initDemoProfiles();
    }
  }

  private initDemoProfiles() {
    // Demo Class: 4 Students
    this.profiles = {
      std_01: {
        studentId: 'std_01',
        studentName: 'Sumi Marandi',
        grade: 'Grade 1',
        schoolName: 'Govt. Primary Ashram School, Mayurbhanj',
        overallMastery: 0.84,
        recentMisconceptions: ['SCRIPT_DIACRITIC'],
        competencies: {
          FLN_NUMERACY: { id: 'FLN_NUMERACY', name: DEFAULT_COMPETENCIES.FLN_NUMERACY.name, nameHindi: DEFAULT_COMPETENCIES.FLN_NUMERACY.nameHindi, masteryScore: 0.95, status: 'mastered', attemptsCount: 14, lastAttemptDate: '2026-09-24' },
          VOCABULARY_LEMMAS: { id: 'VOCABULARY_LEMMAS', name: DEFAULT_COMPETENCIES.VOCABULARY_LEMMAS.name, nameHindi: DEFAULT_COMPETENCIES.VOCABULARY_LEMMAS.nameHindi, masteryScore: 0.90, status: 'mastered', attemptsCount: 18, lastAttemptDate: '2026-09-24' },
          OL_CHIKI_TRACING: { id: 'OL_CHIKI_TRACING', name: DEFAULT_COMPETENCIES.OL_CHIKI_TRACING.name, nameHindi: DEFAULT_COMPETENCIES.OL_CHIKI_TRACING.nameHindi, masteryScore: 0.82, status: 'mastered', attemptsCount: 10, lastAttemptDate: '2026-09-23' },
          SYNTAX_GRAMMAR: { id: 'SYNTAX_GRAMMAR', name: DEFAULT_COMPETENCIES.SYNTAX_GRAMMAR.name, nameHindi: DEFAULT_COMPETENCIES.SYNTAX_GRAMMAR.nameHindi, masteryScore: 0.72, status: 'mastered', attemptsCount: 8, lastAttemptDate: '2026-09-22' },
          ORAL_READING: { id: 'ORAL_READING', name: DEFAULT_COMPETENCIES.ORAL_READING.name, nameHindi: DEFAULT_COMPETENCIES.ORAL_READING.nameHindi, masteryScore: 0.88, status: 'mastered', attemptsCount: 12, lastAttemptDate: '2026-09-25' },
          CULTURAL_RHYMES: { id: 'CULTURAL_RHYMES', name: DEFAULT_COMPETENCIES.CULTURAL_RHYMES.name, nameHindi: DEFAULT_COMPETENCIES.CULTURAL_RHYMES.nameHindi, masteryScore: 0.78, status: 'mastered', attemptsCount: 6, lastAttemptDate: '2026-09-20' },
        },
      },
      std_02: {
        studentId: 'std_02',
        studentName: 'Birsa Soren',
        grade: 'Grade 1',
        schoolName: 'Govt. Primary Ashram School, Mayurbhanj',
        overallMastery: 0.58,
        recentMisconceptions: ['POSTPOSITION_MISMATCH', 'SYNTAX_ORDER'],
        competencies: {
          FLN_NUMERACY: { id: 'FLN_NUMERACY', name: DEFAULT_COMPETENCIES.FLN_NUMERACY.name, nameHindi: DEFAULT_COMPETENCIES.FLN_NUMERACY.nameHindi, masteryScore: 0.75, status: 'mastered', attemptsCount: 11, lastAttemptDate: '2026-09-25' },
          VOCABULARY_LEMMAS: { id: 'VOCABULARY_LEMMAS', name: DEFAULT_COMPETENCIES.VOCABULARY_LEMMAS.name, nameHindi: DEFAULT_COMPETENCIES.VOCABULARY_LEMMAS.nameHindi, masteryScore: 0.65, status: 'transitioning', attemptsCount: 15, lastAttemptDate: '2026-09-24' },
          OL_CHIKI_TRACING: { id: 'OL_CHIKI_TRACING', name: DEFAULT_COMPETENCIES.OL_CHIKI_TRACING.name, nameHindi: DEFAULT_COMPETENCIES.OL_CHIKI_TRACING.nameHindi, masteryScore: 0.45, status: 'critical_gap', attemptsCount: 7, lastAttemptDate: '2026-09-21' },
          SYNTAX_GRAMMAR: { id: 'SYNTAX_GRAMMAR', name: DEFAULT_COMPETENCIES.SYNTAX_GRAMMAR.name, nameHindi: DEFAULT_COMPETENCIES.SYNTAX_GRAMMAR.nameHindi, masteryScore: 0.40, status: 'critical_gap', attemptsCount: 6, lastAttemptDate: '2026-09-22' },
          ORAL_READING: { id: 'ORAL_READING', name: DEFAULT_COMPETENCIES.ORAL_READING.name, nameHindi: DEFAULT_COMPETENCIES.ORAL_READING.nameHindi, masteryScore: 0.62, status: 'transitioning', attemptsCount: 9, lastAttemptDate: '2026-09-25' },
          CULTURAL_RHYMES: { id: 'CULTURAL_RHYMES', name: DEFAULT_COMPETENCIES.CULTURAL_RHYMES.name, nameHindi: DEFAULT_COMPETENCIES.CULTURAL_RHYMES.nameHindi, masteryScore: 0.60, status: 'transitioning', attemptsCount: 5, lastAttemptDate: '2026-09-19' },
        },
      },
    };
    this.saveProfiles();
  }

  private saveProfiles() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profiles));
    } catch {
      // ignore
    }
  }

  public getAllProfiles(): StudentMasteryProfile[] {
    return Object.values(this.profiles);
  }

  public getProfile(studentId: string): StudentMasteryProfile | undefined {
    return this.profiles[studentId];
  }

  /**
   * Record a quiz attempt or worksheet score to update competency mastery
   */
  public recordCompetencyScore(
    studentId: string,
    competencyId: CompetencyId,
    score: number,
    misconceptionType?: string
  ) {
    const profile = this.profiles[studentId];
    if (!profile) return;

    const comp = profile.competencies[competencyId];
    if (!comp) return;

    // Exponential moving average for smooth mastery progression
    comp.masteryScore = Math.round((comp.masteryScore * 0.7 + score * 0.3) * 100) / 100;
    comp.attemptsCount += 1;
    comp.lastAttemptDate = new Date().toISOString().split('T')[0];

    if (comp.masteryScore >= 0.7) comp.status = 'mastered';
    else if (comp.masteryScore >= 0.5) comp.status = 'transitioning';
    else comp.status = 'critical_gap';

    if (misconceptionType && misconceptionType !== 'NONE') {
      profile.recentMisconceptions.unshift(misconceptionType);
      if (profile.recentMisconceptions.length > 5) profile.recentMisconceptions.pop();
    }

    // Recompute overall mastery
    const scores = Object.values(profile.competencies).map((c) => c.masteryScore);
    profile.overallMastery = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100;

    this.saveProfiles();
  }

  /**
   * Generate an adaptive remedial worksheet layout for a specific student
   */
  public generateAdaptivePlan(studentId: string): {
    studentName: string;
    criticalGaps: CompetencyStatus[];
    transitioning: CompetencyStatus[];
    recommendedWorksheetTypes: string[];
    remedialFocus: string;
  } {
    const profile = this.profiles[studentId] || Object.values(this.profiles)[0];
    const competencies = Object.values(profile.competencies);

    const criticalGaps = competencies.filter((c) => c.status === 'critical_gap');
    const transitioning = competencies.filter((c) => c.status === 'transitioning');

    const recommendedTypes: string[] = [];
    if (criticalGaps.some((c) => c.id === 'OL_CHIKI_TRACING')) recommendedTypes.push('tracing');
    if (criticalGaps.some((c) => c.id === 'FLN_NUMERACY')) recommendedTypes.push('counting');
    if (criticalGaps.some((c) => c.id === 'VOCABULARY_LEMMAS')) recommendedTypes.push('matching', 'flashcards');
    if (criticalGaps.some((c) => c.id === 'SYNTAX_GRAMMAR')) recommendedTypes.push('fill_blanks', 'lesson_script');

    if (recommendedTypes.length === 0) {
      recommendedTypes.push('matching', 'assessment');
    }

    const remedialFocus =
      criticalGaps.length > 0
        ? `Remedial priority on ${criticalGaps.map((g) => g.name).join(' & ')}.`
        : 'Student is on track. Reinforcing transitioning competencies.';

    return {
      studentName: profile.studentName,
      criticalGaps,
      transitioning,
      recommendedWorksheetTypes: recommendedTypes,
      remedialFocus,
    };
  }
}

export const adaptiveWorksheetService = new AdaptiveWorksheetService();

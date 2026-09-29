import { StudentLearningProfile, QuestStats, SessionDataPoint, AchievementBadge } from '../types';
import { achievementsEngine } from '../engine/achievementsEngine';

/**
 * Builds a dynamic StudentLearningProfile reflecting the user's active local quest session
 */
export function buildActiveUserProfile(stats: QuestStats, badges: AchievementBadge[]): StudentLearningProfile {
  const total = stats.totalQuestionsAnswered;
  const accuracy = total > 0 ? Math.round((stats.correctAnswers / total) * 100) : 75;

  const visualScore = Math.min(100, Math.round((stats.mode1Wins / Math.max(1, stats.correctAnswers)) * 100 + 40));
  const auditoryScore = Math.min(100, Math.round((stats.mode2Wins / Math.max(1, stats.correctAnswers)) * 100 + 35));
  const jumbleScore = Math.min(100, Math.round((stats.mode3Wins / Math.max(1, stats.correctAnswers)) * 100 + 30));
  const streakScore = Math.min(100, stats.highestStreak * 10 + 20);
  const lexiconScore = Math.min(100, Math.round((stats.correctAnswers / 20) * 100 + 25));

  // Construct realistic timeline from question answers and unlocked badges
  const sampleHistory: SessionDataPoint[] = [];
  const sessionCount = Math.max(6, Math.min(15, stats.totalQuestionsAnswered || 8));

  let runningScore = 0;
  for (let i = 1; i <= sessionCount; i++) {
    const isStep = i === sessionCount;
    const addedScore = isStep
      ? Math.max(50, stats.totalScore - runningScore)
      : Math.floor(Math.random() * 60 + 40);
    runningScore += addedScore;

    const modes: ('birsa_archer' | 'mandar_drum' | 'word_jumble')[] = [
      'birsa_archer',
      'mandar_drum',
      'word_jumble',
    ];
    const chosenMode = modes[(i - 1) % 3];

    // Check if any badge corresponds to this step
    const matchingBadge = badges.find(
      (b) => b.isUnlocked && b.unlockedAt && Math.abs(b.target - i) <= 1
    );

    sampleHistory.push({
      sessionNumber: i,
      date: `Sep ${17 + Math.floor(i / 2)}`,
      cumulativeScore: Math.min(stats.totalScore || runningScore, runningScore),
      accuracyRate: Math.min(100, Math.max(45, Math.round(accuracy - (sessionCount - i) * 3 + Math.random() * 8))),
      streak: Math.min(stats.highestStreak || 3, Math.max(1, Math.round(i / 2))),
      mode: chosenMode,
      milestoneUnlocked: matchingBadge?.title,
      milestoneGlyph: matchingBadge?.tokenDesign.olChikiGlyph,
    });
  }

  // Determine NIPUN level
  let nipunLevel: StudentLearningProfile['nipunLevel'] = 'Emerging (ᱥᱟᱹᱨᱫᱤ)';
  if (stats.correctAnswers >= 15 || stats.totalScore >= 800) {
    nipunLevel = 'Master (ᱢᱟᱪᱮᱛ)';
  } else if (stats.correctAnswers >= 8 || stats.totalScore >= 400) {
    nipunLevel = 'Proficient (ᱡᱤᱛᱠᱟᱹᱨ)';
  } else if (stats.correctAnswers >= 3 || stats.totalScore >= 150) {
    nipunLevel = 'Developing (ᱞᱟᱦᱟ)';
  }

  return {
    id: 'current_learner',
    name: 'Current Classroom Student',
    tribalName: 'ᱱᱤᱛᱚᱜ ᱪᱮᱪᱮᱫᱤᱡ',
    rollNo: 'JH-2026-001',
    grade: 'Grade 2',
    schoolVillage: 'Govt. Primary Tribal School, Karandighi',
    avatarSeed: 'current',
    stats: { ...stats },
    competencyScores: {
      visualRecognition: visualScore,
      auditoryDecoding: auditoryScore,
      orthographicAssembly: jumbleScore,
      accuracyRate: accuracy,
      streakEndurance: streakScore,
      lexiconBreadth: lexiconScore,
    },
    learningHistory: sampleHistory,
    teacherNotes:
      stats.correctAnswers > 5
        ? 'Demonstrates rapid recognition of Ol Chiki characters with strong phonological recall. Excels in rapid target matching.'
        : 'Actively building foundational Mother Tongue vocabulary. Responds enthusiastically to acoustic Mandar audio prompts.',
    nipunLevel,
    strengthArea: visualScore >= auditoryScore ? 'Visual Ol Chiki Orthography' : 'Auditory Phonological Decoding',
    growthArea: jumbleScore < 60 ? 'Multi-glyph Ol Chiki Word Assembly' : 'High-Streak Consistency',
  };
}

/**
 * Pre-configured tribal classroom student cohort profiles for teacher tracking demonstrations
 */
export const CLASSROOM_STUDENT_PROFILES: StudentLearningProfile[] = [
  {
    id: 'hopna_soren',
    name: 'Hopna Soren',
    tribalName: 'ᱦᱚᱯᱱᱟ ᱥᱚᱨᱮᱱ',
    rollNo: 'OR-MBJ-014',
    grade: 'Grade 2',
    schoolVillage: 'Badampahar Ashram Vidyalaya, Mayurbhanj',
    avatarSeed: 'hopna',
    stats: {
      totalQuestionsAnswered: 24,
      correctAnswers: 21,
      mode1Wins: 11,
      mode2Wins: 6,
      mode3Wins: 4,
      highestStreak: 7,
      currentStreak: 4,
      totalScore: 1120,
      salLeaves: 38,
      modesPlayed: { birsa_archer: true, mandar_drum: true, word_jumble: true },
      unlockedBadgeIds: ['birsa_first_arrow', 'birsa_marksman', 'mandar_first_beat', 'warrior_focus'],
      unlockedTimestamps: {
        birsa_first_arrow: '18 Sep 2026',
        birsa_marksman: '21 Sep 2026',
        warrior_focus: '22 Sep 2026',
      },
      tokenSerials: {
        birsa_first_arrow: 'PLSH-BIR-88A1',
        birsa_marksman: 'PLSH-BIR-44C9',
        warrior_focus: 'PLSH-WAR-33B2',
      },
    },
    competencyScores: {
      visualRecognition: 94,
      auditoryDecoding: 78,
      orthographicAssembly: 68,
      accuracyRate: 88,
      streakEndurance: 82,
      lexiconBreadth: 90,
    },
    learningHistory: [
      { sessionNumber: 1, date: 'Sep 15', cumulativeScore: 120, accuracyRate: 65, streak: 2, mode: 'birsa_archer', milestoneUnlocked: 'First Bullseye', milestoneGlyph: 'ᱟ' },
      { sessionNumber: 2, date: 'Sep 16', cumulativeScore: 260, accuracyRate: 70, streak: 3, mode: 'mandar_drum' },
      { sessionNumber: 3, date: 'Sep 18', cumulativeScore: 480, accuracyRate: 80, streak: 4, mode: 'birsa_archer', milestoneUnlocked: "Birsa's Marksman", milestoneGlyph: 'ᱛ' },
      { sessionNumber: 4, date: 'Sep 20', cumulativeScore: 650, accuracyRate: 75, streak: 3, mode: 'word_jumble' },
      { sessionNumber: 5, date: 'Sep 21', cumulativeScore: 890, accuracyRate: 85, streak: 5, mode: 'birsa_archer', milestoneUnlocked: "Warrior's Focus", milestoneGlyph: 'ᱥ' },
      { sessionNumber: 6, date: 'Sep 22', cumulativeScore: 1120, accuracyRate: 88, streak: 7, mode: 'mandar_drum' },
    ],
    teacherNotes: 'Exceptional visual acuity for Ol Chiki consonants. Swift at target identification in Birsa Archer mode. Recommend extra Ol Chiki word jumbles for spelling mastery.',
    nipunLevel: 'Proficient (ᱡᱤᱛᱠᱟᱹᱨ)',
    strengthArea: 'Visual Ol Chiki Orthography & Speed',
    growthArea: 'Spelling Complex Clusters in Word Jumbles',
  },
  {
    id: 'muni_murmu',
    name: 'Muni Murmu',
    tribalName: 'ᱢᱩᱱᱤ ᱢᱩᱨᱢᱩ',
    rollNo: 'JH-DMK-007',
    grade: 'Grade 1',
    schoolVillage: 'Govt. Upgraded Tribal School, Dumka',
    avatarSeed: 'muni',
    stats: {
      totalQuestionsAnswered: 18,
      correctAnswers: 16,
      mode1Wins: 4,
      mode2Wins: 9,
      mode3Wins: 3,
      highestStreak: 6,
      currentStreak: 3,
      totalScore: 840,
      salLeaves: 26,
      modesPlayed: { birsa_archer: true, mandar_drum: true, word_jumble: true },
      unlockedBadgeIds: ['mandar_first_beat', 'forest_acoustician', 'olchiki_apprentice'],
      unlockedTimestamps: {
        mandar_first_beat: '19 Sep 2026',
        forest_acoustician: '22 Sep 2026',
      },
      tokenSerials: {
        mandar_first_beat: 'PLSH-MAN-99F2',
        forest_acoustician: 'PLSH-FOR-12D4',
      },
    },
    competencyScores: {
      visualRecognition: 72,
      auditoryDecoding: 96,
      orthographicAssembly: 60,
      accuracyRate: 89,
      streakEndurance: 76,
      lexiconBreadth: 82,
    },
    learningHistory: [
      { sessionNumber: 1, date: 'Sep 17', cumulativeScore: 90, accuracyRate: 75, streak: 2, mode: 'mandar_drum', milestoneUnlocked: 'Mandar Resonance', milestoneGlyph: 'ᱫ' },
      { sessionNumber: 2, date: 'Sep 18', cumulativeScore: 230, accuracyRate: 80, streak: 3, mode: 'birsa_archer' },
      { sessionNumber: 3, date: 'Sep 19', cumulativeScore: 390, accuracyRate: 84, streak: 4, mode: 'mandar_drum' },
      { sessionNumber: 4, date: 'Sep 21', cumulativeScore: 610, accuracyRate: 88, streak: 5, mode: 'mandar_drum', milestoneUnlocked: 'Forest Acoustician', milestoneGlyph: 'ᱨ' },
      { sessionNumber: 5, date: 'Sep 22', cumulativeScore: 840, accuracyRate: 89, streak: 6, mode: 'word_jumble' },
    ],
    teacherNotes: 'Outstanding phonological sensitivity. Recognizes subtle vowel lengths (ᱚ vs ᱟ) effortlessly via acoustic drum prompts. Gradually increasing familiarity with written Ol Chiki glyphs.',
    nipunLevel: 'Proficient (ᱡᱤᱛᱠᱟᱹᱨ)',
    strengthArea: 'Phonological Auditory Discrimination',
    growthArea: 'Letter Shape Tracing & Written Alignment',
  },
  {
    id: 'babulal_hembram',
    name: 'Babulal Hembram',
    tribalName: 'ᱵᱟᱹᱵᱩᱞᱟᱞ ᱦᱮᱢᱵᱽᱨᱚᱢ',
    rollNo: 'WB-PUR-021',
    grade: 'Grade 3',
    schoolVillage: 'Bandwan Tribal Model School, Purulia',
    avatarSeed: 'babulal',
    stats: {
      totalQuestionsAnswered: 32,
      correctAnswers: 29,
      mode1Wins: 10,
      mode2Wins: 9,
      mode3Wins: 10,
      highestStreak: 11,
      currentStreak: 5,
      totalScore: 1650,
      salLeaves: 54,
      modesPlayed: { birsa_archer: true, mandar_drum: true, word_jumble: true },
      unlockedBadgeIds: [
        'birsa_first_arrow',
        'mandar_first_beat',
        'olchiki_apprentice',
        'master_calligrapher',
        'warrior_focus',
        'legendary_sendra',
        'three_forest_paths',
        'parsi_gomke',
      ],
      unlockedTimestamps: {
        legendary_sendra: '21 Sep 2026',
        three_forest_paths: '22 Sep 2026',
      },
      tokenSerials: {
        legendary_sendra: 'PLSH-LEG-77C1',
        three_forest_paths: 'PLSH-THR-55D8',
      },
    },
    competencyScores: {
      visualRecognition: 92,
      auditoryDecoding: 90,
      orthographicAssembly: 95,
      accuracyRate: 91,
      streakEndurance: 98,
      lexiconBreadth: 94,
    },
    learningHistory: [
      { sessionNumber: 1, date: 'Sep 12', cumulativeScore: 180, accuracyRate: 80, streak: 3, mode: 'birsa_archer' },
      { sessionNumber: 2, date: 'Sep 14', cumulativeScore: 420, accuracyRate: 85, streak: 5, mode: 'word_jumble', milestoneUnlocked: 'Ol Chiki Scribe', milestoneGlyph: 'ᱚ' },
      { sessionNumber: 3, date: 'Sep 16', cumulativeScore: 780, accuracyRate: 88, streak: 7, mode: 'mandar_drum' },
      { sessionNumber: 4, date: 'Sep 18', cumulativeScore: 1080, accuracyRate: 90, streak: 9, mode: 'word_jumble', milestoneUnlocked: 'Master Calligrapher', milestoneGlyph: 'ᱜ' },
      { sessionNumber: 5, date: 'Sep 20', cumulativeScore: 1390, accuracyRate: 92, streak: 11, mode: 'birsa_archer', milestoneUnlocked: 'Unstoppable Sendra', milestoneGlyph: 'ᱫ' },
      { sessionNumber: 6, date: 'Sep 22', cumulativeScore: 1650, accuracyRate: 91, streak: 11, mode: 'word_jumble', milestoneUnlocked: 'Three Forest Paths', milestoneGlyph: 'ᱯ' },
    ],
    teacherNotes: 'Peer leader and classroom mentor. Mastered multi-glyph word formation in both Ol Chiki and bilingual Hindi/English. Can assist teacher in guided peer reading groups.',
    nipunLevel: 'Master (ᱢᱟᱪᱮᱛ)',
    strengthArea: 'Comprehensive Multilingual FLN Mastery',
    growthArea: 'Creative Tribal Story Composition',
  },
  {
    id: 'shanti_kisku',
    name: 'Shanti Kisku',
    tribalName: 'ᱥᱟᱱᱛᱤ ᱠᱤᱥᱠᱩ',
    rollNo: 'JH-EBM-009',
    grade: 'Grade 2',
    schoolVillage: 'Ghatsila Ashram Vidyalaya, East Singhbhum',
    avatarSeed: 'shanti',
    stats: {
      totalQuestionsAnswered: 14,
      correctAnswers: 11,
      mode1Wins: 5,
      mode2Wins: 4,
      mode3Wins: 2,
      highestStreak: 4,
      currentStreak: 2,
      totalScore: 510,
      salLeaves: 18,
      modesPlayed: { birsa_archer: true, mandar_drum: true, word_jumble: false },
      unlockedBadgeIds: ['birsa_first_arrow', 'mandar_first_beat'],
      unlockedTimestamps: {
        birsa_first_arrow: '20 Sep 2026',
        mandar_first_beat: '22 Sep 2026',
      },
      tokenSerials: {
        birsa_first_arrow: 'PLSH-BIR-19A7',
        mandar_first_beat: 'PLSH-MAN-88K3',
      },
    },
    competencyScores: {
      visualRecognition: 68,
      auditoryDecoding: 74,
      orthographicAssembly: 48,
      accuracyRate: 78,
      streakEndurance: 62,
      lexiconBreadth: 70,
    },
    learningHistory: [
      { sessionNumber: 1, date: 'Sep 19', cumulativeScore: 80, accuracyRate: 60, streak: 1, mode: 'birsa_archer' },
      { sessionNumber: 2, date: 'Sep 20', cumulativeScore: 190, accuracyRate: 70, streak: 2, mode: 'birsa_archer', milestoneUnlocked: 'First Bullseye', milestoneGlyph: 'ᱟ' },
      { sessionNumber: 3, date: 'Sep 21', cumulativeScore: 340, accuracyRate: 75, streak: 3, mode: 'mandar_drum', milestoneUnlocked: 'Mandar Resonance', milestoneGlyph: 'ᱫ' },
      { sessionNumber: 4, date: 'Sep 22', cumulativeScore: 510, accuracyRate: 78, streak: 4, mode: 'mandar_drum' },
    ],
    teacherNotes: 'Steady upward progress across consecutive days. Demonstrates good curiosity with Mandar sounds. Would benefit from tactile tracing worksheets alongside game play.',
    nipunLevel: 'Developing (ᱞᱟᱦᱟ)',
    strengthArea: 'Daily Consistency & Inquisitiveness',
    growthArea: 'Word Jumble & Multi-character Synthesis',
  },
];

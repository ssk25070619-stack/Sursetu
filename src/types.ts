export type TargetScript = 'sat_Olck' | 'sat_Orya' | 'sat_Deva' | 'sat_Latn' | 'ho_Deva' | 'ho_Wara' | 'ho_Latn' | 'mun_Deva' | 'mun_Bani' | 'mun_Latn' | 'kru_Deva' | 'kru_Tolo' | 'kru_Latn' | 'eng_Latn';
export type SourceLang = 'hin_Deva' | 'eng_Latn';
export type IndigenousLanguage = 'english' | 'santali' | 'ho' | 'mundari' | 'kurukh';


export interface LanguageConfig {
  id: IndigenousLanguage;
  name: string;
  nativeName: string;
  scriptLabel: string;
  nativeScript?: string;
  scriptCreator?: string;
  scriptHistory?: string;
  secondaryScripts?: string[];
  shortCode: string;
  region: string;
  icon: string;
  greeting: string;
}


export interface ScriptTransliterations {
  sat_Olck: string;
  sat_Orya: string;
  sat_Deva: string;
  sat_Latn: string;
  ho_Deva?: string;
  ho_Wara?: string;
  ho_Latn?: string;
  mun_Deva?: string;
  mun_Bani?: string;
  mun_Latn?: string;
  kru_Deva?: string;
  kru_Tolo?: string;
  kru_Latn?: string;
  eng_Latn?: string;
  hin_Deva?: string;
}

export interface TranslationResult {
  original_text: string;
  translated_text: string;
  source_language: SourceLang;
  target_language: TargetScript | IndigenousLanguage;
  target_lang_id?: IndigenousLanguage;
  confidence: number;
  mode: 'EXACT_CORPUS' | 'EXACT_DICTIONARY' | 'LEARNED_MEMORY' | 'SYNTACTIC_COPULAR_SOV' | 'SYNTACTIC_POSSESSIVE' | 'SYNTACTIC_IMPERATIVE' | 'TRIE_CHUNKED_SOV' | 'CONVERSATIONAL_EXACT' | 'MULTILINGUAL_EXPANDED';
  provider: string;
  latency_ms: number;
  transliterations: ScriptTransliterations;
  explanation?: string;
  postpositions_applied?: string[];
  ho_equivalent?: string;
  mundari_equivalent?: string;
  kurukh_equivalent?: string;
  english_equivalent?: string;
}

export interface VocabItem {
  id: string;
  hindi: string;
  english: string;
  santali_olchiki: string;
  santali_odia: string;
  santali_deva: string;
  santali_latin: string;
  ho?: string;
  mundari?: string;
  kurukh?: string;
  kurukh_tolong?: string;
  category: 'school' | 'classroom' | 'nature' | 'animals' | 'family' | 'numbers' | 'actions' | 'body' | 'colours' | 'fruits' | 'shapes' | 'dialogues' | 'flora' | 'fauna';
  emoji: string;
  phonetic: string;
  culturalNote?: string;
  exampleSentence?: {
    hindi: string;
    olchiki: string;
    english: string;
  };
}

export type PedagogicalIntent =
  | 'LESSON_PLAN'
  | 'CLASSROOM_COMMAND'
  | 'STORY_RHYME'
  | 'MATH_NUMERACY'
  | 'ASSESSMENT'
  | 'CULTURE_FESTIVAL'
  | 'CONCEPT_DOUBT';

export interface AssistantResponse {
  title: string;
  reply_text: string;
  replyText?: string;
  suggested_chips: string[];
  audio_speak_text: string;
  audioSpeakText?: string;
  intent: PedagogicalIntent;
  latency_ms: number;
  grade?: string;
  target_lang?: string;
  action_steps?: string[];
}

export type WorksheetType =
  | 'counting'
  | 'matching'
  | 'flashcards'
  | 'tracing'
  | 'fill_blanks'
  | 'lesson_script'
  | 'rhyme'
  | 'assessment'
  | 'board_game';

export interface WorksheetData {
  title: string;
  type: WorksheetType;
  grade: string;
  category: string;
  target_lang: TargetScript;
  lang_label: string;
  generated_at: string;
  items?: any[];
  content?: string;
}

export interface MayurbhanjLIDResult {
  detected_language: 'sat' | 'ori';
  language_name: string;
  confidence: number;
  santali_score: number;
  odia_score: number;
  detected_markers: string[];
  explanation: string;
}

export type BadgeCategory = 'combat' | 'rhythm' | 'puzzle' | 'streak' | 'mastery' | 'scholar';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'legendary';

export interface TokenDesign {
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  ringColor: string;
  olChikiGlyph: string;
  glyphMeaning: string;
  iconType: 'bow' | 'drum' | 'puzzle' | 'flame' | 'leaf' | 'crown' | 'quill' | 'star' | 'triskelion' | 'diamond';
}

export interface AchievementBadge {
  id: string;
  title: string;
  tribalTitle: string;
  hindiTitle: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  tierLabel: string;
  tokenDesign: TokenDesign;
  requirement: {
    type:
      | 'birsa_archer_wins'
      | 'mandar_drum_wins'
      | 'word_jumble_wins'
      | 'highest_streak'
      | 'total_score'
      | 'sal_leaves'
      | 'correct_answers'
      | 'all_modes_played';
    target: number;
  };
  isUnlocked: boolean;
  progress: number;
  target: number;
  unlockedAt?: string;
  tokenSerial?: string;
}

export interface QuestStats {
  totalQuestionsAnswered: number;
  correctAnswers: number;
  mode1Wins: number;
  mode2Wins: number;
  mode3Wins: number;
  highestStreak: number;
  currentStreak: number;
  totalScore: number;
  salLeaves: number;
  modesPlayed: {
    birsa_archer: boolean;
    mandar_drum: boolean;
    word_jumble: boolean;
  };
  unlockedBadgeIds: string[];
  unlockedTimestamps: Record<string, string>;
  tokenSerials: Record<string, string>;
}

export interface SessionDataPoint {
  sessionNumber: number;
  date: string;
  cumulativeScore: number;
  accuracyRate: number; // percentage 0-100
  streak: number;
  mode: 'birsa_archer' | 'mandar_drum' | 'word_jumble';
  milestoneUnlocked?: string;
  milestoneGlyph?: string;
}

export interface StudentLearningProfile {
  id: string;
  name: string;
  tribalName: string;
  rollNo: string;
  grade: string;
  schoolVillage: string;
  avatarSeed: string;
  stats: QuestStats;
  competencyScores: {
    visualRecognition: number; // 0-100
    auditoryDecoding: number; // 0-100
    orthographicAssembly: number; // 0-100
    accuracyRate: number; // 0-100
    streakEndurance: number; // 0-100
    lexiconBreadth: number; // 0-100
  };
  learningHistory: SessionDataPoint[];
  teacherNotes: string;
  nipunLevel: 'Emerging (ᱥᱟᱹᱨᱫᱤ)' | 'Developing (ᱞᱟᱦᱟ)' | 'Proficient (ᱡᱤᱛᱠᱟᱹᱨ)' | 'Master (ᱢᱟᱪᱮᱛ)';
  strengthArea: string;
  growthArea: string;
}

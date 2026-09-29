import { AchievementBadge, QuestStats } from '../types';

const STORAGE_KEY_STATS = 'sursetu_tribal_quest_stats_v2';

export const INITIAL_ACHIEVEMENT_DEFINITIONS: Omit<AchievementBadge, 'isUnlocked' | 'progress' | 'target'>[] = [
  {
    id: 'birsa_first_arrow',
    title: 'First Bullseye',
    tribalTitle: 'ᱯᱟᱹᱦᱤᱞ ᱛᱩᱧ',
    hindiTitle: 'पहला सटीक निशाना',
    description: 'Hit your very first Ol Chiki word target in Birsa Archer mode.',
    category: 'combat',
    tier: 'bronze',
    tierLabel: 'Sal Bronze (ᱥᱟᱨᱡᱚᱢ)',
    tokenDesign: {
      primaryColor: '#d97706',
      secondaryColor: '#92400e',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      ringColor: '#b45309',
      olChikiGlyph: 'ᱟ',
      glyphMeaning: 'Ag (ᱟᱜ - Bow)',
      iconType: 'bow',
    },
    requirement: {
      type: 'birsa_archer_wins',
      target: 1,
    },
  },
  {
    id: 'birsa_marksman',
    title: "Birsa's Marksman",
    tribalTitle: 'ᱵᱤᱨᱥᱟ ᱵᱤᱨ',
    hindiTitle: 'बिरसा का तीरंदाज',
    description: 'Score 5 bulls-eyes in Birsa Archer mode identifying indigenous words.',
    category: 'combat',
    tier: 'silver',
    tierLabel: 'SurSetu Silver (ᱥᱩᱨ ᱥᱮᱛᱩ)',
    tokenDesign: {
      primaryColor: '#059669',
      secondaryColor: '#047857',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      ringColor: '#10b981',
      olChikiGlyph: 'ᱛ',
      glyphMeaning: 'Ot (ᱚᱛ - Earth/Ground)',
      iconType: 'bow',
    },
    requirement: {
      type: 'birsa_archer_wins',
      target: 5,
    },
  },
  {
    id: 'mandar_first_beat',
    title: 'Mandar Resonance',
    tribalTitle: 'ᱫᱷᱟᱢᱥᱟ ᱨᱩ',
    hindiTitle: 'मांदर की पहली गूंज',
    description: 'Listen to acoustic tribal drum audio and decode your first word correctly.',
    category: 'rhythm',
    tier: 'bronze',
    tierLabel: 'Sal Bronze (ᱥᱟᱨᱡᱚᱢ)',
    tokenDesign: {
      primaryColor: '#0d9488',
      secondaryColor: '#115e59',
      glowColor: 'rgba(20, 184, 166, 0.45)',
      ringColor: '#14b8a6',
      olChikiGlyph: 'ᱫ',
      glyphMeaning: 'Ud (ᱩᱫ - Mushroom/Listen)',
      iconType: 'drum',
    },
    requirement: {
      type: 'mandar_drum_wins',
      target: 1,
    },
  },
  {
    id: 'forest_acoustician',
    title: 'Forest Acoustician',
    tribalTitle: 'ᱵᱤᱨ ᱥᱟᱰᱮ',
    hindiTitle: 'वन का ध्वनि मर्मज्ञ',
    description: 'Decipher 5 spoken tribal words in Mandar Drum listening mode.',
    category: 'rhythm',
    tier: 'silver',
    tierLabel: 'SurSetu Silver (ᱥᱩᱨ ᱥᱮᱛᱩ)',
    tokenDesign: {
      primaryColor: '#0284c7',
      secondaryColor: '#0369a1',
      glowColor: 'rgba(14, 165, 233, 0.45)',
      ringColor: '#38bdf8',
      olChikiGlyph: 'ᱨ',
      glyphMeaning: 'Ir (ᱤᱨ - Sickle/Harmony)',
      iconType: 'drum',
    },
    requirement: {
      type: 'mandar_drum_wins',
      target: 5,
    },
  },
  {
    id: 'olchiki_apprentice',
    title: 'Ol Chiki Scribe',
    tribalTitle: 'ᱚᱞ ᱪᱤᱠᱤ ᱚᱞ',
    hindiTitle: 'ओल चिकी सुलेखक',
    description: 'Assemble your first floating Ol Chiki word puzzle in perfect sequence.',
    category: 'puzzle',
    tier: 'bronze',
    tierLabel: 'Sal Bronze (ᱥᱟᱨᱡᱚᱢ)',
    tokenDesign: {
      primaryColor: '#e11d48',
      secondaryColor: '#9f1239',
      glowColor: 'rgba(244, 63, 94, 0.45)',
      ringColor: '#fb7185',
      olChikiGlyph: 'ᱚ',
      glyphMeaning: 'Ol (ᱚᱞ - To Write / Pandit Murmu Sacred Glyph)',
      iconType: 'quill',
    },
    requirement: {
      type: 'word_jumble_wins',
      target: 1,
    },
  },
  {
    id: 'master_calligrapher',
    title: 'Master Calligrapher',
    tribalTitle: 'ᱚᱞ ᱜᱩᱨᱩ ᱪᱮᱞᱟ',
    hindiTitle: 'गुरु चेला शब्द साधक',
    description: 'Assemble 5 multi-glyph tribal terms without errors in Ol Chiki Jumble.',
    category: 'puzzle',
    tier: 'gold',
    tierLabel: 'Kunkul Gold (ᱥᱚᱱᱟ)',
    tokenDesign: {
      primaryColor: '#f59e0b',
      secondaryColor: '#b45309',
      glowColor: 'rgba(245, 158, 11, 0.55)',
      ringColor: '#fbbf24',
      olChikiGlyph: 'ᱜ',
      glyphMeaning: 'Ug (ᱩᱜ - Wisdom/Warmth)',
      iconType: 'puzzle',
    },
    requirement: {
      type: 'word_jumble_wins',
      target: 5,
    },
  },
  {
    id: 'warrior_focus',
    title: "Warrior's Focus",
    tribalTitle: 'ᱛᱮᱛᱮᱧ ᱵᱤᱨ',
    hindiTitle: 'निरंतर योद्धा',
    description: 'Achieve a 5x answer streak without a single mistake.',
    category: 'streak',
    tier: 'silver',
    tierLabel: 'SurSetu Silver (ᱥᱩᱨ ᱥᱮᱛᱩ)',
    tokenDesign: {
      primaryColor: '#ea580c',
      secondaryColor: '#9a3412',
      glowColor: 'rgba(234, 88, 12, 0.5)',
      ringColor: '#fb923c',
      olChikiGlyph: 'ᱥ',
      glyphMeaning: 'Sendra (ᱥᱮᱸᱫᱽᱨᱟ - Expedition/Courage)',
      iconType: 'flame',
    },
    requirement: {
      type: 'highest_streak',
      target: 5,
    },
  },
  {
    id: 'legendary_sendra',
    title: 'Unstoppable Sendra',
    tribalTitle: 'ᱥᱮᱸᱫᱽᱨᱟ ᱫᱟᱲᱮ',
    hindiTitle: 'अजेय सेंदरा शक्ति',
    description: 'Reach an extraordinary 10x consecutive answer streak.',
    category: 'streak',
    tier: 'legendary',
    tierLabel: 'Mahua Diamond (ᱦᱤᱨᱟᱹ)',
    tokenDesign: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#5b21b6',
      glowColor: 'rgba(139, 92, 246, 0.6)',
      ringColor: '#c084fc',
      olChikiGlyph: 'ᱫ',
      glyphMeaning: 'Dare (ᱫᱟᱲᱮ - Supreme Strength)',
      iconType: 'diamond',
    },
    requirement: {
      type: 'highest_streak',
      target: 10,
    },
  },
  {
    id: 'sal_grove_guardian',
    title: 'Sal Grove Guardian',
    tribalTitle: 'ᱥᱟᱨᱡᱚᱢ ᱵᱤᱨ',
    hindiTitle: 'साल वन संरक्षक',
    description: 'Harvest 25 sacred Sal leaves through accurate quiz answers.',
    category: 'mastery',
    tier: 'silver',
    tierLabel: 'SurSetu Silver (ᱥᱩᱨ ᱥᱮᱛᱩ)',
    tokenDesign: {
      primaryColor: '#16a34a',
      secondaryColor: '#166534',
      glowColor: 'rgba(34, 197, 94, 0.5)',
      ringColor: '#4ade80',
      olChikiGlyph: 'ᱥ',
      glyphMeaning: 'Sarjom (ᱥᱟᱨᱡᱚᱢ - Sacred Shorea robusta)',
      iconType: 'leaf',
    },
    requirement: {
      type: 'sal_leaves',
      target: 25,
    },
  },
  {
    id: 'parsi_gomke',
    title: 'Chieftain of FLN',
    tribalTitle: 'ᱯᱟᱹᱨᱥᱤ ᱜᱚᱢᱠᱮ',
    hindiTitle: 'पारसी गोमके विद्यापति',
    description: 'Accumulate 1,000 Tribal Quest points defending indigenous literacy.',
    category: 'mastery',
    tier: 'gold',
    tierLabel: 'Kunkul Gold (ᱥᱚᱱᱟ)',
    tokenDesign: {
      primaryColor: '#d97706',
      secondaryColor: '#78350f',
      glowColor: 'rgba(217, 119, 6, 0.6)',
      ringColor: '#fcd34d',
      olChikiGlyph: 'ᱢ',
      glyphMeaning: 'Machet (ᱢᱟᱪᱮᱛ - Revered Teacher)',
      iconType: 'crown',
    },
    requirement: {
      type: 'total_score',
      target: 1000,
    },
  },
  {
    id: 'three_forest_paths',
    title: 'Three Forest Paths',
    tribalTitle: 'ᱯᱮᱭᱟ ᱦᱚᱨ',
    hindiTitle: 'त्रिविध पथ साधक',
    description: 'Achieve victory across all three quest modes: Archer, Drum, and Jumble.',
    category: 'scholar',
    tier: 'gold',
    tierLabel: 'Kunkul Gold (ᱥᱚᱱᱟ)',
    tokenDesign: {
      primaryColor: '#06b6d4',
      secondaryColor: '#0e7490',
      glowColor: 'rgba(6, 182, 212, 0.55)',
      ringColor: '#67e8f9',
      olChikiGlyph: 'ᱯ',
      glyphMeaning: 'Peya (ᱯᱮᱭᱟ - Three Sacred Elements)',
      iconType: 'triskelion',
    },
    requirement: {
      type: 'all_modes_played',
      target: 3,
    },
  },
  {
    id: 'machet_guru',
    title: 'Tribal Grandmaster',
    tribalTitle: 'ᱢᱟᱪᱮᱛ ᱜᱩᱨᱩ',
    hindiTitle: 'माचेत गुरु महाविद्वान',
    description: 'Prove supreme mastery by answering 20 questions correctly in Tribal Quest.',
    category: 'mastery',
    tier: 'legendary',
    tierLabel: 'Mahua Diamond (ᱦᱤᱨᱟᱹ)',
    tokenDesign: {
      primaryColor: '#ec4899',
      secondaryColor: '#9d174d',
      glowColor: 'rgba(236, 72, 153, 0.65)',
      ringColor: '#f472b6',
      olChikiGlyph: 'ᱥ',
      glyphMeaning: 'SurSetu (ᱥᱩᱨ ᱥᱮᱛᱩ - Bridge of Knowledge Sacred Totem)',
      iconType: 'diamond',
    },
    requirement: {
      type: 'correct_answers',
      target: 20,
    },
  },
];

const DEFAULT_STATS: QuestStats = {
  totalQuestionsAnswered: 0,
  correctAnswers: 0,
  mode1Wins: 0,
  mode2Wins: 0,
  mode3Wins: 0,
  highestStreak: 0,
  currentStreak: 0,
  totalScore: 0,
  salLeaves: 12,
  modesPlayed: {
    birsa_archer: false,
    mandar_drum: false,
    word_jumble: false,
  },
  unlockedBadgeIds: [],
  unlockedTimestamps: {},
  tokenSerials: {},
};

export class AchievementsEngineService {
  private stats: QuestStats = DEFAULT_STATS;

  constructor() {
    this.loadStats();
  }

  /**
   * Load stats from localStorage with fallback
   */
  public loadStats(): QuestStats {
    if (typeof window === 'undefined') return DEFAULT_STATS;

    try {
      const stored = localStorage.getItem(STORAGE_KEY_STATS);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.stats = {
          ...DEFAULT_STATS,
          ...parsed,
          modesPlayed: {
            ...DEFAULT_STATS.modesPlayed,
            ...(parsed.modesPlayed || {}),
          },
          unlockedTimestamps: parsed.unlockedTimestamps || {},
          tokenSerials: parsed.tokenSerials || {},
        };
      } else {
        this.stats = { ...DEFAULT_STATS };
      }
    } catch (e) {
      console.warn('Failed to parse quest stats from localStorage:', e);
      this.stats = { ...DEFAULT_STATS };
    }

    return this.stats;
  }

  /**
   * Save current stats to localStorage
   */
  public saveStats(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(this.stats));
    } catch (e) {
      console.warn('Failed to save quest stats to localStorage:', e);
    }
  }

  /**
   * Get current stats
   */
  public getStats(): QuestStats {
    return { ...this.stats };
  }

  /**
   * Generates a deterministic, offline digital token serial code
   */
  public generateTokenSerial(badgeId: string, timestamp: number): string {
    const hash = Math.abs(
      badgeId.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0) ^ timestamp
    )
      .toString(16)
      .toUpperCase()
      .slice(0, 4)
      .padStart(4, '7');

    const prefix = badgeId.slice(0, 3).toUpperCase();
    return `PLSH-${prefix}-${hash}`;
  }

  /**
   * Computes progress and unlock state for all badges
   */
  public getBadges(): AchievementBadge[] {
    const stats = this.stats;

    return INITIAL_ACHIEVEMENT_DEFINITIONS.map(def => {
      let progress = 0;
      const target = def.requirement.target;

      switch (def.requirement.type) {
        case 'birsa_archer_wins':
          progress = stats.mode1Wins;
          break;
        case 'mandar_drum_wins':
          progress = stats.mode2Wins;
          break;
        case 'word_jumble_wins':
          progress = stats.mode3Wins;
          break;
        case 'highest_streak':
          progress = stats.highestStreak;
          break;
        case 'total_score':
          progress = stats.totalScore;
          break;
        case 'sal_leaves':
          progress = stats.salLeaves;
          break;
        case 'correct_answers':
          progress = stats.correctAnswers;
          break;
        case 'all_modes_played':
          progress =
            (stats.mode1Wins > 0 ? 1 : 0) +
            (stats.mode2Wins > 0 ? 1 : 0) +
            (stats.mode3Wins > 0 ? 1 : 0);
          break;
      }

      const isUnlocked = stats.unlockedBadgeIds.includes(def.id) || progress >= target;
      const unlockedAt = stats.unlockedTimestamps[def.id];
      const tokenSerial = stats.tokenSerials[def.id];

      return {
        ...def,
        progress: Math.min(progress, target),
        target,
        isUnlocked,
        unlockedAt,
        tokenSerial,
      };
    });
  }

  /**
   * Returns the next closest locked achievement badge to display on HUD
   */
  public getNextMilestone(): AchievementBadge | null {
    const badges = this.getBadges().filter(b => !b.isUnlocked);
    if (badges.length === 0) return null;

    // Sort by completion percentage descending
    badges.sort((a, b) => {
      const pctA = a.progress / a.target;
      const pctB = b.progress / b.target;
      return pctB - pctA;
    });

    return badges[0];
  }

  /**
   * Records a completed question in Tribal Quest, updating all counters and
   * returning newly unlocked badges if milestones were reached.
   */
  public recordQuestAnswer({
    mode,
    isCorrect,
    pointsAwarded,
    leavesChange,
    newStreak,
  }: {
    mode: 'birsa_archer' | 'mandar_drum' | 'word_jumble';
    isCorrect: boolean;
    pointsAwarded: number;
    leavesChange: number;
    newStreak: number;
  }): { updatedStats: QuestStats; newUnlocks: AchievementBadge[] } {
    this.stats.totalQuestionsAnswered += 1;
    this.stats.modesPlayed[mode] = true;

    if (isCorrect) {
      this.stats.correctAnswers += 1;
      this.stats.totalScore += pointsAwarded;
      this.stats.salLeaves = Math.max(0, this.stats.salLeaves + leavesChange);
      this.stats.currentStreak = newStreak;
      if (newStreak > this.stats.highestStreak) {
        this.stats.highestStreak = newStreak;
      }

      if (mode === 'birsa_archer') this.stats.mode1Wins += 1;
      if (mode === 'mandar_drum') this.stats.mode2Wins += 1;
      if (mode === 'word_jumble') this.stats.mode3Wins += 1;
    } else {
      this.stats.currentStreak = 0;
    }

    // Check for newly unlocked badges
    const currentBadges = this.getBadges();
    const newUnlocks: AchievementBadge[] = [];
    const now = Date.now();
    const dateFormatted = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    for (const badge of currentBadges) {
      if (badge.progress >= badge.target && !this.stats.unlockedBadgeIds.includes(badge.id)) {
        this.stats.unlockedBadgeIds.push(badge.id);
        this.stats.unlockedTimestamps[badge.id] = dateFormatted;
        const serial = this.generateTokenSerial(badge.id, now);
        this.stats.tokenSerials[badge.id] = serial;

        newUnlocks.push({
          ...badge,
          isUnlocked: true,
          unlockedAt: dateFormatted,
          tokenSerial: serial,
        });
      }
    }

    this.saveStats();

    return {
      updatedStats: { ...this.stats },
      newUnlocks,
    };
  }

  /**
   * Resets achievements and stats (for testing or classroom new batch)
   */
  public resetAchievements(): void {
    this.stats = { ...DEFAULT_STATS, salLeaves: 12 };
    this.saveStats();
  }
}

export const achievementsEngine = new AchievementsEngineService();

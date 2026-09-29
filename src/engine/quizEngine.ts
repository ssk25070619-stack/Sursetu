/**
 * SurSetu 2.0 - Deterministic Offline Quiz Generation Engine
 * -------------------------------------------------------------
 * Generates reproducible, distraction-free multiple-choice questions (MCQs)
 * from any bilingual story, lesson text, or vocabulary list using:
 * 1. Lookbehind Unicode Sentence Segmentation: `/(?<=[.!?।᱾])\s+/`
 * 2. Seeded Polynomial Rolling Hash: `(hash * 31 + charCode) % 1_000_000_007`
 * 3. Deterministic Distractor Extraction from In-Memory Lexicon
 */

export interface GeneratedQuestion {
  id: string;
  question: string;
  question_native: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceSentence: string;
}

export interface QuizGenerationResult {
  title: string;
  seed: number;
  totalQuestions: number;
  questions: GeneratedQuestion[];
}

export class QuizEngine {
  /**
   * Seeded pseudo-random number generator (PRNG) using polynomial rolling hash
   */
  private static hashString(str: string, seed: number = 42): number {
    let hash = seed;
    const MOD = 1_000_000_007;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % MOD;
    }
    return hash;
  }

  /**
   * Deterministic array shuffle using seeded PRNG
   */
  private static deterministicShuffle<T>(array: T[], seedStr: string): T[] {
    const shuffled = [...array];
    let seed = this.hashString(seedStr);

    for (let i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      const j = Math.floor((seed / 2147483648) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Segment multi-script text into sentences supporting Devanagari (।), Ol Chiki (᱾), and Latin (., !, ?)
   */
  public static segmentSentences(text: string): string[] {
    if (!text || typeof text !== 'string') return [];
    return text
      .split(/(?<=[.!?।᱾])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);
  }

  /**
   * Generate an automated FLN comprehension quiz from any text block
   */
  public static generateFromSentences(
    sentences: { hindi: string; native: string; english?: string }[],
    distractorPool: string[] = ['ᱫᱟᱜ (पानी)', 'ᱫᱟᱨᱮ (पेड़)', 'ᱟᱥᱲᱟ (स्कूल)', 'ᱢᱟᱪᱮᱛ (शिक्षक)', 'ᱯᱩᱛᱷᱤ (किताब)', 'ᱟᱛᱳ (गाँव)', 'ᱥᱟᱨᱡᱚᱢ (साल का पेड़)'],
    seedPrefix: string = 'sursetu_fln'
  ): QuizGenerationResult {
    const questions: GeneratedQuestion[] = [];

    sentences.forEach((item, idx) => {
      const seedStr = `${seedPrefix}_q${idx}_${item.hindi}`;
      const correctOption = item.native;

      // Pick 3 deterministic distractors from pool that aren't the correct answer
      const filteredPool = distractorPool.filter((d) => !d.includes(correctOption) && d !== correctOption);
      const shuffledPool = this.deterministicShuffle(filteredPool, seedStr);
      const selectedDistractors = shuffledPool.slice(0, 3);

      // Assemble 4 options and shuffle deterministically
      const candidateOptions = [correctOption, ...selectedDistractors];
      const finalOptions = this.deterministicShuffle(candidateOptions, seedStr + '_opts');
      const correctIndex = finalOptions.indexOf(correctOption);

      questions.push({
        id: `gen_q_${idx + 1}`,
        question: `इस वाक्य का सही अर्थ या शब्द चुनें: "${item.hindi}"`,
        question_native: `ᱱᱚᱶᱟ ᱨᱮᱱᱟᱜ ᱥᱟᱹᱨᱤ ᱢᱮᱱᱮᱛ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: "${item.native}"`,
        options: finalOptions,
        correctIndex: correctIndex >= 0 ? correctIndex : 0,
        explanation: `सही उत्तर है: ${correctOption} — वाक्य "${item.hindi}" के अनुसार।`,
        sourceSentence: item.hindi,
      });
    });

    return {
      title: 'Automated NIPUN Bharat FLN Comprehension Quiz',
      seed: this.hashString(seedPrefix),
      totalQuestions: questions.length,
      questions,
    };
  }
}

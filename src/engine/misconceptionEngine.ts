/**
 * SurSetu 3.0 - Misconception Tracking & Diagnostic Engine
 * -----------------------------------------------------------
 * Categorizes student learning errors into pedagogical archetypes:
 * 1. SYNTAX_ORDER: Subject-Verb-Object (SVO) vs Subject-Object-Verb (SOV) confusion
 * 2. POSTPOSITION_MISMATCH: Locative (-re), Ablative (-khon), Possessive (-ak) error
 * 3. SCRIPT_DIACRITIC: Ol Chiki deg/ohod/ahad/mu diacritic variance
 * 4. NUMERIC_INVERSION: Numerator-denominator / multi-script digit confusion
 * 5. VOCAB_GAP: Out-of-vocabulary / wrong semantic lemma selection
 * 6. PHONETIC_SUBSTITUTION: Glottalized stop unvoicing
 */

export type MisconceptionType =
  | 'SYNTAX_ORDER'
  | 'POSTPOSITION_MISMATCH'
  | 'SCRIPT_DIACRITIC'
  | 'NUMERIC_INVERSION'
  | 'VOCAB_GAP'
  | 'PHONETIC_SUBSTITUTION'
  | 'NONE';

export interface MisconceptionDiagnosis {
  type: MisconceptionType;
  label: string;
  explanation: string;
  remedialAction: string;
  confidence: number;
}

export const MISCONCEPTION_ARCHETYPES: Record<MisconceptionType, { label: string; remedialAction: string }> = {
  SYNTAX_ORDER: {
    label: 'Word Order Reversal (SVO vs SOV)',
    remedialAction: 'Practice placing verbs at the end of sentences in Santali/Ho/Mundari (Subject + Object + Verb).',
  },
  POSTPOSITION_MISMATCH: {
    label: 'Case Marker / Postposition Mismatch',
    remedialAction: 'Review Santali postpositions: -re (in/on), -khon (from), -ak (of/possession), -saote (with).',
  },
  SCRIPT_DIACRITIC: {
    label: 'Ol Chiki Diacritic / Modifier Variance',
    remedialAction: 'Practice Ol Chiki modifier signs: Ahâd (ᱹ), Mu (ᱸ), Deg (ᱫ), and Ohod (ᱷ).',
  },
  NUMERIC_INVERSION: {
    label: 'Digit / Fractional Inversion',
    remedialAction: 'Use the Bilingual Math Flashcards to map Arabic numerals (0-9) to Ol Chiki digits (᱐-᱙).',
  },
  VOCAB_GAP: {
    label: 'Unfamiliar / Missing Vocabulary Lemma',
    remedialAction: 'Review the 3D Interactive Flashcard deck for this thematic category.',
  },
  PHONETIC_SUBSTITUTION: {
    label: 'Phonetic & Glottal Stop Variance',
    remedialAction: 'Use the Barakhadi Wall Chart tap-to-listen feature to hear isolated phoneme resonance.',
  },
  NONE: {
    label: 'Correct Response',
    remedialAction: 'Mastery achieved! Move to next grade level.',
  },
};

export class MisconceptionEngine {
  /**
   * Diagnoses the root pedagogical misconception behind an incorrect student answer
   */
  public static diagnose(
    studentAnswer: string,
    expectedAnswer: string,
    category: string = 'general'
  ): MisconceptionDiagnosis {
    const normStudent = (studentAnswer || '').trim().toLowerCase();
    const normExpected = (expectedAnswer || '').trim().toLowerCase();

    if (normStudent === normExpected) {
      return {
        type: 'NONE',
        label: MISCONCEPTION_ARCHETYPES.NONE.label,
        explanation: 'Answer matches expected standard.',
        remedialAction: MISCONCEPTION_ARCHETYPES.NONE.remedialAction,
        confidence: 1.0,
      };
    }

    // 1. Check for Numeric / Digit Inversion (e.g. 1/2 vs 2/1, 5 vs 2, or Hindi vs Ol Chiki digits)
    const numericRegex = /[0-9᱐-᱙०-९]/;
    if (numericRegex.test(normStudent) && numericRegex.test(normExpected)) {
      if (normStudent.includes('/') && normExpected.includes('/')) {
        const [sNum, sDen] = normStudent.split('/').map((s) => s.trim());
        const [eNum, eDen] = normExpected.split('/').map((s) => s.trim());
        if (sNum === eDen && sDen === eNum) {
          return {
            type: 'NUMERIC_INVERSION',
            label: MISCONCEPTION_ARCHETYPES.NUMERIC_INVERSION.label,
            explanation: `Numerator and denominator were reversed (${normStudent} instead of ${normExpected}).`,
            remedialAction: MISCONCEPTION_ARCHETYPES.NUMERIC_INVERSION.remedialAction,
            confidence: 0.95,
          };
        }
      }
    }

    // 2. Check for Ol Chiki Diacritic Variance (e.g. ᱫ vs ᱫᱷ, ᱟ vs ᱟᱹ)
    const diacritics = ['ᱹ', 'ᱸ', 'ᱽ', 'ᱷ', '্', '़'];
    const hasDiacriticDiff = diacritics.some(
      (d) => normStudent.includes(d) !== normExpected.includes(d)
    );
    if (hasDiacriticDiff) {
      return {
        type: 'SCRIPT_DIACRITIC',
        label: MISCONCEPTION_ARCHETYPES.SCRIPT_DIACRITIC.label,
        explanation: 'Missing or extra Ol Chiki phonetic modifier (Ahâd, Mu, or Ohod glottal mark).',
        remedialAction: MISCONCEPTION_ARCHETYPES.SCRIPT_DIACRITIC.remedialAction,
        confidence: 0.88,
      };
    }

    // 3. Check for Postposition Mismatch (-re, -khon, -ak, -then, -saote)
    const postpositions = ['-re', ' ᱨᱮ', ' ᱠᱷᱚᱱ', ' ᱟᱜ', ' ᱥᱟᱶᱛᱮ', ' ᱨᱤᱱ', ' ଠᱮᱱ', ' ରେ', ' ଖୋନ', ' ଆଗ'];
    const hasPostpositionDiff = postpositions.some(
      (p) => normStudent.includes(p) !== normExpected.includes(p)
    );
    if (hasPostpositionDiff) {
      return {
        type: 'POSTPOSITION_MISMATCH',
        label: MISCONCEPTION_ARCHETYPES.POSTPOSITION_MISMATCH.label,
        explanation: 'Incorrect case marker attached to noun stem (e.g. locative -re vs ablative -khon).',
        remedialAction: MISCONCEPTION_ARCHETYPES.POSTPOSITION_MISMATCH.remedialAction,
        confidence: 0.85,
      };
    }

    // 4. Check for Word Order / Syntax Error (Tokens present but in SVO sequence)
    const sTokens = normStudent.split(/\s+/);
    const eTokens = normExpected.split(/\s+/);
    if (sTokens.length === eTokens.length && sTokens.length >= 3) {
      const allTokensMatch = sTokens.every((t) => eTokens.includes(t));
      if (allTokensMatch) {
        return {
          type: 'SYNTAX_ORDER',
          label: MISCONCEPTION_ARCHETYPES.SYNTAX_ORDER.label,
          explanation: 'Words are present but arranged in Indo-Aryan SVO rather than Munda SOV order.',
          remedialAction: MISCONCEPTION_ARCHETYPES.SYNTAX_ORDER.remedialAction,
          confidence: 0.92,
        };
      }
    }

    // 5. Fallback: Vocabulary Gap
    return {
      type: 'VOCAB_GAP',
      label: MISCONCEPTION_ARCHETYPES.VOCAB_GAP.label,
      explanation: 'The student selected or spoke an unaligned vocabulary lemma.',
      remedialAction: MISCONCEPTION_ARCHETYPES.VOCAB_GAP.remedialAction,
      confidence: 0.75,
    };
  }
}

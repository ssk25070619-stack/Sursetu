/**
 * SurSetu 3.0 - Misconception Tracking & Diagnostic Engine
 * -----------------------------------------------------------
 * Categorizes student learning errors into pedagogical archetypes:
 * 1. SYNTAX_ORDER: Subject-Verb-Object (SVO) vs Subject-Object-Verb (SOV) confusion
 * 2. POSTPOSITION_MISMATCH: Locative (-re), Ablative (-khon), Possessive (-ak) error
 * 3. SCRIPT_DIACRITIC: Ol Chiki deg/ohod/ahad/mu diacritic variance
 * 4. NUMERIC_INVERSION: Numerator-denominator / multi-script digit confusion
 * 5. FRACTION_DENOMINATOR_INVERSION: Thinking larger denominator = larger fraction
 * 6. PERCENTAGE_WHOLE_REVERSAL: Reversing part vs whole in ratio
 * 7. PHOTOSYNTHESIS_INPUT_OUTPUT: Plant food making vs respiration mixup
 * 8. PHYSICAL_VS_CHEMICAL_CHANGE: Reversible shape change vs new substance
 * 9. VOCAB_GAP: Out-of-vocabulary / wrong semantic lemma selection
 * 10. PHONETIC_SUBSTITUTION: Glottalized stop unvoicing
 */

export type MisconceptionType =
  | 'SYNTAX_ORDER'
  | 'POSTPOSITION_MISMATCH'
  | 'SCRIPT_DIACRITIC'
  | 'NUMERIC_INVERSION'
  | 'FRACTION_DENOMINATOR_INVERSION'
  | 'PERCENTAGE_WHOLE_REVERSAL'
  | 'PHOTOSYNTHESIS_INPUT_OUTPUT'
  | 'PHYSICAL_VS_CHEMICAL_CHANGE'
  | 'VOCAB_GAP'
  | 'PHONETIC_SUBSTITUTION'
  | 'NONE';

export interface MisconceptionDiagnosis {
  type: MisconceptionType;
  label: string;
  explanation: string;
  remedialAction: string;
  reteachActivity?: string;
  confidence: number;
}

export const MISCONCEPTION_ARCHETYPES: Record<
  MisconceptionType,
  { label: string; remedialAction: string; reteachActivity: string }
> = {
  SYNTAX_ORDER: {
    label: 'Word Order Reversal (SVO vs SOV)',
    remedialAction: 'Practice placing verbs at the end of sentences in Santali/Ho/Mundari (Subject + Object + Verb).',
    reteachActivity: 'Arrange Green (Subject), Yellow (Object), and Red (Verb) tactile word cards on the desk.',
  },
  POSTPOSITION_MISMATCH: {
    label: 'Case Marker / Postposition Mismatch',
    remedialAction: 'Review Santali postpositions: -re (in/on), -khon (from), -ak (of/possession), -saote (with).',
    reteachActivity: 'Use bilingual phrase flashcards to attach the correct suffix card onto the root noun.',
  },
  SCRIPT_DIACRITIC: {
    label: 'Ol Chiki Diacritic / Modifier Variance',
    remedialAction: 'Practice Ol Chiki modifier signs: Ahâd (ᱹ), Mu (ᱸ), Deg (ᱫ), and Ohod (ᱷ).',
    reteachActivity: 'Use the Stroke Tracing Canvas to draw the modifier marks with auditory phoneme feedback.',
  },
  NUMERIC_INVERSION: {
    label: 'Digit / Fractional Inversion',
    remedialAction: 'Use the Bilingual Math Flashcards to map Arabic numerals (0-9) to Ol Chiki digits (᱐-᱙).',
    reteachActivity: 'Count physical counting stones or wooden beads matching Ol Chiki numerals.',
  },
  FRACTION_DENOMINATOR_INVERSION: {
    label: 'Fraction Denominator Inversion (Size Confusion)',
    remedialAction: 'Understand that a higher denominator means dividing the whole into more pieces, making each piece smaller.',
    reteachActivity: 'Fold two circular paper rotis: fold one into 2 pieces (1/2) and one into 4 pieces (1/4) to visually compare size.',
  },
  PERCENTAGE_WHOLE_REVERSAL: {
    label: 'Percentage Whole vs Part Reversal',
    remedialAction: 'Remember that percentage always represents the part obtained out of 100 total units (Part / Whole * 100).',
    reteachActivity: 'Shade squares on a 10x10 (100 squares) grid chart to visualize 25%, 50%, and 75%.',
  },
  PHOTOSYNTHESIS_INPUT_OUTPUT: {
    label: 'Photosynthesis Reactant/Product Confusion',
    remedialAction: 'Green leaves take Sunlight + CO2 + Water (Inputs) and produce Glucose + Oxygen (Outputs).',
    reteachActivity: 'Draw the "Leaf Food Factory" cartoon diagram: Sun shining down, Roots drinking water, Fresh O2 floating out.',
  },
  PHYSICAL_VS_CHEMICAL_CHANGE: {
    label: 'Physical vs Chemical Change Criteria',
    remedialAction: 'Physical change has no new substance and is reversible; chemical change creates a permanent new substance.',
    reteachActivity: 'Contrast melting ice (water can freeze back) with burning paper (ash cannot turn back into paper).',
  },
  VOCAB_GAP: {
    label: 'Unfamiliar / Missing Vocabulary Lemma',
    remedialAction: 'Review the 3D Interactive Flashcard deck for this thematic category.',
    reteachActivity: 'Tap the audio button in the Flashcard Hub to listen to the native phonetic pronunciation.',
  },
  PHONETIC_SUBSTITUTION: {
    label: 'Phonetic & Glottal Stop Variance',
    remedialAction: 'Use the Barakhadi Wall Chart tap-to-listen feature to hear isolated phoneme resonance.',
    reteachActivity: 'Echo-read vowel resonance alongside the Sur Saathi voice assistant.',
  },
  NONE: {
    label: 'Correct Response',
    remedialAction: 'Mastery achieved! Move to next grade level.',
    reteachActivity: 'Provide an advanced exploration challenge or bilingual story reading.',
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
        reteachActivity: MISCONCEPTION_ARCHETYPES.NONE.reteachActivity,
        confidence: 1.0,
      };
    }

    // 1. Check for Fractions Denominator Size Inversion (e.g. answered 1/4 when 1/2 was expected as larger)
    if (
      (normStudent === '1/4' && normExpected === '1/2') ||
      (normStudent.includes('1/4') && normExpected.includes('1/2')) ||
      (normStudent === '1/8' && normExpected === '1/4')
    ) {
      return {
        type: 'FRACTION_DENOMINATOR_INVERSION',
        label: MISCONCEPTION_ARCHETYPES.FRACTION_DENOMINATOR_INVERSION.label,
        explanation: 'You assumed the bigger number 4 makes a bigger fraction, but sharing among 4 creates smaller pieces than sharing among 2.',
        remedialAction: MISCONCEPTION_ARCHETYPES.FRACTION_DENOMINATOR_INVERSION.remedialAction,
        reteachActivity: MISCONCEPTION_ARCHETYPES.FRACTION_DENOMINATOR_INVERSION.reteachActivity,
        confidence: 0.96,
      };
    }

    // 2. Check for Numeric / Digit Inversion (e.g. 1/2 vs 2/1, 5 vs 2, or Hindi vs Ol Chiki digits)
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
            reteachActivity: MISCONCEPTION_ARCHETYPES.NUMERIC_INVERSION.reteachActivity,
            confidence: 0.95,
          };
        }
      }
    }

    // 3. Science: Photosynthesis Gas confusion (Carbon dioxide vs Oxygen)
    if (
      (normStudent.includes('carbon') || normStudent.includes('co2')) &&
      (normExpected.includes('oxygen') || normExpected.includes('o2') || normExpected.includes('ऑक्सीजन'))
    ) {
      return {
        type: 'PHOTOSYNTHESIS_INPUT_OUTPUT',
        label: MISCONCEPTION_ARCHETYPES.PHOTOSYNTHESIS_INPUT_OUTPUT.label,
        explanation: 'Carbon dioxide is what plants take IN; Oxygen is what they release OUT during the day.',
        remedialAction: MISCONCEPTION_ARCHETYPES.PHOTOSYNTHESIS_INPUT_OUTPUT.remedialAction,
        reteachActivity: MISCONCEPTION_ARCHETYPES.PHOTOSYNTHESIS_INPUT_OUTPUT.reteachActivity,
        confidence: 0.94,
      };
    }

    // 4. Science: Physical vs Chemical Change confusion
    if (
      (normStudent.includes('chemical') || normStudent.includes('रासायनिक')) &&
      (normExpected.includes('physical') || normExpected.includes('भौतिक'))
    ) {
      return {
        type: 'PHYSICAL_VS_CHEMICAL_CHANGE',
        label: MISCONCEPTION_ARCHETYPES.PHYSICAL_VS_CHEMICAL_CHANGE.label,
        explanation: 'Melting or freezing changes the physical state (solid to liquid), but the substance remains water (reversible).',
        remedialAction: MISCONCEPTION_ARCHETYPES.PHYSICAL_VS_CHEMICAL_CHANGE.remedialAction,
        reteachActivity: MISCONCEPTION_ARCHETYPES.PHYSICAL_VS_CHEMICAL_CHANGE.reteachActivity,
        confidence: 0.92,
      };
    }

    // 5. Check for Ol Chiki Diacritic Variance (e.g. ᱫ vs ᱫᱷ, ᱟ vs ᱟᱹ)
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
        reteachActivity: MISCONCEPTION_ARCHETYPES.SCRIPT_DIACRITIC.reteachActivity,
        confidence: 0.88,
      };
    }

    // 6. Check for Postposition Mismatch (-re, -khon, -ak, -then, -saote)
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
        reteachActivity: MISCONCEPTION_ARCHETYPES.POSTPOSITION_MISMATCH.reteachActivity,
        confidence: 0.85,
      };
    }

    // 7. Check for Word Order / Syntax Error (Tokens present but in SVO sequence)
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
          reteachActivity: MISCONCEPTION_ARCHETYPES.SYNTAX_ORDER.reteachActivity,
          confidence: 0.92,
        };
      }
    }

    // 8. Fallback: Vocabulary Gap
    return {
      type: 'VOCAB_GAP',
      label: MISCONCEPTION_ARCHETYPES.VOCAB_GAP.label,
      explanation: 'The student selected or spoke an unaligned vocabulary lemma.',
      remedialAction: MISCONCEPTION_ARCHETYPES.VOCAB_GAP.remedialAction,
      reteachActivity: MISCONCEPTION_ARCHETYPES.VOCAB_GAP.reteachActivity,
      confidence: 0.75,
    };
  }
}

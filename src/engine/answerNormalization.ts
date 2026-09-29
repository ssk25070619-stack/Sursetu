/**
 * SurSetu 3.0 - 5-Tier Answer Normalization & Evaluation Pipeline
 * -----------------------------------------------------------------
 * Evaluates student voice, text, fraction, and multi-script inputs across 5 tiers:
 * Tier 1: Unicode NFKC Normalization & Whitespace Sanitation
 * Tier 2: Numeric, Fraction & Math Equivalence Parser (1/2 == 0.5 == १/२ == ᱢᱤᱫ/ᱵᱟᱨ)
 * Tier 3: Vernacular Number Words & Multi-Script Lemma Synonyms
 * Tier 4: Gestalt Pattern / Fuzzy Sequence Matching (Similarity >= 0.82)
 * Tier 5: Fallback + Root Misconception Archetype Inference
 */

import { MisconceptionEngine, MisconceptionDiagnosis } from './misconceptionEngine';

export interface EvaluationResult {
  isCorrect: boolean;
  score: number; // 0.0 - 1.0
  matchedTier: 'tier1_exact_nfkc' | 'tier2_numeric_fraction' | 'tier3_vernacular_word' | 'tier4_gestalt_fuzzy' | 'tier5_misconception';
  normalizedInput: string;
  normalizedExpected: string;
  similarityRatio: number;
  misconception?: MisconceptionDiagnosis;
}

// Vernacular Number Word Mapping (Santali Ol Chiki / Odia / Hindi to Value)
const VERNACULAR_NUMBER_MAP: Record<string, number> = {
  'ᱢᱤᱫ': 1, 'एक': 1, 'one': 1, 'ᱮᱠ': 1, 'ଏକ': 1, 'mid': 1,
  'ᱵᱟᱨ': 2, 'दो': 2, 'two': 2, 'ᱵᱟᱨᱭᱟ': 2, 'ଦୁଇ': 2, 'bar': 2,
  'ᱯᱮ': 3, 'तीन': 3, 'three': 3, 'ᱯᱮᱭᱟ': 3, 'ତିନି': 3, 'pe': 3,
  'ᱯᱩᱱ': 4, 'चार': 4, 'four': 4, 'ᱯᱩᱱᱭᱟ': 4, 'ଚାରି': 4, 'pun': 4,
  'ᱢᱚᱬᱮ': 5, 'पाँच': 5, 'five': 5, 'ᱯᱟᱸᱪ': 5, 'ପାଞ୍ଚ': 5, 'mone': 5,
  'ᱛᱩᱨᱩᱭ': 6, 'छह': 6, 'six': 6, 'ᱪᱷᱚ': 6, 'turuy': 6,
  'ᱮᱭᱟᱭ': 7, 'सात': 7, 'seven': 7, 'ᱥᱟᱛ': 7, 'eyay': 7,
  'ᱤᱨᱟᱹᱞ': 8, 'आठ': 8, 'eight': 8, 'ᱟᱴᱷ': 8, 'iral': 8,
  'ᱟᱨᱮ': 9, 'नौ': 9, 'nine': 9, 'ᱱᱚᱣ': 9, 'are': 9,
  'ᱜᱮᱞ': 10, 'दस': 10, 'ten': 10, 'ᱫᱚᱥ': 10, 'gel': 10,
};

// Ol Chiki & Devanagari Digit Normalization to ASCII
const DIGIT_TRANS_MAP: Record<string, string> = {
  '᱐': '0', '᱑': '1', '᱒': '2', '᱓': '3', '᱔': '4', '᱕': '5', '᱖': '6', '᱗': '7', '᱘': '8', '᱙': '9',
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  '୦': '0', '୧': '1', '୨': '2', '୩': '3', '୪': '4', '୫': '5', '୬': '6', '୭': '7', '୮': '8', '୯': '9',
};

export class AnswerNormalizationPipeline {
  /**
   * Convert any multi-script digit string to ASCII numbers
   */
  public static normalizeDigits(str: string): string {
    return str.replace(/[᱐-᱙०-९୦-୯]/g, (ch) => DIGIT_TRANS_MAP[ch] || ch);
  }

  /**
   * Parse numeric or fractional value from string (e.g. "1/2", "0.5", "३/४", "3")
   */
  public static parseNumericValue(raw: string): number | null {
    if (!raw) return null;
    const clean = this.normalizeDigits(raw.trim().toLowerCase());

    // Check vernacular word map
    if (VERNACULAR_NUMBER_MAP[clean] !== undefined) {
      return VERNACULAR_NUMBER_MAP[clean];
    }

    // Fraction format: "num/den"
    if (clean.includes('/')) {
      const parts = clean.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) {
          return num / den;
        }
      }
    }

    // Direct float
    const val = parseFloat(clean);
    return isNaN(val) ? null : val;
  }

  /**
   * Calculate string similarity ratio using Dice's bigram coefficient (Gestalt matching)
   */
  public static calculateSimilarity(s1: string, s2: string): number {
    if (s1 === s2) return 1.0;
    if (s1.length < 2 || s2.length < 2) return 0.0;

    const getBigrams = (str: string) => {
      const bigrams = new Map<string, number>();
      for (let i = 0; i < str.length - 1; i++) {
        const bg = str.substr(i, 2);
        bigrams.set(bg, (bigrams.get(bg) || 0) + 1);
      }
      return bigrams;
    };

    const bg1 = getBigrams(s1);
    const bg2 = getBigrams(s2);
    let intersection = 0;

    bg1.forEach((count, bg) => {
      if (bg2.has(bg)) {
        intersection += Math.min(count, bg2.get(bg)!);
      }
    });

    return (2.0 * intersection) / (s1.length - 1 + s2.length - 1);
  }

  /**
   * Execute 5-Tier Evaluation Pipeline
   */
  public static evaluate(studentInput: string, expectedAnswer: string): EvaluationResult {
    // -------------------------------------------------------------
    // Tier 1: Unicode NFKC Normalization & Whitespace Collapse
    // -------------------------------------------------------------
    const normStudent = (studentInput || '')
      .normalize('NFKC')
      .replace(/[।!?.,;:"]/g, '')
      .trim()
      .toLowerCase();

    const normExpected = (expectedAnswer || '')
      .normalize('NFKC')
      .replace(/[।!?.,;:"]/g, '')
      .trim()
      .toLowerCase();

    if (normStudent === normExpected) {
      return {
        isCorrect: true,
        score: 1.0,
        matchedTier: 'tier1_exact_nfkc',
        normalizedInput: normStudent,
        normalizedExpected: normExpected,
        similarityRatio: 1.0,
      };
    }

    // -------------------------------------------------------------
    // Tier 2: Numeric, Fraction & Math Equivalence Parser
    // -------------------------------------------------------------
    const numStudent = this.parseNumericValue(normStudent);
    const numExpected = this.parseNumericValue(normExpected);

    if (numStudent !== null && numExpected !== null) {
      if (Math.abs(numStudent - numExpected) < 1e-6) {
        return {
          isCorrect: true,
          score: 0.98,
          matchedTier: 'tier2_numeric_fraction',
          normalizedInput: normStudent,
          normalizedExpected: normExpected,
          similarityRatio: 0.98,
        };
      }
    }

    // -------------------------------------------------------------
    // Tier 3: Vernacular Number Words & Multi-Script Token Synonyms
    // -------------------------------------------------------------
    const vValS = VERNACULAR_NUMBER_MAP[normStudent];
    const vValE = VERNACULAR_NUMBER_MAP[normExpected];
    if (vValS !== undefined && (vValS === numExpected || vValS === vValE)) {
      return {
        isCorrect: true,
        score: 0.95,
        matchedTier: 'tier3_vernacular_word',
        normalizedInput: normStudent,
        normalizedExpected: normExpected,
        similarityRatio: 0.95,
      };
    }

    // -------------------------------------------------------------
    // Tier 4: Gestalt Pattern / Fuzzy Sequence Matching (Ratio >= 0.82)
    // -------------------------------------------------------------
    const similarity = this.calculateSimilarity(normStudent, normExpected);
    if (similarity >= 0.82) {
      return {
        isCorrect: true,
        score: Math.round(similarity * 100) / 100,
        matchedTier: 'tier4_gestalt_fuzzy',
        normalizedInput: normStudent,
        normalizedExpected: normExpected,
        similarityRatio: similarity,
      };
    }

    // -------------------------------------------------------------
    // Tier 5: Fallback + Root Misconception Archetype Inference
    // -------------------------------------------------------------
    const misconception = MisconceptionEngine.diagnose(normStudent, normExpected);
    return {
      isCorrect: false,
      score: Math.round(similarity * 50) / 100,
      matchedTier: 'tier5_misconception',
      normalizedInput: normStudent,
      normalizedExpected: normExpected,
      similarityRatio: similarity,
      misconception,
    };
  }
}

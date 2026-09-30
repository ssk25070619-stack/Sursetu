/**
 * SurSetu 3.0 - 5-Tier Answer Normalization & Evaluation Pipeline
 * -----------------------------------------------------------------
 * Evaluates student voice, text, fraction, and multi-script inputs across 5 tiers:
 * Tier 1: Unicode NFKC Normalization & Whitespace Sanitation
 * Tier 2: Numeric, Fraction & Math Equivalence Parser (1/2 == 0.5 == १/२ == ᱢᱤᱫ/ᱵᱟᱨ == aadha == half)
 * Tier 3: Vernacular Number Words & Multi-Script Lemma Synonyms
 * Tier 4: Concept Keyword & Gestalt Pattern / Fuzzy Sequence Matching (Similarity >= 0.82)
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
  matchingReason?: string;
  misconception?: MisconceptionDiagnosis;
}

// Vernacular Number & Fraction Word Mapping (Santali Ol Chiki / Odia / Hindi / English to Value)
const VERNACULAR_NUMBER_MAP: Record<string, number> = {
  // English & Hindi Units
  'zero': 0, 'shunya': 0, '᱐': 0, '०': 0, '୦': 0,
  'one': 1, 'एक': 1, 'ek': 1, 'ᱢᱤᱫ': 1, 'ᱮᱠ': 1, 'ଏକ': 1, 'mid': 1, '᱑': 1, '१': 1, '୧': 1,
  'two': 2, 'दो': 2, 'do': 2, 'ᱵᱟᱨ': 2, 'ᱵᱟᱨᱭᱟ': 2, 'ᱫᱩᱭ': 2, 'ଦୁଇ': 2, 'bar': 2, '᱒': 2, '२': 2, '୨': 2,
  'three': 3, 'तीन': 3, 'teen': 3, 'ᱯᱮ': 3, 'ᱯᱮᱭᱟ': 3, 'ତିନି': 3, 'pe': 3, '᱓': 3, '३': 3, '୩': 3,
  'four': 4, 'चार': 4, 'chaar': 4, 'ᱯᱩᱱ': 4, 'ᱯᱩᱱᱭᱟ': 4, 'ଚାରି': 4, 'pun': 4, '᱔': 4, '४': 4, '୪': 4,
  'five': 5, 'पाँच': 5, 'पांच': 5, 'paanch': 5, 'ᱢᱚᱬᱮ': 5, 'ᱯᱟᱸᱪ': 5, 'ᱯᱟଞ୍ଚ': 5, 'mone': 5, '᱕': 5, '५': 5, '୫': 5,
  'six': 6, 'छह': 6, 'chhe': 6, 'ᱛᱩᱨᱩᱭ': 6, 'ᱪᱷᱚ': 6, 'turuy': 6, 'turui': 6, '᱖': 6, '६': 6, '୬': 6,
  'seven': 7, 'सात': 7, 'saat': 7, 'ᱮᱭᱟᱭ': 7, 'ᱥᱟᱛ': 7, 'eyay': 7, '೭': 7, '७': 7, '୭': 7,
  'eight': 8, 'आठ': 8, 'aath': 8, 'ᱤᱨᱟᱹᱞ': 8, 'ᱟᱴᱷ': 8, 'iral': 8, 'irul': 8, '᱘': 8, '८': 8, '୮': 8,
  'nine': 9, 'नौ': 9, 'nau': 9, 'ᱟᱨᱮ': 9, 'ᱱᱚᱣ': 9, 'are': 9, '᱙': 9, '९': 9, '୯': 9,
  'ten': 10, 'दस': 10, 'das': 10, 'dus': 10, 'ᱜᱮᱞ': 10, 'ᱫᱚᱥ': 10, 'gel': 10,

  // Vernacular Fractions
  'half': 0.5, 'aadha': 0.5, 'adha': 0.5, 'आधा': 0.5, 'ᱦᱟᱹᱴᱤᱧ': 0.5, 'ᱛᱟᱞᱟ': 0.5,
  'quarter': 0.25, 'pao': 0.25, 'पाव': 0.25, 'चौथाई': 0.25,
  'three quarter': 0.75, 'pauna': 0.75, 'पौना': 0.75,
  'sawa': 1.25, 'सवा': 1.25,
  'dedh': 1.5, 'डेढ़': 1.5,
  'dhai': 2.5, 'ढाई': 2.5,
};

// Ol Chiki & Devanagari Digit Normalization to ASCII
const DIGIT_TRANS_MAP: Record<string, string> = {
  '᱐': '0', '᱑': '1', '᱒': '2', '᱓': '3', '᱔': '4', '᱕': '5', '᱖': '6', '᱗': '7', '᱘': '8', '᱙': '9',
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  '୦': '0', '୧': '1', '୨': '2', '୩': '3', '୪': '4', '୫': '5', '୬': '6', '୭': '7', '୮': '8', '୯': '9',
};

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'of', 'in', 'and', 'to', 'it', 'for', 'with', 'by',
  'hai', 'hain', 'ka', 'ki', 'ke', 'ko', 'me', 'mein', 'se', 'aur', 'par',
  'ᱠᱟᱱᱟ', 'ᱫᱚ', 'ᱨᱮ', 'ᱠᱷᱚᱱ', 'ᱟᱨ', 'ᱞᱟᱹᱜᱤᱫ'
]);

export class AnswerNormalizationPipeline {
  /**
   * Convert any multi-script digit string to ASCII numbers
   */
  public static normalizeDigits(str: string): string {
    return str.replace(/[᱐-᱙०-९୦-୯]/g, (ch) => DIGIT_TRANS_MAP[ch] || ch);
  }

  /**
   * Parse numeric, fractional, or percentage value from string (e.g. "1/2", "0.5", "३/४", "50%", "aadha")
   */
  public static parseNumericValue(raw: string): number | null {
    if (!raw) return null;
    let clean = this.normalizeDigits(raw.trim().toLowerCase())
      .replace(/½/g, '1/2')
      .replace(/¼/g, '1/4')
      .replace(/¾/g, '3/4')
      .replace(/⅓/g, '1/3')
      .replace(/⅔/g, '2/3');

    // Check vernacular word map directly
    if (VERNACULAR_NUMBER_MAP[clean] !== undefined) {
      return VERNACULAR_NUMBER_MAP[clean];
    }

    // Percentage: "50%", "50 percent", "50 प्रतिशत"
    const pctMatch = clean.match(/^(\d+(?:\.\d+)?)\s*(%|percent|प्रतिशत|pratishat)$/);
    if (pctMatch) {
      return parseFloat(pctMatch[1]) / 100.0;
    }

    // English / Hindi phrasing: "1 out of 2", "1 by 2", "2 me se 1"
    const outOfMatch = clean.match(/^(\d+)\s+(?:out\s+of|by|divided\s+by|ᱵᱟᱴᱟ)\s+(\d+)$/);
    if (outOfMatch && parseInt(outOfMatch[2], 10) !== 0) {
      return parseInt(outOfMatch[1], 10) / parseInt(outOfMatch[2], 10);
    }

    const meSeMatch = clean.match(/^(\d+)\s+me\s+se\s+(\d+)$/);
    if (meSeMatch && parseInt(meSeMatch[1], 10) !== 0) {
      return parseInt(meSeMatch[2], 10) / parseInt(meSeMatch[1], 10);
    }

    // Fraction format: "num/den"
    if (clean.includes('/')) {
      const parts = clean.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0].trim());
        const den = parseFloat(parts[1].trim());
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
   * Check if meaning-bearing keywords match between conceptual answers
   */
  public static matchKeyTerms(student: string, expected: string): boolean {
    const tokenize = (s: string) =>
      s.toLowerCase()
        .replace(/[^\w\s\u0900-\u097F\u1C50-\u1C7F\u0B00-\u0B7F]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

    const sTerms = new Set(tokenize(student));
    const eTerms = tokenize(expected);

    if (eTerms.length === 0) return false;
    let matchCount = 0;
    for (const term of eTerms) {
      if (sTerms.has(term)) matchCount++;
    }

    return (matchCount / eTerms.length) >= 0.65;
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
        matchingReason: 'Exact multi-script normalized match.',
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
          matchingReason: `Mathematical numerical value matched (${numStudent} == ${numExpected}).`,
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
        matchingReason: `Vernacular numeral translation recognized (${normStudent} = ${vValS}).`,
      };
    }

    // -------------------------------------------------------------
    // Tier 4: Concept Keyword & Gestalt Pattern / Fuzzy Sequence Matching
    // -------------------------------------------------------------
    const similarity = this.calculateSimilarity(normStudent, normExpected);
    const keyTermsMatch = this.matchKeyTerms(normStudent, normExpected);

    if (similarity >= 0.82 || (similarity >= 0.65 && keyTermsMatch)) {
      return {
        isCorrect: true,
        score: Math.max(0.85, Math.round(similarity * 100) / 100),
        matchedTier: 'tier4_gestalt_fuzzy',
        normalizedInput: normStudent,
        normalizedExpected: normExpected,
        similarityRatio: similarity,
        matchingReason: 'Semantic key terms and phonetic sequence matched.',
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
      matchingReason: 'Answer does not match expected concept yet.',
      misconception,
    };
  }
}

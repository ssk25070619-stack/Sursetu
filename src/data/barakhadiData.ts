export interface BarakhadiRow {
  devaConsonant: string;
  sound: string;
  olchikiBase: string;
  roman: string;
  varga: string;
  isDigraph?: boolean;
  notes?: string;
}

export const BARAKHADI_VOWELS = [
  { deva: 'अ', matra: '', sound: 'a', olchikiSuffix: 'ᱚ', roman: 'a', name: 'ह्रस्व अ' },
  { deva: 'आ', matra: 'ा', sound: 'ā', olchikiSuffix: 'ᱟ', roman: 'ā', name: 'दीर्घ आ' },
  { deva: 'इ', matra: 'ि', sound: 'i', olchikiSuffix: 'ᱤ', roman: 'i', name: 'ह्रस्व इ' },
  { deva: 'ई', matra: 'ी', sound: 'ī', olchikiSuffix: 'ᱤ', roman: 'ī', name: 'दीर्घ ई (merges into ᱤ)' },
  { deva: 'उ', matra: 'ु', sound: 'u', olchikiSuffix: 'ᱩ', roman: 'u', name: 'ह्रस्व उ' },
  { deva: 'ऊ', matra: 'ू', sound: 'ū', olchikiSuffix: 'ᱩ', roman: 'ū', name: 'दीर्घ ऊ (merges into ᱩ)' },
  { deva: 'ए', matra: 'े', sound: 'e', olchikiSuffix: 'ᱮ', roman: 'e', name: 'दीर्घ ए' },
  { deva: 'ऐ', matra: 'ै', sound: 'ai', olchikiSuffix: 'ᱚᱭ', roman: 'ai/ɔy', name: 'ऐ (vowel + y glide ᱚᱭ)' },
  { deva: 'ओ', matra: 'ो', sound: 'o', olchikiSuffix: 'ᱳ', roman: 'o', name: 'दीर्घ ओ' },
  { deva: 'औ', matra: 'ौ', sound: 'au', olchikiSuffix: 'ᱚᱣ', roman: 'au/ɔw', name: 'औ (vowel + w glide ᱚᱣ)' },
  { deva: 'अं', matra: 'ं', sound: 'aṃ', olchikiSuffix: 'ᱚᱸ', roman: 'ã/am', name: 'अनुस्वार (ᱸ Mu TTudah mark)' }
];

export const BARAKHADI_CONSONANTS: BarakhadiRow[] = [
  // क-वर्ग (Velar)
  { devaConsonant: 'क', sound: 'ka', olchikiBase: 'ᱠ', roman: 'k', varga: 'क-वर्ग (Velar)' },
  { devaConsonant: 'ख', sound: 'kha', olchikiBase: 'ᱠᱷ', roman: 'kh', varga: 'क-वर्ग (Velar)', isDigraph: true, notes: 'Aspirate digraph (k + ᱷ)' },
  { devaConsonant: 'ग', sound: 'ga', olchikiBase: 'ᱜ', roman: 'g', varga: 'क-वर्ग (Velar)' },
  { devaConsonant: 'घ', sound: 'gha', olchikiBase: 'ᱜᱷ', roman: 'gh', varga: 'क-वर्ग (Velar)', isDigraph: true, notes: 'Aspirate digraph (g + ᱷ)' },
  { devaConsonant: 'ङ', sound: 'ṅa', olchikiBase: 'ᱝ', roman: 'ṅ', varga: 'क-वर्ग (Velar)', notes: 'Velar nasal' },

  // च-वर्ग (Palatal)
  { devaConsonant: 'च', sound: 'ca', olchikiBase: 'ᱪ', roman: 'c', varga: 'च-वर्ग (Palatal)' },
  { devaConsonant: 'छ', sound: 'cha', olchikiBase: 'ᱪᱷ', roman: 'ch', varga: 'च-वर्ग (Palatal)', isDigraph: true, notes: 'Aspirate digraph (c + ᱷ)' },
  { devaConsonant: 'ज', sound: 'ja', olchikiBase: 'ᱡ', roman: 'j', varga: 'च-वर्ग (Palatal)' },
  { devaConsonant: 'झ', sound: 'jha', olchikiBase: 'ᱡᱷ', roman: 'jh', varga: 'च-वर्ग (Palatal)', isDigraph: true, notes: 'Aspirate digraph (j + ᱷ)' },
  { devaConsonant: 'ञ', sound: 'ña', olchikiBase: 'ᱧ', roman: 'ñ', varga: 'च-वर्ग (Palatal)' },

  // ट-वर्ग (Retroflex)
  { devaConsonant: 'ट', sound: 'ṭa', olchikiBase: 'ᱴ', roman: 'ṭ', varga: 'ट-वर्ग (Retroflex)' },
  { devaConsonant: 'ठ', sound: 'ṭha', olchikiBase: 'ᱴᱷ', roman: 'ṭh', varga: 'ट-वर्ग (Retroflex)', isDigraph: true, notes: 'Aspirate digraph (ṭ + ᱷ)' },
  { devaConsonant: 'ड', sound: 'ḍa', olchikiBase: 'ᱰ', roman: 'ḍ', varga: 'ट-वर्ग (Retroflex)' },
  { devaConsonant: 'ढ', sound: 'ḍha', olchikiBase: 'ᱰᱷ', roman: 'ḍh', varga: 'ट-वर्ग (Retroflex)', isDigraph: true, notes: 'Aspirate digraph (ḍ + ᱷ)' },
  { devaConsonant: 'ण', sound: 'ṇa', olchikiBase: 'ᱬ', roman: 'ṇ', varga: 'ट-वर्ग (Retroflex)' },

  // त-वर्ग (Dental)
  { devaConsonant: 'त', sound: 'ta', olchikiBase: 'ᱛ', roman: 't', varga: 'त-वर्ग (Dental)' },
  { devaConsonant: 'थ', sound: 'tha', olchikiBase: 'ᱛᱷ', roman: 'th', varga: 'त-वर्ग (Dental)', isDigraph: true, notes: 'Aspirate digraph (t + ᱷ)' },
  { devaConsonant: 'द', sound: 'da', olchikiBase: 'ᱫ', roman: 'd', varga: 'त-वर्ग (Dental)' },
  { devaConsonant: 'ध', sound: 'dha', olchikiBase: 'ᱫᱷ', roman: 'dh', varga: 'त-वर्ग (Dental)', isDigraph: true, notes: 'Aspirate digraph (d + ᱷ)' },
  { devaConsonant: 'न', sound: 'na', olchikiBase: 'ᱱ', roman: 'n', varga: 'त-वर्ग (Dental)' },

  // प-वर्ग (Labial)
  { devaConsonant: 'प', sound: 'pa', olchikiBase: 'ᱯ', roman: 'p', varga: 'प-वर्ग (Labial)' },
  { devaConsonant: 'फ', sound: 'pha', olchikiBase: 'ᱯᱷ', roman: 'ph', varga: 'प-वर्ग (Labial)', isDigraph: true, notes: 'Aspirate digraph (p + ᱷ)' },
  { devaConsonant: 'ब', sound: 'ba', olchikiBase: 'ᱵ', roman: 'b', varga: 'प-वर्ग (Labial)' },
  { devaConsonant: 'भ', sound: 'bha', olchikiBase: 'ᱵᱷ', roman: 'bh', varga: 'प-वर्ग (Labial)', isDigraph: true, notes: 'Aspirate digraph (b + ᱷ)' },
  { devaConsonant: 'म', sound: 'ma', olchikiBase: 'ᱢ', roman: 'm', varga: 'प-वर्ग (Labial)' },

  // अन्तःस्थ (Semivowels)
  { devaConsonant: 'य', sound: 'ya', olchikiBase: 'ᱭ', roman: 'y', varga: 'अन्तःस्थ (Semivowels)' },
  { devaConsonant: 'र', sound: 'ra', olchikiBase: 'ᱨ', roman: 'r', varga: 'अन्तःस्थ (Semivowels)' },
  { devaConsonant: 'ल', sound: 'la', olchikiBase: 'ᱞ', roman: 'l', varga: 'अन्तःस्थ (Semivowels)' },
  { devaConsonant: 'व', sound: 'va/wa', olchikiBase: 'ᱣ', roman: 'w/v', varga: 'अन्तःस्थ (Semivowels)' },

  // ऊष्म (Sibilants & Aspirate)
  { devaConsonant: 'श', sound: 'śa', olchikiBase: 'ᱥ', roman: 's', varga: 'ऊष्म (Sibilants)', notes: 'Santali has one sibilant — श/ष/स all collapse to ᱥ' },
  { devaConsonant: 'ष', sound: 'ṣa', olchikiBase: 'ᱥ', roman: 's', varga: 'ऊष्म (Sibilants)', notes: 'Merges with ᱥ' },
  { devaConsonant: 'स', sound: 'sa', olchikiBase: 'ᱥ', roman: 's', varga: 'ऊष्म (Sibilants)' },
  { devaConsonant: 'ह', sound: 'ha', olchikiBase: 'ᱦ', roman: 'h', varga: 'ऊष्म (Sibilants)' },

  // संयुक्त (Conjuncts)
  { devaConsonant: 'क्ष', sound: 'kṣa', olchikiBase: 'ᱠᱥ', roman: 'ks', varga: 'संयुक्त (Conjuncts)', notes: 'Sequential letters (k + s)' },
  { devaConsonant: 'त्र', sound: 'tra', olchikiBase: 'ᱛᱨ', roman: 'tr', varga: 'संयुक्त (Conjuncts)', notes: 'Sequential letters (t + r)' },
  { devaConsonant: 'ज्ञ', sound: 'jña', olchikiBase: 'ᱡᱧ', roman: 'jñ', varga: 'संयुक्त (Conjuncts)', notes: 'Sequential letters (j + ñ)' },
  { devaConsonant: 'श्र', sound: 'śra', olchikiBase: 'ᱥᱨ', roman: 'sr', varga: 'संयुक्त (Conjuncts)', notes: 'Sequential letters (s + r)' }
];

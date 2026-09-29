export interface SantaliNumeral {
  digit: number;
  olChikiDigit: string;
  unicodeHex: string;
  wordOlChiki: string;
  wordRoman: string;
  wordDeva: string;
  wordEnglish: string;
  wordHindi: string;
  notes?: string;
}

export const OL_CHIKI_DIGITS: SantaliNumeral[] = [
  {
    digit: 0,
    olChikiDigit: '᱐',
    unicodeHex: 'U+1C50',
    wordOlChiki: '᱐',
    wordRoman: 'sunno / zero',
    wordDeva: 'सुन्नो',
    wordEnglish: 'Zero',
    wordHindi: 'शून्य',
    notes: 'No standalone cardinal word in traditional counting; written as ᱐'
  },
  {
    digit: 1,
    olChikiDigit: '᱑',
    unicodeHex: 'U+1C51',
    wordOlChiki: 'ᱢᱤᱫ',
    wordRoman: "mit' / ekô",
    wordDeva: 'मिद / एको',
    wordEnglish: 'One',
    wordHindi: 'एक'
  },
  {
    digit: 2,
    olChikiDigit: '᱒',
    unicodeHex: 'U+1C52',
    wordOlChiki: 'ᱵᱟᱨ',
    wordRoman: 'bar',
    wordDeva: 'बार',
    wordEnglish: 'Two',
    wordHindi: 'दो'
  },
  {
    digit: 3,
    olChikiDigit: '᱓',
    unicodeHex: 'U+1C53',
    wordOlChiki: 'ᱯᱮ',
    wordRoman: 'pe',
    wordDeva: 'पे',
    wordEnglish: 'Three',
    wordHindi: 'तीन'
  },
  {
    digit: 4,
    olChikiDigit: '᱔',
    unicodeHex: 'U+1C54',
    wordOlChiki: 'ᱯᱩᱱ',
    wordRoman: 'pun / pon',
    wordDeva: 'पुन / पोन',
    wordEnglish: 'Four',
    wordHindi: 'चार',
    notes: 'Also written ᱯᱳᱱ (pon)'
  },
  {
    digit: 5,
    olChikiDigit: '᱕',
    unicodeHex: 'U+1C55',
    wordOlChiki: 'ᱢᱚᱬᱮ',
    wordRoman: 'môṇe',
    wordDeva: 'मोणे',
    wordEnglish: 'Five',
    wordHindi: 'पाँच'
  },
  {
    digit: 6,
    olChikiDigit: '᱖',
    unicodeHex: 'U+1C56',
    wordOlChiki: 'ᱛᱩᱨᱩᱭ',
    wordRoman: 'turuy',
    wordDeva: 'तुरुय',
    wordEnglish: 'Six',
    wordHindi: 'छह'
  },
  {
    digit: 7,
    olChikiDigit: '᱗',
    unicodeHex: 'U+1C57',
    wordOlChiki: 'ᱮᱭᱟᱭ',
    wordRoman: 'eyay',
    wordDeva: 'एयाय',
    wordEnglish: 'Seven',
    wordHindi: 'सात'
  },
  {
    digit: 8,
    olChikiDigit: '᱘',
    unicodeHex: 'U+1C58',
    wordOlChiki: 'ᱤᱨᱟᱹᱞ',
    wordRoman: 'irăl',
    wordDeva: 'इऱल',
    wordEnglish: 'Eight',
    wordHindi: 'आठ'
  },
  {
    digit: 9,
    olChikiDigit: '᱙',
    unicodeHex: 'U+1C59',
    wordOlChiki: 'ᱟᱨᱮ',
    wordRoman: 'are',
    wordDeva: 'आरे',
    wordEnglish: 'Nine',
    wordHindi: 'नौ'
  },
  {
    digit: 10,
    olChikiDigit: '᱑᱐',
    unicodeHex: 'U+1C51 U+1C50',
    wordOlChiki: 'ᱜᱮᱞ',
    wordRoman: 'gel',
    wordDeva: 'गेल',
    wordEnglish: 'Ten',
    wordHindi: 'दस'
  }
];

export interface CompoundNumber {
  value: number;
  olChikiDigits: string;
  wordOlChiki: string;
  wordRoman: string;
  wordDeva: string;
  wordEnglish: string;
  wordHindi: string;
  pattern: string;
  note?: string;
}

export const COMPOUND_NUMBERS_GUIDE: CompoundNumber[] = [
  {
    value: 11,
    olChikiDigits: '᱑᱑',
    wordOlChiki: 'ᱜᱮᱞ ᱢᱤᱫ',
    wordRoman: "gel mit'",
    wordDeva: 'गेल मिद',
    wordEnglish: 'Eleven',
    wordHindi: 'ग्यारह',
    pattern: 'Ten + One (ᱜᱮᱞ + ᱢᱤᱫ)'
  },
  {
    value: 12,
    olChikiDigits: '᱑᱒',
    wordOlChiki: 'ᱜᱮᱞ ᱵᱟᱨ',
    wordRoman: 'gel bar',
    wordDeva: 'गेल बार',
    wordEnglish: 'Twelve',
    wordHindi: 'बारह',
    pattern: 'Ten + Two (ᱜᱮᱞ + ᱵᱟᱨ)'
  },
  {
    value: 15,
    olChikiDigits: '᱑᱕',
    wordOlChiki: 'ᱜᱮᱞ ᱢᱚᱬᱮ',
    wordRoman: 'gel môṇe',
    wordDeva: 'गेल मोणे',
    wordEnglish: 'Fifteen',
    wordHindi: 'पंद्रह',
    pattern: 'Ten + Five (ᱜᱮᱞ + ᱢᱚᱬᱮ)'
  },
  {
    value: 19,
    olChikiDigits: '᱑᱙',
    wordOlChiki: 'ᱜᱮᱞ ᱟᱨᱮ',
    wordRoman: 'gel are',
    wordDeva: 'गेल आरे',
    wordEnglish: 'Nineteen',
    wordHindi: 'उन्नीस',
    pattern: 'Ten + Nine (ᱜᱮᱞ + ᱟᱨᱮ)'
  },
  {
    value: 20,
    olChikiDigits: '᱒᱐',
    wordOlChiki: 'ᱤᱥᱤ / ᱵᱟᱨ ᱜᱮᱞ',
    wordRoman: 'isi / bar gel',
    wordDeva: 'इसी / बार गेल',
    wordEnglish: 'Twenty',
    wordHindi: 'बीस',
    pattern: 'Vigesimal base "isi" or literally "two-ten" (ᱵᱟᱨ ᱜᱮᱞ)',
    note: 'Santali preserves an ancient base-20 vigesimal root "isi".'
  },
  {
    value: 21,
    olChikiDigits: '᱒᱑',
    wordOlChiki: 'ᱤᱥᱤ ᱢᱤᱫ',
    wordRoman: "isi mit'",
    wordDeva: 'इसी मिद',
    wordEnglish: 'Twenty-one',
    wordHindi: 'इक्कीस',
    pattern: 'Twenty + One (ᱤᱥᱤ + ᱢᱤᱫ)'
  },
  {
    value: 25,
    olChikiDigits: '᱒᱕',
    wordOlChiki: 'ᱤᱥᱤ ᱢᱚᱬᱮ',
    wordRoman: 'isi môṇe',
    wordDeva: 'इसी मोणे',
    wordEnglish: 'Twenty-five',
    wordHindi: 'पच्चीस',
    pattern: 'Twenty + Five (ᱤᱥᱤ + ᱢᱚᱬᱮ)'
  },
  {
    value: 30,
    olChikiDigits: '᱓᱐',
    wordOlChiki: 'ᱯᱮ ᱜᱮᱞ',
    wordRoman: 'pe gel',
    wordDeva: 'पे गेल',
    wordEnglish: 'Thirty',
    wordHindi: 'तीस',
    pattern: 'Three-ten (ᱯᱮ + ᱜᱮᱞ)'
  },
  {
    value: 40,
    olChikiDigits: '᱔᱐',
    wordOlChiki: 'ᱯᱩᱱ ᱜᱮᱞ / ᱵᱟᱨ ᱤᱥᱤ',
    wordRoman: 'pun gel / bar isi',
    wordDeva: 'पुन गेल / बार इसी',
    wordEnglish: 'Forty',
    wordHindi: 'चालीस',
    pattern: 'Four-ten, or "two-twenty" (ᱵᱟᱨ ᱤᱥᱤ)',
    note: 'Like French quatre-vingt, 40 can be counted as two-twenty.'
  },
  {
    value: 50,
    olChikiDigits: '᱕᱐',
    wordOlChiki: 'ᱢᱚᱬᱮ ᱜᱮᱞ',
    wordRoman: 'môṇe gel',
    wordDeva: 'मोणे गेल',
    wordEnglish: 'Fifty',
    wordHindi: 'पचास',
    pattern: 'Five-ten (ᱢᱚᱬᱮ + ᱜᱮᱞ)'
  },
  {
    value: 60,
    olChikiDigits: '᱖᱐',
    wordOlChiki: 'ᱛᱩᱨᱩᱭ ᱜᱮᱞ / ᱯᱮ ᱤᱥᱤ',
    wordRoman: 'turuy gel / pe isi',
    wordDeva: 'तुरुय गेल / पे इसी',
    wordEnglish: 'Sixty',
    wordHindi: 'साठ',
    pattern: 'Six-ten, or "three-twenty"'
  },
  {
    value: 100,
    olChikiDigits: '᱑᱐᱐',
    wordOlChiki: 'ᱥᱟᱭ',
    wordRoman: 'say / so',
    wordDeva: 'साय / सो',
    wordEnglish: 'One Hundred',
    wordHindi: 'सौ',
    pattern: 'Native word ᱥᱟᱭ (say)'
  },
  {
    value: 1000,
    olChikiDigits: '᱑᱐᱐᱐',
    wordOlChiki: 'ᱦᱟᱡᱟᱨ',
    wordRoman: 'hajar',
    wordDeva: 'हाजार',
    wordEnglish: 'One Thousand',
    wordHindi: 'हज़ार',
    pattern: 'Standard borrowed root'
  },
  {
    value: 100000,
    olChikiDigits: '᱑᱐᱐᱐᱐᱐',
    wordOlChiki: 'ᱞᱟᱠᱷ',
    wordRoman: 'lakh / lak',
    wordDeva: 'लाख',
    wordEnglish: 'One Lakh (100,000)',
    wordHindi: 'लाख',
    pattern: 'Standard borrowed root'
  },
  {
    value: 10000000,
    olChikiDigits: '᱑᱐᱐᱐᱐᱐᱐᱐',
    wordOlChiki: 'ᱠᱚᱨᱚᱲ',
    wordRoman: 'kôrôṛ',
    wordDeva: 'करोड़',
    wordEnglish: 'One Crore (10,000,000)',
    wordHindi: 'करोड़',
    pattern: 'Standard borrowed root'
  }
];

// Map 0-9 Hindu-Arabic or Devanagari to Ol Chiki digits (U+1C50 - U+1C59)
export const DIGIT_TO_OL_CHIKI_MAP: Record<string, string> = {
  '0': '᱐', '1': '᱑', '2': '᱒', '3': '᱓', '4': '᱔',
  '5': '᱕', '6': '᱖', '7': '᱗', '8': '᱘', '9': '᱙',
  '०': '᱐', '१': '᱑', '२': '᱒', '३': '᱓', '४': '᱔',
  '५': '᱕', '६': '᱖', '७': '᱗', '८': '᱘', '९': '᱙'
};

export const OL_CHIKI_TO_DIGIT_MAP: Record<string, string> = {
  '᱐': '0', '᱑': '1', '᱒': '2', '᱓': '3', '᱔': '4',
  '᱕': '5', '᱖': '6', '᱗': '7', '᱘': '8', '᱙': '9'
};

/**
 * Transduces all ASCII digits (0-9) and Devanagari digits (०-९) into native Ol Chiki digits (᱐-᱙).
 */
export function transduceDigitsToOlChiki(text: string): string {
  if (!text) return text;
  return text.replace(/[0-9०-९]/g, match => DIGIT_TO_OL_CHIKI_MAP[match] || match);
}

/**
 * Converts a positive integer to Santali Ol Chiki compound words and Roman pronunciation.
 */
export function formatSantaliNumberWords(n: number): { olchiki: string; roman: string; deva: string } {
  if (n === 0) return { olchiki: '᱐', roman: 'zero', deva: 'सुन्नो' };
  if (n < 0) {
    const pos = formatSantaliNumberWords(-n);
    return { olchiki: 'ᱢᱟᱭᱱᱟᱥ ' + pos.olchiki, roman: 'minus ' + pos.roman, deva: 'माइनस ' + pos.deva };
  }

  const baseWords: Record<number, { ol: string; ro: string; de: string }> = {
    1: { ol: 'ᱢᱤᱫ', ro: "mit'", de: 'मिद' },
    2: { ol: 'ᱵᱟᱨ', ro: 'bar', de: 'बार' },
    3: { ol: 'ᱯᱮ', ro: 'pe', de: 'पे' },
    4: { ol: 'ᱯᱩᱱ', ro: 'pun', de: 'पुन' },
    5: { ol: 'ᱢᱚᱬᱮ', ro: 'môṇe', de: 'मोणे' },
    6: { ol: 'ᱛᱩᱨᱩᱭ', ro: 'turuy', de: 'तुरुय' },
    7: { ol: 'ᱮᱭᱟᱭ', ro: 'eyay', de: 'एयाय' },
    8: { ol: 'ᱤᱨᱟᱹᱞ', ro: 'irăl', de: 'इऱल' },
    9: { ol: 'ᱟᱨᱮ', ro: 'are', de: 'आरे' },
    10: { ol: 'ᱜᱮᱞ', ro: 'gel', de: 'गेल' }
  };

  if (n <= 10) {
    const item = baseWords[n];
    return { olchiki: item.ol, roman: item.ro, deva: item.de };
  }

  if (n > 10 && n < 20) {
    const unit = n % 10;
    const unitWord = baseWords[unit];
    return {
      olchiki: `ᱜᱮᱞ ${unitWord.ol}`,
      roman: `gel ${unitWord.ro}`,
      deva: `गेल ${unitWord.de}`
    };
  }

  if (n === 20) {
    return { olchiki: 'ᱤᱥᱤ', roman: 'isi', deva: 'इसी' };
  }

  if (n > 20 && n < 30) {
    const unit = n % 10;
    const unitWord = baseWords[unit];
    return {
      olchiki: `ᱤᱥᱤ ${unitWord.ol}`,
      roman: `isi ${unitWord.ro}`,
      deva: `इसी ${unitWord.de}`
    };
  }

  if (n >= 30 && n < 100) {
    const tens = Math.floor(n / 10);
    const unit = n % 10;
    const tensWord = baseWords[tens];
    const unitWord = unit > 0 ? baseWords[unit] : null;

    if (unitWord) {
      return {
        olchiki: `${tensWord.ol} ᱜᱮᱞ ${unitWord.ol}`,
        roman: `${tensWord.ro} gel ${unitWord.ro}`,
        deva: `${tensWord.de} गेल ${unitWord.de}`
      };
    }
    return {
      olchiki: `${tensWord.ol} ᱜᱮᱞ`,
      roman: `${tensWord.ro} gel`,
      deva: `${tensWord.de} गेल`
    };
  }

  if (n === 100) {
    return { olchiki: 'ᱥᱟᱭ', roman: 'say', deva: 'साय' };
  }

  if (n > 100 && n < 1000) {
    const hundreds = Math.floor(n / 100);
    const rem = n % 100;
    const hWord = baseWords[hundreds] || { ol: 'ᱢᱤᱫ', ro: "mit'", de: 'मिद' };
    const prefix = hundreds === 1 ? 'ᱥᱟᱭ' : `${hWord.ol} ᱥᱟᱭ`;
    const prefixRo = hundreds === 1 ? 'say' : `${hWord.ro} say`;
    const prefixDe = hundreds === 1 ? 'साय' : `${hWord.de} साय`;

    if (rem === 0) return { olchiki: prefix, roman: prefixRo, deva: prefixDe };
    const remWord = formatSantaliNumberWords(rem);
    return {
      olchiki: `${prefix} ${remWord.olchiki}`,
      roman: `${prefixRo} ${remWord.roman}`,
      deva: `${prefixDe} ${remWord.deva}`
    };
  }

  if (n >= 1000 && n < 100000) {
    const th = Math.floor(n / 1000);
    const rem = n % 1000;
    const thWord = formatSantaliNumberWords(th);
    const prefix = `${thWord.olchiki} ᱦᱟᱡᱟᱨ`;
    const prefixRo = `${thWord.roman} hajar`;
    const prefixDe = `${thWord.deva} हाजार`;

    if (rem === 0) return { olchiki: prefix, roman: prefixRo, deva: prefixDe };
    const remWord = formatSantaliNumberWords(rem);
    return {
      olchiki: `${prefix} ${remWord.olchiki}`,
      roman: `${prefixRo} ${remWord.roman}`,
      deva: `${prefixDe} ${remWord.deva}`
    };
  }

  return {
    olchiki: transduceDigitsToOlChiki(String(n)),
    roman: String(n),
    deva: String(n)
  };
}

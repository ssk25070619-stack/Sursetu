# -*- coding: utf-8 -*-
"""
Updater for src/engine/nlpEngine.ts
"""
import re

def update_ts():
    with open("src/engine/nlpEngine.ts", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update transduceDevaToOlChiki to add inherent schwa 'ᱚ'
    old_transduce_fn = '''export function transduceDevaToOlChiki(text: string): string {
  if (!text) return '';
  const result: string[] = [];
  let i = 0;
  const n = text.length;

  while (i < n) {
    // 1. Check conjuncts first (क्ष, त्र, ज्ञ, श्र)
    const twoChars = text.slice(i, i + 2);
    if (DEVA_CONJUNCTS_TO_OL[twoChars]) {
      const matched = DEVA_CONJUNCTS_TO_OL[twoChars];
      i += 2;
      if (i < n && DEVA_MATRAS_TO_OL[text[i]]) {
        const matra = DEVA_MATRAS_TO_OL[text[i]];
        if (text[i] === 'ं' || text[i] === 'ँ') {
          result.push(matched + 'ᱚ' + matra);
        } else {
          result.push(matched + matra);
        }
        i += 1;
      } else if (i < n && text[i] === '्') {
        result.push(matched);
        i += 1;
      } else {
        result.push(matched);
      }
      continue;
    }

    // 2. Check 2-character base consonants (क़, ख़, ग़, ज़, फ़, ड़, ढ़) or independent vowels (अं, अः)
    if (DEVA_CONSONANTS_TO_OL[twoChars]) {
      const matched = DEVA_CONSONANTS_TO_OL[twoChars];
      i += 2;
      if (i < n && DEVA_MATRAS_TO_OL[text[i]]) {
        const matra = DEVA_MATRAS_TO_OL[text[i]];
        if (text[i] === 'ं' || text[i] === 'ँ') {
          result.push(matched + 'ᱚ' + matra);
        } else {
          result.push(matched + matra);
        }
        i += 1;
      } else if (i < n && text[i] === '्') {
        result.push(matched);
        i += 1;
      } else {
        result.push(matched);
      }
      continue;
    }

    if (DEVA_INDEP_VOWELS_TO_OL[twoChars]) {
      result.push(DEVA_INDEP_VOWELS_TO_OL[twoChars]);
      i += 2;
      continue;
    }

    // 3. Check single base consonant
    const ch = text[i];
    if (DEVA_CONSONANTS_TO_OL[ch]) {
      const matched = DEVA_CONSONANTS_TO_OL[ch];
      i += 1;
      if (i < n && DEVA_MATRAS_TO_OL[text[i]]) {
        const matra = DEVA_MATRAS_TO_OL[text[i]];
        if (text[i] === 'ं' || text[i] === 'ँ') {
          result.push(matched + 'ᱚ' + matra);
        } else {
          result.push(matched + matra);
        }
        i += 1;
      } else if (i < n && text[i] === '्') {
        result.push(matched);
        i += 1;
      } else {
        result.push(matched);
      }
      continue;
    }'''

    new_transduce_fn = '''export function transduceDevaToOlChiki(text: string): string {
  if (!text) return '';
  const result: string[] = [];
  let i = 0;
  const n = text.length;

  while (i < n) {
    // 1. Check conjuncts first (क्ष, त्र, ज्ञ, श्र)
    const twoChars = text.slice(i, i + 2);
    if (DEVA_CONJUNCTS_TO_OL[twoChars]) {
      const matched = DEVA_CONJUNCTS_TO_OL[twoChars];
      i += 2;
      if (i < n && DEVA_MATRAS_TO_OL[text[i]]) {
        const matra = DEVA_MATRAS_TO_OL[text[i]];
        if (text[i] === 'ं' || text[i] === 'ँ') {
          result.push(matched + 'ᱚ' + matra);
        } else {
          result.push(matched + matra);
        }
        i += 1;
      } else if (i < n && text[i] === '्') {
        result.push(matched);
        i += 1;
      } else {
        result.push(matched + 'ᱚ');
      }
      continue;
    }

    // 2. Check 2-character base consonants (क़, ख़, ग़, ज़, फ़, ड़, ढ़) or independent vowels (अं, अः)
    if (DEVA_CONSONANTS_TO_OL[twoChars]) {
      const matched = DEVA_CONSONANTS_TO_OL[twoChars];
      i += 2;
      if (i < n && DEVA_MATRAS_TO_OL[text[i]]) {
        const matra = DEVA_MATRAS_TO_OL[text[i]];
        if (text[i] === 'ं' || text[i] === 'ँ') {
          result.push(matched + 'ᱚ' + matra);
        } else {
          result.push(matched + matra);
        }
        i += 1;
      } else if (i < n && text[i] === '्') {
        result.push(matched);
        i += 1;
      } else {
        result.push(matched + 'ᱚ');
      }
      continue;
    }

    if (DEVA_INDEP_VOWELS_TO_OL[twoChars]) {
      result.push(DEVA_INDEP_VOWELS_TO_OL[twoChars]);
      i += 2;
      continue;
    }

    // 3. Check single base consonant
    const ch = text[i];
    if (DEVA_CONSONANTS_TO_OL[ch]) {
      const matched = DEVA_CONSONANTS_TO_OL[ch];
      i += 1;
      if (i < n && DEVA_MATRAS_TO_OL[text[i]]) {
        const matra = DEVA_MATRAS_TO_OL[text[i]];
        if (text[i] === 'ं' || text[i] === 'ँ') {
          result.push(matched + 'ᱚ' + matra);
        } else {
          result.push(matched + matra);
        }
        i += 1;
      } else if (i < n && text[i] === '्') {
        result.push(matched);
        i += 1;
      } else {
        result.push(matched + 'ᱚ');
      }
      continue;
    }'''

    content = content.replace(old_transduce_fn, new_transduce_fn)

    # 2. Add narrative and agricultural phrases to CONVERSATIONAL_PHRASES in nlpEngine.ts
    phrases_to_add = '''const CONVERSATIONAL_PHRASES: Record<string, string> = {
  // Complex Narrative, Nature & Agricultural Sentences
  'हमारे गाँव के चारों ओर हरे-भरे पहाड़ और घने जंगल हैं।': 'ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ ᱵᱮᱲᱦᱟᱭ ᱛᱮ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱵᱩᱨᱩ ᱟᱨ ᱜᱟᱡᱟᱲ ᱵᱤᱨ ᱢᱮᱱᱟᱜᱼᱟ᱾',
  'हमारे गाँव के चारों ओर हरे-भरे पहाड़ और घने जंगल हैं': 'ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ ᱵᱮᱲᱦᱟᱭ ᱛᱮ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱵᱩᱨᱩ ᱟᱨ ᱜᱟᱡᱟᱲ ᱵᱤᱨ ᱢᱮᱱᱟᱜᱼᱟ᱾',
  'किसान सुबह सूरज उगने से पहले ही खेतों में काम करने चले गए।': 'ᱪᱟᱹᱥᱤ ᱥᱮᱛᱟᱜ ᱵᱮᱲᱟ ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮᱜᱮ ᱵᱟᱹᱫᱽ ᱨᱮ ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ ᱠᱚ ᱪᱟᱞᱟᱣ ᱮᱱᱟ᱾',
  'किसान सुबह सूरज उगने से पहले ही खेतों में काम करने चले गए': 'ᱪᱟᱹᱥᱤ ᱥᱮᱛᱟᱜ ᱵᱮᱲᱟ ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮᱜᱮ ᱵᱟᱹᱫᱽ ᱨᱮ ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ ᱠᱚ ᱪᱟᱞᱟᱣ ᱮᱱᱟ᱾',
  'नदी का पानी इतना साफ़ था कि नीचे के पत्थर साफ़ दिखाई दे रहे थे।': 'ᱜᱟᱰᱟ ᱨᱮᱱᱟᱜ ᱫᱟᱜ ᱩᱱᱟᱹᱜ ᱯᱷᱟᱨᱪᱟ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱡᱮ ᱞᱟᱛᱟᱨ ᱨᱮᱱᱟᱜ ᱫᱷᱤᱨᱤ ᱠᱚ ᱯᱩᱥᱴᱟᱹᱣ ᱧᱮᱞᱚᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ᱾',
  'नदी का पानी इतना साफ़ था कि नीचे के पत्थर साफ़ दिखाई दे रहे थे': 'ᱜᱟᱰᱟ ᱨᱮᱱᱟᱜ ᱫᱟᱜ ᱩᱱᱟᱹᱜ ᱯᱷᱟᱨᱪᱟ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱡᱮ ᱞᱟᱛᱟᱨ ᱨᱮᱱᱟᱜ ᱫᱷᱤᱨᱤ ᱠᱚ ᱯᱩᱥᱴᱟᱹᱣ ᱧᱮᱞᱚᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ᱾',
  'इस बार अच्छी बारिश होने के कारण धान की फ़सल बहुत अच्छी हुई है।': 'ᱱᱤᱭᱟᱹ ᱫᱷᱟᱣ ᱱᱟᱯᱟᱭ ᱫᱟᱜ ᱦᱩᱭ ᱮᱱ ᱠᱷᱟᱹᱛᱤᱨ ᱦᱳᱲᱳ ᱨᱮᱱᱟᱜ ᱯᱷᱚᱥᱚᱞ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱦᱩᱭ ᱟᱠᱟᱱᱟ᱾',
  'इस बार अच्छी बारिश होने के कारण धान की फ़सल बहुत अच्छी हुई है': 'ᱱᱤᱭᱟᱹ ᱫᱷᱟᱣ ᱱᱟᱯᱟᱭ ᱫᱟᱜ ᱦᱩᱭ ᱮᱱ ᱠᱷᱟᱹᱛᱤᱨ ᱦᱳᱲᱳ ᱨᱮᱱᱟᱜ ᱯᱷᱚᱥᱚᱞ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱦᱩᱭ ᱟᱠᱟᱱᱟ᱾',
  'इस बार अच्छी बारिश होने के कारण धान की फसल बहुत अच्छी हुई है।': 'ᱱᱤᱭᱟᱹ ᱫᱷᱟᱣ ᱱᱟᱯᱟᱭ ᱫᱟᱜ ᱦᱩᱭ ᱮᱱ ᱠᱷᱟᱹᱛᱤᱨ ᱦᱳᱲᱳ ᱨᱮᱱᱟᱜ ᱯᱷᱚᱥᱚᱞ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱦᱩᱭ ᱟᱠᱟᱱᱟ᱾',
  'इस बार अच्छी बारिश होने के कारण धान की फसल बहुत अच्छी हुई है': 'ᱱᱤᱭᱟᱹ ᱫᱷᱟᱣ ᱱᱟᱯᱟᱭ ᱫᱟᱜ ᱦᱩᱭ ᱮᱱ ᱠᱷᱟᱹᱛᱤᱨ ᱦᱳᱲᱳ ᱨᱮᱱᱟᱜ ᱯᱷᱚᱥᱚᱞ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱦᱩᱭ ᱟᱠᱟᱱᱟ᱾',
'''

    content = content.replace("const CONVERSATIONAL_PHRASES: Record<string, string> = {", phrases_to_add)

    # 3. Add to COMMON_CONVERSATIONAL_WORDS
    words_to_add = '''const COMMON_CONVERSATIONAL_WORDS: Record<string, string> = {
  'हमारे गाँव': 'ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ', 'हमारा गाँव': 'ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ',
  'के चारों ओर': 'ᱵᱮᱲᱦᱟᱭ ᱛᱮ', 'चारों ओर': 'ᱵᱮᱲᱦᱟᱭ ᱛᱮ', 'चारों तरफ': 'ᱵᱮᱲᱦᱟᱭ ᱛᱮ',
  'हरे-भरे': 'ᱦᱟᱹᱨᱭᱟᱹᱲ', 'हरा-भरा': 'ᱦᱟᱹᱨᱭᱟᱹᱲ', 'हरा भरा': 'ᱦᱟᱹᱨᱭᱟᱹᱲ', 'हरे भरे': 'ᱦᱟᱹᱨᱭᱟᱹᱲ',
  'पहाड़': 'ᱵᱩᱨᱩ', 'पहाड़': 'ᱵᱩᱨᱩ', 'पहाड़ें': 'ᱵᱩᱨᱩ ᱠᱚ',
  'घने जंगल': 'ᱜᱟᱡᱟᱲ ᱵᱤᱨ', 'घना जंगल': 'ᱜᱟᱡᱟᱲ ᱵᱤᱨ', 'घने': 'ᱜᱟᱡᱟᱲ', 'घना': 'ᱜᱟᱡᱟᱲ', 'जंगल': 'ᱵᱤᱨ', 'वन': 'ᱵᱤᱨ',
  'किसान': 'ᱪᱟᱹᱥᱤ', 'किसानों': 'ᱪᱟᱹᱥᱤ ᱠᱚ', 'किसान लोग': 'ᱪᱟᱹᱥᱤ ᱠᱚ', 'किसान सब': 'ᱪᱟᱹᱥᱤ ᱠᱚ',
  'सूरज': 'ᱵᱮᱲᱟ', 'सूर्य': 'ᱵᱮᱲᱟ',
  'सूरज उगने से पहले ਹੀ': 'ᱵᱮᱲᱟ ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮᱜᱮ', 'सूरज उगने से पहले': 'ᱵᱮᱲᱟ ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮ',
  'उगने से पहले ہی': 'ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮᱜᱮ', 'उगने से पहले': 'ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮ',
  'पहले ही': 'ᱞᱟᱦᱟ ᱨᱮᱜᱮ', 'पहले': 'ᱞᱟᱦᱟ ᱨᱮ',
  'खेतों में': 'ᱵᱟᱹᱫᱽ ᱨᱮ', 'खेत में': 'ᱵᱟᱹᱫᱽ ᱨᱮ', 'खेत': 'ᱵᱟᱹᱫᱽ', 'खेतों': 'ᱵᱟᱹᱫᱽ ᱠᱚ',
  'काम करने के लिए': 'ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ', 'काम करने': 'ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ', 'काम करना': 'ᱠᱟᱹᱢᱤ',
  'चले गए': 'ᱠᱚ ᱪᱟᱞᱟᱣ ᱮᱱᱟ', 'चले गये': 'ᱠᱚ ᱪᱟᱞᱟᱣ ᱮᱱᱟ', 'चला गया': 'ᱪᱟᱞᱟᱣ ᱮᱱᱟ',
  'नदी': 'ᱜᱟᱰᱟ', 'नदियाँ': 'ᱜᱟᱰᱟ ᱠᱚ', 'नदी का': 'ᱜᱟᱰᱟ ᱨᱮᱱᱟᱜ', 'नदी की': 'ᱜᱟᱰᱟ ᱨᱮᱱᱟᱜ',
  'इतना': 'ᱩᱱᱟᱹᱜ', 'इतनी': 'ᱩᱱᱟᱹᱜ', 'इतना साफ़': 'ᱩᱱᱟᱹᱜ ᱯᱷᱟᱨᱪᱟ', 'इतना साफ': 'ᱩᱱᱟᱹᱜ ᱯᱷᱟᱨᱪᱟ',
  'साफ़': 'ᱯᱷᱟᱨᱪᱟ', 'साफ': 'ᱯᱷᱟᱨᱪᱟ', 'स्वच्छ': 'ᱯᱷᱟᱨᱪᱟ',
  'नीचे': 'ᱞᱟᱛᱟᱨ', 'नीचे के': 'ᱞᱟᱛᱟᱨ ᱨᱮᱱᱟᱜ', 'नीचे का': 'ᱞᱟᱛᱟᱨ ᱨᱮᱱᱟᱜ',
  'पत्थर': 'ᱫᱷᱤᱨᱤ', 'पत्थरों': 'ᱫᱷᱤᱨᱤ ᱠᱚ', 'पत्थर सब': 'ᱫᱷᱤᱨᱤ ᱠᱚ',
  'साफ़ दिखाई दे रहे थे': 'ᱯᱩᱥᱴᱟᱹᱣ ᱧᱮᱞᱚᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ', 'दिखाई दे रहे थे': 'ᱧᱮᱞᱚᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ', 'दिखाई देना': 'ᱧᱮᱞᱚᱜ', 'स्पष्ट': 'ᱯᱩᱥᱴᱟᱹᱣ',
  'इस बार': 'ᱱᱤᱭᱟᱹ ᱫᱷᱟᱣ', 'इस समय': 'ᱱᱤᱭᱟᱹ ᱚᱠᱛᱚ',
  'अच्छी बारिश': 'ᱱᱟᱯᱟᱭ ᱫᱟᱜ', 'बारिश': 'ᱫᱟᱜ', 'वर्षा': 'ᱫᱟᱜ',
  'होने के कारण': 'ᱦᱩᱭ ᱮᱱ ᱠᱷᱟᱹᱛᱤᱨ', 'होने से': 'ᱦᱩᱭ ᱮᱱ ᱠᱷᱟᱹᱛᱤᱨ', 'के कारण': 'ᱠᱷᱟᱹᱛᱤᱨ',
  'धान': 'ᱦᱳᱲᱳ', 'धान की फ़सल': 'ᱦᱳᱲᱳ ᱨᱮᱱᱟᱜ ᱯᱷᱚᱥᱚᱞ', 'धान की फसल': 'ᱦᱳᱲᱳ ᱨᱮᱱᱟᱜ ᱯᱷᱚᱥᱚᱞ', 'फ़सल': 'ᱯᱷᱚᱥᱚᱞ', 'फसल': 'ᱯᱷᱚᱥᱚᱞ',
  'बहुत अच्छी': 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ', 'हुई है': 'ᱦᱩᱭ ᱟᱠᱟᱱᱟ', 'हुआ है': 'ᱦᱩᱭ ᱟᱠᱟᱱᱟ',
'''
    content = content.replace("const COMMON_CONVERSATIONAL_WORDS: Record<string, string> = {", words_to_add)

    with open("src/engine/nlpEngine.ts", "w", encoding="utf-8") as f:
        f.write(content)

    print("src/engine/nlpEngine.ts successfully updated!")

if __name__ == "__main__":
    update_ts()

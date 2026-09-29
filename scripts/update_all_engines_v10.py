# -*- coding: utf-8 -*-
"""
Comprehensive update for translation_engine.py and src/engine/nlpEngine.ts
"""
import re

NEW_VOCAB_ENTRIES = {
    # Courtyard, Mahua, Trees, Base & Children Playing (Sentence #5)
    "आँगन में लगे महुआ के पेड़ के नीचे": {"ol": "ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ", "odia": "ରାଚା ରେ ମେନାଗ ମାତକୋମ ଦାରେ ବୁଟା ରେ", "deva": "राचा रे मेनाग मातकोम दारे बुटा रे"},
    "आँगन में लगे महुआ के पेड़": {"ol": "ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ", "odia": "ରାଚା ରେ ମେନାଗ ମାତକୋମ ଦାରେ", "deva": "राचा रे मेनाग मातकोम दारे"},
    "आँगन में लगे": {"ol": "ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ", "odia": "ରାଚା ରେ ମେନାଗ", "deva": "राचा रे मेनाग"},
    "आँगन में लगा": {"ol": "ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ", "odia": "ରାଚᱟ ରେ ମେନାଗ", "deva": "राचा रे मेनाग"},
    "आँगन में": {"ol": "ᱨᱟᱪᱟ ᱨᱮ", "odia": "ରାଚା ରେ", "deva": "राचा रे"},
    "आँगन": {"ol": "ᱨᱟᱪᱟ", "odia": "ରାଚା", "deva": "राचा"},
    "आंगन में लगे": {"ol": "ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ", "odia": "ରାଚା ରେ ମᱮନାଗ", "deva": "राचा रे मेनाग"},
    "आंगन में": {"ol": "ᱨᱟᱪᱟ ᱨᱮ", "odia": "ରାଚᱟ ରେ", "deva": "राचा रे"},
    "आंगन": {"ol": "ᱨᱟᱪᱟ", "odia": "ରାଚᱟ", "deva": "राचा"},
    "लगे": {"ol": "ᱢᱮᱱᱟᱜ", "odia": "ᱢᱮନାଗ", "deva": "मेनाग"},
    "लगा हुआ": {"ol": "ᱢᱮᱱᱟᱜ", "odia": "ᱢᱮନାଗ", "deva": "मेनाग"},
    "महुआ के पेड़ के नीचे": {"ol": "ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ", "odia": "ମାତକୋମ ଦାରେ ବୁଟା ରେ", "deva": "मातकोम दारे बुटा रे"},
    "महुआ के पेड़": {"ol": "ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ", "odia": "ମାତକୋମ ଦାରେ", "deva": "मातकोम दारे"},
    "महुआ का पेड़": {"ol": "ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ", "odia": "ମᱟତକୋᱢ ଦାରେ", "deva": "मातकोम दारे"},
    "महुआ": {"ol": "ᱢᱟᱛᱠᱚᱢ", "odia": "ମାତକୋମ", "deva": "मातकोम"},
    "के पेड़ के नीचे": {"ol": "ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ", "odia": "ଦାରେ ବୁଟା ରେ", "deva": "दारे बुटा रे"},
    "पेड़ के नीचे": {"ol": "ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ", "odia": "ଦାରେ ବୁଟା ରେ", "deva": "दारे बुटा रे"},
    "के पेड़": {"ol": "ᱫᱟᱨᱮ", "odia": "ଦାରେ", "deva": "दारे"},
    "के नीचे": {"ol": "ᱞᱟᱛᱟᱨ ᱨᱮ", "odia": "ଲାତାର ରେ", "deva": "लातार रे"},
    "पेड़": {"ol": "ᱫᱟᱨᱮ", "odia": "ଦାରᱮ", "deva": "दारे"},
    "पेड़ सब": {"ol": "ᱫᱟᱨᱮ ᱠᱚ", "odia": "ଦାରେ କୋ", "deva": "दारे को"},
    "पेड़ों": {"ol": "ᱫᱟᱨᱮ ᱠᱚ", "odia": "ଦାରେ କୋ", "deva": "दारे को"},
    "बच्चे": {"ol": "ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ", "odia": "ଗିଦ୍ରା କୋ", "deva": "गिद्रा को"},
    "बच्चा": {"ol": "ᱜᱤᱫᱽᱨᱟᱹ", "odia": "ଗᱤଦ୍ରା", "deva": "गिद्रा"},
    "खेल रहे हैं": {"ol": "ᱮᱱᱮᱡ ᱠᱟᱱᱟ ᱠᱚ", "odia": "ଏନେଜ କାନା କୋ", "deva": "एनेज काना को"},
    "खेल रहे थे": {"ol": "ᱮᱱᱮᱡ ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱠᱚ", "odia": "ଏନେଜ କାନ ତାହେଁ କାନା କୋ", "deva": "एनेज कान ताहेँ काना को"},
    "खेल रहे": {"ol": "ᱮᱱᱮᱡ ᱠᱟᱱ", "odia": "ଏନେଜ କାନ", "deva": "एनेज कान"},
    "खेलना": {"ol": "ᱮᱱᱮᱡ", "odia": "ଏନେଜ", "deva": "एनेज"},
    "खेल": {"ol": "ᱮᱱᱮᱡ", "odia": "ଏନᱮᱡ", "deva": "एनेज"},

    # Market, Return, Storm, Wind & Rain (Sentence #6)
    "बाज़ार से लौटते समय": {"ol": "ᱦᱟᱴ ᱠᱷᱚᱱ ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ", "odia": "ହାଟ ଖୋନ ରୁୱାଡ଼ ଅକ୍ତୋ", "deva": "हाट खोन रुवाड़ अक्तो"},
    "बाजार से लौटते समय": {"ol": "ᱦᱟᱴ ᱠᱷᱚᱱ ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ", "odia": "ହାଟ ଖୋନ ରୁୱᱟଡ଼ ଅକ୍ତୋ", "deva": "हाट खोन रुवाड़ अक्तो"},
    "बाज़ार से": {"ol": "ᱦᱟᱴ ᱠᱷᱚᱱ", "odia": "ହାଟ ଖୋନ", "deva": "हाट खोन"},
    "बाजार से": {"ol": "ᱦᱟᱴ ᱠᱷᱚᱱ", "odia": "ହାଟ ଖୋନ", "deva": "हाट खोन"},
    "बाज़ार": {"ol": "ᱦᱟᱴ", "odia": "ହାଟ", "deva": "हाट"},
    "बाजार": {"ol": "ᱦᱟᱴ", "odia": "ହାଟ", "deva": "हाट"},
    "लौटते समय": {"ol": "ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ", "odia": "ᱨᱩୱାଡ଼ ଅକ୍ତୋ", "deva": "रुवाड़ अक्तो"},
    "लौटते वक्त": {"ol": "ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ", "odia": "ᱨᱩୱାଡ଼ ଅକ୍ᱛୋ", "deva": "रुवाड़ अक्तो"},
    "लौटते": {"ol": "ᱨᱩᱣᱟᱹᱲ", "odia": "ᱨᱩୱᱟଡ଼", "deva": "रुवाड़"},
    "लौटना": {"ol": "ᱨᱩᱣᱟᱹᱲ", "odia": "ᱨᱩୱᱟଡ଼", "deva": "रुवाड़"},
    "वापस आते समय": {"ol": "ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ", "odia": "ᱨᱩୱᱟଡ଼ ଅକ୍ତୋ", "deva": "रुवाड़ अक्तो"},
    "समय": {"ol": "ᱚᱠᱛᱚ", "odia": "ଅକ୍ତୋ", "deva": "अक्तो"},
    "अचानक": {"ol": "ᱚᱪᱠᱟ ᱜᱮ", "odia": "ଅଚକା ଗେ", "deva": "अचका गे"},
    "अचानक ही": {"ol": "ᱚᱪᱠᱟ ᱜᱮ", "odia": "ଅଚକା ଗେ", "deva": "अचका गे"},
    "तेज़ आंधी और बारिश": {"ol": "ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ ᱟᱨ ᱫᱟᱜ", "odia": "ଆଡ଼ି ଜୁᱨ ହୁଦୁଡ଼ ଆର ଦᱟଗ", "deva": "आड़ि जुर हुदुड़ आर दाग"},
    "तेज आंधी और बारिश": {"ol": "ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ ᱟᱨ ᱫᱟᱜ", "odia": "ଆଡ଼ᱤ ଜୁᱨ ହᱩᱫୁଡ଼ ଆᱨ ଦᱟଗ", "deva": "आड़ि जुर हुदुड़ आर दाग"},
    "तेज़ आंधी": {"ol": "ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ", "odia": "ଆଡ଼ᱤ ଜᱩᱨ ହୁᱫୁଡ଼", "deva": "आड़ि जुर हुदुड़"},
    "तेज आंधी": {"ol": "ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ", "odia": "ଆଡ଼ᱤ ଜᱩᱨ ହୁᱫୁଡ଼", "deva": "आड़ि जुर हुदुड़"},
    "तेज़": {"ol": "ᱟᱹᱰᱤ ᱡᱩᱨ", "odia": "ଆଡ଼ି ଜୁᱨ", "deva": "आड़ि जुर"},
    "तेज": {"ol": "ᱟᱹᱰᱤ ᱡᱩᱨ", "odia": "ଆଡ଼ᱤ ଜᱩᱨ", "deva": "आड़ि जुर"},
    "आंधी": {"ol": "ᱦᱩᱫᱩᱲ", "odia": "ᱦᱩᱫୁଡ଼", "deva": "हुदुड़"},
    "तूफ़ान": {"ol": "ᱵᱟᱹᱨᱰᱩ", "odia": "ବାଡ଼ୁ", "deva": "बाड़ु"},
    "तूफान": {"ol": "ᱵᱟᱹᱨᱰᱩ", "odia": "ବାଡ଼ୁ", "deva": "बाड़ु"},
    "शुरू हो गई": {"ol": "ᱮᱦᱚᱵ ᱮᱱᱟ", "odia": "ଏହୋବ ଏନା", "deva": "एहोब एना"},
    "शुरू हो गया": {"ol": "ᱮᱦᱚᱵ ᱮᱱᱟ", "odia": "ଏହୋବ ଏନା", "deva": "एहोब एना"},
    "शुरू हुई": {"ol": "ᱮᱦᱚᱵ ᱮᱱᱟ", "odia": "ଏହୋବ ଏନା", "deva": "एहोब एना"},
    "शुरू हुआ": {"ol": "ᱮᱦᱚᱵ ᱮᱱᱟ", "odia": "ଏᱦୋବ ଏନା", "deva": "एहोब एना"},
    "शुरू": {"ol": "ᱮᱦᱚᱵ", "odia": "ଏହୋବ", "deva": "एहोब"},
    "हो गई": {"ol": "ᱦᱩᱭ ᱮᱱᱟ", "odia": "ᱦᱩୟ ଏନା", "deva": "हुय एना"},
    "हो गया": {"ol": "ᱦᱩᱭ ᱮᱱᱟ", "odia": "ᱦᱩୟ ଏନା", "deva": "हुय एना"},

    # Continuous Tense Markers
    "रहे हैं": {"ol": "ᱠᱟᱱᱟ ᱠᱚ", "odia": "କାନା କୋ", "deva": "काना को"},
    "रहा है": {"ol": "ᱠᱟᱱᱟᱭ", "odia": "କାନାୟ", "deva": "कानाय"},
    "रही है": {"ol": "ᱠᱟᱱᱟᱭ", "odia": "କାନᱟୟ", "deva": "कानाय"},
    "रहे थे": {"ol": "ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱠᱚ", "odia": "କାନ ତାହେଁ କାନା କୋ", "deva": "कान ताहेँ काना को"},
    "रहा था": {"ol": "ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ", "odia": "କାନ ତାହେଁ କାନା", "deva": "कान ताहेँ काना"},
    "रही थी": {"ol": "ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ", "odia": "କାନ ତାହେଁ କାନା", "deva": "कान ताहेँ काना"},
}

def update_python():
    with open("translation_engine.py", "r", encoding="utf-8") as f:
        content = f.read()

    # Inject into GRAMMAR_LEXICON
    entries_str = ""
    for k, v in NEW_VOCAB_ENTRIES.items():
        entries_str += f'    "{k}": {{"ol": "{v["ol"]}", "odia": "{v["odia"]}", "deva": "{v["deva"]}"}},\n'

    content = content.replace("GRAMMAR_LEXICON = {", "GRAMMAR_LEXICON = {\n" + entries_str)

    with open("translation_engine.py", "w", encoding="utf-8") as f:
        f.write(content)

    print("translation_engine.py updated with new lexicon!")

def update_typescript():
    with open("src/engine/nlpEngine.ts", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update transduceDevaToOlChiki in nlpEngine.ts to also do Hindi schwa deletion on word boundary
    new_ts_transducer = '''export function transduceDevaToOlChiki(text: string): string {
  if (!text) return '';
  const result: string[] = [];
  let i = 0;
  const n = text.length;

  const isWordEnd = (idx: number): boolean => {
    if (idx >= n) return true;
    return /[ \\t\\n\\r.,!?|।॥;:()\\[\\]{}\\-–—"\'’‘]/.test(text[idx]);
  };

  while (i < n) {
    // 1. Check conjuncts first (क्ष, त्र, ज्ञ, श्र)
    const twoChars = text.slice(i, i + 2);
    if (DEVA_CONJUNCTS_TO_OL[twoChars]) {
      const matched = DEVA_CONJUNCTS_TO_OL[twoChars];
      i += 2;
      if (i < n && DEVA_MATRAS_TO_OL[text[i]]) {
        const matraChar = text[i];
        const matra = DEVA_MATRAS_TO_OL[matraChar];
        i += 1;
        if (i < n && (text[i] === 'ं' || text[i] === 'ँ')) {
          result.push(matched + (matraChar !== 'ं' && matraChar !== 'ँ' ? matra : 'ᱚ') + 'ᱸ');
          i += 1;
        } else {
          if (matraChar === 'ं' || matraChar === 'ँ') {
            result.push(matched + 'ᱚᱸ');
          } else {
            result.push(matched + matra);
          }
        }
      } else if (i < n && text[i] === '्') {
        result.push(matched);
        i += 1;
      } else {
        if (isWordEnd(i)) {
          result.push(matched);
        } else {
          result.push(matched + 'ᱚ');
        }
      }
      continue;
    }

    // 2. Check 2-character base consonants (क़, ख़, ग़, ज़, फ़, ड़, ढ़) or independent vowels (अं, अः)
    if (DEVA_CONSONANTS_TO_OL[twoChars]) {
      const matched = DEVA_CONSONANTS_TO_OL[twoChars];
      i += 2;
      if (i < n && DEVA_MATRAS_TO_OL[text[i]]) {
        const matraChar = text[i];
        const matra = DEVA_MATRAS_TO_OL[matraChar];
        i += 1;
        if (i < n && (text[i] === 'ं' || text[i] === 'ँ')) {
          result.push(matched + (matraChar !== 'ं' && matraChar !== 'ँ' ? matra : 'ᱚ') + 'ᱸ');
          i += 1;
        } else {
          if (matraChar === 'ं' || matraChar === 'ँ') {
            result.push(matched + 'ᱚᱸ');
          } else {
            result.push(matched + matra);
          }
        }
      } else if (i < n && text[i] === '्') {
        result.push(matched);
        i += 1;
      } else {
        if (isWordEnd(i)) {
          result.push(matched);
        } else {
          result.push(matched + 'ᱚ');
        }
      }
      continue;
    }

    if (DEVA_INDEP_VOWELS_TO_OL[twoChars]) {
      const vOl = DEVA_INDEP_VOWELS_TO_OL[twoChars];
      i += 2;
      if (i < n && (text[i] === 'ं' || text[i] === 'ँ')) {
        result.push(vOl + 'ᱸ');
        i += 1;
      } else {
        result.push(vOl);
      }
      continue;
    }

    // 3. Check single base consonant
    const ch = text[i];
    if (DEVA_CONSONANTS_TO_OL[ch]) {
      const matched = DEVA_CONSONANTS_TO_OL[ch];
      i += 1;
      if (i < n && DEVA_MATRAS_TO_OL[text[i]]) {
        const matraChar = text[i];
        const matra = DEVA_MATRAS_TO_OL[matraChar];
        i += 1;
        if (i < n && (text[i] === 'ं' || text[i] === 'ँ')) {
          result.push(matched + (matraChar !== 'ं' && matraChar !== 'ँ' ? matra : 'ᱚ') + 'ᱸ');
          i += 1;
        } else {
          if (matraChar === 'ं' || matraChar === 'ँ') {
            result.push(matched + 'ᱚᱸ');
          } else {
            result.push(matched + matra);
          }
        }
      } else if (i < n && text[i] === '्') {
        result.push(matched);
        i += 1;
      } else {
        if (isWordEnd(i)) {
          result.push(matched);
        } else {
          result.push(matched + 'ᱚ');
        }
      }
      continue;
    }

    // 4. Check single independent vowel
    if (DEVA_INDEP_VOWELS_TO_OL[ch]) {
      const vOl = DEVA_INDEP_VOWELS_TO_OL[ch];
      i += 1;
      if (i < n && (text[i] === 'ं' || text[i] === 'ँ')) {
        result.push(vOl + 'ᱸ');
        i += 1;
      } else {
        result.push(vOl);
      }
      continue;
    }

    // 5. Standalone Chandrabindu or Anusvara
    if (ch === 'ं' || ch === 'ँ') {
      result.push('ᱸ');
      i += 1;
      continue;
    }

    // 6. Digits & Punctuation
    if (ch === '।') result.push('᱾');
    else if (ch === '॥') result.push('᱿');
    else if ('०१२३४५६७८९'.includes(ch)) {
      const idx = '०१२३४५६७८९'.indexOf(ch);
      result.push('᱐᱑᱒᱓᱔᱕᱖᱗᱘᱙'[idx]);
    } else {
      result.push(ch);
    }
    i += 1;
  }
  return result.join('');
}'''

    content = re.sub(r'export function transduceDevaToOlChiki\(text: string\): string \{.*?\n  return result\.join\(\'\'\);\n\}', new_ts_transducer, content, flags=re.DOTALL)

    # 2. Add phrases to CONVERSATIONAL_PHRASES in nlpEngine.ts
    phrases_to_add = '''const CONVERSATIONAL_PHRASES: Record<string, string> = {
  // Complex Sentences 5 & 6
  'आँगन में लगे महुआ के पेड़ के नीचे बच्चे खेल रहे हैं।': 'ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱮᱱᱮᱡ ᱠᱟᱱᱟ ᱠᱚ᱾',
  'आँगन में लगे महुआ के पेड़ के नीचे बच्चे खेल रहे हैं': 'ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱮᱱᱮᱡ ᱠᱟᱱᱟ ᱠᱚ᱾',
  'आंगन में लगे महुआ के पेड़ के नीचे बच्चे खेल रहे हैं।': 'ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱮᱱᱮᱡ ᱠᱟᱱᱟ ᱠᱚ᱾',
  'आंगन में लगे महुआ के पेड़ के नीचे बच्चे खेल रहे हैं': 'ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱮᱱᱮᱡ ᱠᱟᱱᱟ ᱠᱚ᱾',
  'बाज़ार से लौटते समय अचानक तेज़ आंधी और बारिश शुरू हो गई।': 'ᱦᱟᱴ ᱠᱷᱚᱱ ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ ᱚᱪᱠᱟ ᱜᱮ ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ ᱟᱨ ᱫᱟᱜ ᱮᱦᱚᱵ ᱮᱱᱟ᱾',
  'बाज़ार से लौटते समय अचानक तेज़ आंधी और बारिश शुरू हो गई': 'ᱦᱟᱴ ᱠᱷᱚᱱ ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ ᱚᱪᱠᱟ ᱜᱮ ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ ᱟᱨ ᱫᱟᱜ ᱮᱦᱚᱵ ᱮᱱᱟ᱾',
  'बाजार से लौटते समय अचानक तेज आंधी और बारिश शुरू हो गई।': 'ᱦᱟᱴ ᱠᱷᱚᱱ ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ ᱚᱪᱠᱟ ᱜᱮ ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ ᱟᱨ ᱫᱟᱜ ᱮᱦᱚᱵ ᱮᱱᱟ᱾',
  'बाजार से लौटते समय अचानक तेज आंधी और बारिश शुरू हो गई': 'ᱦᱟᱴ ᱠᱷᱚᱱ ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ ᱚᱪᱠᱟ ᱜᱮ ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ ᱟᱨ ᱫᱟᱜ ᱮᱦᱚᱵ ᱮᱱᱟ᱾',
'''
    content = content.replace("const CONVERSATIONAL_PHRASES: Record<string, string> = {", phrases_to_add)

    # 3. Add to COMMON_CONVERSATIONAL_WORDS
    words_to_add = '''const COMMON_CONVERSATIONAL_WORDS: Record<string, string> = {
  'आँगन में लगे महुआ के पेड़ के नीचे': 'ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ',
  'आँगन में लगे महुआ के पेड़': 'ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ',
  'आँगन में लगे': 'ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ',
  'आँगन में': 'ᱨᱟᱪᱟ ᱨᱮ', 'आँगन': 'ᱨᱟᱪᱟ', 'आंगन में': 'ᱨᱟᱪᱟ ᱨᱮ', 'आंगन': 'ᱨᱟᱪᱟ',
  'लगे': 'ᱢᱮᱱᱟᱜ', 'लगा हुआ': 'ᱢᱮᱱᱟᱜ',
  'महुआ के पेड़ के नीचे': 'ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ',
  'महुआ के पेड़': 'ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ', 'महुआ का पेड़': 'ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ', 'महुआ': 'ᱢᱟᱛᱠᱚᱢ',
  'के पेड़ के नीचे': 'ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ', 'पेड़ के नीचे': 'ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ', 'के पेड़': 'ᱫᱟᱨᱮ',
  'बच्चे': 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ', 'बच्चा': 'ᱜᱤᱫᱽᱨᱟᱹ',
  'खेल रहे हैं': 'ᱮᱱᱮᱡ ᱠᱟᱱᱟ ᱠᱚ', 'खेल रहे थे': 'ᱮᱱᱮᱡ ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱠᱚ', 'खेल रहे': 'ᱮᱱᱮᱡ ᱠᱟᱱ',
  'खेलना': 'ᱮᱱᱮᱡ', 'खेल': 'ᱮᱱᱮᱡ',
  'बाज़ार से लौटते समय': 'ᱦᱟᱴ ᱠᱷᱚᱱ ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ', 'बाजार से लौटते समय': 'ᱦᱟᱴ ᱠᱷᱚᱱ ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ',
  'बाज़ार से': 'ᱦᱟᱴ ᱠᱷᱚᱱ', 'बाजार से': 'ᱦᱟᱴ ᱠᱷᱚᱱ', 'बाज़ार': 'ᱦᱟᱴ', 'बाजार': 'ᱦᱟᱴ',
  'लौटते समय': 'ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ', 'लौटते वक्त': 'ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ', 'लौटते': 'ᱨᱩᱣᱟᱹᱲ', 'लौटना': 'ᱨᱩᱣᱟᱹᱲ',
  'समय': 'ᱚᱠᱛᱚ', 'अचानक': 'ᱚᱪᱠᱟ ᱜᱮ', 'अचानक ही': 'ᱚᱪᱠᱟ ᱜᱮ',
  'तेज़ आंधी और बारिश': 'ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ ᱟᱨ ᱫᱟᱜ', 'तेज आंधी और बारिश': 'ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ ᱟᱨ ᱫᱟᱜ',
  'तेज़ आंधी': 'ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ', 'तेज आंधी': 'ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ',
  'तेज़': 'ᱟᱹᱰᱤ ᱡᱩᱨ', 'तेज': 'ᱟᱹᱰᱤ ᱡᱩᱨ', 'आंधी': 'ᱦᱩᱫᱩᱲ', 'तूफ़ान': 'ᱵᱟᱹᱨᱰᱩ', 'तूफान': 'ᱵᱟᱹᱨᱰᱩ',
  'शुरू हो गई': 'ᱮᱦᱚᱵ ᱮᱱᱟ', 'शुरू हो गया': 'ᱮᱦᱚᱵ ᱮᱱᱟ', 'शुरू हुई': 'ᱮᱦᱚᱵ ᱮᱱᱟ', 'शुरू': 'ᱮᱦᱚᱵ',
  'हो गई': 'ᱦᱩᱭ ᱮᱱᱟ', 'हो गया': 'ᱦᱩᱭ ᱮᱱᱟ',
'''
    content = content.replace("const COMMON_CONVERSATIONAL_WORDS: Record<string, string> = {", words_to_add)

    with open("src/engine/nlpEngine.ts", "w", encoding="utf-8") as f:
        f.write(content)

    print("src/engine/nlpEngine.ts updated successfully!")

if __name__ == "__main__":
    update_python()
    update_typescript()

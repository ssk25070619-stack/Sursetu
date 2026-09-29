import { WorksheetData, WorksheetType, TargetScript } from '../types';
import { VERIFIED_VOCABULARY, OL_CHIKI_DIGITS, OL_CHIKI_ALPHABET } from '../data/corpus';

export function generateWorksheet(
  type: WorksheetType,
  grade: string = 'Grade 1',
  category: string = 'school',
  targetScript: TargetScript = 'sat_Olck'
): WorksheetData {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const scriptLabel =
    targetScript === 'sat_Olck' ? 'Santali (Ol Chiki - ᱚᱞ ᱪᱤᱠᱤ)' :
    targetScript === 'sat_Orya' ? 'Santali (Odia Script - ଓଡ଼ିଆ)' :
    targetScript === 'sat_Deva' ? 'Santali (Devanagari - संताली)' : 'Santali (Latin)';

  switch (type) {
    case 'counting':
      return {
        title: `NIPUN Bharat FLN Math: 1-10 Digits & Tactile Counting (${grade})`,
        type: 'counting',
        grade,
        category: 'Mathematics',
        target_lang: targetScript,
        lang_label: scriptLabel,
        generated_at: dateStr,
        items: OL_CHIKI_DIGITS.slice(1, 11).map(d => ({
          num: d.val,
          olchiki: d.olchiki,
          odia: d.odia,
          deva: d.deva,
          name: d.santali_name,
          hindi: d.hindi_name,
          tactile: d.tactile
        }))
      };

    case 'matching':
      const matchingVocab = VERIFIED_VOCABULARY.slice(0, 6);
      return {
        title: `FLN Bilingual Vocabulary & Object Connect Worksheet (${grade})`,
        type: 'matching',
        grade,
        category,
        target_lang: targetScript,
        lang_label: scriptLabel,
        generated_at: dateStr,
        items: matchingVocab.map(v => ({
          id: v.id,
          hindi: v.hindi,
          english: v.english,
          santali: targetScript === 'sat_Olck' ? v.santali_olchiki :
                   targetScript === 'sat_Orya' ? v.santali_odia :
                   targetScript === 'sat_Deva' ? v.santali_deva : v.santali_latin,
          emoji: v.emoji,
          phonetic: v.phonetic
        }))
      };

    case 'flashcards':
      return {
        title: `Pocket Visual Flashcard Deck (2x4 Cut-and-Fold Grid)`,
        type: 'flashcards',
        grade,
        category,
        target_lang: targetScript,
        lang_label: scriptLabel,
        generated_at: dateStr,
        items: VERIFIED_VOCABULARY.slice(0, 8).map(v => ({
          id: v.id,
          emoji: v.emoji,
          olchiki: v.santali_olchiki,
          odia: v.santali_odia,
          hindi: v.hindi,
          english: v.english,
          phonetic: v.phonetic,
          category: v.category
        }))
      };

    case 'tracing':
      return {
        title: `Ol Chiki Script Tracing & Stroke Guide (${grade})`,
        type: 'tracing',
        grade,
        category: 'Foundational Literacy',
        target_lang: targetScript,
        lang_label: scriptLabel,
        generated_at: dateStr,
        items: OL_CHIKI_ALPHABET.slice(0, 10).map(a => ({
          glyph: a.glyph,
          name: a.name,
          meaning: a.shape_meaning,
          translit_deva: a.translit_deva,
          translit_odia: a.translit_odia
        }))
      };

    case 'fill_blanks':
      return {
        title: `Contextual Sentence Fill-in-the-Blanks with Word Bank (${grade})`,
        type: 'fill_blanks',
        grade,
        category,
        target_lang: targetScript,
        lang_label: scriptLabel,
        generated_at: dateStr,
        items: [
          {
            sentence: 'ᱱᱚᱶᱟ ᱫᱚ ᱢᱤᱫᱴᱟᱹᱝ _______ ᱠᱟᱱᱟ᱾ (यह एक _______ है।)',
            missing: 'ᱫᱟᱨᱮ (पेड़ / Tree)',
            options: ['ᱫᱟᱨᱮ', 'ᱯᱩᱛᱷᱤ', 'ᱪᱮᱬᱮ'],
            hint: 'हरा और छायादार'
          },
          {
            sentence: 'ᱤᱧ _______ ᱧᱩ ᱥᱟᱱᱟᱭᱤᱧ ᱠᱟᱱᱟ᱾ (मुझे _______ पीना है।)',
            missing: 'ᱫᱟᱜ (पानी / Water)',
            options: ['ᱫᱟᱜ', 'ᱵᱟᱦᱟ', 'ᱢᱟᱪᱮᱛ'],
            hint: 'प्यास बुझाने वाला'
          },
          {
            sentence: 'ᱟᱢᱟᱜ _______ ᱡᱷᱤᱡᱽ ᱢᱮ᱾ (अपनी _______ खोलो।)',
            missing: 'ᱯᱩᱛᱷᱤ (किताब / Book)',
            options: ['ᱯᱩᱛᱷᱤ', 'ᱥᱮᱛᱟ', 'ᱦᱟᱹᱛᱤ'],
            hint: 'पढ़ने की सामग्री'
          },
          {
            sentence: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ _______ ᱨᱮ ᱠᱚ ᱯᱟᱲᱦᱟᱣᱜ ᱠᱟᱱᱟ᱾ (बच्चे _______ में पढ़ रहे हैं।)',
            missing: 'ᱤᱛᱩᱱ ᱟᱥᱲᱟ (स्कूल / School)',
            options: ['ᱤᱛᱩᱱ ᱟᱥᱲᱟ', 'ᱵᱤᱨ', 'ᱵᱟᱹᱫᱽ'],
            hint: 'ज्ञान का मंदिर'
          }
        ]
      };

    case 'lesson_script':
      return {
        title: `Teacher's 15-Minute MTB-MLE Classroom Script (NEP 2020)`,
        type: 'lesson_script',
        grade,
        category: 'Pedagogy',
        target_lang: targetScript,
        lang_label: scriptLabel,
        generated_at: dateStr,
        items: [
          {
            step: '1. Welcome Circle (0-3 Min)',
            action: 'Greet with "ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ!" (Sagun setag) and have children respond.',
            objective: 'Linguistic comfort and welcoming atmosphere.'
          },
          {
            step: '2. Realia Exploration (3-8 Min)',
            action: 'Hold up local leaf or book, ask "ᱱᱚᱶᱟ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ?". Connect mother tongue word to Hindi.',
            objective: 'Dual language cognitive association.'
          },
          {
            step: '3. Physical Action Rhyme (8-12 Min)',
            action: 'Sing "ᱫᱟᱨᱮ ᱫᱟᱨᱮ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ ᱫᱟᱨᱮ" while miming branches and blowing wind.',
            objective: 'Total Physical Response (TPR) kinesthetic learning.'
          },
          {
            step: '4. Pair Sharing & Close (12-15 Min)',
            action: 'Students repeat the new tribal word with their seating partner.',
            objective: 'Peer validation and retention.'
          }
        ]
      };

    case 'rhyme':
      return {
        title: `Bilingual Tribal Folk Action Rhyme Sheet`,
        type: 'rhyme',
        grade,
        category: 'Rhymes & Music',
        target_lang: targetScript,
        lang_label: scriptLabel,
        generated_at: dateStr,
        content: `### 🌺 ᱵᱟᱦᱟ ᱥᱮᱨᱮᱧ (Flower Spring Song)
**Santali (Ol Chiki):**
*ᱵᱟᱦᱟ ᱯᱷᱩᱴᱟᱹᱣ ᱮᱱᱟ ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ ᱨᱮ,*
*ᱢᱟᱪᱮᱛ ᱦᱮᱡ ᱮᱱᱟ ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱨᱮ!*
*ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱠᱷᱮᱞᱚᱜ ᱱᱟᱯᱟᱭ ᱛᱮ,*
*ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ, ᱯᱩᱱ, ᱢᱚᱬᱮ ᱞᱮᱠᱷᱟ ᱛᱮ!*

**उच्चारण (Devanagari Phonetics):**
*बाहा फुटाव एना सारजोम दारे रे,*
*माचेत हेज एना इतुन आसड़ा रे!*
*गिद्रा को खेलोग नापाय ते,*
*मिद, बार, पे, पून, मोणे लेखा ते!*

**भावार्थ (Hindi Meaning):**
साल के विशाल पेड़ पर नए फूल खिल गए हैं,
हमारे गुरुजी स्कूल में आ गए हैं!
सभी प्यारे बच्चे मिलकर खेल रहे हैं,
एक, दो, तीन, चार, पांच की गिनती सीख रहे हैं!`
      };

    case 'assessment':
      return {
        title: `NIPUN Bharat FLN Diagnostic Assessment Card`,
        type: 'assessment',
        grade,
        category: 'Diagnostic Assessment',
        target_lang: targetScript,
        lang_label: scriptLabel,
        generated_at: dateStr,
        items: [
          {
            criterion: '1. Oral Greeting & Self-Expression',
            prompt: 'Teacher asks: "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ?"',
            rubric: 'Level 1: Silent / Gestures | Level 2: Speaks own name | Level 3: Speaks full sentence (ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ...)'
          },
          {
            criterion: '2. Picture & Realia Naming',
            prompt: 'Show picture of Tree / Book / Water',
            rubric: 'Level 1: Needs hints | Level 2: Identifies in Hindi | Level 3: Identifies immediately in Santali & Hindi'
          },
          {
            criterion: '3. Counting & One-to-One Correspondence',
            prompt: 'Count 5 Sal leaves (ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ, ᱯᱩᱱ, ᱢᱚᱬᱮ)',
            rubric: 'Level 1: Counts up to 2 | Level 2: Counts up to 5 | Level 3: Counts accurately to 10'
          },
          {
            criterion: '4. Classroom Instruction Follow-through',
            prompt: 'Teacher says: "ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ"',
            rubric: 'Level 1: Watches peers | Level 2: Opens with gesture prompt | Level 3: Understands independently'
          }
        ]
      };

    case 'board_game':
    default:
      return {
        title: `Tribal Forest Safari Educational Board Game (A4 Printable)`,
        type: 'board_game',
        grade,
        category: 'Gamified Learning',
        target_lang: targetScript,
        lang_label: scriptLabel,
        generated_at: dateStr,
        items: [
          { step: 1, title: 'START: ᱟᱹᱛᱩ (Village)', task: 'Roll dice. Say "Johar!" to everyone.', reward: '+1 Sal leaf' },
          { step: 2, title: '🌳 ᱫᱟᱨᱮ (Tree)', task: 'Name 2 trees in the village forest.', reward: 'Move 1 step ahead' },
          { step: 3, title: '💧 ᱫᱟᱜ (Water Stream)', task: 'Sing water song. Take a drink!', reward: '+2 Sal leaves' },
          { step: 4, title: '🐘 ᱦᱟᱹᱛᱤ (Elephant Trail)', task: 'Mime an elephant walking calmly.', reward: 'Safe passage' },
          { step: 5, title: '🌸 ᱥᱟᱨᱡᱚᱢ ᱵᱟᱦᱟ (Sal Blossom)', task: 'Count 5 flowers in Ol Chiki (ᱢᱤᱫ to ᱢᱚᱬᱮ).', reward: '+3 Sal leaves' },
          { step: 6, title: '🏫 ᱤᱛᱩᱱ ᱟᱥᱲᱟ (School Goal)', task: 'CONGRATULATIONS! You reached school master guru rank!', reward: '🏆 Birsa Star' }
        ]
      };
  }
}

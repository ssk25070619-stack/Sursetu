/**
 * SurSetu 2.0 - Graded Bilingual Story Reader Corpus
 * ---------------------------------------------------
 * Pre-loaded with culturally resonant tribal folklore & NIPUN Bharat FLN stories
 * aligned across Santali (Ol Chiki & Odia script), Ho, Mundari, Hindi, and English.
 */

export interface StorySentence {
  id: number;
  hindi: string;
  english: string;
  santali_olchiki: string;
  santali_odia: string;
  ho: string;
  mundari: string;
  kurukh?: string;
  phonetic: string;
  vocabulary?: { word: string; translation: string; script: string }[];
}

export interface StoryQuizQuestion {
  question: string;
  question_olchiki: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BilingualStory {
  id: string;
  title: string;
  title_native: string;
  title_odia: string;
  title_hindi: string;
  grade: 'Grade 1' | 'Grade 2' | 'Grade 3';
  theme: string;
  culturalNote: string;
  coverEmoji: string;
  estimatedMinutes: number;
  sentences: StorySentence[];
  quiz: StoryQuizQuestion[];
}

export const BILINGUAL_STORIES: BilingualStory[] = [
  {
    id: 'story_sal_tree',
    title: 'The Great Sal Tree & The Forest Birds',
    title_native: 'ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ ᱟᱨ ᱪᱮᱬᱮ ᱠᱚ',
    title_odia: 'ସାର୍ଜମ ଦାରେ ଆର ଚେᱬେ କ',
    title_hindi: 'विशाल साल वृक्ष और वन के पक्षी',
    grade: 'Grade 1',
    theme: 'Nature & Harmony',
    culturalNote: 'The Sal tree (Sarjom) is sacred across Santhal, Ho, and Munda traditions as a symbol of life and protection during the Baha / Sarhul festival.',
    coverEmoji: '🌳',
    estimatedMinutes: 3,
    sentences: [
      {
        id: 1,
        hindi: 'हमारे गाँव के पास एक बहुत बड़ा साल का पेड़ था।',
        english: 'Near our village, there was a very big Sal tree.',
        santali_olchiki: 'ᱟᱞᱮᱭᱟᱜ ᱟᱛᱳ ᱥᱩᱨ ᱨᱮ ᱢᱤᱫᱴᱟᱹᱝ ᱟᱹᱰᱤ ᱢᱟᱨᱟᱝ ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ᱾',
        santali_odia: 'ଆଲେୟାଗ ଆତୋ ସୁର ରେ ମିଦଟାଙ ଆଦି ମାରାଙ ସାର୍ଜମ ଦାରେ ତାହେ କାନା।',
        ho: 'आलेयाः आतु जपाः रे मियद मारां सरजोम दारु ताइकेना।',
        mundari: 'अलेयाः हातु सोबोर रे मियद मारां सरजोम दारु ताइकेना।',
        phonetic: 'Aleyag ato sur re midtang adi marang sarjom dare tae kana.',
        vocabulary: [
          { word: 'ᱥᱟᱨᱡᱚᱢ', translation: 'Sal Tree', script: 'Ol Chiki' },
          { word: 'ᱟᱛᱳ', translation: 'Village', script: 'Ol Chiki' },
          { word: 'ᱢᱟᱨᱟᱝ', translation: 'Big / Great', script: 'Ol Chiki' },
        ],
      },
      {
        id: 2,
        hindi: 'पेड़ की हरी डालियों पर कई सुंदर पक्षी रहते थे।',
        english: 'Many beautiful birds lived on the green branches of the tree.',
        santali_olchiki: 'ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱰᱟᱹᱨ ᱨᱮ ᱟᱭᱢᱟ ᱪᱚᱨᱚᱠ ᱪᱮᱬᱮ ᱠᱚ ᱛᱟᱦᱮᱸᱱ ᱠᱟᱱ ᱛᱟᱦᱮᱸᱫ᱾',
        santali_odia: 'ଦାରେ ରେନାଗ ହାରିୟାଡ ଦାର ରେ ଆୟମା ଚରକ ଚେଣେ କ ତାହେନ କାନ ତାହେଦ।',
        ho: 'दारु राः हारियाड़ डाल रे पुरोः सुकूर चेड़े को ताइकेना।',
        mundari: 'दारु राः हारियाड़ काटो रे पुरोः बुगी चेड़े को ताइकेना।',
        phonetic: 'Dare renag hariyad dar re ayma chorok chene ko tahen kan tahed.',
        vocabulary: [
          { word: 'ᱪᱮᱬᱮ', translation: 'Bird', script: 'Ol Chiki' },
          { word: 'ᱦᱟᱹᱨᱭᱟᱹᱲ', translation: 'Green', script: 'Ol Chiki' },
        ],
      },
      {
        id: 3,
        hindi: 'हर सुबह पक्षी मीठे स्वर में गाते थे।',
        english: 'Every morning the birds sang in sweet melodies.',
        santali_olchiki: 'ᱡᱚᱛᱚ ᱥᱮᱛᱟᱜ ᱜᱮ ᱪᱮᱬᱮ ᱠᱚ ᱥᱤᱵᱤᱞ ᱟᱲᱟᱝ ᱛᱮᱠᱚ ᱥᱮᱨᱮᱧᱮᱫ ᱛᱟᱦᱮᱸᱫ᱾',
        santali_odia: 'ଜତ ସେତାଗ ଗେ ଚେଣେ କ ସିବିଲ ଆଡାଙ ତେକ ସେରେଞେଦ ତାହେଦ।',
        ho: 'सबेन सेताः चेड़े को सिबिल साड़ि ते दुरं ताइकेना।',
        mundari: 'सबेन सेताः चेड़े को सिबिल काजी ते दुरं ताइकेना।',
        phonetic: 'Joto setag ge chene ko sibil adang teko serenged tahed.',
        vocabulary: [
          { word: 'ᱥᱮᱛᱟᱜ', translation: 'Morning', script: 'Ol Chiki' },
          { word: 'ᱥᱮᱨᱮᱧ', translation: 'Song / Singing', script: 'Ol Chiki' },
        ],
      },
      {
        id: 4,
        hindi: 'गाँव के बच्चे पेड़ की ठंडी छाँव में खेलते और पढ़ते थे।',
        english: 'Village children played and studied under the cool shade of the tree.',
        santali_olchiki: 'ᱟᱛᱳ ᱨᱤᱱ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱨᱮᱭᱟᱲ ᱩᱢᱩᱞ ᱨᱮᱠᱚ ᱮᱱᱮᱡ ᱟᱨ ᱯᱟᱲᱦᱟᱣᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸᱫ᱾',
        santali_odia: 'ଆତୋ ରିନ ଗିଦ୍ରା କ ଦାରେ ରେନାଗ ରେୟାଡ ଉମୁଲ ରେକ ଏନେଜ ଆର ପାଢ଼ହାଓଗ କାନ ତାହେଦ।',
        ho: 'आतु रेन होन को दारु राः रेयाड़ उमुल रे इनुं आर पाड़ाव ताइकेना।',
        mundari: 'हातु रेन होन को दारु राः रेयाड़ उमुल रे इनुं आर पाड़ाव ताइकेना।',
        phonetic: 'Ato rin gidra ko dare renag reyad umul reko enej ar padhawg kan tahed.',
        vocabulary: [
          { word: 'ᱜᱤᱫᱽᱨᱟᱹ', translation: 'Children', script: 'Ol Chiki' },
          { word: 'ᱩᱢᱩᱞ', translation: 'Shade / Shadow', script: 'Ol Chiki' },
        ],
      },
    ],
    quiz: [
      {
        question: 'गाँव के पास कौन सा पेड़ था?',
        question_olchiki: 'ᱟᱛᱳ ᱥᱩᱨ ᱨᱮ ᱪᱮᱫ ᱫᱟᱨᱮ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ?',
        options: ['ᱥᱟᱨᱡᱚᱢ (साल का पेड़)', 'ᱩᱞ (आम का पेड़)', 'ᱢᱟᱛᱠᱚᱢ (महुआ का पेड़)', 'ᱠᱟᱱᱴᱷᱟᱲ (कटहल का पेड़)'],
        correctIndex: 0,
        explanation: 'कहानी के अनुसार गाँव के पास एक बहुत बड़ा साल का पेड़ (ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ) था।',
      },
      {
        question: 'बच्चे पेड़ की छाँव में क्या करते थे?',
        question_olchiki: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱫᱟᱨᱮ ᱩᱢᱩᱞ ᱨᱮ ᱪᱮᱫ ᱠᱚ ᱪᱤᱠᱟᱹᱭᱮᱫ ᱛᱟᱦᱮᱸᱫ?',
        options: ['ᱮᱱᱮᱡ ᱟᱨ ᱯᱟᱲᱦᱟᱣ (खेलते और पढ़ते)', 'ᱡᱟᱹᱯᱤᱫ (सोते)', 'ᱠᱟᱹᱢᱤ (काम करते)', 'ᱫᱟᱬᱟ (घूमते)'],
        correctIndex: 0,
        explanation: 'बच्चे पेड़ की ठंडी छाँव में खेलते और पढ़ते थे (ᱮᱱᱮᱡ ᱟᱨ ᱯᱟᱲᱦᱟᱣ) ।',
      },
    ],
  },
  {
    id: 'story_counting_mangoes',
    title: 'Counting Sweet Mangoes in the Orchard',
    title_native: 'ᱵᱟᱜᱟᱱ ᱨᱮ ᱩᱞ ᱞᱮᱠᱷᱟ',
    title_odia: 'ବାଗାନ ରେ ଉଲ ଲେଖା',
    title_hindi: 'बगीचे में मीठे आमों की गिनती',
    grade: 'Grade 1',
    theme: 'Math & Foundational Numeracy',
    culturalNote: 'Helps students master Santali Ol Chiki numerals (᱐, ᱑, ᱒, ᱓, ᱔, ᱕) and Hindi numbers simultaneously.',
    coverEmoji: '🥭',
    estimatedMinutes: 2,
    sentences: [
      {
        id: 1,
        hindi: 'सोमवार को रामू आम के बगीचे में गया।',
        english: 'On Monday, Ramu went to the mango orchard.',
        santali_olchiki: 'ᱥᱚᱢᱵᱟᱨ ᱦᱤᱞᱚᱜ ᱨᱟᱢᱩ ᱩᱞ ᱵᱟᱜᱟᱱ ᱛᱮ ᱪᱟᱞᱟᱣ ᱮᱱᱟᱭ᱾',
        santali_odia: 'ସମବାର ହିଲଗ ରାମୁ ଉଲ ବାଗାନ ତେ ଚାଲାଓ ଏନାୟ।',
        ho: 'सोमवार दिन रामू उली बागान ते सेनकेना।',
        mundari: 'सोमवार दिन रामू उली बागान ते सेनकेना।',
        phonetic: 'Sombar hilog Ramu ul bagan te calaw enay.',
        vocabulary: [
          { word: 'ᱩᱞ', translation: 'Mango', script: 'Ol Chiki' },
          { word: 'ᱵᱟᱜᱟᱱ', translation: 'Garden / Orchard', script: 'Ol Chiki' },
        ],
      },
      {
        id: 2,
        hindi: 'उसने जमीन पर गिरे हुए पाँच (५ / ᱕) पके आम देखे।',
        english: 'He saw five (5) ripe mangoes fallen on the ground.',
        santali_olchiki: 'ᱩᱱᱤ ᱫᱚ ᱚᱛ ᱨᱮ ᱧᱩᱨ ᱟᱠᱟᱱ ᱢᱚᱬᱮ (᱕) ᱜᱚᱴᱟᱝ ᱵᱤᱞᱤ ᱩᱞ ᱧᱮᱞ ᱠᱮᱫᱟᱭ᱾',
        santali_odia: 'ଉନି ଦ ଅତ ରେ ଞୁର ଆକାନ ମଣେ (୫) ଗଟାଙ ବିଲି ଉଲ ଞେଲ କେଦାୟ।',
        ho: 'अइञ ओते रे गीयू मोड़े (५) गोटां बिल्ली उली नेलकेदा।',
        mundari: 'अइञ ओते रे तायु मोड़े (५) गोटां बिल्ली उली नेलकेदा।',
        phonetic: 'Uni do ot re nyur akan mone (5) gotang bili ul nyel keday.',
        vocabulary: [
          { word: 'ᱢᱚᱬᱮ (᱕)', translation: 'Five (5)', script: 'Ol Chiki' },
          { word: 'ᱵᱤᱞᱤ', translation: 'Ripe', script: 'Ol Chiki' },
        ],
      },
      {
        id: 3,
        hindi: 'उसने दो (२ / ᱒) आम अपनी छोटी बहन को दिए।',
        english: 'He gave two (2) mangoes to his younger sister.',
        santali_olchiki: 'ᱩᱱᱤ ᱫᱚ ᱵᱟᱨᱭᱟ (᱒) ᱩᱞ ᱟᱡ ᱨᱤᱱ ᱠᱟᱹᱴᱤᱡ ᱢᱤᱥᱨᱟ ᱮᱢᱟᱫᱮᱭᱟᱭ᱾',
        santali_odia: 'ଉନି ଦ ବାରୟା (୨) ଉଲ ଆଜ ରିନ କାଟିଜ ମିସରା ଏମାଦେୟାୟ।',
        ho: 'अइञ बारिया (२) उली अचः हुड़िं मिसि के ओमकेदा।',
        mundari: 'अइञ बारिया (२) उली अचः हुड़िं मिसि के ओमकेदा।',
        phonetic: 'Uni do barya (2) ul aj rin katij misra emadeyay.',
        vocabulary: [
          { word: 'ᱵᱟᱨᱭᱟ (᱒)', translation: 'Two (2)', script: 'Ol Chiki' },
          { word: 'ᱢᱤᱥᱨᱟ', translation: 'Sister', script: 'Ol Chiki' },
        ],
      },
      {
        id: 4,
        hindi: 'अब रामू के पास तीन (३ / ᱓) मीठे आम बचे हैं।',
        english: 'Now Ramu has three (3) sweet mangoes left.',
        santali_olchiki: 'ᱱᱤᱛᱚᱜ ᱫᱚ ᱨᱟᱢᱩ ᱴᱷᱮᱱ ᱯᱮᱭᱟ (᱓) ᱥᱤᱵᱤᱞ ᱩᱞ ᱥᱟᱨᱮᱡ ᱮᱱᱟ᱾',
        santali_odia: 'ନିତଗ ଦ ରାମୁ ଠେନ ପେୟା (୩) ସିବିଲ ଉଲ ସାରେଜ ଏନା।',
        ho: 'नाः रामू ताः रे आपिया (३) सिबिल उली सारेज अकाना।',
        mundari: 'नाः रामू ताः रे आपिया (३) सिबिल उली सारेज अकाना।',
        phonetic: 'Nitog do Ramu then peya (3) sibil ul sarej ena.',
        vocabulary: [
          { word: 'ᱯᱮᱭᱟ (᱓)', translation: 'Three (3)', script: 'Ol Chiki' },
          { word: 'ᱥᱤᱵᱤᱞ', translation: 'Sweet / Tasty', script: 'Ol Chiki' },
        ],
      },
    ],
    quiz: [
      {
        question: 'रामू को कुल कितने पके आम मिले थे?',
        question_olchiki: 'ᱨᱟᱢᱩ ᱫᱚ ᱡᱚᱛᱚ ᱛᱮ ᱛᱤᱱᱟᱹᱜ ᱜᱚᱴᱟᱝ ᱵᱤᱞᱤ ᱩᱞ ᱧᱟᱢ ᱞᱮᱫᱟᱭ?',
        options: ['ᱢᱚᱬᱮ / ᱕ (पाँच)', 'ᱯᱮᱭᱟ / ᱓ (तीन)', 'ᱵᱟᱨᱭᱟ / ᱒ (दो)', 'ᱮᱭᱟᱭ / ᱗ (सात)'],
        correctIndex: 0,
        explanation: 'रामू को शुरुआत में ५ (ᱢᱚᱬᱮ) आम मिले थे। ५ - २ = ३ आम बचे।',
      },
    ],
  },
  {
    id: 'story_morning_school',
    title: 'Morning Routine and Going to School',
    title_native: 'ᱥᱮᱛᱟᱜ ᱟᱥᱲᱟ ᱪᱟᱞᱟᱣ',
    title_odia: 'ସେତାଗ ଆସଡ଼ା ଚାଲାଓ',
    title_hindi: 'सुबह की दिनचर्या और स्कूल जाना',
    grade: 'Grade 2',
    theme: 'Daily Routine & Hygiene',
    culturalNote: 'Promotes morning hygiene, greeting teachers with "Johar", and joyful classroom participation.',
    coverEmoji: '🎒',
    estimatedMinutes: 3,
    sentences: [
      {
        id: 1,
        hindi: 'सूरज उगते ही संजू बिस्तर से उठ जाती है।',
        english: 'As soon as the sun rises, Sanju wakes up from bed.',
        santali_olchiki: 'ᱵᱮᱲᱟ ᱨᱟᱠᱟᱵ ᱥᱟᱶᱛᱮ ᱥᱟᱱᱡᱩ ᱫᱚ ᱯᱟᱹᱨᱠᱟᱹᱢ ᱠᱷᱚᱱ ᱮ ᱵᱮᱨᱮᱫ ᱮᱱᱟ᱾',
        santali_odia: 'ବେଡ଼ା ରାକାବ ସାଓତେ ସାନ୍ଜୁ ଦ ପାରକାମ ଖନ ଏ ବେରେଦ ଏନା।',
        ho: 'सिंगी तुकूइ तें संजू पाड़कोम एते बियरकना।',
        mundari: 'सिंगी तुकूइ तें संजू पाड़कोम एते बियरकना।',
        phonetic: 'Beda rakab saote Sanju do parkom khon e bered ena.',
        vocabulary: [
          { word: 'ᱵᱮᱲᱟ', translation: 'Sun / Time', script: 'Ol Chiki' },
          { word: 'ᱵᱮᱨᱮᱫ', translation: 'Wake up', script: 'Ol Chiki' },
        ],
      },
      {
        id: 2,
        hindi: 'वह ठंडे पानी से अपना मुँह और हाथ-पैर धोती है।',
        english: 'She washes her face, hands, and feet with cool water.',
        santali_olchiki: 'ᱩᱱᱤ ᱫᱚ ᱨᱮᱭᱟᱲ ᱫᱟᱜ ᱛᱮ ᱢᱮᱫ-ᱢᱩᱦᱟᱹ ᱟᱨ ᱛᱤ-ᱡᱟᱝᱜᱟ ᱟᱹᱨᱩᱵ ᱮᱱᱟᱭ᱾',
        santali_odia: 'ଉନି ଦ ରେୟାଡ ଦାଗ ତେ ମେଦ-ମୁହା ଆର ତି-ଜାଙ୍ଗା ଆରୁବ ଏନାୟ।',
        ho: 'अइञ रेयाड़ दाः ते मेद-मुं आर ती-काटा अबुंकना।',
        mundari: 'अइञ रेयाड़ दाः ते मेद-मुं आर ती-काटा अबुंकना।',
        phonetic: 'Uni do reyad dag te med-muha ar ti-janga arub enay.',
        vocabulary: [
          { word: 'ᱫᱟᱜ', translation: 'Water', script: 'Ol Chiki' },
          { word: 'ᱛᱤ-ᱡᱟᱝᱜᱟ', translation: 'Hands & Feet', script: 'Ol Chiki' },
        ],
      },
      {
        id: 3,
        hindi: 'संजू अपनी किताबें बस्ते में रखकर खुशी से स्कूल जाती है।',
        english: 'Putting her books in the bag, Sanju joyfully walks to school.',
        santali_olchiki: 'ᱥᱟᱱᱡᱩ ᱫᱚ ᱟᱡᱟᱜ ᱯᱩᱛᱷᱤ ᱠᱚ ᱡᱷᱳᱞᱟ ᱨᱮ ᱫᱚᱦᱚ ᱠᱟᱛᱮ ᱨᱟᱹᱥᱠᱟᱹ ᱛᱮ ᱟᱥᱲᱟ ᱛᱮ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟᱭ᱾',
        santali_odia: 'ସାନ୍ଜୁ ଦ ଆଜାଗ ପୁଥି କ ଝୋଲା ରେ ଦହ କାତେ ରାସକା ତେ ଆସଡ଼ା ତେ ଚାଲାଗ କାନାୟ।',
        ho: 'संजू अचः पुथि को झोला रे दोहो केते रासा ते इतून आड़ाः ते सेनकना।',
        mundari: 'संजू अचः पुथि को झोला रे दोहो केते रासा ते इतून आड़ाः ते सेनकना।',
        phonetic: 'Sanju do ajag puthi ko jhola re doho kate raska te asda te calag kanay.',
        vocabulary: [
          { word: 'ᱯᱩᱛᱷᱤ', translation: 'Book', script: 'Ol Chiki' },
          { word: 'ᱟᱥᱲᱟ', translation: 'School', script: 'Ol Chiki' },
          { word: 'ᱨᱟᱹᱥᱠᱟᱹ', translation: 'Happy / Joy', script: 'Ol Chiki' },
        ],
      },
      {
        id: 4,
        hindi: 'कक्षा में पहुँचकर वह शिक्षक को हाथ जोड़कर "जोहार" कहती है।',
        english: 'Reaching the classroom, she folds her hands and greets the teacher with "Johar".',
        santali_olchiki: 'ᱠᱞᱟᱥ ᱨᱮ ᱥᱮᱴᱮᱨ ᱠᱟᱛᱮ ᱩᱱᱤ ᱫᱚ ᱢᱟᱪᱮᱛ ᱛᱤ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱮ "ᱡᱚᱦᱟᱨ" ᱮ ᱢᱮᱛᱟᱭ ᱠᱟᱱᱟ᱾',
        santali_odia: 'କ୍ଲାସ ରେ ସେଟେର କାତେ ଉନି ଦ ମାଚେତ ତି ଜଡ଼ାଓ କାତେ "ଜହାର" ଏ ମେତାୟ କାନା।',
        ho: 'क्लास रे सेटेर केते अइञ माचेत के ती जोड़ो केते "जोहार" काजीकना।',
        mundari: 'क्लास रे सेटेर केते अइञ माचेत के ती जोड़ो केते "जोहार" काजीकना।',
        phonetic: 'Class re seter kate uni do macet ti jodaw kate "Johar" e metay kana.',
        vocabulary: [
          { word: 'ᱢᱟᱪᱮᱛ', translation: 'Teacher', script: 'Ol Chiki' },
          { word: 'ᱡᱚᱦᱟᱨ', translation: 'Johar (Greeting)', script: 'Ol Chiki' },
        ],
      },
    ],
    quiz: [
      {
        question: 'स्कूल में शिक्षक को संजू ने क्या कहकर अभिवादन किया?',
        question_olchiki: 'ᱟᱥᱲᱟ ᱨᱮ ᱢᱟᱪᱮᱛ ᱫᱚ ᱥᱟᱱᱡᱩ ᱪᱮᱫ ᱢᱮᱱ ᱠᱟᱛᱮ ᱡᱚᱦᱟᱨ ᱮ ᱮᱢᱟᱫᱮᱭᱟ?',
        options: ['ᱡᱚᱦᱟᱨ (जोहार)', 'ᱱᱟᱢᱟᱥᱛᱮ (नमस्ते)', 'ᱜᱩᱰ ᱢᱚᱨᱱᱤᱝ (गुड मॉर्निंग)', 'ᱦᱮᱞᱳ (हेलो)'],
        correctIndex: 0,
        explanation: 'संजू ने शिक्षक को पारंपरिक आदर भाव के साथ "ᱡᱚᱦᱟᱨ" (जोहार) कहा।',
      },
    ],
  },
];

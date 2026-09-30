/**
 * SurSetu 3.0 - Bilingual FLN & Primary Curriculum Concepts Database
 * -------------------------------------------------------------------
 * Bridges Mother-Tongue (Santali / Ho / Mundari / Odia / Hindi) with
 * Foundational Literacy and Numeracy (FLN) concepts under NIPUN Bharat.
 * Includes key pedagogical ideas, teacher notes, common misconceptions,
 * easy child-friendly explanations, and formative check questions.
 */

export interface CurriculumConcept {
  id: string;
  slug: string;
  subject: 'Mathematics' | 'Science & EVS' | 'Language Arts' | 'Social & Cultural';
  gradeLevel: number;
  name: string;
  nameHindi: string;
  nameSantaliOlChiki: string;
  keyIdea: string;
  keyIdeaHindi: string;
  teacherNote: string;
  commonMistake: string;
  easyExplanation: string;
  reteachMethod: string;
  sampleQuestions: {
    questionText: string;
    questionHindi: string;
    questionSantali: string;
    correctAnswer: string;
    options?: string[];
  }[];
}

export const CURRICULUM_CONCEPTS: CurriculumConcept[] = [
  {
    id: 'c_math_01',
    slug: 'math-fractions',
    subject: 'Mathematics',
    gradeLevel: 3,
    name: 'Fractions (Numerator & Denominator)',
    nameHindi: 'भिन्न (अंश एवं हर)',
    nameSantaliOlChiki: 'ᱦᱟᱹᱴᱤᱧ (ᱯᱟᱦᱴᱟ ᱟᱨ ᱥᱟᱱᱟᱢ)',
    keyIdea: 'A fraction represents equal parts of a whole (part/whole).',
    keyIdeaHindi: 'भिन्न किसी पूरी वस्तु के बराबर हिस्सों को दर्शाती है (अंश/हर)।',
    teacherNote: 'Use familiar tactile items such as roti, fruit slices, clay blocks, or paper folding strips.',
    commonMistake: 'Thinking that a larger denominator makes a larger fraction (e.g. 1/4 > 1/2).',
    easyExplanation: 'When you share 1 roti among 2 children, each gets a bigger piece (1/2) than sharing among 4 children (1/4). Smaller denominator = bigger pieces!',
    reteachMethod: 'Fold two equal paper rotis: one into 2 parts, one into 4 parts. Place the halves side-by-side to visibly compare.',
    sampleQuestions: [
      {
        questionText: 'Which is greater: 1/2 or 1/4?',
        questionHindi: 'कौन सा बड़ा है: 1/2 या 1/4?',
        questionSantali: 'ᱚᱠᱟᱴᱟᱜ ᱥᱮᱬᱟ ᱜᱮᱭᱟ: ᱑/᱒ ᱥᱮ ᱑/᱔?',
        correctAnswer: '1/2',
        options: ['1/2', '1/4', 'Both are equal'],
      },
      {
        questionText: 'If a watermelon is cut into 4 equal parts and you eat 1, what fraction did you eat?',
        questionHindi: 'यदि तरबूज को 4 बराबर भागों में काटा जाए और आप 1 भाग खा लें, तो आपने कितना भिन्न खाया?',
        questionSantali: 'ᱡᱩᱫᱤ ᱢᱤᱫ ᱛᱚᱨᱵᱩᱡ ᱔ ᱴᱷᱟᱶ ᱦᱟᱹᱴᱤᱧ ᱠᱟᱛᱮ ᱑ ᱴᱷᱟᱶ ᱮᱢ ᱡᱚᱢᱟ, ᱛᱚᱵᱮ ᱛᱤᱱᱟᱹᱜ ᱦᱟᱹᱴᱤᱧ ᱮᱢ ᱡᱚᱢ ᱠᱮᱫᱟ?',
        correctAnswer: '1/4',
        options: ['1/4', '3/4', '4/1'],
      },
    ],
  },
  {
    id: 'c_math_02',
    slug: 'math-percentage',
    subject: 'Mathematics',
    gradeLevel: 4,
    name: 'Percentage (Parts per 100)',
    nameHindi: 'प्रतिशत (सैकड़ा / प्रति सौ)',
    nameSantaliOlChiki: 'ᱥᱟᱭᱠᱚᱲᱟ (᱑᱐᱐ ᱨᱮ ᱛᱤᱱᱟᱹᱜ)',
    keyIdea: 'Percentage represents a fraction with denominator 100 (part / total * 100).',
    keyIdeaHindi: 'प्रतिशत का अर्थ है 100 में से कितना भाग।',
    teacherNote: 'Use a 10x10 grid chart of 100 small squares for visual counting.',
    commonMistake: 'Reversing obtained marks and total marks when computing ratio.',
    easyExplanation: '50% means exactly half (50 out of 100). 100% means the entire whole.',
    reteachMethod: 'Provide a 100-bead abacus or 100-square grid worksheet and shade exactly 25 or 50 squares.',
    sampleQuestions: [
      {
        questionText: 'What is 50% written as a fraction in simplest form?',
        questionHindi: '50% को भिन्न के रूप में क्या लिखा जाएगा?',
        questionSantali: '᱕᱐% ᱫᱚ ᱦᱟᱹᱴᱤᱧ ᱞᱮᱠᱟᱛᱮ ᱪᱮᱫ ᱚᱞᱚᱜ-ᱟ?',
        correctAnswer: '1/2',
        options: ['1/2', '1/4', '50/1'],
      },
    ],
  },
  {
    id: 'c_sci_01',
    slug: 'science-photosynthesis',
    subject: 'Science & EVS',
    gradeLevel: 4,
    name: 'Plant Photosynthesis & Food Making',
    nameHindi: 'प्रकाश संश्लेषण (पौधों का भोजन बनाना)',
    nameSantaliOlChiki: 'ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱡᱚᱢᱟᱜ ᱵᱮᱱᱟᱣ (Photosynthesis)',
    keyIdea: 'Green leaves synthesize glucose from carbon dioxide and water using sunlight and chlorophyll.',
    keyIdeaHindi: 'हरे पत्ते सूर्य के प्रकाश और क्लोरोफिल की सहायता से हवा और पानी से भोजन बनाते हैं।',
    teacherNote: 'Frame the green leaf as a village "kitchen/food factory" receiving sunlight as the cooking flame.',
    commonMistake: 'Confusing plant respiration (oxygen intake at night) with photosynthesis food creation.',
    easyExplanation: 'Leaves take sunlight from sky, water from roots, and air to cook food for the whole tree and give us fresh oxygen!',
    reteachMethod: 'Take students into the school garden to observe green leaves in bright sunlight and trace sunlight path.',
    sampleQuestions: [
      {
        questionText: 'What gas do green leaves release into the air during photosynthesis?',
        questionHindi: 'प्रकाश संश्लेषण के दौरान पत्ते हवा में कौन सी गैस छोड़ते हैं?',
        questionSantali: 'ᱡᱚᱢᱟᱜ ᱵᱮᱱᱟᱣ ᱡᱚᱠᱷᱮᱡ ᱥᱟᱠᱟᱢ ᱠᱷᱚᱱ ᱚᱠᱟ ᱦᱚᱭ (Gas) ᱚᱰᱚᱠᱚᱜ-ᱟ?',
        correctAnswer: 'Oxygen (ऑक्सीजन)',
        options: ['Oxygen (ऑक्सीजन)', 'Carbon Dioxide (कार्बन डाइऑक्साइड)', 'Nitrogen (नाइट्रोजन)'],
      },
    ],
  },
  {
    id: 'c_sci_02',
    slug: 'science-physical-chemical-change',
    subject: 'Science & EVS',
    gradeLevel: 5,
    name: 'Physical vs Chemical Changes',
    nameHindi: 'भौतिक एवं रासायनिक परिवर्तन',
    nameSantaliOlChiki: 'ᱨᱩᱯ ᱵᱚᱫᱚᱞ ᱟᱨ ᱱᱟᱶᱟ ᱡᱤᱱᱤᱥ ᱵᱮᱱᱟᱣ',
    keyIdea: 'Physical changes are reversible without new substances; chemical changes create completely new substances.',
    keyIdeaHindi: 'भौतिक परिवर्तन में कोई नया पदार्थ नहीं बनता; रासायनिक परिवर्तन में नया पदार्थ बनता है।',
    teacherNote: 'Contrast ice melting (reversible physical) with wood turning into ash (irreversible chemical).',
    commonMistake: 'Assuming all temperature changes are chemical changes.',
    easyExplanation: 'If you can get the original thing back (like melted ice back into water), it is physical. If it turns into smoke and ash permanently, it is chemical!',
    reteachMethod: 'Demonstrate tearing paper (physical) vs burning a tiny piece of wood/matchstick (chemical).',
    sampleQuestions: [
      {
        questionText: 'Is melting ice a physical or chemical change?',
        questionHindi: 'बर्फ का पिघलना कौन सा परिवर्तन है?',
        questionSantali: 'ᱵᱚᱨᱚᱯᱷ ᱫᱟᱜ ᱨᱮ ᱵᱮᱱᱟᱣ ᱫᱚ ᱚᱠᱟ ᱞᱮᱠᱟᱱ ᱵᱚᱫᱚᱞ ᱠᱟᱱᱟ?',
        correctAnswer: 'Physical (भौतिक परिवर्तन)',
        options: ['Physical (भौतिक परिवर्तन)', 'Chemical (रासायनिक परिवर्तन)'],
      },
    ],
  },
  {
    id: 'c_lang_01',
    slug: 'lang-sov-syntax',
    subject: 'Language Arts',
    gradeLevel: 2,
    name: 'SOV Sentence Syntax & Postposition Markers',
    nameHindi: 'कर्ता-कर्म-क्रिया पदक्रम एवं कारक प्रत्यय',
    nameSantaliOlChiki: 'ᱜᱟᱵᱟᱱ ᱟᱹᱭᱟᱹᱛ ᱟᱨ ᱛᱚᱯᱟᱨ (-re, -khon, -ak)',
    keyIdea: 'Munda languages (Santali, Ho, Mundari) strictly follow Subject-Object-Verb (SOV) order with agglutinative postpositions.',
    keyIdeaHindi: 'संताली एवं मुंडा भाषाओं में क्रिया हमेशा वाक्य के अंत में आती है (कर्ता + कर्म + क्रिया)।',
    teacherNote: 'Contrast Hindi postpositions (अलग शब्द जैसे "में", "से") with Santali attached suffixes (-re, -khon).',
    commonMistake: 'Placing the verb in the middle (SVO) under English influence.',
    easyExplanation: 'In Santali, the action word (verb) always stands at the end of the sentence like a respectful anchor.',
    reteachMethod: 'Use color-coded word cards: Green (Subject), Yellow (Object), Red (Verb at the end) and have students physically arrange them.',
    sampleQuestions: [
      {
        questionText: 'Where does the verb go in a standard Santali sentence?',
        questionHindi: 'संताली वाक्य में क्रिया कहाँ आती है?',
        questionSantali: 'ᱥᱟᱱᱛᱟᱲᱤ ᱟᱹᱭᱟᱹᱛ ᱨᱮ ᱠᱟᱹᱢᱤ ᱟᱹᱲᱟᱹ (Verb) ᱫᱚ ᱚᱠᱟᱨᱮ ᱛᱟᱦᱮᱸᱱᱟ?',
        correctAnswer: 'At the end (वाक्य के अंत में)',
        options: ['At the end (वाक्य के अंत में)', 'At the beginning (शुरुआत में)', 'In the middle (बीच में)'],
      },
    ],
  },
];

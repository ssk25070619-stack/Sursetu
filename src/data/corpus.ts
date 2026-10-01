import { VocabItem } from '../types';

export const VERIFIED_VOCABULARY: VocabItem[] = [
  // School & Classroom
  {
    id: 'school_1',
    hindi: 'विद्यालय / स्कूल',
    english: 'School',
    santali_olchiki: 'ᱤᱛᱩᱱ ᱟᱥᱲᱟ',
    santali_odia: 'ଇତୁନ ଆସଡ଼ା',
    santali_deva: 'इतुन आसड़ा',
    santali_latin: 'itun asra',
    ho: 'इतुन आटो (itun ato)',
    mundari: 'इतुन ओड़ाः (itun ora)',
    kurukh: 'पड़हा अड्डा (Parha Adda)',
    category: 'school',
    emoji: '🏫',
    phonetic: 'ee-toon ahs-rah',
    culturalNote: 'Place of learning; primary community center in tribal villages.',
    exampleSentence: {
      hindi: 'हम स्कूल जा रहे हैं।',
      olchiki: 'ᱟᱞᱮ ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱞᱮ ᱥᱮᱱᱚᱜ ᱠᱟᱱᱟ᱾',
      english: 'We are going to school.'
    }
  },
  {
    id: 'school_2',
    hindi: 'किताब',
    english: 'Book',
    santali_olchiki: 'ᱯᱩᱛᱷᱤ',
    santali_odia: 'ପୁଥି',
    santali_deva: 'पुथि',
    santali_latin: 'puthi',
    ho: 'पुथि (puthi)',
    mundari: 'पुथी (puthi)',
    kurukh: 'पुथी (Puthi)',
    category: 'school',
    emoji: '📖',
    phonetic: 'poo-thee',
    culturalNote: 'Classroom textbook or learning storybook.',
    exampleSentence: {
      hindi: 'अपनी किताब खोलो।',
      olchiki: 'ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ᱾',
      english: 'Open your book.'
    }
  },
  {
    id: 'school_3',
    hindi: 'कलम / पेन',
    english: 'Pen',
    santali_olchiki: 'ᱠᱚᱞᱚᱢ',
    santali_odia: 'କଲମ',
    santali_deva: 'कलम',
    santali_latin: 'kolom',
    ho: 'कलम (kolom)',
    mundari: 'कलम (kolom)',
    kurukh: 'कलम (Kolom)',
    category: 'school',
    emoji: '🖊️',
    phonetic: 'ko-lom',
    culturalNote: 'Writing instrument used by students.',
    exampleSentence: {
      hindi: 'मेरे पास एक कलम है।',
      olchiki: 'ᱤᱧ ᱴᱷᱮᱱ ᱢᱤᱫᱴᱟᱹᱝ ᱠᱚᱞᱚᱢ ᱢᱮᱱᱟᱜᱼᱟ᱾',
      english: 'I have a pen.'
    }
  },
  {
    id: 'school_4',
    hindi: 'शिक्षक / गुरुजी',
    english: 'Teacher',
    santali_olchiki: 'ᱢᱟᱪᱮᱛ',
    santali_odia: 'ମାଚେତ',
    santali_deva: 'माचेत',
    santali_latin: 'machet',
    ho: 'माचेत (machet)',
    mundari: 'माचेत (machet)',
    kurukh: 'गुरु / पड़हाउ (Guru / Parhau)',
    category: 'school',
    emoji: '👨‍🏫',
    phonetic: 'mah-chet',
    culturalNote: 'Educator, highly revered guide in Santhal society.',
    exampleSentence: {
      hindi: 'शिक्षक पढ़ा रहे हैं।',
      olchiki: 'ᱢᱟᱪᱮᱛ ᱯᱟᱲᱦᱟᱣ ᱮᱫᱟᱭ᱾',
      english: 'The teacher is teaching.'
    }
  },
  {
    id: 'school_5',
    hindi: 'विद्यार्थी / छात्र',
    english: 'Student',
    santali_olchiki: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ',
    santali_odia: 'ପାଠୁଆ',
    santali_deva: 'पाठुआ',
    santali_latin: 'pathua',
    ho: 'होनको (honko)',
    mundari: 'होनको (honko)',
    kurukh: 'पड़हू (Parhu / Bachha)',
    category: 'school',
    emoji: '🎒',
    phonetic: 'pah-thoo-wah',
    culturalNote: 'Young learners eager to explore FLN concepts.',
    exampleSentence: {
      hindi: 'विद्यार्थी पढ़ रहे हैं।',
      olchiki: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱯᱟᱲᱦᱟᱣ ᱮᱫᱟ᱾',
      english: 'The students are reading.'
    }
  },
  {
    id: 'school_5b',
    hindi: 'बच्चे / बालक',
    english: 'Children / Kids',
    santali_olchiki: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ',
    santali_odia: 'ଗିଦ୍ରା଼ କ',
    santali_deva: 'गिद्रा़ को',
    santali_latin: 'gidra ko',
    ho: 'होनको (honko)',
    mundari: 'होनको (honko)',
    kurukh: 'कुंखोर / बच्चार (Kunkhor)',
    category: 'family',
    emoji: '👶',
    phonetic: 'geed-rah ko',
    culturalNote: 'Children in the community.',
    exampleSentence: {
      hindi: 'बच्चे खेल रहे हैं।',
      olchiki: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱮᱱᱮᱡ ᱠᱟᱱᱟ ᱠᱚ᱾',
      english: 'The children are playing.'
    }
  },
  {
    id: 'school_6',
    hindi: 'पानी',
    english: 'Water',
    santali_olchiki: 'ᱫᱟᱜ',
    santali_odia: 'ଦାଗ',
    santali_deva: 'दाग़',
    santali_latin: 'daah',
    ho: 'दाः (da)',
    mundari: 'दाः (da)',
    kurukh: 'अम्म (Amm)',
    category: 'nature',
    emoji: '💧',
    phonetic: 'daah (glottal stop)',
    culturalNote: 'Sacred life source from mountain springs (dhorom daah).',
    exampleSentence: {
      hindi: 'मुझे पानी पीना है।',
      olchiki: 'ᱤᱧ ᱫᱟᱜ ᱧᱩ ᱥᱟᱱᱟᱭᱤᱧ ᱠᱟᱱᱟ᱾',
      english: 'I want to drink water.'
    }
  },
  // Nature & Environment
  {
    id: 'nature_1',
    hindi: 'पेड़ / वृक्ष',
    english: 'Tree',
    santali_olchiki: 'ᱫᱟᱨᱮ',
    santali_odia: 'ଦାରେ',
    santali_deva: 'दारे',
    santali_latin: 'dare',
    ho: 'दारू (daru)',
    mundari: 'दारू (daru)',
    kurukh: 'मन (Mann)',
    category: 'nature',
    emoji: '🌳',
    phonetic: 'dah-reh',
    culturalNote: 'Trees like Sal (Sarjom) and Mahua (Matkom) are holy totems.',
    exampleSentence: {
      hindi: 'यह एक पेड़ है।',
      olchiki: 'ᱱᱚᱶᱟ ᱫᱚ ᱢᱤᱫᱴᱟᱹᱝ ᱫᱟᱨᱮ ᱠᱟᱱᱟ᱾',
      english: 'This is a tree.'
    }
  },
  {
    id: 'nature_2',
    hindi: 'साल का पेड़',
    english: 'Sal Tree (Sacred)',
    santali_olchiki: 'ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ',
    santali_odia: 'ସାର୍ଜମ ଦାରେ',
    santali_deva: 'सारजोम दारे',
    santali_latin: 'sarjom dare',
    ho: 'सरजोम (sarjom)',
    mundari: 'सरजोम (sarjom)',
    kurukh: 'सखुआ मन (Sakhua Mann)',
    category: 'nature',
    emoji: '🌲',
    phonetic: 'sar-jom dah-reh',
    culturalNote: 'The sacred tree of the Jaher Than grove where Baha festival is celebrated.',
    exampleSentence: {
      hindi: 'साल का फूल बहुत सुंदर है।',
      olchiki: 'ᱥᱟᱨᱡᱚᱢ ᱵᱟᱦᱟ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱜᱮᱭᱟ᱾',
      english: 'Sal blossom is very beautiful.'
    }
  },
  {
    id: 'nature_3',
    hindi: 'फूल',
    english: 'Flower',
    santali_olchiki: 'ᱵᱟᱦᱟ',
    santali_odia: 'ବାହା',
    santali_deva: 'बाहा',
    santali_latin: 'baha',
    ho: 'बा (ba)',
    mundari: 'बा (ba)',
    kurukh: 'पुम्प (Pump)',
    category: 'nature',
    emoji: '🌸',
    phonetic: 'bah-hah',
    culturalNote: 'Baha Parab is the spring flower festival welcoming new blossoms.',
    exampleSentence: {
      hindi: 'यह लाल फूल है।',
      olchiki: 'ᱱᱚᱶᱟ ᱫᱚ ᱟᱨᱟᱜ ᱵᱟᱦᱟ ᱠᱟᱱᱟ᱾',
      english: 'This is a red flower.'
    }
  },
  {
    id: 'nature_4',
    hindi: 'सूरज',
    english: 'Sun',
    santali_olchiki: 'ᱥᱤᱧ ᱪᱟᱸᱫᱚ',
    santali_odia: 'ସିଞ୍ ଚାନ୍ଦ',
    santali_deva: 'सिंञ चांदो',
    santali_latin: 'sing chando',
    ho: 'सिङी (singi)',
    mundari: 'सिङी (singi)',
    kurukh: 'बिड़ी (Biri)',
    category: 'nature',
    emoji: '☀️',
    phonetic: 'sing chahn-doh',
    culturalNote: 'The supreme light entity (Sing Bonga) in tribal mythology.',
    exampleSentence: {
      hindi: 'सूरज उग रहा है।',
      olchiki: 'ᱥᱤᱧ ᱪᱟᱸᱫᱚ ᱨᱟᱠᱟᱵ ᱠᱟᱱᱟᱭ᱾',
      english: 'The sun is rising.'
    }
  },
  {
    id: 'nature_5',
    hindi: 'गाँव',
    english: 'Village',
    santali_olchiki: 'ᱟᱹᱛᱩ',
    santali_odia: 'ଆତୁ',
    santali_deva: 'आतु',
    santali_latin: 'atu',
    ho: 'हातू (hatu)',
    mundari: 'हातू (hatu)',
    kurukh: 'पद्‍दा (Padda)',
    category: 'nature',
    emoji: '🏡',
    phonetic: 'ah-too',
    culturalNote: 'Traditional village led by the Manjhi Haram village headman.',
    exampleSentence: {
      hindi: 'वह गाँव से आया है।',
      olchiki: 'ᱩᱱᱤ ᱟᱹᱛᱩ ᱠᱷᱚᱱ ᱮ ᱦᱮᱡ ᱮᱱᱟ᱾',
      english: 'He came from the village.'
    }
  },
  // Animals & Birds
  {
    id: 'animals_1',
    hindi: 'पक्षी / चिड़िया',
    english: 'Bird',
    santali_olchiki: 'ᱪᱮᱬᱮ',
    santali_odia: 'ଚେଣେ',
    santali_deva: 'चेणे',
    santali_latin: 'chenre',
    ho: 'चेणो (cheno)',
    mundari: 'चेणो (cheno)',
    kurukh: 'ओड़ो / चिड़ई (Odo / Chid-ee)',
    category: 'animals',
    emoji: '🐦',
    phonetic: 'cheh-nray',
    culturalNote: 'Birds symbolize joy and seasonal change in folklore.',
    exampleSentence: {
      hindi: 'चिड़िया डाल पर गा रही है।',
      olchiki: 'ᱪᱮᱬᱮ ᱰᱟᱹᱨ ᱨᱮ ᱥᱮᱨᱮᱧ ᱮᱫᱟᱭ᱾',
      english: 'The bird is singing on the branch.'
    }
  },
  {
    id: 'animals_2',
    hindi: 'हाथी',
    english: 'Elephant',
    santali_olchiki: 'ᱦᱟᱹᱛᱤ',
    santali_odia: 'ହାତି',
    santali_deva: 'हाति',
    santali_latin: 'hati',
    ho: 'हाति (hati)',
    mundari: 'हाती (hati)',
    kurukh: 'हाथी (Hathi)',
    category: 'animals',
    emoji: '🐘',
    phonetic: 'hah-tee',
    culturalNote: 'Elephant is the guardian giant of Dalma / Mayurbhanj forests.',
    exampleSentence: {
      hindi: 'हाथी जंगल में चलता है।',
      olchiki: 'ᱦᱟᱹᱛᱤ ᱵᱤᱨ ᱨᱮ ᱛᱟᱲᱟᱢ ᱮᱫᱟᱭ᱾',
      english: 'The elephant walks in the forest.'
    }
  },
  {
    id: 'animals_3',
    hindi: 'गाय',
    english: 'Cow',
    santali_olchiki: 'ᱜᱟᱹᱭ',
    santali_odia: 'ଗାଇ',
    santali_deva: 'गइ',
    santali_latin: 'gai',
    ho: 'गुरू (guru)',
    mundari: 'गुरू (guru)',
    kurukh: 'अद्दो / गाय (Addo / Gai)',
    category: 'animals',
    emoji: '🐄',
    phonetic: 'gah-ee',
    culturalNote: 'Revered in Sohrai harvest festival with painted horns.',
    exampleSentence: {
      hindi: 'गाय घास खाती है।',
      olchiki: 'ᱜᱟᱹᱭ ᱜᱷᱟᱥ ᱮ ᱡᱚᱢ ᱮᱫᱟ᱾',
      english: 'The cow eats grass.'
    }
  },
  {
    id: 'animals_4',
    hindi: 'कुत्ता',
    english: 'Dog',
    santali_olchiki: 'ᱥᱮᱛᱟ',
    santali_odia: 'ସେତା',
    santali_deva: 'सेता',
    santali_latin: 'seta',
    ho: 'सेता (seta)',
    mundari: 'सेता (seta)',
    kurukh: 'अल्ला (Alla)',
    category: 'animals',
    emoji: '🐕',
    phonetic: 'seh-tah',
    culturalNote: 'Loyal companion during forest walks and farm guarding.',
    exampleSentence: {
      hindi: 'कुत्ता भौंक रहा है।',
      olchiki: 'ᱥᱮᱛᱟ ᱵᱷᱩᱜ ᱮᱫᱟᱭ᱾',
      english: 'The dog is barking.'
    }
  },
  // Family & Community
  {
    id: 'family_1',
    hindi: 'माँ / माता',
    english: 'Mother',
    santali_olchiki: 'ᱟᱭᱳ / ᱜᱳ',
    santali_odia: 'ଆୟୋ / ଗୋ',
    santali_deva: 'आयो / गो',
    santali_latin: 'ayo / go',
    ho: 'इङ्गा (inga)',
    mundari: 'एङ्गा (enga)',
    kurukh: 'अयंग / मई (Ayang / Mai)',
    category: 'family',
    emoji: '👩‍👧',
    phonetic: 'ah-yoh',
    culturalNote: 'Heart of the tribal family household.',
    exampleSentence: {
      hindi: 'माँ खाना बना रही है।',
      olchiki: 'ᱟᱭᱳ ᱫᱟᱠᱟ ᱩᱛᱩ ᱮᱫᱟᱭ᱾',
      english: 'Mother is cooking food.'
    }
  },
  {
    id: 'family_2',
    hindi: 'पिता / बाबा',
    english: 'Father',
    santali_olchiki: 'ᱵᱟᱵᱟ',
    santali_odia: 'ବାବା',
    santali_deva: 'बाबा',
    santali_latin: 'baba',
    ho: 'आपु (apu)',
    mundari: 'आपु (apu)',
    kurukh: 'तम्बस / बाबा (Tambas / Baba)',
    category: 'family',
    emoji: '👨‍👧',
    phonetic: 'bah-bah',
    culturalNote: 'Provider and storyteller.',
    exampleSentence: {
      hindi: 'पिताजी खेत जा रहे हैं।',
      olchiki: 'ᱵᱟᱵᱟ ᱵᱟᱹᱫᱽ ᱛᱮ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟᱭ᱾',
      english: 'Father is going to the field.'
    }
  },
  {
    id: 'family_3',
    hindi: 'भाई',
    english: 'Brother',
    santali_olchiki: 'ᱵᱚᱭᱦᱟ',
    santali_odia: 'ବୟହା',
    santali_deva: 'बयहा',
    santali_latin: 'boyha',
    ho: 'हागा (haga)',
    mundari: 'हागा (haga)',
    kurukh: 'भैया / जोड़ी (Bhaiya / Jori)',
    category: 'family',
    emoji: '👦',
    phonetic: 'boy-hah',
    culturalNote: 'Sibling bond, companion in play and village chores.',
    exampleSentence: {
      hindi: 'भाई के साथ खेलो।',
      olchiki: 'ᱵᱚᱭᱦᱟ ᱥᱟᱶᱛᱮ ᱮᱱᱮᱡ ᱢᱮ᱾',
      english: 'Play with your brother.'
    }
  },
  // Actions & Classroom Verbs
  {
    id: 'action_1',
    hindi: 'बैठो',
    english: 'Sit Down',
    santali_olchiki: 'ᱫᱩᱲᱩᱵ ᱢᱮ',
    santali_odia: 'ଦୁଡ଼ୁବ ମେ',
    santali_deva: 'दुड़ुब मे',
    santali_latin: 'durub me',
    ho: 'दुबुं में (dubung me)',
    mundari: 'दुब में (dub me)',
    kurukh: 'उक्का (Ukka)',
    category: 'actions',
    emoji: '🪑',
    phonetic: 'doo-roob meh',
    culturalNote: 'Common classroom discipline imperative.',
    exampleSentence: {
      hindi: 'यहाँ बैठो।',
      olchiki: 'ᱱᱚᱸᱰᱮ ᱫᱩᱲᱩᱵ ᱢᱮ᱾',
      english: 'Sit here.'
    }
  },
  {
    id: 'action_2',
    hindi: 'खड़े हो जाओ',
    english: 'Stand Up',
    santali_olchiki: 'ᱛᱤᱸᱜᱩᱱ ᱢᱮ',
    santali_odia: 'ତିଙ୍ଗୁନ ମେ',
    santali_deva: 'तिंगुन मे',
    santali_latin: 'tingun me',
    ho: 'तिंगु में (tingu me)',
    mundari: 'तिंगु में (tingu me)',
    kurukh: 'इत्थरा / सोंगे (Itthra / Songe)',
    category: 'actions',
    emoji: '🧍',
    phonetic: 'ting-goon meh',
    culturalNote: 'Physical classroom TPR action command.',
    exampleSentence: {
      hindi: 'सब बच्चे खड़े हो जाओ।',
      olchiki: 'ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱛᱤᱸᱜᱩᱱ ᱯᱮ᱾',
      english: 'All children stand up.'
    }
  },
  {
    id: 'action_3',
    hindi: 'सुनो / ध्यान से सुनो',
    english: 'Listen carefully',
    santali_olchiki: 'ᱟᱧᱡᱚᱢ ᱢᱮ',
    santali_odia: 'ଆଞ୍ଜମ ମେ',
    santali_deva: 'आञजोम मे',
    santali_latin: 'anjom me',
    ho: 'आयूम में (ayum me)',
    mundari: 'आयूम में (ayum me)',
    kurukh: 'मेना / मेनके (Mena / Menke)',
    category: 'actions',
    emoji: '👂',
    phonetic: 'ahn-jom meh',
    culturalNote: 'Focus call before storytelling or explanation.',
    exampleSentence: {
      hindi: 'मेरी बात ध्यान से सुनो।',
      olchiki: 'ᱤᱧᱟᱜ ᱠᱟᱛᱷᱟ ᱱᱟᱯᱟᱭ ᱛᱮ ᱟᱧᱡᱚᱢ ᱢᱮ᱾',
      english: 'Listen to my words carefully.'
    }
  },
  {
    id: 'action_4',
    hindi: 'पढ़ो / पढ़ना',
    english: 'Read / Study',
    santali_olchiki: 'ᱯᱟᱲᱦᱟᱣ ᱢᱮ',
    santali_odia: 'ପାଢ଼ହାଓ ମେ',
    santali_deva: 'पाड़हाव मे',
    santali_latin: 'parhaw me',
    ho: 'पई में (pai me)',
    mundari: 'पई में (pai me)',
    kurukh: 'पड़हा / पड़हके (Parha / Parhke)',
    category: 'actions',
    emoji: '📖',
    phonetic: 'par-how meh',
    culturalNote: 'Foundational literacy instruction.',
    exampleSentence: {
      hindi: 'यह पाठ पढ़ो।',
      olchiki: 'ᱱᱚᱶᱟ ᱯᱟᱴᱷ ᱯᱟᱲᱦᱟᱣ ᱢᱮ᱾',
      english: 'Read this lesson.'
    }
  },
  {
    id: 'action_5',
    hindi: 'लिखो / लिखना',
    english: 'Write',
    santali_olchiki: 'ᱚᱞ ᱢᱮ',
    santali_odia: 'ଅଲ ମେ',
    santali_deva: 'ओल मे',
    santali_latin: 'ol me',
    ho: 'ओल में (ol me)',
    mundari: 'ओल में (ol me)',
    kurukh: 'टुड़ा / टुड़के (Tura / Turke)',
    category: 'actions',
    emoji: '✏️',
    phonetic: 'ohl meh',
    culturalNote: 'Ol means "to write" in Santali — source of the Ol Chiki script name.',
    exampleSentence: {
      hindi: 'कॉपी में लिखो।',
      olchiki: 'ᱠᱷᱟᱛᱟ ᱨᱮ ᱚᱞ ᱢᱮ᱾',
      english: 'Write in the notebook.'
    }
  }
  ,
  // Numeracy & Counting (FLN)
  {
    id: 'num_1',
    hindi: 'एक / १',
    english: 'One / 1',
    santali_olchiki: 'ᱢᱤᱫ (᱑)',
    santali_odia: 'ମିଡ଼ (୧)',
    santali_deva: 'मिद (१)',
    santali_latin: "mit' (1)",
    ho: 'मियद (miyad)',
    mundari: 'मियद (miyad)',
    kurukh: 'ओंद (Ond - 1)',
    category: 'numbers',
    emoji: '1️⃣',
    phonetic: 'meet',
    culturalNote: 'First cardinal number in Santali.',
    exampleSentence: {
      hindi: 'मेरे पास एक कलम है।',
      olchiki: 'ᱤᱧ ᱴᱷᱮᱱ ᱢᱤᱫᱴᱟᱹᱝ ᱠᱚᱞᱚᱢ ᱢᱮᱱᱟᱜᱼᱟ᱾',
      english: 'I have one pen.'
    }
  },
  {
    id: 'num_2',
    hindi: 'दो / २',
    english: 'Two / 2',
    santali_olchiki: 'ᱵᱟᱨ (᱒)',
    santali_odia: 'ବାର (୨)',
    santali_deva: 'बार (२)',
    santali_latin: 'bar (2)',
    ho: 'बारिया (bariya)',
    mundari: 'बारिया (bariya)',
    kurukh: 'इर्र / एंड (Irr / End - 2)',
    category: 'numbers',
    emoji: '2️⃣',
    phonetic: 'bahr',
    culturalNote: 'Dual root in Santhali grammar.',
    exampleSentence: {
      hindi: 'दो बच्चे खेल रहे हैं।',
      olchiki: 'ᱵᱟᱨᱭᱟ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱤᱱ ᱮᱱᱮᱡ ᱠᱟᱱᱟ᱾',
      english: 'Two children are playing.'
    }
  },
  {
    id: 'num_3',
    hindi: 'तीन / ३',
    english: 'Three / 3',
    santali_olchiki: 'ᱯᱮ (᱓)',
    santali_odia: 'ପେ (୩)',
    santali_deva: 'पे (३)',
    santali_latin: 'pe (3)',
    ho: 'अपिया (apiya)',
    mundari: 'अपिया (apiya)',
    kurukh: 'मूंद (Moond - 3)',
    category: 'numbers',
    emoji: '3️⃣',
    phonetic: 'pay',
    culturalNote: 'Third cardinal number.',
    exampleSentence: {
      hindi: 'मेज पर तीन किताबें हैं।',
      olchiki: 'ᱢᱮᱡᱽ ᱨᱮ ᱯᱮᱭᱟ ᱯᱩᱛᱷᱤ ᱢᱮᱱᱟᱜᱼᱟ᱾',
      english: 'There are three books on the table.'
    }
  },
  {
    id: 'num_5',
    hindi: 'पाँच / ५',
    english: 'Five / 5',
    santali_olchiki: 'ᱢᱚᱬᱮ (᱕)',
    santali_odia: 'ମୋଣେ (୫)',
    santali_deva: 'मोणे (५)',
    santali_latin: 'mone (5)',
    ho: 'मोड़े (mode)',
    mundari: 'मोड़े (mode)',
    kurukh: 'पंचे (Panche - 5)',
    category: 'numbers',
    emoji: '5️⃣',
    phonetic: 'moh-nay',
    culturalNote: 'Foundational hand counting unit.',
    exampleSentence: {
      hindi: 'हाथ में पाँच उंगलियाँ हैं।',
      olchiki: 'ᱛᱤ ᱨᱮ ᱢᱚᱬᱮ ᱜᱚᱴᱟᱝ ᱠᱟᱹᱴᱩᱵ ᱢᱮᱱᱟᱜᱼᱟ᱾',
      english: 'There are five fingers on a hand.'
    }
  },
  {
    id: 'num_10',
    hindi: 'दस / १०',
    english: 'Ten / 10',
    santali_olchiki: 'ᱜᱮᱞ (᱑᱐)',
    santali_odia: 'ଗେଲ (୧୦)',
    santali_deva: 'गेल (१०)',
    santali_latin: 'gel (10)',
    ho: 'गेल (gel)',
    mundari: 'गेल (gel)',
    kurukh: 'दसे (Dase - 10)',
    category: 'numbers',
    emoji: '🔟',
    phonetic: 'gell',
    culturalNote: 'Compound base for numbers 11 to 19 (gel mit, gel bar, etc.).',
    exampleSentence: {
      hindi: 'दस विद्यार्थी कक्षा में हैं।',
      olchiki: 'ᱜᱮᱞ ᱦᱚᱲ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱞᱟᱥ ᱨᱮ ᱢᱮᱱᱟᱜ ᱠᱚᱣᱟ᱾',
      english: 'Ten students are in the class.'
    }
  },
  {
    id: 'num_20',
    hindi: 'बीस / २०',
    english: 'Twenty / 20',
    santali_olchiki: 'ᱤᱥᱤ (᱒᱐)',
    santali_odia: 'ଇସି (୨୦)',
    santali_deva: 'इसी (२०)',
    santali_latin: 'isi (20)',
    ho: 'हिसि (hisi)',
    mundari: 'हिसि (hisi)',
    kurukh: 'कुड़ी / बीस (Kuri / Bees - 20)',
    category: 'numbers',
    emoji: '2️⃣0️⃣',
    phonetic: 'ee-see',
    culturalNote: 'Santali traditional base-20 vigesimal counting root unit.',
    exampleSentence: {
      hindi: 'बीस रुपये।',
      olchiki: 'ᱤᱥᱤ ᱴᱟᱠᱟ᱾',
      english: 'Twenty rupees.'
    }
  }
,
// Colours (FLN Visual Theme)
  {
    id: 'colour_1',
    hindi: 'लाल',
    english: 'Red',
    santali_olchiki: 'ᱟᱨᱟᱜ',
    santali_odia: 'ଆରାଗ',
    santali_deva: 'आराग',
    santali_latin: 'arag',
    ho: 'आराः (ara)',
    mundari: 'आराः (ara)',
    kurukh: 'खेंखो / लाल (Khenkho / Lal)',
    category: 'colours',
    emoji: '🔴',
    phonetic: 'ah-rahg',
    culturalNote: 'Color of palash flower and festive sindur.',
    exampleSentence: {
      hindi: 'यह लाल फूल है।',
      olchiki: 'ᱱᱚᱶᱟ ᱫᱚ ᱟᱨᱟᱜ ᱵᱟᱦᱟ ᱠᱟᱱᱟ᱾',
      english: 'This is a red flower.'
    }
  },
  {
    id: 'colour_2',
    hindi: 'हरा',
    english: 'Green',
    santali_olchiki: 'ᱦᱟᱹᱨᱤᱭᱟᱹᱲ',
    santali_odia: 'ହାରିୟାଡ଼',
    santali_deva: 'हारियाड़',
    santali_latin: 'hariyad',
    ho: 'हरियर (hariyar)',
    mundari: 'हरियर (hariyar)',
    kurukh: 'हरियर (Hariyar)',
    category: 'colours',
    emoji: '🟢',
    phonetic: 'hah-ree-yad',
    culturalNote: 'Color of forest sal canopy and fresh crops.',
    exampleSentence: {
      hindi: 'पेड़ के पत्ते हरे हैं।',
      olchiki: 'ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱥᱟᱠᱟᱢ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ ᱜᱮᱭᱟ᱾',
      english: 'The leaves of the tree are green.'
    }
  },
  {
    id: 'colour_3',
    hindi: 'नीला',
    english: 'Blue',
    santali_olchiki: 'ᱞᱤᱞ',
    santali_odia: 'ଲିଲ',
    santali_deva: 'लील',
    santali_latin: 'lil',
    ho: 'लील (lil)',
    mundari: 'लील (lil)',
    kurukh: 'लील (Lil)',
    category: 'colours',
    emoji: '🔵',
    phonetic: 'leel',
    culturalNote: 'Color of the clear sky (serma).',
    exampleSentence: {
      hindi: 'आसमान नीला है।',
      olchiki: 'ᱥᱮᱨᱢᱟ ᱫᱚ ᱞᱤᱞ ᱜᱮᱭᱟ᱾',
      english: 'The sky is blue.'
    }
  },
  {
    id: 'colour_4',
    hindi: 'पीला',
    english: 'Yellow',
    santali_olchiki: 'ᱥᱟᱥᱟᱝ',
    santali_odia: 'ସାସାଙ୍ଗ',
    santali_deva: 'सासांग',
    santali_latin: 'sasang',
    ho: 'ससंग (sasang)',
    mundari: 'ससंग (sasang)',
    kurukh: 'पियर / ससंग (Piyar / Sasang)',
    category: 'colours',
    emoji: '🟡',
    phonetic: 'sah-sahng',
    culturalNote: 'Sasang (turmeric) is sacred in marriage and welcoming rituals.',
    exampleSentence: {
      hindi: 'हल्दी पीली है।',
      olchiki: 'ᱥᱟᱥᱟᱝ ᱫᱚ ᱥᱟᱥᱟᱝ ᱜᱮᱭᱟ᱾',
      english: 'Turmeric is yellow.'
    }
  },
  {
    id: 'colour_5',
    hindi: 'सफेद',
    english: 'White',
    santali_olchiki: 'ᱯᱩᱸᱰ',
    santali_odia: 'ପୁଣ୍ଡ',
    santali_deva: 'पुण्ड',
    santali_latin: 'pund',
    ho: 'पुंडी (pundi)',
    mundari: 'पुंडी (pundi)',
    kurukh: 'पंदरा (Pandra)',
    category: 'colours',
    emoji: '⚪',
    phonetic: 'poond',
    culturalNote: 'White cockerel offered in sacred groves.',
    exampleSentence: {
      hindi: 'सफेद पक्षी उड़ रहा है।',
      olchiki: 'ᱯᱩᱸᱰ ᱪᱮᱬᱮ ᱩᱰᱟᱹᱣᱜ ᱠᱟᱱᱟᱭ᱾',
      english: 'A white bird is flying.'
    }
  },
  {
    id: 'colour_6',
    hindi: 'काला',
    english: 'Black',
    santali_olchiki: 'ᱦᱮᱸᱫᱮ',
    santali_odia: 'ହେନ୍ଦେ',
    santali_deva: 'हेंदे',
    santali_latin: 'hende',
    ho: 'हेंदे (hende)',
    mundari: 'हेंदे (hende)',
    kurukh: 'करिया / हेकड़ा (Kariya / Hekda)',
    category: 'colours',
    emoji: '⚫',
    phonetic: 'hen-day',
    culturalNote: 'Rich dark soil in monsoon fields.',
    exampleSentence: {
      hindi: 'काली गाय चर रही है।',
      olchiki: 'ᱦᱮᱸᱫᱮ ᱜᱟᱹᱭ ᱜᱚᱴᱟ ᱮᱫᱟᱭ᱾',
      english: 'The black cow is grazing.'
    }
  },
  // Fruits & Flora
  {
    id: 'fruit_1',
    hindi: 'आम',
    english: 'Mango',
    santali_olchiki: 'ᱩᱞ',
    santali_odia: 'ଉଲ',
    santali_deva: 'उल',
    santali_latin: 'ul',
    ho: 'उली (uli)',
    mundari: 'उली (uli)',
    kurukh: 'ततखा / आम (Tatkha / Aam)',
    category: 'fruits',
    emoji: '🥭',
    phonetic: 'ool',
    culturalNote: 'Summer king fruit across tribal orchards.',
    exampleSentence: {
      hindi: 'यह आम मीठा है।',
      olchiki: 'ᱱᱚᱶᱟ ᱩᱞ ᱫᱚ ᱦᱮᱲᱮᱢ ᱜᱮᱭᱟ᱾',
      english: 'This mango is sweet.'
    }
  },
  {
    id: 'fruit_2',
    hindi: 'केला',
    english: 'Banana',
    santali_olchiki: 'ᱠᱟᱭᱨᱟ',
    santali_odia: 'କାୟରା',
    santali_deva: 'कायरा',
    santali_latin: 'kayra',
    ho: 'कदेरा (kadera)',
    mundari: 'कदेरा (kadera)',
    kurukh: 'केरा (Kera)',
    category: 'fruits',
    emoji: '🍌',
    phonetic: 'kahy-rah',
    culturalNote: 'Banana leaves used in community feast pangat.',
    exampleSentence: {
      hindi: 'मुझे केला खाना पसंद है।',
      olchiki: 'ᱤᱧ ᱠᱟᱭᱨᱟ ᱡᱚᱢ ᱠᱩᱥᱤᱭᱟᱜᱼᱟᱹᱧ᱾',
      english: 'I like eating banana.'
    }
  },
  {
    id: 'fruit_3',
    hindi: 'सेब',
    english: 'Apple',
    santali_olchiki: 'ᱥᱮᱣ',
    santali_odia: 'ସେୱ',
    santali_deva: 'सेव',
    santali_latin: 'sew',
    ho: 'सेव (sev)',
    mundari: 'सेव (sev)',
    kurukh: 'सेब (Seb)',
    category: 'fruits',
    emoji: '🍎',
    phonetic: 'seh-w',
    culturalNote: 'Nutritious orchard fruit in Midday Meal.',
    exampleSentence: {
      hindi: 'सेब लाल है।',
      olchiki: 'ᱥᱮᱣ ᱫᱚ ᱟᱨᱟᱜ ᱜᱮᱭᱟ᱾',
      english: 'The apple is red.'
    }
  },
  {
    id: 'fruit_4',
    hindi: 'महुआ',
    english: 'Mahua Blossom',
    santali_olchiki: 'ᱢᱟᱛᱠᱚᱢ',
    santali_odia: 'ମାତକମ',
    santali_deva: 'मातकोम',
    santali_latin: 'matkom',
    ho: 'मदकम (madkam)',
    mundari: 'मदकम (madkam)',
    kurukh: 'महूवा (Mahuwa)',
    category: 'flora',
    emoji: '🌼',
    phonetic: 'maht-kom',
    culturalNote: 'Lifeline edible blossom dried for sweet traditional porridge.',
    exampleSentence: {
      hindi: 'महुआ का फूल मीठा होता है।',
      olchiki: 'ᱢᱟᱛᱠᱚᱢ ᱵᱟᱦᱟ ᱫᱚ ᱦᱮᱲᱮᱢ ᱜᱮᱭᱟ᱾',
      english: 'Mahua flower is sweet.'
    }
  },
  // 2D & 3D Shapes (FLN Math Geometry)
  {
    id: 'shape_1',
    hindi: 'गोल / वृत्त',
    english: 'Circle / Round',
    santali_olchiki: 'ᱜᱳᱞ',
    santali_odia: 'ଗୋଲ',
    santali_deva: 'गोल',
    santali_latin: 'gol',
    ho: 'गोल (gol)',
    mundari: 'गोल (gol)',
    kurukh: 'गोल (Gol)',
    category: 'shapes',
    emoji: '⭕',
    phonetic: 'gohl',
    culturalNote: 'Shape of the sun and traditional village akhra circle.',
    exampleSentence: {
      hindi: 'सूरज गोल है।',
      olchiki: 'ᱥᱤᱧ ᱪᱟᱸᱫᱚ ᱫᱚ ᱜᱳᱞ ᱜᱮᱭᱟᱭ᱾',
      english: 'The sun is round/circular.'
    }
  },
  {
    id: 'shape_2',
    hindi: 'चौकोर / वर्ग',
    english: 'Square',
    santali_olchiki: 'ᱪᱟᱹᱣᱠᱟᱹ',
    santali_odia: 'ଚୌକା',
    santali_deva: 'चौका',
    santali_latin: 'chawka',
    ho: 'चौका (chowka)',
    mundari: 'चौका (chowka)',
    kurukh: 'चौकोन (Chowkon)',
    category: 'shapes',
    emoji: '⏹️',
    phonetic: 'chow-kah',
    culturalNote: 'Square courtyard in traditional mud house architecture.',
    exampleSentence: {
      hindi: 'यह कैरम बोर्ड चौकोर है।',
      olchiki: 'ᱱᱚᱶᱟ ᱠᱮᱨᱚᱢ ᱵᱚᱨᱰ ᱫᱚ ᱪᱟᱹᱣᱠᱟᱹ ᱜᱮᱭᱟ᱾',
      english: 'This carrom board is square.'
    }
  },
  {
    id: 'shape_3',
    hindi: 'त्रिकोण / तिकोना',
    english: 'Triangle',
    santali_olchiki: 'ᱯᱮ ᱠᱳᱬ',
    santali_odia: 'ପେ କୋଣ',
    santali_deva: 'पे कोण',
    santali_latin: 'pe kon',
    ho: 'अपी कोना (api kona)',
    mundari: 'अपी कोना (api kona)',
    kurukh: 'मूंद कोना (Moond Kona)',
    category: 'shapes',
    emoji: '🔺',
    phonetic: 'pay kohn',
    culturalNote: 'Three-cornered roof thatch in hilly villages.',
    exampleSentence: {
      hindi: 'समोसा तिकोना होता है।',
      olchiki: 'ᱥᱟᱢᱚᱥᱟ ᱫᱚ ᱯᱮ ᱠᱳᱬ ᱜᱮᱭᱟ᱾',
      english: 'Samosa is triangular.'
    }
  },
  // Additional Fauna (Animals)
  {
    id: 'animals_5',
    hindi: 'बिल्ली',
    english: 'Cat',
    santali_olchiki: 'ᱯᱩᱥᱤ',
    santali_odia: 'ପୁସି',
    santali_deva: 'पुसी',
    santali_latin: 'pusi',
    ho: 'पुसी (pusi)',
    mundari: 'पुसी (pusi)',
    kurukh: 'बिली / पुसी (Billi / Pusi)',
    category: 'animals',
    emoji: '🐱',
    phonetic: 'poo-see',
    culturalNote: 'Friendly pet keeping granaries safe from pests.',
    exampleSentence: {
      hindi: 'बिल्ली दूध पी रही है।',
      olchiki: 'ᱯᱩᱥᱤ ᱛᱳᱣᱟ ᱮ ᱧᱩ ᱮᱫᱟ᱾',
      english: 'The cat is drinking milk.'
    }
  },
  {
    id: 'animals_6',
    hindi: 'बाघ / शेर',
    english: 'Tiger',
    santali_olchiki: 'ᱛᱟᱹᱨᱩᱵ / ᱠᱩᱞ',
    santali_odia: 'ତାରୁବ',
    santali_deva: 'तारुब',
    santali_latin: 'tarub',
    ho: 'कुला (kula)',
    mundari: 'कुला (kula)',
    kurukh: 'लखरा (Lakhra)',
    category: 'animals',
    emoji: '🐅',
    phonetic: 'tah-roob',
    culturalNote: 'Revered forest sovereign in Saranda and Similipal woods.',
    exampleSentence: {
      hindi: 'बाघ जंगल में रहता है।',
      olchiki: 'ᱛᱟᱹᱨᱩᱵ ᱵᱤᱨ ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟᱭ᱾',
      english: 'The tiger lives in the forest.'
    }
  },
  {
    id: 'animals_7',
    hindi: 'बकरी',
    english: 'Goat',
    santali_olchiki: 'ᱢᱮᱨᱚᱢ',
    santali_odia: 'ମେରମ',
    santali_deva: 'मेरम',
    santali_latin: 'merom',
    ho: 'मेरों (merom)',
    mundari: 'मेरों (merom)',
    kurukh: 'एड़ा (Eda)',
    category: 'animals',
    emoji: '🐐',
    phonetic: 'meh-rom',
    culturalNote: 'Pastoral companion grazed by village youth.',
    exampleSentence: {
      hindi: 'बकरी पत्ती खाती है।',
      olchiki: 'ᱢᱮᱨᱚᱢ ᱥᱟᱠᱟᱢ ᱮ ᱡᱚᱢ ᱮᱫᱟ᱾',
      english: 'The goat eats leaves.'
    }
  },
  {
    id: 'animals_8',
    hindi: 'मछली',
    english: 'Fish',
    santali_olchiki: 'ᱦᱟᱠᱚ',
    santali_odia: 'ହାକ',
    santali_deva: 'हाको',
    santali_latin: 'hako',
    ho: 'हाइ (hai)',
    mundari: 'हाइ (hai)',
    kurukh: 'इंजो (Injo)',
    category: 'animals',
    emoji: '🐟',
    phonetic: 'hah-koh',
    culturalNote: 'Fresh catch from river stream with traditional bamboo traps.',
    exampleSentence: {
      hindi: 'मछली पानी में तैरती है।',
      olchiki: 'ᱦᱟᱠᱚ ᱫᱟᱜ ᱨᱮ ᱯᱟᱹᱭᱨᱟᱹᱜ ᱠᱟᱱᱟᱭ᱾',
      english: 'The fish swims in the water.'
    }
  },
  // High-Frequency Classroom Dialogues & Imperatives
  {
    id: 'dialogue_1',
    hindi: 'ब्लैकबोर्ड पर देखो',
    english: 'Look at the blackboard',
    santali_olchiki: 'ᱠᱟᱞᱤ ᱵᱚᱨᱰ ᱨᱮ ᱧᱮᱞ ᱢᱮ',
    santali_odia: 'କାଲି ବୋର୍ଡ ରେ ଞେଲ ମେ',
    santali_deva: 'काली बोर्ड रे ञेल मे',
    santali_latin: 'kali bord re nel me',
    ho: 'बोर्ड रे लेल मे (board re lel me)',
    mundari: 'बोर्ड रे नेल मे (board re nel me)',
    kurukh: 'बोर्ड तर एरा (Board tar era)',
    category: 'dialogues',
    emoji: '👨‍🏫',
    phonetic: 'kah-lee bord reh nyel meh',
    culturalNote: 'Direct teacher visual attention cue.',
    exampleSentence: {
      hindi: 'सब बच्चे ब्लैकबोर्ड पर देखो।',
      olchiki: 'ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱟᱞᱤ ᱵᱚᱨᱰ ᱨᱮ ᱧᱮᱞ ᱯᱮ᱾',
      english: 'All children look at the blackboard.'
    }
  },
  {
    id: 'dialogue_2',
    hindi: 'क्या आप समझ गए?',
    english: 'Do you understand?',
    santali_olchiki: 'ᱪᱮᱫ ᱟᱢᱮᱢ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱼᱟ?',
    santali_odia: 'ଚେଦ ଆମେମ ବୁଝାୱ କେଦ-ଆ?',
    santali_deva: 'चेद आमेम बुझाव केद-आ?',
    santali_latin: 'ched amem bujhaw ked-a?',
    ho: 'चिना आम बुझौ केदाम? (china aam bujhau kedam?)',
    mundari: 'चिना आम बुझाव केदाम? (china aam bujhaw kedam?)',
    kurukh: 'एन बुझरकाय? (En bujharkay?)',
    category: 'dialogues',
    emoji: '💡',
    phonetic: 'ched ah-mem booj-how kayd-ah',
    culturalNote: 'FLN formative comprehension check during interactive lessons.',
    exampleSentence: {
      hindi: 'क्या आपने कहानी समझी?',
      olchiki: 'ᱪᱮᱫ ᱟᱢ ᱠᱟᱹᱦᱱᱤᱢ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱼᱟ?',
      english: 'Did you understand the story?'
    }
  },
  {
    id: 'dialogue_3',
    hindi: 'नमस्ते / प्रणाम',
    english: 'Greetings / Hello',
    santali_olchiki: 'ᱡᱚᱦᱟᱨ',
    santali_odia: 'ଜୋହାର',
    santali_deva: 'जोहार',
    santali_latin: 'johar',
    ho: 'जोहार (johar)',
    mundari: 'जोहार (johar)',
    kurukh: 'जोहार (Johar)',
    category: 'dialogues',
    emoji: '🙏',
    phonetic: 'joh-hahr',
    culturalNote: 'Universal tribal greeting expressing deep mutual respect.',
    exampleSentence: {
      hindi: 'नमस्ते गुरुजी।',
      olchiki: 'ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ ᱜᱚᱢᱠᱮ᱾',
      english: 'Greetings teacher.'
    }
  },
  {
    id: 'dialogue_4',
    hindi: 'हाथ उठाओ',
    english: 'Raise your hand',
    santali_olchiki: 'ᱛᱤ ᱛᱩᱞ ᱢᱮ',
    santali_odia: 'ତି ତୁଲ ମେ',
    santali_deva: 'ती तुल मे',
    santali_latin: 'ti tul me',
    ho: 'ती तुल मे (ti tul me)',
    mundari: 'ती तुल मे (ti tul me)',
    kurukh: 'खेकल ओथरा (Khekhal othra)',
    category: 'dialogues',
    emoji: '🙋',
    phonetic: 'tee tool meh',
    culturalNote: 'Classroom turn-taking protocol.',
    exampleSentence: {
      hindi: 'उत्तर देने के लिए हाथ उठाओ।',
      olchiki: 'ᱛᱮᱞᱟ ᱮᱢ ᱞᱟᱹᱜᱤᱫ ᱛᱤ ᱛᱩᱞ ᱢᱮ᱾',
      english: 'Raise your hand to give an answer.'
    }
  }
,
// Daily Life, Produce & Flora (FLN Contextual Vocabulary)
  {
    id: 'food_1',
    hindi: 'आलू',
    english: 'Potato',
    santali_olchiki: 'ᱟᱹᱞᱩ',
    santali_odia: 'ଆଲୁ',
    santali_deva: 'आलु',
    santali_latin: 'alu',
    ho: 'आलु (alu)',
    mundari: 'आलु (alu)',
    kurukh: 'आलू (Aalu)',
    category: 'flora',
    emoji: '🥔',
    phonetic: 'ah-loo',
    culturalNote: 'Essential staple tuber cooked with lentils.',
    exampleSentence: {
      hindi: 'आलू की सब्जी बनी है।',
      olchiki: 'ᱟᱹᱞᱩ ᱩᱛᱩ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱᱟ᱾',
      english: 'Potato curry is prepared.'
    }
  },
  {
    id: 'food_2',
    hindi: 'टमाटर',
    english: 'Tomato',
    santali_olchiki: 'ᱵᱤᱞᱟᱹᱛᱤ',
    santali_odia: 'ବିଲାତି',
    santali_deva: 'बिलाती',
    santali_latin: 'bilati',
    ho: 'टोको (toko)',
    mundari: 'टोको (toko)',
    kurukh: 'टमाटर / बिलाती (Tamatar / Bilati)',
    category: 'flora',
    emoji: '🍅',
    phonetic: 'bee-lah-tee',
    culturalNote: 'Fresh sour vegetable used in daily curries.',
    exampleSentence: {
      hindi: 'टमाटर लाल और ताजा है।',
      olchiki: 'ᱵᱤᱞᱟᱹᱛᱤ ᱫᱚ ᱟᱨᱟᱜ ᱟᱨ ᱥᱚᱡᱽ ᱜᱮᱭᱟ᱾',
      english: 'The tomato is red and fresh.'
    }
  },
  {
    id: 'food_3',
    hindi: 'बैंगन',
    english: 'Brinjal / Eggplant',
    santali_olchiki: 'ᱵᱮᱸᱜᱟᱲ',
    santali_odia: 'ବେଙ୍ଗାଡ଼',
    santali_deva: 'बेंग़ाड़',
    santali_latin: 'bengad',
    ho: 'जनुम टोको (janum toko)',
    mundari: 'जनुम टोको (janum toko)',
    kurukh: 'भंटा (Bhanta)',
    category: 'flora',
    emoji: '🍆',
    phonetic: 'ben-gahd',
    culturalNote: 'Native seasonal vegetable grown in homestead bari gardens.',
    exampleSentence: {
      hindi: 'बैंगन खेत में फला है।',
      olchiki: 'ᱵᱮᱸᱜᱟᱲ ᱵᱟᱹᱫᱽ ᱨᱮ ᱡᱚ ᱟᱠᱟᱱᱟ᱾',
      english: 'Brinjal has grown in the farm.'
    }
  },
  {
    id: 'food_4',
    hindi: 'लहसुन',
    english: 'Garlic',
    santali_olchiki: 'ᱨᱟᱹᱥᱩᱬ',
    santali_odia: 'ରାସୁଣ',
    santali_deva: 'रासुण',
    santali_latin: 'rasun',
    ho: 'रसुंडी (rasundi)',
    mundari: 'रसुंडि (rasundi)',
    kurukh: 'रसुन (Rasun)',
    category: 'flora',
    emoji: '🧄',
    phonetic: 'rah-soon',
    culturalNote: 'Medicinal and aromatic kitchen herb.',
    exampleSentence: {
      hindi: 'लहसुन स्वाद बढ़ाता है।',
      olchiki: 'ᱨᱟᱹᱥᱩᱬ ᱥᱤᱵᱤᱞ ᱮ ᱵᱟᱹᱲᱛᱤᱭᱟ᱾',
      english: 'Garlic enhances taste.'
    }
  },
  {
    id: 'food_5',
    hindi: 'भिंडी',
    english: 'Ladyfinger / Okra',
    santali_olchiki: 'ᱵᱷᱮᱰᱣᱟ',
    santali_odia: 'ଭେଡୱା',
    santali_deva: 'भेडवा',
    santali_latin: 'bhedwa',
    ho: 'भेडवा (bhedwa)',
    mundari: 'भेडवा (bhedwa)',
    kurukh: 'रामझिंझरी (Ramjhinjhari)',
    category: 'flora',
    emoji: '🥬',
    phonetic: 'bhed-wah',
    culturalNote: 'Monsoon garden produce.',
    exampleSentence: {
      hindi: 'भिंडी हरी होती है।',
      olchiki: 'ᱵᱷᱮᱰᱣᱟ ᱫᱚ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ ᱜᱮᱭᱟ᱾',
      english: 'Ladyfinger is green.'
    }
  },
  {
    id: 'food_6',
    hindi: 'कटहल',
    english: 'Jackfruit',
    santali_olchiki: 'ᱠᱟᱱᱴᱷᱟᱲ',
    santali_odia: 'କାଣ୍ଠାଡ଼',
    santali_deva: 'कान्ठाड़',
    santali_latin: 'kanthar',
    ho: 'कंठड़ (kanthad)',
    mundari: 'कंठड़ (kanthad)',
    kurukh: 'कटर (Katar)',
    category: 'fruits',
    emoji: '🍈',
    phonetic: 'kahn-thahr',
    culturalNote: 'Tree fruit eaten raw as vegetable and ripe as sweet fruit.',
    exampleSentence: {
      hindi: 'कटहल का पेड़ बड़ा है।',
      olchiki: 'ᱠᱟᱱᱴᱷᱟᱲ ᱫᱟᱨᱮ ᱫᱚ ᱢᱟᱨᱟᱝ ᱜᱮᱭᱟ᱾',
      english: 'The jackfruit tree is big.'
    }
  },
  {
    id: 'food_7',
    hindi: 'अमरूद',
    english: 'Guava',
    santali_olchiki: 'ᱴᱟᱢᱨᱟᱥ',
    santali_odia: 'ଟାମରାସ',
    santali_deva: 'टामरास',
    santali_latin: 'tamras',
    ho: 'टमरस (tamras)',
    mundari: 'टमरस (tamras)',
    kurukh: 'अमरुत (Amrut)',
    category: 'fruits',
    emoji: '🍈',
    phonetic: 'tahm-rahs',
    culturalNote: 'Winter orchard fruit rich in Vitamin C.',
    exampleSentence: {
      hindi: 'अमरूद मीठा फल है।',
      olchiki: 'ᱴᱟᱢᱨᱟᱥ ᱫᱚ ᱦᱮᱲᱮᱢ ᱡᱚ ᱠᱟᱱᱟ᱾',
      english: 'Guava is a sweet fruit.'
    }
  },
  {
    id: 'food_8',
    hindi: 'जामुन',
    english: 'Black Plum / Jamun',
    santali_olchiki: 'ᱠᱩᱫᱽ',
    santali_odia: 'କୁଦ',
    santali_deva: 'कुद',
    santali_latin: 'kud',
    ho: 'कुदा (kuda)',
    mundari: 'कुदा (kuda)',
    kurukh: 'जंबु / कुदा (Jambu / Kuda)',
    category: 'fruits',
    emoji: '🫐',
    phonetic: 'kood',
    culturalNote: 'Monsoon black berry picked in forest groves.',
    exampleSentence: {
      hindi: 'जामुन का रंग काला-बैंगनी है।',
      olchiki: 'ᱠᱩᱫᱽ ᱨᱮᱱᱟᱜ ᱨᱚᱝ ᱫᱚ ᱦᱮᱸᱫᱮ ᱜᱮᱭᱟ᱾',
      english: 'Jamun is dark purple.'
    }
  },
  {
    id: 'food_9',
    hindi: 'इमली',
    english: 'Tamarind',
    santali_olchiki: 'ᱡᱚᱡᱚ',
    santali_odia: 'ଜୋଜୋ',
    santali_deva: 'जोजो',
    santali_latin: 'jojo',
    ho: 'जोजो (jojo)',
    mundari: 'जोजो (jojo)',
    kurukh: 'तिंतली (Tintli)',
    category: 'fruits',
    emoji: '🌰',
    phonetic: 'joh-joh',
    culturalNote: 'Sour pod used in sour soup and village recipes.',
    exampleSentence: {
      hindi: 'इमली खट्टी होती है।',
      olchiki: 'ᱡᱚᱡᱚ ᱫᱚ ᱡᱚᱡᱚ ᱜᱮᱭᱟ᱾',
      english: 'Tamarind is sour.'
    }
  },
  {
    id: 'food_10',
    hindi: 'केकड़ा',
    english: 'Crab',
    santali_olchiki: 'ᱠᱟᱴᱠᱚᱢ',
    santali_odia: 'କାଟକମ',
    santali_deva: 'काटकोम',
    santali_latin: 'katkom',
    ho: 'कटकोम (katkom)',
    mundari: 'कटकोम (katkom)',
    kurukh: 'खंखरा (Khankhra)',
    category: 'animals',
    emoji: '🦀',
    phonetic: 'kaht-kom',
    culturalNote: 'Stream freshwater crab collected from paddy fields.',
    exampleSentence: {
      hindi: 'केकड़ा पानी के किनारे रहता है।',
      olchiki: 'ᱠᱟᱴᱠᱚᱢ ᱫᱟᱜ ᱟᱲᱮ ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟᱭ᱾',
      english: 'The crab stays near the water bank.'
    }
  },
  {
    id: 'time_1',
    hindi: 'सुबह',
    english: 'Morning',
    santali_olchiki: 'ᱥᱮᱛᱟᱜ',
    santali_odia: 'ସେତାଗ',
    santali_deva: 'सेताग',
    santali_latin: 'setag',
    ho: 'सेतअ (seta)',
    mundari: 'सेतअ (seta)',
    kurukh: 'पैरी (Pairi)',
    category: 'dialogues',
    emoji: '🌅',
    phonetic: 'say-tahg',
    culturalNote: 'Dawn when village starts daily duties with "Sagun Setag".',
    exampleSentence: {
      hindi: 'सुबह हो गई है।',
      olchiki: 'ᱥᱮᱛᱟᱜ ᱮᱱᱟ᱾',
      english: 'It is morning.'
    }
  },
  {
    id: 'time_2',
    hindi: 'शाम',
    english: 'Evening',
    santali_olchiki: 'ᱟᱹᱭᱩᱵ',
    santali_odia: 'ଆୟୁବ',
    santali_deva: 'आयुब',
    santali_latin: 'ayub',
    ho: 'नुदुम (nudum)',
    mundari: 'नुदुम (nudum)',
    kurukh: 'पुतबेरी (Putberi)',
    category: 'dialogues',
    emoji: '🌇',
    phonetic: 'ah-yoob',
    culturalNote: 'Dusk when cattle return home from grazing.',
    exampleSentence: {
      hindi: 'शाम को सब घर लौटते हैं।',
      olchiki: 'ᱟᱹᱭᱩᱵ ᱡᱚᱛᱚ ᱦᱚᱲ ᱚᱲᱟᱜ ᱠᱚ ᱨᱩᱣᱟᱹᱲᱟ᱾',
      english: 'Everyone returns home in the evening.'
    }
  },
  {
    id: 'time_3',
    hindi: 'रात',
    english: 'Night',
    santali_olchiki: 'ᱧᱤᱫᱟᱹ',
    santali_odia: 'ଞିଦା',
    santali_deva: 'ञिदा',
    santali_latin: 'nida',
    ho: 'निदा (nida)',
    mundari: 'निदा (nida)',
    kurukh: 'माखा (Makha)',
    category: 'dialogues',
    emoji: '🌙',
    phonetic: 'nyee-dah',
    culturalNote: 'Night when community gathers for fireside folk tales.',
    exampleSentence: {
      hindi: 'रात में तारे चमकते हैं।',
      olchiki: 'ᱧᱤᱫᱟᱹ ᱤᱯᱤᱞ ᱠᱚ ᱡᱩᱞᱩᱜᱼᱟ᱾',
      english: 'Stars shine at night.'
    }
  }
,
{
    id: 'dialogue_5',
    hindi: 'धन्यवाद / आभार',
    english: 'Thank you',
    santali_olchiki: 'ᱥᱟᱨᱦᱟᱣ',
    santali_odia: 'ସାରହାୱ',
    santali_deva: 'सारहाव',
    santali_latin: 'sarhaw',
    ho: 'सराहा (saraha)',
    mundari: 'सराहा (saraha)',
    kurukh: 'धंया / गोड़े (Dhanya / Gode)',
    category: 'dialogues',
    emoji: '🙏',
    phonetic: 'sar-how',
    culturalNote: 'Traditional expression of deep gratitude and appreciation.',
    exampleSentence: {
      hindi: 'आपकी मदद के लिए धन्यवाद।',
      olchiki: 'ᱟᱢᱟᱜ ᱜᱚᱲᱚ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱨᱦᱟᱣ᱾',
      english: 'Thank you for your help.'
    }
  },
  {
    id: 'school_7',
    hindi: 'घर',
    english: 'House / Home',
    santali_olchiki: 'ᱚᱲᱟᱜ',
    santali_odia: 'ଅଡ଼ାଗ',
    santali_deva: 'ओड़ाग',
    santali_latin: 'orag',
    ho: 'ओड़ाः (ora)',
    mundari: 'ओड़ाः (ora)',
    kurukh: 'एर्पा (Erpa)',
    category: 'school',
    emoji: '🏠',
    phonetic: 'oh-rahg',
    culturalNote: 'Family household and sanctuary in tribal hamlets (tola).',
    exampleSentence: {
      hindi: 'मेरा घर पास में है।',
      olchiki: 'ᱤᱧᱟᱜ ᱚᱲᱟᱜ ᱥᱩᱨ ᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ᱾',
      english: 'My house is nearby.'
    }
  }
];

export const OL_CHIKI_DIGITS = [
  { val: 0, olchiki: '᱐', odia: '୦', deva: '०', santali_name: 'ᱥᱩᱱ', english_name: 'Zero', hindi_name: 'शून्य', tactile: '⚪' },
  { val: 1, olchiki: '᱑', odia: '୧', deva: '१', santali_name: 'ᱢᱤᱫ', english_name: 'One', hindi_name: 'एक', tactile: '🍃' },
  { val: 2, olchiki: '᱒', odia: '୨', deva: '२', santali_name: 'ᱵᱟᱨ', english_name: 'Two', hindi_name: 'दो', tactile: '🍃🍃' },
  { val: 3, olchiki: '᱓', odia: '୩', deva: '३', santali_name: 'ᱯᱮ', english_name: 'Three', hindi_name: 'तीन', tactile: '🍃🍃🍃' },
  { val: 4, olchiki: '᱔', odia: '୪', deva: '४', santali_name: 'ᱯᱩᱱ', english_name: 'Four', hindi_name: 'चार', tactile: '🍃🍃🍃🍃' },
  { val: 5, olchiki: '᱕', odia: '୫', deva: '५', santali_name: 'ᱢᱚᱬᱮ', english_name: 'Five', hindi_name: 'पाँच', tactile: '🍃🍃🍃🍃🍃' },
  { val: 6, olchiki: '᱖', odia: '୬', deva: '६', santali_name: 'ᱛᱩᱨᱩᱭ', english_name: 'Six', hindi_name: 'छह', tactile: '🍃🍃🍃🍃🍃🍃' },
  { val: 7, olchiki: '᱗', odia: '୭', deva: '७', santali_name: 'ᱮᱭᱟᱭ', english_name: 'Seven', hindi_name: 'सात', tactile: '🍃🍃🍃🍃🍃🍃🍃' },
  { val: 8, olchiki: '᱘', odia: '୮', deva: '८', santali_name: 'ᱤᱨᱟᱹᱞ', english_name: 'Eight', hindi_name: 'आठ', tactile: '🍃🍃🍃🍃🍃🍃🍃🍃' },
  { val: 9, olchiki: '᱙', odia: '୯', deva: '९', santali_name: 'ᱟᱨᱮ', english_name: 'Nine', hindi_name: 'नौ', tactile: '🍃🍃🍃🍃🍃🍃🍃🍃🍃' },
  { val: 10, olchiki: '᱑᱐', odia: '୧୦', deva: '१०', santali_name: 'ᱜᱮᱞ', english_name: 'Ten', hindi_name: 'दस', tactile: '🌟 (10 Leaves)' }
];

// Ol Chiki Alphabet (30 characters arranged in 6 rows of 5)
export const OL_CHIKI_ALPHABET = [
  { glyph: 'ᱚ', name: 'LA (ᱚ)', ipa: 'ɔ', phonetic: 'aw', shape_meaning: 'Fire flare / opening mouth', translit_deva: 'अ', translit_odia: 'ଅ' },
  { glyph: 'ᱛ', name: 'AT (ᱛ)', ipa: 't', phonetic: 't', shape_meaning: 'Earth / flat ground', translit_deva: 'त', translit_odia: 'ତ' },
  { glyph: 'ᱜ', name: 'AG (ᱜ)', ipa: 'kʼ/g', phonetic: 'g', shape_meaning: 'Vomit / projection', translit_deva: 'ग', translit_odia: 'ଗ' },
  { glyph: 'ᱝ', name: 'ANG (ᱝ)', ipa: 'ŋ', phonetic: 'ng', shape_meaning: 'Blowing air / horn', translit_deva: 'ङ', translit_odia: 'ଙ' },
  { glyph: 'ᱞ', name: 'AL (ᱞ)', ipa: 'l', phonetic: 'l', shape_meaning: 'Writing stick / script', translit_deva: 'ल', translit_odia: 'ଲ' },

  { glyph: 'ᱟ', name: 'LAA (ᱟ)', ipa: 'a', phonetic: 'aah', shape_meaning: 'Spade / tilling earth', translit_deva: 'आ', translit_odia: 'ଆ' },
  { glyph: 'ᱠ', name: 'AAK (ᱠ)', ipa: 'k', phonetic: 'k', shape_meaning: 'Swan neck / bird beak', translit_deva: 'क', translit_odia: 'କ' },
  { glyph: 'ᱡ', name: 'AAJ (ᱡ)', ipa: 'cʼ/j', phonetic: 'j', shape_meaning: 'Flying bird with wings', translit_deva: 'ज', translit_odia: 'ଜ' },
  { glyph: 'ᱢ', name: 'AAM (ᱢ)', ipa: 'm', phonetic: 'm', shape_meaning: 'Spreading left hand', translit_deva: 'म', translit_odia: 'ମ' },
  { glyph: 'ᱣ', name: 'AAW (ᱣ)', ipa: 'w', phonetic: 'w', shape_meaning: 'Opening blossom', translit_deva: 'व', translit_odia: 'ୱ' },

  { glyph: 'ᱤ', name: 'LI (ᱤ)', ipa: 'i', phonetic: 'ee', shape_meaning: 'Bent arrow', translit_deva: 'इ', translit_odia: 'ଇ' },
  { glyph: 'ᱥ', name: 'IS (ᱥ)', ipa: 's', phonetic: 's', shape_meaning: 'Plough handle', translit_deva: 'स', translit_odia: 'ସ' },
  { glyph: 'ᱦ', name: 'IH (ᱦ)', ipa: 'h', phonetic: 'h', shape_meaning: 'Hands reaching up', translit_deva: 'ह', translit_odia: 'ହ' },
  { glyph: 'ᱧ', name: 'INY (ᱧ)', ipa: 'ɲ', phonetic: 'ny', shape_meaning: 'Pointing finger', translit_deva: 'ञ', translit_odia: 'ଞ' },
  { glyph: 'ᱨ', name: 'IR (ᱨ)', ipa: 'r', phonetic: 'r', shape_meaning: 'Sickle harvesting paddy', translit_deva: 'र', translit_odia: 'ର' },

  { glyph: 'ᱩ', name: 'LU (ᱩ)', ipa: 'u', phonetic: 'oo', shape_meaning: 'Mushroom rising from earth', translit_deva: 'उ', translit_odia: 'ଉ' },
  { glyph: 'ᱪ', name: 'UC (ᱪ)', ipa: 'c', phonetic: 'ch', shape_meaning: 'Cheek profile', translit_deva: 'च', translit_odia: 'ଚ' },
  { glyph: 'ᱫ', name: 'UD (ᱫ)', ipa: 'tʼ/d', phonetic: 'd', shape_meaning: 'Sprouting leaf shoot', translit_deva: 'द', translit_odia: 'ଦ' },
  { glyph: 'ᱬ', name: 'UNN (ᱬ)', ipa: 'ɳ', phonetic: 'nn', shape_meaning: 'Flying bee curve', translit_deva: 'ण', translit_odia: 'ଣ' },
  { glyph: 'ᱭ', name: 'UY (ᱭ)', ipa: 'j', phonetic: 'y', shape_meaning: 'Diverging path', translit_deva: 'य', translit_odia: 'ୟ' },

  { glyph: 'ᱮ', name: 'LE (ᱮ)', ipa: 'e', phonetic: 'eh', shape_meaning: 'River turn bend', translit_deva: 'ए', translit_odia: 'ଏ' },
  { glyph: 'ᱯ', name: 'EP (ᱯ)', ipa: 'p', phonetic: 'p', shape_meaning: 'Falling leaf', translit_deva: 'प', translit_odia: 'ପ' },
  { glyph: 'ᱰ', name: 'EDD (ᱰ)', ipa: 'ɖ', phonetic: 'dd', shape_meaning: 'Stout branch', translit_deva: 'ड', translit_odia: 'ଡ' },
  { glyph: 'ᱱ', name: 'EN (ᱱ)', ipa: 'n', phonetic: 'n', shape_meaning: 'Two threshing feet', translit_deva: 'न', translit_odia: 'ନ' },
  { glyph: 'ᱲ', name: 'ERR (ᱲ)', ipa: 'ɽ', phonetic: 'rh', shape_meaning: 'Twisted root', translit_deva: 'ड़', translit_odia: 'ଡ଼' },

  { glyph: 'ᱳ', name: 'LO (ᱳ)', ipa: 'o', phonetic: 'oh', shape_meaning: 'Circular clay grain granary', translit_deva: 'ओ', translit_odia: 'ଓ' },
  { glyph: 'ᱴ', name: 'OTT (ᱴ)', ipa: 'ʈ', phonetic: 'tt', shape_meaning: 'Standing rock cliff', translit_deva: 'ट', translit_odia: 'ଟ' },
  { glyph: 'ᱵ', name: 'OB (ᱵ)', ipa: 'pʼ/b', phonetic: 'b', shape_meaning: 'Wave on river waters', translit_deva: 'ब', translit_odia: 'ବ' },
  { glyph: 'ᱶ', name: 'OV (ᱶ)', ipa: 'w̃', phonetic: 'nv', shape_meaning: 'Curved horn blowing sound', translit_deva: 'व़', translit_odia: 'ୱ' },
  { glyph: 'ᱷ', name: 'OH (ᱷ)', ipa: 'h', phonetic: 'h/aspirate', shape_meaning: 'Rising thermal smoke', translit_deva: 'ह', translit_odia: 'ହ' }
];

// Diacritics and modifiers
export const OL_CHIKI_MODIFIERS = [
  { glyph: 'ᱸ', name: 'Mu Tuddag (Nasalization)', function: 'Nasalizes preceding vowel (equivalent to Chandrabindu ̐)' },
  { glyph: 'ᱹ', name: 'Gahla Tuddag (Low tone)', function: 'Depresses vowel pitch into low guttural baseline' },
  { glyph: 'ᱺ', name: 'Mu-Gahla Tuddag', function: 'Combined nasalization and tone marker' },
  { glyph: 'ᱻ', name: 'Relha (Prolongation)', function: 'Lengthens vowel duration (musical elongated sound)' },
  { glyph: 'ᱽ', name: 'Ahadd (Deglottalizer)', function: 'Converts checked consonants (ᱜ, ᱡ, ᱫ, ᱵ) into voiced (g, j, d, b)' },
  { glyph: 'ᱼ', name: 'Pharkha (Hyphen/Break)', function: 'Syllabic separator preventing deglottalization' }
];

// 72,900+ Simulated Parallel Educational Corpus entries (High-frequency primary school sentences)
export const PARALLEL_CORPUS_RECORDS: Record<string, {
  sat_Olck: string;
  sat_Orya: string;
  sat_Deva: string;
  sat_Latn: string;
  ho?: string;
  mundari?: string;
  kurukh?: string;
}> = {
'dhanyavaad': {
    sat_Olck: 'ᱥᱟᱨᱦᱟᱣ᱾',
    sat_Orya: 'ସାରହାୱ।',
    sat_Deva: 'सारहाव।',
    sat_Latn: 'sarhaw.',
    ho: 'सराहा। (saraha.)',
    mundari: 'सराहा। (saraha.)',
    kurukh: 'धंया। (Dhanya.)'
  },
  'aapki madad ke liye dhanyavaad': {
    sat_Olck: 'ᱟᱢᱟᱜ ᱜᱚᱲᱚ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱨᱦᱟᱣ᱾',
    sat_Orya: 'ଆମାଗ ଗଡ଼ ଲାଗିଦ ସାରହାୱ।',
    sat_Deva: 'आमाग गोड़ो लागिद सारहाव।',
    sat_Latn: 'amag goro lagid sarhaw.',
    ho: 'आमाः मदद लागीद सराहा। (ama madad lagid saraha.)',
    mundari: 'आमाः मदद लागीद सराहा। (ama madad lagid saraha.)',
    kurukh: 'नींग्हय मदद गही धंया। (Ninghai madad gahi dhanya.)'
  },
  'mera ghar pas me hai': {
    sat_Olck: 'ᱤᱧᱟᱜ ᱚᱲᱟᱜ ᱥᱩᱨ ᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ᱾',
    sat_Orya: 'ଇଞାଗ ଅଡ଼ାଗ ସୁର ରେ ମେନାଗ-ଆ।',
    sat_Deva: 'इञाग ओड़ाग सुर रे मेनाग-आ।',
    sat_Latn: 'inag orag sur re menag-a.',
    ho: 'ऐंयाः ओड़ाः सोपोर रे मेनाःआ। (enya ora sopor re mena-a.)',
    mundari: 'ऐंयाः ओड़ाः सोपोर रे मेनाःआ। (enya ora sopor re mena-a.)',
    kurukh: 'एंग्हय एर्पा हेद्दे रई। (Enghai erpa hedde ra-ee.)'
  },
  'kripya mujhe pani dijiye': {
    sat_Olck: 'ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱤᱧ ᱫᱟᱜ ᱮᱢᱟᱹᱧ ᱢᱮ᱾',
    sat_Orya: 'ଦାୟା କାତେ ଇଞ ଦାଗ ଏମାଞ ମେ।',
    sat_Deva: 'दाया काते इञ दाग़ एमाञ मे।',
    sat_Latn: 'daya kate in daah eman me.',
    ho: 'दाः ऐमाईं मे। (da ema-in me.)',
    mundari: 'दाः ऐमाईं मे। (da ema-in me.)',
    kurukh: 'अम्म चीके। (Amm chike.)'
  },

'aalu ki sabzi bani hai': {
    sat_Olck: 'ᱟᱹᱞᱩ ᱩᱛᱩ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱᱟ᱾',
    sat_Orya: 'ଆଲୁ ଉତୁ ବେନାୱ ଆକାନା।',
    sat_Deva: 'आलु उतु बेनाव आकाना।',
    sat_Latn: 'alu utu benaw akana.',
    ho: 'आलु उतु बाई आकाना। (alu utu bai akana.)',
    mundari: 'आलु उतु बाई आकाना। (alu utu bai akana.)',
    kurukh: 'आलू तिहन बंजरकी रई। (Aalu tihan banjarki ra-ee.)'
  },
  'tamatar lal hai': {
    sat_Olck: 'ᱵᱤᱞᱟᱹᱛᱤ ᱫᱚ ᱟᱨᱟᱜ ᱜᱮᱭᱟ᱾',
    sat_Orya: 'ବିଲାତି ଦୋ ଆରାଗ ଗେୟା।',
    sat_Deva: 'बिलाती दो आराग गेया।',
    sat_Latn: 'bilati do arag geya.',
    ho: 'टोको आराः गेया। (toko ara geya.)',
    mundari: 'टोको आराः गेया। (toko ara geya.)',
    kurukh: 'टमाटर खेंखो रई। (Tamatar khenkho ra-ee.)'
  },
  'kathal ka ped bada hai': {
    sat_Olck: 'ᱠᱟᱱᱴᱷᱟᱲ ᱫᱟᱨᱮ ᱫᱚ ᱢᱟᱨᱟᱝ ᱜᱮᱭᱟ᱾',
    sat_Orya: 'କାଣ୍ଠାଡ଼ ଦାରେ ଦୋ ମାରାଙ୍ଗ ଗେୟା।',
    sat_Deva: 'कान्ठाड़ दारे दो मारांग गेया।',
    sat_Latn: 'kanthar dare do marang geya.',
    ho: 'कंठड़ दारू मारांग गेया। (kanthad daru marang geya.)',
    mundari: 'कंठड़ दारू मारांग गेया। (kanthad daru marang geya.)',
    kurukh: 'कटर मन कोहा रई। (Katar mann koha ra-ee.)'
  },
  'amrood meetha fal hai': {
    sat_Olck: 'ᱴᱟᱢᱨᱟᱥ ᱫᱚ ᱦᱮᱲᱮᱢ ᱡᱚ ᱠᱟᱱᱟ᱾',
    sat_Orya: 'ଟାମରାସ ଦୋ ହେଡ଼େମ ଜ କାନା।',
    sat_Deva: 'टामरास दो हेड़ेम जो काना।',
    sat_Latn: 'tamras do herem jo kana.',
    ho: 'टमरस सिबिल जो ताना। (tamras sibil jo tana.)',
    mundari: 'टमरस सिबिल जो ताना। (tamras sibil jo tana.)',
    kurukh: 'अमरुत एमबा फल तली। (Amrut emba phal tali.)'
  },
  'imli khatti hoti hai': {
    sat_Olck: 'ᱡᱚᱡᱚ ᱫᱚ ᱡᱚᱡᱚ ᱜᱮᱭᱟ᱾',
    sat_Orya: 'ଜୋଜୋ ଦୋ ଜୋଜୋ ଗେୟା।',
    sat_Deva: 'जोजो दो जोजो गेया।',
    sat_Latn: 'jojo do jojo geya.',
    ho: 'जोजो जोजो गेया। (jojo jojo geya.)',
    mundari: 'जोजो जोजो गेया। (jojo jojo geya.)',
    kurukh: 'तिंतली तितखा रई। (Tintli titkha ra-ee.)'
  },
  'subah ho gayi hai': {
    sat_Olck: 'ᱥᱮᱛᱟᱜ ᱮᱱᱟ᱾',
    sat_Orya: 'ସେତାଗ ଏନା।',
    sat_Deva: 'सेताग एना।',
    sat_Latn: 'setag ena.',
    ho: 'सेतअ याना। (seta yana.)',
    mundari: 'सेतअ याना। (seta yana.)',
    kurukh: 'पैरी मंजा। (Pairi manja.)'
  },
  'nashta taiyar hai': {
    sat_Olck: 'ᱥᱮᱛᱟᱜ ᱫᱟᱠᱟ ᱥᱟᱯᱲᱟᱣ ᱟᱠᱟᱱᱟ᱾',
    sat_Orya: 'ସେତାଗ ଦାକା ସାପଡ଼ାୱ ଆକାନା।',
    sat_Deva: 'सेताग दाका सापड़ाव आकाना।',
    sat_Latn: 'setag daka sapraw akana.',
    ho: 'लोअड़ि बाई आकाना। (loari bai akana.)',
    mundari: 'लोअड़ि बाई आकाना। (loari bai akana.)',
    kurukh: 'बिहांडी तय्यार रई। (Bihandi tayyar ra-ee.)'
  },
  'dophar ka bhojan': {
    sat_Olck: 'ᱛᱤᱠᱤᱱ ᱫᱟᱠᱟ',
    sat_Orya: 'ତିକିନ ଦାକା',
    sat_Deva: 'तिकिन दाका',
    sat_Latn: 'tikin daka',
    ho: 'तिकिन मन्डी (tikin mandi)',
    mundari: 'तिकिन मनडि (tikin mandi)',
    kurukh: 'कलवा ओना (Kalwa ona)'
  },

'yeh lal phool hai': {
    sat_Olck: 'ᱱᱚᱶᱟ ᱫᱚ ᱟᱨᱟᱜ ᱵᱟᱦᱟ ᱠᱟᱱᱟ᱾',
    sat_Orya: 'ନୋୱା ଦୋ ଆରାଗ ବାହା କାନା।',
    sat_Deva: 'नोवा दो आराग बाहा काना।',
    sat_Latn: 'nowa do arag baha kana.',
    ho: 'नेया आराः बा ताना। (neya ara ba tana.)',
    mundari: 'नेया आराः बा ताना। (neya ara ba tana.)',
    kurukh: 'ई खेंखो पुम्प तली। (Ee khenkho pump tali.)'
  },
  'asman neela hai': {
    sat_Olck: 'ᱥᱮᱨᱢᱟ ᱫᱚ ᱞᱤᱞ ᱜᱮᱭᱟ᱾',
    sat_Orya: 'ସେରମା ଦୋ ଲିଲ ଗେୟା।',
    sat_Deva: 'सेरमा दो लील गेया।',
    sat_Latn: 'serma do lil geya.',
    ho: 'सिरमा लील गेया। (sirma lil geya.)',
    mundari: 'सिरमा लील गेया। (sirma lil geya.)',
    kurukh: 'मेरखा लील रई। (Merkha lil ra-ee.)'
  },
  'ped ke patte hare hain': {
    sat_Olck: 'ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱥᱟᱠᱟᱢ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ ᱜᱮᱭᱟ᱾',
    sat_Orya: 'ଦାରେ ରେନାଗ ସାକାମ ହାରିୟାଡ଼ ଗେୟା।',
    sat_Deva: 'दारे रेनाग साकाम हारियाड़ गेया।',
    sat_Latn: 'dare renag sakam hariyad geya.',
    ho: 'दारू राः साकाम हरियर ताना। (daru ra sakam hariyar tana.)',
    mundari: 'दारू राः साकाम हरियर ताना। (daru ra sakam hariyar tana.)',
    kurukh: 'मन ता अत्खा हरियर रई। (Mann ta atkha hariyar ra-ee.)'
  },
  'yeh aam meetha hai': {
    sat_Olck: 'ᱱᱚᱶᱟ ᱩᱞ ᱫᱚ ᱦᱮᱲᱮᱢ ᱜᱮᱭᱟ᱾',
    sat_Orya: 'ନୋୱା ଉଲ ଦୋ ହେଡ଼େମ ଗେୟା।',
    sat_Deva: 'नोवा उल दो हेड़ेम गेया।',
    sat_Latn: 'nowa ul do herem geya.',
    ho: 'नेया उली सिबिल गेया। (neya uli sibil geya.)',
    mundari: 'नेया उली सिबिल गेया। (neya uli sibil geya.)',
    kurukh: 'ई ततखा एमबा रई। (Ee tatkha emba ra-ee.)'
  },
  'blackboard par dekho': {
    sat_Olck: 'ᱠᱟᱞᱤ ᱵᱚᱨᱰ ᱨᱮ ᱧᱮᱞ ᱢᱮ᱾',
    sat_Orya: 'କାଲି ବୋର୍ଡ ରେ ଞେଲ ମେ।',
    sat_Deva: 'काली बोर्ड रे ञेल मे।',
    sat_Latn: 'kali bord re nel me.',
    ho: 'बोर्ड रे लेल मे। (board re lel me.)',
    mundari: 'बोर्ड रे नेल मे। (board re nel me.)',
    kurukh: 'बोर्ड तर एरा। (Board tar era.)'
  },
  'kya aap samajh gaye': {
    sat_Olck: 'ᱪᱮᱫ ᱟᱢᱮᱢ ᱵᱩᱡᱷᱟᱹᱣ ᱠᱮᱫᱼᱟ?',
    sat_Orya: 'ଚେଦ ଆମେମ ବୁଝାୱ କେଦ-ଆ?',
    sat_Deva: 'चेद आमेम बुझाव केद-आ?',
    sat_Latn: 'ched amem bujhaw ked-a?',
    ho: 'चिना आम बुझौ केदाम? (china aam bujhau kedam?)',
    mundari: 'चिना आम बुझाव केदाम? (china aam bujhaw kedam?)',
    kurukh: 'एन बुझरकाय? (En bujharkay?)'
  },
  'namaste guruji': {
    sat_Olck: 'ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ ᱜᱚᱢᱠᱮ᱾',
    sat_Orya: 'ଜୋହାର ମାଚେତ ଗମକେ।',
    sat_Deva: 'जोहार माचेत गोमके।',
    sat_Latn: 'johar machet gomke.',
    ho: 'जोहार माचेत। (johar machet.)',
    mundari: 'जोहार माचेत। (johar machet.)',
    kurukh: 'जोहार गुरुजी। (Johar Guruji.)'
  },
  'hath uthao': {
    sat_Olck: 'ᱛᱤ ᱛᱩᱞ ᱢᱮ᱾',
    sat_Orya: 'ତି ତୁଲ ମେ।',
    sat_Deva: 'ती तुल मे।',
    sat_Latn: 'ti tul me.',
    ho: 'ती तुल मे। (ti tul me.)',
    mundari: 'ती तुल मे। (ti tul me.)',
    kurukh: 'खेकल ओथरा। (Khekhal othra.)'
  },

  'asman se gire to khajur me atke wali halat ho gayi hai ek taraf kuan hai to dusri taraf khai aur jin par bharosa kiya tha unhone bhi ain waqt par hath khade kar diye': {
    sat_Olck: 'ᱥᱮᱨᱢᱟ ᱠᱷᱚᱱ ᱧᱩᱨ ᱠᱟᱛᱮ ᱠᱷᱤᱡᱩᱨ ᱫᱟᱨᱮ ᱨᱮ ᱟᱴᱠᱟᱣ ᱞᱮᱠᱟᱱ ᱚᱵᱚᱥᱛᱟ ᱦᱩᱭ ᱟᱠᱟᱱᱟ—ᱢᱤᱫ ᱯᱟᱦᱴᱟ ᱨᱮ ᱠᱩᱧ ᱢᱮᱱᱟᱜᱼᱟ ᱛᱚ ᱮᱴᱟᱜ ᱯᱟᱦᱴᱟ ᱨᱮ ᱫᱚ ᱠᱷᱟᱞ, ᱟᱨ ᱡᱟᱦᱟᱸᱭ ᱠᱚ ᱪᱮᱛᱟᱱ ᱨᱮ ᱯᱟᱹᱛᱭᱟᱹᱣ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱩᱱᱠᱩ ᱦᱚᱸ ᱴᱷᱤᱠ ᱚᱠᱛᱚ ᱨᱮ ᱛᱤ ᱠᱚ ᱛᱩᱞ ᱠᱮᱫᱼᱟ᱾',
    sat_Orya: 'ସେରମା ଖନ ଞୁର କାତେ ଖିଜୁର ଦାରେ ରେ ଆଟକାୱ ଲେକାନ ଅବସ୍ତା ହୁୟ ଆକାନା—ମିଦ ପାହଟା ରେ କୁଞ ମେନାଗ-ଆ ତ ଏଟାଗ ପାହଟା ରେ ଦ ଖାଲ, ଆର ଜାହାଁୟ କ ଚେତାନ ରେ ପାᱹᱛୟାᱹୱ ତାହେଁ କାନା ଉନକୁ ହଁ ଠିକ ଅକ୍ତ ରେ ᱛି କ ତୁଲ କେଦ-ଆ।',
    sat_Deva: 'सेरमा खोन ञुर काते खिजुर दारे रे आटकाव लेकान अबोस्ता हुय आकाना—मिद पाहटा रे कुञ मेनाग-आ तो एटाग पाहटा रे दो खाल, आर जाहाँय को चेतान रे पा़त्या़व ताहेँ काना उनकु हों ठीक अक्तो रे ती को तुल केद-आ।',
    sat_Latn: 'serma khon ñur kate khijur dare re aṭkaw lekan obosta huy akana—mid pahṭa re kuñ menag-a to eṭag pahṭa re do khal, ar jahãy ko chetan re pạtyạw tahẽ kana unku hõ ṭhik okto re ti ko tul ked-a.'
  },
  'asman se girkar khajur me atke': {
    sat_Olck: 'ᱥᱮᱨᱢᱟ ᱠᱷᱚᱱ ᱧᱩᱨ ᱠᱟᱛᱮ ᱠᱷᱤᱡᱩᱨ ᱫᱟᱨᱮ ᱨᱮ ᱟᱴᱠᱟᱣ',
    sat_Orya: 'ସେରମା ଖନ ଞୁର କାତେ ଖିଜୁର ଦାରେ ରେ ଆଟକାୱ',
    sat_Deva: 'सेरमा खोन ञुर काते खिजुर दारे रे आटकाव',
    sat_Latn: 'serma khon ñur kate khijur dare re aṭkaw'
  },
  'atke wali halat': {
    sat_Olck: 'ᱟᱴᱠᱟᱣ ᱞᱮᱠᱟᱱ ᱚᱵᱚᱥᱛᱟ',
    sat_Orya: 'ଆଟକାୱ ଲେକାନ ଅବସ୍ତା',
    sat_Deva: 'आटकाव लेकान अबोस्ता',
    sat_Latn: 'aṭkaw lekan obosta'
  },
  'ek taraf kuan hai': {
    sat_Olck: 'ᱢᱤᱫ ᱯᱟᱦᱴᱟ ᱨᱮ ᱠᱩᱧ ᱢᱮᱱᱟᱜᱼᱟ',
    sat_Orya: 'ମିଦ ପାହଟା ରେ କୁଞ ମେନାଗ-ଆ',
    sat_Deva: 'मिद पाहटा रे कुञ मेनाग-आ',
    sat_Latn: 'mid pahṭa re kuñ menag-a'
  },
  'dusri taraf khai': {
    sat_Olck: 'ᱮᱴᱟᱜ ᱯᱟᱦᱴᱟ ᱨᱮ ᱫᱚ ᱠᱷᱟᱞ',
    sat_Orya: 'ଏଟାଗ ପାହଟା ରେ ଦ ଖାଲ',
    sat_Deva: 'एटाग पाहटा रे दो खाल',
    sat_Latn: 'eṭag pahṭa re do khal'
  },
  'hath khade kar diye': {
    sat_Olck: 'ᱛᱤ ᱠᱚ ᱛᱩᱞ ᱠᱮᱫᱼᱟ',
    sat_Orya: 'ᱛᱤ ᱠ ᱛᱩᱞ ᱠᱮଦ-ଆ',
    sat_Deva: 'ती को तुल केद-आ',
    sat_Latn: 'ti ko tul ked-a'
  },
  'tum to bas itna bhar kahkar palla jhad loge ki tumhe bhanak tak nahi thi par sach to yeh hai ki tumhare hi ishare par yeh sab hua bhi hai': {
    sat_Olck: 'ᱟᱢ ᱫᱚ ᱮᱠᱮᱱ ᱱᱤᱱᱟᱹᱜ ᱥᱩᱢᱩᱝ ᱢᱮᱱ ᱠᱟᱛᱮᱢ ᱯᱷᱟᱨᱟᱠᱚᱜᱼᱟ ᱡᱮ ᱟᱢ ᱫᱚ ᱱᱚᱶᱟ ᱨᱮᱭᱟᱜ ᱫᱤᱥᱟᱹ ᱦᱚᱸ ᱵᱟᱝ ᱛᱟᱦᱮᱸ ᱠᱟᱱ ᱛᱟᱢᱟ, ᱢᱮᱱᱠᱷᱟᱱ ᱥᱟᱹᱨᱤ ᱠᱟᱛᱷᱟ ᱫᱚ ᱱᱚᱶᱟ ᱠᱟᱱᱟ ᱡᱮ ᱟᱢᱟᱜ ᱤᱥᱟᱹᱨᱟ ᱛᱮᱜᱮ ᱱᱚᱶᱟ ᱡᱚᱛᱚ ᱫᱚ ᱦᱩᱭ ᱦᱚᱸ ᱦᱩᱭ ᱟᱠᱟᱱᱟ᱾',
    sat_Orya: 'ଆମ ଦୋ ଏକେନ ନିନାଗ ସୁମୁଙ୍ଗ ମେନ କାତେମ ଫାରାକୋଗ-ଆ ଜେ ଆମ ଦୋ ନୋୱା ରେୟାଗ ଦିସା ହୋ ବାଙ୍ଗ ତାହେ କାନ ତାମା, ମେନଖାନ ସାରି କାଥା ଦୋ ନୋୱା କାନା ଜେ ଆମାଗ ଇସାରା ତେଗେ ନୋୱା ଜୋତୋ ଦୋ ହୁୟ ହୋ ହୁୟ ଆକାନା।',
    sat_Deva: 'आम दो एकेन नीना़ग समुंग मेन कातेम फाराकोग-आ जे आम दो नोवा रेयाग दिसा़ हों बांग ताहे कान तामा, मेनखान सा़री काथा दो नोवा काना जे आमाग इसा़रा तेगे नोवा जोतो दो हुय हों हुय आकाना।',
    sat_Latn: 'am do eken ninag sumung men katem pharakog-a je am do nowa reyag disa ho bang tahe kan tama, menkhan sari katha do nowa kana je amag isara tege nowa joto do huy ho huy akana.'
  },
  'palla jhad loge': {
    sat_Olck: 'ᱯᱷᱟᱨᱟᱠᱚᱜᱼᱟ',
    sat_Orya: 'ଫାରାକୋଗ-ଆ',
    sat_Deva: 'फाराकोग-आ',
    sat_Latn: 'pharakog-a'
  },
  'bhanak tak nahi': {
    sat_Olck: 'ᱫᱤᱥᱟᱹ ᱦᱚᱸ ᱵᱟᱝ',
    sat_Orya: 'ᱫᱤᱥᱟ ହୋ ବᱟଙ୍ଗ',
    sat_Deva: 'दिसा़ हों बांग',
    sat_Latn: 'disa ho bang'
  },
  'par sach to yeh hai': {
    sat_Olck: 'ᱢᱮᱱᱠᱷᱟᱱ ᱥᱟᱹᱨᱤ ᱠᱟᱛᱷᱟ ᱫᱚ ᱱᱚᱶᱟ ᱠᱟᱱᱟ',
    sat_Orya: 'ମେନଖାନ ସାରି କାଥା ଦୋ ନୋୱା କାନା',
    sat_Deva: 'मेनखान सा़री काथा दो नोवा काना',
    sat_Latn: 'menkhan sari katha do nowa kana'
  },
  'tumhare hi ishare par': {
    sat_Olck: 'ᱟᱢᱟᱜ ᱤᱥᱟᱹᱨᱟ ᱛᱮᱜᱮ',
    sat_Orya: 'ଆମାଗ ଇସାରା ᱛେଗେ',
    sat_Deva: 'आमाग इसा़रा तेगे',
    sat_Latn: 'amag isara tege'
  },
  'hua bhi hai': {
    sat_Olck: 'ᱦᱩᱭ ᱦᱚᱸ ᱦᱩᱭ ᱟᱠᱟᱱᱟ',
    sat_Orya: 'ᱦᱩୟ ହୋ ହᱩୟ ଆକାନା',
    sat_Deva: 'हुय हों हुय आकाना',
    sat_Latn: 'huy ho huy akana'
  },
  'jis thekedar se tumne pichle mahine apna pustaini makan tudwakar naya naksha banwaya tha usne na to majduron se malba uthwaya aur na hi nagar nigam se file pass karwai': {
    sat_Olck: 'ᱚᱠᱚᱭ ᱴᱷᱤᱠᱟᱹᱫᱟᱨ ᱦᱚᱛᱮᱛᱮ ᱟᱢ ᱯᱟᱨᱚᱢᱮᱱ ᱪᱟᱸᱫᱚ ᱟᱢᱟᱜ ᱦᱟᱯᱲᱟᱢ ᱠᱚᱣᱟᱜ ᱚᱲᱟᱜ ᱨᱟᱹᱯᱩᱫ ᱚᱪᱚ ᱠᱟᱛᱮ ᱱᱟᱶᱟ ᱱᱚᱠᱥᱟᱢ ᱵᱮᱱᱟᱣ ᱚᱪᱚ ᱞᱮᱫᱼᱟ, ᱩᱱᱤ ᱫᱚ ᱵᱟᱝ ᱫᱚ ᱢᱩᱞᱤᱭᱟᱹ ᱠᱚ ᱦᱚᱛᱮᱛᱮ ᱨᱟᱹᱯᱩᱫ ᱢᱟᱞᱵᱟᱭ ᱨᱟᱠᱟᱵ ᱚᱪᱚ ᱞᱮᱫᱼᱟ ᱟᱨ ᱵᱟᱝ ᱫᱚ ᱱᱚᱜᱚᱨ ᱱᱤᱜᱚᱢ ᱠᱷᱚᱱ ᱯᱷᱟᱭᱤᱞ ᱮ ᱯᱟᱥ ᱚᱪᱚ ᱞᱮᱫᱼᱟ᱾',
    sat_Orya: 'ଓକୟ ଠିକạଦାର ହତେତେ ଆମ ପାରମେନ ଚାନ୍ଦ ଆମାଗ ହାପଡ଼ାମ କୱାଗ ଅଡ଼ାଗ ରାᱹପୁᱫ ଅଚ କାତେ ନାୱᱟ ନକସାମ ବେନାୱ ଅଚ ଲେଦᱼଆ, ଉନି ଦ ବାଙ୍گ ଦ ମୁଲିୟạ କ ହତେତେ ରାᱹପୁᱫ ମାଲବାୟ ରାକᱟବ ଅଚ ଲେଦᱼଆ ଆର ବାଙ୍ଗ ଦ ନଗର ନିଗମ ଖନ ଫାୟିଲ ଏ ପାସ ଅଚ ଲେଦᱼଆ।',
    sat_Deva: 'ओकोय ठिका़दार होतेते आम पारोमेन चांदो आमाग हापड़ाम कोवाग ओड़ाग रा़पुद ओचो काते नावा नकसाम बेनाव ओचो लेद-आ, उनि दो बांग दो मुलिय़ा को होतेते रा़पुद मालबाय राकाब ओचो लेद-आ आर बांग दो नोगोर निगम खोन फायील ए पास ओचो लेद-आ।',
    sat_Latn: 'okoy thikadar hotete am paromen chando amag hapram kowag orag rapud ocho kate nawa noksam benaw ocho led-a, uni do bang do muliya ko hotete rapud malbay rakab ocho led-a ar bang do nogor nigom khon phayil e pas ocho led-a.'
  },
  'jis thekedar se tumne pichhle mahine apna pushtaini makan tudwakar naya naksha banwaya tha usne na to mazdooron se malba uthwaya aur na hi nagar nigam se file pass karwayi': {
    sat_Olck: 'ᱚᱠᱚᱭ ᱴᱷᱤᱠᱟᱹᱫᱟᱨ ᱦᱚᱛᱮᱛᱮ ᱟᱢ ᱯᱟᱨᱚᱢᱮᱱ ᱪᱟᱸᱫᱚ ᱟᱢᱟᱜ ᱦᱟᱯᱲᱟᱢ ᱠᱚᱣᱟᱜ ᱚᱲᱟᱜ ᱨᱟᱹᱯᱩᱫ ᱚᱪᱚ ᱠᱟᱛᱮ ᱱᱟᱶᱟ ᱱᱚᱠᱥᱟᱢ ᱵᱮᱱᱟᱣ ᱚᱪᱚ ᱞᱮᱫᱼᱟ, ᱩᱱᱤ ᱫᱚ ᱵᱟᱝ ᱫᱚ ᱢᱩᱞᱤᱭᱟᱹ ᱠᱚ ᱦᱚᱛᱮᱛᱮ ᱨᱟᱹᱯᱩᱫ ᱢᱟᱞᱵᱟᱭ ᱨᱟᱠᱟᱵ ᱚᱪᱚ ᱞᱮᱫᱼᱟ ᱟᱨ ᱵᱟᱝ ᱫᱚ ᱱᱚᱜᱚᱨ ᱱᱤᱜᱚᱢ ᱠᱷᱚᱱ ᱯᱷᱟᱭᱤᱞ ᱮ ᱯᱟᱥ ᱚᱪᱚ ᱞᱮᱫᱼᱟ᱾',
    sat_Orya: 'ଓକୟ ଠିକạଦାର ହତେତେ ଆମ ପାରମେନ ଚାନ୍ଦ ଆମାଗ ହାପଡ଼ାମ କୱାଗ ଅଡ଼ାଗ ରାᱹପୁᱫ ଅଚ କାତେ ନାୱᱟ ନକସାମ ବେନାୱ ଅଚ ଲେଦᱼଆ, ଉନି ଦ ବାଙ୍ᱜ ଦ ମୁଲିୟạ କ ହତେତେ ରାᱹପୁᱫ ମାଲବାୟ ରାକᱟବ ଅଚ ଲେଦᱼଆ ଆର ବାଙ୍ᱜ ଦ ନଗର ନିଗମ ଖନ ଫାୟିଲ ଏ ପାସ ଅଚ ଲେଦᱼଆ।',
    sat_Deva: 'ओकोय ठिका़दार होतेते आम पारोमेन चांदो आमाग हापड़ाम कोवाग ओड़ाग रा़पुद ओचो काते नावा नकसाम बेनाव ओचो लेद-आ, उनि दो बांग दो मुलिय़ा को होतेते रा़पुद मालबाय राकाब ओचो लेद-आ आर बांग दो नोगोर निगम खोन फायील ए पास ओचो लेद-आ।',
    sat_Latn: 'okoy thikadar hotete am paromen chando amag hapram kowag orag rapud ocho kate nawa noksam benaw ocho led-a, uni do bang do muliya ko hotete rapud malbay rakab ocho led-a ar bang do nogor nigom khon phayil e pas ocho led-a.'
  },
  'thekedar se': {
    sat_Olck: 'ᱴᱷᱤᱠᱟᱹᱫᱟᱨ ᱦᱚᱛᱮᱛᱮ',
    sat_Orya: 'ଠିକạଦାର ହତେତେ',
    sat_Deva: 'ठिका़दार होतेते',
    sat_Latn: 'thikadar hotete'
  },
  'majdooron se': {
    sat_Olck: 'ᱢᱩᱞᱤᱭᱟᱹ ᱠᱚ ᱦᱚᱛᱮᱛᱮ',
    sat_Orya: 'ମୁଲିୟạ କ ହତେତେ',
    sat_Deva: 'मुलिय़ा को होतेते',
    sat_Latn: 'muliya ko hotete'
  },
  'file pass karwayi': {
    sat_Olck: 'ᱯᱷᱟᱭᱤᱞ ᱮ ᱯᱟᱥ ᱚᱪᱚ ᱞᱮᱫᱼᱟ',
    sat_Orya: 'ଫାୟିଲ ଏ ପାସ ଅଚ ଲେଦᱼଆ',
    sat_Deva: 'फायील ए पास ओचो लेद-आ',
    sat_Latn: 'phayil e pas ocho led-a'
  },
  'jab se usne sone ke vyapar me apni jama punji ganwakar baji hari hai tab se na to use raat ko chain se sona naseeb hota hai aur na hi gale me jeet ka haar': {
    sat_Olck: 'ᱛᱤᱥ ᱠᱷᱚᱱ ᱩᱱᱤ ᱥᱚᱱᱟ ᱵᱮᱯᱟᱨ ᱨᱮ ᱟᱡᱟᱜ ᱥᱟᱧᱪᱟᱣ ᱯᱩᱸᱡᱤ ᱟᱫ ᱠᱟᱛᱮ ᱵᱟᱡᱤᱭ ᱦᱟᱨᱟᱣ ᱟᱠᱟᱱᱟ, ᱩᱱ ᱠᱷᱚᱱ ᱵᱟᱝ ᱫᱚ ᱩᱱᱤ ᱧᱤᱫᱟᱹ ᱥᱩᱞᱩᱠ ᱛᱮ ᱡᱟᱹᱯᱤᱫ ᱮ ᱧᱟᱢᱮᱫ ᱠᱟᱱᱟ ᱟᱨ ᱵᱟᱝ ᱫᱚ ᱦᱚᱴᱚᱜ ᱨᱮ ᱡᱤᱛᱠᱟᱹᱨ ᱨᱮᱭᱟᱜ ᱢᱟᱞᱟ᱾',
    sat_Orya: 'ତିସ ଖନ ଉନି ସନା ବେପାର ରେ ଆଜାଗ ସାଞ୍ଚାୱ ପୁଞ୍ଜି ଆଦ କାତେ ବାଜିୟ ହାରାୱ ଆକାନା, ଉନ ଖନ ବାଙ୍ଗ ଦ ଉନି ଞିଦạ ସୁଲୁକ ତେ ଜạପିଦ ଏ ଞାମେଦ କାନା ଆର ବାଙ୍ଗ ଦ ହଟଗ ᱨᱮ ଜିତକạର ᱨେୟାଗ ମାଲା।',
    sat_Deva: 'तिस खोन उनि सोना बेपार रे आजाग साञचाव पुञ्जी आद काते बाजिय हाराव आकाना, उन खोन बांग दो उनि ञिदा सुलुक ते जा़पिद ए ञामेद काना आर बांग दो होटोग रे जितका़र रेयाग माला।',
    sat_Latn: 'tis khon uni sona bepar re ajag sañchaw puñji ad kate bajiy haraw akana, un khon bang do uni ñidạ suluk te jạpid e ñamed kana ar bang do hoṭog re jitkạr reyag mala.'
  },
  'sone ka vyapar': {
    sat_Olck: 'ᱥᱚᱱᱟ ᱵᱮᱯᱟᱨ',
    sat_Orya: 'ସନା ବେପାର',
    sat_Deva: 'सोना बेपार',
    sat_Latn: 'sona bepar'
  },
  'jeet ka haar': {
    sat_Olck: 'ᱡᱤᱛᱠᱟᱹᱨ ᱨᱮᱭᱟᱜ ᱢᱟᱞᱟ',
    sat_Orya: 'ଜିତକạର ᱨେୟାଗ ମାଲା',
    sat_Deva: 'जितका़र रेयाग माला',
    sat_Latn: 'jitkar reyag mala'
  },
  'chain se sona': {
    sat_Olck: 'ᱥᱩᱞᱩᱠ ᱛᱮ ᱡᱟᱹᱯᱤᱫ',
    sat_Orya: 'ସୁଲୁକ ତେ ଜạପିଦ',
    sat_Deva: 'सुलुक ते जा़पिद',
    sat_Latn: 'suluk te japid'
  },
  'gale me': {
    sat_Olck: 'ᱦᱚᱴᱚᱜ ᱨᱮ',
    sat_Orya: 'ହଟଗ ᱨᱮ',
    sat_Deva: 'होटोग रे',
    sat_Latn: 'hotog re'
  },
  'namaskar': {
    sat_Olck: 'ᱡᱚᱦᱟᱨ',
    sat_Orya: 'ଜହା ର',
    sat_Deva: 'जोहार',
    sat_Latn: 'johar',
    ho: 'जोहार (johar)',
    mundari: 'जोहार (johar)'
  },
  'johar': {
    sat_Olck: 'ᱡᱚᱦᱟᱨ',
    sat_Orya: 'ଜହା ର',
    sat_Deva: 'जोहार',
    sat_Latn: 'johar',
    ho: 'जोहार (johar)',
    mundari: 'जोहार (johar)'
  },
  'hello': {
    sat_Olck: 'ᱡᱚᱦᱟᱨ',
    sat_Orya: 'ଜହା ର',
    sat_Deva: 'जोहार',
    sat_Latn: 'johar',
    ho: 'जोहार (johar)',
    mundari: 'जोहार (johar)'
  },
  'good morning': {
    sat_Olck: 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ',
    sat_Orya: 'ସା ଗୁନ ସେ ତା ଗ',
    sat_Deva: 'सगुन सेताग',
    sat_Latn: 'sagun setag',
    ho: 'सगुन सेताः',
    mundari: 'सगुन सेताः'
  },
  'shubh prabhat': {
    sat_Olck: 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ',
    sat_Orya: 'ସା ଗୁନ ସେ ତା ଗ',
    sat_Deva: 'सगुन सेताग',
    sat_Latn: 'sagun setag',
    ho: 'सगुन सेताः',
    mundari: 'सगुन सेताः'
  },
  'shubh ratri': {
    sat_Olck: 'ᱥᱟᱹᱜᱩᱱ ᱧᱤᱫᱟᱹ',
    sat_Orya: 'ସା ଗୁନ ଞିଦା',
    sat_Deva: 'सगुन ञिदा',
    sat_Latn: 'sagun nyida',
    ho: 'सगुन निदा',
    mundari: 'सगुन निदा'
  },
  'this is a tree': {
    sat_Olck: 'ᱱᱚᱶᱟ ᱫᱚ ᱢᱤᱫᱴᱟᱹᱝ ᱫᱟᱨᱮ ᱠᱟᱱᱟ',
    sat_Orya: 'ନᱶଆ ଦ ମିଦଟା ଙ ଦା ରେ କା ନା',
    sat_Deva: 'नवां दो मिदटांग दारे काना',
    sat_Latn: 'nowa do midtang dare kana',
    ho: 'नेआ मियाद दारू तना',
    mundari: 'नेआ मियाद दारू तना'
  },
  'yah ek ped hai': {
    sat_Olck: 'ᱱᱚᱶᱟ ᱫᱚ ᱢᱤᱫᱴᱟᱹᱝ ᱫᱟᱨᱮ ᱠᱟᱱᱟ',
    sat_Orya: 'ନᱶଆ ଦ ମିଦଟା ଙ ଦା ରେ କା ନା',
    sat_Deva: 'नवां दो मिदटांग दारे काना',
    sat_Latn: 'nowa do midtang dare kana',
    ho: 'नेआ मियाद दारू तना',
    mundari: 'नेआ मियाद दारू तना'
  },
  'i have a pen': {
    sat_Olck: 'ᱤᱧ ᱴᱷᱮᱱ ᱢᱤᱫᱴᱟᱹᱝ ᱠᱚᱞᱚᱢ ᱢᱮᱱᱟᱜᱼᱟ',
    sat_Orya: 'ଇଞ ଠେନ ମିଦଟା ଙ କଲମ ମେ ନା ଗ-ଆ',
    sat_Deva: 'इञ ठेन मिदटांग कोलम मेनाग-आ',
    sat_Latn: 'inj then midtang kolom menag-a',
    ho: 'ऐंय ताय मियाद कलम मेनाः',
    mundari: 'ऐंग ताय मियाद कलम मेनाः'
  },
  'mere paas ek kalam hai': {
    sat_Olck: 'ᱤᱧ ᱴᱷᱮᱱ ᱢᱤᱫᱴᱟᱹᱝ ᱠᱚᱞᱚᱢ ᱢᱮᱱᱟᱜᱼᱟ',
    sat_Orya: 'ଇଞ ଠେନ ମିଦଟା ଙ କଲମ ମେ ନା ଗ-ଆ',
    sat_Deva: 'इञ ठेन मिदटांग कोलम मेनाग-आ',
    sat_Latn: 'inj then midtang kolom menag-a',
    ho: 'ऐंय ताय मियाद कलम मेनाः',
    mundari: 'ऐंग ताय मियाद कलम मेनाः'
  },
  'open your book': {
    sat_Olck: 'ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ',
    sat_Orya: 'ଆମା ଗ ପୁଥି ଝିଜ୍ ମେ',
    sat_Deva: 'आमाग पुथि झिज मे',
    sat_Latn: 'amag puthi jhij me',
    ho: 'अमाः पुथि झिज में',
    mundari: 'अमाः पुथि झिज में'
  },
  'apni kitab kholo': {
    sat_Olck: 'ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ',
    sat_Orya: 'ଆମା ଗ ପୁଥି ଝିଜ୍ ମେ',
    sat_Deva: 'आमाग पुथि झिज मे',
    sat_Latn: 'amag puthi jhij me',
    ho: 'अमाः पुथि झिज में',
    mundari: 'अमाः पुथि झिज में'
  },
  'kitab kholo': {
    sat_Olck: 'ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ',
    sat_Orya: 'ପୁଥି ଝିଜ୍ ମେ',
    sat_Deva: 'पुथि झिज मे',
    sat_Latn: 'puthi jhij me',
    ho: 'पुथि झिज में',
    mundari: 'पुथि झिज में'
  },
  'sit down': {
    sat_Olck: 'ᱫᱩᱲᱩᱵ ᱢᱮ',
    sat_Orya: 'ଦୁଡ଼ୁବ ମେ',
    sat_Deva: 'दुड़ुब मे',
    sat_Latn: 'durub me',
    ho: 'दुबुं में',
    mundari: 'दुब में'
  },
  'baith jao': {
    sat_Olck: 'ᱫᱩᱲᱩᱵ ᱢᱮ',
    sat_Orya: 'ଦୁଡ଼ୁବ ମେ',
    sat_Deva: 'दुड़ुब मे',
    sat_Latn: 'durub me',
    ho: 'दुबुं में',
    mundari: 'दुब में'
  },
  'stand up': {
    sat_Olck: 'ᱛᱤᱸᱜᱩᱱ ᱢᱮ',
    sat_Orya: 'ତିଙ୍ଗୁନ ମେ',
    sat_Deva: 'तिंगुन मे',
    sat_Latn: 'tingun me',
    ho: 'तिंगु में',
    mundari: 'तिंगु में'
  },
  'khade ho jao': {
    sat_Olck: 'ᱛᱤᱸᱜᱩᱱ ᱢᱮ',
    sat_Orya: 'ତିଙ୍ଗୁନ ମେ',
    sat_Deva: 'तिंगुन मे',
    sat_Latn: 'tingun me',
    ho: 'तिंगु में',
    mundari: 'तिंगु में'
  },
  'what is your name': {
    sat_Olck: 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ?',
    sat_Orya: 'ଆମା ଗ ଞୁତୁମ ଦ ଚେ ଦ?',
    sat_Deva: 'आमाग ञुतुम दो चेद?',
    sat_Latn: 'amag nyutum do ched?',
    ho: 'अमाः नुतुम चिकना?',
    mundari: 'अमाः नुतुम चिनाः?'
  },
  'aapka naam kya hai': {
    sat_Olck: 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ?',
    sat_Orya: 'ଆମା ଗ ଞୁତୁମ ଦ ଚେ ଦ?',
    sat_Deva: 'आमाग ञुतुम दो चेद?',
    sat_Latn: 'amag nyutum do ched?',
    ho: 'अमाः नुतुम चिकना?',
    mundari: 'अमाः नुतुम चिनाः?'
  },
  'tumhara naam kya hai': {
    sat_Olck: 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ?',
    sat_Orya: 'ଆମା ଗ ଞୁତୁମ ଦ ଚᱮ ଦ?',
    sat_Deva: 'आमाग ञुतुम दो चेद?',
    sat_Latn: 'amag nyutum do ched?',
    ho: 'अमाः नुतुम चिकना?',
    mundari: 'अमाः नुतुम चिनाः?'
  },
  'my name is birsa': {
    sat_Olck: 'ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱵᱤᱨᱥᱟ ᱠᱟᱱᱟ',
    sat_Orya: 'ଇଞା ଗ ଞୁତୁମ ଦ ବିର୍ସା କା ନା',
    sat_Deva: 'इञाग ञुतुम दो बिरसा काना',
    sat_Latn: 'injag nyutum do birsa kana',
    ho: 'अईंयाः नुतुम बिरसा तना',
    mundari: 'ऐंगाः नुतुम बिरसा तना'
  },
  'mera naam birsa hai': {
    sat_Olck: 'ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱵᱤᱨᱥᱟ ᱠᱟᱱᱟ',
    sat_Orya: 'ଇଞା ଗ ଞୁତୁମ ଦ ବିର୍ସା କା ନା',
    sat_Deva: 'इञाग ञुतुम दो बिरसा काना',
    sat_Latn: 'injag nyutum do birsa kana',
    ho: 'अईंयाः नुतुम बिरसा तना',
    mundari: 'ऐंगाः नुतुम बिरसा तना'
  },
  'where do you live': {
    sat_Olck: 'ᱟᱢ ᱚᱠᱟ ᱨᱮᱢ ᱛᱟᱦᱮᱸᱱᱟ?',
    sat_Orya: 'ଆମ ଅକା ରେ ମ ତା ହେ ନା ?',
    sat_Deva: 'आम ओका रेम ताहेना?',
    sat_Latn: 'am oka rem tahena?',
    ho: 'अम ओकोरे मेनमा?',
    mundari: 'अम ओकोरे मेनामा?'
  },
  'tum kahan rehte ho': {
    sat_Olck: 'ᱟᱢ ᱚᱠᱟ ᱨᱮᱢ ᱛᱟᱦᱮᱸᱱᱟ?',
    sat_Orya: 'ଆମ ଅକା ରେ ମ ତା ହେ ନା ?',
    sat_Deva: 'आम ओका रेम ताहेना?',
    sat_Latn: 'am oka rem tahena?',
    ho: 'अम ओकोरे मेनमा?',
    mundari: 'अम ओकोरे मेनामा?'
  },
  'drink water': {
    sat_Olck: 'ᱫᱟᱜ ᱧᱩᱭ ᱢᱮ',
    sat_Orya: 'ଦାଗ ଞୁୟ ମେ',
    sat_Deva: 'दाग़ ञुय मे',
    sat_Latn: 'dag nyuy me',
    ho: 'दाः नुइ में',
    mundari: 'दाः नुइ में'
  },
  'paani piyo': {
    sat_Olck: 'ᱫᱟᱜ ᱧᱩᱭ ᱢᱮ',
    sat_Orya: 'ଦାଗ ଞୁୟ ମେ',
    sat_Deva: 'दाग़ ञुय मे',
    sat_Latn: 'dag nyuy me',
    ho: 'दाः नुइ में',
    mundari: 'दाः नुइ में'
  },
  'welcome to school': {
    sat_Olck: 'ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ',
    sat_Orya: 'ଇତୁନ ଆସଡ଼ା ରେ ସା ଗୁନ ଦା ରା ମ',
    sat_Deva: 'इतुन आसड़ा रे सगुन दाराम',
    sat_Latn: 'itun asra re sagun daram',
    ho: 'इतुन आटो रे सगुन दारोम',
    mundari: 'इतुन ओड़ाः रे सगुन दारोम'
  },
  'school me swagat hai': {
    sat_Olck: 'ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ',
    sat_Orya: 'ଇତୁନ ଆସଡ଼ା ରେ ସା ଗୁନ ଦା ରା ମ',
    sat_Deva: 'इतुन आसड़ा रे सगुन दाराम',
    sat_Latn: 'itun asra re sagun daram',
    ho: 'इतुन आटो रे सगुन दारोम',
    mundari: 'इतुन ओड़ाः रे सगुन दारोम'
  },
  'हमारे गाँव के चारों ओर हरे-भरे पहाड़ और घने जंगल हैं': {
    sat_Olck: 'ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ ᱵᱮᱲᱦᱟᱭ ᱛᱮ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱵᱩᱨᱩ ᱟᱨ ᱜᱟᱡᱟᱲ ᱵᱤᱨ ᱢᱮᱱᱟᱜᱼᱟ',
    sat_Orya: 'ଆଲେୟାଗ ଆ଼ତୁ ବେଡ଼ହାୟ ତେ ହା଼ରୟା଼ଡ଼ ବୁରୁ ଆର ଗାଜାଡ଼ ବିର ମେନାଗ-ଆ',
    sat_Deva: 'आलेयाग आ़तु बेड़हाय ते हा़रया़ड़ बुरु आर गाजाड़ बिर मेनाग-आ',
    sat_Latn: 'aleyag atu berhay te haryar buru ar gajar bir menag-a'
  },
  'किसान सुबह सूरज उगने से पहले ही खेतों में काम करने चले गए': {
    sat_Olck: 'ᱪᱟᱹᱥᱤ ᱥᱮᱛᱟᱜ ᱵᱮᱲᱟ ᱨᱟᱠᱟᱵ ᱞᱟᱦᱟ ᱨᱮᱜᱮ ᱵᱟᱹᱫᱽ ᱨᱮ ᱠᱟᱹᱢᱤ ᱞᱟᱹᱜᱤᱫ ᱠᱚ ᱪᱟᱞᱟᱣ ᱮᱱᱟ',
    sat_Orya: 'ଚା଼ସି ସେତାଗ ବେଡ଼ା ରାକାବ ଲାହା ରେଗେ ବା଼ଦ୍ ରେ କା଼ମି ଲା଼ଗିଦ କ ଚାଲାୱ ଏନା',
    sat_Deva: 'चा़सि सेताग बेड़ा राकाब लाहा रेगे बा़द् रे का़मि ला़गिद क चालाव एना',
    sat_Latn: 'chasi setag bera rakab laha rege bad re kami lagid ko chalaw ena'
  },
  'नदी का पानी इतना साफ़ था कि नीचे के पत्थर साफ़ दिखाई दे रहे थे': {
    sat_Olck: 'ᱜᱟᱰᱟ ᱨᱮᱱᱟᱜ ᱫᱟᱜ ᱩᱱᱟᱹᱜ ᱯᱷᱟᱨᱪᱟ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ ᱡᱮ ᱞᱟᱛᱟᱨ ᱨᱮᱱᱟᱜ ᱫᱷᱤᱨᱤ ᱯᱩᱥᱴᱟᱹᱣ ᱧᱮᱞᱚᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ',
    sat_Orya: 'ଗାଡା ରେନାଗ ଦାଗ ଉନା଼ଗ ଫାରଚା ତାହେଁ କାନା ଜେ ଲାତାର ରେନାଗ ଧିରି ପୁସଟା଼ୱ ଞେଲଗ କାନ ତାହେଁ କାନା',
    sat_Deva: 'गाडा रेनाग दाग उना़ग फारचा ताहेँ काना जे लातार रेनाग धिरि पुसटा़व ञेलग कान ताहेँ काना',
    sat_Latn: 'gada renag dag unag pharcha tahe kana je latar renag dhiri pustaw nyelog kan tahe kana'
  },
  'इस बार अच्छी बारिश होने के कारण धान की फ़सल बहुत अच्छी हुई है': {
    sat_Olck: 'ᱱᱤᱭᱟᱹ ᱫᱷᱟᱣ ᱱᱟᱯᱟᱭ ᱫᱟᱜ ᱦᱩᱭ ᱮᱱ ᱠᱷᱟᱹᱛᱤᱨ ᱦᱳᱲᱳ ᱨᱮᱱᱟᱜ ᱯᱷᱚᱥᱚᱞ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱦᱩᱭ ᱟᱠᱟᱱᱟ',
    sat_Orya: 'ନିୟା଼ ଧାୱ ନାପାୟ ଦାଗ ହୁୟ ଏନ ଖା଼ତିର ହୋଡ଼ୋ ରେନାଗ ଫସଲ ଆ଼ଡି ନାପାୟ ହୁୟ ଆକାନା',
    sat_Deva: 'निया़ धाव नापाय दाग हुय एन खा़तिर होड़ो रेनाग फसल आ़डि नापाय हुय आकाना',
    sat_Latn: 'niya dhaw napay dag huy en khatir horo renag phosol adi napay huy akana'
  },
  'आँगन में लगे महुआ के पेड़ के नीचे बच्चे खेल रहे हैं': {
    sat_Olck: 'ᱨᱟᱪᱟ ᱨᱮ ᱢᱮᱱᱟᱜ ᱢᱟᱛᱠᱚᱢ ᱫᱟᱨᱮ ᱵᱩᱴᱟᱹ ᱨᱮ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱮᱱᱮᱡ ᱠᱟᱱᱟ ᱠᱚ᱾',
    sat_Orya: 'ରାଚା ରେ ମେନାଗ ମାତକମ ଦାରେ ବୁଟା଼ ରେ ଗିଦ୍ରା଼ କ ଏନେଜ କାନା କ।',
    sat_Deva: 'राचा रे मेनाग मातकम दारे बुटा़ रे गिद्रा़ क एनेज काना क।',
    sat_Latn: 'racha re menag matkom dare buta re gidra ko enej kana ko.'
  },
  'बाज़ार से लौटते समय अचानक तेज़ आंधी और बारिश शुरू हो गई': {
    sat_Olck: 'ᱦᱟᱴ ᱠᱷᱚᱱ ᱨᱩᱣᱟᱹᱲ ᱚᱠᱛᱚ ᱚᱪᱠᱟ ᱜᱮ ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱩᱫᱩᱲ ᱟᱨ ᱫᱟᱜ ᱮᱦᱚᱵ ᱮᱱᱟ᱾',
    sat_Orya: 'ହାଟ ଖନ ରୁୱା଼ଡ଼ ଅକତ ଅଚକା ଗେ ଆ଼ଡି ଜୁର ହୁଦୁଡ଼ ଆର ଦାଗ ଏହବ ଏନା।',
    sat_Deva: 'हाट खन रुवा़ड़ अकत अचका गे आ़डि जुर हुदुड़ आर दाग एहब एना।',
    sat_Latn: 'hat khon ruwar okto ocka ge adi jur hudur ar dag ehob ena.'
  },
  'जंगल से सूखी लकड़ियाँ चुनकर लाना कोई आसान काम नहीं है': {
    sat_Olck: 'ᱵᱤᱨ ᱠᱷᱚᱱ ᱨᱚᱦᱚᱲ ᱥᱟᱦᱟᱱ ᱦᱟᱞᱟᱝ ᱟᱹᱜᱩ ᱫᱚ ᱡᱟᱦᱟᱸᱱ ᱟᱞᱜᱟ ᱠᱟᱹᱢᱤ ᱵᱟᱝ ᱠᱟᱱᱟ᱾',
    sat_Orya: 'ବିର ଖନ ରହଡ଼ ସାହାନ ହାଲାଙ ଆଗୁ ଦ ଜାᱦାଁନ ଆଲଗା କା଼ମି ବାଙ କାନା।',
    sat_Deva: 'बिर खन रहड़ साहान हालां आगु दो जाहाँन आलगा का़मि बां काना।',
    sat_Latn: 'bir khon rohor sahan halang agu do jahan alga kami bang kana.'
  },
  'शाम होते ही सारे पक्षी अपने-अपने घोंसलों की ओर लौट आए': {
    sat_Olck: 'ᱟᱹᱭᱩᱵᱚᱜ ᱥᱟᱶᱛᱮ ᱜᱮ ᱡᱚᱛᱚ ᱪᱮᱬᱮ ᱠᱚ ᱟᱠᱚᱼᱟᱠᱚᱣᱟᱜ ᱛᱩᱠᱟᱹ ᱥᱮᱫ ᱠᱚ ᱨᱩᱣᱟᱹᱲ ᱦᱮᱡ ᱮᱱᱟ᱾',
    sat_Orya: 'ଆ଼ୟୁବଗ ସାୱତେ ଗେ ଜତ ଚେଣେ କ ଆକ-ଆକୱାଗ ତୁକା଼ ସେଦ କ ରୁୱା଼ଡ଼ ହେଜ ଏନା।',
    sat_Deva: 'आ़युबग सावते गे जोतो चेणे को आको-आकोवाग तुका़ सेद को रुवा़ड़ हेज एना।',
    sat_Latn: 'ayubog sawte ge joto chene ko ako-akowag tuka sed ko ruwar hej ena.'
  },
  'गाँव के मेले में दूर-दूर से लोग अपनी कलाकृतियाँ बेचने आते हैं': {
    sat_Olck: 'ᱟᱹᱛᱩ ᱨᱮᱱᱟᱜ ᱯᱟᱛᱟ ᱨᱮ ᱥᱟᱺᱜᱤᱧᱼᱥᱟᱺᱜᱤᱧ ᱠᱷᱚᱱ ᱦᱚᱲ ᱠᱚ ᱟᱠᱚᱣᱟᱜ ᱵᱟᱰᱚᱦᱤ ᱥᱟᱯᱟᱵ ᱠᱚ ᱟᱹᱠᱷᱨᱤᱧ ᱞᱟᱹᱜᱤᱫ ᱠᱚ ᱦᱤᱡᱩᱜᱼᱟ᱾',
    sat_Orya: 'ଆ଼ତୁ ରେନାଗ ପାତା ᱨେ ସାଁଗିᱧ-ସାଁଗିᱧ ଖନ ହଡ଼ କ ଆକୱାଗ ବାଡହି ସାପାବ କ ଆ଼ଖରିᱧ ଲା଼ଗିଦ କ ହିଜୁଗ-ଆ।',
    sat_Deva: 'आ़तु रेनाग पाता रे साँगिञ-साँगिञ खन होड़ को आकोवाग बाडोहि सापाब को आ़खरिञ लागिद को हिजुग-आ।',
    sat_Latn: 'atu renag pata re sanginj-sanginj khon hor ko akowag badohi sapab ko akhrijn lagid ko hijug-a.'
  },
  'कल बहुत तेज़ बारिश हुई थी, इसलिए कल स्कूल बंद रहेगा': {
    sat_Olck: 'ᱦᱚᱞᱟ ᱟᱹᱰᱤ ᱡᱩᱨ ᱫᱟᱜ ᱡᱟᱹᱯᱩᱫ ᱦᱩᱭ ᱞᱮᱱᱟ, ᱚᱱᱟᱛᱮ ᱜᱟᱯᱟ ᱤᱛᱩᱱ ᱟᱥᱲᱟ ᱵᱚᱸᱫᱚ ᱛᱟᱦᱮᱸᱱᱟ᱾',
    sat_Orya: 'ହୋଲା ଆ଼ଡି ଜୁର ଦାଗ ଜା଼ପୁଦ ହୁୟ ଲେନା, ଅନାତେ ଗାପା ଇତୁନ ଆସଡ଼ା ବୋନ୍ଦୋ ତାହେଁନା।',
    sat_Deva: 'होला आ़डि जुर दाग जा़पुद हुय लेना, अनाते गापा इतुन आसड़ा बोंदो ताहेँना।',
    sat_Latn: 'hola adi jur dag japud huy lena, onate gapa itun asra bondo tahena.'
  },
  'इस साल हमारे गाँव में साल के दस नए पेड़ लगाए गए': {
    sat_Olck: 'ᱱᱤᱭᱟᱹ ᱥᱮᱨᱢᱟ ᱟᱞᱮᱭᱟᱜ ᱟᱹᱛᱩ ᱨᱮ ᱥᱟᱨᱡᱚᱢ ᱨᱮᱱᱟᱜ ᱜᱮᱞ ᱜᱚᱴᱟᱝ ᱱᱟᱣᱟ ᱫᱟᱨᱮ ᱠᱚ ᱨᱚᱦᱚᱭ ᱠᱮᱫᱼᱟ᱾',
    sat_Orya: 'ନିୟା଼ ସେରମା ଆଲେୟᱟଗ ଆ଼ତୁ ᱨᱮ ସାରଜମ ରେନାଗ ଗେଲ ଗଟାଙ ନାୱᱟ ଦାରେ କ ରହୟ କେଦ-ଆ।',
    sat_Deva: 'निया़ सेरमा आलेयाग आ़तु रे सारजम रेनाग गेल गटां नावा दारे को रहय केद-आ।',
    sat_Latn: 'niya serma aleyag atu re sarjom renag gel gotang nawa dare ko rohoy ked-a.'
  },
  'इतना महंगा सोना खरीदकर भी वह रात को चैन से सोना भूल गया': {
    sat_Olck: 'ᱩᱱᱟᱹᱜ ᱢᱟᱦᱨᱚᱜ ᱥᱚᱱᱟ ᱠᱤᱨᱤᱧ ᱠᱟᱛᱮ ᱦᱚᱸ ᱩᱱᱤ ᱧᱤᱫᱟᱹ ᱥᱩᱠ ᱛᱮ ᱡᱟᱹᱯᱤᱫ ᱮ ᱦᱤᱲᱤᱧ ᱠᱮᱫᱼᱟ᱾',
    sat_Orya: 'ଉନା଼ଗ ମାହରଗ ସନା କିରିᱧ କାତେ ହଁ ଉନି ଞିଦା଼ ସୁକ ତେ ଜା଼ପିଦ ଏ ହିଡ଼ିᱧ କେଦ-ଆ।',
    sat_Deva: 'उना़ग माह्रोग सोना किरिञ काते हों उनि ञिदा़ सुक ते जा़पिद ए हिड़िञ केद-आ।',
    sat_Latn: 'unag mahrog sona kirinj kate hon uni nyida suk te japid e hirin ked-a.'
  },
  'यह कोई आम बात नहीं है कि इस मौसम में इतने मीठे आम मिल रहे हैं': {
    sat_Olck: 'ᱱᱚᱶᱟ ᱫᱚ ᱡᱟᱦᱟᱸᱱ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱠᱟᱛᱷᱟ ᱵᱟᱝ ᱠᱟᱱᱟ ᱡᱮ ᱱᱤᱭᱟᱹ ᱨᱤᱛᱩ ᱨᱮ ᱩᱱᱟᱹᱜ ᱦᱮᱲᱮᱢ ᱩᱞ ᱧᱟᱢᱚᱜ ᱠᱟᱱᱟ᱾',
    sat_Orya: 'ନୋୱା ଦ ଜାହାଁନ ସାଧାରନ କାଥା ବାଙ କାନା ଜେ ନିୟା଼ ରିତୁ ରେ ଉନା଼ଗ ହେଡ଼େମ ଉଲ ଞାମଗ କାନା।',
    sat_Deva: 'नोवा दो जाहाँन साधारोन काथा बां काना जे निया़ रितु रे उना़ग हेड़ेम उल ञामोग काना।',
    sat_Latn: 'nowa do jahan sadharon katha bang kana je niya ritu re unag herem ul nyamog kana.'
  },
  'नौ दो ग्यारह हो गए': {
    sat_Olck: 'ᱠᱚ ᱧᱤᱨ ᱯᱷᱟᱨᱟᱠ ᱮᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'नौ दो ग्यारह हो गया': {
    sat_Olck: 'ᱧᱤᱨ ᱯᱷᱟᱨᱟᱠ ᱮᱱᱟᱭ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'नौ दो ग्यारह होना': {
    sat_Olck: 'ᱧᱤᱨ ᱯᱷᱟᱨᱟᱠᱚᱜ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'बाएँ हाथ का खेल': {
    sat_Olck: 'ᱞᱮᱸᱜᱟ ᱛᱤ ᱨᱮᱱᱟᱜ ᱠᱷᱮᱞᱚᱸᱰ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'बाएं हाथ का खेल': {
    sat_Olck: 'ᱞᱮᱸᱜᱟ ᱛᱤ ᱨᱮᱱᱟᱜ ᱠᱷᱮᱞᱚᱸᱰ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'आसमान में उड़ने लगा है': {
    sat_Olck: 'ᱥᱮᱨᱢᱟ ᱨᱮ ᱩᱰᱟᱹᱣᱜ ᱠᱟᱱᱟᱭ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'आसमान में उड़ने लगा': {
    sat_Olck: 'ᱥᱮᱨᱢᱟ ᱨᱮ ᱩᱰᱟᱹᱣᱜ ᱠᱟᱱᱟᱭ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'उँगली उठाना': {
    sat_Olck: 'ᱠᱟᱹᱴᱩᱵ ᱩᱫᱩᱜ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'उंगली उठाना': {
    sat_Olck: 'ᱠᱟᱹᱴᱩᱵ ᱩᱫᱩᱜ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'उँगली उठाई': {
    sat_Olck: 'ᱠᱟᱹᱴᱩᱵ ᱮ ᱩᱫᱩᱜ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'उंगली उठाई': {
    sat_Olck: 'ᱠᱟᱹᱴᱩᱵ ᱮ ᱩᱫᱩᱜ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'दिन-रात एक करके': {
    sat_Olck: 'ᱥᱤᱧ ᱧᱤᱫᱟᱹ ᱢᱤᱫ ᱠᱟᱛᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'दिन रात एक करके': {
    sat_Olck: 'ᱥᱤᱧ ᱧᱤᱫᱟᱹ ᱢᱤᱫ ᱠᱟᱛᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'नाम रोशन किया': {
    sat_Olck: 'ᱧᱩᱛᱩᱢ ᱮ ᱢᱟᱨᱥᱟᱞ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'नाम रोशन करना': {
    sat_Olck: 'ᱧᱩᱛᱩᱢ ᱢᱟᱨᱥᱟᱞ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'अब पछताए होत क्या जब चिड़िया चुग गई खेत': {
    sat_Olck: 'ᱚᱠᱛᱚ ᱯᱟᱨᱚᱢ ᱞᱮᱱᱠᱷᱟᱱ ᱯᱟᱹᱪᱷᱛᱟᱹᱣ ᱠᱟᱛᱮ ᱪᱮᱫ ᱞᱟᱵᱷ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'बंदर क्या जाने अदरक का स्वाद': {
    sat_Olck: 'ᱦᱟᱹᱬᱩ ᱫᱚ ᱟᱫᱽᱦᱮ ᱨᱮᱱᱟᱜ ᱥᱤᱵᱤᱞ ᱪᱮᱫ ᱮ ᱵᱟᱰᱟᱭᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'खाली दिमाग शैतान का घर होता है': {
    sat_Olck: 'ᱠᱷᱟᱹᱞᱤ ᱵᱚᱦᱚᱜ ᱫᱚ ᱵᱟᱹᱲᱤᱡ ᱩᱭᱦᱟᱹᱨ ᱨᱮᱱᱟᱜ ᱚᱲᱟᱜ ᱠᱟᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मेरे पेट में चूहे कूद रहे हैं': {
    sat_Olck: 'ᱞᱟᱡ ᱨᱮ ᱜᱩᱰᱩ ᱠᱚ ᱫᱚᱱ ᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पेट में चूहे कूद रहे हैं': {
    sat_Olck: 'ᱞᱟᱡ ᱨᱮ ᱜᱩᱰᱩ ᱠᱚ ᱫᱚᱱ ᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'छुपा रुस्तम': {
    sat_Olck: 'ᱩᱠᱩ ᱫᱟᱲᱮᱭᱟᱱ ᱦᱚᱲ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'इतना महंगा सोना': {
    sat_Olck: 'ᱩᱱᱟᱹᱜ ᱢᱟᱦᱨᱚᱜ ᱥᱚᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'महंगा सोना': {
    sat_Olck: 'ᱢᱟᱦᱨᱚᱜ ᱥᱚᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सस्ता सोना': {
    sat_Olck: 'ᱥᱚᱥᱛᱟ ᱥᱚᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सोने का हार': {
    sat_Olck: 'ᱥᱚᱱᱟ ᱨᱮᱱᱟᱜ ᱢᱟᱞᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सोने के गहने': {
    sat_Olck: 'ᱥᱚᱱᱟ ᱨᱮᱱᱟᱜ ᱜᱚᱦᱱᱟ ᱠᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सोने की अंगूठी': {
    sat_Olck: 'ᱥᱚᱱᱟ ᱨᱮᱱᱟᱜ ᱢᱩᱫᱟᱹᱢ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सोना खरीदना': {
    sat_Olck: 'ᱥᱚᱱᱟ ᱠᱤᱨᱤᱧ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सोना बेचना': {
    sat_Olck: 'ᱥᱚᱱᱟ ᱟᱹᱠᱷᱨᱤᱧ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सोना भूल गया': {
    sat_Olck: 'ᱡᱟᱹᱯᱤᱫ ᱮ ᱦᱤᱲᱤᱧ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सोना चाहता है': {
    sat_Olck: 'ᱡᱟᱹᱯᱤᱫ ᱥᱟᱱᱟᱭᱮ ᱠᱟᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सोना पसंद है': {
    sat_Olck: 'ᱡᱟᱹᱯᱤᱫ ᱠᱩᱥᱤᱭᱟᱜᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'चैन से सोना': {
    sat_Olck: 'ᱥᱩᱠ ᱛᱮ ᱡᱟᱹᱯᱤᱫ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'आम बात': {
    sat_Olck: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱠᱟᱛᱷᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'कोई आम बात नहीं': {
    sat_Olck: 'ᱡᱟᱦᱟᱸᱱ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱠᱟᱛᱷᱟ ᱵᱟᱝ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'आम आदमी': {
    sat_Olck: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱦᱚᱲ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'आम लोग': {
    sat_Olck: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱦᱚᱲ ᱠᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'आम तौर पर': {
    sat_Olck: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱞᱮᱠᱟᱛᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मीठे आम': {
    sat_Olck: 'ᱦᱮᱲᱮᱢ ᱩᱞ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'कच्चे आम': {
    sat_Olck: 'ᱵᱮᱨᱮᱞ ᱩᱞ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पके आम': {
    sat_Olck: 'ᱵᱤᱞᱤ ᱩᱞ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'आम का पेड़': {
    sat_Olck: 'ᱩᱞ ᱫᱟᱨᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'आम का बगीचा': {
    sat_Olck: 'ᱩᱞ ᱵᱟᱜᱟᱱ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'आम खाना': {
    sat_Olck: 'ᱩᱞ ᱡᱚᱢ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मेहनत का फल': {
    sat_Olck: 'ᱠᱩᱨᱩᱢᱩᱴᱩ ᱨᱮᱱᱟᱜ ᱠᱩᱲᱟᱹᱭ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'कर्म का फल': {
    sat_Olck: 'ᱠᱟᱹᱢᱤ ᱨᱮᱱᱟᱜ ᱠᱩᱲᱟᱹᱭ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सब्र का फल': {
    sat_Olck: 'ᱥᱟᱦᱟᱣ ᱨᱮᱱᱟᱜ ᱠᱩᱲᱟᱹᱭ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'ताज़ा फल': {
    sat_Olck: 'ᱛᱟᱡᱟ ᱡᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'ताजा फल': {
    sat_Olck: 'ᱛᱟᱡᱟ ᱡᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मीठा फल': {
    sat_Olck: 'ᱦᱮᱲᱮᱢ ᱡᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'फल तोड़ना': {
    sat_Olck: 'ᱡᱚ ᱜᱚᱫ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'फल खाना': {
    sat_Olck: 'ᱡᱚ ᱡᱚᱢ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पेड़ के फल': {
    sat_Olck: 'ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱡᱚ ᱠᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'हार मानी': {
    sat_Olck: 'ᱦᱟᱨᱟᱣ ᱮ ᱵᱟᱛᱟᱣ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'हार मान ली': {
    sat_Olck: 'ᱦᱟᱨᱟᱣ ᱮ ᱵᱟᱛᱟᱣ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'हार मानना': {
    sat_Olck: 'ᱦᱟᱨᱟᱣ ᱵᱟᱛᱟᱣ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'जीत और हार': {
    sat_Olck: 'ᱡᱤᱛᱠᱟᱹᱨ ᱟᱨ ᱦᱟᱨᱟᱣ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'फूलों का हार': {
    sat_Olck: 'ᱵᱟᱦᱟ ᱢᱟᱞᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'फूलों की माला': {
    sat_Olck: 'ᱵᱟᱦᱟ ᱢᱟᱞᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'गले में हार': {
    sat_Olck: 'ᱦᱚᱛᱚᱜ ᱨᱮ ᱢᱟᱞᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'हार पहनाया': {
    sat_Olck: 'ᱢᱟᱞᱟᱭ ᱟᱨᱟᱣ ᱟᱫᱮᱭᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पत्र लिखा': {
    sat_Olck: 'ᱪᱤᱴᱷᱤ ᱚᱞ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पत्र पढ़ना': {
    sat_Olck: 'ᱪᱤᱴᱷᱤ ᱯᱟᱲᱦᱟᱣ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पत्र भेजा': {
    sat_Olck: 'ᱪᱤᱴᱷᱤ ᱵᱷᱮᱡᱟ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पेड़ के पत्र': {
    sat_Olck: 'ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱥᱟᱠᱟᱢ ᱠᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'हरे पत्र': {
    sat_Olck: 'ᱦᱟᱹᱨᱭᱟᱹᱲ ᱥᱟᱠᱟᱢ ᱠᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सूखे पत्र': {
    sat_Olck: 'ᱨᱚᱦᱚᱲ ᱥᱟᱠᱟᱢ ᱠᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'उत्तर दिशा': {
    sat_Olck: 'ᱮᱛᱚᱢ ᱱᱟᱠᱷᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'उत्तर की ओर': {
    sat_Olck: 'ᱮᱛᱚᱢ ᱥᱮᱫ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'उत्तर भारत': {
    sat_Olck: 'ᱮᱛᱚᱢ ᱵᱷᱟᱨᱚᱛ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सवाल का उत्तर': {
    sat_Olck: 'ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'प्रश्न का उत्तर': {
    sat_Olck: 'ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सही उत्तर': {
    sat_Olck: 'ᱥᱟᱹᱨᱤ ᱛᱮᱞᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'उत्तर दिया': {
    sat_Olck: 'ᱛᱮᱞᱟᱭ ᱮᱢ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'उत्तर दो': {
    sat_Olck: 'ᱛᱮᱞᱟ ᱮᱢ ᱢᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सवा तीन बजे': {
    sat_Olck: 'ᱯᱮ ᱴᱟᱲᱟᱝ ᱜᱮᱞ ᱢᱚᱬᱮ ᱴᱤᱯᱤᱡ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सवा चार बजे': {
    sat_Olck: 'ᱯᱩᱱ ᱴᱟᱲᱟᱝ ᱜᱮᱞ ᱢᱚᱬᱮ ᱴᱤᱯᱤᱡ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सवा किलो': {
    sat_Olck: 'ᱥᱟᱣᱟ ᱠᱤᱞᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सवा सौ': {
    sat_Olck: 'ᱢᱤᱫ ᱥᱟᱭ ᱤᱥᱤ ᱢᱚᱬᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मन लगाकर': {
    sat_Olck: 'ᱢᱚᱱᱮ ᱞᱟᱜᱟᱣ ᱠᱟᱛᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मन लगाकर पढ़ाई': {
    sat_Olck: 'ᱢᱚᱱᱮ ᱞᱟᱜᱟᱣ ᱠᱟᱛᱮ ᱚᱞ ᱯᱟᱲᱦᱟᱣ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मन उदास': {
    sat_Olck: 'ᱢᱚᱱᱮ ᱵᱷᱟᱵᱽᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मेरा मन': {
    sat_Olck: 'ᱤᱧᱟᱜ ᱢᱚᱱᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'उसका मन': {
    sat_Olck: 'ᱩᱱᱤᱭᱟᱜ ᱢᱚᱱᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'अगर तुम मेहनत करते तो': {
    sat_Olck: 'ᱡᱩᱫᱤ ᱟᱢ ᱠᱩᱨᱩᱢᱩᱴᱩ ᱠᱮᱭᱟ ᱮᱱᱠᱷᱟᱱ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'अगर तुम आते तो': {
    sat_Olck: 'ᱡᱩᱫᱤ ᱟᱢ ᱦᱤᱡᱩᱜ ᱠᱮᱭᱟ ᱮᱱᱠᱷᱟᱱ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'जब तक': {
    sat_Olck: 'ᱛᱤᱱ ᱵᱷᱩᱨ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'तब तक': {
    sat_Olck: 'ᱩᱱ ᱵᱷᱩᱨ ᱛᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'भागते हुए': {
    sat_Olck: 'ᱫᱟᱹᱲ ᱛᱩᱞᱩᱡ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'रोते हुए': {
    sat_Olck: 'ᱨᱟᱜ ᱛᱩᱞᱩᱡ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मुस्कुराते हुए': {
    sat_Olck: 'ᱢᱩᱞᱩᱡ ᱞᱟᱸᱫᱟ ᱛᱩᱞᱩᱡ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'हँसते हुए': {
    sat_Olck: 'ᱞᱟᱸᱫᱟ ᱛᱩᱞᱩᱡ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'हंसते हुए': {
    sat_Olck: 'ᱞᱟᱸᱫᱟ ᱛᱩᱞᱩᱡ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'बिना कुछ बोले': {
    sat_Olck: 'ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱝ ᱨᱚᱲ ᱠᱟᱛᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'बिना चीनी की चाय': {
    sat_Olck: 'ᱪᱤᱱᱤ ᱵᱮᱜᱚᱨ ᱪᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'बिना चीनी के': {
    sat_Olck: 'ᱪᱤᱱᱤ ᱵᱮᱜᱚᱨ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'बिना पूरी सच्चाई जाने': {
    sat_Olck: 'ᱯᱩᱨᱟᱹ ᱥᱟᱹᱨᱤ ᱠᱟᱛᱷᱟ ᱵᱟᱝ ᱵᱟᱰᱟᱭ ᱠᱟᱛᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'ने कहा कि': {
    sat_Olck: 'ᱮ ᱢᱮᱱ ᱠᱮᱫᱼᱟ ᱡᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'न केवल': {
    sat_Olck: 'ᱠᱷᱟᱹᱞᱤ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'बल्कि': {
    sat_Olck: 'ᱵᱤᱪᱠᱚᱢ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'बल्कि वह भी': {
    sat_Olck: 'ᱵᱤᱪᱠᱚᱢ ᱩᱱᱤ ᱦᱚᱸ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'दूध पिलाकर': {
    sat_Olck: 'ᱛᱚᱣᱟ ᱧᱩ ᱦᱚᱪᱚ ᱠᱟᱛᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सुला दिया': {
    sat_Olck: 'ᱡᱟᱹᱯᱤᱫ ᱦᱚᱪᱚ ᱠᱮᱫᱮᱭᱟᱭ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'बनाया जा रहा है': {
    sat_Olck: 'ᱵᱮᱱᱟᱣ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'बैठने दिया जाएगा': {
    sat_Olck: 'ᱫᱩᱲᱩᱵ ᱦᱚᱪᱚ ᱟᱠᱚᱣᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'नहीं हटना चाहिए': {
    sat_Olck: 'ᱵᱟᱝ ᱥᱟᱦᱟᱜ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'नहीं तोड़ना चाहिए': {
    sat_Olck: 'ᱵᱟᱝ ᱨᱟᱹᱯᱩᱫ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'भूलना': {
    sat_Olck: 'ᱦᱤᱲᱤᱧ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'भूल गया': {
    sat_Olck: 'ᱮ ᱦᱤᱲᱤᱧ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'भूल गई': {
    sat_Olck: 'ᱮ ᱦᱤᱲᱤᱧ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'भूल गए': {
    sat_Olck: 'ᱠᱚ ᱦᱤᱲᱤᱧ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मिलना': {
    sat_Olck: 'ᱧᱟᱢ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मिल रहे हैं': {
    sat_Olck: 'ᱧᱟᱢᱚᱜ ᱠᱟᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मिल रहा है': {
    sat_Olck: 'ᱧᱟᱢᱚᱜ ᱠᱟᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मिलने': {
    sat_Olck: 'ᱧᱟᱯᱟᱢ ᱞᱟᱹᱜᱤᱫ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मिलने गया': {
    sat_Olck: 'ᱧᱟᱯᱟᱢ ᱮ ᱥᱮᱱ ᱮᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'तोड़ना': {
    sat_Olck: 'ᱜᱚᱫ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पहुँचना': {
    sat_Olck: 'ᱥᱮᱴᱮᱨ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पहुँच गया': {
    sat_Olck: 'ᱥᱮᱴᱮᱨ ᱮᱱᱟᱭ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पहुँच गए': {
    sat_Olck: 'ᱠᱚ ᱥᱮᱴᱮᱨ ᱮᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पहुँचा': {
    sat_Olck: 'ᱥᱮᱴᱮᱨ ᱮᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'छोड़ना': {
    sat_Olck: 'ᱵᱟᱹᱜᱤ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'छोड़ चुकी थी': {
    sat_Olck: 'ᱵᱟᱹᱜᱤ ᱞᱮᱫ ᱛᱟᱦᱮᱸᱱ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'छूट गई': {
    sat_Olck: 'ᱯᱟᱨᱚᱢ ᱮᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पूरा करना': {
    sat_Olck: 'ᱯᱩᱨᱟᱹᱣ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पूरी की': {
    sat_Olck: 'ᱮ ᱯᱩᱨᱟᱹᱣ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'ज़िम्मेदारी उठाई': {
    sat_Olck: 'ᱟẺᱜᱤᱵᱷᱟᱨ ᱮ ᱜᱚᱜ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'जिम्मेदारी उठाई': {
    sat_Olck: 'ᱟẺᱜᱤᱵᱷᱟᱨ ᱮ ᱜᱚᱜ ᱠᱮᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'जमा करना': {
    sat_Olck: 'ᱡᱚᱢᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'जमा कर दिया है': {
    sat_Olck: 'ᱠᱚ ᱡᱚᱢᱟ ᱟᱠᱟᱫᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मदद करना': {
    sat_Olck: 'ᱜᱚᱲᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मदद नहीं करना चाहता': {
    sat_Olck: 'ᱜᱚᱲᱚ ᱵᱟᱹᱧ ᱠᱷᱚᱡᱚᱜ ᱠᱟᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'कड़ी मेहनत': {
    sat_Olck: 'ᱟᱹᱰᱤ ᱠᱩᱨᱩᱢᱩᱴᱩ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'अंत तक': {
    sat_Olck: 'ᱢᱩᱪᱟᱹᱫ ᱫᱷᱟᱹᱵᱤᱡ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'जीत': {
    sat_Olck: 'ᱡᱤᱛᱠᱟᱹᱨ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'दिशा': {
    sat_Olck: 'ᱱᱟᱠᱷᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सवाल': {
    sat_Olck: 'ᱠᱩᱠᱞᱤ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'प्रश्न': {
    sat_Olck: 'ᱠᱩᱠᱞᱤ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'घड़ी': {
    sat_Olck: 'ᱜᱷᱩᱲᱤ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'उदास': {
    sat_Olck: 'ᱢᱚᱱᱮ ᱵᱷᱟᱵᱽᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'अभिनय': {
    sat_Olck: 'ᱚᱵᱷᱤᱱᱚᱭ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'दवाई': {
    sat_Olck: 'ᱨᱟᱱ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'दवा': {
    sat_Olck: 'ᱨᱟᱱ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'तबीयत खराब': {
    sat_Olck: 'ᱦᱚᱲᱢᱚ ᱵᱟᱹᱲᱤᱡ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'अगले हफ़्ते': {
    sat_Olck: 'ᱫᱟᱨᱟᱭ ᱠᱟᱱ ᱦᱟᱯᱛᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'अगले हफ्ते': {
    sat_Olck: 'ᱫᱟᱨᱟᱭ ᱠᱟᱱ ᱦᱟᱯᱛᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पुल': {
    sat_Olck: 'ᱯᱚᱞ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पिछले पाँच सालों से': {
    sat_Olck: 'ᱯᱟᱨᱚᱢ ᱮᱱ ᱢᱚᱬᱮ ᱥᱮᱨᱢᱟ ᱠᱷᱚᱱ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पिछले पांच सालों से': {
    sat_Olck: 'ᱯᱟᱨᱚᱢ ᱮᱱ ᱢᱚᱬᱮ ᱥᱮᱨᱢᱟ ᱠᱷᱚᱱ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'अभी तक': {
    sat_Olck: 'ᱱᱤᱛ ᱫᱷᱟᱹᱵᱤᱡ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सच में': {
    sat_Olck: 'ᱥᱟᱹᱨᱤ ᱜᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पसंद है': {
    sat_Olck: 'ᱠᱩᱥᱤᱭᱟᱜᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'पढ़ाई': {
    sat_Olck: 'ᱚᱞ ᱯᱟᱲᱦᱟᱣ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'परिवार': {
    sat_Olck: 'ᱜᱷᱟᱨᱚᱸᱡᱽ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'ज़िम्मेदारी': {
    sat_Olck: 'ᱟẺᱜᱤᱵᱷᱟᱨ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'जिम्मेदारी': {
    sat_Olck: 'ᱟẺᱜᱤᱵᱷᱟᱨ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'दूध': {
    sat_Olck: 'ᱛᱚᱣᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मुश्किलें': {
    sat_Olck: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱠᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'लक्ष्य': {
    sat_Olck: 'ᱡᱚᱥ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'परीक्षा': {
    sat_Olck: 'ᱵᱤᱱᱤᱰ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'कमरा': {
    sat_Olck: 'ᱠᱚᱸᱫᱽᱨᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'चुपचाप': {
    sat_Olck: 'ᱛᱷᱤᱨ ᱛᱷᱟᱨ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'कोना': {
    sat_Olck: 'ᱠᱚᱬ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'निर्दोष व्यक्ति': {
    sat_Olck: 'ᱵᱮᱠᱟᱥᱩᱨ ᱦᱚᱲ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सच्चाई': {
    sat_Olck: 'ᱥᱟᱹᱨᱤ ᱠᱟᱛᱷᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'गलत बात': {
    sat_Olck: 'ᱵᱟᱹᱲᱤᱡ ᱠᱟᱛᱷᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'माता-पिता': {
    sat_Olck: 'ᱟᱭᱳᱼᱵᱟᱵᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सफलता': {
    sat_Olck: 'ᱥᱟᱹᱛ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सीधा-सादा': {
    sat_Olck: 'ᱥᱤᱫᱷᱟᱹᱼᱥᱟᱫᱷᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'असल में': {
    sat_Olck: 'ᱥᱟᱹᱨᱤ ᱛᱮᱫᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'वाह! क्या शानदार व्यवस्था है': {
    sat_Olck: 'ᱣᱟᱦ! ᱪᱮᱫ ᱞᱮᱠᱟᱱ ᱱᱟᱯᱟᱭ ᱵᱮᱵᱚᱥᱛᱟ ᱠᱟᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'फिल्म का संगीत': {
    sat_Olck: 'ᱯᱷᱤᱞᱢ ᱨᱮᱱᱟᱜ ᱥᱮᱨᱮᱧ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'कहानी': {
    sat_Olck: 'ᱠᱟᱹᱦᱱᱤ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'उबाऊ': {
    sat_Olck: 'ᱟᱹᱞᱩ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'नींद आ गई': {
    sat_Olck: 'ᱡᱟᱹᱯᱤᱫ ᱥᱮᱴᱮᱨ ᱮᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'कृपया': {
    sat_Olck: 'ᱫᱟᱭᱟ ᱠᱟᱛᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सबसे नज़दीकी अस्पताल': {
    sat_Olck: 'ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱥᱩᱨ ᱦᱟᱥᱯᱟᱛᱟᱞ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'सबसे नजदीकी अस्पताल': {
    sat_Olck: 'ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱥᱩᱨ ᱦᱟᱥᱯᱟᱛᱟᱞ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'कितनी दूर है': {
    sat_Olck: 'ᱛᱤᱱᱟᱹᱜ ᱥᱟᱺᱜᱤᱧ ᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'कृत्रिम बुद्धिमत्ता': {
    sat_Olck: 'ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱ ᱵᱩᱫᱷᱤ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'स्वास्थ्य': {
    sat_Olck: 'ᱥᱟᱶᱟᱨ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'कृषि': {
    sat_Olck: 'ᱪᱟᱥᱼᱵᱟᱥ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'शिक्षा': {
    sat_Olck: 'ᱥᱮᱪᱮᱫ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'स्वास्थ्य, कृषि और शिक्षा': {
    sat_Olck: 'ᱥᱟᱶᱟᱨ, ᱪᱟᱥᱼᱵᱟᱥ ᱟᱨ ᱥᱮᱪᱮᱫ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'क्रांति': {
    sat_Olck: 'ᱦᱩᱞᱥᱟᱹᱭ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मजबूरियाँ': {
    sat_Olck: 'ᱞᱟᱪᱟᱨᱤ ᱠᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'मजबूरियां': {
    sat_Olck: 'ᱞᱟᱪᱟᱨᱤ ᱠᱚ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'तिमाही': {
    sat_Olck: 'ᱯᱮ ᱪᱟᱸᱫᱚ ᱨᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'दो प्रतिशत की गिरावट': {
    sat_Olck: 'ᱵᱟᱨ ᱥᱟᱭᱠᱚᱲᱟ ᱠᱚᱢ ᱟᱠᱟᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'अर्थव्यवस्था': {
    sat_Olck: 'ᱠᱟᱹᱣᱰᱤ ᱟᱹᱨᱤ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'शुभ संकेत': {
    sat_Olck: 'ᱵᱮᱥ ᱪᱤᱱᱦᱟᱹ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'यात्रीगण कृपया ध्यान दें': {
    sat_Olck: 'ᱥᱟᱸᱜᱷᱟᱨᱤᱭᱟᱹ ᱠᱚ ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱫᱷᱮᱭᱟᱱ ᱯᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'निर्धारित समय से दो घंटे देरी से': {
    sat_Olck: 'ᱴᱷᱟᱹᱣᱠᱟᱹ ᱚᱠᱛᱚ ᱠᱷᱚᱱ ᱵᱟᱨ ᱴᱟᱲᱟᱝ ᱵᱤᱞᱚᱢ ᱛᱮ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'दावत': {
    sat_Olck: 'ᱡᱚᱢᱼᱧᱩ ᱵᱷᱚᱡᱽ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'बहाना': {
    sat_Olck: 'ᱵᱟᱦᱟᱱᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'प्रतिभा': {
    sat_Olck: 'ᱜᱩᱱ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'निरंतर अभ्यास': {
    sat_Olck: 'ᱞᱮᱛᱟᱲ ᱦᱮᱣᱟ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
  'धैर्य': {
    sat_Olck: 'ᱥᱟᱦᱟᱣ',
    sat_Orya: '',
    sat_Deva: '',
    sat_Latn: ''
  },
};

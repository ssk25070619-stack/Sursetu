import { IndigenousLanguage, LanguageConfig } from '../types';

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    id: 'english',
    name: 'English',
    nativeName: 'English (Default)',
    scriptLabel: 'Latin Script',
    nativeScript: 'Latin Alphabet',
    scriptCreator: 'Standard Pan-Indian Medium',
    scriptHistory: 'Standard English medium for administrative governance, NIPUN Bharat reporting, and national accessibility.',
    secondaryScripts: ['Latin'],
    shortCode: 'ENG',
    region: 'Standard National UI',
    icon: '🌐',
    greeting: 'Welcome to SurSetu (सुस्वागतम्)'
  },
  {
    id: 'santali',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    scriptLabel: 'Ol Chiki • Devanagari • Odia',
    nativeScript: 'Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)',
    scriptCreator: 'Pandit Raghunath Murmu (1925)',
    scriptHistory: 'Created by Guru Gomke Pandit Raghunath Murmu in 1925 to encapsulate the phonology of Santali (8th Schedule of Indian Constitution).',
    secondaryScripts: ['Ol Chiki', 'Devanagari', 'Odia', 'Bengali', 'Latin'],
    shortCode: 'SAT',
    region: 'Jharkhand, Mayurbhanj, Purulia, West Bengal',
    icon: '🌿',
    greeting: 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ (Sagun Setag)'
  },
  {
    id: 'ho',
    name: 'Ho',
    nativeName: 'ᱦᱳ (हो)',
    scriptLabel: 'Warang Chiti • Devanagari',
    nativeScript: 'Warang Citi (Varang Kshiti)',
    scriptCreator: 'Guru Kol Lako Bodra (mid-20th century)',
    scriptHistory: 'Developed by community leader Lako Bodra as part of a cultural and linguistic revival movement. Also widely written in Devanagari, Odia, and Latin.',
    secondaryScripts: ['Warang Citi', 'Devanagari', 'Odia', 'Latin'],
    shortCode: 'HO',
    region: 'West Singhbhum, Kolhan & Mayurbhanj',
    icon: '🏹',
    greeting: 'जोहार (Johar! Bugiya na?)'
  },
  {
    id: 'mundari',
    name: 'Mundari',
    nativeName: 'ᱢᱩᱱᱰᱟᱨᱤ (मुण्डारी)',
    scriptLabel: 'Mundari Bani • Devanagari',
    nativeScript: 'Mundari Bani (Mundari Hisir)',
    scriptCreator: 'Rohidas Singh Nag (late-20th century)',
    scriptHistory: 'Created by Rohidas Singh Nag to give the Mundari language a distinct written identity. In practical use, also written in Devanagari, Odia, Bengali, and Latin.',
    secondaryScripts: ['Mundari Bani', 'Devanagari', 'Odia', 'Bengali', 'Latin'],
    shortCode: 'MUN',
    region: 'Ranchi, Khunti, Chota Nagpur Plateau',
    icon: '🌾',
    greeting: 'जोहार (Johar! Chilka menama?)'
  },
  {
    id: 'kurukh',
    name: 'Kurukh',
    nativeName: 'कुड़ुख़ (Kurux)',
    scriptLabel: 'Tolong Siki • Devanagari',
    nativeScript: 'Tolong Siki (ᱛᱚᱞᱚᱝ ᱥᱤᱠᱤ) / Devanagari',
    scriptCreator: 'Dr. Narayan Oraon (1999)',
    scriptHistory: 'Invented by Dr. Narayan Oraon in 1999 for the Dravidian Kurukh/Oraon language; officially recognized by the Govt. of Jharkhand.',
    secondaryScripts: ['Tolong Siki', 'Devanagari', 'Latin'],
    shortCode: 'KUR',
    region: 'Gumla, Lohardaga, Latehar, Simdega, Ranchi & Odisha',
    icon: '🪶',
    greeting: 'जय धरमे (Jai Dharme / Johar)'
  }
];


export interface UILabels {
  bannerBadge: string;
  nativeBadge: string;
  subTitle: string;
  learnWord: string;
  tabs: {
    speech: string;
    translate: string;
    assistant: string;
    worksheets: string;
    flashcards: string;
    tribalQuest: string;
    architecture: string;
  };
  offlinePill: string;
  edgeLatency: string;
  corpusCount: string;
  greetingLabel: string;
}

export const UI_LOCALIZATION: Record<IndigenousLanguage, UILabels> = {
  english: {
    bannerBadge: 'SurSetu',
    nativeBadge: 'English (Default)',
    subTitle: 'Indigenous Language AI & Offline Pedagogical Assistant for Eastern India',
    learnWord: 'Learn Word',
    tabs: {
      speech: 'Speech Studio',
      translate: '6-Layer Translation Hub',
      assistant: 'Sur Saathi (Co-Pilot)',
      worksheets: 'NIPUN Bharat FLN Studio',
      flashcards: '3D Flashcards',
      tribalQuest: 'Tribal Quest (Gamified)',
      architecture: 'Architecture & REST API'
    },
    offlinePill: '100% Offline Ready',
    edgeLatency: '0ms Edge Loopback',
    corpusCount: 'Unified Multilingual Corpus',
    greetingLabel: 'Welcome'
  },
  santali: {
    bannerBadge: 'ᱥᱩᱨ ᱥᱮᱛᱩ',
    nativeBadge: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)',
    subTitle: 'Indigenous Language AI & Offline Pedagogical Assistant for Eastern India (Santali • ᱥᱟᱱᱛᱟᱲᱤ)',
    learnWord: 'Learn Word',
    tabs: {
      speech: 'Speech Studio',
      translate: '6-Layer Translation Hub',
      assistant: 'Sur Saathi (Co-Pilot)',
      worksheets: 'NIPUN Bharat FLN Studio',
      flashcards: '3D Flashcards',
      tribalQuest: 'Tribal Quest (Gamified)',
      architecture: 'Architecture & REST API'
    },
    offlinePill: '100% Offline Ready',
    edgeLatency: '0ms Edge Loopback',
    corpusCount: '72.9k Santali Corpus',
    greetingLabel: 'ᱥᱟᱹᱜᱩᱱ ᱡᱚᱦᱟᱨ'
  },
  ho: {
    bannerBadge: 'SurSetu • Ho',
    nativeBadge: 'Ho (वारंग क्षिती • Warang Citi)',
    subTitle: 'Indigenous Language AI & Offline Pedagogical Assistant for Kolhan Belt',
    learnWord: 'Learn Word',
    tabs: {
      speech: 'Speech Studio',
      translate: '6-Layer Translation Hub',
      assistant: 'Sur Saathi (AI Co-Pilot)',
      worksheets: 'NIPUN Bharat FLN Studio',
      flashcards: '3D Flashcards',
      tribalQuest: 'Tribal Quest',
      architecture: 'Architecture & REST API'
    },
    offlinePill: '100% Offline Ready',
    edgeLatency: '0ms Edge Loopback',
    corpusCount: 'Ho Multilingual Corpus Active',
    greetingLabel: 'Welcome'
  },
  mundari: {
    bannerBadge: 'SurSetu • Mundari',
    nativeBadge: 'Mundari (मुण्डारी • Mundari Bani)',
    subTitle: 'Indigenous Language AI & Pedagogical Bridge for Chota Nagpur & Khunti',
    learnWord: 'Learn Word',
    tabs: {
      speech: 'Speech Studio',
      translate: '6-Layer Translation Hub',
      assistant: 'Sur Saathi (AI Co-Pilot)',
      worksheets: 'NIPUN Bharat FLN Studio',
      flashcards: '3D Flashcards',
      tribalQuest: 'Tribal Quest',
      architecture: 'Architecture & REST API'
    },
    offlinePill: '100% Offline Ready',
    edgeLatency: '0ms Edge Loopback',
    corpusCount: 'Mundari Multilingual Corpus Active',
    greetingLabel: 'Welcome'
  },
  kurukh: {
    bannerBadge: 'SurSetu • Kurukh',
    nativeBadge: 'Kurukh (कुड़ुख़ • Tolong Siki)',
    subTitle: 'Indigenous Language AI & Pedagogical Assistant for Oraon Tribal Belt',
    learnWord: 'Learn Word',
    tabs: {
      speech: 'Speech Studio',
      translate: '6-Layer Translation Hub',
      assistant: 'Sur Saathi (AI Co-Pilot)',
      worksheets: 'NIPUN Bharat FLN Studio',
      flashcards: '3D Flashcards',
      tribalQuest: 'Tribal Quest',
      architecture: 'Architecture & REST API'
    },
    offlinePill: '100% Offline Ready',
    edgeLatency: '0ms Edge Loopback',
    corpusCount: 'Kurukh Multilingual Corpus Active',
    greetingLabel: 'जय धरमे'
  }
};

export interface LoginTranslations {
  badge: string;
  portalTitle: string;
  portalSubtitle: string;
  roles: {
    teacher: {
      title: string;
      nativeTitle: string;
      desc: string;
      nameLabel: string;
      namePlaceholder: string;
      schoolLabel: string;
      schoolPlaceholder: string;
      districtLabel: string;
      districtPlaceholder: string;
      pinLabel: string;
      setPinLabel: string;
      pinPlaceholder: string;
      button: string;
    };
    student: {
      title: string;
      nativeTitle: string;
      desc: string;
      pickAvatar: string;
      nameLabel: string;
      namePlaceholder: string;
      gradeLabel: string;
      childSafeBadge: string;
      button: string;
    };
    official: {
      title: string;
      nativeTitle: string;
      desc: string;
      nameLabel: string;
      namePlaceholder: string;
      designationLabel: string;
      districtLabel: string;
      districtPlaceholder: string;
      pinLabel: string;
      setPinLabel: string;
      button: string;
    };
  };
  authModes: {
    signIn: string;
    createAccount: string;
  };
  dialectLabel: string;
  savedAccountsLabel: string;
  tapToAutofill: string;
  offlineNotice: string;
  registerOfflineNotice: string;
  activeRoleLabel: string;
  modulesAllowed: string;
  quickDemo: string;
  demoUsed: string;
  demoBannerLocked: string;
  demoBannerActive: string;
  resetDetails: string;
  saveAccount: string;
  rateLimitLockout: string;
  registerLocalAccountBtn: string;
  bottomLinks: {
    matrix: string;
    dbArch: string;
    cloudSync: string;
  };
  avatars: {
    owl: string;
    parrot: string;
    archer: string;
    tiger: string;
    elephant: string;
    sprout: string;
  };
  grades: {
    balvatika: string;
    grade1: string;
    grade2: string;
    grade3: string;
  };
}

export const LOGIN_LOCALIZATION: Record<IndigenousLanguage, LoginTranslations> = {
  english: {
    badge: 'SIH 2026 • 100% Offline Edge Native Authentication',
    portalTitle: 'SurSetu',
    portalSubtitle: 'Role-Based Access Portal for Mother Tongue-Based Primary Education across Santali, Ho, and Mundari.',
    roles: {
      teacher: {
        title: 'Primary Educator / Teacher',
        nativeTitle: 'Primary Educator • शिक्षक साथी',
        desc: 'Classroom Co-Pilot, Speech-to-Text Translation, NIPUN Bharat Worksheet Studio, Sur Saathi AI Assistant & Continuous Memory.',
        nameLabel: 'Teacher Full Name',
        namePlaceholder: 'Enter registered teacher name',
        schoolLabel: 'School / Ashram Name',
        schoolPlaceholder: 'Govt. Primary Ashram School',
        districtLabel: 'District / Block',
        districtPlaceholder: 'Mayurbhanj / Dumka / Khunti',
        pinLabel: 'Teacher Security PIN',
        setPinLabel: 'Set 4-Digit Security PIN',
        pinPlaceholder: 'Enter 4-digit PIN',
        button: 'Enter Teacher Portal'
      },
      student: {
        title: 'Tribal Learner / Student',
        nativeTitle: 'Tribal Learner • विद्यार्थी',
        desc: 'Visual, safe, child-friendly reading, 3D animated flashcards, and gamified tribal quest learning.',
        pickAvatar: 'Pick Your Learning Avatar',
        nameLabel: 'Student / Learner Name',
        namePlaceholder: 'Enter student / learner name',
        gradeLabel: 'Class / Grade Level',
        childSafeBadge: 'Child-Safe Mode Active: Direct access to illustrated bilingual readers, 3D animated flashcards, and gamified tribal quests without complex passwords.',
        button: 'Enter Student Zone'
      },
      official: {
        title: 'Education Official / District Admin',
        nativeTitle: 'Education Official • ज़िला शिक्षा अधिकारी',
        desc: 'District administration, NIPUN Bharat FLN learning analytics, school compliance & audit telemetry.',
        nameLabel: 'Official Full Name',
        namePlaceholder: 'Enter official full name',
        designationLabel: 'Designation / Role',
        districtLabel: 'Administrative District',
        districtPlaceholder: 'e.g. Mayurbhanj / Dumka / Khunti',
        pinLabel: 'Admin Security PIN',
        setPinLabel: 'Set 4-Digit Security PIN',
        button: 'Enter Official Portal'
      }
    },
    authModes: {
      signIn: 'Sign In',
      createAccount: 'Create Account'
    },
    dialectLabel: 'Language:',
    savedAccountsLabel: 'Saved Accounts on this Device',
    tapToAutofill: '1-Tap to Autofill',
    offlineNotice: 'Authenticating on local edge store • Zero cloud connection required.',
    registerOfflineNotice: 'Create an offline local profile saved on this edge device.',
    activeRoleLabel: 'Active Role',
    modulesAllowed: 'Modules Allowed',
    quickDemo: 'Quick Demo',
    demoUsed: 'Demo (1/1 Used)',
    demoBannerLocked: '1-Click Demo Quota Used (1/1 on this device): Please sign in with your account or register a new offline account below for unlimited access.',
    demoBannerActive: 'Active Guest Demo Session:',
    resetDetails: 'Reset Details',
    saveAccount: 'Save Account',
    rateLimitLockout: 'Anti-Brute-Force Lockout Active: Too many failed PIN attempts detected. Login is locked for your security.',
    registerLocalAccountBtn: 'Register Local Account',
    bottomLinks: {
      matrix: 'Compare Role Permissions Matrix',
      dbArch: 'Database Connectivity Architecture',
      cloudSync: 'Supabase Cloud Sync'
    },
    avatars: {
      owl: 'Wise Owl',
      parrot: 'Forest Parrot',
      archer: 'Birsa Archer',
      tiger: 'Royal Tiger',
      elephant: 'Gajraj Elephant',
      sprout: 'Sal Sprout'
    },
    grades: {
      balvatika: 'Balvatika',
      grade1: 'Grade 1',
      grade2: 'Grade 2',
      grade3: 'Grade 3'
    }
  },
  santali: {
    badge: 'SIH 2026 • ᱑᱐᱐% ᱚᱯᱷᱞᱟᱭᱤᱱ ᱮᱰᱡᱽ ᱯᱟᱹᱛᱭᱟᱹᱣ (Offline Native)',
    portalTitle: 'ᱥᱩᱨ ᱥᱮᱛᱩ',
    portalSubtitle: 'ᱥᱟᱱᱛᱟᱲᱤ, ᱦᱳ, ᱟᱨ ᱢᱩᱱᱰᱟᱨᱤ ᱟᱭᱳ ᱟᱲᱟᱝ ᱥᱮᱪᱮᱫ ᱞᱟᱹᱜᱤᱫ ᱨᱳᱞ-ᱵᱮᱥᱰ ᱯᱳᱨᱴᱟᱞ (SurSetu Santali Portal)᱾',
    roles: {
      teacher: {
        title: 'ᱯᱨᱟᱭᱢᱟᱨᱤ ᱢᱟᱪᱮᱛ / Educator',
        nativeTitle: 'ᱢᱟᱪᱮᱛ • शिक्षक साथी',
        desc: 'ᱠᱞᱟᱥᱨᱩᱢ ᱜᱚᱲᱚ, ᱟᱲᱟᱝ-ᱛᱮ-ᱚᱞ ᱛᱚᱨᱡᱚᱢᱟ, ᱱᱤᱯᱩᱱ ᱵᱷᱟᱨᱚᱛ ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ, ᱟᱨ ᱥᱩᱨ ᱥᱟᱛᱷᱤ ᱮ.ᱟᱭ ᱜᱚᱲᱚ᱾',
        nameLabel: 'ᱢᱟᱪᱮᱛᱟᱜ ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ',
        namePlaceholder: 'ᱢᱟᱪᱮᱛᱟᱜ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮ',
        schoolLabel: 'ᱟᱥᱲᱟ / ᱟᱥᱨᱚᱢ ᱧᱩᱛᱩᱢ',
        schoolPlaceholder: 'ᱥᱚᱨᱠᱟᱨᱤ ᱯᱨᱟᱭᱢᱟᱨᱤ ᱟᱥᱨᱚᱢ ᱟᱥᱲᱟ',
        districtLabel: 'ᱡᱤᱞᱟᱹ / ᱵᱞᱚᱠ',
        districtPlaceholder: 'ᱢᱚᱭᱩᱨᱵᱷᱚᱸᱡᱽ / ᱫᱩᱢᱠᱟᱹ / ᱯᱩᱨᱩᱞᱤᱭᱟᱹ',
        pinLabel: 'ᱢᱟᱪᱮᱛ ᱥᱤᱠᱩᱨᱤᱴᱤ ᱯᱤᱱ (PIN)',
        setPinLabel: '᱔-ᱮᱞ ᱥᱤᱠᱩᱨᱤᱴᱤ ᱯᱤᱱ ᱵᱮᱱᱟᱣ ᱢᱮ',
        pinPlaceholder: '᱔-ᱮᱞ ᱯᱤᱱ ᱚᱞ ᱢᱮ',
        button: 'ᱢᱟᱪᱮᱛ ᱯᱳᱨᱴᱟᱞ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ'
      },
      student: {
        title: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ / Student',
        nativeTitle: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ • विद्यार्थी',
        desc: 'ᱪᱤᱛᱟᱹᱨ ᱥᱟᱶ ᱯᱟᱲᱦᱟᱣ, ᱓D ᱯᱷᱞᱟᱥᱠᱟᱨᱰ, ᱟᱨ ᱵᱤᱨᱥᱟᱹ ᱟᱜ-ᱥᱟᱨ ᱮᱱᱮᱡ ᱛᱮ ᱥᱮᱪᱮᱫ᱾',
        pickAvatar: 'ᱟᱢᱟᱜ ᱥᱮᱪᱮᱫ ᱪᱤᱱᱦᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
        nameLabel: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱧᱩᱛᱩᱢ',
        namePlaceholder: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮ',
        gradeLabel: 'ᱪᱟᱱᱟᱪ / ᱠᱞᱟᱥ',
        childSafeBadge: 'ᱜᱤᱫᱽᱨᱟᱹ-ᱨᱩᱠᱷᱤᱭᱟᱹ ᱢᱳᱰ ᱪᱟᱹᱞᱩ: ᱵᱤᱱ ᱯᱟᱥᱣᱟᱨᱰ ᱛᱮ ᱪᱤᱛᱟᱹᱨ ᱠᱟᱹᱦᱱᱤ, ᱓D ᱠᱟᱨᱰ ᱟᱨ ᱮᱱᱮᱡ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ᱾',
        button: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱡᱚᱱ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ'
      },
      official: {
        title: 'ᱥᱮᱪᱮᱫ ᱚᱯᱷᱤᱥᱟᱨ / District Admin',
        nativeTitle: 'ᱯᱚᱨᱤᱫᱚᱨᱥᱚᱠ • ज़िला अधिकारी',
        desc: 'ᱡᱤᱞᱟᱹ ᱥᱟᱥᱚᱱ, ᱱᱤᱯᱩᱱ ᱵᱷᱟᱨᱚᱛ ᱞᱮᱠᱷᱟ-ᱡᱚᱠᱷᱟ, ᱟᱥᱲᱟ ᱯᱚᱨᱛᱟᱞ ᱟᱨ ᱥᱚᱨᱠᱟᱨᱤ ᱨᱤᱯᱳᱨᱴ᱾',
        nameLabel: 'ᱚᱯᱷᱤᱥᱟᱨᱟᱜ ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ',
        namePlaceholder: 'ᱚᱯᱷᱤᱥᱟᱨ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮ',
        designationLabel: 'ᱯᱚᱫᱽ / ᱫᱟᱹᱭᱤᱠ',
        districtLabel: 'ᱥᱟᱥᱚᱱ ᱡᱤᱞᱟᱹ',
        districtPlaceholder: 'ᱢᱚᱭᱩᱨᱵᱷᱚᱸᱡᱽ / ᱫᱩᱢᱠᱟᱹ / ᱠᱷᱩᱸᱴᱤ',
        pinLabel: 'ᱚᱯᱷᱤᱥᱤᱭᱟᱞ ᱥᱤᱠᱩᱨᱤᱴᱤ ᱯᱤᱱ (PIN)',
        setPinLabel: '᱔-ᱮᱞ ᱥᱤᱠᱩᱨᱤᱴᱤ ᱯᱤᱱ ᱵᱮᱱᱟᱣ ᱢᱮ',
        button: 'ᱯᱚᱨᱤᱫᱚᱨᱥᱚᱠ ᱯᱳᱨᱴᱟᱞ ᱨᱮ ᱵᱚᱞᱚᱱ ᱢᱮ'
      }
    },
    authModes: {
      signIn: 'ᱵᱚᱞᱚᱱ (Sign In)',
      createAccount: 'ᱱᱟᱣᱟ ᱠᱷᱟᱛᱟ (Register)'
    },
    dialectLabel: 'ᱯᱟᱹᱨᱥᱤ (Dialect):',
    savedAccountsLabel: 'ᱱᱚᱣᱟ ᱰᱤᱵᱷᱟᱭᱤᱥ ᱨᱮ ᱥᱟᱧᱪᱟᱣ ᱠᱷᱟᱛᱟ',
    tapToAutofill: '᱑-ᱴᱤᱯ ᱨᱮ ᱯᱮᱨᱮᱡ',
    offlineNotice: 'ᱞᱚᱠᱟᱞ ᱮᱰᱡᱽ ᱨᱮ ᱯᱟᱹᱛᱭᱟᱹᱣ • ᱤᱱᱴᱟᱨᱱᱮᱴ ᱵᱮᱜᱚᱨ ᱪᱟᱹᱞᱩᱜ-ᱟ᱾',
    registerOfflineNotice: 'ᱱᱚᱣᱟ ᱰᱤᱵᱷᱟᱭᱤᱥ ᱨᱮ ᱱᱟᱣᱟ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱠᱷᱟᱛᱟ ᱵᱮᱱᱟᱣ ᱢᱮ᱾',
    activeRoleLabel: 'ᱪᱟᱹᱞᱩ ᱛᱷᱚᱠ',
    modulesAllowed: 'ᱜᱚᱴᱟᱝ ᱢᱚᱰᱩᱞ',
    quickDemo: 'ᱞᱚᱜᱚᱱ ᱰᱮᱢᱳ',
    demoUsed: 'ᱰᱮᱢᱳ (ᱪᱟᱵᱟᱭᱮᱱᱟ)',
    demoBannerLocked: '᱑-ᱴᱤᱯ ᱰᱮᱢᱳ ᱪᱟᱵᱟᱭᱮᱱᱟ (᱑/᱑ ᱱᱚᱣᱟ ᱰᱤᱵᱷᱟᱭᱤᱥ ᱨᱮ): ᱫᱟᱭᱟᱠᱟᱛᱮ ᱟᱢᱟᱜ ᱠᱷᱟᱛᱟ ᱛᱮ ᱞᱚᱜᱤᱱ ᱢᱮ ᱥᱮ ᱱᱟᱣᱟ ᱠᱷᱟᱛᱟ ᱵᱮᱱᱟᱣ ᱢᱮ᱾',
    demoBannerActive: 'ᱪᱟᱹᱞᱩ ᱜᱮᱥᱴ ᱰᱮᱢᱳ ᱥᱮᱥᱚᱱ:',
    resetDetails: 'ᱫᱚᱦᱲᱟ ᱥᱟᱡᱟᱣ',
    saveAccount: 'ᱠᱷᱟᱛᱟ ᱥᱟᱧᱪᱟᱣ ᱢᱮ',
    rateLimitLockout: 'ᱥᱤᱠᱩᱨᱤᱴᱤ ᱞᱚᱠ ᱪᱟᱹᱞᱩ: ᱵᱟᱹᱲᱤᱡ ᱯᱤᱱ ᱟᱹᱰᱤ ᱫᱷᱟᱣ ᱮᱢ ᱟᱠᱟᱱᱟ᱾ ᱫᱟᱭᱟᱠᱟᱛᱮ ᱛᱟᱺᱜᱤ ᱢᱮ᱾',
    registerLocalAccountBtn: 'ᱱᱟᱣᱟ ᱠᱷᱟᱛᱟ ᱵᱮᱱᱟᱣ ᱢᱮ',
    bottomLinks: {
      matrix: 'ᱨᱳᱞ ᱚᱫᱷᱤᱠᱟᱨ ᱢᱮᱴᱨᱤᱠᱥ ᱧᱮᱞ ᱢᱮ',
      dbArch: 'ᱰᱟᱴᱟᱵᱮᱥ ᱡᱚᱲᱟᱣ ᱵᱮᱵᱚᱥᱛᱷᱟ',
      cloudSync: 'ᱥᱩᱯᱟᱵᱮᱥ ᱠᱞᱟᱣᱩᱰ ᱥᱤᱝᱠ'
    },
    avatars: {
      owl: 'ᱥᱮᱬᱟ ᱦᱩᱛᱩᱢ',
      parrot: 'ᱵᱤᱨ ᱢᱤᱨᱩ',
      archer: 'ᱵᱤᱨᱥᱟᱹ ᱟᱜ-ᱥᱟᱨ',
      tiger: 'ᱛᱟᱹᱨᱩᱵ ᱵᱤᱨ',
      elephant: 'ᱦᱟᱹᱛᱤ ᱜᱚᱰ',
      sprout: 'ᱥᱟᱨᱡᱚᱢ ᱢᱩᱱᱤ'
    },
    grades: {
      balvatika: 'ᱵᱟᱞᱵᱷᱟᱴᱤᱠᱟ',
      grade1: 'ᱪᱟᱱᱟᱪ ᱑ (G1)',
      grade2: 'ᱪᱟᱱᱟᱪ ᱒ (G2)',
      grade3: 'ᱪᱟᱱᱟᱪ ᱓ (G3)'
    }
  },
  ho: {
    badge: 'SIH 2026 • 100% Offline Edge Native Authentication (Ho Belt)',
    portalTitle: 'SurSetu',
    portalSubtitle: 'Role-Based Access Portal for Mother Tongue-Based Primary Education across Ho, Santali, and Mundari.',
    roles: {
      teacher: {
        title: 'Primary Educator / Teacher',
        nativeTitle: 'Primary Educator • शिक्षक साथी (Ho)',
        desc: 'Classroom Co-Pilot, Speech-to-Text Translation, NIPUN Bharat Worksheet Studio, Sur Saathi AI Assistant & Continuous Memory.',
        nameLabel: 'Teacher Full Name',
        namePlaceholder: 'Enter registered teacher name',
        schoolLabel: 'School / Ashram Name',
        schoolPlaceholder: 'Govt. Primary Ashram School',
        districtLabel: 'District / Block',
        districtPlaceholder: 'West Singhbhum / Chaibasa / Mayurbhanj',
        pinLabel: 'Teacher Security PIN',
        setPinLabel: 'Set 4-Digit Security PIN',
        pinPlaceholder: 'Enter 4-digit PIN',
        button: 'Enter Teacher Portal'
      },
      student: {
        title: 'Tribal Learner / Student',
        nativeTitle: 'Tribal Learner • विद्यार्थी (Ho)',
        desc: 'Visual, safe, child-friendly reading, 3D animated flashcards, and gamified tribal quest learning.',
        pickAvatar: 'Pick Your Learning Avatar',
        nameLabel: 'Student / Learner Name',
        namePlaceholder: 'Enter student / learner name',
        gradeLabel: 'Class / Grade Level',
        childSafeBadge: 'Child-Safe Mode Active: Direct access to illustrated bilingual readers, 3D animated flashcards, and gamified tribal quests without complex passwords.',
        button: 'Enter Student Zone'
      },
      official: {
        title: 'Education Official / District Admin',
        nativeTitle: 'Education Official • ज़िला शिक्षा अधिकारी',
        desc: 'District administration, NIPUN Bharat FLN learning analytics, school compliance & audit telemetry.',
        nameLabel: 'Official Full Name',
        namePlaceholder: 'Enter official full name',
        designationLabel: 'Designation / Role',
        districtLabel: 'Administrative District',
        districtPlaceholder: 'West Singhbhum / Chaibasa / Mayurbhanj',
        pinLabel: 'Admin Security PIN',
        setPinLabel: 'Set 4-Digit Security PIN',
        button: 'Enter Official Portal'
      }
    },
    authModes: {
      signIn: 'Sign In',
      createAccount: 'Create Account'
    },
    dialectLabel: 'Language (Ho):',
    savedAccountsLabel: 'Saved Accounts on this Device',
    tapToAutofill: '1-Tap to Autofill',
    offlineNotice: 'Authenticating on local edge store • Zero cloud connection required.',
    registerOfflineNotice: 'Create an offline local profile saved on this edge device.',
    activeRoleLabel: 'Active Role',
    modulesAllowed: 'Modules Allowed',
    quickDemo: 'Quick Demo',
    demoUsed: 'Demo (1/1 Used)',
    demoBannerLocked: '1-Click Demo Quota Used (1/1 on this device): Please sign in with your account or register a new offline account below for unlimited access.',
    demoBannerActive: 'Active Guest Demo Session:',
    resetDetails: 'Reset Details',
    saveAccount: 'Save Account',
    rateLimitLockout: 'Anti-Brute-Force Lockout Active: Too many failed PIN attempts detected. Login is locked for your security.',
    registerLocalAccountBtn: 'Register Local Account',
    bottomLinks: {
      matrix: 'Compare Role Permissions Matrix',
      dbArch: 'Database Connectivity Architecture',
      cloudSync: 'Supabase Cloud Sync'
    },
    avatars: {
      owl: 'Wise Owl',
      parrot: 'Forest Parrot',
      archer: 'Birsa Archer',
      tiger: 'Royal Tiger',
      elephant: 'Gajraj Elephant',
      sprout: 'Sal Sprout'
    },
    grades: {
      balvatika: 'Balvatika',
      grade1: 'Grade 1',
      grade2: 'Grade 2',
      grade3: 'Grade 3'
    }
  },
  mundari: {
    badge: 'SIH 2026 • 100% Offline Edge Native Authentication (Mundari Belt)',
    portalTitle: 'SurSetu',
    portalSubtitle: 'Role-Based Access Portal for Mother Tongue-Based Primary Education across Mundari, Santali, and Ho.',
    roles: {
      teacher: {
        title: 'Primary Educator / Teacher',
        nativeTitle: 'Primary Educator • शिक्षक साथी (Mundari)',
        desc: 'Classroom Co-Pilot, Speech-to-Text Translation, NIPUN Bharat Worksheet Studio, Sur Saathi AI Assistant & Continuous Memory.',
        nameLabel: 'Teacher Full Name',
        namePlaceholder: 'Enter registered teacher name',
        schoolLabel: 'School / Ashram Name',
        schoolPlaceholder: 'Govt. Primary Ashram School',
        districtLabel: 'District / Block',
        districtPlaceholder: 'Khunti / Ranchi / Mayurbhanj',
        pinLabel: 'Teacher Security PIN',
        setPinLabel: 'Set 4-Digit Security PIN',
        pinPlaceholder: 'Enter 4-digit PIN',
        button: 'Enter Teacher Portal'
      },
      student: {
        title: 'Tribal Learner / Student',
        nativeTitle: 'Tribal Learner • विद्यार्थी (Mundari)',
        desc: 'Visual, safe, child-friendly reading, 3D animated flashcards, and gamified tribal quest learning.',
        pickAvatar: 'Pick Your Learning Avatar',
        nameLabel: 'Student / Learner Name',
        namePlaceholder: 'Enter student / learner name',
        gradeLabel: 'Class / Grade Level',
        childSafeBadge: 'Child-Safe Mode Active: Direct access to illustrated bilingual readers, 3D animated flashcards, and gamified tribal quests without complex passwords.',
        button: 'Enter Student Zone'
      },
      official: {
        title: 'Education Official / District Admin',
        nativeTitle: 'Education Official • ज़िला शिक्षा अधिकारी',
        desc: 'District administration, NIPUN Bharat FLN learning analytics, school compliance & audit telemetry.',
        nameLabel: 'Official Full Name',
        namePlaceholder: 'Enter official full name',
        designationLabel: 'Designation / Role',
        districtLabel: 'Administrative District',
        districtPlaceholder: 'Khunti / Ranchi / Mayurbhanj',
        pinLabel: 'Admin Security PIN',
        setPinLabel: 'Set 4-Digit Security PIN',
        button: 'Enter Official Portal'
      }
    },
    authModes: {
      signIn: 'Sign In',
      createAccount: 'Create Account'
    },
    dialectLabel: 'Language (Mundari):',
    savedAccountsLabel: 'Saved Accounts on this Device',
    tapToAutofill: '1-Tap to Autofill',
    offlineNotice: 'Authenticating on local edge store • Zero cloud connection required.',
    registerOfflineNotice: 'Create an offline local profile saved on this edge device.',
    activeRoleLabel: 'Active Role',
    modulesAllowed: 'Modules Allowed',
    quickDemo: 'Quick Demo',
    demoUsed: 'Demo (1/1 Used)',
    demoBannerLocked: '1-Click Demo Quota Used (1/1 on this device): Please sign in with your account or register a new offline account below for unlimited access.',
    demoBannerActive: 'Active Guest Demo Session:',
    resetDetails: 'Reset Details',
    saveAccount: 'Save Account',
    rateLimitLockout: 'Anti-Brute-Force Lockout Active: Too many failed PIN attempts detected. Login is locked for your security.',
    registerLocalAccountBtn: 'Register Local Account',
    bottomLinks: {
      matrix: 'Compare Role Permissions Matrix',
      dbArch: 'Database Connectivity Architecture',
      cloudSync: 'Supabase Cloud Sync'
    },
    avatars: {
      owl: 'Wise Owl',
      parrot: 'Forest Parrot',
      archer: 'Birsa Archer',
      tiger: 'Royal Tiger',
      elephant: 'Gajraj Elephant',
      sprout: 'Sal Sprout'
    },
    grades: {
      balvatika: 'Balvatika',
      grade1: 'Grade 1',
      grade2: 'Grade 2',
      grade3: 'Grade 3'
    }
  },
  kurukh: {
    badge: 'SIH 2026 • 100% Offline Edge Native Authentication (Kurukh / Oraon Belt)',
    portalTitle: 'SurSetu',
    portalSubtitle: 'Role-Based Access Portal for Mother Tongue-Based Primary Education across Kurukh, Santali, Ho, and Mundari.',
    roles: {
      teacher: {
        title: 'Primary Educator / Teacher',
        nativeTitle: 'Primary Educator • शिक्षक साथी (Kurukh)',
        desc: 'Classroom Co-Pilot, Speech-to-Text Translation, NIPUN Bharat Worksheet Studio, Sur Saathi AI Assistant & Continuous Memory.',
        nameLabel: 'Teacher Full Name',
        namePlaceholder: 'Enter registered teacher name',
        schoolLabel: 'School / Ashram Name',
        schoolPlaceholder: 'Govt. Primary Ashram School',
        districtLabel: 'District / Block',
        districtPlaceholder: 'Gumla / Lohardaga / Latehar / Ranchi',
        pinLabel: 'Teacher Security PIN',
        setPinLabel: 'Set 4-Digit Security PIN',
        pinPlaceholder: 'Enter 4-digit PIN',
        button: 'Enter Teacher Portal'
      },
      student: {
        title: 'Tribal Learner / Student',
        nativeTitle: 'Tribal Learner • विद्यार्थी (कुड़ुख़)',
        desc: 'Visual, safe, child-friendly reading, 3D animated flashcards, and gamified tribal quest learning.',
        pickAvatar: 'Pick Your Learning Avatar',
        nameLabel: 'Student / Learner Name',
        namePlaceholder: 'Enter student / learner name',
        gradeLabel: 'Class / Grade Level',
        childSafeBadge: 'Child-Safe Mode Active: Direct access to illustrated bilingual readers, 3D animated flashcards, and gamified tribal quests without complex passwords.',
        button: 'Enter Student Zone'
      },
      official: {
        title: 'Education Official / District Admin',
        nativeTitle: 'Education Official • ज़िला शिक्षा अधिकारी',
        desc: 'District administration, NIPUN Bharat FLN learning analytics, school compliance & audit telemetry.',
        nameLabel: 'Official Full Name',
        namePlaceholder: 'Enter official full name',
        designationLabel: 'Designation / Role',
        districtLabel: 'Administrative District',
        districtPlaceholder: 'Gumla / Lohardaga / Ranchi',
        pinLabel: 'Admin Security PIN',
        setPinLabel: 'Set 4-Digit Security PIN',
        button: 'Enter Official Portal'
      }
    },
    authModes: {
      signIn: 'Sign In',
      createAccount: 'Create Account'
    },
    dialectLabel: 'Language (Kurukh):',
    savedAccountsLabel: 'Saved Accounts on this Device',
    tapToAutofill: '1-Tap to Autofill',
    offlineNotice: 'Authenticating on local edge store • Zero cloud connection required.',
    registerOfflineNotice: 'Create an offline local profile saved on this edge device.',
    activeRoleLabel: 'Active Role',
    modulesAllowed: 'Modules Allowed',
    quickDemo: 'Quick Demo',
    demoUsed: 'Demo (1/1 Used)',
    demoBannerLocked: '1-Click Demo Quota Used (1/1 on this device): Please sign in with your account or register a new offline account below for unlimited access.',
    demoBannerActive: 'Active Guest Demo Session:',
    resetDetails: 'Reset Details',
    saveAccount: 'Save Account',
    rateLimitLockout: 'Anti-Brute-Force Lockout Active: Too many failed PIN attempts detected. Login is locked for your security.',
    registerLocalAccountBtn: 'Register Local Account',
    bottomLinks: {
      matrix: 'Compare Role Permissions Matrix',
      dbArch: 'Database Connectivity Architecture',
      cloudSync: 'Supabase Cloud Sync'
    },
    avatars: {
      owl: 'Wise Owl',
      parrot: 'Forest Parrot',
      archer: 'Birsa Archer',
      tiger: 'Royal Tiger',
      elephant: 'Gajraj Elephant',
      sprout: 'Sal Sprout'
    },
    grades: {
      balvatika: 'Balvatika',
      grade1: 'Grade 1',
      grade2: 'Grade 2',
      grade3: 'Grade 3'
    }
  }
};

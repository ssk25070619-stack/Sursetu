import { IndigenousLanguage, LanguageConfig } from '../types';

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    id: 'english',
    name: 'English',
    nativeName: 'English (Default)',
    scriptLabel: 'Latin Script',
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
    shortCode: 'SAT',
    region: 'Jharkhand, Mayurbhanj, Purulia',
    icon: '🌿',
    greeting: 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ (Sagun Setag)'
  },
  {
    id: 'ho',
    name: 'Ho',
    nativeName: 'ᱦᱳ (हो)',
    scriptLabel: 'Warang Chiti • Devanagari',
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
    shortCode: 'MUN',
    region: 'Ranchi, Khunti, Chota Nagpur',
    icon: '🌾',
    greeting: 'जोहार (Johar! Chilka menama?)'
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
    bannerBadge: 'ᱦᱳ ᱥᱮᱛᱩ (हो सेतु)',
    nativeBadge: 'ᱦᱳ (Ho • वारंग क्षिती)',
    subTitle: 'Indigenous Language AI & Offline Pedagogical Assistant for Kolhan Belt (Ho • ᱦᱳ)',
    learnWord: 'Add Ho Word',
    tabs: {
      speech: 'Speech Studio (काजी)',
      translate: '6-Layer Translation (उलथा)',
      assistant: 'Sur Saathi (हो साती)',
      worksheets: 'NIPUN FLN Studio (कामी साकाम)',
      flashcards: '3D Flashcards (चितिर कार्ड)',
      tribalQuest: 'Tribal Quest (ईनूं खेल)',
      architecture: 'Architecture & REST API'
    },
    offlinePill: '100% Offline (नेट बिना)',
    edgeLatency: '0ms Edge Loopback',
    corpusCount: 'Kolhan Ho Corpus Active',
    greetingLabel: 'जोहार (Johar)'
  },
  mundari: {
    bannerBadge: 'ᱢᱩᱱᱰᱟᱨᱤ ᱥᱮᱛᱩ (मुण्डारी सेतु)',
    nativeBadge: 'ᱢᱩᱱᱰᱟᱨᱤ (Mundari • मुण्डारी)',
    subTitle: 'Indigenous Language AI & Pedagogical Bridge for Chota Nagpur & Khunti (Mundari)',
    learnWord: 'Add Mundari Word',
    tabs: {
      speech: 'Speech Studio (कजी)',
      translate: '6-Layer Translation (उलथा)',
      assistant: 'Sur Saathi (मुण्डारी साती)',
      worksheets: 'NIPUN FLN Studio (कामी साकाम)',
      flashcards: '3D Flashcards (चितिर कार्ड)',
      tribalQuest: 'Tribal Quest (ईनूं खेल)',
      architecture: 'Architecture & REST API'
    },
    offlinePill: '100% Offline (नेट बागेते)',
    edgeLatency: '0ms Edge Loopback',
    corpusCount: 'Chota Nagpur Mundari Corpus',
    greetingLabel: 'जोहार (Johar)'
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
    dialectLabel: 'Dialect:',
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
    badge: 'SIH 2026 • १००% नेट बिना बोलो बई (Offline Native Auth)',
    portalTitle: 'ᱦᱳ ᱥᱮᱛᱩ (हो सेतु)',
    portalSubtitle: 'हो, संथाली, आर मुण्डारी आयू काजी ते चानाच एतो बई पोर्टल (Ho Dialect Portal)॥',
    roles: {
      teacher: {
        title: 'प्राथमिक शिक्षक / Educator',
        nativeTitle: 'माचेत • हो शिक्षक साथी',
        desc: 'चानाच गोड़ो, काजी उलथा (Speech-to-Text), निपुन भारत कामी साकाम, आर हो साती ए.आई॥',
        nameLabel: 'माचेत आ पूरा नुतूम (Teacher Name)',
        namePlaceholder: 'माचेत आ नुतूम ओल में',
        schoolLabel: 'स्कुल / आश्रम नुतूम (School Name)',
        schoolPlaceholder: 'सरकारी प्राथमिक आश्रम स्कुल',
        districtLabel: 'दिसुम / परगना (District)',
        districtPlaceholder: 'मयूरभंज / पश्चिम सिंहभूम / चाईबासा',
        pinLabel: 'माचेत सेक्युरिटी पिन (PIN)',
        setPinLabel: '४-अंक सेक्युरिटी पिन बई में',
        pinPlaceholder: '४-अंक पिन ओल में',
        button: 'माचेत पोर्टल रे बोलो में'
      },
      student: {
        title: 'हो पाठुवा / Ho Student',
        nativeTitle: 'पाठुवा • हो विद्यार्थी',
        desc: 'चितिर ते पाढ़व, ३D फ्लैशकार्ड, आर ईनूं खेल ते काजी सेचेद॥',
        pickAvatar: 'अमागे सेचेद चिन्हा बाछाव में',
        nameLabel: 'पाठुवा नुतूम (Student Name)',
        namePlaceholder: 'पाठुवा आ नुतूम ओल में',
        gradeLabel: 'चानाच / क्लास (Grade)',
        childSafeBadge: 'गीदरा रुखीया मोड: बिन पासवर्ड ते चितिर काहनी, ३D कार्ड आर ईनूं खेल रे बोलो में॥',
        button: 'पाठुवा जागार रे बोलो में'
      },
      official: {
        title: 'दिसुम अधिकारी / District Admin',
        nativeTitle: 'दिसुम अधिकारी • District DEO',
        desc: 'दिसुम सासन, निपुन भारत लेखा-जोखा, स्कुल पोड़ताल आर सरकारी रिपोर्ट॥',
        nameLabel: 'अधिकारी आ पूरा नुतूम',
        namePlaceholder: 'अधिकारी आ नुतूम ओल में',
        designationLabel: 'पद / काम (Designation)',
        districtLabel: 'दिसुम (Administrative District)',
        districtPlaceholder: 'मयूरभंज / पश्चिम सिंहभूम / खूंटी',
        pinLabel: 'अधिकारी सेक्युरिटी पिन (PIN)',
        setPinLabel: '४-अंक सेक्युरिटी पिन बई में',
        button: 'अधिकारी पोर्टल रे बोलो में'
      }
    },
    authModes: {
      signIn: 'बोलो (Sign In)',
      createAccount: 'नामा खाता (Register)'
    },
    dialectLabel: 'भासा (Dialect):',
    savedAccountsLabel: 'नेन डिभाइस रे सांचाव खाता',
    tapToAutofill: '१-दबावे रे पेरेज',
    offlineNotice: 'लोकल एड्ज रे बोलो बई • नेट बिना सांचाव॥',
    registerOfflineNotice: 'नेन डिभाइस रे नामा ऑफलाइन खाता बई में॥',
    activeRoleLabel: 'चालू भूमिका',
    modulesAllowed: 'गोटांग मोड्यूल',
    quickDemo: 'लोगोन डेमो',
    demoUsed: 'डेमो (चाबायेना)',
    demoBannerLocked: '१-दबावे डेमो चाबायेना (१/१ नेन डिभाइस रे): दयाकाते अमागे खाता ते बोलो में लेका नामा खाता बई में॥',
    demoBannerActive: 'चालू गेस्ट डेमो सेशन:',
    resetDetails: 'दोहड़ा बई',
    saveAccount: 'खाता सांचाव में',
    rateLimitLockout: 'सेक्युरिटी लॉक चालू: बाड़ीज पिन बार-बार एम आकाना। दयाकाते तांगी में॥',
    registerLocalAccountBtn: 'नामा खाता रजिस्टर बई में',
    bottomLinks: {
      matrix: 'रोल अधिकार मैट्रिक्स नेल में',
      dbArch: 'डाटाबेस जुड़ाव व्यवस्था',
      cloudSync: 'सुपाबेस क्लाउड सिंक'
    },
    avatars: {
      owl: 'बुद्धिमान उल्लू',
      parrot: 'जंगली तोता',
      archer: 'बिरसा तीरंदाज',
      tiger: 'राजा बाघ',
      elephant: 'गजराज हाथी',
      sprout: 'सरजोम डाली'
    },
    grades: {
      balvatika: 'बालवाटिका',
      grade1: 'चानाच १ (G1)',
      grade2: 'चानाच २ (G2)',
      grade3: 'चानाच ३ (G3)'
    }
  },
  mundari: {
    badge: 'SIH 2026 • १००% नेट बागेते बोलो बई (Offline Native Auth)',
    portalTitle: 'ᱢᱩᱱᱰᱟᱨᱤ ᱥᱮᱛᱩ (मुण्डारी सेतु)',
    portalSubtitle: 'मुण्डारी, संथाली, आर हो अपुन जगर ते पाठुवा को लगित बोलो पोर्टल (Mundari Portal)॥',
    roles: {
      teacher: {
        title: 'प्राथमिक शिक्षक / Educator',
        nativeTitle: 'माचेत • मुण्डारी शिक्षक साथी',
        desc: 'चानाच गोड़ो, कजी उलथा (Speech-to-Text), निपुन भारत कामी साकाम, आर मुण्डारी साती ए.आई॥',
        nameLabel: 'माचेत आ पूरा नुतूम (Teacher Name)',
        namePlaceholder: 'माचेत आ नुतूम ओल में',
        schoolLabel: 'स्कुल / आश्रम नुतूम (School Name)',
        schoolPlaceholder: 'सरकारी प्राथमिक आश्रम स्कुल',
        districtLabel: 'दिसुम / परगना (District)',
        districtPlaceholder: 'खूंटी / रांची / मयूरभंज',
        pinLabel: 'माचेत सेक्युरिटी पिन (PIN)',
        setPinLabel: '४-अंक सेक्युरिटी पिन बई में',
        pinPlaceholder: '४-अंक पिन ओल में',
        button: 'माचेत पोर्टल रे बोलो में'
      },
      student: {
        title: 'मुण्डारी पाठुवा / Mundari Student',
        nativeTitle: 'पाठुवा • मुण्डारी विद्यार्थी',
        desc: 'चितिर ते पाढ़व, ३D फ्लैशकार्ड, आर ईनूं खेल ते कजी सेचेद॥',
        pickAvatar: 'अमागे सेचेद चिन्हा बाछाव में',
        nameLabel: 'पाठुवा नुतूम (Student Name)',
        namePlaceholder: 'पाठुवा आ नुतूम ओल में',
        gradeLabel: 'चानाच / क्लास (Grade)',
        childSafeBadge: 'गीदरा रुखीया मोड: बिन पासवर्ड ते चितिर काहनी, ३D कार्ड आर ईनूं खेल रे बोलो में॥',
        button: 'पाठुवा जागार रे बोलो में'
      },
      official: {
        title: 'दिसुम अधिकारी / District Admin',
        nativeTitle: 'दिसुम अधिकारी • District DEO',
        desc: 'दिसुम सासन, निपुन भारत लेखा-जोखा, स्कुल पोड़ताल आर सरकारी रिपोर्ट॥',
        nameLabel: 'अधिकारी आ पूरा नुतूम',
        namePlaceholder: 'अधिकारी आ नुतूम ओल में',
        designationLabel: 'पद / जिम्मेदारी (Designation)',
        districtLabel: 'दिसुम (Administrative District)',
        districtPlaceholder: 'खूंटी / रांची / मयूरभंज',
        pinLabel: 'अधिकारी सेक्युरिटी पिन (PIN)',
        setPinLabel: '४-अंक सेक्युरिटी पिन बई में',
        button: 'अधिकारी पोर्टल रे बोलो में'
      }
    },
    authModes: {
      signIn: 'बोलो (Sign In)',
      createAccount: 'नामा खाता (Register)'
    },
    dialectLabel: 'जगाड़ (Dialect):',
    savedAccountsLabel: 'नेआ डिभाइस रे सांचाव खाता',
    tapToAutofill: '१-दाबाव रे पेरेज',
    offlineNotice: 'लोकल एड्ज रे बोलो बई • नेट बागेते सांचाव॥',
    registerOfflineNotice: 'नेआ डिभाइस रे नामा ऑफलाइन खाता बई में॥',
    activeRoleLabel: 'चालू भूमिका',
    modulesAllowed: 'गोटांग मोड्यूल',
    quickDemo: 'लोगोन डेमो',
    demoUsed: 'डेमो (चाबायेना)',
    demoBannerLocked: '१-दाबाव डेमो चाबायेना (१/१ नेआ डिभाइस रे): दयाकते अपुन खाता ते बोलो में या नामा खाता बई में॥',
    demoBannerActive: 'चालू गेस्ट डेमो सेशन:',
    resetDetails: 'दोहड़ा बई',
    saveAccount: 'खाता सांचाव में',
    rateLimitLockout: 'सेक्युरिटी लॉक चालू: बाड़ीज पिन बार-बार एम आकाना। दयाकते तांगी में॥',
    registerLocalAccountBtn: 'नामा खाता रजिस्टर बई में',
    bottomLinks: {
      matrix: 'रोल अधिकार मैट्रिक्स नेल में',
      dbArch: 'डाटाबेस जुड़ाव व्यवस्था',
      cloudSync: 'सुपाबेस क्लाउड सिंक'
    },
    avatars: {
      owl: 'बुद्धिमान उल्लू',
      parrot: 'जंगली तोता',
      archer: 'बिरसा तीरंदाज',
      tiger: 'राजा बाघ',
      elephant: 'गजराज हाथी',
      sprout: 'सरजोम डाली'
    },
    grades: {
      balvatika: 'बालवाटिका',
      grade1: 'चानाच १ (G1)',
      grade2: 'चानाच २ (G2)',
      grade3: 'चानाच ३ (G3)'
    }
  }
};

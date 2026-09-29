import { IndigenousLanguage, LanguageConfig } from '../types';

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
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

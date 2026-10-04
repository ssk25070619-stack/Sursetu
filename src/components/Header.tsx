import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  WifiOff,
  Volume2,
  ShieldCheck,
  BookOpen,
  Layers,
  Globe,
  ChevronDown,
  Check,
  Database,
  Sliders,
  GraduationCap,
  Building2,
  Lock,
  LogOut,
  Clock,
  Timer,
  Cloud,
  Cpu
} from 'lucide-react';
import { IndigenousLanguage } from '../types';
import { SUPPORTED_LANGUAGES, UI_LOCALIZATION } from '../data/languages';
import { PWAInstallButton } from './PWAInstallButton';
import { UserRole, rbacService } from '../services/rbacService';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  learnedCount: number;
  onOpenLearnModal: () => void;
  isOffline?: boolean;
  onToggleSimulateOffline?: () => void;
  selectedLanguage?: IndigenousLanguage;
  onSelectLanguage?: (lang: IndigenousLanguage) => void;
  onOpenOfflineCache?: () => void;
  onOpenRoleSwitch?: () => void;
  currentRole?: UserRole;
  onOpenHybridConfig?: () => void;
  onLogout?: () => void;
  onOpenDatabaseGuide?: () => void;
  onOpenSupabase?: () => void;
  onOpenMemoryModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  learnedCount,
  onOpenLearnModal,
  isOffline = false,
  onToggleSimulateOffline,
  selectedLanguage = 'santali',
  onSelectLanguage,
  onOpenOfflineCache,
  onOpenRoleSwitch,
  currentRole = 'teacher',
  onOpenHybridConfig,
  onLogout,
  onOpenDatabaseGuide,
  onOpenSupabase,
  onOpenMemoryModal,
}) => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [demoRemaining, setDemoRemaining] = useState<number>(0);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage) || SUPPORTED_LANGUAGES[0];
  const labels = UI_LOCALIZATION[selectedLanguage] || UI_LOCALIZATION.santali;

  useEffect(() => {
    const checkDemo = () => {
      const profile = rbacService.getProfile();
      setIsDemo(!!profile.isDemoSession);
      if (profile.isDemoSession && profile.demoExpiresAt) {
        const left = Math.max(0, Math.floor((profile.demoExpiresAt - Date.now()) / 1000));
        setDemoRemaining(left);
      } else {
        setDemoRemaining(0);
      }
    };
    checkDemo();
    const interval = setInterval(checkDemo, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getRoleBadge = () => {
    if (currentRole === 'student') {
      return {
        label: '🎒 Student Mode',
        style: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30',
        icon: '🎒',
      };
    }
    if (currentRole === 'official') {
      return {
        label: '🏛️ Official Mode',
        style: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30',
        icon: '🏛️',
      };
    }
    return {
      label: '🧑‍🏫 Teacher Mode',
      style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30',
      icon: '🧑‍🏫',
    };
  };

  const roleInfo = getRoleBadge();

  return (
    <header className="no-print sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 p-0.5 shadow-lg shadow-emerald-900/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl">{currentLang.icon}</span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                  SurSetu
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                    3.0 Sovereign
                  </span>
                  <span className="hidden lg:inline text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    {currentLang.nativeName}
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-lg">
                {labels.subTitle}
              </p>
            </div>
          </div>

          {/* Right Action Bar: Language Toggle + RBAC + Hybrid Config + Status Badges */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language Toggle Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isLangDropdownOpen}
                className="group flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-amber-500/40 hover:border-amber-400/80 text-xs text-slate-200 transition shadow-md shadow-amber-950/20 cursor-pointer"
                title="Switch active indigenous language"
              >
                <span className="text-sm">{currentLang.icon}</span>
                <span className="font-semibold text-amber-300 hidden xs:inline sm:inline">
                  {currentLang.name}
                </span>
                <span className="text-[11px] text-slate-400 hidden md:inline font-mono">
                  ({currentLang.nativeName})
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  {currentLang.shortCode}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300 transition-transform duration-200 ${
                    isLangDropdownOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isLangDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900/98 border border-amber-500/40 shadow-2xl p-2 z-50 backdrop-blur-xl animate-fade-in text-xs space-y-1 ring-1 ring-black/50"
                >
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-amber-300">
                      <Globe className="w-3 h-3" />
                      Select Target Language
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">MTB-MLE</span>
                  </div>

                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = lang.id === selectedLanguage;
                    return (
                      <button
                        key={lang.id}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          if (onSelectLanguage) {
                            onSelectLanguage(lang.id);
                          }
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition flex items-start justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/50 text-white'
                            : 'hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className="text-xl mt-0.5">{lang.icon}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-xs">{lang.name}</span>
                              <span className="text-[11px] font-semibold text-amber-300">
                                {lang.nativeName}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{lang.scriptLabel}</p>
                            <p className="text-[10px] text-slate-500 truncate">📍 {lang.region}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0 pt-0.5">
                          {isSelected ? (
                            <span className="p-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                              <Check className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              {lang.shortCode}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RBAC Persona Switcher Trigger Button */}
            <button
              onClick={onOpenRoleSwitch}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer shadow-sm ${roleInfo.style}`}
              title="Switch user persona (Teacher / Student / Official PIN)"
            >
              <span>{roleInfo.label}</span>
            </button>

            {/* Guest Demo Session Countdown Timer (Only displayed in 1-Click Demo) */}
            {isDemo && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-300 text-xs font-mono font-bold shadow-md shadow-amber-950/40 animate-pulse"
                title="Guest Demo Trial Session: This device has a 1-time guest demo timer."
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo: {formatTimer(demoRemaining)}</span>
              </div>
            )}

            {/* Database Architecture Blueprint Modal Trigger */}
            {onOpenDatabaseGuide && (
              <button
                onClick={onOpenDatabaseGuide}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs font-semibold transition cursor-pointer shadow-sm"
                title="Database Connectivity & Architecture Blueprint"
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xl:inline">DB Architecture</span>
              </button>
            )}

            {/* Supabase Cloud Sync Modal Trigger */}
            {onOpenSupabase && (
              <button
                onClick={onOpenSupabase}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition cursor-pointer shadow-sm"
                title="Supabase PostgreSQL Cloud Sync Gateway"
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Supabase</span>
              </button>
            )}

            {/* 2GB RAM Low-Memory Engine Diagnostics Trigger */}
            {onOpenMemoryModal && (
              <button
                onClick={onOpenMemoryModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition cursor-pointer shadow-sm shadow-emerald-950/20"
                title="2 GB RAM Engine Diagnostics & Memory Heap Purge"
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">2GB RAM Mode</span>
              </button>
            )}

            {/* Hybrid Engine & Voice Cache Settings */}
            <button
              onClick={onOpenHybridConfig}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-emerald-400 transition cursor-pointer"
              title="Hybrid Routing & Voice Cache Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Offline Status Badge */}
            <button
              onClick={onToggleSimulateOffline}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer border ${
                isOffline
                  ? 'bg-amber-950/70 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-900/30'
                  : 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300 hover:border-emerald-500/60'
              }`}
              title={
                isOffline
                  ? 'Offline-Native Mode Active. Click to simulate online reconnection.'
                  : '100% Offline Ready. Click to simulate offline connectivity.'
              }
            >
              <WifiOff className={`w-3.5 h-3.5 ${isOffline ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
              <span className="hidden sm:inline">{isOffline ? 'Offline-Native' : labels.offlinePill}</span>
              <span className="sm:hidden">{isOffline ? 'Offline' : 'Ready'}</span>
              {isOffline && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>}
            </button>

            {/* Logout / Switch User Action */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-semibold transition cursor-pointer"
                title="Log out or switch user account"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden md:inline">Logout</span>
              </button>
            )}
            <PWAInstallButton compact={true} />

            {/* Dynamic Learn Modal Trigger (Only for Teachers) */}
            {currentRole === 'teacher' && (
              <button
                onClick={onOpenLearnModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
                title={`Add ${currentLang.name} words to dynamic edge memory`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{labels.learnWord}</span>
                {learnedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    +{learnedCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Filtered by Role) */}
        <div className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2.5 border-t border-slate-800/80 text-xs sm:text-sm font-medium no-scrollbar">
          {/* 1. Bilingual Story Reader (Universal) */}
          {rbacService.canAccess('reader') && (
            <button
              onClick={() => setActiveTab('reader')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                activeTab === 'reader'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40 glow-emerald'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <span>📖</span>
              <span>Bilingual Reader</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                FLN
              </span>
            </button>
          )}

          {/* 2. Speech Studio */}
          {rbacService.canAccess('speech') && (
            <button
              onClick={() => setActiveTab('speech')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                activeTab === 'speech'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40 glow-emerald'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <span>🎙️</span>
              <span>{labels.tabs.speech}</span>
            </button>
          )}

          {/* 3. Translation Hub */}
          {rbacService.canAccess('translate') && (
            <button
              onClick={() => setActiveTab('translate')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                activeTab === 'translate'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40 glow-emerald'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <span>🌐</span>
              <span>{labels.tabs.translate}</span>
            </button>
          )}

          {/* 4. Sur Saathi AI Co-Pilot */}
          {rbacService.canAccess('assistant') && (
            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                activeTab === 'assistant'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40 glow-emerald'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <span>🤖</span>
              <span>{labels.tabs.assistant}</span>
            </button>
          )}

          {/* 5. NIPUN Bharat Worksheet Studio */}
          {rbacService.canAccess('worksheets') && (
            <button
              onClick={() => setActiveTab('worksheets')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                activeTab === 'worksheets'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40 glow-emerald'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <span>📝</span>
              <span>{labels.tabs.worksheets}</span>
            </button>
          )}

          {/* 6. 3D Flashcards */}
          {rbacService.canAccess('flashcards') && (
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                activeTab === 'flashcards'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40 glow-emerald'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <span>🃏</span>
              <span>{labels.tabs.flashcards}</span>
            </button>
          )}

          {/* 7. Barakhadi Chart */}
          {rbacService.canAccess('barakhadi') && (
            <button
              onClick={() => setActiveTab('barakhadi')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                activeTab === 'barakhadi'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40 glow-emerald'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <span>🔤</span>
              <span>Barakhadi Chart</span>
            </button>
          )}

          {/* 8. Tribal Quest Game */}
          {rbacService.canAccess('tribal_quest') && (
            <button
              onClick={() => setActiveTab('tribal_quest')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                activeTab === 'tribal_quest'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-lg shadow-amber-950/60 border border-amber-400/40 glow-amber'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <span>🏹</span>
              <span>{labels.tabs.tribalQuest}</span>
            </button>
          )}

          {/* 9. Learning Diagnostics & Misconception Engine */}
          {rbacService.canAccess('diagnostics') && (
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                activeTab === 'diagnostics'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-950/60 border border-amber-400/40 glow-amber'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <span>🧠</span>
              <span>Diagnostics</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-950/80 text-amber-200 text-[10px] font-bold border border-amber-400/40">
                Adaptive
              </span>
            </button>
          )}

          {/* 10. Official District Audit Dashboard */}
          {rbacService.canAccess('official_dashboard') && (
            <button
              onClick={() => setActiveTab('official_dashboard')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                activeTab === 'official_dashboard'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-950/60 border border-indigo-400/40 glow-indigo'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <span>🏛️</span>
              <span>District Audit</span>
            </button>
          )}

          {/* 11. Architecture & API Playground */}
          {rbacService.canAccess('architecture') && (
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                activeTab === 'architecture'
                  ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-950/60 border border-slate-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <span>🔌</span>
              <span>{labels.tabs.architecture}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

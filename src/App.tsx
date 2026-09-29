import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SpeechStudio } from './components/SpeechStudio';
import { TranslationHub } from './components/TranslationHub';
import { SursetuSaathi } from './components/SursetuSaathi';
import { WorksheetStudio } from './components/WorksheetStudio';
import { FlashcardDeck } from './components/FlashcardDeck';
import { TribalQuest } from './components/TribalQuest';
import { ApiPlayground } from './components/ApiPlayground';
import { DynamicLearnModal } from './components/DynamicLearnModal';
import { OfflineToast } from './components/OfflineToast';
import { OfflineCacheModal } from './components/OfflineCacheModal';
import { BilingualReader } from './components/BilingualReader';
import { RoleSwitchModal } from './components/RoleSwitchModal';
import { HybridConfigModal } from './components/HybridConfigModal';
import { OfficialDashboard } from './components/OfficialDashboard';
import { BarakhadiWallChart } from './components/BarakhadiWallChart';
import { LearningDiagnosticsView } from './components/LearningDiagnosticsView';
import { InteractiveCompanion } from './components/InteractiveCompanion';
import { LoginPage } from './components/LoginPage';
import { DatabaseGuideModal } from './components/DatabaseGuideModal';
import { SupabaseModal } from './components/SupabaseModal';
import { RestrictedAccessView } from './components/RestrictedAccessView';
import { loadLearnedWords } from './engine/nlpEngine';
import { ShieldCheck, Heart, Sparkles, BookOpen, WifiOff, Globe, Layers, Database, Cloud } from 'lucide-react';
import { IndigenousLanguage } from './types';
import { SUPPORTED_LANGUAGES } from './data/languages';
import { rbacService, UserRole, ROLE_CONFIGS } from './services/rbacService';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(rbacService.isAuthenticated());
  const [activeTab, setActiveTab] = useState<string>(rbacService.getDefaultTab());
  const [selectedLanguage, setSelectedLanguage] = useState<IndigenousLanguage>('english');
  const [currentRole, setCurrentRole] = useState<UserRole>(rbacService.getRole());




  const [isLearnModalOpen, setIsLearnModalOpen] = useState<boolean>(false);
  const [isOfflineCacheOpen, setIsOfflineCacheOpen] = useState<boolean>(false);
  const [isRoleSwitchOpen, setIsRoleSwitchOpen] = useState<boolean>(false);
  const [isHybridConfigOpen, setIsHybridConfigOpen] = useState<boolean>(false);
  const [isDatabaseGuideOpen, setIsDatabaseGuideOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [learnedCount, setLearnedCount] = useState<number>(loadLearnedWords().length);
  const [saathiQuery, setSaathiQuery] = useState<string>('');
  const [worksheetType, setWorksheetType] = useState<string>('counting');
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = rbacService.subscribe((profile) => {
      setCurrentRole(profile.role);
      setIsAuthenticated(profile.isAuthenticated);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  const isEffectivelyOffline = !isOnline || isSimulatedOffline;

  const handleWordAdded = () => {
    setLearnedCount(loadLearnedWords().length);
  };

  const handleNavigateToSaathi = (query: string) => {
    setSaathiQuery(query);
    setActiveTab('assistant');
  };

  const handleNavigateToWorksheets = (type: string) => {
    setWorksheetType(type);
    setActiveTab('worksheets');
  };

  const handleRoleChanged = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const defaultTab = ROLE_CONFIGS[newRole].defaultTab;
    if (!rbacService.canAccess(activeTab)) {
      setActiveTab(defaultTab);
    }
  };

  const handleLoginSuccess = (role: UserRole, targetTab?: string) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    setActiveTab(targetTab || ROLE_CONFIGS[role].defaultTab);
  };

  const handleLogout = () => {
    rbacService.logout();
    setIsAuthenticated(false);
  };

  // If user is not authenticated, render the rich Login & Persona Gate
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          onOpenDatabaseGuide={() => setIsDatabaseGuideOpen(true)}
          onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        />
        <DatabaseGuideModal
          isOpen={isDatabaseGuideOpen}
          onClose={() => setIsDatabaseGuideOpen(false)}
        />
        <SupabaseModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
        />
      </>
    );
  }

  // Check if current tab is permitted for active role
  const isCurrentTabAllowed = rbacService.canAccess(activeTab);

  return (
    <div className="min-h-screen aurora-bg text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Global Navigation Header with Language Toggle & RBAC Badge */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        learnedCount={learnedCount}
        onOpenLearnModal={() => setIsLearnModalOpen(true)}
        isOffline={isEffectivelyOffline}
        onToggleSimulateOffline={() => setIsSimulatedOffline((prev) => !prev)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        onOpenOfflineCache={() => setIsOfflineCacheOpen(true)}
        onOpenRoleSwitch={() => setIsRoleSwitchOpen(true)}
        currentRole={currentRole}
        onOpenHybridConfig={() => setIsHybridConfigOpen(true)}
        onLogout={handleLogout}
        onOpenDatabaseGuide={() => setIsDatabaseGuideOpen(true)}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* If user tries to access a restricted tab */}
        {!isCurrentTabAllowed ? (
          <RestrictedAccessView
            currentRole={currentRole}
            attemptedTab={activeTab}
            onSwitchRole={() => setIsRoleSwitchOpen(true)}
            onNavigateHome={() => setActiveTab(ROLE_CONFIGS[currentRole].defaultTab)}
          />
        ) : (
          <>
            {/* 1. Bilingual Story Reader */}
            {activeTab === 'reader' && (
              <BilingualReader
                language={selectedLanguage}
                onNavigateToWorksheets={() => setActiveTab('worksheets')}
              />
            )}

            {/* 2. Speech Studio */}
            {activeTab === 'speech' && (
              <SpeechStudio onNavigateToSaathi={handleNavigateToSaathi} />
            )}

            {/* 3. Translation Hub */}
            {activeTab === 'translate' && (
              <TranslationHub language={selectedLanguage} />
            )}

            {/* 4. Sur Saathi AI Co-Pilot */}
            {activeTab === 'assistant' && (
              <SursetuSaathi
                initialQuery={saathiQuery}
                onNavigateToWorksheets={handleNavigateToWorksheets}
                language={selectedLanguage}
              />
            )}

            {/* 5. Worksheet Studio */}
            {activeTab === 'worksheets' && (
              <WorksheetStudio initialType={worksheetType} />
            )}

            {/* 6. 3D Flashcards */}
            {activeTab === 'flashcards' && (
              <FlashcardDeck language={selectedLanguage} />
            )}

            {/* 7. Barakhadi Chart */}
            {activeTab === 'barakhadi' && (
              <BarakhadiWallChart />
            )}

            {/* 8. Tribal Quest Game */}
            {activeTab === 'tribal_quest' && (
              <TribalQuest />
            )}

            {/* 9. Learning Diagnostics & Misconception Engine */}
            {activeTab === 'diagnostics' && (
              <LearningDiagnosticsView />
            )}

            {/* 10. Official District Dashboard */}
            {activeTab === 'official_dashboard' && (
              <OfficialDashboard isOnline={!isEffectivelyOffline} />
            )}

            {/* 11. Architecture & API Playground */}
            {activeTab === 'architecture' && (
              <ApiPlayground />
            )}
          </>
        )}
      </main>

      {/* Dynamic Learn Modal (Teacher Memory) */}
      <DynamicLearnModal
        isOpen={isLearnModalOpen}
        onClose={() => setIsLearnModalOpen(false)}
        onWordAdded={handleWordAdded}
      />

      {/* Pure Offline Storage Inspector Modal */}
      <OfflineCacheModal
        isOpen={isOfflineCacheOpen}
        onClose={() => setIsOfflineCacheOpen(false)}
        isOffline={isEffectivelyOffline}
      />

      {/* RBAC Role Switcher Modal */}
      <RoleSwitchModal
        isOpen={isRoleSwitchOpen}
        onClose={() => setIsRoleSwitchOpen(false)}
        currentRole={currentRole}
        onRoleChanged={handleRoleChanged}
      />

      {/* Hybrid Engine & Voice Cache Config Modal */}
      <HybridConfigModal
        isOpen={isHybridConfigOpen}
        onClose={() => setIsHybridConfigOpen(false)}
        isOnline={!isEffectivelyOffline}
      />

      {/* Database Architecture Blueprint Guide Modal */}
      <DatabaseGuideModal
        isOpen={isDatabaseGuideOpen}
        onClose={() => setIsDatabaseGuideOpen(false)}
      />

      {/* Supabase PostgreSQL Cloud Gateway Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Live Interactive Learning Companion & Soundscape */}
      <InteractiveCompanion />

      {/* Offline Connectivity Toast Notification */}
      <OfflineToast
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulateOffline={() => setIsSimulatedOffline((prev) => !prev)}
      />

      {/* Footer (Hidden during printing) */}
      <footer className="no-print mt-auto border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold">🌿 SurSetu 3.0 (सुर सेतु • ᱥᱩᱨ ᱥᱮᱛᱩ)</span>
            <span>•</span>
            <span className="text-amber-300 font-medium flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-400" />
              <span>
                Active: {SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage)?.name} (
                {SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage)?.nativeName})
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <button
              onClick={() => setIsRoleSwitchOpen(true)}
              className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <span>Role: <strong className="text-slate-200 capitalize">{currentRole}</strong></span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDatabaseGuideOpen(true)}
              className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <Database className="w-3 h-3 text-amber-400" />
              <span>DB Architecture</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <Cloud className="w-3 h-3 text-emerald-400" />
              <span>Supabase Cloud</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSimulatedOffline((prev) => !prev)}
              className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1 text-[11px]"
              title="Click to test Offline Connectivity Notification"
            >
              <WifiOff className="w-3 h-3" />
              <span>{isEffectivelyOffline ? 'Test Online Reconnection' : 'Test Offline Mode'}</span>
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              NEP 2020 & NIPUN Bharat Aligned
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

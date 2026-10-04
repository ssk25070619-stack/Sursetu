import React from 'react';
import {
  X,
  Smartphone,
  Sparkles,
  BookOpen,
  Mic,
  Languages,
  Bot,
  Layers,
  Award,
  Cpu,
  Database,
  Cloud,
  Sliders,
  LogOut,
  Users,
  WifiOff,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { rbacService, UserRole } from '../services/rbacService';
import { lowMemoryService } from '../services/lowMemoryService';
import { IndigenousLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface MobileQuickDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  onOpenRoleSwitch: () => void;
  onOpenMemoryModal: () => void;
  onOpenOfflineCache: () => void;
  onOpenHybridConfig: () => void;
  onOpenDatabaseGuide: () => void;
  onOpenSupabase: () => void;
  onLogout: () => void;
  selectedLanguage: IndigenousLanguage;
  onSelectLanguage: (lang: IndigenousLanguage) => void;
  isLowRamMode: boolean;
}

export const MobileQuickDrawer: React.FC<MobileQuickDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  currentRole,
  onOpenRoleSwitch,
  onOpenMemoryModal,
  onOpenOfflineCache,
  onOpenHybridConfig,
  onOpenDatabaseGuide,
  onOpenSupabase,
  onLogout,
  selectedLanguage,
  onSelectLanguage,
  isLowRamMode,
}) => {
  if (!isOpen) return null;

  const handleSelectTab = (tab: string) => {
    lowMemoryService.triggerHaptic('light');
    setActiveTab(tab);
    onClose();
  };

  const modules = [
    { id: 'reader', label: 'Bilingual Story Reader', icon: '📖', tag: 'FLN', access: 'reader' },
    { id: 'speech', label: 'Speech Studio & Voice', icon: '🎙️', tag: 'TTS/ASR', access: 'speech' },
    { id: 'translate', label: 'Multi-Script Translation', icon: '🌐', tag: 'Ol Chiki', access: 'translate' },
    { id: 'assistant', label: 'Sur Saathi AI Co-Pilot', icon: '🤖', tag: 'Hybrid', access: 'assistant' },
    { id: 'worksheets', label: 'Worksheet Studio', icon: '📝', tag: 'PDF/Docx', access: 'worksheets' },
    { id: 'flashcards', label: '3D Flashcard Deck', icon: '🃏', tag: 'Visual', access: 'flashcards' },
    { id: 'barakhadi', label: 'Barakhadi Chart', icon: '🔤', tag: 'Phonics', access: 'barakhadi' },
    { id: 'tribal_quest', label: 'Tribal Quest Game', icon: '🏹', tag: 'Gamified', access: 'tribal_quest' },
    { id: 'diagnostics', label: 'Learning Diagnostics', icon: '🧠', tag: 'Adaptive', access: 'diagnostics' },
    { id: 'official_dashboard', label: 'District Audit Dashboard', icon: '🏛️', tag: 'Official', access: 'official_dashboard' },
    { id: 'architecture', label: 'API & Engine Playground', icon: '🔌', tag: 'Dev', access: 'architecture' },
  ].filter((m) => rbacService.canAccess(m.access));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in no-print"
    >
      <div className="w-full max-w-xs sm:max-w-sm h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <div>
              <h3 className="font-bold text-sm text-white">SurSetu Mobile</h3>
              <p className="text-[10px] text-emerald-400">2 GB RAM Mobile Edition</p>
            </div>
          </div>
          <button
            onClick={() => {
              lowMemoryService.triggerHaptic('light');
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modules List */}
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            All Learning Modules
          </div>

          {modules.map((mod) => {
            const isSelected = activeTab === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => handleSelectTab(mod.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{mod.icon}</span>
                  <span>{mod.label}</span>
                </div>
                {mod.tag && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                    {mod.tag}
                  </span>
                )}
              </button>
            );
          })}

          {/* Device & System Controls */}
          <div className="pt-3 border-t border-slate-800 mt-2 space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              2 GB RAM & Mobile Tools
            </div>

            <button
              onClick={() => {
                onOpenMemoryModal();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-800/80 text-emerald-300 transition cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>2 GB RAM Engine Diagnostics</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => {
                onOpenRoleSwitch();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-800/80 text-amber-300 transition cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Switch Role: <strong className="capitalize">{currentRole}</strong></span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => {
                onOpenOfflineCache();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-800/80 text-slate-300 transition cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2.5">
                <WifiOff className="w-4 h-4 text-slate-400" />
                <span>Offline Storage & Cache</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => {
                onOpenHybridConfig();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-800/80 text-slate-300 transition cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-slate-400" />
                <span>Hybrid Routing Settings</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => {
                onOpenDatabaseGuide();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-800/80 text-amber-300 transition cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Database Architecture</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => {
                onOpenSupabase();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-800/80 text-emerald-300 transition cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span>Supabase Cloud Gateway</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Footer with Logout & Version */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
          <p className="text-[10px] text-slate-500 text-center">
            SurSetu 3.0 • Optimized for 2 GB RAM Mobile
          </p>
        </div>
      </div>
    </div>
  );
};

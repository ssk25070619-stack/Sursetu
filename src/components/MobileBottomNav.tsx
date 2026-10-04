import React from 'react';
import {
  BookOpen,
  Mic,
  Languages,
  Bot,
  Layers,
  Sparkles,
  Menu,
  Activity,
  Award
} from 'lucide-react';
import { rbacService } from '../services/rbacService';
import { lowMemoryService } from '../services/lowMemoryService';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickMenu: () => void;
  onOpenMemoryModal: () => void;
  isLowRamActive: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickMenu,
  onOpenMemoryModal,
  isLowRamActive,
}) => {
  const handleTabClick = (tab: string) => {
    lowMemoryService.triggerHaptic('light');
    setActiveTab(tab);
  };

  const navItems = [
    {
      id: 'reader',
      label: 'Reader',
      icon: '📖',
      tag: 'FLN',
      visible: rbacService.canAccess('reader'),
    },
    {
      id: 'speech',
      label: 'Voice',
      icon: '🎙️',
      tag: null,
      visible: rbacService.canAccess('speech'),
    },
    {
      id: 'translate',
      label: 'Translate',
      icon: '🌐',
      tag: null,
      visible: rbacService.canAccess('translate'),
    },
    {
      id: 'assistant',
      label: 'Sur Saathi',
      icon: '🤖',
      tag: 'AI',
      visible: rbacService.canAccess('assistant'),
    },
    {
      id: 'flashcards',
      label: 'Cards',
      icon: '🃏',
      tag: null,
      visible: rbacService.canAccess('flashcards'),
    },
  ].filter((item) => item.visible);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden no-print fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-lg pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center justify-around px-1 py-1.5 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-150 touch-manipulation cursor-pointer relative ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <span className="text-lg leading-none">{item.icon}</span>
                {item.tag && (
                  <span
                    className={`absolute -top-1 -right-2 text-[8px] font-black px-1 rounded-full uppercase leading-tight ${
                      isActive
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.tag}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
              {isActive && (
                <div className="w-4 h-0.5 rounded-full bg-emerald-400 mt-0.5 shadow-sm shadow-emerald-400/80" />
              )}
            </button>
          );
        })}

        {/* More Menu & 2GB RAM Trigger */}
        <button
          onClick={() => {
            lowMemoryService.triggerHaptic('light');
            onOpenQuickMenu();
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-150 touch-manipulation cursor-pointer ${
            activeTab === 'worksheets' ||
            activeTab === 'barakhadi' ||
            activeTab === 'tribal_quest' ||
            activeTab === 'diagnostics' ||
            activeTab === 'official_dashboard' ||
            activeTab === 'architecture'
              ? 'text-amber-300 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Menu className="w-5 h-5" />
            {isLowRamActive && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Explore</span>
        </button>
      </div>
    </nav>
  );
};

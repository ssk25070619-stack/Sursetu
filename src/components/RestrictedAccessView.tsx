import React from 'react';
import { UserRole, ROLE_CONFIGS, rbacService } from '../services/rbacService';
import { Lock, ShieldAlert, ArrowRight, UserCheck, Sparkles, BookOpen } from 'lucide-react';

interface RestrictedAccessViewProps {
  currentRole: UserRole;
  attemptedTab: string;
  onSwitchRole: () => void;
  onNavigateHome: () => void;
}

export const RestrictedAccessView: React.FC<RestrictedAccessViewProps> = ({
  currentRole,
  attemptedTab,
  onSwitchRole,
  onNavigateHome
}) => {
  const currentConfig = ROLE_CONFIGS[currentRole];

  // Find which roles CAN access this tab
  const authorizedRoles = (['teacher', 'student', 'official'] as UserRole[]).filter((r) =>
    ROLE_CONFIGS[r].allowedTabs.includes(attemptedTab)
  );

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <Lock className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
            Access Restricted for {currentConfig.badge}
          </span>
          <h2 className="text-xl font-bold text-white">
            Role-Based Permission Required
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You are currently browsing as <strong>{currentConfig.title}</strong>. This module is restricted to prevent distractions and maintain pedagogical focus.
          </p>
        </div>

        {/* Authorized Roles Pill */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
          <span className="text-[11px] text-slate-500 uppercase font-semibold tracking-wider block">
            Authorized Personas for this Module:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {authorizedRoles.map((r) => (
              <span
                key={r}
                className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 font-medium flex items-center gap-1.5 border border-slate-700 text-[11px]"
              >
                <span>{ROLE_CONFIGS[r].icon}</span>
                <span>{ROLE_CONFIGS[r].title.split('/')[0]}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onSwitchRole}
            className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Switch to Authorized Role</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition cursor-pointer"
          >
            Return to Allowed Modules
          </button>
        </div>
      </div>
    </div>
  );
};

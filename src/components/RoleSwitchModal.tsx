import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  UserCheck,
  GraduationCap,
  Sparkles,
  Building2,
  X,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { rbacService, UserRole, UserProfile } from '../services/rbacService';

interface RoleSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onRoleChanged: (newRole: UserRole) => void;
}

export const RoleSwitchModal: React.FC<RoleSwitchModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChanged,
}) => {
  const [profile, setProfile] = useState<UserProfile>(rbacService.getProfile());
  const [selectedTargetRole, setSelectedTargetRole] = useState<UserRole>(currentRole);
  const [pinInput, setPinInput] = useState<string>('');
  const [isPinStep, setIsPinStep] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectRole = (role: UserRole) => {
    setSelectedTargetRole(role);
    setErrorMessage('');

    // If switching to student, no PIN needed
    if (role === 'student') {
      rbacService.setRole('student');
      onRoleChanged('student');
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 600);
      return;
    }

    // If current role is student and switching to teacher/official, prompt for PIN
    if (currentRole === 'student') {
      setIsPinStep(true);
    } else {
      rbacService.setRole(role);
      onRoleChanged(role);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 600);
    }
  };

  const handleVerifyPinAndSwitch = () => {
    if (!rbacService.verifyPin(pinInput)) {
      setErrorMessage('Incorrect 4-digit PIN. (Default PIN is 1234)');
      return;
    }

    rbacService.setRole(selectedTargetRole, pinInput);
    onRoleChanged(selectedTargetRole);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsPinStep(false);
      setPinInput('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Classroom Role Switcher (RBAC)</h3>
              <p className="text-xs text-slate-400">Offline-first persona & permission control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Verification Step */}
        {isPinStep ? (
          <div className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Teacher / Official PIN Required</h4>
              <p className="text-xs text-slate-400">
                Enter your 4-digit security PIN to unlock administrative & teacher controls from Student Mode.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-center">
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="••••"
                  className="w-36 text-center tracking-widest text-2xl font-mono py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              {errorMessage && (
                <div className="text-xs text-red-400 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <p className="text-[11px] text-center text-slate-500">
                (Default Offline School PIN: <span className="font-mono text-slate-300">1234</span>)
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setIsPinStep(false);
                  setPinInput('');
                  setErrorMessage('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleVerifyPinAndSwitch}
                disabled={pinInput.length < 4}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                Verify & Unlock
              </button>
            </div>
          </div>
        ) : (
          /* Role Selection Cards */
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              {/* Teacher Role */}
              <button
                onClick={() => handleSelectRole('teacher')}
                className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-start gap-3.5 ${
                  currentRole === 'teacher'
                    ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      🧑‍🏫 Teacher / Educator Mode
                      {currentRole === 'teacher' && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                          Active
                        </span>
                      )}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Full access: Speech Studio, Translation Hub, Sur Saathi, Worksheet Generator, Continuous Memory Learning, and Barakhadi.
                  </p>
                </div>
              </button>

              {/* Student Role */}
              <button
                onClick={() => handleSelectRole('student')}
                className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-start gap-3.5 ${
                  currentRole === 'student'
                    ? 'bg-amber-950/40 border-amber-500/60 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      🎒 Student / Learner Mode
                      {currentRole === 'student' && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                          Active
                        </span>
                      )}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Distraction-free learning: Bilingual Story Reader, 3D Flashcards, Tribal Quest literacy game, and Barakhadi chart.
                  </p>
                </div>
              </button>

              {/* Official / CRP Role */}
              <button
                onClick={() => handleSelectRole('official')}
                className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-start gap-3.5 ${
                  currentRole === 'official'
                    ? 'bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      🏛️ District / CRP Official Mode
                      {currentRole === 'official' && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                          Active
                        </span>
                      )}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Administrative oversight: NIPUN Bharat FLN compliance metrics, School Aggregation, and Export for District Portals.
                  </p>
                </div>
              </button>
            </div>

            {/* School Info Footer */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>School: <strong className="text-slate-300">{profile.schoolName}</strong></span>
              <span>PIN: <strong className="text-slate-300">•••• (1234)</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

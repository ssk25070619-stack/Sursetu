import React, { useState, useEffect } from 'react';
import { UserRole, ROLE_CONFIGS, rbacService, RegisteredAccount, DEMO_DURATION_SECONDS } from '../services/rbacService';
import { SecurityService } from '../services/securityService';
import { IndigenousLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { 
  ShieldCheck, 
  GraduationCap, 
  Sparkles, 
  Lock, 
  School, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Database, 
  Globe, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Zap,
  Info,
  ChevronRight,
  HelpCircle,
  X,
  Clock,
  UserPlus,
  LogIn,
  AlertTriangle,
  RotateCcw,
  Users,
  Cloud
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, targetTab?: string) => void;
  selectedLanguage: IndigenousLanguage;
  onSelectLanguage: (lang: IndigenousLanguage) => void;
  onOpenDatabaseGuide?: () => void;
  onOpenSupabase?: () => void;
}

const STUDENT_AVATARS = [
  { emoji: '🦉', label: 'Wise Owl' },
  { emoji: '🦜', label: 'Forest Parrot' },
  { emoji: '🏹', label: 'Birsa Archer' },
  { emoji: '🐯', label: 'Royal Tiger' },
  { emoji: '🐘', label: 'Gajraj Elephant' },
  { emoji: '🌿', label: 'Sal Sprout' }
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  selectedLanguage,
  onSelectLanguage,
  onOpenDatabaseGuide,
  onOpenSupabase
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [name, setName] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [studentAvatar, setStudentAvatar] = useState<string>('🦉');
  const [studentGrade, setStudentGrade] = useState<string>('Grade 1');
  const [officerRole, setOfficerRole] = useState<string>('District Education Officer (DEO)');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState<boolean>(false);
  
  // Demo Quota & Lockout state
  const [demoStatus, setDemoStatus] = useState(rbacService.getDemoStatus());
  const [rateLimitStatus, setRateLimitStatus] = useState(SecurityService.checkRateLimit());
  const [showDemoLimitModal, setShowDemoLimitModal] = useState<boolean>(false);
  const [adminResetPin, setAdminResetPin] = useState<string>('');
  const [adminResetError, setAdminResetError] = useState<string>('');
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>([]);

  // Refresh demo & rate limit status periodically
  useEffect(() => {
    const updateStatus = () => {
      setDemoStatus(rbacService.getDemoStatus());
      setRegisteredAccounts(rbacService.getRegisteredAccounts());
      setRateLimitStatus(SecurityService.checkRateLimit());
    };
    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Switch form defaults when role changes (Blank fields - No default mock info)
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    setSuccessMessage('');
    setName('');
    setSchoolName('');
    setDistrict('');
    setPin('');
  };

  const handleSelectExistingAccount = (account: RegisteredAccount) => {
    setSelectedRole(account.role);
    setName(account.name);
    setSchoolName(account.schoolName);
    setDistrict(account.district);
    setPin(''); // Security hardening: Never prefill PIN! User must supply PIN.
    if (account.grade) setStudentGrade(account.grade);
    if (account.avatar) setStudentAvatar(account.avatar);
    setErrorMessage('');
    setSuccessMessage(
      account.role === 'student'
        ? `Loaded profile for ${account.name}`
        : `Loaded profile for ${account.name}. Please enter your 4-digit PIN.`
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const rateCheck = SecurityService.checkRateLimit();
    if (rateCheck.isLocked) {
      setErrorMessage(`Security Lockout Active: Too many failed PIN attempts. Please wait ${rateCheck.remainingSeconds}s.`);
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (selectedRole !== 'student' && (!pin || pin.trim().length < 4)) {
      setErrorMessage('Please enter your 4-digit Security PIN.');
      return;
    }

    setIsLoading(true);

    if (authMode === 'register') {
      const regRes = await rbacService.registerAccount({
        role: selectedRole,
        name: name.trim(),
        avatar: selectedRole === 'student' ? studentAvatar : ROLE_CONFIGS[selectedRole].avatar,
        grade: studentGrade,
        schoolName: schoolName.trim() || 'Govt. Primary Ashram School',
        district: district.trim() || 'Mayurbhanj',
        pin: selectedRole !== 'student' ? pin.trim() : '',
      });

      setIsLoading(false);
      if (regRes.success) {
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.65 }
          });
        } catch {}
        onLoginSuccess(selectedRole, ROLE_CONFIGS[selectedRole].defaultTab);
      } else {
        setErrorMessage(regRes.error || 'Could not register account in database. Please check details.');
      }
      return;
    }

    // Direct Database Login Validation
    const res = await rbacService.login({
      role: selectedRole,
      name: name.trim(),
      avatar: selectedRole === 'student' ? studentAvatar : ROLE_CONFIGS[selectedRole].avatar,
      grade: studentGrade,
      schoolName,
      district,
      emailOrId: selectedRole === 'official' ? officerRole : `${selectedRole}@sursetu.gov.in`,
      pin: selectedRole !== 'student' ? pin : undefined
    });

    setIsLoading(false);

    if (res.success) {
      if (selectedRole === 'student') {
        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {}
      }
      onLoginSuccess(selectedRole, ROLE_CONFIGS[selectedRole].defaultTab);
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify your details or register a new account.');
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    handleRoleSelect(role);
    const res = await rbacService.loginWithDemo(role);
    if (!res.success) {
      if (res.isDemoLimitReached) {
        setShowDemoLimitModal(true);
      } else {
        setErrorMessage(res.error || 'Demo login could not be initialized.');
      }
      return;
    }
    
    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
    onLoginSuccess(role, ROLE_CONFIGS[role].defaultTab);
  };

  const handleAdminResetDemo = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminResetError('');
    if (rbacService.resetDemoQuota(adminResetPin)) {
      setShowDemoLimitModal(false);
      setAdminResetPin('');
      setDemoStatus(rbacService.getDemoStatus());
      setSuccessMessage('✅ Device demo trial quota successfully reset! You can now use 1-Click Demo again.');
    } else {
      setAdminResetError('Invalid Admin PIN. (Default evaluator PIN is 1234)');
    }
  };

  const formatRemainingTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentRoleConfig = ROLE_CONFIGS[selectedRole];


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center py-10 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Dynamic Animated Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Tribal Script Watermarks */}
      <div className="absolute top-8 left-12 text-6xl text-emerald-500/5 font-bold font-olchiki select-none pointer-events-none">
        ᱚ ᱛ ᱜ ᱝ ᱞ
      </div>
      <div className="absolute bottom-12 right-12 text-7xl text-amber-500/5 font-bold font-olchiki select-none pointer-events-none">
        ᱥᱩᱨ ᱥᱮᱛᱩ
      </div>

      <div className="max-w-4xl w-full z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SIH 2026 • 100% Offline Edge Native Authentication</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              SurSetu
            </span>
            <span className="text-2xl sm:text-3xl text-slate-400 font-normal font-olchiki">
              (ᱥᱩᱨ ᱥᱮᱛᱩ • सुर सेतु)
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Role-Based Access Portal for Mother Tongue-Based Primary Education across Santali, Ho, and Mundari.
          </p>
        </div>

        {/* Device Demo Status Notification Banner */}
        {demoStatus.isLockedOut && !demoStatus.hasActiveSession && (
          <div className="p-3.5 rounded-2xl bg-amber-950/70 border border-amber-500/50 flex items-center justify-between gap-3 text-xs text-amber-200 shadow-lg">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>1-Click Demo Quota Used (1/1 on this device):</strong> Please sign in with your account or register a new offline account below for unlimited access.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowDemoLimitModal(true)}
              className="text-amber-300 hover:text-amber-100 underline text-[11px] font-bold shrink-0 cursor-pointer"
            >
              Reset Details
            </button>
          </div>
        )}

        {/* Anti-Brute-Force Rate Limiting Lockout Banner */}
        {rateLimitStatus.isLocked && (
          <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/70 flex items-center justify-between gap-3 text-xs text-red-200 shadow-xl animate-pulse">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                <strong>Anti-Brute-Force Lockout Active:</strong> Too many failed PIN attempts detected. Login is locked for your security ({rateLimitStatus.remainingSeconds}s cooldown remaining).
              </span>
            </div>
            <span className="font-mono font-bold text-red-400 bg-red-900/50 px-2 py-0.5 rounded-lg border border-red-500/30">
              {rateLimitStatus.remainingSeconds}s
            </span>
          </div>
        )}

        {demoStatus.hasActiveSession && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between gap-3 text-xs text-emerald-200 shadow-lg">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 animate-spin" />
              <span>
                <strong>Active Guest Demo Session:</strong> {formatRemainingTime(demoStatus.remainingSeconds)} remaining. Create a full account to preserve your streaks.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold hover:bg-emerald-500/30 cursor-pointer"
            >
              Save Account
            </button>
          </div>
        )}


        {/* 3-Persona Bento Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['teacher', 'student', 'official'] as UserRole[]).map((role) => {
            const config = ROLE_CONFIGS[role];
            const isSelected = selectedRole === role;
            return (
              <div
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? role === 'teacher'
                      ? 'bg-gradient-to-b from-emerald-950/70 to-slate-900 border-emerald-400/80 shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-500/30 -translate-y-1'
                      : role === 'student'
                      ? 'bg-gradient-to-b from-amber-950/70 to-slate-900 border-amber-400/80 shadow-xl shadow-amber-950/60 ring-2 ring-amber-500/30 -translate-y-1'
                      : 'bg-gradient-to-b from-indigo-950/70 to-slate-900 border-indigo-400/80 shadow-xl shadow-indigo-950/60 ring-2 ring-indigo-500/30 -translate-y-1'
                    : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-950/60 border border-slate-800">
                      {config.icon}
                    </span>
                    {isSelected ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active Role
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                        Persona
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base sm:text-lg">
                    {config.title.split('/')[0].trim()}
                  </h3>
                  <p className="text-xs font-semibold text-amber-300 font-olchiki mt-0.5">
                    {config.nativeTitle}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {config.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    {config.allowedTabs.length} Modules Allowed
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickDemoLogin(role);
                    }}
                    className={`font-bold flex items-center gap-1 text-[11px] underline underline-offset-2 cursor-pointer transition ${
                      demoStatus.isLockedOut && !demoStatus.hasActiveSession
                        ? 'text-slate-500 hover:text-amber-400'
                        : 'text-amber-400 hover:text-amber-300'
                    }`}
                    title={
                      demoStatus.isLockedOut && !demoStatus.hasActiveSession
                        ? '1-Click Demo limit reached (1/1). Click to unlock or create account.'
                        : 'Instant 1-Click Demo Session'
                    }
                  >
                    {demoStatus.isLockedOut && !demoStatus.hasActiveSession ? (
                      <>
                        <Lock className="w-3 h-3 text-amber-500" />
                        <span>Demo (1/1 Used)</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>Quick Demo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Interactive Auth Box with Mode Switcher (Sign In vs Register) */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative ring-1 ring-white/5">
          {/* Header Row: Title, Dialect, and Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentRoleConfig.icon}</span>
                <h2 className="text-xl font-bold text-white">
                  {authMode === 'register' ? 'Register New Offline Account' : `${currentRoleConfig.title} Login`}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'register'
                  ? 'Create an offline local profile saved on this edge device.'
                  : 'Authenticating on local edge store • Zero cloud connection required.'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Auth Mode Toggle Tabs */}
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Language Selector Pill */}
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
                <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
                <span className="text-slate-400 text-[11px] hidden xs:inline">Dialect:</span>
                <div className="flex gap-1">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => onSelectLanguage(lang.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        selectedLanguage === lang.id
                          ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lang.shortCode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Select of Pre-Registered Accounts on this device */}
          {registeredAccounts.length > 0 && authMode === 'signin' && (
            <div className="mb-5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Users className="w-3.5 h-3.5" />
                  Saved Accounts on this Device ({registeredAccounts.length}):
                </span>
                <span className="text-[10px] text-slate-500">1-Tap to Autofill</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {registeredAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectExistingAccount(acc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-emerald-500/50 text-xs text-slate-200 hover:text-white transition cursor-pointer"
                  >
                    <span>{acc.avatar || ROLE_CONFIGS[acc.role].avatar}</span>
                    <span className="font-medium">{acc.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                      {acc.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Persona: STUDENT */}
            {selectedRole === 'student' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Pick Your Learning Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {STUDENT_AVATARS.map((av) => (
                      <button
                        key={av.emoji}
                        type="button"
                        onClick={() => setStudentAvatar(av.emoji)}
                        className={`p-3 rounded-2xl text-2xl border transition-all duration-200 flex flex-col items-center gap-1 cursor-pointer ${
                          studentAvatar === av.emoji
                            ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-950/50 scale-105'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span>{av.emoji}</span>
                        <span className="text-[9px] text-slate-400 font-medium truncate w-full text-center">
                          {av.label.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Student / Learner Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter student / learner name"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Class / Grade Level
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Balvatika', 'Grade 1', 'Grade 2', 'Grade 3'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setStudentGrade(g)}
                          className={`py-2 px-1 text-xs rounded-xl border font-semibold transition cursor-pointer ${
                            studentGrade === g
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>
                    <strong>Child-Safe Mode Active:</strong> Direct access to illustrated bilingual readers, 3D animated flashcards, and gamified tribal quests without complex passwords.
                  </span>
                </div>
              </div>
            )}

            {/* Persona: TEACHER */}
            {selectedRole === 'teacher' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Teacher Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter registered teacher name"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      School / Ashram Name
                    </label>
                    <div className="relative flex items-center">
                      <School className="w-4 h-4 text-slate-500 absolute left-3.5" />
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="Govt. Primary Ashram School"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      District / Block
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5" />
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Mayurbhanj / Dumka / Khunti"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        {authMode === 'register' ? 'Set 4-Digit Security PIN' : 'Teacher Security PIN'}
                      </label>
                    </div>
                    <div className="relative flex items-center">
                      <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5" />
                      <input
                        type={showPin ? 'text' : 'password'}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter 4-digit PIN"
                        maxLength={6}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin((prev) => !prev)}
                        className="absolute right-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Persona: OFFICIAL */}
            {selectedRole === 'official' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Official Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter official full name"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Designation / Role
                    </label>
                    <select
                      value={officerRole}
                      onChange={(e) => setOfficerRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                    >
                      <option value="District Education Officer (DEO)">District Education Officer (DEO)</option>
                      <option value="Block Resource Center Coordinator (BRCC)">Block Resource Center Coordinator (BRCC)</option>
                      <option value="State NIPUN Bharat FLN Evaluator">State NIPUN Bharat FLN Evaluator</option>
                      <option value="Ministry of Tribal Affairs Observer">Ministry of Tribal Affairs Observer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Administrative District
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5" />
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Mayurbhanj / Dumka"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        {authMode === 'register' ? 'Set 4-Digit Security PIN' : 'Admin Security PIN'}
                      </label>
                    </div>
                    <div className="relative flex items-center">
                      <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5" />
                      <input
                        type={showPin ? 'text' : 'password'}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter 4-digit PIN"
                        maxLength={6}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin((prev) => !prev)}
                        className="absolute right-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isLoading || rateLimitStatus.isLocked}
                className={`w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  rateLimitStatus.isLocked
                    ? 'bg-slate-800 text-slate-400 border border-slate-700'
                    : selectedRole === 'teacher'
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/80 glow-emerald'
                    : selectedRole === 'student'
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-950/80 font-extrabold glow-amber'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-950/80'
                }`}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : rateLimitStatus.isLocked ? (
                  <>
                    <Lock className="w-4 h-4 text-red-400" />
                    <span>Locked ({rateLimitStatus.remainingSeconds}s)</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'register' ? 'Register Local Account' : `Enter ${currentRoleConfig.badge}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>


              {/* 1-Click Demo Button with Quota / Timer Guard */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(selectedRole)}
                className={`w-full sm:w-auto py-3.5 px-5 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  demoStatus.isLockedOut && !demoStatus.hasActiveSession
                    ? 'bg-slate-950 border-slate-800 text-slate-500 hover:text-amber-400 hover:border-amber-500/40'
                    : 'bg-slate-950 hover:bg-slate-850 border-amber-500/40 hover:border-amber-400 text-amber-300 shadow-md shadow-amber-950/20'
                }`}
                title={
                  demoStatus.isLockedOut && !demoStatus.hasActiveSession
                    ? '1-Click Demo limit reached. Only 1 demo session allowed per device.'
                    : '1-Click Demo: 10-minute preview session'
                }
              >
                {demoStatus.isLockedOut && !demoStatus.hasActiveSession ? (
                  <>
                    <Lock className="w-4 h-4 text-amber-500/80" />
                    <span>Demo (1/1 Used)</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>1-Click Demo</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Footer Links */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => setIsMatrixOpen(true)}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare Role Permissions Matrix</span>
            </button>

            {onOpenDatabaseGuide && (
              <button
                type="button"
                onClick={onOpenDatabaseGuide}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Database Connectivity Architecture</span>
              </button>
            )}

            {onOpenSupabase && (
              <button
                type="button"
                onClick={onOpenSupabase}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Cloud Sync</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1-Click Demo Limit Lockout Modal ("Just Once Rule") */}
      {showDemoLimitModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Demo Limit Reached (1/1 per Device)</h3>
                  <p className="text-xs text-amber-300/80 mt-0.5">Strict Device Trial Policy Enforced</p>
                </div>
              </div>
              <button
                onClick={() => setShowDemoLimitModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-300">
              <p>
                To prevent accidental loss of student progress, lesson notes, and ASR diagnostics, guest demo logins on this device are limited to <strong>one 10-minute session</strong> without an account.
              </p>
              <p className="text-amber-300 font-medium">
                💡 Create a free local account in 10 seconds to unlock unlimited, permanent access on this device!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDemoLimitModal(false);
                  setAuthMode('register');
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Free Local Account</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDemoLimitModal(false);
                  setAuthMode('signin');
                }}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Sign In with PIN
              </button>
            </div>

            {/* Evaluator / District Admin Reset Section */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <details className="text-xs text-slate-400">
                <summary className="cursor-pointer text-slate-400 hover:text-slate-300 flex items-center gap-1 font-semibold">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Evaluator / Admin Device Reset Bypass</span>
                </summary>
                <form onSubmit={handleAdminResetDemo} className="mt-3 space-y-2">
                  <p className="text-[11px] text-slate-400">
                    SIH Evaluators can reset the device quota using the Master PIN (<code className="text-emerald-400 font-mono">1234</code>):
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={adminResetPin}
                      onChange={(e) => setAdminResetPin(e.target.value)}
                      placeholder="Enter Admin PIN (1234)"
                      maxLength={6}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer"
                    >
                      Reset Quota
                    </button>
                  </div>
                  {adminResetError && (
                    <p className="text-red-400 text-[11px]">{adminResetError}</p>
                  )}
                </form>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* Role Permissions Matrix Modal */}
      {isMatrixOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg text-white">SurSetu Role-Based Access Matrix</h3>
              </div>
              <button
                onClick={() => setIsMatrixOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Module / Tab</th>
                    <th className="py-2.5 px-3 text-center">🎒 Student</th>
                    <th className="py-2.5 px-3 text-center">🧑‍🏫 Teacher</th>
                    <th className="py-2.5 px-3 text-center">🏛️ Official</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[
                    { name: 'Bilingual Story Reader', s: true, t: true, o: true },
                    { name: 'Pronunciation Studio (Vosk ASR)', s: true, t: true, o: false },
                    { name: 'Gamified Tribal Quest (Arcade)', s: true, t: true, o: false },
                    { name: 'Interactive Barakhadi Chart', s: true, t: true, o: false },
                    { name: '3D Dual Flashcards', s: true, t: true, o: false },
                    { name: '6-Layer Dialect Translation Hub', s: false, t: true, o: true },
                    { name: 'Sur Saathi Pedagogical Co-Pilot', s: false, t: true, o: false },
                    { name: 'NIPUN Bharat Worksheet Studio', s: false, t: true, o: true },
                    { name: 'Official District Compliance Radar', s: false, t: false, o: true },
                    { name: 'Acoustic Misconception Diagnostics', s: false, t: true, o: true },
                    { name: 'System Architecture & Edge API', s: false, t: true, o: true },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-medium text-slate-200">{row.name}</td>
                      <td className="py-2 px-3 text-center">{row.s ? '✅' : '❌'}</td>
                      <td className="py-2 px-3 text-center">{row.t ? '✅' : '❌'}</td>
                      <td className="py-2 px-3 text-center">{row.o ? '✅' : '❌'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setIsMatrixOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

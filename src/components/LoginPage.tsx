import React, { useState } from 'react';
import { UserRole, ROLE_CONFIGS, rbacService } from '../services/rbacService';
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
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, targetTab?: string) => void;
  selectedLanguage: IndigenousLanguage;
  onSelectLanguage: (lang: IndigenousLanguage) => void;
  onOpenDatabaseGuide?: () => void;
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
  onOpenDatabaseGuide
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [name, setName] = useState<string>('Santhal Primary Educator');
  const [schoolName, setSchoolName] = useState<string>('Govt. Primary Ashram School, Baripada');
  const [district, setDistrict] = useState<string>('Mayurbhanj');
  const [pin, setPin] = useState<string>('1234');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [studentAvatar, setStudentAvatar] = useState<string>('🦉');
  const [studentGrade, setStudentGrade] = useState<string>('Grade 1');
  const [officerRole, setOfficerRole] = useState<string>('District Education Officer (DEO)');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState<boolean>(false);

  // Switch form defaults when role changes
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'teacher') {
      setName('Santhal Primary Educator');
      setSchoolName('Govt. Primary Ashram School, Baripada');
      setDistrict('Mayurbhanj');
      setPin('1234');
    } else if (role === 'student') {
      setName('Sunaram Murmu');
      setSchoolName('Baripada Tribal Primary Ashram');
      setDistrict('Mayurbhanj');
      setPin('');
    } else if (role === 'official') {
      setName('Dr. A. K. Patnaik');
      setSchoolName('Dept. of School & Mass Education');
      setDistrict('Mayurbhanj District HQ');
      setPin('1234');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = rbacService.login({
        role: selectedRole,
        name: name.trim() || (selectedRole === 'teacher' ? 'Primary Educator' : selectedRole === 'student' ? 'Tribal Learner' : 'District Official'),
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
          } catch {
            // ignore confetti fallback
          }
        }
        onLoginSuccess(selectedRole, ROLE_CONFIGS[selectedRole].defaultTab);
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify your details.');
      }
    }, 350);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    handleRoleSelect(role);
    setTimeout(() => {
      rbacService.login({
        role,
        name: role === 'teacher' ? 'Santhal Primary Educator' : role === 'student' ? 'Sunaram Murmu (Student)' : 'Dr. Patnaik (District Admin)',
        avatar: role === 'student' ? '🏹' : ROLE_CONFIGS[role].avatar,
        grade: 'Grade 1',
        schoolName: 'Govt. Primary Ashram School, Mayurbhanj',
        district: 'Mayurbhanj',
        pin: '1234'
      });
      onLoginSuccess(role, ROLE_CONFIGS[role].defaultTab);
    }, 150);
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

      <div className="max-w-4xl w-full z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-inner">
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
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[11px] underline underline-offset-2 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" /> Quick Demo
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Interactive Login Box */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative ring-1 ring-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentRoleConfig.icon}</span>
                <h2 className="text-xl font-bold text-white">
                  {currentRoleConfig.title} Login
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Authenticating on local edge store • Zero cloud connection required.
              </p>
            </div>

            {/* Language Selector Pill */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
              <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
              <span className="text-slate-400 text-[11px]">Dialect:</span>
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

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 animate-shake">
                <X className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
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
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                          studentAvatar === av.emoji
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg ring-2 ring-amber-500/40'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="text-2xl">{av.emoji}</span>
                        <span className="text-[9px] font-medium truncate w-full text-center">{av.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Student Nickname / Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sunaram / Mangal"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Class / Grade Level
                    </label>
                    <div className="flex gap-2">
                      {['Grade 1', 'Grade 2', 'Grade 3'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setStudentGrade(g)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            studentGrade === g
                              ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
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
                        placeholder="e.g. Ramesh Chandra Murmu"
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
                        Teacher Security PIN
                      </label>
                      <span className="text-[10px] text-emerald-400 font-mono">Demo PIN: 1234</span>
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
                        placeholder="Dr. A. K. Patnaik"
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
                        placeholder="Mayurbhanj District HQ"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Admin Security PIN
                      </label>
                      <span className="text-[10px] text-indigo-400 font-mono">Demo PIN: 1234</span>
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
                disabled={isLoading}
                className={`w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-xl cursor-pointer ${
                  selectedRole === 'teacher'
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/80 glow-emerald'
                    : selectedRole === 'student'
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-950/80 font-extrabold glow-amber'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-950/80'
                }`}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter {currentRoleConfig.badge}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin(selectedRole)}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="Log in with pre-filled demo data instantly"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>1-Click Demo</span>
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
          </div>
        </div>
      </div>

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
                    <th className="py-2.5 px-3 text-emerald-400">👨‍🏫 Teacher</th>
                    <th className="py-2.5 px-3 text-amber-400">🎒 Student</th>
                    <th className="py-2.5 px-3 text-indigo-400">🏛️ Official</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2 px-3 font-semibold">📖 Bilingual Reader (FLN)</td>
                    <td className="py-2 px-3 text-emerald-400">✅ Allowed</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">⭐ Primary</td>
                    <td className="py-2 px-3 text-emerald-400">✅ Allowed</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">🎙️ Speech Studio (Vosk ASR)</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">⭐ Full ASR</td>
                    <td className="py-2 px-3 text-emerald-400">✅ Read-Only</td>
                    <td className="py-2 px-3 text-slate-500">❌ Locked</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">🌐 6-Layer Translation Hub</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">⭐ Full Access</td>
                    <td className="py-2 px-3 text-slate-500">❌ Locked</td>
                    <td className="py-2 px-3 text-emerald-400">✅ Audit Mode</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">🤖 Sur Saathi AI Co-Pilot</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">⭐ Full Co-Pilot</td>
                    <td className="py-2 px-3 text-slate-500">❌ Locked</td>
                    <td className="py-2 px-3 text-slate-500">❌ Locked</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">📝 NIPUN Bharat Worksheet Studio</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">⭐ A4 Generator</td>
                    <td className="py-2 px-3 text-slate-500">❌ Locked</td>
                    <td className="py-2 px-3 text-emerald-400">✅ Verify Mode</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">🃏 3D Flashcards & Games</td>
                    <td className="py-2 px-3 text-emerald-400">✅ Allowed</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">⭐ Primary</td>
                    <td className="py-2 px-3 text-slate-500">❌ Locked</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">🏹 Tribal Quest Arcade</td>
                    <td className="py-2 px-3 text-emerald-400">✅ Allowed</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">⭐ Primary</td>
                    <td className="py-2 px-3 text-slate-500">❌ Locked</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">🔤 Barakhadi Wall Chart</td>
                    <td className="py-2 px-3 text-emerald-400">✅ Allowed</td>
                    <td className="py-2 px-3 text-emerald-400">✅ Allowed</td>
                    <td className="py-2 px-3 text-slate-500">❌ Locked</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">🧠 Learning Diagnostics</td>
                    <td className="py-2 px-3 text-emerald-400">✅ Allowed</td>
                    <td className="py-2 px-3 text-slate-500">❌ Locked</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">⭐ Primary</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">🏛️ District Official Dashboard</td>
                    <td className="py-2 px-3 text-slate-500">❌ Locked</td>
                    <td className="py-2 px-3 text-slate-500">❌ Locked</td>
                    <td className="py-2 px-3 text-indigo-400 font-bold">⭐ Primary (PIN)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsMatrixOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
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

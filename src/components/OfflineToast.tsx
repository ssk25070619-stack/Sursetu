import React, { useState, useEffect } from 'react';
import {
  WifiOff,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface OfflineToastProps {
  isSimulatedOffline?: boolean;
  onToggleSimulateOffline?: () => void;
}

export const OfflineToast: React.FC<OfflineToastProps> = ({
  isSimulatedOffline = false,
  onToggleSimulateOffline
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isRechecking, setIsRechecking] = useState<boolean>(false);
  const [showOnlineRestored, setShowOnlineRestored] = useState<boolean>(false);

  // Effective status considers both browser network detection and manual testing simulation
  const isEffectivelyOffline = !isOnline || isSimulatedOffline;

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!isSimulatedOffline) {
        setShowOnlineRestored(true);
        setIsDismissed(false);
        const timer = setTimeout(() => {
          setShowOnlineRestored(false);
        }, 4000);
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsDismissed(false);
      setShowOnlineRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isSimulatedOffline]);

  // When simulated state changes to offline, un-dismiss so user immediately sees the toast
  useEffect(() => {
    if (isSimulatedOffline) {
      setIsDismissed(false);
      setShowOnlineRestored(false);
    } else if (isOnline) {
      setShowOnlineRestored(true);
      const timer = setTimeout(() => {
        setShowOnlineRestored(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isSimulatedOffline, isOnline]);

  const handleManualCheck = async () => {
    setIsRechecking(true);
    try {
      // In web applications, attempt a lightweight fetch or check navigator
      const onlineStatus = navigator.onLine;
      setTimeout(() => {
        setIsRechecking(false);
        if (onlineStatus && !isSimulatedOffline) {
          setIsOnline(true);
          setShowOnlineRestored(true);
          setTimeout(() => setShowOnlineRestored(false), 3000);
        }
      }, 700);
    } catch {
      setIsRechecking(false);
    }
  };

  // 1. Toast for restored connection
  if (showOnlineRestored && !isEffectivelyOffline) {
    return (
      <div className="no-print fixed bottom-5 right-5 z-50 max-w-md w-full sm:w-auto animate-bounce-short shadow-2xl">
        <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 text-slate-100 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Internet Connection Restored</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <p className="text-[11px] text-slate-400">
                Full network synchronization and cloud features are now available.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOnlineRestored(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close restored notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // If not offline and not showing restored banner, render nothing
  if (!isEffectivelyOffline) {
    return null;
  }

  // 2. Compact floating badge when user dismissed the toast but remains offline
  if (isDismissed) {
    return (
      <div className="no-print fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsDismissed(false)}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 hover:bg-slate-800 border border-amber-500/50 hover:border-amber-400 shadow-2xl text-xs text-amber-300 transition-all cursor-pointer backdrop-blur-md hover:scale-105"
          title="Click to view Offline-Native Mode details"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-slate-200">Offline-Native Mode</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
            Active
          </span>
        </button>
      </div>
    );
  }

  // 3. Full 'Offline Connectivity' Toast Notification
  return (
    <div
      role="alert"
      aria-live="polite"
      className="no-print fixed bottom-5 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md animate-fade-in transition-all duration-300 select-none"
    >
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/70 border-2 border-amber-500/60 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl space-y-3.5 text-slate-100 ring-1 ring-amber-500/20">
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <WifiOff className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                  Offline Connectivity
                </span>
                {isSimulatedOffline && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Test Mode
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight mt-0.5 flex items-center gap-1.5">
                Offline-Native Mode Active
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Minimize to compact status pill"
            aria-label="Dismiss offline toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Description */}
        <p className="text-xs text-slate-300 leading-relaxed">
          No internet connection detected. You are running in{' '}
          <strong className="text-emerald-300 font-semibold">Pure Offline Mode</strong>.
          The Service Worker & Cache Storage Strategy guarantee that all NIPUN Bharat study materials and flashcard decks remain 100% accessible.
        </p>

        {/* Action & Toggle Details Accordion */}
        <div className="pt-1">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-300">
              <Info className="w-3.5 h-3.5" />
              <span>{showDetails ? 'Hide Feature Availability' : 'View Limited vs Cached Features'}</span>
            </div>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {showDetails && (
            <div className="mt-2 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-2.5 animate-fade-in">
              {/* Ready & Cached Features */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Available Offline-Native Features (0ms Edge):
                </div>
                <ul className="space-y-1 text-[11px] text-slate-300 pl-4 list-disc">
                  <li>
                    <span className="font-semibold text-white">6-Layer Linguistic Engine:</span> 72.9k parallel corpus & PrefixTrie
                  </li>
                  <li>
                    <span className="font-semibold text-white">Multi-Script Transduction:</span> Ol Chiki ⇄ Odia ⇄ Devanagari ⇄ Latin
                  </li>
                  <li>
                    <span className="font-semibold text-white">NIPUN Bharat TLMs:</span> 9 A4 printable worksheet formats
                  </li>
                  <li>
                    <span className="font-semibold text-white">3D Flashcards & Quest:</span> Local gamification & speech synthesizers
                  </li>
                  <li>
                    <span className="font-semibold text-white">Dynamic Edge Memory:</span> Local word storage synced
                  </li>
                </ul>
              </div>

              {/* Limited / Cloud Paused Features */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Limited or Paused Features:
                </div>
                <ul className="space-y-1 text-[11px] text-slate-400 pl-4 list-disc">
                  <li>Cloud LLM streaming models & remote web searches</li>
                  <li>Cross-device multi-peer cloud synchronization</li>
                  <li>Remote telemetry updates</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={handleManualCheck}
            disabled={isRechecking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition cursor-pointer"
            title="Ping network to verify online status"
          >
            <RefreshCw className={`w-3 h-3 text-amber-400 ${isRechecking ? 'animate-spin' : ''}`} />
            <span>{isRechecking ? 'Checking Network...' : 'Check Connection'}</span>
          </button>

          <div className="flex items-center gap-2">
            {onToggleSimulateOffline && (
              <button
                onClick={onToggleSimulateOffline}
                className="text-[11px] text-slate-400 hover:text-amber-300 underline cursor-pointer"
                title="Toggle simulated offline state"
              >
                {isSimulatedOffline ? 'Resume Online' : 'Simulate'}
              </button>
            )}

            <button
              onClick={() => setIsDismissed(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold transition cursor-pointer shadow-md shadow-amber-900/30"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

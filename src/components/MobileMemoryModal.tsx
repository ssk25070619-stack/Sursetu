import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Trash2,
  X,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  Battery
} from 'lucide-react';
import { lowMemoryService, MemoryStats } from '../services/lowMemoryService';

interface MobileMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMemoryModal: React.FC<MobileMemoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [stats, setStats] = useState<MemoryStats>(lowMemoryService.getMemoryStats());
  const [purgeFeedback, setPurgeFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = lowMemoryService.subscribe((newStats) => {
      setStats(newStats);
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePurge = () => {
    lowMemoryService.triggerHaptic('success');
    const result = lowMemoryService.purgeMemoryHeap();
    setPurgeFeedback(`Freed ${result.freedUrls} cached audio objects (~${result.estimatedFreedMB}MB)`);
    setTimeout(() => setPurgeFeedback(null), 3000);
  };

  const handleToggleMode = (enabled: boolean) => {
    lowMemoryService.triggerHaptic('medium');
    lowMemoryService.setUltraLowMode(enabled);
  };

  // Compute memory safety status
  const memoryUsagePct = stats.heapLimitMB > 0 ? Math.round((stats.usedHeapMB / stats.heapLimitMB) * 100) : 15;
  const isHealthy = stats.usedHeapMB < 80;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-md rounded-3xl bg-slate-900/98 border border-emerald-500/40 shadow-2xl p-5 text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                2 GB RAM Mobile Engine
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  ACTIVE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Low-Memory Android Go & Entry-Level Phone Optimization
              </p>
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

        {/* Device Profile Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Hardware Detection
            </span>
            <span className="font-mono font-bold text-emerald-400">
              {stats.deviceMemoryGB} GB RAM • {stats.cpuCores} CPU Cores
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">JS Heap In-Use</span>
              <span className="font-mono text-base font-bold text-white">
                {stats.usedHeapMB} <span className="text-xs text-slate-400">MB</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Active Blob URLs</span>
              <span className="font-mono text-base font-bold text-amber-300">
                {stats.cachedBlobsCount} <span className="text-xs text-slate-400">items</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2GB RAM Mode Toggle */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-slate-950 border border-emerald-500/30 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-white block">
              Ultra-Low RAM Mode (2 GB Target)
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Reduces memory by throttling continuous blurs, audio buffers & heavy DOMs.
            </p>
          </div>
          <button
            onClick={() => handleToggleMode(!stats.isUltraLowMode)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer shrink-0 border ${
              stats.isUltraLowMode
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {stats.isUltraLowMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Active Optimizations Checklist */}
        <div className="space-y-1.5 text-xs text-slate-300">
          <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400 px-1">
            Active 2 GB RAM Safeguards
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong>Audio Memory Cap:</strong> Max 15 in-memory buffers (overflow offloaded to IndexedDB).
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong>Hardware Acceleration:</strong> GPU-composited layers (`translateZ(0)`) to free CPU.
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong>Zero-Lag Haptics:</strong> Native vibration feedback replaces heavy render redraws.
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong>Auto Garbage Collector:</strong> Auto-purges heap every 15s if heap &gt; 60MB.
              </span>
            </div>
          </div>
        </div>

        {/* Purge Memory Button */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handlePurge}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>1-Tap Deep Memory Purge (Clean Heap)</span>
          </button>
          {purgeFeedback && (
            <p className="text-center text-xs text-emerald-400 font-semibold animate-fade-in">
              ✨ {purgeFeedback}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Cpu,
  Cloud,
  Zap,
  ShieldCheck,
  Key,
  Volume2,
  Database,
  Trash2,
  RefreshCw,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
  Sliders,
} from 'lucide-react';
import { hybridRoutingService, RoutingMode, HybridConfig } from '../services/hybridRoutingService';
import { audioCacheService } from '../services/audioCacheService';

interface HybridConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
}

export const HybridConfigModal: React.FC<HybridConfigModalProps> = ({
  isOpen,
  onClose,
  isOnline,
}) => {
  const [config, setConfig] = useState<HybridConfig>(hybridRoutingService.getConfig());
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [cacheStats, setCacheStats] = useState<{
    memoryCount: number;
    dbCount: number;
    totalSizeBytes: number;
    hitRate: number;
    totalRequests: number;
  }>({
    memoryCount: 0,
    dbCount: 0,
    totalSizeBytes: 0,
    hitRate: 0,
    totalRequests: 0,
  });
  const [isClearingCache, setIsClearingCache] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(hybridRoutingService.getConfig());
      loadCacheStats();
    }
  }, [isOpen]);

  const loadCacheStats = async () => {
    const stats = await audioCacheService.getStats();
    setCacheStats(stats);
  };

  if (!isOpen) return null;

  const handleSave = () => {
    hybridRoutingService.updateConfig(config);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 600);
  };

  const handleClearAudioCache = async () => {
    setIsClearingCache(true);
    await audioCacheService.clearCache();
    await loadCacheStats();
    setIsClearingCache(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hybrid Engine & Voice Cache Configuration</h3>
              <p className="text-xs text-slate-400">Offline-First Baseline + Optional Online Augmentation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 1. Routing Mode */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Translation Routing Policy</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Mode A: Pure Offline */}
              <button
                onClick={() => setConfig({ ...config, mode: 'offline_only' })}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  config.mode === 'offline_only'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    0.008ms
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-100">1. Pure Offline</h5>
                <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                  100% air-gapped. Rule Trie + INT8 neural model only.
                </p>
              </button>

              {/* Mode B: Hybrid Auto */}
              <button
                onClick={() => setConfig({ ...config, mode: 'hybrid_auto' })}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  config.mode === 'hybrid_auto'
                    ? 'bg-amber-950/40 border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                    Auto
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-100">2. Hybrid Auto</h5>
                <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                  Offline first. Cloud falls back only for novel phrases.
                </p>
              </button>

              {/* Mode C: Cloud Priority */}
              <button
                onClick={() => setConfig({ ...config, mode: 'cloud_priority' })}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  config.mode === 'cloud_priority'
                    ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Cloud className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-bold">
                    Cloud
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-100">3. Cloud Priority</h5>
                <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                  Gemini API for open-domain queries when online.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Optional Gemini API Key */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Optional Gemini API Key (For Cloud Augmentation)</span>
              </label>
              <span className="text-[10px] text-slate-500">Stored locally in browser</span>
            </div>

            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={config.geminiApiKey}
                onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full text-xs font-mono py-2.5 px-3 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition cursor-pointer"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 3. Audio & Voice Cache Stats */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Voice & Speech Cache (Dual-Tier)</span>
              </label>
              <button
                onClick={loadCacheStats}
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-center">
              <div>
                <span className="text-lg font-bold text-emerald-400 font-mono">{cacheStats.dbCount}</span>
                <p className="text-[10px] text-slate-400 mt-0.5">IndexedDB Blobs</p>
              </div>
              <div>
                <span className="text-lg font-bold text-amber-300 font-mono">
                  {Math.round(cacheStats.totalSizeBytes / 1024)} KB
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Cached Footprint</p>
              </div>
              <div>
                <span className="text-lg font-bold text-indigo-400 font-mono">{cacheStats.hitRate}%</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Sub-ms Hit Rate</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleClearAudioCache}
                disabled={isClearingCache || cacheStats.dbCount === 0}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isClearingCache ? 'Clearing...' : 'Clear Voice Cache'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}
            />
            <span>{isOnline ? 'Online Connectivity Detected' : 'Dark Zone / Airplane Mode'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

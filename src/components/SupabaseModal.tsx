import React, { useState, useEffect } from 'react';
import { supabaseService, SupabaseConfig } from '../services/supabaseService';
import { rbacService } from '../services/rbacService';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  X,
  Server,
  Key,
  Globe,
  UploadCloud,
  Check
} from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<SupabaseConfig>(supabaseService.getConfig());
  const [url, setUrl] = useState(config.url);
  const [anonKey, setAnonKey] = useState(config.anonKey);
  const [autoSync, setAutoSync] = useState(config.autoSync);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ syncedCount: number; error?: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'connect' | 'sync' | 'schema'>('connect');

  useEffect(() => {
    if (isOpen) {
      const current = supabaseService.getConfig();
      setConfig(current);
      setUrl(current.url);
      setAnonKey(current.anonKey);
      setAutoSync(current.autoSync);
      setTestResult(null);
      setSyncResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    supabaseService.saveConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      autoSync
    });
    setTestResult({
      success: true,
      message: 'Configuration saved! Click "Test Live Connection" to verify.'
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    // Save first
    supabaseService.saveConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      autoSync
    });
    const res = await supabaseService.testConnection();
    setIsTesting(false);
    setTestResult(res);
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    const localAccounts = rbacService.getRegisteredAccounts();
    const res = await supabaseService.syncLocalUsersToCloud(localAccounts);
    setIsSyncing(false);
    setSyncResult(res);
  };

  const sqlSchemaSnippet = `-- 🌿 SurSetu 3.0 Supabase SQL Quick Setup
CREATE TABLE IF NOT EXISTS public.sursetu_users (
    id TEXT PRIMARY KEY,
    role TEXT CHECK (role IN ('teacher', 'student', 'official')) NOT NULL,
    name TEXT NOT NULL,
    school_name TEXT NOT NULL,
    district TEXT NOT NULL,
    grade TEXT,
    avatar TEXT,
    pin_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sursetu_student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL REFERENCES public.sursetu_users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    language TEXT NOT NULL,
    module TEXT NOT NULL,
    score REAL DEFAULT 100.0,
    school_name TEXT NOT NULL,
    district TEXT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sursetu_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read/write access" ON public.sursetu_users FOR ALL USING (true);`;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Supabase Cloud Integration</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  PostgreSQL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Opportunistic Cloud Sync for State NIPUN Bharat Telemetry & Central Auth
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('connect')}
            className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'connect'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Connection Config</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'sync'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Sync Local Edge Data</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`flex-1 py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQL Schema DDL</span>
          </button>
        </div>

        {/* TAB 1: CONNECTION CONFIG */}
        {activeTab === 'connect' && (
          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Supabase Project URL (VITE_SUPABASE_URL)
                </label>
                <div className="relative flex items-center">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-project-ref.supabase.co"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY)
                </label>
                <div className="relative flex items-center">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5" />
                  <input
                    type="password"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoSync"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="autoSync" className="text-slate-300 cursor-pointer">
                  Automatically sync edge accounts & test scores when internet is detected
                </label>
              </div>
            </div>

            {/* Test Result Message */}
            {testResult && (
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 animate-fade-in ${
                  testResult.success
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                    : 'bg-red-950/70 border-red-500/50 text-red-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-semibold">{testResult.message}</span>
                  {testResult.latencyMs && (
                    <span className="block text-[10px] text-emerald-400 font-mono mt-0.5">
                      Roundtrip Ping: {testResult.latencyMs}ms
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition cursor-pointer"
              >
                {isTesting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 text-amber-300" />
                )}
                <span>{isTesting ? 'Testing Supabase Cloud...' : 'Test Live Connection'}</span>
              </button>

              <button
                type="submit"
                className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SYNC LOCAL EDGE DATA */}
        {activeTab === 'sync' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>Opportunistic Offline Edge &rarr; Supabase Gateway</span>
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                When teachers or students use SurSetu in remote classrooms, accounts and quiz progress are stored locally on the device. When connectivity is restored, this gateway syncs records to Supabase.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-800/80">
                <span>Local Registered Accounts:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {rbacService.getRegisteredAccounts().length} accounts ready
                </span>
              </div>
            </div>

            {syncResult && (
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-fade-in ${
                  syncResult.error
                    ? 'bg-red-950/70 border-red-500/50 text-red-200'
                    : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                }`}
              >
                {syncResult.error ? (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>
                  {syncResult.error
                    ? `Sync failed: ${syncResult.error}`
                    : `✅ Successfully synced ${syncResult.syncedCount} edge account(s) to Supabase Cloud!`}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition cursor-pointer"
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              <span>{isSyncing ? 'Syncing to Supabase...' : 'Sync Local Edge Accounts to Cloud'}</span>
            </button>
          </div>
        )}

        {/* TAB 3: SQL SCHEMA */}
        {activeTab === 'schema' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">
                Copy and run this SQL in your Supabase project SQL Editor:
              </span>
              <button
                type="button"
                onClick={handleCopySQL}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold cursor-pointer transition"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 overflow-x-auto max-h-56 leading-relaxed">
              {sqlSchemaSnippet}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

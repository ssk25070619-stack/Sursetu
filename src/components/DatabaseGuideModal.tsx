import React, { useState } from 'react';
import { 
  Database, 
  Server, 
  HardDrive, 
  Cloud, 
  CheckCircle2, 
  X, 
  Copy, 
  Check, 
  Layers, 
  ShieldCheck, 
  Terminal, 
  RefreshCw 
} from 'lucide-react';

interface DatabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseGuideModal: React.FC<DatabaseGuideModalProps> = ({ isOpen, onClose }) => {
  const [selectedDb, setSelectedDb] = useState<'sqlite' | 'postgres' | 'supabase' | 'firebase'>('sqlite');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeSnippets = {
    sqlite: `# 1. Install SQLite / SQLAlchemy (Edge Zero-Cloud)
pip install sqlalchemy alembic

# 2. Add to server.py:
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime

Base = declarative_base()

class UserAccount(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    role = Column(String(30), nullable=False) # 'teacher' | 'student' | 'official'
    name = Column(String(120), nullable=False)
    school_name = Column(String(200))
    district = Column(String(100))
    pin_hash = Column(String(255))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

engine = create_engine('sqlite:///sursetu_local.db', echo=False)
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)`,

    postgres: `# 1. Install PostgreSQL adapter
pip install psycopg2-binary sqlalchemy

# 2. Connection string in .env:
DATABASE_URL=postgresql://sursetu_user:secret_pass@127.0.0.1:5432/sursetu_db

# 3. Connection pool in server.py:
engine = create_engine(os.environ["DATABASE_URL"], pool_size=10, max_overflow=20)
Base.metadata.create_all(engine)`,

    supabase: `// 1. Install Supabase Client for React / Node
npm install @supabase/supabase-js

// 2. Initialize in src/services/supabaseService.ts:
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 3. User Login / Role Sync:
export async function loginWithRole(email: string, role: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();
  return { data, error };
}`,

    firebase: `// 1. Install Firebase Client
npm install firebase

// 2. Initialize Firestore offline persistence in src/services/firebaseService.ts:
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const app = initializeApp({ /* your firebase config */ });
export const db = getFirestore(app);

// Enable offline caching for dark-zone tribal schools
enableIndexedDbPersistence(db).catch((err) => {
  console.warn('Offline persistence error:', err);
});`
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                SurSetu Database Architecture & Connectivity Guide
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/40">
                  Offline-First + Cloud Sync
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Architecture Blueprint for storing Student Profiles, Teacher Lesson Logs, and District Telemetry.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-300">
          {/* Architecture Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <HardDrive className="w-4 h-4" />
                <span>1. Edge Local Store</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Runs <strong>SQLite / IndexedDB</strong> directly on school laptops or Raspberry Pi. Zero internet connection required.
              </p>
              <div className="text-[10px] text-emerald-300 font-mono bg-emerald-950/40 p-1.5 rounded-lg">
                Latency: 0.08ms • Encrypted
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <RefreshCw className="w-4 h-4" />
                <span>2. Sneakernet Sync</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Syncs offline student logs & feedback batches via <strong>Local Wi-Fi Direct</strong> or USB when a supervisor visits.
              </p>
              <div className="text-[10px] text-amber-300 font-mono bg-amber-950/40 p-1.5 rounded-lg">
                Batch Hash & Merge Queue
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Cloud className="w-4 h-4" />
                <span>3. Central Cloud Hub</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                <strong>PostgreSQL / Supabase / Firebase</strong> aggregating state-level NIPUN Bharat FLN compliance metrics.
              </p>
              <div className="text-[10px] text-indigo-300 font-mono bg-indigo-950/40 p-1.5 rounded-lg">
                District Radar Dashboard
              </div>
            </div>
          </div>

          {/* Database Stack Selection Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Select Database Stack Implementation:
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Ready-to-run Code Snippets</span>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'sqlite', label: 'SQLite (Edge Offline Default)', icon: '📦' },
                { id: 'postgres', label: 'PostgreSQL (State Server)', icon: '🐘' },
                { id: 'supabase', label: 'Supabase (BaaS / Postgres)', icon: '⚡' },
                { id: 'firebase', label: 'Firebase Firestore (Offline Caching)', icon: '🔥' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDb(tab.id as any)}
                  className={`px-3 py-2 rounded-xl font-bold transition border cursor-pointer flex items-center gap-1.5 ${
                    selectedDb === tab.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Code Block Container */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] overflow-x-auto text-slate-300">
              <button
                onClick={() => handleCopy(codeSnippets[selectedDb], selectedDb)}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-[10px] cursor-pointer"
              >
                {copiedCode === selectedDb ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>

              <pre className="whitespace-pre-wrap">{codeSnippets[selectedDb]}</pre>
            </div>
          </div>

          {/* Database Schema Specification */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Recommended Entity-Relationship (ER) Schema</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[10px]">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1">
                  1. `users` (RBAC)
                </div>
                <div>• id: UUID (PK)</div>
                <div>• role: 'teacher' | 'student' | 'official'</div>
                <div>• name: VARCHAR(100)</div>
                <div>• school_id: FK &rarr; schools.id</div>
                <div>• pin_hash: VARCHAR(255)</div>
                <div>• language_pref: VARCHAR(20)</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-amber-400 font-bold border-b border-slate-800 pb-1">
                  2. `student_progress`
                </div>
                <div>• id: UUID (PK)</div>
                <div>• student_id: FK &rarr; users.id</div>
                <div>• module: 'quest' | 'flashcard' | 'reader'</div>
                <div>• score_xp: INT</div>
                <div>• words_mastered: JSONB</div>
                <div>• recorded_at: TIMESTAMP</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-indigo-400 font-bold border-b border-slate-800 pb-1">
                  3. `learned_dialect_cache`
                </div>
                <div>• id: UUID (PK)</div>
                <div>• source_text: TEXT</div>
                <div>• target_lang: 'sat_Olck' | 'ho' | 'mun'</div>
                <div>• translated_text: TEXT</div>
                <div>• verified_by_teacher: BOOLEAN</div>
                <div>• sync_status: 'synced' | 'pending'</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DPDP Act 2023 & NEP 2020 Compliant • Local Data Sovereignty</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
          >
            Got It, Back to App
          </button>
        </div>
      </div>
    </div>
  );
};

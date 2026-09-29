-- ==============================================================================
-- 🌿 SurSetu 3.0: Sovereign Indigenous Language Education Platform
-- Supabase / PostgreSQL State Cloud Database Migration Schema
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USERS & ACCOUNTS (Teachers, Tribal Learners, District Officials)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sursetu_users (
    id TEXT PRIMARY KEY,
    role TEXT CHECK (role IN ('teacher', 'student', 'official')) NOT NULL,
    name TEXT NOT NULL,
    school_name TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT DEFAULT 'Odisha',
    grade TEXT,
    avatar TEXT,
    pin_hash TEXT, -- Stored security hash for offline edge validation
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast district-level querying
CREATE INDEX IF NOT EXISTS idx_sursetu_users_district ON public.sursetu_users(district);
CREATE INDEX IF NOT EXISTS idx_sursetu_users_role ON public.sursetu_users(role);

-- ------------------------------------------------------------------------------
-- 2. STUDENT PROGRESS & FLN LEARNING STREAKS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sursetu_student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES public.sursetu_users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    language TEXT NOT NULL, -- e.g. 'santali', 'ho', 'mundari'
    module TEXT NOT NULL,   -- e.g. 'reader', 'flashcards', 'tribal_quest', 'barakhadi'
    score REAL DEFAULT 100.0,
    school_name TEXT NOT NULL,
    district TEXT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sursetu_progress_student ON public.sursetu_student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_sursetu_progress_district ON public.sursetu_student_progress(district);

-- ------------------------------------------------------------------------------
-- 3. DISTRICT OFFICIAL TELEMETRY & COMPLIANCE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sursetu_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district TEXT UNIQUE NOT NULL,
    total_schools INT DEFAULT 1,
    active_learners INT DEFAULT 0,
    avg_pronunciation_score REAL DEFAULT 88.5,
    fln_coverage_pct REAL DEFAULT 92.4,
    last_sync_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample district telemetry seeds
INSERT INTO public.sursetu_telemetry (district, total_schools, active_learners, avg_pronunciation_score, fln_coverage_pct)
VALUES 
    ('Mayurbhanj', 142, 4820, 89.2, 94.6),
    ('Dumka', 98, 3210, 87.5, 91.2),
    ('Khunti', 64, 2150, 86.8, 88.9),
    ('Bastar', 85, 2940, 88.1, 90.5)
ON CONFLICT (district) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.sursetu_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sursetu_student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sursetu_telemetry ENABLE ROW LEVEL SECURITY;

-- Allow read/write access for anon key in offline sync gateway mode
CREATE POLICY "Public anonymous read access" ON public.sursetu_users FOR SELECT USING (true);
CREATE POLICY "Public anonymous write access" ON public.sursetu_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public anonymous update access" ON public.sursetu_users FOR UPDATE USING (true);

CREATE POLICY "Public progress read" ON public.sursetu_student_progress FOR SELECT USING (true);
CREATE POLICY "Public progress write" ON public.sursetu_student_progress FOR INSERT WITH CHECK (true);

CREATE POLICY "Public telemetry read" ON public.sursetu_telemetry FOR SELECT USING (true);

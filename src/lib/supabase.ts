import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://placeholder-project.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'placeholder-anon-key';

export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key && !url.includes('placeholder'));
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * SQL Schema script to be executed in Supabase SQL Editor
 */
export const SUPABASE_SCHEMA_SQL = `
-- CycleCare Database Schema
-- Run this in Supabase SQL Editor

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  default_cycle_length INT DEFAULT 28,
  default_period_length INT DEFAULT 5,
  cycle_regularity TEXT CHECK (cycle_regularity IN ('regular', 'irregular', 'unsure')) DEFAULT 'regular',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cycles Table
CREATE TABLE IF NOT EXISTS public.cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  cycle_length INT,
  period_length INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Period Logs Table
CREATE TABLE IF NOT EXISTS public.period_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES public.cycles(id) ON DELETE SET NULL,
  log_date DATE NOT NULL,
  flow_level TEXT CHECK (flow_level IN ('spotting', 'light', 'medium', 'heavy')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- 4. Daily Check-ins Table
CREATE TABLE IF NOT EXISTS public.daily_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  mood TEXT CHECK (mood IN ('happy', 'calm', 'irritable', 'sad', 'anxious')),
  energy_level INT CHECK (energy_level BETWEEN 1 AND 5),
  hydration_glasses INT CHECK (hydration_glasses BETWEEN 0 AND 12) DEFAULT 0,
  sleep_hours NUMERIC(3,1) CHECK (sleep_hours BETWEEN 0 AND 24),
  sleep_quality TEXT CHECK (sleep_quality IN ('poor', 'fair', 'good', 'excellent')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, check_in_date)
);

-- 5. Symptom Logs Table
CREATE TABLE IF NOT EXISTS public.symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  symptom_type TEXT NOT NULL,
  category TEXT CHECK (category IN ('physical', 'emotional', 'digestion')) NOT NULL,
  severity INT CHECK (severity BETWEEN 1 AND 3) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date, symptom_type)
);

-- 6. Journal Entries Table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  cycle_day INT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reminder Settings Table
CREATE TABLE IF NOT EXISTS public.reminder_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  period_reminders_enabled BOOLEAN DEFAULT TRUE,
  period_days_before INT DEFAULT 2,
  day_of_alert_enabled BOOLEAN DEFAULT TRUE,
  daily_checkin_enabled BOOLEAN DEFAULT TRUE,
  daily_checkin_time TIME DEFAULT '20:00:00',
  journal_prompt_enabled BOOLEAN DEFAULT FALSE,
  journal_prompt_frequency TEXT DEFAULT 'weekly',
  push_channel_enabled BOOLEAN DEFAULT TRUE,
  email_channel_enabled BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.period_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;

-- ROW LEVEL SECURITY POLICIES (Users only see/edit their own rows)
CREATE POLICY "Profiles self access" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Cycles self access" ON public.cycles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Period logs self access" ON public.period_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Daily checkins self access" ON public.daily_check_ins FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Symptom logs self access" ON public.symptom_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Journal entries self access" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Reminder settings self access" ON public.reminder_settings FOR ALL USING (auth.uid() = user_id);
`;

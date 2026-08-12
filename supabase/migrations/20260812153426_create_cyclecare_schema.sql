/*
# Create CycleCare database schema

1. New Tables
- `profiles` — user profile (1:1 with auth.users), stores display name, avatar, default cycle/period lengths, cycle regularity
- `cycles` — recorded cycle periods, each owned by a user; start_date, optional end_date, computed lengths
- `period_logs` — daily flow logs (spotting/light/medium/heavy), one per user per date, optionally linked to a cycle
- `daily_check_ins` — daily wellbeing log: mood, energy (1-5), hydration glasses (0-12), sleep hours/quality, notes; one per user per date
- `symptom_logs` — symptom entries (physical/emotional/digestion) with severity 1-3; one per user per date per symptom type
- `journal_entries` — freeform journal entries tied to a date and cycle day
- `reminder_settings` — per-user notification preferences (1:1 with auth.users)

2. Security
- RLS enabled on every table.
- Owner-scoped CRUD policies (SELECT/INSERT/UPDATE/DELETE) on all tables using auth.uid() = user_id.
- profiles and reminder_settings keyed on user_id (the owner) instead of a separate user_id column.
- user_id columns default to auth.uid() so client inserts that omit user_id still satisfy WITH CHECK.

3. Important notes
- All tables use gen_random_uuid() for primary keys so the client never invents IDs.
- Unique constraints prevent duplicate logs for the same user/date(/symptom).
- ON DELETE CASCADE from auth.users keeps user data clean on account deletion.
*/

-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  default_cycle_length int DEFAULT 28,
  default_period_length int DEFAULT 5,
  cycle_regularity text CHECK (cycle_regularity IN ('regular', 'irregular', 'unsure')) DEFAULT 'regular',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
CREATE POLICY "select_own_profile" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
CREATE POLICY "insert_own_profile" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "delete_own_profile" ON public.profiles;
CREATE POLICY "delete_own_profile" ON public.profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- 2. Cycles
CREATE TABLE IF NOT EXISTS public.cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date,
  cycle_length int,
  period_length int,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_cycles" ON public.cycles;
CREATE POLICY "select_own_cycles" ON public.cycles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_cycles" ON public.cycles;
CREATE POLICY "insert_own_cycles" ON public.cycles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_cycles" ON public.cycles;
CREATE POLICY "update_own_cycles" ON public.cycles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_cycles" ON public.cycles;
CREATE POLICY "delete_own_cycles" ON public.cycles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- 3. Period Logs
CREATE TABLE IF NOT EXISTS public.period_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_id uuid REFERENCES public.cycles(id) ON DELETE SET NULL,
  log_date date NOT NULL,
  flow_level text CHECK (flow_level IN ('spotting', 'light', 'medium', 'heavy')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, log_date)
);
ALTER TABLE public.period_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_period_logs" ON public.period_logs;
CREATE POLICY "select_own_period_logs" ON public.period_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_period_logs" ON public.period_logs;
CREATE POLICY "insert_own_period_logs" ON public.period_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_period_logs" ON public.period_logs;
CREATE POLICY "update_own_period_logs" ON public.period_logs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_period_logs" ON public.period_logs;
CREATE POLICY "delete_own_period_logs" ON public.period_logs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- 4. Daily Check-ins
CREATE TABLE IF NOT EXISTS public.daily_check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in_date date NOT NULL,
  mood text CHECK (mood IN ('happy', 'calm', 'irritable', 'sad', 'anxious')),
  energy_level int CHECK (energy_level BETWEEN 1 AND 5),
  hydration_glasses int CHECK (hydration_glasses BETWEEN 0 AND 12) DEFAULT 0,
  sleep_hours numeric(3,1) CHECK (sleep_hours BETWEEN 0 AND 24),
  sleep_quality text CHECK (sleep_quality IN ('poor', 'fair', 'good', 'excellent')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, check_in_date)
);
ALTER TABLE public.daily_check_ins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_check_ins" ON public.daily_check_ins;
CREATE POLICY "select_own_check_ins" ON public.daily_check_ins FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_check_ins" ON public.daily_check_ins;
CREATE POLICY "insert_own_check_ins" ON public.daily_check_ins FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_check_ins" ON public.daily_check_ins;
CREATE POLICY "update_own_check_ins" ON public.daily_check_ins FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_check_ins" ON public.daily_check_ins;
CREATE POLICY "delete_own_check_ins" ON public.daily_check_ins FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- 5. Symptom Logs
CREATE TABLE IF NOT EXISTS public.symptom_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date date NOT NULL,
  symptom_type text NOT NULL,
  category text CHECK (category IN ('physical', 'emotional', 'digestion')) NOT NULL,
  severity int CHECK (severity BETWEEN 1 AND 3) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, log_date, symptom_type)
);
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_symptom_logs" ON public.symptom_logs;
CREATE POLICY "select_own_symptom_logs" ON public.symptom_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_symptom_logs" ON public.symptom_logs;
CREATE POLICY "insert_own_symptom_logs" ON public.symptom_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_symptom_logs" ON public.symptom_logs;
CREATE POLICY "update_own_symptom_logs" ON public.symptom_logs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_symptom_logs" ON public.symptom_logs;
CREATE POLICY "delete_own_symptom_logs" ON public.symptom_logs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- 6. Journal Entries
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  cycle_day int,
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_journal_entries" ON public.journal_entries;
CREATE POLICY "select_own_journal_entries" ON public.journal_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_journal_entries" ON public.journal_entries;
CREATE POLICY "insert_own_journal_entries" ON public.journal_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_journal_entries" ON public.journal_entries;
CREATE POLICY "update_own_journal_entries" ON public.journal_entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_journal_entries" ON public.journal_entries;
CREATE POLICY "delete_own_journal_entries" ON public.journal_entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- 7. Reminder Settings
CREATE TABLE IF NOT EXISTS public.reminder_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  period_reminders_enabled boolean DEFAULT true,
  period_days_before int DEFAULT 2,
  day_of_alert_enabled boolean DEFAULT true,
  daily_checkin_enabled boolean DEFAULT true,
  daily_checkin_time time DEFAULT '20:00:00',
  journal_prompt_enabled boolean DEFAULT false,
  journal_prompt_frequency text DEFAULT 'weekly',
  push_channel_enabled boolean DEFAULT true,
  email_channel_enabled boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reminders" ON public.reminder_settings;
CREATE POLICY "select_own_reminders" ON public.reminder_settings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_reminders" ON public.reminder_settings;
CREATE POLICY "insert_own_reminders" ON public.reminder_settings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_reminders" ON public.reminder_settings;
CREATE POLICY "update_own_reminders" ON public.reminder_settings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_reminders" ON public.reminder_settings;
CREATE POLICY "delete_own_reminders" ON public.reminder_settings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
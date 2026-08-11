export type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';

export type FlowLevel = 'spotting' | 'light' | 'medium' | 'heavy';

export type MoodType = 'happy' | 'calm' | 'irritable' | 'sad' | 'anxious';

export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';

export type SymptomCategory = 'physical' | 'emotional' | 'digestion';

export type CycleRegularity = 'regular' | 'irregular' | 'unsure';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  default_cycle_length: number;
  default_period_length: number;
  cycle_regularity: CycleRegularity;
  created_at?: string;
  updated_at?: string;
}

export interface Cycle {
  id: string;
  user_id: string;
  start_date: string; // YYYY-MM-DD
  end_date?: string | null; // YYYY-MM-DD
  cycle_length?: number | null;
  period_length?: number | null;
  notes?: string | null;
  created_at?: string;
}

export interface PeriodLog {
  id: string;
  user_id: string;
  cycle_id?: string | null;
  log_date: string; // YYYY-MM-DD
  flow_level: FlowLevel;
  created_at?: string;
}

export interface DailyCheckIn {
  id: string;
  user_id: string;
  check_in_date: string; // YYYY-MM-DD
  mood?: MoodType | null;
  energy_level?: number | null; // 1-5
  hydration_glasses?: number; // 0-12
  sleep_hours?: number | null; // e.g. 7.5
  sleep_quality?: SleepQuality | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SymptomLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  symptom_type: string; // e.g. 'cramps', 'headache', 'bloating', 'acne', 'fatigue', 'backache'
  category: SymptomCategory;
  severity: number; // 1=mild, 2=moderate, 3=severe
  created_at?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: string; // YYYY-MM-DD
  cycle_day?: number | null;
  title: string;
  body: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReminderSettings {
  user_id: string;
  period_reminders_enabled: boolean;
  period_days_before: number;
  day_of_alert_enabled: boolean;
  daily_checkin_enabled: boolean;
  daily_checkin_time: string; // HH:mm
  journal_prompt_enabled: boolean;
  journal_prompt_frequency: 'weekly' | 'bi-weekly' | 'monthly';
  push_channel_enabled: boolean;
  email_channel_enabled: boolean;
  updated_at?: string;
}

export interface PredictionResult {
  currentCycleDay: number;
  currentPhase: CyclePhase;
  phaseDescription: string;
  nextPeriodDate: string; // YYYY-MM-DD
  daysUntilNextPeriod: number;
  predictedOvulationDate: string; // YYYY-MM-DD
  averageCycleLength: number;
  averagePeriodLength: number;
  confidenceScore: number; // Percentage (e.g., 94)
  confidenceLevel: 'High' | 'Moderate' | 'Baseline';
  confidenceDescription: string;
}

export interface PatternInsight {
  id: string;
  title: string;
  category: 'Pattern' | 'Trend' | 'Observation';
  description: string;
  cycleDaysRange: string;
  icon: string;
  badgeColor: string;
}

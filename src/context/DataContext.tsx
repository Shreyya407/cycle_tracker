import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Cycle,
  PeriodLog,
  DailyCheckIn,
  SymptomLog,
  JournalEntry,
  ReminderSettings,
  PredictionResult,
  PatternInsight,
  FlowLevel,
  MoodType,
  SleepQuality,
  SymptomCategory
} from '../types';
import { useAuth } from './AuthContext';
import { calculatePredictions, discoverPersonalPatterns, formatDate, addDays } from '../lib/cycleLogic';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface DataContextType {
  cycles: Cycle[];
  periodLogs: PeriodLog[];
  checkIns: DailyCheckIn[];
  symptomLogs: SymptomLog[];
  journalEntries: JournalEntry[];
  reminderSettings: ReminderSettings;
  prediction: PredictionResult;
  patterns: PatternInsight[];
  loading: boolean;
  logPeriodDay: (date: string, flow: FlowLevel) => Promise<void>;
  saveCheckIn: (checkIn: Partial<DailyCheckIn>) => Promise<void>;
  logSymptom: (symptomType: string, category: SymptomCategory, severity: number, date?: string) => Promise<void>;
  saveJournalEntry: (title: string, body: string, date?: string, id?: string) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  updateReminderSettings: (updated: Partial<ReminderSettings>) => Promise<void>;
}

const defaultReminders: ReminderSettings = {
  user_id: 'demo-user-123',
  period_reminders_enabled: true,
  period_days_before: 2,
  day_of_alert_enabled: true,
  daily_checkin_enabled: true,
  daily_checkin_time: '20:00',
  journal_prompt_enabled: false,
  journal_prompt_frequency: 'weekly',
  push_channel_enabled: true,
  email_channel_enabled: false
};

// Initial realistic data generator for rich visualization
const generateInitialMockData = (userId: string) => {
  const today = new Date();
  const todayStr = formatDate(today);

  // Completed past 3 cycles
  const cycles: Cycle[] = [
    {
      id: 'c-1',
      user_id: userId,
      start_date: addDays(todayStr, -78),
      end_date: addDays(todayStr, -51),
      cycle_length: 28,
      period_length: 5
    },
    {
      id: 'c-2',
      user_id: userId,
      start_date: addDays(todayStr, -50),
      end_date: addDays(todayStr, -23),
      cycle_length: 28,
      period_length: 5
    },
    {
      id: 'c-3',
      user_id: userId,
      start_date: addDays(todayStr, -22),
      end_date: null,
      cycle_length: 28,
      period_length: 5
    }
  ];

  // Period logs for latest period (Days 1 to 4)
  const periodLogs: PeriodLog[] = [
    { id: 'p-1', user_id: userId, cycle_id: 'c-3', log_date: addDays(todayStr, -22), flow_level: 'heavy' },
    { id: 'p-2', user_id: userId, cycle_id: 'c-3', log_date: addDays(todayStr, -21), flow_level: 'heavy' },
    { id: 'p-3', user_id: userId, cycle_id: 'c-3', log_date: addDays(todayStr, -20), flow_level: 'medium' },
    { id: 'p-4', user_id: userId, cycle_id: 'c-3', log_date: addDays(todayStr, -19), flow_level: 'light' },
  ];

  // Check-ins
  const checkIns: DailyCheckIn[] = [
    {
      id: 'chk-1',
      user_id: userId,
      check_in_date: todayStr,
      mood: 'calm',
      energy_level: 4,
      hydration_glasses: 6,
      sleep_hours: 7.5,
      sleep_quality: 'good',
      notes: 'Feeling grounded and energized today.'
    },
    {
      id: 'chk-2',
      user_id: userId,
      check_in_date: addDays(todayStr, -1),
      mood: 'happy',
      energy_level: 5,
      hydration_glasses: 8,
      sleep_hours: 8.0,
      sleep_quality: 'excellent',
      notes: 'Completed a great morning walk.'
    }
  ];

  // Symptoms
  const symptomLogs: SymptomLog[] = [
    { id: 'sym-1', user_id: userId, log_date: todayStr, symptom_type: 'fatigue', category: 'physical', severity: 1 },
    { id: 'sym-2', user_id: userId, log_date: addDays(todayStr, -22), symptom_type: 'cramps', category: 'physical', severity: 2 },
    { id: 'sym-3', user_id: userId, log_date: addDays(todayStr, -22), symptom_type: 'bloating', category: 'physical', severity: 2 }
  ];

  // Journal
  const journalEntries: JournalEntry[] = [
    {
      id: 'j-1',
      user_id: userId,
      entry_date: todayStr,
      cycle_day: 12,
      title: 'A profound sense of calm',
      body: "Today I woke up feeling surprisingly rested. The usual mid-cycle tension seems to have dissipated entirely, replaced by a grounded, steady energy. Spent some time outside in the morning light."
    },
    {
      id: 'j-2',
      user_id: userId,
      entry_date: addDays(todayStr, -3),
      cycle_day: 9,
      title: 'Noticing subtle shifts',
      body: "Energy levels are starting to peak. Managed a longer walk than usual. Feeling a bit more outgoing and ready for new projects."
    }
  ];

  return { cycles, periodLogs, checkIns, symptomLogs, journalEntries };
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const userId = user?.id || 'demo-user-123';

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>([]);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(defaultReminders);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured()) {
      fetchSupabaseData();
    } else {
      // LocalStorage fallback
      const savedData = localStorage.getItem(`cyclecare_data_${userId}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setCycles(parsed.cycles || []);
          setPeriodLogs(parsed.periodLogs || []);
          setCheckIns(parsed.checkIns || []);
          setSymptomLogs(parsed.symptomLogs || []);
          setJournalEntries(parsed.journalEntries || []);
          setReminderSettings(parsed.reminderSettings || defaultReminders);
        } catch (e) {
          console.error('Failed to parse local storage data', e);
        }
      } else {
        if (userId === 'demo-user-123') {
          const mock = generateInitialMockData(userId);
          setCycles(mock.cycles);
          setPeriodLogs(mock.periodLogs);
          setCheckIns(mock.checkIns);
          setSymptomLogs(mock.symptomLogs);
          setJournalEntries(mock.journalEntries);
        } else {
          setCycles([]);
          setPeriodLogs([]);
          setCheckIns([]);
          setSymptomLogs([]);
          setJournalEntries([]);
          setReminderSettings({ ...defaultReminders, user_id: userId });
        }
      }
      setLoading(false);
    }
  }, [user]);

  // Persist local state whenever changes happen (in fallback mode)
  useEffect(() => {
    if (!isSupabaseConfigured() && user) {
      localStorage.setItem(
        `cyclecare_data_${userId}`,
        JSON.stringify({
          cycles,
          periodLogs,
          checkIns,
          symptomLogs,
          journalEntries,
          reminderSettings
        })
      );
    }
  }, [cycles, periodLogs, checkIns, symptomLogs, journalEntries, reminderSettings, user]);

  const fetchSupabaseData = async () => {
    try {
      setLoading(true);
      const [cyRes, plRes, chkRes, symRes, jRes, remRes] = await Promise.all([
        supabase.from('cycles').select('*').eq('user_id', userId),
        supabase.from('period_logs').select('*').eq('user_id', userId),
        supabase.from('daily_check_ins').select('*').eq('user_id', userId),
        supabase.from('symptom_logs').select('*').eq('user_id', userId),
        supabase.from('journal_entries').select('*').eq('user_id', userId),
        supabase.from('reminder_settings').select('*').eq('user_id', userId).maybeSingle()
      ]);

      if (cyRes.data) setCycles(cyRes.data);
      if (plRes.data) setPeriodLogs(plRes.data);
      if (chkRes.data) setCheckIns(chkRes.data);
      if (symRes.data) setSymptomLogs(symRes.data);
      if (jRes.data) setJournalEntries(jRes.data);
      if (remRes.data) setReminderSettings(remRes.data);
    } catch (e) {
      console.error('Error fetching Supabase data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Prediction calculations
  const prediction = calculatePredictions(
    cycles,
    periodLogs,
    profile?.default_cycle_length || 28,
    profile?.default_period_length || 5
  );

  // Pattern discovery calculations
  const patterns = discoverPersonalPatterns(symptomLogs, checkIns, cycles);

  // Log period day
  const logPeriodDay = async (date: string, flow: FlowLevel) => {
    const existingIndex = periodLogs.findIndex(p => p.log_date === date);
    const newLog: PeriodLog = {
      id: existingIndex >= 0 ? periodLogs[existingIndex].id : `pl-${Date.now()}`,
      user_id: userId,
      log_date: date,
      flow_level: flow
    };

    let updatedLogs: PeriodLog[];
    if (existingIndex >= 0) {
      updatedLogs = [...periodLogs];
      updatedLogs[existingIndex] = newLog;
    } else {
      updatedLogs = [...periodLogs, newLog];
    }
    setPeriodLogs(updatedLogs);

    if (isSupabaseConfigured()) {
      await supabase.from('period_logs').upsert([newLog]);
    }
  };

  // Save Daily Check-in
  const saveCheckIn = async (checkIn: Partial<DailyCheckIn>) => {
    const todayStr = checkIn.check_in_date || formatDate(new Date());
    const existingIndex = checkIns.findIndex(c => c.check_in_date === todayStr);

    const fullCheckIn: DailyCheckIn = {
      id: existingIndex >= 0 ? checkIns[existingIndex].id : `chk-${Date.now()}`,
      user_id: userId,
      check_in_date: todayStr,
      mood: checkIn.mood !== undefined ? checkIn.mood : existingIndex >= 0 ? checkIns[existingIndex].mood : 'calm',
      energy_level: checkIn.energy_level !== undefined ? checkIn.energy_level : existingIndex >= 0 ? checkIns[existingIndex].energy_level : 3,
      hydration_glasses: checkIn.hydration_glasses !== undefined ? checkIn.hydration_glasses : existingIndex >= 0 ? checkIns[existingIndex].hydration_glasses : 0,
      sleep_hours: checkIn.sleep_hours !== undefined ? checkIn.sleep_hours : existingIndex >= 0 ? checkIns[existingIndex].sleep_hours : 7.5,
      sleep_quality: checkIn.sleep_quality !== undefined ? checkIn.sleep_quality : existingIndex >= 0 ? checkIns[existingIndex].sleep_quality : 'good',
      notes: checkIn.notes !== undefined ? checkIn.notes : existingIndex >= 0 ? checkIns[existingIndex].notes : '',
      updated_at: new Date().toISOString()
    };

    let updated: DailyCheckIn[];
    if (existingIndex >= 0) {
      updated = [...checkIns];
      updated[existingIndex] = fullCheckIn;
    } else {
      updated = [...checkIns, fullCheckIn];
    }
    setCheckIns(updated);

    if (isSupabaseConfigured()) {
      await supabase.from('daily_check_ins').upsert([fullCheckIn]);
    }
  };

  // Log Symptom
  const logSymptom = async (symptomType: string, category: SymptomCategory, severity: number, date?: string) => {
    const logDate = date || formatDate(new Date());
    const existingIndex = symptomLogs.findIndex(s => s.log_date === logDate && s.symptom_type === symptomType);

    const newSymptom: SymptomLog = {
      id: existingIndex >= 0 ? symptomLogs[existingIndex].id : `sym-${Date.now()}`,
      user_id: userId,
      log_date: logDate,
      symptom_type: symptomType,
      category,
      severity
    };

    let updated: SymptomLog[];
    if (existingIndex >= 0) {
      updated = [...symptomLogs];
      updated[existingIndex] = newSymptom;
    } else {
      updated = [...symptomLogs, newSymptom];
    }
    setSymptomLogs(updated);

    if (isSupabaseConfigured()) {
      await supabase.from('symptom_logs').upsert([newSymptom]);
    }
  };

  // Save Journal Entry
  const saveJournalEntry = async (title: string, body: string, date?: string, id?: string) => {
    const entryDate = date || formatDate(new Date());
    const now = new Date().toISOString();
    const existingEntry = id ? journalEntries.find(entry => entry.id === id) : undefined;

    if (existingEntry) {
      const updatedEntry: JournalEntry = {
        ...existingEntry,
        title,
        body,
        entry_date: entryDate,
        cycle_day: existingEntry.cycle_day || prediction.currentCycleDay,
        updated_at: now
      };
      setJournalEntries(prev => prev.map(entry => entry.id === id ? updatedEntry : entry));

      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('journal_entries')
          .update({ title, body, entry_date: entryDate, updated_at: now })
          .eq('id', id)
          .eq('user_id', userId);
        if (error) throw error;
      }
      return;
    }

    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      user_id: userId,
      entry_date: entryDate,
      cycle_day: prediction.currentCycleDay,
      title: title.trim() || 'Untitled Entry',
      body,
      created_at: now,
      updated_at: now
    };

    setJournalEntries(prev => [newEntry, ...prev]);

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('journal_entries').insert([newEntry]);
      if (error) throw error;
    }
  };

  // Delete Journal Entry
  const deleteJournalEntry = async (id: string) => {
    setJournalEntries(prev => prev.filter(j => j.id !== id));
    if (isSupabaseConfigured()) {
      await supabase.from('journal_entries').delete().eq('id', id);
    }
  };

  // Update Reminders
  const updateReminderSettings = async (updated: Partial<ReminderSettings>) => {
    const newReminders = { ...reminderSettings, ...updated };
    setReminderSettings(newReminders);

    if (isSupabaseConfigured()) {
      await supabase.from('reminder_settings').upsert([newReminders]);
    }
  };

  return (
    <DataContext.Provider
      value={{
        cycles,
        periodLogs,
        checkIns,
        symptomLogs,
        journalEntries,
        reminderSettings,
        prediction,
        patterns,
        loading,
        logPeriodDay,
        saveCheckIn,
        logSymptom,
        saveJournalEntry,
        deleteJournalEntry,
        updateReminderSettings
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

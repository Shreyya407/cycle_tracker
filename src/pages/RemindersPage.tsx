import React from 'react';
import { useData } from '../context/DataContext';

export const RemindersPage: React.FC = () => {
  const { reminderSettings, updateReminderSettings } = useData();

  return (
    <div className="p-4 lg:p-8 max-w-container-max mx-auto space-y-8">
      {/* Header */}
      <header>
        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-1">Reminders & Notifications</h2>
        <p className="font-sans text-body-md text-on-surface-variant">
          Manage your prompts and notification preferences to stay on track with your wellbeing.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Settings List */}
        <div className="col-span-1 md:col-span-8 flex flex-col gap-6">
          {/* Period Reminders Card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-tier-1 p-6 flex flex-col gap-6 border border-outline-variant/20">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">water_drop</span>
                  <span>Period Reminders</span>
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1">Receive gentle alerts before your predicted cycle start.</p>
              </div>
              <input
                type="checkbox"
                checked={reminderSettings.period_reminders_enabled}
                onChange={e => updateReminderSettings({ period_reminders_enabled: e.target.checked })}
                className="w-6 h-6 accent-primary cursor-pointer"
              />
            </div>

            {reminderSettings.period_reminders_enabled && (
              <div className="flex flex-col gap-4 pl-6 border-l-2 border-surface-variant ml-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-sm text-on-surface-variant">Advance Alert Window</label>
                  <select
                    value={reminderSettings.period_days_before}
                    onChange={e => updateReminderSettings({ period_days_before: Number(e.target.value) })}
                    className="bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-sm rounded-xl p-2"
                  >
                    <option value={1}>1 Day Before</option>
                    <option value={2}>2 Days Before</option>
                    <option value={3}>3 Days Before</option>
                    <option value={7}>1 Week Before</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-label-md text-sm text-on-surface-variant">Day of Period Alert</label>
                  <input
                    type="checkbox"
                    checked={reminderSettings.day_of_alert_enabled}
                    onChange={e => updateReminderSettings({ day_of_alert_enabled: e.target.checked })}
                    className="w-5 h-5 accent-primary cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Daily Check-in Card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-tier-1 p-6 flex flex-col gap-6 border border-outline-variant/20">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">track_changes</span>
                  <span>Daily Wellbeing Prompt</span>
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1">Log symptoms, energy, hydration, and mood consistently.</p>
              </div>
              <input
                type="checkbox"
                checked={reminderSettings.daily_checkin_enabled}
                onChange={e => updateReminderSettings({ daily_checkin_enabled: e.target.checked })}
                className="w-6 h-6 accent-primary cursor-pointer"
              />
            </div>

            {reminderSettings.daily_checkin_enabled && (
              <div className="flex flex-col gap-4 pl-6 border-l-2 border-surface-variant ml-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-sm text-on-surface-variant">Daily Reminder Time</label>
                  <input
                    type="time"
                    value={reminderSettings.daily_checkin_time}
                    onChange={e => updateReminderSettings({ daily_checkin_time: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-sm rounded-xl p-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Journal Prompt Card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-tier-1 p-6 flex flex-col gap-6 border border-outline-variant/20">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">menu_book</span>
                  <span>Journal Prompts</span>
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1">Periodic notifications encouraging personal reflection.</p>
              </div>
              <input
                type="checkbox"
                checked={reminderSettings.journal_prompt_enabled}
                onChange={e => updateReminderSettings({ journal_prompt_enabled: e.target.checked })}
                className="w-6 h-6 accent-primary cursor-pointer"
              />
            </div>

            {reminderSettings.journal_prompt_enabled && (
              <div className="flex flex-col gap-4 pl-6 border-l-2 border-surface-variant ml-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-sm text-on-surface-variant">Prompt Frequency</label>
                  <select
                    value={reminderSettings.journal_prompt_frequency}
                    onChange={e => updateReminderSettings({ journal_prompt_frequency: e.target.value as any })}
                    className="bg-surface-container-low border border-outline-variant/30 text-on-surface font-sans text-sm rounded-xl p-2"
                  >
                    <option value="weekly">Weekly (Sunday)</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Channels */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-tier-1 p-6 border border-outline-variant/20 space-y-4">
            <h3 className="font-serif text-xl text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">notifications</span>
              <span>Delivery Channels</span>
            </h3>
            <p className="font-sans text-xs text-on-surface-variant">How would you like to receive alerts?</p>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={reminderSettings.push_channel_enabled}
                  onChange={e => updateReminderSettings({ push_channel_enabled: e.target.checked })}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-label-md text-sm text-on-surface">Push Notifications</span>
                  <span className="font-sans text-xs text-on-surface-variant">App & Browser push alerts</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={reminderSettings.email_channel_enabled}
                  onChange={e => updateReminderSettings({ email_channel_enabled: e.target.checked })}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-label-md text-sm text-on-surface">Email Digest</span>
                  <span className="font-sans text-xs text-on-surface-variant">Personal summaries & alerts</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersPage;

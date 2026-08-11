import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MoodType, SleepQuality } from '../types';

export const DailyCheckInPage: React.FC = () => {
  const navigate = useNavigate();
  const { checkIns, saveCheckIn } = useData();

  const todayStr = new Date().toISOString().split('T')[0];
  const existingToday = checkIns.find(c => c.check_in_date === todayStr);

  const [mood, setMood] = useState<MoodType>(existingToday?.mood || 'calm');
  const [energyLevel, setEnergyLevel] = useState<number>(existingToday?.energy_level || 3);
  const [hydrationGlasses, setHydrationGlasses] = useState<number>(existingToday?.hydration_glasses || 3);
  const [sleepHours, setSleepHours] = useState<number>(existingToday?.sleep_hours || 7.5);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>(existingToday?.sleep_quality || 'good');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCheckIn({
      check_in_date: todayStr,
      mood,
      energy_level: energyLevel,
      hydration_glasses: hydrationGlasses,
      sleep_hours: sleepHours,
      sleep_quality: sleepQuality
    });
    setSavedSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-background text-on-background">
      {/* Hero Header with serene banner */}
      <div className="relative h-48 md:h-64 w-full shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfkWjkM5DD-ytNtXSx4JS8TqRvflHa2Ry6IiMKMQURDSxDOborrij2cbc0wA3ReNlJU6kG692e2uafoLlceS0wwgo02iOwhsEEMmjyBdtXm3EHnoUJog7jW5SywtPJN94nonSdFuGcSe0Zdh0adS7s_ltAyqjLNx9PFFhIFYRbduUvJFUMnJOSpPcwQ_3dZn56onL2qu8v9EnIgdy3gSEdtAsD_U1PNcwKPvpi5iTFGTKtQ_gLUro')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 max-w-container-max mx-auto px-4 md:px-8">
          <p className="font-label-md text-xs text-primary/80 uppercase tracking-widest mb-1">Today's Reflection</p>
          <h2 className="font-serif text-3xl md:text-4xl text-primary">Daily Wellbeing Check-in</h2>
        </div>
      </div>

      <div className="flex-1 w-full max-w-container-max mx-auto px-4 md:px-8 py-6">
        {savedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-secondary-container text-on-secondary-container font-label-md text-sm border border-secondary flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>Check-in saved successfully! Redirecting to dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Mood Module */}
            <section className="col-span-1 md:col-span-12 bg-surface-container-lowest rounded-2xl shadow-tier-1 p-6 flex flex-col gap-4 border border-outline-variant/10">
              <header>
                <h3 className="font-serif text-2xl text-primary">How are you feeling today?</h3>
                <p className="font-sans text-body-md text-on-surface-variant">Select the mood that best represents your current state.</p>
              </header>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                {[
                  { type: 'happy', label: 'Happy', icon: 'sentiment_very_satisfied' },
                  { type: 'calm', label: 'Calm', icon: 'sentiment_satisfied' },
                  { type: 'irritable', label: 'Irritable', icon: 'sentiment_dissatisfied' },
                  { type: 'sad', label: 'Sad', icon: 'mood_bad' },
                ].map(item => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setMood(item.type as MoodType)}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all ${
                      mood === item.type
                        ? 'bg-secondary-container border-secondary font-bold shadow-sm'
                        : 'border-outline-variant/30 bg-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[36px] text-primary mb-2">{item.icon}</span>
                    <span className="font-label-md text-sm text-primary">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Energy Module */}
            <section className="col-span-1 md:col-span-6 bg-surface-container-lowest rounded-2xl shadow-tier-1 p-6 flex flex-col gap-6 border border-outline-variant/10">
              <header>
                <h3 className="font-serif text-xl text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">bolt</span>
                  <span>Energy Level ({energyLevel}/5)</span>
                </h3>
              </header>

              <div className="flex flex-col flex-1 justify-center px-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energyLevel}
                  onChange={e => setEnergyLevel(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-surface-variant rounded-lg cursor-pointer"
                />
                <div className="flex justify-between mt-3 font-label-sm text-xs text-on-surface-variant">
                  <span>1 - Low Energy</span>
                  <span>3 - Moderate</span>
                  <span>5 - Peak Vitality</span>
                </div>
              </div>
            </section>

            {/* Hydration Module */}
            <section className="col-span-1 md:col-span-6 bg-surface-container-lowest rounded-2xl shadow-tier-1 p-6 flex flex-col gap-4 border border-outline-variant/10">
              <header>
                <h3 className="font-serif text-xl text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">water_drop</span>
                  <span>Hydration Tracker</span>
                </h3>
              </header>

              <div className="flex items-center justify-center gap-2.5 mt-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(glassNum => {
                  const isFilled = glassNum <= hydrationGlasses;
                  return (
                    <button
                      key={glassNum}
                      type="button"
                      onClick={() => setHydrationGlasses(glassNum === hydrationGlasses ? glassNum - 1 : glassNum)}
                      className={`w-9 h-12 rounded-b-xl border-2 flex items-end justify-center overflow-hidden transition-all ${
                        isFilled
                          ? 'border-primary-fixed-dim bg-primary-fixed'
                          : 'border-outline-variant/50 bg-surface'
                      }`}
                    >
                      <div
                        className="w-full bg-primary-fixed-dim/60 transition-all duration-300"
                        style={{ height: isFilled ? '100%' : '0%' }}
                      ></div>
                    </button>
                  );
                })}
              </div>
              <p className="text-center font-label-sm text-xs text-on-surface-variant mt-2">
                {hydrationGlasses} of 8 glasses logged
              </p>
            </section>

            {/* Sleep Rest Module */}
            <section className="col-span-1 md:col-span-12 bg-surface-container-lowest rounded-2xl shadow-tier-1 p-6 flex flex-col gap-6 border border-outline-variant/10">
              <header>
                <h3 className="font-serif text-2xl text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container">bedtime</span>
                  <span>Sleep Rest</span>
                </h3>
              </header>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 w-full">
                  <label className="block font-label-md text-sm text-on-surface mb-2">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={sleepHours}
                    onChange={e => setSleepHours(Number(e.target.value))}
                    className="w-full md:w-48 bg-surface border border-outline-variant/50 rounded-xl px-4 py-3 font-sans text-body-md text-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex-1 w-full">
                  <label className="block font-label-md text-sm text-on-surface mb-2">Sleep Quality</label>
                  <div className="grid grid-cols-4 gap-3">
                    {(['poor', 'fair', 'good', 'excellent'] as SleepQuality[]).map(qual => (
                      <button
                        key={qual}
                        type="button"
                        onClick={() => setSleepQuality(qual)}
                        className={`py-2.5 px-3 rounded-xl border text-center font-label-md text-xs capitalize transition-all ${
                          sleepQuality === qual
                            ? 'bg-primary-container text-on-primary-container border-primary font-bold'
                            : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {qual}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-2 pb-12">
            <button
              type="submit"
              className="px-8 py-4 bg-primary text-on-primary font-label-md text-body-md rounded-xl shadow-tier-1 hover:bg-primary-container hover:text-on-primary-container transition-all w-full md:w-auto"
            >
              Save Check-in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyCheckInPage;

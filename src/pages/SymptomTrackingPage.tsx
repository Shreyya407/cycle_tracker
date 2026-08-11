import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { SymptomCategory } from '../types';

interface SymptomOption {
  id: string;
  name: string;
  category: SymptomCategory;
  icon: string;
}

const SYMPTOM_OPTIONS: SymptomOption[] = [
  // Physical
  { id: 'cramps', name: 'Cramps', category: 'physical', icon: 'water_drop' },
  { id: 'headache', name: 'Headache', category: 'physical', icon: 'sick' },
  { id: 'bloating', name: 'Bloating', category: 'physical', icon: 'waves' },
  { id: 'acne', name: 'Acne', category: 'physical', icon: 'face' },
  { id: 'fatigue', name: 'Fatigue', category: 'physical', icon: 'bedtime' },
  { id: 'backache', name: 'Backache', category: 'physical', icon: 'accessibility_new' },

  // Emotional
  { id: 'mood', name: 'Mood changes', category: 'emotional', icon: 'mood_bad' },
  { id: 'irritability', name: 'Irritability', category: 'emotional', icon: 'bolt' },

  // Digestion
  { id: 'appetite', name: 'Appetite changes', category: 'digestion', icon: 'restaurant' },
];

export const SymptomTrackingPage: React.FC = () => {
  const { symptomLogs, logSymptom } = useData();
  const todayStr = new Date().toISOString().split('T')[0];

  const [activeSymptom, setActiveSymptom] = useState<SymptomOption | null>(null);
  const [severity, setSeverity] = useState<number>(2); // 1 = Mild, 2 = Moderate, 3 = Severe
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const todayLogs = symptomLogs.filter(s => s.log_date === todayStr);

  const handleOpenSeverity = (symptom: SymptomOption) => {
    setActiveSymptom(symptom);
    const existing = todayLogs.find(s => s.symptom_type === symptom.id);
    setSeverity(existing ? existing.severity : 2);
  };

  const handleSaveSeverity = async () => {
    if (!activeSymptom) return;
    await logSymptom(activeSymptom.id, activeSymptom.category, severity);
    setSavedBanner(`Saved ${activeSymptom.name} (Severity ${severity}/3)`);
    setActiveSymptom(null);
    setTimeout(() => setSavedBanner(null), 3000);
  };

  const physicalOptions = SYMPTOM_OPTIONS.filter(s => s.category === 'physical');
  const emotionalOptions = SYMPTOM_OPTIONS.filter(s => s.category === 'emotional');
  const digestionOptions = SYMPTOM_OPTIONS.filter(s => s.category === 'digestion');

  return (
    <div className="p-4 lg:p-8 max-w-container-max mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-primary mb-1">How are you feeling today?</h2>
          <p className="font-sans text-body-md text-on-surface-variant">
            Log your symptoms to track recurring patterns over time.
          </p>
        </div>

        {savedBanner ? (
          <div className="flex items-center gap-2 text-secondary bg-secondary-container/80 px-4 py-2 rounded-full font-label-md text-xs border border-secondary animate-fade-in">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{savedBanner}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-secondary bg-secondary-container/50 px-4 py-2 rounded-full font-label-md text-xs">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Changes saved automatically</span>
          </div>
        )}
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Physical Symptoms Column */}
        <section className="md:col-span-8 bg-surface-container-lowest rounded-2xl p-6 shadow-tier-1 border border-outline-variant/10 flex flex-col gap-4">
          <h3 className="font-serif text-2xl text-primary border-b border-outline-variant/20 pb-2">Physical</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {physicalOptions.map(symptom => {
              const logged = todayLogs.find(l => l.symptom_type === symptom.id);
              return (
                <button
                  key={symptom.id}
                  onClick={() => handleOpenSeverity(symptom)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${
                    logged
                      ? 'bg-secondary-container border-secondary font-bold shadow-sm'
                      : 'border-outline-variant/30 bg-surface/50 hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-[32px] mb-2">{symptom.icon}</span>
                  <span className="font-label-md text-sm text-on-surface">{symptom.name}</span>
                  {logged && (
                    <span className="mt-1 font-sans text-xs text-secondary">Severity {logged.severity}/3</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Emotional & Digestion Column */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Emotional */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-tier-1 border border-outline-variant/10 flex flex-col gap-4">
            <h3 className="font-serif text-2xl text-primary border-b border-outline-variant/20 pb-2">Emotional</h3>
            <div className="grid grid-cols-2 gap-4">
              {emotionalOptions.map(symptom => {
                const logged = todayLogs.find(l => l.symptom_type === symptom.id);
                return (
                  <button
                    key={symptom.id}
                    onClick={() => handleOpenSeverity(symptom)}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all ${
                      logged
                        ? 'bg-secondary-container border-secondary font-bold shadow-sm'
                        : 'border-outline-variant/30 bg-surface/50 hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-primary text-[28px] mb-1">{symptom.icon}</span>
                    <span className="font-label-md text-xs text-on-surface text-center">{symptom.name}</span>
                    {logged && (
                      <span className="mt-1 font-sans text-[11px] text-secondary">Sev {logged.severity}/3</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Digestion */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-tier-1 border border-outline-variant/10 flex flex-col gap-4">
            <h3 className="font-serif text-2xl text-primary border-b border-outline-variant/20 pb-2">Digestion</h3>
            <div className="grid grid-cols-1 gap-3">
              {digestionOptions.map(symptom => {
                const logged = todayLogs.find(l => l.symptom_type === symptom.id);
                return (
                  <button
                    key={symptom.id}
                    onClick={() => handleOpenSeverity(symptom)}
                    className={`flex flex-row items-center justify-between p-4 rounded-2xl border transition-all ${
                      logged
                        ? 'bg-secondary-container border-secondary font-bold shadow-sm'
                        : 'border-outline-variant/30 bg-surface/50 hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[24px]">{symptom.icon}</span>
                      <span className="font-label-md text-sm text-on-surface">{symptom.name}</span>
                    </div>
                    {logged && (
                      <span className="font-sans text-xs text-secondary font-semibold">Severity {logged.severity}/3</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* Severity Modal */}
      {activeSymptom && (
        <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest p-8 rounded-2xl w-full max-w-sm shadow-tier-2 border border-outline-variant/20 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h3 className="font-serif text-2xl text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">{activeSymptom.icon}</span>
                <span>{activeSymptom.name}</span>
              </h3>
              <button
                onClick={() => setActiveSymptom(null)}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between font-label-md text-xs text-on-surface-variant">
                <span className={severity === 1 ? 'font-bold text-primary' : ''}>1 - Mild</span>
                <span className={severity === 2 ? 'font-bold text-primary' : ''}>2 - Moderate</span>
                <span className={severity === 3 ? 'font-bold text-primary' : ''}>3 - Severe</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                value={severity}
                onChange={e => setSeverity(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-variant rounded-lg cursor-pointer"
              />
            </div>

            <button
              onClick={handleSaveSeverity}
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md text-sm hover:bg-primary-container transition-all shadow-tier-1"
            >
              Save Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomTrackingPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, signOut, updateProfile } = useAuth();
  const { cycles, periodLogs, checkIns, symptomLogs, journalEntries } = useData();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.full_name || 'Sarah Doe');

  const handleSaveName = async () => {
    await updateProfile({ full_name: nameInput });
    setIsEditingName(false);
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Type,Date,Details\n';

    periodLogs.forEach(p => {
      csvContent += `PeriodLog,${p.log_date},Flow: ${p.flow_level}\n`;
    });

    checkIns.forEach(c => {
      csvContent += `CheckIn,${c.check_in_date},Mood: ${c.mood || ''} | Energy: ${c.energy_level || ''} | Sleep: ${c.sleep_hours || ''}h\n`;
    });

    symptomLogs.forEach(s => {
      csvContent += `SymptomLog,${s.log_date},Symptom: ${s.symptom_type} (Severity ${s.severity}/3)\n`;
    });

    journalEntries.forEach(j => {
      csvContent += `Journal,${j.entry_date},Title: "${j.title.replace(/"/g, '""')}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cyclecare_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const exportData = {
      profile,
      cycles,
      periodLogs,
      checkIns,
      symptomLogs,
      journalEntries,
      exportDate: new Date().toISOString()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cyclecare_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="p-4 lg:p-8 max-w-container-max mx-auto space-y-8">
      {/* Header */}
      <header>
        <h1 className="font-serif text-3xl md:text-4xl text-primary">Settings & Profile</h1>
        <p className="font-sans text-body-md text-on-surface-variant mt-1">
          Manage your personal profile, privacy policies, data exports, and security preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-tier-1 border border-outline-variant/20 p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-surface shadow-sm">
              <img
                src={profile?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuASSGSAVOeN5OnaxdNq9Ghc8A1eVagyeo_4dF4M3WaqUIop34KkDyc1vm36n6TW9JedrL_-k2SKngEXOl9_ovvxwZgZWYSMTjIHe1u5WsG9UizGfdN17p2NvUpzdzV-UBm0Dd2K_CrrK746V3_jn42EwP0sJebaht4IRgWmoEmcpPDpzwh4gXcUg5YTe1E9KQI6h-XJTkQ0yoC2DTOHDWuC_QNpz-TWwUgYwG2Cs8UI9pNVKFAWavk'}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {isEditingName ? (
              <div className="flex flex-col gap-2 w-full mb-3">
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="bg-surface border border-outline-variant/40 rounded-xl px-3 py-2 font-serif text-xl text-center text-primary"
                />
                <button
                  onClick={handleSaveName}
                  className="bg-primary text-on-primary text-xs py-1.5 px-3 rounded-lg font-label-md"
                >
                  Save Name
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-serif text-2xl text-on-surface">{profile?.full_name || 'Sarah Doe'}</h2>
                <button onClick={() => setIsEditingName(true)} className="text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
            )}

            <p className="font-sans text-xs text-on-surface-variant mb-6">{profile?.email || 'sarah.doe@example.com'}</p>

            <div className="w-full bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 text-left text-xs text-on-surface-variant space-y-1">
              <div className="flex justify-between">
                <span>Cycle Baseline:</span>
                <span className="font-semibold text-primary capitalize">{profile?.cycle_regularity || 'Regular'}</span>
              </div>
              <div className="flex justify-between">
                <span>Default Cycle Length:</span>
                <span className="font-semibold text-primary">{profile?.default_cycle_length || 28} days</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-tier-1 border border-outline-variant/20 overflow-hidden">
            <button
              onClick={() => navigate('/reminders')}
              className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors text-left group border-b border-outline-variant/10"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">notifications</span>
                <span className="font-label-md text-sm text-on-surface group-hover:text-primary">Notification Settings</span>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Right Column: Data Management & Privacy */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Data Export Card */}
          <section className="bg-surface-container-lowest rounded-2xl shadow-tier-1 border border-outline-variant/20 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">data_usage</span>
              </div>
              <div>
                <h3 className="font-serif text-xl text-on-surface">Data Export & Backup</h3>
                <p className="font-sans text-xs text-on-surface-variant">Export your personal tracking logs anytime.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 p-4 rounded-xl border border-outline-variant/40 hover:bg-surface-container-low transition-colors font-label-md text-sm text-on-surface"
              >
                <span className="material-symbols-outlined text-primary">csv</span>
                <span>Export Data as CSV</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 p-4 rounded-xl border border-outline-variant/40 hover:bg-surface-container-low transition-colors font-label-md text-sm text-on-surface"
              >
                <span className="material-symbols-outlined text-primary">data_object</span>
                <span>Export Data as JSON</span>
              </button>
            </div>
          </section>

          {/* Privacy & RLS Security Card */}
          <section className="bg-surface-container-lowest rounded-2xl shadow-tier-1 border border-outline-variant/20 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">shield_lock</span>
              </div>
              <div>
                <h3 className="font-serif text-xl text-on-surface">Privacy & Access Protection</h3>
                <p className="font-sans text-xs text-on-surface-variant">Row Level Security (RLS) enforcement.</p>
              </div>
            </div>

            <div className="bg-secondary-container/30 border border-secondary-container rounded-xl p-4 flex items-start gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary mt-0.5">lock</span>
              <div className="text-xs">
                <h4 className="font-label-md text-on-secondary-container font-semibold">User Data Isolation Guarantee</h4>
                <p className="font-sans text-on-surface-variant mt-0.5 leading-relaxed">
                  Your cycle logs, journal notes, and symptoms are bound to your user ID with Supabase Row Level Security policies. No third party or other user can read or write your personal wellbeing records.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <h4 className="font-label-md text-sm text-on-surface">Account Sign Out</h4>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">Safely log out of this browser session.</p>
              </div>
              <button
                onClick={handleSignOut}
                className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface font-label-md text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

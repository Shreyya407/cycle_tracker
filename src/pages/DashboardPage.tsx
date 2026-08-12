import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { prediction, patterns, checkIns, symptomLogs, cycles } = useData();

  const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const userName = profile?.full_name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayCheckIn = checkIns.find(c => c.check_in_date === todayDateStr);
  const todaySymptoms = symptomLogs.filter(s => s.log_date === todayDateStr);

  const hasCycleData = cycles.length > 0 || prediction.currentCycleDay > 0;
  const progressPercentage = hasCycleData
    ? Math.min(100, Math.round((prediction.currentCycleDay / prediction.averageCycleLength) * 100))
    : 0;

  const topInsight = patterns[0] || null;

  return (
    <div className="p-4 lg:p-8 max-w-container-max mx-auto space-y-8">
      {/* Header Section */}
      <header className="flex justify-between items-end">
        <div>
          <p className="font-sans text-label-md text-on-surface-variant mb-1">Today, {todayStr}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-primary font-medium">{greeting}, {userName}</h2>
        </div>
        <div
          onClick={() => navigate('/settings')}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface-container shadow-sm cursor-pointer hover:opacity-90 transition-opacity bg-surface-container flex items-center justify-center"
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant text-[24px]">person</span>
          )}
        </div>
      </header>

      {/* Onboarding Prompt for first-time users with no cycle data */}
      {!hasCycleData && (
        <div className="bg-gradient-to-br from-secondary-container/40 to-tertiary-fixed/30 rounded-[24px] p-6 lg:p-8 shadow-tier-1 border border-outline-variant/20">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[28px]">favorite</span>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-primary mb-2">Welcome to CycleCare</h3>
              <p className="font-sans text-body-md text-on-surface-variant mb-4 max-w-2xl">
                To start tracking your cycle and receiving personalized predictions, log your most recent period. This helps us calculate your cycle day, predict your next period, and surface meaningful patterns over time.
              </p>
              <button
                onClick={() => navigate('/calendar')}
                className="px-6 py-3 bg-primary text-on-primary font-label-md text-sm rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all shadow-tier-1 active:scale-95 inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                <span>Log Your First Period</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Cycle Card (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] p-6 lg:p-8 shadow-tier-1 relative overflow-hidden flex flex-col justify-between min-h-[320px] border border-outline-variant/10">
          {/* Ambient Glow */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-tertiary-fixed/20 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 flex justify-between items-start flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-xs mb-3 border border-secondary-container">
                {hasCycleData ? `${prediction.currentPhase} Phase` : 'Getting Started'}
              </span>
              <h3 className="font-serif text-4xl lg:text-5xl text-primary mb-2">
                {hasCycleData ? `Cycle Day ${prediction.currentCycleDay}` : 'No Cycle Logged Yet'}
              </h3>
              <p className="font-sans text-body-md text-on-surface-variant max-w-md">
                {prediction.phaseDescription}
              </p>
            </div>

            {/* Prediction Confidence Badge */}
            {hasCycleData && (
              <div className="text-right bg-surface-container-low/80 p-3 rounded-2xl border border-outline-variant/20 backdrop-blur-sm">
                <div className="flex items-center gap-1 justify-end text-secondary font-semibold">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span className="font-label-sm text-xs">{prediction.confidenceScore}% Confidence</span>
                </div>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">{prediction.confidenceDescription}</p>
              </div>
            )}
          </div>

          <div className="relative z-10 mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-sans text-label-md text-on-surface-variant mb-1">Next Predicted Period</p>
              <p className="font-serif text-2xl text-primary">
                {hasCycleData ? (
                  <>
                    {prediction.nextPeriodDate}{' '}
                    <span className="font-sans text-sm text-on-surface-variant ml-2 font-normal">
                      (in {prediction.daysUntilNextPeriod} days)
                    </span>
                  </>
                ) : (
                  <span className="text-on-surface-variant">—</span>
                )}
              </p>
            </div>

            {/* Progress Bar */}
            {hasCycleData && (
              <div className="w-full md:w-1/2">
                <div className="flex justify-between font-label-sm text-xs text-on-surface-variant mb-2">
                  <span>Day 1</span>
                  <span>Day {prediction.averageCycleLength}</span>
                </div>
                <div className="h-2.5 w-full bg-surface-variant rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-tertiary-container rounded-full relative transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/60 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Insights & Quick Actions Column */}
        <div className="flex flex-col gap-6 h-full">
          {/* Insight Card */}
          <div className="flex-1 bg-surface-container-low rounded-[24px] p-6 shadow-tier-1 border border-outline-variant/10 flex flex-col justify-between">
            {topInsight ? (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-tertiary p-2 bg-tertiary-fixed rounded-full text-[18px]">
                      auto_awesome
                    </span>
                    <h4 className="font-serif text-xl text-primary">{topInsight.title}</h4>
                  </div>
                  <p className="font-sans text-body-md text-on-surface mb-4">
                    {topInsight.description}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/insights')}
                  className="text-tertiary font-label-md text-sm flex items-center gap-1 hover:opacity-80 transition-opacity w-fit mt-2"
                >
                  <span>View Pattern Details</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-on-surface-variant p-2 bg-surface-container-high rounded-full text-[18px]">
                    lightbulb
                  </span>
                  <h4 className="font-serif text-xl text-primary">No Patterns Yet</h4>
                </div>
                <p className="font-sans text-body-md text-on-surface-variant mb-4">
                  Personal insights will appear here once you've logged a few cycles and daily check-ins. Start tracking to unlock tailored patterns.
                </p>
                <button
                  onClick={() => navigate('/check-in')}
                  className="text-tertiary font-label-md text-sm flex items-center gap-1 hover:opacity-80 transition-opacity w-fit mt-2"
                >
                  <span>Start a Check-in</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/symptoms')}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-primary text-[24px]">add_circle</span>
              <span className="font-label-sm text-xs text-on-surface">Log Symptom</span>
            </button>

            <button
              onClick={() => navigate('/check-in')}
              className="bg-primary text-on-primary rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-all shadow-tier-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">edit_note</span>
              <span className="font-label-sm text-xs">Start Check-in</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Overview Widgets */}
      <div>
        <h3 className="font-serif text-2xl text-primary mb-4">Today's Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {/* Mood Widget */}
          <div
            onClick={() => navigate('/check-in')}
            className="bg-surface-container-lowest rounded-2xl p-5 shadow-tier-1 border border-outline-variant/10 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-secondary text-[24px]">sentiment_satisfied</span>
            </div>
            <h4 className="font-label-sm text-xs text-on-surface-variant mb-1">Mood</h4>
            <p className="font-serif text-2xl text-primary capitalize">
              {todayCheckIn?.mood || '—'}
            </p>
          </div>

          {/* Energy Widget */}
          <div
            onClick={() => navigate('/check-in')}
            className="bg-surface-container-lowest rounded-2xl p-5 shadow-tier-1 border border-outline-variant/10 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-tertiary text-[24px]">bolt</span>
            </div>
            <h4 className="font-label-sm text-xs text-on-surface-variant mb-1">Energy Level</h4>
            <p className="font-serif text-2xl text-primary">
              {todayCheckIn?.energy_level ? `${todayCheckIn.energy_level}/5` : '—'}
            </p>
          </div>

          {/* Sleep Widget */}
          <div
            onClick={() => navigate('/check-in')}
            className="bg-surface-container-lowest rounded-2xl p-5 shadow-tier-1 border border-outline-variant/10 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-primary text-[24px]">bedtime</span>
            </div>
            <h4 className="font-label-sm text-xs text-on-surface-variant mb-1">Sleep</h4>
            <p className="font-serif text-2xl text-primary">
              {todayCheckIn?.sleep_hours ? `${todayCheckIn.sleep_hours}h` : '—'}
            </p>
          </div>

          {/* Symptoms Widget */}
          <div
            onClick={() => navigate('/symptoms')}
            className="bg-surface-container-lowest rounded-2xl p-5 shadow-tier-1 border border-outline-variant/10 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-on-surface-variant text-[24px]">health_and_safety</span>
            </div>
            <h4 className="font-label-sm text-xs text-on-surface-variant mb-1">Symptoms</h4>
            <p className="font-serif text-2xl text-primary">
              {todaySymptoms.length > 0 ? `${todaySymptoms.length} Logged` : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

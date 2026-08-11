import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { formatDate, parseDate, addDays, differenceInDays } from '../lib/cycleLogic';
import { FlowLevel } from '../types';

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { periodLogs, checkIns, symptomLogs, journalEntries, prediction, logPeriodDay } = useData();

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(formatDate(new Date()));

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentMonthDate(new Date());
    setSelectedDateStr(formatDate(new Date()));
  };

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long' });

  // Generate grid days for month
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const gridDays: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Previous month padding days
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthLastDate - i);
    gridDays.push({ dateStr: formatDate(prevDate), dayNum: prevDate.getDate(), isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const currDate = new Date(year, month, day);
    gridDays.push({ dateStr: formatDate(currDate), dayNum: day, isCurrentMonth: true });
  }

  // Next month padding days to complete grid
  const remaining = (7 - (gridDays.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(year, month + 1, i);
    gridDays.push({ dateStr: formatDate(nextDate), dayNum: i, isCurrentMonth: false });
  }

  // Selected Day Details
  const selectedLog = periodLogs.find(p => p.log_date === selectedDateStr);
  const selectedCheckIn = checkIns.find(c => c.check_in_date === selectedDateStr);
  const selectedSymptoms = symptomLogs.filter(s => s.log_date === selectedDateStr);
  const selectedJournal = journalEntries.find(j => j.entry_date === selectedDateStr);

  const selectedDateObj = parseDate(selectedDateStr);
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-on-background">
      {/* Calendar Area */}
      <section className="flex-1 p-4 lg:p-8 flex flex-col max-w-container-max mx-auto w-full">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-primary">{monthName}</h2>
            <p className="font-sans text-body-lg text-on-surface-variant">{year}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors border border-outline-variant/30"
              aria-label="Previous Month"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 rounded-full hover:bg-surface-container-high font-label-md text-sm text-on-surface transition-colors border border-outline-variant/30"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors border border-outline-variant/30"
              aria-label="Next Month"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </header>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mb-6 px-4 py-3 bg-surface-container-low rounded-xl self-start border border-outline-variant/10">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-tertiary-container shadow-sm"></div>
            <span className="font-label-sm text-xs text-on-surface-variant">Period (Logged)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-tertiary-container"></div>
            <span className="font-label-sm text-xs text-on-surface-variant">Predicted Window</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-secondary-container border border-secondary"></div>
            <span className="font-label-sm text-xs text-on-surface-variant">Predicted Ovulation</span>
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="bg-surface shadow-soft-tier-1 rounded-2xl overflow-hidden border border-outline-variant/20 flex-1 flex flex-col">
          {/* Days Header */}
          <div className="grid grid-cols-7 bg-surface-container-low border-b border-outline-variant/20">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-3 text-center font-label-md text-xs text-on-surface-variant font-semibold">
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="calendar-grid flex-1">
            {gridDays.map((cell, idx) => {
              const isSelected = cell.dateStr === selectedDateStr;
              const isToday = cell.dateStr === formatDate(new Date());

              const isPeriodLogged = periodLogs.some(p => p.log_date === cell.dateStr);

              // Prediction matches
              const isPredictedPeriod = cell.dateStr >= prediction.nextPeriodDate &&
                cell.dateStr < addDays(prediction.nextPeriodDate, prediction.averagePeriodLength);

              const isOvulationDay = cell.dateStr === prediction.predictedOvulationDate;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`calendar-cell relative cursor-pointer transition-all ${
                    !cell.isCurrentMonth ? 'bg-surface-dim/40 text-on-surface-variant/40' : 'hover:bg-surface-container-low'
                  } ${isPeriodLogged ? '!bg-tertiary-container text-on-tertiary-container' : ''} ${
                    isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface rounded-lg z-10' : ''
                  }`}
                >
                  {/* Outer Dashed Border for Predicted Window */}
                  {isPredictedPeriod && !isPeriodLogged && (
                    <div className="absolute inset-1 border-2 border-dashed border-tertiary-container rounded-lg pointer-events-none opacity-60"></div>
                  )}

                  <div className="flex justify-between items-start">
                    <span
                      className={`font-sans text-sm ${
                        isToday
                          ? 'bg-primary text-on-primary font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs'
                          : isPeriodLogged
                          ? 'font-bold text-on-tertiary-container'
                          : 'text-on-surface'
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    {isPeriodLogged && (
                      <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">water_drop</span>
                    )}

                    {isOvulationDay && !isPeriodLogged && (
                      <span className="material-symbols-outlined text-[16px] text-secondary">egg</span>
                    )}
                  </div>

                  <div className="text-[10px] text-right font-medium opacity-70">
                    {isPeriodLogged ? 'Period' : isOvulationDay ? 'Ovulation' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Right Drawer: Selected Day Details */}
      <aside className="w-full lg:w-[360px] bg-surface-container-lowest border-l border-outline-variant/30 flex flex-col p-6 shadow-[-4px_0_24px_rgba(21,45,53,0.02)]">
        <header className="mb-6 pb-4 border-b border-outline-variant/20">
          <p className="font-label-sm text-xs text-primary uppercase tracking-widest mb-1">Selected Day</p>
          <h3 className="font-serif text-2xl text-on-surface mb-2">{formattedSelectedDate}</h3>

          <div className="flex items-center gap-2 flex-wrap">
            {selectedLog ? (
              <span className="inline-flex items-center gap-1 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px]">water_drop</span>
                <span>Logged Flow: {selectedLog.flow_level}</span>
              </span>
            ) : (
              <button
                onClick={() => logPeriodDay(selectedDateStr, 'medium')}
                className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary px-3 py-1 rounded-full text-xs font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                <span>Log Period for Day</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* Quick Flow Selection */}
          <section>
            <h4 className="font-label-md text-xs text-on-surface-variant flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px]">bloodtype</span>
              <span>Flow Severity</span>
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {(['spotting', 'light', 'medium', 'heavy'] as FlowLevel[]).map(flow => (
                <button
                  key={flow}
                  onClick={() => logPeriodDay(selectedDateStr, flow)}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-label-md capitalize transition-all ${
                    selectedLog?.flow_level === flow
                      ? 'bg-tertiary-container text-on-tertiary-container font-bold shadow-sm'
                      : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {flow}
                </button>
              ))}
            </div>
          </section>

          {/* Symptoms Section */}
          <section>
            <h4 className="font-label-md text-xs text-on-surface-variant flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px]">healing</span>
              <span>Symptoms Logged</span>
            </h4>
            {selectedSymptoms.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {selectedSymptoms.map(sym => (
                  <div key={sym.id} className="bg-surface p-3 rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col justify-between">
                    <span className="material-symbols-outlined text-secondary text-[20px] mb-1">healing</span>
                    <div>
                      <div className="font-label-sm text-xs text-on-surface-variant capitalize">{sym.symptom_type}</div>
                      <div className="font-sans text-xs text-on-surface font-semibold">
                        Severity {sym.severity}/3
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface p-4 rounded-2xl border border-outline-variant/20 text-xs text-on-surface-variant flex justify-between items-center">
                <span>No symptoms logged for this date.</span>
                <button onClick={() => navigate('/symptoms')} className="text-primary font-bold hover:underline">
                  Log
                </button>
              </div>
            )}
          </section>

          {/* Energy Level */}
          <section>
            <h4 className="font-label-md text-xs text-on-surface-variant flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px]">battery_charging_full</span>
              <span>Energy & Check-in</span>
            </h4>
            <div className="bg-secondary-container/20 p-4 rounded-2xl flex items-center justify-between border border-secondary-container/30">
              <div>
                <div className="font-sans text-xs text-on-surface-variant">Energy Score</div>
                <div className="font-serif text-lg text-primary font-bold">
                  {selectedCheckIn?.energy_level ? `${selectedCheckIn.energy_level} / 5` : 'High (4/5)'}
                </div>
              </div>
              <div className="flex gap-1 text-secondary">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
            </div>
          </section>

          {/* Journal Snippet */}
          <section>
            <h4 className="font-label-md text-xs text-on-surface-variant flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>Journal Notes</span>
            </h4>
            {selectedJournal ? (
              <div className="bg-surface p-4 rounded-2xl border border-outline-variant/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/30"></div>
                <h5 className="font-serif text-sm font-semibold text-primary mb-1">{selectedJournal.title}</h5>
                <p className="font-sans text-xs text-on-surface-variant italic line-clamp-3">"{selectedJournal.body}"</p>
              </div>
            ) : (
              <div className="bg-surface p-4 rounded-2xl border border-outline-variant/20 text-xs text-on-surface-variant flex justify-between items-center">
                <span>No journal entry recorded.</span>
                <button onClick={() => navigate('/journal')} className="text-primary font-bold hover:underline">
                  Write
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Action Button */}
        <div className="pt-6 mt-auto border-t border-outline-variant/20">
          <button
            onClick={() => navigate('/check-in')}
            className="w-full bg-surface hover:bg-surface-container-low text-primary border border-primary/20 rounded-xl py-3 px-4 font-label-md text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span>Update Daily Check-in</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default CalendarPage;

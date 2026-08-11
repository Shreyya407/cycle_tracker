import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { JournalEntry } from '../types';
import { formatDate } from '../lib/cycleLogic';

export const JournalPage: React.FC = () => {
  const { journalEntries, saveJournalEntry, deleteJournalEntry, prediction } = useData();

  const [selectedId, setSelectedId] = useState<string | null>(
    journalEntries.length > 0 ? journalEntries[0].id : null
  );
  const [searchTerm, setSearchTerm] = useState('');

  // New entry draft state
  const [activeTitle, setActiveTitle] = useState(
    journalEntries.length > 0 ? journalEntries[0].title : 'A profound sense of calm'
  );
  const [activeBody, setActiveBody] = useState(
    journalEntries.length > 0
      ? journalEntries[0].body
      : "Today I woke up feeling surprisingly rested. The usual mid-cycle tension seems to have dissipated entirely, replaced by a grounded, steady energy."
  );

  const filteredEntries = journalEntries.filter(
    j =>
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEntry = journalEntries.find(j => j.id === selectedId);

  const handleSelect = (entry: JournalEntry) => {
    setSelectedId(entry.id);
    setActiveTitle(entry.title);
    setActiveBody(entry.body);
  };

  const handleCreateNew = () => {
    const todayStr = formatDate(new Date());
    saveJournalEntry('Untitled Entry', '', todayStr);
  };

  const handleTitleChange = (val: string) => {
    setActiveTitle(val);
    if (selectedId) {
      saveJournalEntry(val, activeBody);
    }
  };

  const handleBodyChange = (val: string) => {
    setActiveBody(val);
    if (selectedId) {
      saveJournalEntry(activeTitle, val);
    }
  };

  const handleDelete = (id: string) => {
    deleteJournalEntry(id);
    if (selectedId === id) {
      const remaining = journalEntries.filter(j => j.id !== id);
      if (remaining.length > 0) {
        handleSelect(remaining[0]);
      } else {
        setSelectedId(null);
        setActiveTitle('');
        setActiveBody('');
      }
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Left Panel: Entry List */}
      <aside className="w-full md:w-1/3 lg:w-[380px] border-r border-outline-variant/30 flex flex-col bg-surface overflow-hidden">
        <div className="p-4 md:p-6 border-b border-outline-variant/20 flex-shrink-0 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-primary font-medium">Private Journal</h2>
            <button
              onClick={handleCreateNew}
              className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-colors"
              title="Create New Entry"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search journal notes..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredEntries.map(entry => {
            const isSelected = entry.id === selectedId;
            return (
              <div
                key={entry.id}
                onClick={() => handleSelect(entry)}
                className={`p-4 rounded-xl cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-primary-fixed-dim/30 border-l-4 border-primary shadow-sm'
                    : 'hover:bg-surface-container-low border-l-4 border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-label-md text-xs text-on-surface">{entry.entry_date}</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-semibold">
                    Day {entry.cycle_day || prediction.currentCycleDay}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-primary mb-1 line-clamp-1">{entry.title || 'Untitled Entry'}</h3>
                <p className="font-sans text-xs text-on-surface-variant line-clamp-2">{entry.body || 'No text written yet...'}</p>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right Panel: Editor */}
      <section className="flex-1 flex flex-col bg-background overflow-hidden relative p-6 lg:p-12">
        <div className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/10">
            <div>
              <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                {selectedEntry?.entry_date || formatDate(new Date())} • Cycle Day {selectedEntry?.cycle_day || prediction.currentCycleDay}
              </p>
              <input
                type="text"
                value={activeTitle}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Title your entry..."
                className="w-full bg-transparent border-none font-serif text-3xl md:text-4xl text-primary focus:outline-none focus:ring-0 p-0"
              />
            </div>

            {selectedId && (
              <button
                onClick={() => handleDelete(selectedId)}
                className="p-2.5 rounded-full hover:bg-error-container text-error transition-colors"
                title="Delete Entry"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            )}
          </div>

          {/* Body Textarea */}
          <div className="flex-1 flex flex-col">
            <textarea
              value={activeBody}
              onChange={e => handleBodyChange(e.target.value)}
              placeholder="Start writing your thoughts, feelings, or wellness reflections..."
              className="w-full flex-1 min-h-[400px] bg-transparent border-none resize-none focus:outline-none focus:ring-0 p-0 font-sans text-body-lg text-on-surface leading-relaxed placeholder:text-on-surface-variant/30"
            />
          </div>
        </div>

        {/* Floating Auto-save indicator */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-surface border border-outline-variant/30 px-4 py-2 rounded-full shadow-sm text-xs font-label-md text-on-surface-variant">
          <span className="material-symbols-outlined text-secondary text-sm">cloud_done</span>
          <span>Auto-saved locally & synced</span>
        </div>
      </section>
    </div>
  );
};

export default JournalPage;

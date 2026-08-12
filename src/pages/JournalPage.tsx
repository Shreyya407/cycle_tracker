import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { JournalEntry } from '../types';
import { formatDate } from '../lib/cycleLogic';

const UNTITLED = 'Untitled Entry';

export const JournalPage: React.FC = () => {
  const { journalEntries, saveJournalEntry, deleteJournalEntry, prediction } = useData();

  const [selectedId, setSelectedId] = useState<string | null>(
    journalEntries.length > 0 ? journalEntries[0].id : null
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Draft state for the currently selected entry
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [draftDate, setDraftDate] = useState(formatDate(new Date()));
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const selectedEntry = useMemo(
    () => journalEntries.find(j => j.id === selectedId) || null,
    [journalEntries, selectedId]
  );

  // Keep the draft in sync with the selected entry
  useEffect(() => {
    if (selectedEntry) {
      setDraftTitle(selectedEntry.title);
      setDraftBody(selectedEntry.body);
      setDraftDate(selectedEntry.entry_date);
      setIsNewEntry(false);
    } else if (isNewEntry) {
      // keep current draft values for a brand new entry
      setDraftDate(formatDate(new Date()));
    } else {
      setDraftTitle('');
      setDraftBody('');
      setDraftDate(formatDate(new Date()));
    }
    setSaveStatus('idle');
  }, [selectedId, isNewEntry]);

  const filteredEntries = journalEntries.filter(
    j =>
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (entry: JournalEntry) => {
    setSelectedId(entry.id);
    setIsNewEntry(false);
  };

  const handleCreateNew = () => {
    setSelectedId(null);
    setIsNewEntry(true);
    setDraftTitle('');
    setDraftBody('');
    setDraftDate(formatDate(new Date()));
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const titleToSave = draftTitle.trim() || UNTITLED;
      await saveJournalEntry(titleToSave, draftBody, draftDate, selectedId || undefined);

      // After saving a brand new entry, select it so subsequent edits update it
      if (!selectedId) {
        // The newest entry is now at the top of the list
        const created = journalEntries[0];
        if (created) {
          setSelectedId(created.id);
        }
        setIsNewEntry(false);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to save journal entry', err);
      setSaveStatus('idle');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteJournalEntry(id);
    if (selectedId === id) {
      const remaining = journalEntries.filter(j => j.id !== id);
      if (remaining.length > 0) {
        handleSelect(remaining[0]);
      } else {
        setSelectedId(null);
        setIsNewEntry(false);
        setDraftTitle('');
        setDraftBody('');
      }
    }
  };

  const hasDraft = draftTitle.trim() !== '' || draftBody.trim() !== '';
  const headerDate = selectedEntry?.entry_date || draftDate;
  const headerCycleDay = selectedEntry?.cycle_day || prediction.currentCycleDay;

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
          {isNewEntry && (
            <div className="p-4 rounded-xl cursor-pointer bg-primary-fixed-dim/30 border-l-4 border-primary shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="font-label-md text-xs text-on-surface">{draftDate}</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-semibold">
                  New
                </span>
              </div>
              <h3 className="font-serif text-lg text-primary mb-1 line-clamp-1">
                {draftTitle || UNTITLED}
              </h3>
              <p className="font-sans text-xs text-on-surface-variant line-clamp-2">
                {draftBody || 'No text written yet...'}
              </p>
            </div>
          )}

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
                <h3 className="font-serif text-lg text-primary mb-1 line-clamp-1">{entry.title || UNTITLED}</h3>
                <p className="font-sans text-xs text-on-surface-variant line-clamp-2">{entry.body || 'No text written yet...'}</p>
              </div>
            );
          })}

          {filteredEntries.length === 0 && !isNewEntry && (
            <div className="p-6 text-center text-on-surface-variant text-sm">
              No journal entries yet. Click the + button to start writing.
            </div>
          )}
        </div>
      </aside>

      {/* Right Panel: Editor */}
      <section className="flex-1 flex flex-col bg-background overflow-hidden relative p-6 lg:p-12">
        <div className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/10">
            <div className="flex-1">
              <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                {headerDate} • Cycle Day {headerCycleDay}
              </p>
              <input
                type="text"
                value={draftTitle}
                onChange={e => setDraftTitle(e.target.value)}
                placeholder="Title your entry..."
                className="w-full bg-transparent border-none font-serif text-3xl md:text-4xl text-primary focus:outline-none focus:ring-0 p-0"
              />
            </div>

            {selectedId && (
              <button
                onClick={() => handleDelete(selectedId)}
                className="p-2.5 rounded-full hover:bg-error-container text-error transition-colors shrink-0"
                title="Delete Entry"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            )}
          </div>

          {/* Date picker for new entries */}
          {isNewEntry && (
            <div className="mb-4 flex items-center gap-2">
              <label className="font-label-md text-xs text-on-surface-variant">Entry Date:</label>
              <input
                type="date"
                value={draftDate}
                onChange={e => setDraftDate(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-1.5 font-sans text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}

          {/* Body Textarea */}
          <div className="flex-1 flex flex-col">
            <textarea
              value={draftBody}
              onChange={e => setDraftBody(e.target.value)}
              placeholder="Start writing your thoughts, feelings, or wellness reflections..."
              className="w-full flex-1 min-h-[400px] bg-transparent border-none resize-none focus:outline-none focus:ring-0 p-0 font-sans text-body-lg text-on-surface leading-relaxed placeholder:text-on-surface-variant/30"
            />
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 pb-4 border-t border-outline-variant/10">
            <div className="flex items-center gap-2 text-xs font-label-md text-on-surface-variant">
              {saveStatus === 'saving' && (
                <>
                  <span className="material-symbols-outlined text-sm animate-pulse">sync</span>
                  <span>Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <span className="material-symbols-outlined text-secondary text-sm">cloud_done</span>
                  <span>Saved</span>
                </>
              )}
              {saveStatus === 'idle' && (
                <>
                  <span className="material-symbols-outlined text-on-surface-variant/50 text-sm">edit_note</span>
                  <span>{selectedId ? 'Edit and save to update' : 'Write your entry and save'}</span>
                </>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={!hasDraft && !selectedId}
              className="px-6 py-3 bg-primary text-on-primary font-label-md text-sm rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all shadow-tier-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>{selectedId ? 'Save Changes' : 'Save Entry'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JournalPage;

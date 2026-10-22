import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { CURRICULUM, TOTAL_DAYS } from '../data/curriculum';

interface NotesPageProps {
  onBack: () => void;
  currentDay: number;
  onSelectDay: (day: number) => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({
  onBack,
  currentDay,
  onSelectDay,
}) => {
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [noteContent, setNoteContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [daysWithNotes, setDaysWithNotes] = useState<number[]>([]);

  const dayData = CURRICULUM.find((d) => d.dayNumber === selectedDay) || CURRICULUM[0];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`rike_notes_day_${selectedDay}`) || localStorage.getItem(`ad2_notes_day_${selectedDay}`) || '';
      setNoteContent(saved);
    } catch {
      setNoteContent('');
    }
  }, [selectedDay]);

  useEffect(() => {
    const list: number[] = [];
    for (let i = 1; i <= TOTAL_DAYS; i++) {
      const saved = localStorage.getItem(`rike_notes_day_${i}`) || localStorage.getItem(`ad2_notes_day_${i}`);
      if (saved && saved.trim().length > 0) {
        list.push(i);
      }
    }
    setDaysWithNotes(list);
  }, [selectedDay]);

  const handleSave = () => {
    try {
      localStorage.setItem(`rike_notes_day_${selectedDay}`, noteContent);
      setSaveStatus('Saved successfully');
      setTimeout(() => setSaveStatus(''), 2500);
      if (!daysWithNotes.includes(selectedDay) && noteContent.trim()) {
        setDaysWithNotes((prev) => [...prev, selectedDay].sort((a, b) => a - b));
      }
    } catch {
      setSaveStatus('Error saving note');
    }
  };

  const handleClear = () => {
    if (window.confirm(`Clear notes for Day ${selectedDay}?`)) {
      localStorage.removeItem(`rike_notes_day_${selectedDay}`);
      localStorage.removeItem(`ad2_notes_day_${selectedDay}`);
      setNoteContent('');
      setDaysWithNotes((prev) => prev.filter((d) => d !== selectedDay));
      setSaveStatus('Notes cleared');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const insertSnippet = (snippet: string) => {
    setNoteContent((prev) => prev ? `${prev}\n\n${snippet}` : snippet);
  };

  return (
    <div className="w-full max-w-5xl space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs sm:text-sm font-heading font-semibold text-[#091424] dark:text-white hover:opacity-75 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Return to Workspace</span>
        </button>
        <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
          NOTES &bull; DAY {String(selectedDay).padStart(3, '0')}
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-6 sm:p-8 md:p-10 shadow-sm space-y-7 text-[#091424] dark:text-[#F3F3F0] transition-colors">
        {/* Day Selector and Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E0D5] dark:border-[#383838]">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <span className="px-3.5 py-1 rounded-full bg-[#FAE392] text-[#091424] font-heading font-bold text-[11px] uppercase tracking-wider">
                Phase {dayData.phase}: {dayData.phaseName}
              </span>
              <span className="text-xs font-heading font-medium text-[#64748B] dark:text-[#9E9E96]">
                Day {selectedDay} of 180
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#091424] dark:text-white pt-1">
              {dayData.title}
            </h1>
            <p className="text-xs sm:text-sm font-body text-[#334155] dark:text-[#D5D5CF]">
              <span className="font-editorial italic mr-1">Focus:</span> {dayData.focus}
            </p>
          </div>

          {/* Quick Day Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-heading font-medium text-[#64748B] dark:text-[#9E9E96]">Jump Day:</span>
            <select
              value={selectedDay}
              onChange={(e) => {
                const day = parseInt(e.target.value, 10);
                setSelectedDay(day);
                onSelectDay(day);
              }}
              className="px-3 py-1.5 rounded-xl border border-[#E5E0D5] dark:border-[#383838] bg-white dark:bg-[#1f1f1f] text-xs font-heading font-bold text-[#091424] dark:text-white focus:outline-none focus:border-[#FCD34D]"
            >
              {CURRICULUM.map((d) => (
                <option key={d.dayNumber} value={d.dayNumber}>
                  Day {String(d.dayNumber).padStart(3, '0')}: {d.title.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Template Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-heading font-medium text-[#64748B] dark:text-[#9E9E96] mr-1">Insert Template:</span>
          <button
            type="button"
            onClick={() => insertSnippet('### 💡 Key Takeaway\n- ')}
            className="px-3 py-1 rounded-full border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] hover:bg-white dark:hover:bg-[#2c2c2c] text-[11px] font-heading font-medium text-[#091424] dark:text-white transition-all shadow-sm"
          >
            + Key Takeaway
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('### ⏱️ Time & Space Complexity\n- Time Complexity: O()\n- Space Complexity: O()')}
            className="px-3 py-1 rounded-full border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] hover:bg-white dark:hover:bg-[#2c2c2c] text-[11px] font-heading font-medium text-[#091424] dark:text-white transition-all shadow-sm"
          >
            + Complexity Analysis
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('### ⚠️ Mistake Log & Edge Cases\n- Watch out for: ')}
            className="px-3 py-1 rounded-full border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] hover:bg-white dark:hover:bg-[#2c2c2c] text-[11px] font-heading font-medium text-[#091424] dark:text-white transition-all shadow-sm"
          >
            + Mistake Log
          </button>
        </div>

        {/* Notes Editor Area */}
        <div className="space-y-3">
          <textarea
            rows={12}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Document key algorithmic intuition, code snippets, tricky edge cases, and personal insights..."
            className="w-full bg-[#FCFBF8] dark:bg-[#1f1f1f] border border-[#E5E0D5] dark:border-[#383838] rounded-2xl p-5 text-sm font-body text-[#091424] dark:text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FCD34D] leading-relaxed resize-y transition-all shadow-inner"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-3 text-xs font-body text-[#64748B] dark:text-[#9E9E96]">
              <span>{noteContent.length} characters</span>
              <span>&bull;</span>
              <span>{noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0} words</span>
              {saveStatus && (
                <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-medium animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{saveStatus}</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {noteContent && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 rounded-full border border-[#E5E0D5] dark:border-[#383838] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-heading font-medium transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-full bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] hover:opacity-90 text-xs font-heading font-bold tracking-wider transition-all shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Previous Saved Notes History */}
        {daysWithNotes.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[#E5E0D5] dark:border-[#383838]">
            <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-[#091424] dark:text-white">
              Saved Notes Archive ({daysWithNotes.length} days recorded)
            </h3>
            <div className="flex flex-wrap gap-2">
              {daysWithNotes.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDay(d);
                    onSelectDay(d);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-heading font-medium border transition-all ${
                    selectedDay === d
                      ? 'bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] border-[#091424] dark:border-[#FCD34D]'
                      : 'bg-[#FCFBF8] dark:bg-[#222222] text-[#091424] dark:text-white border-[#E5E0D5] dark:border-[#383838] hover:border-[#091424] dark:hover:border-white'
                  }`}
                >
                  Day {String(d).padStart(3, '0')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

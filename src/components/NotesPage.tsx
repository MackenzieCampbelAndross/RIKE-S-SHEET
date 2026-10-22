import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { CURRICULUM as DEFAULT_CURRICULUM, TOTAL_DAYS } from '../data/curriculum';
import type { DayPlan, CourseId, CourseMetadata, CourseStats } from '../types/curriculum';
import { CourseSwitcher } from './CourseSwitcher';

interface NotesPageProps {
  onBack: () => void;
  currentDay: number;
  onSelectDay: (day: number) => void;
  curriculum?: DayPlan[];
  courseId?: CourseId;
  courseMeta?: CourseMetadata;
  courses?: CourseStats[];
  onSelectCourse?: (courseId: CourseId) => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({
  onBack,
  currentDay,
  onSelectDay,
  curriculum = DEFAULT_CURRICULUM,
  courseId = 'cpp-heavy',
  courseMeta,
  courses,
  onSelectCourse,
}) => {
  const activeCurriculum = curriculum && curriculum.length > 0 ? curriculum : DEFAULT_CURRICULUM;
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [noteContent, setNoteContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [daysWithNotes, setDaysWithNotes] = useState<number[]>([]);

  const dayData = activeCurriculum.find((d) => d.dayNumber === selectedDay) || activeCurriculum[0];

  const getNoteStorageKey = React.useCallback(
    (day: number) => {
      return `rike_notes_${courseId}_day_${day}`;
    },
    [courseId]
  );

  useEffect(() => {
    setSelectedDay(currentDay);
  }, [currentDay]);

  useEffect(() => {
    try {
      const primaryKey = getNoteStorageKey(selectedDay);
      let saved = localStorage.getItem(primaryKey);
      
      // Fallback for cpp-heavy to legacy keys
      if (!saved && courseId === 'cpp-heavy') {
        saved = localStorage.getItem(`rike_notes_day_${selectedDay}`) || localStorage.getItem(`ad2_notes_day_${selectedDay}`);
      }
      setNoteContent(saved || '');
    } catch {
      setNoteContent('');
    }
  }, [selectedDay, courseId, getNoteStorageKey]);

  useEffect(() => {
    const list: number[] = [];
    for (let i = 1; i <= TOTAL_DAYS; i++) {
      const primaryKey = getNoteStorageKey(i);
      let saved = localStorage.getItem(primaryKey);
      if (!saved && courseId === 'cpp-heavy') {
        saved = localStorage.getItem(`rike_notes_day_${i}`) || localStorage.getItem(`ad2_notes_day_${i}`);
      }
      if (saved && saved.trim().length > 0) {
        list.push(i);
      }
    }
    setDaysWithNotes(list);
  }, [selectedDay, courseId, getNoteStorageKey]);

  const handleSave = () => {
    try {
      const primaryKey = getNoteStorageKey(selectedDay);
      localStorage.setItem(primaryKey, noteContent);

      if (courseId === 'cpp-heavy') {
        localStorage.setItem(`rike_notes_day_${selectedDay}`, noteContent);
      }

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
      const primaryKey = getNoteStorageKey(selectedDay);
      localStorage.removeItem(primaryKey);
      if (courseId === 'cpp-heavy') {
        localStorage.removeItem(`rike_notes_day_${selectedDay}`);
        localStorage.removeItem(`ad2_notes_day_${selectedDay}`);
      }
      setNoteContent('');
      setDaysWithNotes((prev) => prev.filter((d) => d !== selectedDay));
      setSaveStatus('Note cleared');
      setTimeout(() => setSaveStatus(''), 2500);
    }
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

        <div className="flex items-center space-x-3">
          {courseMeta && courses && onSelectCourse && (
            <CourseSwitcher
              currentCourseId={courseId}
              courses={courses}
              onSelectCourse={onSelectCourse}
            />
          )}
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white hidden sm:inline">
            DAILY JOURNAL &amp; NOTES
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-6 sm:p-8 md:p-10 shadow-sm space-y-7 text-[#091424] dark:text-[#F3F3F0] transition-colors">
        {/* Title and Day Summary */}
        <div className="space-y-1 pb-2 border-b border-[#E5E0D5] dark:border-[#383838]">
          <div className="flex items-center space-x-2">
            {courseMeta && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#091424] dark:bg-white text-white dark:text-[#091424] text-[10px] font-heading font-bold uppercase tracking-wider">
                {courseMeta.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#091424] dark:text-white">
              Day {String(selectedDay).padStart(3, '0')} Study Notes
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-body text-[#64748B] dark:text-[#9E9E96]">
            {dayData.title} &bull; {dayData.focus}
          </p>
        </div>

        {/* Day Selector Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-heading text-[#64748B] dark:text-[#9E9E96]">
            <span>Quick jump to day journal</span>
            <span>{daysWithNotes.length} days with notes</span>
          </div>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
            {activeCurriculum.map((d) => (
              <button
                key={d.dayNumber}
                onClick={() => {
                  setSelectedDay(d.dayNumber);
                  onSelectDay(d.dayNumber);
                }}
                className={`flex-shrink-0 w-8 h-8 rounded-full text-xs font-heading font-bold transition-all relative ${
                  selectedDay === d.dayNumber
                    ? 'bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] shadow-sm scale-105'
                    : daysWithNotes.includes(d.dayNumber)
                    ? 'bg-[#FAE392] text-[#091424] hover:bg-[#F5CA38]'
                    : 'bg-[#FCFBF8] dark:bg-[#1f1f1f] text-[#64748B] dark:text-[#9E9E96] border border-[#E5E0D5] dark:border-[#383838] hover:border-[#091424]'
                }`}
                title={`Day ${d.dayNumber}: ${d.title}`}
              >
                {d.dayNumber}
                {daysWithNotes.includes(d.dayNumber) && selectedDay !== d.dayNumber && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#091424] dark:bg-white ring-1 ring-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Note Editor Area */}
        <div className="space-y-3 pt-2">
          <div className="relative">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder={`Write your code snippets, key learnings, bug fixes, algorithm explanations, or interview notes for Day ${selectedDay}...`}
              rows={12}
              className="w-full p-4 sm:p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#1f1f1f] text-xs sm:text-sm font-mono text-[#091424] dark:text-[#F3F3F0] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FCD34D] transition-all shadow-inner resize-y leading-relaxed"
            />
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] hover:opacity-90 transition-all text-xs font-heading font-bold shadow-sm active:scale-95 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Save Notes</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={!noteContent.trim()}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] text-[#64748B] dark:text-[#9E9E96] hover:text-red-500 hover:border-red-300 transition-all text-xs font-heading font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                <span>Clear</span>
              </button>
            </div>

            {/* Save Status Banner */}
            {saveStatus && (
              <div className="flex items-center space-x-1.5 text-xs font-heading font-semibold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                <span>{saveStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

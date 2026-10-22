import React, { useState, useMemo } from 'react';
import { CURRICULUM as DEFAULT_CURRICULUM, PHASES } from '../data/curriculum';
import type { DayPlan } from '../types/curriculum';
import { Search, X, Check } from 'lucide-react';

interface DayPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: number;
  onSelectDay: (day: number) => void;
  isDayFullyCompleted: (dayNumber: number, totalTasks: number) => boolean;
  getDayCompletedCount: (dayNumber: number) => number;
  curriculum?: DayPlan[];
  courseName?: string;
}

export const DayPickerModal: React.FC<DayPickerModalProps> = ({
  isOpen,
  onClose,
  currentDay,
  onSelectDay,
  isDayFullyCompleted,
  getDayCompletedCount,
  curriculum = DEFAULT_CURRICULUM,
  courseName,
}) => {
  const activeCurriculum = curriculum && curriculum.length > 0 ? curriculum : DEFAULT_CURRICULUM;
  const [search, setSearch] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const filteredDays = useMemo(() => {
    return activeCurriculum.filter((day) => {
      const matchesSearch =
        day.dayNumber.toString().includes(search.trim()) ||
        day.title.toLowerCase().includes(search.toLowerCase()) ||
        day.focus.toLowerCase().includes(search.toLowerCase());
      
      const matchesPhase = selectedPhase === null || day.phase === selectedPhase;
      return matchesSearch && matchesPhase;
    });
  }, [activeCurriculum, search, selectedPhase]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[85vh] bg-[#0E1727]/95 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp text-app-main"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-white">
                Jump to Day
              </h2>
              {courseName && (
                <span className="px-2 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider bg-[#FCD34D] text-[#091424]">
                  {courseName}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-body text-white/60 mt-0.5">
              Select any of the 180 curriculum days or search by topic
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 sm:p-6 border-b border-white/10 space-y-3 bg-white/[0.02]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search day number or topic (e.g., Recursion, Arrays, Dynamic Programming)..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-body text-white placeholder:text-white/40 focus:outline-none focus:border-[#FCD34D] transition-colors"
              autoFocus
            />
          </div>

          {/* Phase Filter Buttons */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedPhase(null)}
              className={`px-3 py-1 rounded-full text-xs font-heading font-medium tracking-wide transition-colors ${
                selectedPhase === null
                  ? 'bg-[#FCD34D] text-[#0E1727] font-bold'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              All Days
            </button>
            {PHASES.map((phase) => (
              <button
                key={phase.phase}
                onClick={() => setSelectedPhase(phase.phase === selectedPhase ? null : phase.phase)}
                className={`px-3 py-1 rounded-full text-xs font-heading font-medium tracking-wide transition-colors ${
                  selectedPhase === phase.phase
                    ? 'bg-[#FCD34D] text-[#0E1727] font-bold'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                P{phase.phase}: {phase.name}
              </button>
            ))}
          </div>
        </div>

        {/* Day Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredDays.map((day) => {
              const isCurrent = day.dayNumber === currentDay;
              const isFullyDone = isDayFullyCompleted(day.dayNumber, day.tasks.length);
              const completedCount = getDayCompletedCount(day.dayNumber);

              return (
                <button
                  key={day.dayNumber}
                  onClick={() => {
                    onSelectDay(day.dayNumber);
                    onClose();
                  }}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all relative group ${
                    isCurrent
                      ? 'bg-[#FCD34D]/15 border-[#FCD34D] text-white shadow-lg shadow-[#FCD34D]/5'
                      : isFullyDone
                      ? 'bg-white/[0.04] border-emerald-500/30 text-white/90 hover:border-emerald-500/60'
                      : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.06] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-xs font-heading font-bold uppercase tracking-wider ${
                      isCurrent ? 'text-[#FCD34D]' : isFullyDone ? 'text-emerald-400' : 'text-white/50'
                    }`}>
                      Day {String(day.dayNumber).padStart(3, '0')}
                    </span>
                    <div className="flex items-center space-x-1">
                      {isFullyDone && (
                        <span className="flex items-center text-[10px] font-heading font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          <Check className="w-3 h-3 mr-0.5 stroke-[2.5]" /> Done
                        </span>
                      )}
                      {!isFullyDone && completedCount > 0 && (
                        <span className="text-[10px] font-heading text-white/40">
                          {completedCount}/{day.tasks.length}
                        </span>
                      )}
                      <span className="text-[10px] font-heading uppercase text-white/40 px-1.5 py-0.5 rounded bg-white/5">
                        P{day.phase}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-heading font-semibold text-white group-hover:text-white transition-colors line-clamp-1">
                    {day.title}
                  </h3>

                  <p className="text-[11px] font-body text-white/40 mt-1 line-clamp-1">
                    {day.focus}
                  </p>
                </button>
              );
            })}
          </div>

          {filteredDays.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <p className="text-sm font-body">No days match your search criteria</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-white/[0.01] flex items-center justify-between text-xs font-body text-white/50">
          <span>Showing {filteredDays.length} of 180 days</span>
          <span className="text-[11px] font-mono">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};

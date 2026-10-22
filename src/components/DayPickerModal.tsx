import React, { useState, useMemo } from 'react';
import { CURRICULUM, PHASES } from '../data/curriculum';
import { Search, X, Check } from 'lucide-react';

interface DayPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: number;
  onSelectDay: (day: number) => void;
  isDayFullyCompleted: (dayNumber: number, totalTasks: number) => boolean;
  getDayCompletedCount: (dayNumber: number) => number;
}

export const DayPickerModal: React.FC<DayPickerModalProps> = ({
  isOpen,
  onClose,
  currentDay,
  onSelectDay,
  isDayFullyCompleted,
  getDayCompletedCount,
}) => {
  const [search, setSearch] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const filteredDays = useMemo(() => {
    return CURRICULUM.filter((day) => {
      const matchesSearch =
        day.dayNumber.toString().includes(search.trim()) ||
        day.title.toLowerCase().includes(search.toLowerCase()) ||
        day.focus.toLowerCase().includes(search.toLowerCase());
      
      const matchesPhase = selectedPhase === null || day.phase === selectedPhase;
      return matchesSearch && matchesPhase;
    });
  }, [search, selectedPhase]);

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
            <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-app-main">
              Jump to Day
            </h2>
            <p className="text-xs sm:text-sm font-body text-app-dim mt-0.5">
              Select any of the 180 curriculum days or search by topic
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-app-sub hover:text-app-main hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 space-y-3 bg-black/20">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-app-dim" />
            <input
              type="text"
              placeholder="Search day number, topic (e.g. 27, Binary Search, DP, SQL)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-body text-app-main placeholder:text-app-dim focus:outline-none focus:border-app-accent/60 transition-colors"
              autoFocus
            />
          </div>

          {/* Phase pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-heading">
            <button
              onClick={() => setSelectedPhase(null)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
                selectedPhase === null
                  ? 'bg-app-accent text-app-accent-text font-bold border-app-accent'
                  : 'bg-white/5 text-app-sub border-white/10 hover:text-app-main'
              }`}
            >
              All Phases
            </button>
            {PHASES.map((p) => (
              <button
                key={p.phase}
                onClick={() => setSelectedPhase(p.phase)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
                  selectedPhase === p.phase
                    ? 'bg-app-accent text-app-accent-text font-bold border-app-accent'
                    : 'bg-white/5 text-app-sub border-white/10 hover:text-app-main'
                }`}
              >
                P{p.phase}: {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Days Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredDays.length === 0 ? (
            <div className="text-center py-12 text-app-dim text-sm font-body">
              No days match your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {filteredDays.map((day) => {
                const isCurrent = day.dayNumber === currentDay;
                const completed = isDayFullyCompleted(day.dayNumber, day.tasks.length);
                const compCount = getDayCompletedCount(day.dayNumber);

                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => {
                      onSelectDay(day.dayNumber);
                      onClose();
                    }}
                    className={`group relative text-left p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-app-accent text-app-accent-text border-app-accent shadow-lg font-bold'
                        : completed
                        ? 'bg-white/5 border-white/10 opacity-80 hover:opacity-100'
                        : 'bg-white/[0.03] border-white/5 hover:border-white/15 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs font-heading font-semibold ${
                          isCurrent ? 'text-app-accent-text opacity-90' : 'text-app-dim'
                        }`}
                      >
                        DAY {String(day.dayNumber).padStart(3, '0')}
                      </span>
                      {completed && !isCurrent && (
                        <span className="w-4 h-4 rounded-full bg-app-accent/20 flex items-center justify-center text-app-accent">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-heading px-1.5 py-0.5 rounded bg-black/80 text-app-accent font-bold">
                          Active
                        </span>
                      )}
                    </div>

                    <div
                      className={`text-xs font-body font-medium line-clamp-1 mb-1 ${
                        isCurrent ? 'text-app-accent-text font-bold' : 'text-app-main'
                      }`}
                    >
                      {day.title}
                    </div>

                    <div
                      className={`text-[10px] font-heading flex items-center justify-between ${
                        isCurrent ? 'text-app-accent-text opacity-80' : 'text-app-dim'
                      }`}
                    >
                      <span className="truncate max-w-[90px] font-body">{day.focus}</span>
                      <span className="font-heading">
                        {compCount}/{day.tasks.length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/20 flex items-center justify-between text-xs font-body text-app-dim">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-heading text-[10px] text-app-sub">ESC</kbd> to close</span>
          <span className="font-heading">Showing {filteredDays.length} of 180 days</span>
        </div>
      </div>
    </div>
  );
};

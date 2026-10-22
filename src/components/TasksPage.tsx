import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Check, ChevronRight } from 'lucide-react';
import { CURRICULUM, PHASES } from '../data/curriculum';

interface TasksPageProps {
  onBack: () => void;
  onSelectDay: (day: number) => void;
  isTaskCompleted: (day: number, taskId: string) => boolean;
  toggleTask: (day: number, taskId: string) => void;
  getDayCompletedCount: (day: number) => number;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  onBack,
  onSelectDay,
  isTaskCompleted,
  toggleTask,
  getDayCompletedCount,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Filtered days
  const filteredDays = useMemo(() => {
    return CURRICULUM.filter((day) => {
      const matchPhase = selectedPhase === 'all' || day.phase === selectedPhase;
      if (!matchPhase) return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const inTitle = day.title.toLowerCase().includes(query);
      const inFocus = day.focus.toLowerCase().includes(query);
      const inTasks = day.tasks.some((t) => t.title.toLowerCase().includes(query) || t.category.toLowerCase().includes(query));
      return inTitle || inFocus || inTasks;
    });
  }, [selectedPhase, searchQuery]);

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
          TASKS &amp; CURRICULUM
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-6 sm:p-8 md:p-10 shadow-sm space-y-7 text-[#091424] dark:text-[#F3F3F0] transition-colors">
        {/* Title and Search */}
        <div className="space-y-4 pb-2 border-b border-[#E5E0D5] dark:border-[#383838]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#091424] dark:text-white">
              180-Day Curriculum Explorer
            </h1>
            <p className="text-xs sm:text-sm font-body text-[#64748B] dark:text-[#9E9E96] pt-0.5">
              Comprehensive placement roadmap from fundamentals to high-frequency assessment readiness.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, algorithms, data structures (e.g., C++, Binary Search, Dynamic Programming, Graphs)..."
              className="w-full bg-[#FCFBF8] dark:bg-[#1f1f1f] border border-[#E5E0D5] dark:border-[#383838] rounded-full pl-11 pr-4 py-3 text-xs sm:text-sm font-body text-[#091424] dark:text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FCD34D] transition-all shadow-sm"
            />
          </div>

          {/* Phase Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                selectedPhase === 'all'
                  ? 'bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] shadow-sm'
                  : 'bg-[#FCFBF8] dark:bg-[#222222] text-[#091424] dark:text-white border border-[#E5E0D5] dark:border-[#383838] hover:border-[#091424]'
              }`}
            >
              All Phases
            </button>
            {PHASES.map((p) => (
              <button
                key={p.phase}
                onClick={() => setSelectedPhase(p.phase)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                  selectedPhase === p.phase
                    ? 'bg-[#FCD34D] text-[#091424] shadow-sm'
                    : 'bg-[#FCFBF8] dark:bg-[#222222] text-[#091424] dark:text-white border border-[#E5E0D5] dark:border-[#383838] hover:border-[#091424]'
                }`}
              >
                P{p.phase}: {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Days List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-heading font-medium text-[#64748B] dark:text-[#9E9E96] pb-1">
            <span>Showing {filteredDays.length} days</span>
            <span>Click day to view or open tasks</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredDays.map((day) => {
              const completedCount = getDayCompletedCount(day.dayNumber);
              const totalTasks = day.tasks.length;
              const isExpanded = expandedDay === day.dayNumber;
              const isAllDone = completedCount === totalTasks && totalTasks > 0;

              return (
                <div
                  key={day.dayNumber}
                  className="rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] hover:border-[#D5CEBF] dark:hover:border-[#555555] transition-all overflow-hidden shadow-sm"
                >
                  {/* Day Row Header */}
                  <div
                    onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0 flex-1 pr-3">
                      <div className="w-8 h-8 rounded-full bg-[#FAF8F5] dark:bg-[#1f1f1f] border border-[#E5E0D5] dark:border-[#383838] flex items-center justify-center font-heading font-bold text-xs text-[#091424] dark:text-white flex-shrink-0">
                        {String(day.dayNumber).padStart(2, '0')}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAE392] text-[#091424]">
                            Phase {day.phase}
                          </span>
                          <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white truncate">
                            {day.title}
                          </h3>
                        </div>
                        <p className="text-xs font-body text-[#64748B] dark:text-[#9E9E96] truncate pt-0.5">
                          {day.focus}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className={`text-xs font-heading font-bold px-2.5 py-1 rounded-full border ${
                        isAllDone
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-white dark:bg-[#1f1f1f] text-[#64748B] dark:text-[#9E9E96] border-[#E5E0D5] dark:border-[#383838]'
                      }`}>
                        {completedCount} / {totalTasks}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDay(day.dayNumber);
                        }}
                        className="px-3 py-1 rounded-full bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] hover:opacity-90 text-[11px] font-heading font-bold transition-all"
                      >
                        Open Day
                      </button>

                      <ChevronRight className={`w-4 h-4 text-[#94A3B8] transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Task List with Live Checkboxes */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-white dark:bg-[#1d1d1d] border-t border-[#E5E0D5] dark:border-[#383838] space-y-2 animate-fadeIn">
                      <div className="text-xs font-heading font-bold text-[#64748B] dark:text-[#9E9E96] uppercase tracking-wider pb-1">
                        Day {day.dayNumber} Tasks:
                      </div>
                      {day.tasks.map((task) => {
                        const done = isTaskCompleted(day.dayNumber, task.id);
                        return (
                          <div
                            key={task.id}
                            onClick={() => toggleTask(day.dayNumber, task.id)}
                            className="flex items-center justify-between p-3 rounded-xl border border-[#E5E0D5] dark:border-[#333333] bg-[#FAF8F5] dark:bg-[#222222] hover:bg-white dark:hover:bg-[#2a2a2a] cursor-pointer select-none transition-all"
                          >
                            <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
                              <button
                                type="button"
                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                  done
                                    ? 'bg-[#091424] dark:bg-[#FCD34D] border-[#091424] dark:border-[#FCD34D] text-white dark:text-[#091424]'
                                    : 'border-[#94A3B8] dark:border-[#666666] bg-white dark:bg-[#1f1f1f]'
                                }`}
                              >
                                {done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </button>
                              <span className={`text-xs font-body ${done ? 'line-through text-[#94A3B8] dark:text-[#777777]' : 'text-[#091424] dark:text-[#F3F3F0] font-medium'}`}>
                                {task.title}
                              </span>
                            </div>
                            <span className="text-[10px] font-heading font-medium text-[#64748B] dark:text-[#A0A0A0] px-2 py-0.5 rounded-full border border-[#CBD5E1] dark:border-[#444444] bg-white dark:bg-[#1f1f1f]">
                              {task.category}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

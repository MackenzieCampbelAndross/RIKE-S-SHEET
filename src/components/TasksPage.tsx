import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Check, ChevronRight } from 'lucide-react';
import { CURRICULUM as DEFAULT_CURRICULUM, PHASES } from '../data/curriculum';
import type { DayPlan, CourseMetadata, CourseStats, CourseId } from '../types/curriculum';
import { CourseSwitcher } from './CourseSwitcher';

interface TasksPageProps {
  onBack: () => void;
  onSelectDay: (day: number) => void;
  isTaskCompleted: (day: number, taskId: string) => boolean;
  toggleTask: (day: number, taskId: string) => void;
  getDayCompletedCount: (day: number) => number;
  curriculum?: DayPlan[];
  courseMeta?: CourseMetadata;
  courses?: CourseStats[];
  onSelectCourse?: (courseId: CourseId) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  onBack,
  onSelectDay,
  isTaskCompleted,
  toggleTask,
  getDayCompletedCount,
  curriculum = DEFAULT_CURRICULUM,
  courseMeta,
  courses,
  onSelectCourse,
}) => {
  const activeCurriculum = curriculum && curriculum.length > 0 ? curriculum : DEFAULT_CURRICULUM;
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Filtered days
  const filteredDays = useMemo(() => {
    return activeCurriculum.filter((day) => {
      const matchPhase = selectedPhase === 'all' || day.phase === selectedPhase;
      if (!matchPhase) return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const inTitle = day.title.toLowerCase().includes(query);
      const inFocus = day.focus.toLowerCase().includes(query);
      const inTasks = day.tasks.some(
        (t) => t.title.toLowerCase().includes(query) || t.category.toLowerCase().includes(query)
      );
      return inTitle || inFocus || inTasks;
    });
  }, [activeCurriculum, selectedPhase, searchQuery]);

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
              currentCourseId={courseMeta.id}
              courses={courses}
              onSelectCourse={onSelectCourse}
            />
          )}
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white hidden sm:inline">
            TASKS &amp; CURRICULUM
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-6 sm:p-8 md:p-10 shadow-sm space-y-7 text-[#091424] dark:text-[#F3F3F0] transition-colors">
        {/* Title and Search */}
        <div className="space-y-4 pb-2 border-b border-[#E5E0D5] dark:border-[#383838]">
          <div>
            <div className="flex items-center space-x-2">
              {courseMeta && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#091424] dark:bg-white text-white dark:text-[#091424] text-[10px] font-heading font-bold uppercase tracking-wider">
                  {courseMeta.name}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#091424] dark:text-white">
                180-Day Curriculum Explorer
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-body text-[#64748B] dark:text-[#9E9E96] pt-0.5">
              Comprehensive placement roadmap from fundamentals to high-frequency assessment readiness in {courseMeta?.name || 'your track'}.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, algorithms, tasks (e.g., Recursion, Binary Search, Dynamic Programming, Graphs)..."
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

        {/* Days List Accordion */}
        <div className="space-y-3">
          {filteredDays.length === 0 ? (
            <div className="text-center py-12 text-[#64748B] dark:text-[#9E9E96]">
              <p className="text-sm font-body">No curriculum days match your search criteria.</p>
            </div>
          ) : (
            filteredDays.map((day) => {
              const isExpanded = expandedDay === day.dayNumber;
              const completedCount = getDayCompletedCount(day.dayNumber);
              const totalCount = day.tasks.length;
              const isAllDone = totalCount > 0 && completedCount >= totalCount;

              return (
                <div
                  key={day.dayNumber}
                  className="rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] overflow-hidden transition-all duration-150"
                >
                  {/* Day Row Header */}
                  <div
                    onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/50 dark:hover:bg-[#262626] transition-colors"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1 pr-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-heading font-bold ${
                          isAllDone
                            ? 'bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424]'
                            : 'bg-[#E5E0D5]/70 dark:bg-[#333333] text-[#091424] dark:text-white'
                        }`}
                      >
                        {isAllDone ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          String(day.dayNumber).padStart(2, '0')
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                            Day {day.dayNumber} &bull; P{day.phase}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-heading font-bold text-[#091424] dark:text-white truncate">
                          {day.title}
                        </h3>
                        <p className="text-xs font-body text-[#64748B] dark:text-[#9E9E96] truncate">
                          {day.focus}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="text-xs font-heading font-medium text-[#64748B] dark:text-[#9E9E96]">
                        {completedCount}/{totalCount}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDay(day.dayNumber);
                        }}
                        className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-[#091424] dark:bg-white text-white dark:text-[#091424] hover:opacity-85 transition-opacity"
                        title="Jump to Workspace for this day"
                      >
                        Open
                      </button>
                      <ChevronRight
                        className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Tasks Checklist when expanded */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-[#EFECE4] dark:border-[#333333] space-y-2 bg-[#FAF8F5] dark:bg-[#1f1f1f]/60 animate-fadeIn">
                      <div className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96] py-1">
                        Daily Action Checklist
                      </div>
                      <div className="space-y-1.5">
                        {day.tasks.map((task) => {
                          const done = isTaskCompleted(day.dayNumber, task.id);
                          return (
                            <div
                              key={task.id}
                              onClick={() => toggleTask(day.dayNumber, task.id)}
                              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                                done
                                  ? 'bg-white/60 dark:bg-[#252525]/60 border-transparent opacity-75'
                                  : 'bg-white dark:bg-[#252525] border-[#E5E0D5] dark:border-[#333333] hover:border-[#091424]'
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-1 pr-2">
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                    done
                                      ? 'bg-[#091424] dark:bg-[#FCD34D] border-[#091424] dark:border-[#FCD34D] text-white dark:text-[#091424]'
                                      : 'border-[#94A3B8]'
                                  }`}
                                >
                                  {done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </div>
                                <span
                                  className={`text-xs font-body ${
                                    done
                                      ? 'text-[#94A3B8] dark:text-[#777777] line-through'
                                      : 'text-[#091424] dark:text-[#F3F3F0]'
                                  }`}
                                >
                                  {task.title}
                                </span>
                              </div>
                              <span className="text-[10px] font-heading px-2 py-0.5 rounded border border-[#CBD5E1] dark:border-[#444444] text-[#64748B] dark:text-[#A0A0A0]">
                                {task.category}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

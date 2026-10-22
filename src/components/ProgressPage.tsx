import React from 'react';
import { ArrowLeft, Trophy, CheckCircle2, Award, Zap, Target } from 'lucide-react';
import { CURRICULUM as DEFAULT_CURRICULUM, PHASES } from '../data/curriculum';
import type { DayPlan, CourseMetadata, CourseStats, CourseId } from '../types/curriculum';
import { CourseSwitcher } from './CourseSwitcher';

interface ProgressPageProps {
  onBack: () => void;
  getDayCompletedCount: (day: number) => number;
  isDayFullyCompleted: (day: number, totalDayTasks: number) => boolean;
  totalCompletedTasksCount: number;
  currentStreak: number;
  curriculum?: DayPlan[];
  courseMeta?: CourseMetadata;
  courses?: CourseStats[];
  onSelectCourse?: (courseId: CourseId) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  onBack,
  getDayCompletedCount,
  isDayFullyCompleted,
  totalCompletedTasksCount,
  currentStreak,
  curriculum = DEFAULT_CURRICULUM,
  courseMeta,
  courses,
  onSelectCourse,
}) => {
  const activeCurriculum = curriculum && curriculum.length > 0 ? curriculum : DEFAULT_CURRICULUM;
  const totalTasksOverall = activeCurriculum.reduce((acc, d) => acc + d.tasks.length, 0);
  const overallPercentage = Math.round((totalCompletedTasksCount / Math.max(1, totalTasksOverall)) * 100);

  const daysCompletedCount = activeCurriculum.filter((d) => isDayFullyCompleted(d.dayNumber, d.tasks.length)).length;

  const phaseStats = PHASES.map((p) => {
    const daysInPhase = activeCurriculum.filter((d) => d.phase === p.phase);
    const tasksInPhase = daysInPhase.reduce((acc, d) => acc + d.tasks.length, 0);
    const completedInPhase = daysInPhase.reduce((acc, d) => acc + getDayCompletedCount(d.dayNumber), 0);
    const pct = Math.round((completedInPhase / Math.max(1, tasksInPhase)) * 100);
    return {
      ...p,
      daysCount: daysInPhase.length,
      tasksInPhase,
      completedInPhase,
      pct,
    };
  });

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
            PROGRESS &amp; METRICS
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-6 sm:p-8 md:p-10 shadow-sm space-y-8 text-[#091424] dark:text-[#F3F3F0] transition-colors">
        {/* Title and High-level Summary */}
        <div className="space-y-1 pb-2 border-b border-[#E5E0D5] dark:border-[#383838]">
          <div className="flex items-center space-x-2">
            {courseMeta && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#091424] dark:bg-white text-white dark:text-[#091424] text-[10px] font-heading font-bold uppercase tracking-wider">
                {courseMeta.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#091424] dark:text-white">
              Curriculum Mastery &amp; Readiness
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-body text-[#64748B] dark:text-[#9E9E96]">
            Real-time assessment tracking across all 180 days of {courseMeta?.name || 'the curriculum'}.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] flex items-center space-x-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#FDE68A] flex items-center justify-center flex-shrink-0 text-[#091424]">
              <Target className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                Overall Completion
              </span>
              <div className="text-2xl font-heading font-black text-[#091424] dark:text-white">
                {overallPercentage}%
              </div>
              <p className="text-[11px] font-body text-[#64748B] dark:text-[#9E9E96]">
                {totalCompletedTasksCount} of {totalTasksOverall} tasks done
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] flex items-center space-x-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#FDE68A] flex items-center justify-center flex-shrink-0 text-[#091424]">
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                Full Days Cleared
              </span>
              <div className="text-2xl font-heading font-black text-[#091424] dark:text-white">
                {daysCompletedCount} / 180
              </div>
              <p className="text-[11px] font-body text-[#64748B] dark:text-[#9E9E96]">
                100% daily checklist completions
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] flex items-center space-x-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#FDE68A] flex items-center justify-center flex-shrink-0 text-[#091424]">
              <Zap className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                Active Streak
              </span>
              <div className="text-2xl font-heading font-black text-[#091424] dark:text-white">
                {currentStreak} Days
              </div>
              <p className="text-[11px] font-body text-[#64748B] dark:text-[#9E9E96]">
                Consistent consecutive sessions
              </p>
            </div>
          </div>
        </div>

        {/* Phase Breakdown Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
            Phase-by-Phase Breakdown
          </h2>

          <div className="space-y-3">
            {phaseStats.map((phase) => (
              <div
                key={phase.phase}
                className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-3 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FAE392] text-[#091424] text-[10px] font-heading font-bold uppercase tracking-wider">
                        Phase {phase.phase}
                      </span>
                      <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">
                        {phase.name}
                      </h3>
                    </div>
                    <p className="text-xs font-body text-[#64748B] dark:text-[#9E9E96] pt-0.5">
                      Days {phase.start} &ndash; {phase.end} &bull; {phase.desc}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-sm font-heading font-black text-[#091424] dark:text-white">
                      {phase.pct}%
                    </span>
                    <span className="text-xs font-body text-[#64748B] dark:text-[#9E9E96] ml-1.5">
                      ({phase.completedInPhase} / {phase.tasksInPhase} tasks)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#E5E0D5] dark:bg-[#383838] overflow-hidden">
                  <div
                    className="h-full bg-[#091424] dark:bg-[#FCD34D] rounded-full transition-all duration-300"
                    style={{ width: `${phase.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones & Badges */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
            Milestones &amp; Placement Badges
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-4 rounded-2xl border text-center space-y-2 ${
              totalCompletedTasksCount >= 1 ? 'border-[#091424] dark:border-[#FCD34D] bg-white dark:bg-[#222222] shadow-sm' : 'border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#1f1f1f] opacity-50'
            }`}>
              <div className="w-8 h-8 mx-auto rounded-full bg-[#FDE68A] flex items-center justify-center text-[#091424]">
                <Award className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h4 className="text-xs font-heading font-bold text-[#091424] dark:text-white">First Step</h4>
              <p className="text-[10px] text-[#64748B] dark:text-[#9E9E96]">First task completed</p>
            </div>

            <div className={`p-4 rounded-2xl border text-center space-y-2 ${
              daysCompletedCount >= 1 ? 'border-[#091424] dark:border-[#FCD34D] bg-white dark:bg-[#222222] shadow-sm' : 'border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#1f1f1f] opacity-50'
            }`}>
              <div className="w-8 h-8 mx-auto rounded-full bg-[#FDE68A] flex items-center justify-center text-[#091424]">
                <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h4 className="text-xs font-heading font-bold text-[#091424] dark:text-white">Day 1 Master</h4>
              <p className="text-[10px] text-[#64748B] dark:text-[#9E9E96]">All day tasks cleared</p>
            </div>

            <div className={`p-4 rounded-2xl border text-center space-y-2 ${
              currentStreak >= 7 ? 'border-[#091424] dark:border-[#FCD34D] bg-white dark:bg-[#222222] shadow-sm' : 'border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#1f1f1f] opacity-50'
            }`}>
              <div className="w-8 h-8 mx-auto rounded-full bg-[#FDE68A] flex items-center justify-center text-[#091424]">
                <Zap className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h4 className="text-xs font-heading font-bold text-[#091424] dark:text-white">7-Day Flame</h4>
              <p className="text-[10px] text-[#64748B] dark:text-[#9E9E96]">7 days consistency</p>
            </div>

            <div className={`p-4 rounded-2xl border text-center space-y-2 ${
              daysCompletedCount >= 30 ? 'border-[#091424] dark:border-[#FCD34D] bg-white dark:bg-[#222222] shadow-sm' : 'border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#1f1f1f] opacity-50'
            }`}>
              <div className="w-8 h-8 mx-auto rounded-full bg-[#FDE68A] flex items-center justify-center text-[#091424]">
                <Trophy className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h4 className="text-xs font-heading font-bold text-[#091424] dark:text-white">Foundation Club</h4>
              <p className="text-[10px] text-[#64748B] dark:text-[#9E9E96]">Phase 1 completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

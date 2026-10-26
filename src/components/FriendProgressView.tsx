import React, { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Flame,
  Trophy,
  CalendarCheck,
  Target,
  CheckCircle2,
  Zap,
  Loader2,
  AlertCircle,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { AvatarIcon } from './AvatarIcon';
import { AttendanceHeatmap } from './AttendanceHeatmap';
import { COURSES, CURRICULA, PHASES } from '../data/curriculum';
import type { CourseId } from '../types/curriculum';
import type { FriendProgressData } from '../lib/supabase';

interface FriendProgressViewProps {
  friendId: string;
  friendUsername?: string;
  onBack: () => void;
  fetchFriendProgress: (friendId: string) => Promise<FriendProgressData>;
}

export const FriendProgressView: React.FC<FriendProgressViewProps> = ({
  friendId,
  friendUsername,
  onBack,
  fetchFriendProgress,
}) => {
  const [data, setData] = useState<FriendProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>('cpp-heavy');

  const loadProgress = useCallback(async () => {
    if (!friendId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetchFriendProgress(friendId);
      setData(res);
    } catch (err: any) {
      console.error('Failed to load friend progress:', err);
      const rawMsg = err?.message || '';
      if (
        /aggregate/i.test(rawMsg) ||
        /SQL/i.test(rawMsg) ||
        /relation/i.test(rawMsg) ||
        /PL\/pgSQL/i.test(rawMsg) ||
        /PostgREST/i.test(rawMsg) ||
        /function/i.test(rawMsg)
      ) {
        setError('Unable to load verified progress at this time. Please try again.');
      } else {
        setError(rawMsg || 'Unable to load verified progress.');
      }
    } finally {
      setLoading(false);
    }
  }, [friendId, fetchFriendProgress]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const courseIds: CourseId[] = ['cpp-heavy', 'java-heavy', 'python'];

  if (loading) {
    return (
      <div className="w-full max-w-5xl space-y-6 animate-fadeIn pb-12 font-sans text-[#091424] dark:text-[#F3F3F0]">
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs sm:text-sm font-heading font-semibold text-[#091424] dark:text-white hover:opacity-75 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
            <span>Return to Connections</span>
          </button>
        </div>

        <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-16 shadow-sm flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#112E52] dark:text-[#F4D875]" />
          <span className="text-xs sm:text-sm font-heading font-medium text-[#64748B] dark:text-[#9E9E96]">
            Loading verified preparation metrics {friendUsername ? `for @${friendUsername}` : ''}...
          </span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-5xl space-y-6 animate-fadeIn pb-12 font-sans text-[#091424] dark:text-[#F3F3F0]">
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs sm:text-sm font-heading font-semibold text-[#091424] dark:text-white hover:opacity-75 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
            <span>Return to Connections</span>
          </button>
        </div>

        <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-12 text-center space-y-4 shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-heading font-bold text-[#091424] dark:text-white">
              Progress Unavailable
            </h3>
            <p className="text-xs font-body text-[#64748B] dark:text-[#9E9E96] leading-relaxed">
              {error || 'Unable to retrieve data for this connection.'}
            </p>
          </div>
          <div className="flex items-center justify-center space-x-3 pt-3">
            <button
              type="button"
              onClick={loadProgress}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#091424] hover:bg-[#112E52] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#091424] text-xs font-heading font-bold transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl border border-[#E7E2D6] dark:border-[#383838] text-xs font-heading font-semibold text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white transition-colors cursor-pointer"
            >
              Back to Connections
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active course metrics
  const activeMeta = COURSES[selectedCourseId];
  const activeCurriculum = CURRICULA[selectedCourseId];
  const activeCourseStats = data.courses?.[selectedCourseId] || { current_day: 1, completed_count: 0 };
  const totalTasksInActiveCourse = activeCurriculum.reduce((acc, d) => acc + d.tasks.length, 0);
  const activePercentage =
    totalTasksInActiveCourse > 0
      ? Math.round((activeCourseStats.completed_count / totalTasksInActiveCourse) * 100)
      : 0;

  // Active phase breakdown based on current_day
  const currentDayNumber = activeCourseStats.current_day || 1;

  // Total completed tasks across all courses
  const totalAllTasksDone = courseIds.reduce(
    (acc, cid) => acc + (data.courses?.[cid]?.completed_count || 0),
    0
  );

  return (
    <div className="w-full max-w-5xl space-y-4 animate-fadeIn pb-12 font-sans text-[#091424] dark:text-[#F3F3F0]">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs sm:text-sm font-heading font-semibold text-[#091424] dark:text-white hover:opacity-75 transition-opacity cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Return to Connections</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-heading font-bold uppercase tracking-widest text-[#64748B] dark:text-[#9E9E96]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B] dark:text-[#F4D875]" />
          <span>VERIFIED CONNECTION PROGRESS</span>
        </div>
      </div>

      {/* Main Canvas Card */}
      <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-6 sm:p-8 md:p-10 shadow-sm space-y-8 transition-colors">
        {/* Peer Hero Profile Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-[#E5E0D5] dark:border-[#383838]">
          <div className="flex items-center space-x-4 sm:space-x-5 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#091424] dark:bg-[#141414] text-white flex items-center justify-center p-3.5 sm:p-4 flex-shrink-0 shadow-md border-2 border-[#E7E2D6] dark:border-[#3a3a3a]">
              <AvatarIcon id={data.profile.avatar_id} className="w-full h-full text-white" />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#091424] dark:text-white tracking-tight truncate">
                  {data.profile.display_name}
                </h1>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-heading font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Peer</span>
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-heading text-[#64748B] dark:text-[#9E9E96]">
                <span className="font-semibold text-[#091424] dark:text-white">
                  @{data.profile.username}
                </span>
                <span>&bull;</span>
                <span>{totalAllTasksDone} Total Tasks Cleared</span>
              </div>
            </div>
          </div>

          {/* ELO Rating Badge */}
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <div className="px-5 py-3 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-[#E7E2D6] dark:border-[#383838] shadow-sm flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FDE68A] dark:bg-[#F4D875]/20 flex items-center justify-center text-[#091424] dark:text-[#F4D875]">
                <Trophy className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#64748B] dark:text-[#9E9E96] block">
                  ELO RATING
                </span>
                <span className="text-2xl font-heading font-black text-[#091424] dark:text-[#F4D875]">
                  {data.profile.elo_rating.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum Multi-Track Selector Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CURRICULUM TRACKS &bull; SELECT TO INSPECT</span>
            </span>
            <span className="text-xs font-body text-[#64748B] dark:text-[#9E9E96]">
              Showing: <strong className="text-[#091424] dark:text-white">{activeMeta.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {courseIds.map((cid) => {
              const meta = COURSES[cid];
              const totalTasks = CURRICULA[cid].reduce((acc, d) => acc + d.tasks.length, 0);
              const courseData = data.courses?.[cid] || { current_day: 1, completed_count: 0 };
              const completed = courseData.completed_count;
              const currentDay = courseData.current_day;
              const percentage = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
              const isSelected = selectedCourseId === cid;

              return (
                <button
                  key={cid}
                  type="button"
                  onClick={() => setSelectedCourseId(cid)}
                  className={`text-left p-4 sm:p-5 rounded-2xl transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#202020] border-[#F59E0B] dark:border-[#F4D875] ring-2 ring-[#F4D875]/30 shadow-md'
                      : 'bg-white/70 dark:bg-[#222222]/80 border-[#E7E2D6] dark:border-[#383838] hover:border-[#CBD5E1] dark:hover:border-[#4f4f4f] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-heading font-bold text-[#091424] dark:text-white">
                      {meta.name}
                    </span>
                    <span
                      className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-full border ${
                        isSelected
                          ? 'bg-[#FDE68A] dark:bg-[#F4D875] text-[#091424] border-transparent'
                          : 'bg-[#FAF8F5] dark:bg-[#1f1f1f] text-[#64748B] dark:text-[#9E9E96] border-[#E7E2D6] dark:border-[#383838]'
                      }`}
                    >
                      DAY {currentDay} / 180
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-heading">
                      <span className="text-[#64748B] dark:text-[#9E9E96]">
                        {completed} of {totalTasks} tasks
                      </span>
                      <span className="font-bold text-[#091424] dark:text-white">
                        {percentage}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#EAE7DF] dark:bg-[#181818] overflow-hidden">
                      <div
                        className="h-full bg-[#F59E0B] dark:bg-[#F4D875] rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Track Deep Metrics (Matching ProgressPage layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] flex items-center space-x-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#FDE68A] flex items-center justify-center flex-shrink-0 text-[#091424]">
              <Target className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                Track Completion
              </span>
              <div className="text-2xl font-heading font-black text-[#091424] dark:text-white">
                {activePercentage}%
              </div>
              <p className="text-[11px] font-body text-[#64748B] dark:text-[#9E9E96]">
                {activeCourseStats.completed_count} of {totalTasksInActiveCourse} tasks cleared
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] flex items-center space-x-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#FDE68A] flex items-center justify-center flex-shrink-0 text-[#091424]">
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                Current Position
              </span>
              <div className="text-2xl font-heading font-black text-[#091424] dark:text-white">
                Day {currentDayNumber} / 180
              </div>
              <p className="text-[11px] font-body text-[#64748B] dark:text-[#9E9E96]">
                Sequential curriculum pacing
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
                {data.streaks.current_streak} {data.streaks.current_streak === 1 ? 'Day' : 'Days'}
              </div>
              <p className="text-[11px] font-body text-[#64748B] dark:text-[#9E9E96]">
                Consecutive daily attendance
              </p>
            </div>
          </div>
        </div>

        {/* Phase Breakdown for Active Track */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
              PHASE BREAKDOWN &bull; {activeMeta.name}
            </h3>
            <span className="text-xs font-body text-[#64748B] dark:text-[#9E9E96]">
              6 Core Placement Stages
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PHASES.map((p) => {
              const isPastPhase = currentDayNumber > p.end;
              const isCurrentPhase = currentDayNumber >= p.start && currentDayNumber <= p.end;

              return (
                <div
                  key={p.phase}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrentPhase
                      ? 'bg-white dark:bg-[#202020] border-[#F59E0B] dark:border-[#F4D875] ring-1 ring-[#F4D875]/40 shadow-sm'
                      : isPastPhase
                      ? 'bg-[#FAF8F5] dark:bg-[#222222] border-[#E7E2D6] dark:border-[#383838]'
                      : 'bg-white/40 dark:bg-[#202020]/40 border-[#EAE7DF] dark:border-[#333333] opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                      PHASE {p.phase} &bull; DAYS {p.start}-{p.end}
                    </span>
                    <span
                      className={`text-[9px] font-heading font-bold px-2 py-0.5 rounded-full ${
                        isCurrentPhase
                          ? 'bg-[#FDE68A] text-[#091424]'
                          : isPastPhase
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'bg-slate-200/50 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCurrentPhase ? 'CURRENT' : isPastPhase ? 'PASSED' : 'UPCOMING'}
                    </span>
                  </div>

                  <h4 className="text-xs font-heading font-bold text-[#091424] dark:text-white mb-1">
                    {p.name}
                  </h4>
                  <p className="text-[11px] font-body text-[#64748B] dark:text-[#9E9E96] line-clamp-2">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak & Activity Cards */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
            STREAK &amp; ACTIVITY SUMMARY
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#222222] border border-[#E7E2D6] dark:border-[#383838] flex items-center space-x-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FDE68A] dark:bg-[#F4D875]/20 flex items-center justify-center text-[#091424] dark:text-[#F4D875]">
                <Flame className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                  CURRENT STREAK
                </span>
                <div className="text-lg font-heading font-black text-[#091424] dark:text-white">
                  {data.streaks.current_streak} {data.streaks.current_streak === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#222222] border border-[#E7E2D6] dark:border-[#383838] flex items-center space-x-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FDE68A] dark:bg-[#F4D875]/20 flex items-center justify-center text-[#091424] dark:text-[#F4D875]">
                <Trophy className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                  LONGEST STREAK
                </span>
                <div className="text-lg font-heading font-black text-[#091424] dark:text-white">
                  {data.streaks.longest_streak} {data.streaks.longest_streak === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#222222] border border-[#E7E2D6] dark:border-[#383838] flex items-center space-x-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FDE68A] dark:bg-[#F4D875]/20 flex items-center justify-center text-[#091424] dark:text-[#F4D875]">
                <CalendarCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                  TOTAL DAYS LOGGED
                </span>
                <div className="text-lg font-heading font-black text-[#091424] dark:text-white">
                  {data.attendance.length} {data.attendance.length === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Attendance Heatmap Section */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#222222] border border-[#E7E2D6] dark:border-[#383838] shadow-sm">
          <AttendanceHeatmap attendedDates={data.attendance} />
        </div>
      </div>
    </div>
  );
};

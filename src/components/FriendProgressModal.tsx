import React, { useEffect, useState } from 'react';
import { X, Flame, Trophy, CalendarCheck, Loader2, ShieldCheck } from 'lucide-react';
import { AvatarIcon } from './AvatarIcon';
import { AttendanceHeatmap } from './AttendanceHeatmap';
import { COURSES, CURRICULA } from '../data/curriculum';
import type { CourseId } from '../types/curriculum';
import type { FriendProgressData } from '../lib/supabase';

interface FriendProgressModalProps {
  friendId: string | null;
  friendUsername?: string;
  isOpen: boolean;
  onClose: () => void;
  fetchFriendProgress: (friendId: string) => Promise<FriendProgressData>;
}

export const FriendProgressModal: React.FC<FriendProgressModalProps> = ({
  friendId,
  friendUsername,
  isOpen,
  onClose,
  fetchFriendProgress,
}) => {
  const [data, setData] = useState<FriendProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !friendId) {
      setData(null);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchFriendProgress(friendId)
      .then((res) => {
        if (isMounted) {
          setData(res);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load friend progress.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, friendId, fetchFriendProgress]);

  if (!isOpen) return null;

  const courseIds: CourseId[] = ['cpp-heavy', 'java-heavy', 'python'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0D1B2A]/75 dark:bg-black/80 backdrop-blur-[4px] animate-fadeIn"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAF8F5] dark:bg-[#202020] border border-[#E7E2D6] dark:border-[#383838] shadow-2xl p-6 sm:p-8 md:p-9 text-[#091424] dark:text-[#F3F3F0] font-sans z-10 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E7E2D6] dark:border-[#333333]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#F4D875] stroke-[2]" />
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#64748B] dark:text-[#9E9E96]">
              VERIFIED CONNECTION PROGRESS
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#091424] dark:text-[#9E9E96] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#112E52] dark:text-[#F4D875]" />
            <span className="text-xs font-heading text-[#64748B] dark:text-[#9E9E96]">
              Loading verified placement progress {friendUsername ? `for @${friendUsername}` : ''}...
            </span>
          </div>
        ) : error ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-heading font-bold rounded-lg bg-[#091424] text-white"
            >
              Close
            </button>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Friend Identity Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#282828] border border-[#E7E2D6] dark:border-[#383838]">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-[#091424] dark:bg-[#141414] text-white flex items-center justify-center p-3.5 shadow-sm">
                  <AvatarIcon id={data.profile.avatar_id} className="w-full h-full text-white" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-[#091424] dark:text-white">
                    {data.profile.display_name}
                  </h3>
                  <p className="text-xs font-heading font-medium text-[#64748B] dark:text-[#9E9E96]">
                    @{data.profile.username}
                  </p>
                </div>
              </div>

              {/* ELO Rating Badge */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1f1f1f] border border-[#E7E2D6] dark:border-[#383838] flex items-center space-x-2">
                  <span className="text-xs font-heading font-semibold text-[#64748B] dark:text-[#9E9E96]">
                    ELO
                  </span>
                  <span className="text-lg font-heading font-black text-[#091424] dark:text-[#F4D875]">
                    {data.profile.elo_rating.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Courses Overview */}
            <div className="space-y-3">
              <h4 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
                CURRICULUM TRACKS
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {courseIds.map((cid) => {
                  const meta = COURSES[cid];
                  const totalTasks = CURRICULA[cid].reduce(
                    (acc, day) => acc + day.tasks.length,
                    0
                  );
                  const courseData = data.courses?.[cid];
                  const completed = courseData?.completed_count || 0;
                  const currentDay = courseData?.current_day || 1;
                  const percentage = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

                  return (
                    <div
                      key={cid}
                      className="p-4 rounded-2xl bg-white dark:bg-[#282828] border border-[#E7E2D6] dark:border-[#383838] space-y-2.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-heading font-bold text-[#091424] dark:text-white">
                          {meta.name}
                        </span>
                        <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#1f1f1f] text-[#64748B] dark:text-[#9E9E96] border border-[#E7E2D6] dark:border-[#383838]">
                          DAY {currentDay}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-heading">
                          <span className="text-[#64748B] dark:text-[#9E9E96]">
                            {completed} of {totalTasks} tasks
                          </span>
                          <span className="font-bold text-[#091424] dark:text-white">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#F2EFE9] dark:bg-[#1a1a1a] overflow-hidden">
                          <div
                            className="h-full bg-[#FCD34D] rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Streak & Consistency */}
            <div className="space-y-3">
              <h4 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
                STREAK &amp; ACTIVITY
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white dark:bg-[#282828] border border-[#E7E2D6] dark:border-[#383838] flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#FDE68A] flex items-center justify-center text-[#091424]">
                    <Flame className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-bold uppercase text-[#64748B] dark:text-[#9E9E96]">
                      CURRENT STREAK
                    </span>
                    <div className="text-base font-heading font-black text-[#091424] dark:text-white">
                      {data.streaks.current_streak} days
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#282828] border border-[#E7E2D6] dark:border-[#383838] flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#FDE68A] flex items-center justify-center text-[#091424]">
                    <Trophy className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-bold uppercase text-[#64748B] dark:text-[#9E9E96]">
                      LONGEST STREAK
                    </span>
                    <div className="text-base font-heading font-black text-[#091424] dark:text-white">
                      {data.streaks.longest_streak} days
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#282828] border border-[#E7E2D6] dark:border-[#383838] flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#FDE68A] flex items-center justify-center text-[#091424]">
                    <CalendarCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-bold uppercase text-[#64748B] dark:text-[#9E9E96]">
                      DAYS LOGGED
                    </span>
                    <div className="text-base font-heading font-black text-[#091424] dark:text-white">
                      {data.attendance.length} days
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Heatmap */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#282828] border border-[#E7E2D6] dark:border-[#383838]">
              <AttendanceHeatmap attendedDates={data.attendance} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

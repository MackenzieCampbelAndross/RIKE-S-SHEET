import React, { useMemo } from 'react';
import { Flame, Trophy, CalendarCheck, Zap } from 'lucide-react';
import { getLocalDateString } from '../hooks/useAttendance';

interface StreakConsistencyWidgetProps {
  currentStreak: number;
  longestStreak: number;
  attendedDates: string[];
}

export const StreakConsistencyWidget: React.FC<StreakConsistencyWidgetProps> = ({
  currentStreak,
  longestStreak,
  attendedDates,
}) => {
  const attendedSet = useMemo(() => new Set(attendedDates), [attendedDates]);

  // Compute the past 14 days activity strip (LeetCode/GitHub style mini activity ring/strip)
  const pastDays = useMemo(() => {
    const list = [];
    const today = new Date();

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      const isAttended = attendedSet.has(dateStr);
      const dayName = d.toLocaleDateString(undefined, { weekday: 'narrow' });
      const dayNum = d.getDate();

      list.push({
        dateStr,
        dayName,
        dayNum,
        isAttended,
        isToday: i === 0,
      });
    }

    return list;
  }, [attendedSet]);

  return (
    <div className="w-full space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-app-accent stroke-[1.8]" />
          <span className="text-xs font-heading font-medium uppercase tracking-wider text-app-main">
            Streak & Consistency
          </span>
        </div>
        <span className="text-[11px] font-heading font-light text-app-dim">
          (AD)² Preparation Discipline
        </span>
      </div>

      {/* LeetCode / Duolingo Style Streak Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Current Active Streak Card with glowing flame */}
        <div className="p-4 rounded-xl border border-app-accent/30 bg-app-accent/10 shadow-[0_0_15px_rgba(244,216,117,0.1)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-heading font-light text-app-sub uppercase tracking-wider">
              Active Streak
            </span>
            <div className="text-2xl font-heading font-normal text-app-accent flex items-baseline space-x-1.5">
              <span>{currentStreak}</span>
              <span className="text-xs font-body text-app-dim font-light">days</span>
            </div>
            <p className="text-[10px] font-body text-app-dim font-light">
              {currentStreak > 0 ? 'Consecutive daily entries' : 'Enter today to start your streak'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-app-accent/20 border border-app-accent/40 flex items-center justify-center text-xl filter drop-shadow-[0_0_6px_rgba(244,216,117,0.7)]">
            🔥
          </div>
        </div>

        {/* Longest Streak Record Card */}
        <div className="p-4 rounded-xl border border-white/10 bg-app-row/50 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-heading font-light text-app-dim uppercase tracking-wider">
              All-Time Best
            </span>
            <div className="text-2xl font-heading font-light text-app-main flex items-baseline space-x-1.5">
              <span>{longestStreak}</span>
              <span className="text-xs font-body text-app-dim font-light">days</span>
            </div>
            <p className="text-[10px] font-body text-app-dim font-light">
              Highest consistency milestone
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-app-dim">
            <Trophy className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>

        {/* Total Attended Entries Card */}
        <div className="p-4 rounded-xl border border-white/10 bg-app-row/50 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-heading font-light text-app-dim uppercase tracking-wider">
              Days Logged
            </span>
            <div className="text-2xl font-heading font-light text-app-main flex items-baseline space-x-1.5">
              <span>{attendedDates.length}</span>
              <span className="text-xs font-body text-app-dim font-light">total</span>
            </div>
            <p className="text-[10px] font-body text-app-dim font-light">
              Total successful calendar sessions
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-app-dim">
            <CalendarCheck className="w-5 h-5 stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* LeetCode Style 14-Day Streak Strip */}
      <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] font-heading font-light text-app-dim">
            <Zap className="w-3.5 h-3.5 text-app-accent" />
            <span>Recent 14 Days Activity Strip</span>
          </div>
          <span className="text-[10px] font-body text-app-dim font-light">
            {pastDays.filter((d) => d.isAttended).length} / 14 attended
          </span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 pt-1">
          {pastDays.map((d) => (
            <div
              key={d.dateStr}
              title={`${d.dateStr}: ${d.isAttended ? 'Attended' : 'Missed'}`}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all ${
                d.isAttended
                  ? 'border-app-accent/60 bg-app-accent/15 text-app-accent shadow-[0_0_8px_rgba(244,216,117,0.2)]'
                  : d.isToday
                  ? 'border-white/30 bg-white/5 text-app-main'
                  : 'border-white/5 bg-white/[0.02] text-app-dim'
              }`}
            >
              <span className="text-[9px] font-heading font-light uppercase opacity-70">
                {d.dayName}
              </span>
              <span className="text-xs font-heading font-normal my-0.5">
                {d.dayNum}
              </span>
              <div
                className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                  d.isAttended
                    ? 'bg-app-accent shadow-[0_0_4px_rgba(244,216,117,0.8)]'
                    : 'bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

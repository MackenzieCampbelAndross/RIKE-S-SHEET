import React, { useMemo } from 'react';
import { getLocalDateString } from '../hooks/useAttendance';

interface AttendanceHeatmapProps {
  attendedDates: string[];
}

export const AttendanceHeatmap: React.FC<AttendanceHeatmapProps> = ({ attendedDates }) => {
  const attendedSet = useMemo(() => new Set(attendedDates), [attendedDates]);
  const todayStr = useMemo(() => getLocalDateString(), []);

  const { weeks, monthHeaders } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    const startDate = new Date(currentYear, 0, 1);
    const dayOfW = startDate.getDay();
    const diffToMon = dayOfW === 0 ? -6 : 1 - dayOfW;
    startDate.setDate(startDate.getDate() + diffToMon);

    const totalWeeks = 53;
    const generatedWeeks: Array<
      Array<{
        dateStr: string;
        isAttended: boolean;
        isToday: boolean;
        isFuture: boolean;
        displayDate: string;
      }>
    > = [];

    const monthsAdded = new Set<string>();

    const iter = new Date(startDate);

    for (let w = 0; w < totalWeeks; w++) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = getLocalDateString(iter);
        const isFuture = iter.getTime() > now.getTime() && dateStr !== todayStr;
        const isToday = dateStr === todayStr;
        const isAttended = !isFuture && attendedSet.has(dateStr);

        const monthShort = iter.toLocaleString('default', { month: 'short' });
        if (iter.getFullYear() === currentYear && !monthsAdded.has(monthShort) && iter.getDate() <= 7) {
          monthsAdded.add(monthShort);
        }

        weekDays.push({
          dateStr,
          isAttended,
          isToday,
          isFuture,
          displayDate: iter.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        });

        iter.setDate(iter.getDate() + 1);
      }
      generatedWeeks.push(weekDays);
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return { weeks: generatedWeeks, monthHeaders: months };
  }, [attendedSet, todayStr]);

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full space-y-4">
      {/* Title & Legend matching reference */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h2 className="text-xs font-heading font-bold uppercase tracking-wider text-[#091424] dark:text-white">
            ATTENDANCE
          </h2>
          <p className="text-xs font-body text-[#64748B] dark:text-[#9E9E96]">
            Track your consistency through your learning journey.
          </p>
        </div>

        {/* Legend: [■ Attended] [■ Not Attended] [□ Today] */}
        <div className="flex items-center space-x-4 text-xs font-body text-[#64748B] dark:text-[#9E9E96]">
          <div className="flex items-center space-x-1.5">
            <span className="font-medium text-[#091424] dark:text-white">Attended</span>
            <div className="w-3.5 h-3.5 rounded-[3px] bg-[#FCD34D]" />
          </div>
          <div className="flex items-center space-x-1.5">
            <span>Not Attended</span>
            <div className="w-3.5 h-3.5 rounded-[3px] bg-[#E8E4DA] dark:bg-[#333333]" />
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3.5 h-3.5 rounded-[3px] border-2 border-[#FCD34D] bg-[#FAF8F5] dark:bg-[#222222]" />
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Heatmap Matrix */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="inline-block min-w-full">
          {/* Months header */}
          <div className="grid grid-cols-12 text-[11px] font-body text-[#64748B] dark:text-[#9E9E96] mb-2 pl-9 pr-1">
            {monthHeaders.map((m) => (
              <span key={m} className="text-left font-medium">
                {m}
              </span>
            ))}
          </div>

          <div className="flex items-start">
            {/* Weekdays Mon - Sun */}
            <div className="flex flex-col space-y-[4px] pr-3 text-[11px] font-body text-[#64748B] dark:text-[#9E9E96] select-none">
              {weekdays.map((day) => (
                <div key={day} className="h-3 leading-[12px] font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks Columns */}
            <div className="flex flex-1 justify-between gap-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col space-y-[4px]">
                  {week.map((day) => {
                    return (
                      <div
                        key={day.dateStr}
                        title={`${day.displayDate}: ${
                          day.isFuture
                            ? 'Upcoming date'
                            : day.isAttended
                            ? "Attended via RIKE'S SHEET"
                            : 'Not Attended'
                        }`}
                        className={`w-3 h-3 rounded-[2.5px] transition-all duration-150 ${
                          day.isToday && day.isAttended
                            ? 'bg-[#FCD34D] border-2 border-[#F59E0B]'
                            : day.isToday
                            ? 'border-2 border-[#FCD34D] bg-[#FAF8F5] dark:bg-[#222222]'
                            : day.isAttended
                            ? 'bg-[#FCD34D]'
                            : day.isFuture
                            ? 'bg-[#E8E4DA]/40 dark:bg-[#333333]/30 cursor-default'
                            : 'bg-[#E8E4DA] dark:bg-[#333333] hover:opacity-80'
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

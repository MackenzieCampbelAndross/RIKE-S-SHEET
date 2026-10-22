import React from 'react';
import type { DayPlan } from '../types/curriculum';

interface DayHeaderProps {
  day: DayPlan;
  completedTasksCount: number;
  totalTasksCount: number;
  onOpenDayPicker: () => void;
}

export const DayHeader: React.FC<DayHeaderProps> = ({
  day,
  completedTasksCount,
  totalTasksCount,
  onOpenDayPicker,
}) => {
  const percentage = Math.round((completedTasksCount / Math.max(1, totalTasksCount)) * 100);

  return (
    <div className="space-y-4">
      {/* Top Row: Phase pill (left) & Today counter pill (right) */}
      <div className="flex items-center justify-between">
        <button
          onClick={onOpenDayPicker}
          title="Change Phase or Day"
          className="group px-4 py-1.5 rounded-full bg-[#FAE392] hover:bg-[#F9DD78] transition-colors text-[11px] font-heading font-bold text-[#091424] tracking-wider uppercase shadow-sm"
        >
          PHASE {day.phase}: {day.phaseName}
        </button>

        <div className="flex items-center space-x-3 text-xs font-heading font-medium">
          <span className="text-[#64748B] dark:text-[#9E9E96] tracking-wider text-xs">TODAY</span>
          <span className="text-[#091424] dark:text-white font-bold text-xs tracking-wider">
            {completedTasksCount} / {totalTasksCount}
          </span>
        </div>
      </div>

      {/* Day label, Title, and Focus */}
      <div className="space-y-1 pt-1">
        <div className="text-xs font-heading font-bold tracking-widest text-[#64748B] dark:text-[#9E9E96] uppercase">
          DAY {String(day.dayNumber).padStart(3, '0')} / 180
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-[44px] font-heading font-black tracking-tight text-[#091424] dark:text-white leading-tight">
          {day.title}
        </h1>

        <p className="text-sm sm:text-base pt-0.5 font-body">
          <span className="font-editorial italic text-base sm:text-lg text-[#334155] dark:text-[#D5D5CF] mr-1.5 font-normal">
            Focus:
          </span>
          <span className="text-[#334155] dark:text-[#D5D5CF] font-normal">
            {day.focus}
          </span>
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2 pt-1">
        <div className="h-2 w-full bg-[#E5E0D5] dark:bg-[#383838] rounded-full overflow-hidden p-[1px]">
          <div
            className="h-full bg-[#091424] dark:bg-[#FCD34D] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-body text-[#64748B] dark:text-[#9E9E96]">
          <span>{percentage}% of day tasks completed</span>
          <span>Journey Day {day.dayNumber} of 180</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ChevronLeft, ChevronRight, CornerDownLeft } from 'lucide-react';

interface DayNavigationProps {
  currentDay: number;
  totalDays: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const DayNavigation: React.FC<DayNavigationProps> = ({
  currentDay,
  totalDays,
  onPrev,
  onNext,
  onToday,
}) => {
  return (
    <div className="w-full pt-4">
      {/* Bottom bar container */}
      <div className="w-full px-4 sm:px-6 py-2.5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] flex items-center justify-between transition-colors">
        {/* Previous Button (Left aligned) */}
        <button
          onClick={onPrev}
          disabled={currentDay <= 1}
          className={`flex items-center space-x-1.5 py-1 text-xs font-heading font-medium transition-colors ${
            currentDay <= 1
              ? 'opacity-25 text-[#94A3B8] cursor-not-allowed'
              : 'text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white'
          }`}
        >
          <ChevronLeft className="w-4 h-4 stroke-[2]" />
          <span>Previous Day</span>
        </button>

        {/* Today Button (Center aligned) */}
        <button
          onClick={onToday}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-heading font-medium text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          title="Jump to Today (Press T)"
        >
          <CornerDownLeft className="w-3.5 h-3.5 stroke-[2] text-[#94A3B8]" />
          <span>Today</span>
        </button>

        {/* Next Day Pill Button */}
        <button
          onClick={onNext}
          disabled={currentDay >= totalDays}
          className={`flex items-center space-x-1.5 pl-4 pr-3 py-1.5 rounded-full bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] hover:opacity-90 transition-all text-xs font-heading font-bold shadow-sm ${
            currentDay >= totalDays
              ? 'opacity-25 cursor-not-allowed bg-black/20 text-[#64748B]'
              : ''
          }`}
        >
          <span>Next Day</span>
          <ChevronRight className="w-4 h-4 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};

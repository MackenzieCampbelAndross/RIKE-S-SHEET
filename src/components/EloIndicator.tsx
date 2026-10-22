import React from 'react';
import { Zap } from 'lucide-react';

interface EloIndicatorProps {
  rating: number;
  onClick?: () => void;
}

export const EloIndicator: React.FC<EloIndicatorProps> = ({ rating, onClick }) => {
  return (
    <div
      onClick={onClick}
      title="Earn rating points through verified learning progress and assessments."
      className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/70 dark:bg-[#282828] border border-[#E5E0D5] dark:border-[#383838] shadow-sm backdrop-blur-sm cursor-pointer hover:border-[#F4D875] transition-all select-none"
    >
      <Zap className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
      <span className="text-[11px] sm:text-xs font-heading font-black tracking-tight text-[#091424] dark:text-[#F4D875]">
        {rating.toLocaleString()}
      </span>
      <span className="text-[10px] font-heading font-bold text-[#64748B] dark:text-[#9E9E96]">
        ELO
      </span>
    </div>
  );
};

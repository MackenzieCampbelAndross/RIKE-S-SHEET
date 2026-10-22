import React from 'react';
import type { Task } from '../types/curriculum';
import { Check } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  completed: boolean;
  onToggle: () => void;
  index: number;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  completed,
  onToggle,
}) => {
  return (
    <div
      onClick={onToggle}
      className={`group relative flex items-center justify-between px-5 py-3 sm:py-3.5 rounded-full border transition-all duration-150 cursor-pointer select-none ${
        completed
          ? 'bg-[#F9F7F1] dark:bg-[#222222]/60 border-[#E8E3D8] dark:border-[#333333] opacity-75'
          : 'bg-[#FCFBF8] dark:bg-[#222222] border-[#E5E0D5] dark:border-[#333333] hover:bg-white dark:hover:bg-[#2a2a2a] hover:border-[#D5CEBF] dark:hover:border-[#444444] shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
      }`}
    >
      <div className="flex items-center min-w-0 flex-1 pr-3">
        {/* Circular Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={completed}
          aria-label={task.title}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 border mr-4 ${
            completed
              ? 'bg-[#091424] dark:bg-[#FCD34D] border-[#091424] dark:border-[#FCD34D] text-white dark:text-[#091424] scale-100'
              : 'border-[#94A3B8] dark:border-[#666666] bg-transparent hover:border-[#091424] dark:hover:border-white'
          }`}
        >
          {completed && (
            <Check className="w-3 h-3 stroke-[3] text-white dark:text-[#091424]" />
          )}
        </button>

        {/* Task Title */}
        <span
          className={`text-sm sm:text-[14px] font-body leading-relaxed transition-all duration-150 ${
            completed
              ? 'text-[#94A3B8] dark:text-[#777777] line-through font-normal'
              : 'text-[#1E293B] dark:text-[#F3F3F0] font-medium'
          }`}
        >
          {task.title}
        </span>
      </div>

      {/* Right Category Tag Pill */}
      <div className="flex-shrink-0 ml-2">
        <span
          className={`text-[10px] sm:text-[11px] font-heading font-medium tracking-wide px-3 py-0.5 rounded-full border ${
            completed
              ? 'text-[#94A3B8] dark:text-[#777777] border-[#E2E8F0] dark:border-[#333333] bg-transparent'
              : 'text-[#64748B] dark:text-[#A0A0A0] border-[#CBD5E1] dark:border-[#444444] bg-transparent'
          }`}
        >
          {task.category}
        </span>
      </div>
    </div>
  );
};

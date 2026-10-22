import React, { useState, useRef, useEffect } from 'react';
import type { CourseId, CourseStats } from '../types/curriculum';
import { ChevronDown, Check, Layers } from 'lucide-react';

interface CourseSwitcherProps {
  currentCourseId: CourseId;
  courses: CourseStats[];
  onSelectCourse: (courseId: CourseId) => void;
  compact?: boolean;
}

export const CourseSwitcher: React.FC<CourseSwitcherProps> = ({
  currentCourseId,
  courses,
  onSelectCourse,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeCourse = courses.find((c) => c.id === currentCourseId) || courses[0];

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Compact Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Switch Course Track"
        className={`group flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer select-none ${
          isOpen
            ? 'border-[#091424] dark:border-[#FCD34D] bg-[#091424] text-white dark:bg-[#FCD34D] dark:text-[#091424] shadow-sm'
            : 'border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] text-[#091424] dark:text-white hover:border-[#091424] dark:hover:border-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#FCD34D] dark:bg-[#091424] ring-1 ring-[#091424]/20" />
        <span className="text-xs font-heading font-bold uppercase tracking-wider">
          {compact ? activeCourse.tag : activeCourse.name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 stroke-[2.2] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 rounded-2xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#242424] shadow-xl z-50 p-2 space-y-1 animate-scaleUp text-[#091424] dark:text-[#F3F3F0]">
          {/* Header */}
          <div className="px-3 pt-2 pb-1.5 flex items-center justify-between border-b border-[#E7E2D6] dark:border-[#333333]">
            <div className="flex items-center space-x-1.5 text-[10px] font-heading font-bold uppercase tracking-widest text-[#64748B] dark:text-[#9E9E96]">
              <Layers className="w-3 h-3" />
              <span>SWITCH TRACK</span>
            </div>
            <span className="text-[10px] font-heading text-[#64748B] dark:text-[#9E9E96]">
              3 Tracks
            </span>
          </div>

          {/* List of Tracks */}
          <div className="space-y-1 pt-1">
            {courses.map((course) => {
              const isSelected = course.id === currentCourseId;

              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => {
                    onSelectCourse(course.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex flex-col p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-[#091424] dark:border-[#FCD34D] bg-white dark:bg-[#2e2e2e] shadow-sm'
                      : 'border-transparent hover:border-[#E5E0D5] dark:hover:border-[#383838] hover:bg-white/60 dark:hover:bg-[#2a2a2a]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider bg-[#091424] text-white dark:bg-white dark:text-[#091424]">
                        {course.tag}
                      </span>
                      <span className="text-xs sm:text-[13px] font-heading font-bold text-[#091424] dark:text-white">
                        {course.name}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Day and Completion stats */}
                  <div className="flex items-center justify-between text-[11px] font-body text-[#64748B] dark:text-[#9E9E96] mt-2">
                    <span>Day {course.currentDay} of 180</span>
                    <span className="font-heading font-bold text-[#091424] dark:text-white">
                      {course.percentage}% complete
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-[#E5E0D5] dark:bg-[#383838] rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-[#091424] dark:bg-[#FCD34D] rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(course.percentage, 2)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

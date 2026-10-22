import React, { useEffect } from 'react';
import type { CourseId, CourseStats } from '../types/curriculum';
import { ArrowRight, X, Check, BookOpen, Sparkles } from 'lucide-react';

interface CourseSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (courseId: CourseId) => void;
  courses: CourseStats[];
  selectedCourseId?: CourseId;
  isDark?: boolean;
}

export const CourseSelectModal: React.FC<CourseSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
  courses,
  selectedCourseId,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn selection:bg-[#FCD34D] selection:text-[#091424]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
    >
      <div
        className="relative w-full max-w-4xl bg-[#FAF8F5] dark:bg-[#202020] text-[#091424] dark:text-[#F3F3F0] rounded-3xl border border-[#E7E2D6] dark:border-[#383838] shadow-2xl p-6 sm:p-8 md:p-10 overflow-hidden animate-scaleUp transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Return to landing page"
          title="Return to landing page (Esc)"
          className="absolute top-5 right-5 sm:top-7 sm:right-7 p-2 rounded-full text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pb-6 sm:pb-8 border-b border-[#E7E2D6] dark:border-[#333333]">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-heading font-bold uppercase tracking-widest text-[#64748B] dark:text-[#9E9E96]">
            <BookOpen className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>PLACEMENT PREPARATION TRACKS</span>
          </div>

          <h1
            id="course-modal-title"
            className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight text-[#091424] dark:text-white"
          >
            What are we studying today?
          </h1>

          <p className="text-sm sm:text-base font-body text-[#475569] dark:text-[#CCCCCC]">
            Pick a course. Your progress stays yours.
          </p>
        </div>

        {/* Three Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-6 sm:pt-8">
          {courses.map((course) => {
            const isCurrentlySelected = selectedCourseId === course.id;

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCourse(course.id);
                  }
                }}
                className={`group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#091424] dark:focus-visible:ring-[#FCD34D] ${
                  isCurrentlySelected
                    ? 'bg-white dark:bg-[#282828] border-[#091424] dark:border-[#FCD34D] shadow-md ring-1 ring-[#091424]/10 dark:ring-[#FCD34D]/20'
                    : 'bg-[#FCFBF8] dark:bg-[#252525] border-[#E5E0D5] dark:border-[#383838] hover:border-[#091424]/40 dark:hover:border-white/40 hover:bg-white dark:hover:bg-[#2a2a2a] shadow-sm hover:shadow-md'
                }`}
              >
                {/* Top: Language Badge & Status Pill */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-heading font-bold uppercase tracking-wider bg-[#091424] text-white dark:bg-white dark:text-[#091424]">
                      {course.tag}
                    </span>

                    <span
                      className={`text-[10px] sm:text-[11px] font-heading font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                        course.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : course.status === 'In progress'
                          ? 'bg-[#FAE392] text-[#091424] font-bold'
                          : 'bg-[#E5E0D5]/60 text-[#64748B] dark:bg-[#333333] dark:text-[#A0A0A0]'
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  {/* Course Title and Description */}
                  <div className="space-y-1.5">
                    <h2 className="text-xl sm:text-2xl font-heading font-black text-[#091424] dark:text-white leading-tight flex items-center justify-between">
                      <span>{course.name}</span>
                      {isCurrentlySelected && (
                        <span className="w-5 h-5 rounded-full bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] flex items-center justify-center flex-shrink-0 ml-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </h2>
                    <p className="text-xs sm:text-[13px] font-body text-[#475569] dark:text-[#A3A39D] leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Bottom: Day position, Progress bar, and Completion % */}
                <div className="pt-6 space-y-3.5 border-t border-[#EFECE4] dark:border-[#333333] mt-5">
                  <div className="flex items-center justify-between text-xs font-heading">
                    <span className="font-bold text-[#091424] dark:text-white uppercase tracking-wider">
                      DAY {String(course.currentDay).padStart(2, '0')} / 180
                    </span>
                    <span className="font-extrabold text-sm text-[#091424] dark:text-[#FCD34D]">
                      {course.percentage}%
                    </span>
                  </div>

                  {/* Minimal Progress Bar */}
                  <div className="h-2 w-full bg-[#E5E0D5] dark:bg-[#383838] rounded-full overflow-hidden p-[1px]">
                    <div
                      className="h-full bg-[#091424] dark:bg-[#FCD34D] rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${Math.max(course.percentage, 2)}%` }}
                    />
                  </div>

                  {/* Select Button Affordance */}
                  <div className="pt-1">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course.id);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all duration-150 ${
                        isCurrentlySelected
                          ? 'bg-[#FCD34D] text-[#091424] shadow-sm hover:bg-[#F5CA38]'
                          : 'bg-[#091424] text-white dark:bg-[#333333] dark:text-white group-hover:bg-[#FCD34D] group-hover:text-[#091424] dark:group-hover:bg-[#FCD34D] dark:group-hover:text-[#091424]'
                      }`}
                    >
                      <span>{isCurrentlySelected ? 'Continue Track' : 'Select Track'}</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-150 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-body text-[#64748B] dark:text-[#9E9E96] gap-2">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FCD34D]" />
            <span>Switch between tracks at any time inside the dashboard.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-heading font-medium underline hover:text-[#091424] dark:hover:text-white transition-colors"
          >
            Cancel and back to landing
          </button>
        </div>
      </div>
    </div>
  );
};

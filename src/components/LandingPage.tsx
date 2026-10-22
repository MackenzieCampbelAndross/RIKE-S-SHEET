import React, { useMemo } from 'react';
import { ArrowRight, Sun, Moon } from 'lucide-react';
import { getRandomVerse } from '../data/verses';

interface LandingPageProps {
  onEnter: () => void;
  onLogin?: () => void;
  isAuthenticated?: boolean;
  username?: string;
  currentStreak: number;
  currentDay?: number;
  totalDays?: number;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnter,
  onLogin,
  isAuthenticated = false,
  username,
  currentDay = 1,
  totalDays = 180,
  isDark = false,
  onToggleTheme,
}) => {
  // Select one curated verse per landing page visit (stable for this visit)
  const selectedVerse = useMemo(() => {
    return getRandomVerse().verse;
  }, []);

  const formattedDay = String(currentDay).padStart(2, '0');

  return (
    <div className="h-screen w-full bg-[#F5F2EB] dark:bg-[#1f1f1f] text-[#0D1B2A] dark:text-[#F3F3F0] relative flex flex-col justify-between overflow-hidden selection:bg-[#FCD34D] selection:text-[#0D1B2A] font-sans transition-colors duration-200">
      {/* 
        ============================================================
        BACKGROUND ARCHITECTURAL GRAPHICS (Thin geometric lines & arcs)
        ============================================================
      */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle grid lines */}
        <line x1="75%" y1="0" x2="75%" y2="100%" stroke={isDark ? "#ffffff" : "#0D1B2A"} strokeOpacity={isDark ? "0.06" : "0.08"} strokeWidth="1" />
        <line x1="65%" y1="0" x2="65%" y2="100%" stroke={isDark ? "#ffffff" : "#0D1B2A"} strokeOpacity={isDark ? "0.04" : "0.06"} strokeWidth="1" />

        {/* Circular sweeping arc on the right */}
        <circle
          cx="100%"
          cy="38%"
          r="45vw"
          fill="none"
          stroke={isDark ? "#ffffff" : "#0D1B2A"}
          strokeOpacity={isDark ? "0.06" : "0.08"}
          strokeWidth="1"
        />
        <circle
          cx="100%"
          cy="38%"
          r="32vw"
          fill="none"
          stroke={isDark ? "#ffffff" : "#0D1B2A"}
          strokeOpacity={isDark ? "0.04" : "0.05"}
          strokeWidth="1"
        />
      </svg>

      {/* 
        ============================================================
        TOP BAR
        Left: RIKE'S SHEET + horizontal thin rule
        Right: 01 / 180 + short rule + Sun/Theme toggle
        ============================================================
      */}
      <header className="w-full pt-5 md:pt-6 px-6 sm:px-10 md:px-14 flex items-center justify-between z-10 flex-shrink-0">
        {/* Left: Brand name + line */}
        <div className="flex items-center flex-1 pr-6 sm:pr-12">
          <span className="text-xs sm:text-[13px] font-heading font-bold tracking-widest text-[#0D1B2A] dark:text-white uppercase whitespace-nowrap">
            RIKE'S SHEET
          </span>
          <div className="h-[1px] bg-[#0D1B2A]/15 dark:bg-white/15 flex-1 ml-4 sm:ml-6" />
        </div>

        {/* Right: Day progression indicator + line + circular sun button */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <span className="text-xs sm:text-[13px] font-heading font-medium tracking-widest text-[#0D1B2A] dark:text-white/80">
            {formattedDay} / {totalDays}
          </span>
          <div className="h-[1px] w-8 sm:w-12 bg-[#0D1B2A]/20 dark:bg-white/20 hidden sm:block" />

          {/* Theme toggle matching top-right circular sun */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0D1B2A] dark:bg-white text-white dark:text-[#1f1f1f] hover:opacity-90 flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 stroke-[2.2]" />
            ) : (
              <Moon className="w-3.5 h-3.5 stroke-[2.2]" />
            )}
          </button>
        </div>
      </header>

      {/* 
        ============================================================
        MAIN HERO SECTION (Fills available screen space without scrolling)
        ============================================================
      */}
      <main className="w-full px-6 sm:px-10 md:px-14 z-10 flex-1 flex flex-col justify-center min-h-0 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center">
          {/* LEFT COLUMN: GIGANTIC STACKED "RIKE'S" and "SHEET" */}
          <div className="lg:col-span-8 flex flex-col select-none">
            {/* RIKE'S in Deep Navy / White in dark mode */}
            <h1 className="text-[17vw] lg:text-[10.5vw] xl:text-[11vw] font-black tracking-[-0.04em] text-[#0D1B2A] dark:text-white leading-[0.82] font-heading m-0 p-0 uppercase">
              RIKE'S
            </h1>
            {/* SHEET in Warm Butter Yellow */}
            <h1 className="text-[17vw] lg:text-[10.5vw] xl:text-[11vw] font-black tracking-[-0.04em] text-[#FCD34D] leading-[0.82] font-heading m-0 p-0 uppercase mt-1">
              SHEET
            </h1>
          </div>

          {/* RIGHT COLUMN: Vertical 180 Progress Slider (DAILY PRACTICE & PLACEMENT PREP removed as requested) */}
          <div className="lg:col-span-4 flex items-center justify-end lg:pr-6 relative">
            {/* Vertical hairline divider */}
            <div className="absolute left-0 top-[-10%] bottom-[-10%] w-[1px] bg-[#0D1B2A]/15 dark:bg-white/15 hidden lg:block" />

            {/* Right: Vertical Day Track Indicator [180 ... ● 01] */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-heading text-[#0D1B2A]/60 dark:text-white/50 tracking-wider mb-2 font-medium">
                {totalDays}
              </span>
              {/* Vertical line with yellow marker */}
              <div className="w-[1px] h-24 sm:h-28 md:h-32 bg-[#0D1B2A]/20 dark:bg-white/20 relative flex flex-col justify-end items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FCD34D] absolute bottom-1 shadow-sm" />
              </div>
              <span className="text-[11px] font-heading text-[#0D1B2A] dark:text-white tracking-wider mt-2 font-bold">
                {formattedDay}
              </span>
            </div>
          </div>
        </div>

        {/* 
          ============================================================
          LOWER SECTION:
          Left: "SHOW UP. BUILD SKILL." + Solid Butter Yellow ENTER pill button
          Right: Architecture Block
          ============================================================
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-end mt-4 sm:mt-6 md:mt-8">
          {/* Left CTA Area */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-black tracking-tight text-[#0D1B2A] dark:text-white leading-tight">
                SHOW UP.
              </h2>
              <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-black tracking-tight text-[#0D1B2A] dark:text-white leading-tight">
                BUILD SKILL.
              </h2>
            </div>

            {/* Solid Butter-Yellow CTA pill button */}
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={isAuthenticated ? onEnter : onLogin}
                className="group inline-flex items-center justify-between w-56 sm:w-64 md:w-72 px-6 sm:px-7 py-3 rounded-full bg-[#FCD34D] hover:bg-[#F5CA38] text-[#0D1B2A] transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-heading font-bold tracking-[0.2em] uppercase">
                  {isAuthenticated ? 'ENTER' : 'LOGIN'}
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2] text-[#0D1B2A] transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {isAuthenticated && username && (
                <p className="text-[11px] font-heading font-semibold text-[#0D1B2A]/70 dark:text-white/70 pl-3">
                  Signed in as <span className="font-bold text-[#0D1B2A] dark:text-[#FCD34D]">@{username}</span>
                </p>
              )}
            </div>
          </div>

          {/* Right Architecture Block */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative h-24 sm:h-28 md:h-32 bg-[#0D1B2A] dark:bg-[#141414] rounded-none overflow-hidden flex items-end border border-transparent dark:border-white/10">
              {/* Subtle architectural vertical counter inside block */}
              <div className="absolute left-6 top-3 bottom-3 flex flex-col justify-between items-center text-[10px] font-heading text-white/50">
                <span>01</span>
                <div className="w-[1px] h-full my-1 bg-white/20" />
                <span>180</span>
              </div>

              {/* Concrete architectural texture / geometric lines */}
              <div className="absolute right-0 top-0 bottom-0 w-2/3 opacity-25 mix-blend-luminosity bg-gradient-to-l from-white/10 to-transparent pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
                  <circle cx="0" cy="50%" r="90" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 
        ============================================================
        FOOTER:
        Verse MOVED TO THE RIGHT (where DISCIPLINE TODAY / OPPORTUNITY TOMORROW was)
        ============================================================
      */}
      <footer className="w-full pt-2.5 pb-4 md:pb-5 px-6 sm:px-10 md:px-14 flex items-end justify-end z-10 border-t border-[#0D1B2A]/10 dark:border-white/10 flex-shrink-0">
        {/* Right-aligned Scripture Verse */}
        <div className="space-y-1 max-w-xl text-right">
          <p className="font-editorial italic text-xs sm:text-[13px] text-[#0D1B2A]/85 dark:text-white/85 leading-snug font-normal">
            “{selectedVerse.text}”
          </p>
          <div className="flex items-center justify-end space-x-2">
            <div className="w-4 h-[1px] bg-[#0D1B2A]/40 dark:bg-white/40" />
            <span className="text-[9px] sm:text-[10px] font-heading tracking-widest text-[#0D1B2A]/70 dark:text-white/70 uppercase font-bold">
              {selectedVerse.reference}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

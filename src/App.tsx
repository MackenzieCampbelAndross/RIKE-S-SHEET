import { useEffect, useState, useMemo } from 'react';
import { CURRICULUM, TOTAL_DAYS } from './data/curriculum';
import { usePlacementOS } from './hooks/usePlacementOS';
import { useAttendance } from './hooks/useAttendance';
import { useProfile } from './hooks/useProfile';
import { useTheme } from './hooks/useTheme';
import { SidebarNav, type SidebarTab } from './components/SidebarNav';
import { DayHeader } from './components/DayHeader';
import { TaskItem } from './components/TaskItem';
import { DayNavigation } from './components/DayNavigation';
import { DayPickerModal } from './components/DayPickerModal';
import { LandingPage } from './components/LandingPage';
import { ProfilePage } from './components/ProfilePage';
import { NotesPage } from './components/NotesPage';
import { TasksPage } from './components/TasksPage';
import { ProgressPage } from './components/ProgressPage';
import { ResourcesPage } from './components/ResourcesPage';
import { SettingsPage } from './components/SettingsPage';
import { ChevronDown, Sun, Moon, Menu, X } from 'lucide-react';

export function App() {
  // Persistent user data
  const {
    currentDay,
    setCurrentDay,
    toggleTask,
    resetToday,
    resetAll,
    isTaskCompleted,
    getDayCompletedCount,
    isDayFullyCompleted,
    totalCompletedTasksCount,
  } = usePlacementOS();

  const {
    attendedDates,
    currentStreak,
    longestStreak,
    recordAttendanceOnEnter,
  } = useAttendance();

  const {
    profile,
    updateName,
    updateAvatar,
  } = useProfile();

  const { isDark, toggleTheme } = useTheme();

  // In-memory entry state: MUST ALWAYS BE FALSE ON FRESH APPLICATION LOAD / REFRESH
  const [hasEnteredThisLoad, setHasEnteredThisLoad] = useState<boolean>(false);

  // Active navigation tab
  const [activeNavTab, setActiveNavTab] = useState<SidebarTab>('home');
  const [isDayPickerOpen, setIsDayPickerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Clean URL hash on initial load so deep links don't conflict with mandatory landing gate
  useEffect(() => {
    if (!hasEnteredThisLoad) {
      if (window.location.hash && window.location.hash !== '#' && window.location.hash !== '#/') {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [hasEnteredThisLoad]);

  // Handle hash navigation when entered
  useEffect(() => {
    if (!hasEnteredThisLoad) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/profile')) {
        setActiveNavTab('profile');
      } else if (hash.startsWith('#/notes')) {
        setActiveNavTab('notes');
      } else if (hash.startsWith('#/tasks')) {
        setActiveNavTab('tasks');
      } else if (hash.startsWith('#/progress')) {
        setActiveNavTab('progress');
      } else if (hash.startsWith('#/resources')) {
        setActiveNavTab('resources');
      } else if (hash.startsWith('#/settings')) {
        setActiveNavTab('settings');
      } else if (hash.startsWith('#/day/')) {
        const match = hash.match(/#\/day\/(\d+)/);
        if (match) {
          const parsed = parseInt(match[1], 10);
          if (parsed >= 1 && parsed <= TOTAL_DAYS) {
            setCurrentDay(parsed);
            setActiveNavTab('home');
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [hasEnteredThisLoad, setCurrentDay]);

  // Sync route hash when activeNavTab or day changes (only after entered)
  useEffect(() => {
    if (!hasEnteredThisLoad) return;

    if (activeNavTab === 'home') {
      window.location.hash = `/day/${currentDay}`;
    } else {
      window.location.hash = `/${activeNavTab}`;
    }
  }, [hasEnteredThisLoad, activeNavTab, currentDay]);

  // ENTER is the ONE and ONLY gate to the internal application
  const handleEnter = () => {
    recordAttendanceOnEnter();
    setHasEnteredThisLoad(true);
    setActiveNavTab('home');
    window.location.hash = `/day/${currentDay}`;
  };

  // LOG OUT Handler: returns user directly to landing page
  const handleLogout = () => {
    setHasEnteredThisLoad(false);
    window.location.hash = '';
  };

  // Current day data
  const currentDayData = useMemo(() => {
    return CURRICULUM.find((d) => d.dayNumber === currentDay) || CURRICULUM[0];
  }, [currentDay]);

  const completedTodayCount = getDayCompletedCount(currentDay);
  const totalTodayTasks = currentDayData.tasks.length;

  // Keyboard navigation when in internal application
  useEffect(() => {
    if (!hasEnteredThisLoad) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'Escape') {
        setIsDayPickerOpen(false);
        setIsMobileMenuOpen(false);
        if (activeNavTab !== 'home') {
          setActiveNavTab('home');
        }
        return;
      }

      if (activeNavTab !== 'home') return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentDay(Math.max(1, currentDay - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentDay(Math.min(TOTAL_DAYS, currentDay + 1));
      } else if (e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsDayPickerOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setCurrentDay(currentDay);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEnteredThisLoad, currentDay, setCurrentDay, activeNavTab]);

  return (
    <div className="min-h-screen text-[#091424] dark:text-[#F3F3F0] font-sans antialiased selection:bg-[#FCD34D] selection:text-[#091424]">
      {/* 
        MANDATORY GATEWAY:
        If user has not clicked ENTER during this page load, render LandingPage.
      */}
      {!hasEnteredThisLoad ? (
        <LandingPage
          onEnter={handleEnter}
          currentStreak={currentStreak}
          currentDay={currentDay}
          totalDays={TOTAL_DAYS}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F2EB] dark:bg-[#1f1f1f] transition-colors duration-200">
          {/* Mobile Overlay when sidebar is open */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Left Dark Sidebar Navigation */}
          <div
            className={`fixed md:sticky top-0 h-screen z-40 transition-transform duration-200 ease-in-out md:translate-x-0 ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
          >
            <SidebarNav
              activeTab={activeNavTab}
              onSelectTab={(tab) => {
                setIsMobileMenuOpen(false);
                setActiveNavTab(tab);
              }}
              onLogout={handleLogout}
            />
          </div>

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen bg-[#F5F2EB] dark:bg-[#1f1f1f] px-4 sm:px-6 md:px-10 lg:px-12 py-5 md:py-7 overflow-y-auto transition-colors duration-200">
            {/* Top Bar on Home page */}
            {activeNavTab === 'home' && (
              <header className="w-full max-w-5xl flex items-center justify-between pb-4">
                {/* Left: Mobile hamburger + Day selector dropdown trigger */}
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg bg-[#091424] dark:bg-white text-white dark:text-[#1f1f1f] hover:opacity-90 transition-colors"
                    aria-label="Toggle navigation menu"
                  >
                    {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDayPickerOpen(true)}
                    className="flex items-center space-x-1.5 text-xs sm:text-[13px] font-heading font-bold uppercase tracking-wider text-[#091424] dark:text-white hover:opacity-75 transition-opacity"
                    title="Jump to day (Press D)"
                  >
                    <span>DAY {String(currentDay).padStart(3, '0')} / {TOTAL_DAYS}</span>
                    <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Right: Tasks: 0   🔥 1 */}
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs font-heading font-medium text-[#091424] dark:text-white">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#64748B] dark:text-[#9E9E96] font-normal">Tasks:</span>
                    <span className="font-bold">{totalCompletedTasksCount}</span>
                  </div>

                  <div className="flex items-center space-x-1.5" title={`Current streak: ${currentStreak} days`}>
                    <span className="text-sm">🔥</span>
                    <span className="font-bold">{currentStreak}</span>
                  </div>
                </div>
              </header>
            )}

            {/* PAGE ROUTING (All pages follow the exact same warm cream UI and format!) */}
            {activeNavTab === 'home' && (
              <main className="flex-1 w-full max-w-5xl">
                <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-6 sm:p-8 md:p-10 shadow-sm space-y-6 transition-colors">
                  {/* Day Header */}
                  <DayHeader
                    day={currentDayData}
                    completedTasksCount={completedTodayCount}
                    totalTasksCount={totalTodayTasks}
                    onOpenDayPicker={() => setIsDayPickerOpen(true)}
                  />

                  {/* Checklist Section */}
                  <section aria-labelledby="checklist-heading" className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-1">
                      <h2
                        id="checklist-heading"
                        className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white"
                      >
                        TODAY'S CHECKLIST
                      </h2>
                      <span className="text-xs font-heading font-normal tracking-wide text-[#091424] dark:text-[#9E9E96]">
                        {completedTodayCount} of {totalTodayTasks} complete
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {currentDayData.tasks.map((task, idx) => {
                        const completed = isTaskCompleted(currentDay, task.id);
                        return (
                          <TaskItem
                            key={task.id}
                            task={task}
                            completed={completed}
                            onToggle={() => toggleTask(currentDay, task.id)}
                            index={idx}
                          />
                        );
                      })}
                    </div>
                  </section>

                  {/* Integrated Bottom Day Navigation */}
                  <DayNavigation
                    currentDay={currentDay}
                    totalDays={TOTAL_DAYS}
                    onPrev={() => setCurrentDay(Math.max(1, currentDay - 1))}
                    onNext={() => setCurrentDay(Math.min(TOTAL_DAYS, currentDay + 1))}
                    onToday={() => setCurrentDay(currentDay)}
                  />
                </div>
              </main>
            )}

            {activeNavTab === 'notes' && (
              <NotesPage
                onBack={() => setActiveNavTab('home')}
                currentDay={currentDay}
                onSelectDay={setCurrentDay}
              />
            )}

            {activeNavTab === 'tasks' && (
              <TasksPage
                onBack={() => setActiveNavTab('home')}
                onSelectDay={(day) => {
                  setCurrentDay(day);
                  setActiveNavTab('home');
                }}
                isTaskCompleted={isTaskCompleted}
                toggleTask={toggleTask}
                getDayCompletedCount={getDayCompletedCount}
              />
            )}

            {activeNavTab === 'progress' && (
              <ProgressPage
                onBack={() => setActiveNavTab('home')}
                getDayCompletedCount={getDayCompletedCount}
                isDayFullyCompleted={isDayFullyCompleted}
                totalCompletedTasksCount={totalCompletedTasksCount}
                currentStreak={currentStreak}
              />
            )}

            {activeNavTab === 'resources' && (
              <ResourcesPage
                onBack={() => setActiveNavTab('home')}
              />
            )}

            {activeNavTab === 'profile' && (
              <ProfilePage
                onBack={() => setActiveNavTab('home')}
                profile={profile}
                onUpdateName={updateName}
                onUpdateAvatar={updateAvatar}
                currentStreak={currentStreak}
                longestStreak={longestStreak}
                attendedDates={attendedDates}
              />
            )}

            {activeNavTab === 'settings' && (
              <SettingsPage
                onBack={() => setActiveNavTab('home')}
                currentDay={currentDay}
                profile={profile}
                onUpdateName={updateName}
                onUpdateAvatar={updateAvatar}
                onResetToday={() => resetToday(currentDay)}
                onResetAll={resetAll}
                isDark={isDark}
                onToggleTheme={toggleTheme}
              />
            )}

            {/* Day Picker Modal (Accessible globally) */}
            <DayPickerModal
              isOpen={isDayPickerOpen}
              onClose={() => setIsDayPickerOpen(false)}
              currentDay={currentDay}
              onSelectDay={(day) => {
                setCurrentDay(day);
                setActiveNavTab('home');
              }}
              isDayFullyCompleted={isDayFullyCompleted}
              getDayCompletedCount={getDayCompletedCount}
            />

            {/* Floating Dark/Light Mode Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? "Switch to Default Warm Cream Theme" : "Switch to Dark Mode (#1f1f1f)"}
              className="fixed bottom-6 right-8 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#091424] dark:bg-[#282828] text-white dark:border dark:border-white/10 hover:opacity-90 transition-all shadow-xl text-xs font-heading font-medium cursor-pointer select-none"
            >
              {isDark ? <Sun className="w-4 h-4 stroke-[2]" /> : <Moon className="w-4 h-4 stroke-[2]" />}
              <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

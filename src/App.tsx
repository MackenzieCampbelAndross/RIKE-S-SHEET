import { useEffect, useState, useMemo } from 'react';
import { TOTAL_DAYS } from './data/curriculum';
import type { CourseId } from './types/curriculum';
import { useAuth } from './hooks/useAuth';
import { usePlacementOS } from './hooks/usePlacementOS';
import { useAttendance } from './hooks/useAttendance';
import { useProfile } from './hooks/useProfile';
import { useTheme } from './hooks/useTheme';
import { useActiveTracker } from './hooks/useActiveTracker';
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
import { ConnectionsPage } from './components/ConnectionsPage';
import { SettingsPage } from './components/SettingsPage';
import { CourseSelectModal } from './components/CourseSelectModal';
import { CourseSwitcher } from './components/CourseSwitcher';
import { AuthModal } from './components/AuthModal';
import { EloIndicator } from './components/EloIndicator';
import { AvatarIcon } from './components/AvatarIcon';
import { ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';

export function App() {
  // Supabase Authentication state
  const {
    user,
    profile: authProfile,
    session,
    logout: authLogout,
    deleteAccount,
    refreshProfile,
    updateProfile,
  } = useAuth();

  // Persistent multi-course user data with Supabase Cloud integration
  const {
    selectedCourseId,
    selectCourse,
    currentCourseMeta,
    currentCurriculum,
    currentDay,
    setCurrentDay,
    toggleTask,
    resetCurrentCourse,
    resetAll,
    isTaskCompleted,
    getDayCompletedCount,
    isDayFullyCompleted,
    totalCompletedTasksCount,
    allCourseStats,
  } = usePlacementOS(user, () => refreshProfile());

  const {
    attendedDates,
    currentStreak,
    longestStreak,
    recordAttendanceOnEnter,
  } = useAttendance(user);

  const {
    profile: localProfile,
    updateName: updateLocalName,
    updateAvatar: updateLocalAvatar,
  } = useProfile();

  const { isDark, toggleTheme } = useTheme();

  // Conservative session-based active time tracking (heartbeats every 30s)
  useActiveTracker(user);

  // Effective profile reconciling cloud profile with local storage
  const effectiveProfile = useMemo(() => {
    return {
      name: authProfile?.display_name || localProfile.name,
      avatarId: authProfile?.avatar_id || localProfile.avatarId,
    };
  }, [authProfile, localProfile]);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // In-memory entry state: MUST ALWAYS BE FALSE ON FRESH APPLICATION LOAD / REFRESH
  const [hasEnteredThisLoad, setHasEnteredThisLoad] = useState<boolean>(false);

  // Course selection modal state triggered after clicking ENTER on Landing Page
  const [isCourseSelectModalOpen, setIsCourseSelectModalOpen] = useState<boolean>(false);

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
      } else if (hash.startsWith('#/connections')) {
        setActiveNavTab('connections');
      } else if (hash.startsWith('#/notes')) {
        setActiveNavTab('notes');
      } else if (hash.startsWith('#/tasks')) {
        setActiveNavTab('tasks');
      } else if (hash.startsWith('#/progress')) {
        setActiveNavTab('progress');
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

  // Triggered when clicking ENTER on the landing page
  const handleLandingEnterClick = () => {
    // Open Course Selection Popup
    setIsCourseSelectModalOpen(true);
  };

  // Triggered when a course is chosen in the modal
  const handleCourseChosenFromModal = (courseId: CourseId) => {
    selectCourse(courseId);
    recordAttendanceOnEnter();
    setHasEnteredThisLoad(true);
    setIsCourseSelectModalOpen(false);
    setActiveNavTab('home');
    window.location.hash = `/day/${currentDay}`;
  };

  // Dismissing modal returns user to landing page without entering
  const handleDismissCourseModal = () => {
    setIsCourseSelectModalOpen(false);
  };

  // LOG OUT Handler: logs out of Supabase and returns user directly to landing page
  const handleLogout = async () => {
    await authLogout();
    setHasEnteredThisLoad(false);
    setIsCourseSelectModalOpen(false);
    setIsAuthModalOpen(false);
    window.location.hash = '';
  };

  // DELETE ACCOUNT Handler: deletes from Supabase auth.users & tables, cleans storage and returns to landing
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      resetAll();
      setHasEnteredThisLoad(false);
      setIsCourseSelectModalOpen(false);
      setIsAuthModalOpen(false);
      window.location.hash = '';
    } catch (err) {
      console.error('Failed to delete account:', err);
      throw err;
    }
  };

  // Current day data for the selected course
  const currentDayData = useMemo(() => {
    return (
      currentCurriculum.find((d) => d.dayNumber === currentDay) ||
      currentCurriculum[0]
    );
  }, [currentCurriculum, currentDay]);

  const completedTodayCount = getDayCompletedCount(currentDay);
  const totalTodayTasks = currentDayData.tasks.length;

  // Profile update handlers syncing local state and Supabase profile
  const handleUpdateName = async (name: string) => {
    updateLocalName(name);
    if (user) {
      try {
        await updateProfile({ display_name: name });
      } catch (err) {
        console.error('Failed to sync updated name to cloud:', err);
      }
    }
  };

  const handleUpdateAvatar = async (avatarId: string) => {
    updateLocalAvatar(avatarId);
    if (user) {
      try {
        await updateProfile({ avatar_id: avatarId });
      } catch (err) {
        console.error('Failed to sync updated avatar to cloud:', err);
      }
    }
  };

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

  const isAuthenticated = Boolean(session?.user);

  return (
    <div className="min-h-screen text-[#091424] dark:text-[#F3F3F0] font-sans antialiased selection:bg-[#FCD34D] selection:text-[#091424]">
      {/* 
        MANDATORY GATEWAY:
        If user has not completed entry during this page load, render LandingPage.
      */}
      {!hasEnteredThisLoad ? (
        <>
          <LandingPage
            onEnter={handleLandingEnterClick}
            onLogin={() => setIsAuthModalOpen(true)}
            isAuthenticated={isAuthenticated}
            username={authProfile?.username}
            currentStreak={currentStreak}
            currentDay={currentDay}
            totalDays={TOTAL_DAYS}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

          {/* Authentication Modal */}
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={() => {
              setIsAuthModalOpen(false);
              // Open course selection popup upon successful authentication
              setIsCourseSelectModalOpen(true);
            }}
          />

          {/* Course Selection Popup modal before opening dashboard */}
          <CourseSelectModal
            isOpen={isCourseSelectModalOpen}
            onClose={handleDismissCourseModal}
            onSelectCourse={handleCourseChosenFromModal}
            courses={allCourseStats}
            selectedCourseId={selectedCourseId}
            isDark={isDark}
          />
        </>
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
              courseName={currentCourseMeta.name}
            />
          </div>

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen bg-[#F5F2EB] dark:bg-[#1f1f1f] px-4 sm:px-6 md:px-10 lg:px-12 py-5 md:py-7 overflow-y-auto transition-colors duration-200">
            {/* Top Bar on Home page */}
            {activeNavTab === 'home' && (
              <header className="w-full max-w-5xl flex items-center justify-between pb-4">
                {/* Left: Mobile hamburger + Course Switcher + Day selector dropdown trigger */}
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg bg-[#091424] dark:bg-white text-white dark:text-[#1f1f1f] hover:opacity-90 transition-colors"
                    aria-label="Toggle navigation menu"
                  >
                    {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </button>

                  {/* Compact Course Switcher in Dashboard Header */}
                  <CourseSwitcher
                    currentCourseId={selectedCourseId}
                    courses={allCourseStats}
                    onSelectCourse={selectCourse}
                  />

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

                {/* Right: Tasks: 0   🔥 1   ⚡ 1,000 ELO   [Avatar] */}
                <div className="flex items-center space-x-3 sm:space-x-3.5 text-xs font-heading font-medium text-[#091424] dark:text-white">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#64748B] dark:text-[#9E9E96] font-normal">Tasks:</span>
                    <span className="font-bold">{totalCompletedTasksCount}</span>
                  </div>

                  <div className="flex items-center space-x-1.5" title={`Current streak: ${currentStreak} days`}>
                    <span className="text-sm">🔥</span>
                    <span className="font-bold">{currentStreak}</span>
                  </div>

                  {/* ELO Rating Pill beside Profile Avatar */}
                  <EloIndicator
                    rating={authProfile?.elo_rating || 1000}
                    onClick={() => setActiveNavTab('profile')}
                  />

                  {/* Circular Avatar Control */}
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('profile')}
                    title="Open Profile"
                    className="w-8 h-8 rounded-full border border-[#091424]/20 dark:border-white/20 bg-white/50 dark:bg-white/10 hover:border-[#F4D875] flex items-center justify-center p-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <AvatarIcon id={effectiveProfile.avatarId} className="w-full h-full text-[#091424] dark:text-white" />
                  </button>
                </div>
              </header>
            )}

            {/* PAGE ROUTING */}
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
                        TODAY'S CHECKLIST &bull; {currentCourseMeta.name}
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
                curriculum={currentCurriculum}
                courseId={selectedCourseId}
                courseMeta={currentCourseMeta}
                courses={allCourseStats}
                onSelectCourse={selectCourse}
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
                curriculum={currentCurriculum}
                courseMeta={currentCourseMeta}
                courses={allCourseStats}
                onSelectCourse={selectCourse}
              />
            )}

            {activeNavTab === 'progress' && (
              <ProgressPage
                onBack={() => setActiveNavTab('home')}
                getDayCompletedCount={getDayCompletedCount}
                isDayFullyCompleted={isDayFullyCompleted}
                totalCompletedTasksCount={totalCompletedTasksCount}
                currentStreak={currentStreak}
                curriculum={currentCurriculum}
                courseMeta={currentCourseMeta}
                courses={allCourseStats}
                onSelectCourse={selectCourse}
              />
            )}

            {activeNavTab === 'connections' && (
              <ConnectionsPage
                onBack={() => setActiveNavTab('home')}
                currentUser={user}
              />
            )}

            {activeNavTab === 'profile' && (
              <ProfilePage
                onBack={() => setActiveNavTab('home')}
                profile={effectiveProfile}
                username={authProfile?.username}
                eloRating={authProfile?.elo_rating || 1000}
                onUpdateName={handleUpdateName}
                onUpdateAvatar={handleUpdateAvatar}
                currentStreak={currentStreak}
                longestStreak={longestStreak}
                attendedDates={attendedDates}
              />
            )}

            {activeNavTab === 'settings' && (
              <SettingsPage
                onBack={() => setActiveNavTab('home')}
                currentDay={currentDay}
                profile={effectiveProfile}
                onUpdateName={handleUpdateName}
                onUpdateAvatar={handleUpdateAvatar}
                onResetCurrentCourse={resetCurrentCourse}
                onResetAll={resetAll}
                onDeleteAccount={handleDeleteAccount}
                isDark={isDark}
                onToggleTheme={toggleTheme}
                courseMeta={currentCourseMeta}
                courses={allCourseStats}
                onSelectCourse={selectCourse}
              />
            )}

            {/* Day Picker Modal (Accessible globally) */}
            <DayPickerModal
              isOpen={isDayPickerOpen}
              onClose={() => setIsDayPickerOpen(false)}
              onSelectDay={(day) => {
                setCurrentDay(day);
                setIsDayPickerOpen(false);
              }}
              currentDay={currentDay}
              curriculum={currentCurriculum}
              isDayFullyCompleted={isDayFullyCompleted}
              getDayCompletedCount={getDayCompletedCount}
              courseName={currentCourseMeta.name}
            />

            {/* Floating Dark/Light Mode Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? "Switch to Default Warm Cream Theme" : "Switch to Dark Mode (#1f1f1f)"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
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


import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { AvatarIcon, AVATAR_OPTIONS } from './AvatarIcon';
import type { UserProfile } from '../hooks/useProfile';
import type { CourseMetadata, CourseStats, CourseId } from '../types/curriculum';
import { CourseSwitcher } from './CourseSwitcher';

interface SettingsPageProps {
  onBack: () => void;
  currentDay: number;
  profile: UserProfile;
  onUpdateName: (name: string) => void;
  onUpdateAvatar: (avatarId: string) => void;
  onResetCurrentCourse?: () => void;
  onResetAll: () => void;
  onDeleteAccount?: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  courseMeta?: CourseMetadata;
  courses?: CourseStats[];
  onSelectCourse?: (courseId: CourseId) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onBack,
  profile,
  onUpdateName,
  onUpdateAvatar,
  onResetCurrentCourse,
  onResetAll,
  onDeleteAccount,
  isDark,
  onToggleTheme,
  courseMeta,
  courses,
  onSelectCourse,
}) => {
  const [nameInput, setNameInput] = useState(profile.name);
  const [savedNameNotice, setSavedNameNotice] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setSavedNameNotice(true);
      setTimeout(() => setSavedNameNotice(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-5xl space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs sm:text-sm font-heading font-semibold text-[#091424] dark:text-white hover:opacity-75 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Return to Workspace</span>
        </button>

        <div className="flex items-center space-x-3">
          {courseMeta && courses && onSelectCourse && (
            <CourseSwitcher
              currentCourseId={courseMeta.id}
              courses={courses}
              onSelectCourse={onSelectCourse}
            />
          )}
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white hidden sm:inline">
            PREFERENCES &amp; SETTINGS
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-6 sm:p-8 md:p-10 shadow-sm space-y-8 text-[#091424] dark:text-[#F3F3F0] transition-colors">
        {/* Title */}
        <div className="space-y-1 pb-2 border-b border-[#E5E0D5] dark:border-[#383838]">
          <div className="flex items-center space-x-2">
            {courseMeta && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#091424] dark:bg-white text-white dark:text-[#091424] text-[10px] font-heading font-bold uppercase tracking-wider">
                {courseMeta.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#091424] dark:text-white">
              Application Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-body text-[#64748B] dark:text-[#9E9E96]">
            Configure your student identity, appearance, data persistence, and multi-track controls.
          </p>
        </div>

        {/* 1. Track Management */}
        {courses && onSelectCourse && (
          <div className="space-y-4">
            <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
              Course Tracks
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courses.map((c) => {
                const isActive = courseMeta?.id === c.id;
                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isActive
                        ? 'border-[#091424] dark:border-[#FCD34D] bg-white dark:bg-[#2a2a2a] shadow-sm'
                        : 'border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded bg-[#091424] text-white dark:bg-white dark:text-[#091424]">
                        {c.tag}
                      </span>
                      <span className="text-xs font-heading font-bold text-[#091424] dark:text-white">
                        {c.percentage}%
                      </span>
                    </div>

                    <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white mt-2">
                      {c.name}
                    </h3>

                    <p className="text-xs font-body text-[#64748B] dark:text-[#9E9E96] mt-0.5">
                      Day {c.currentDay} of 180 &bull; {c.completedTasksCount} tasks done
                    </p>

                    <div className="h-1.5 w-full bg-[#E5E0D5] dark:bg-[#383838] rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-[#091424] dark:bg-[#FCD34D] rounded-full"
                        style={{ width: `${Math.max(c.percentage, 2)}%` }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectCourse(c.id)}
                      disabled={isActive}
                      className={`w-full mt-3 py-1.5 px-3 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-[#FCD34D] text-[#091424] cursor-default'
                          : 'bg-[#091424] dark:bg-[#333333] text-white hover:bg-[#FCD34D] hover:text-[#091424] cursor-pointer'
                      }`}
                    >
                      {isActive ? 'Current Track' : 'Switch to Track'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Profile Customization */}
        <div className="space-y-4">
          <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
            Student Identity
          </h2>

          <div className="p-6 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-5 shadow-sm">
            {/* Name Input */}
            <form onSubmit={handleSaveName} className="space-y-2">
              <label className="text-xs font-heading font-bold text-[#091424] dark:text-white block">
                Display Name
              </label>
              <div className="flex items-center space-x-3 max-w-md">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full bg-white dark:bg-[#1f1f1f] border border-[#E5E0D5] dark:border-[#383838] rounded-xl px-4 py-2.5 text-sm font-heading font-bold text-[#091424] dark:text-white focus:outline-none focus:border-[#FCD34D]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] hover:opacity-90 text-xs font-heading font-bold transition-all flex-shrink-0 cursor-pointer"
                >
                  Save
                </button>
              </div>
              {savedNameNotice && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Name saved successfully!</span>
              )}
            </form>

            {/* Avatar Picker */}
            <div className="space-y-2.5 pt-2 border-t border-[#E5E0D5] dark:border-[#383838]">
              <label className="text-xs font-heading font-bold text-[#091424] dark:text-white block">
                Avatar Silhouette
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {AVATAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onUpdateAvatar(opt.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      profile.avatarId === opt.id
                        ? 'border-[#091424] dark:border-[#FCD34D] bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] shadow-sm'
                        : 'border-[#E5E0D5] dark:border-[#383838] bg-white dark:bg-[#1f1f1f] text-[#091424] dark:text-white hover:border-[#091424]'
                    }`}
                  >
                    <div className="w-8 h-8 mb-1.5">
                      <AvatarIcon id={opt.id} className="w-full h-full" strokeWidth={1.4} />
                    </div>
                    <span className="text-[10px] font-heading font-medium">{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Appearance */}
        <div className="space-y-4">
          <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
            Appearance
          </h2>

          <div className="p-6 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">
                Interface Color Scheme
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">
                {isDark ? 'Currently in dark mode (#1f1f1f)' : 'Currently in default warm cream mode (#FAF8F5)'}
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center space-x-2 px-4 py-2 rounded-full border border-[#E5E0D5] dark:border-[#383838] bg-white dark:bg-[#1f1f1f] hover:border-[#091424] dark:hover:border-white text-xs font-heading font-bold text-[#091424] dark:text-white transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FCD34D]" /> : <Moon className="w-4 h-4" />}
              <span>Toggle Theme</span>
            </button>
          </div>
        </div>

        {/* 4. Reset & Account Danger Operations */}
        <div className="space-y-4">
          <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
            Data Management &amp; Safety
          </h2>

          <div className="p-6 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-4 shadow-sm">
            {/* 1. Reset Chosen Track */}
            {onResetCurrentCourse && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E0D5] dark:border-[#383838]">
                <div>
                  <h3 className="text-sm font-heading font-bold text-amber-700 dark:text-amber-400">
                    Reset {courseMeta?.name || 'Current Track'} Only
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">
                    Clear progress and restart from Day 1 for {courseMeta?.name || 'this track'} in the database and locally. Other courses remain untouched.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Reset all progress for ${courseMeta?.name || 'this track'} in the database and locally? Other courses will NOT be affected.`
                      )
                    ) {
                      onResetCurrentCourse();
                    }
                  }}
                  className="px-4 py-2 rounded-full border border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-heading font-bold transition-all flex-shrink-0 cursor-pointer"
                >
                  Reset {courseMeta?.name || 'Track'}
                </button>
              </div>
            )}

            {/* 2. Reset All Tracks */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${onDeleteAccount ? 'pb-4 border-b border-[#E5E0D5] dark:border-[#383838]' : ''}`}>
              <div>
                <h3 className="text-sm font-heading font-bold text-red-600 dark:text-red-400">
                  Reset All Tracks
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">
                  Permanently clear checklist completions for all 3 courses and restart from Day 1 in the database and locally.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you ABSOLUTELY SURE you want to reset all 3 courses progress in the database and locally?'
                    )
                  ) {
                    onResetAll();
                  }
                }}
                className="px-4 py-2 rounded-full border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-heading font-bold transition-all flex-shrink-0 cursor-pointer"
              >
                Reset All Tracks
              </button>
            </div>

            {/* 3. Delete Account */}
            {onDeleteAccount && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-heading font-bold text-red-600 dark:text-red-500">
                    Delete Account
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">
                    Permanently delete your account, authentication credentials, progress, friendships, and ELO rating from the database.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        'WARNING: Are you ABSOLUTELY SURE you want to delete your account? All your account credentials, curriculum progress, friendships, and ELO rating will be permanently deleted from the database. This action cannot be undone.'
                      )
                    ) {
                      onDeleteAccount();
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-heading font-bold transition-all flex-shrink-0 cursor-pointer shadow-sm"
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

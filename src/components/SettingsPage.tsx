import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun, Download } from 'lucide-react';
import { AvatarIcon, AVATAR_OPTIONS } from './AvatarIcon';
import type { UserProfile } from '../hooks/useProfile';

interface SettingsPageProps {
  onBack: () => void;
  currentDay: number;
  profile: UserProfile;
  onUpdateName: (name: string) => void;
  onUpdateAvatar: (avatarId: string) => void;
  onResetToday: () => void;
  onResetAll: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onBack,
  currentDay,
  profile,
  onUpdateName,
  onUpdateAvatar,
  onResetToday,
  onResetAll,
  isDark,
  onToggleTheme,
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

  const handleExportData = () => {
    const backup: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('ad2_') || key.startsWith('placementOS_') || key.startsWith('rike_'))) {
        backup[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rikes_sheet_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
          PREFERENCES &amp; SETTINGS
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-6 sm:p-8 md:p-10 shadow-sm space-y-8 text-[#091424] dark:text-[#F3F3F0] transition-colors">
        {/* Title */}
        <div className="space-y-1 pb-2 border-b border-[#E5E0D5] dark:border-[#383838]">
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#091424] dark:text-white">
            Application Settings
          </h1>
          <p className="text-xs sm:text-sm font-body text-[#64748B] dark:text-[#9E9E96]">
            Configure your student identity, appearance, data persistence, and controls.
          </p>
        </div>

        {/* 1. Profile Customization */}
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

        {/* 2. Theme & Visual Style */}
        <div className="space-y-4">
          <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
            Theme &amp; Appearance
          </h2>

          <div className="p-6 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">
                Interface Theme
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#9E9E96] pt-0.5">
                Current mode: {isDark ? 'Dark Mode (#1f1f1f)' : 'Warm Cream Light Mode (#F5F2EB)'}
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] hover:opacity-90 text-xs font-heading font-bold transition-all shadow-sm cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 stroke-[2]" /> : <Moon className="w-4 h-4 stroke-[2]" />}
              <span>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>
        </div>

        {/* 3. Keyboard Shortcuts */}
        <div className="space-y-4">
          <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
            Keyboard Shortcuts
          </h2>

          <div className="p-6 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-3 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-body">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1f1f1f] border border-[#E5E0D5] dark:border-[#383838]">
                <span className="text-[#64748B] dark:text-[#9E9E96]">Next Day</span>
                <kbd className="px-2.5 py-1 rounded-md bg-[#FAF8F5] dark:bg-[#282828] border border-[#E5E0D5] dark:border-[#383838] font-mono font-bold text-[#091424] dark:text-white">&rarr;</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1f1f1f] border border-[#E5E0D5] dark:border-[#383838]">
                <span className="text-[#64748B] dark:text-[#9E9E96]">Previous Day</span>
                <kbd className="px-2.5 py-1 rounded-md bg-[#FAF8F5] dark:bg-[#282828] border border-[#E5E0D5] dark:border-[#383838] font-mono font-bold text-[#091424] dark:text-white">&larr;</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1f1f1f] border border-[#E5E0D5] dark:border-[#383838]">
                <span className="text-[#64748B] dark:text-[#9E9E96]">Open Day Picker</span>
                <kbd className="px-2.5 py-1 rounded-md bg-[#FAF8F5] dark:bg-[#282828] border border-[#E5E0D5] dark:border-[#383838] font-mono font-bold text-[#091424] dark:text-white">D</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#1f1f1f] border border-[#E5E0D5] dark:border-[#383838]">
                <span className="text-[#64748B] dark:text-[#9E9E96]">Jump to Active Day</span>
                <kbd className="px-2.5 py-1 rounded-md bg-[#FAF8F5] dark:bg-[#282828] border border-[#E5E0D5] dark:border-[#383838] font-mono font-bold text-[#091424] dark:text-white">T</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Data Backup & Reset Operations */}
        <div className="space-y-4">
          <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
            Data Management &amp; Safety
          </h2>

          <div className="p-6 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FCFBF8] dark:bg-[#222222] space-y-4 shadow-sm">
            {/* Export */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E0D5] dark:border-[#383838]">
              <div>
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">Backup Data</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Export your completed tasks, notes, streak, and attendance records as JSON.</p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-[#E5E0D5] dark:border-[#383838] bg-white dark:bg-[#1f1f1f] hover:border-[#091424] dark:hover:border-white text-xs font-heading font-bold text-[#091424] dark:text-white transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Backup</span>
              </button>
            </div>

            {/* Reset Today */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E0D5] dark:border-[#383838]">
              <div>
                <h3 className="text-sm font-heading font-bold text-[#091424] dark:text-white">Reset Day {currentDay} Checklist</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Uncheck all tasks for Day {currentDay}. Other days remain unaffected.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Uncheck all tasks for Day ${currentDay}?`)) {
                    onResetToday();
                  }
                }}
                className="px-4 py-2 rounded-full border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-heading font-bold transition-all flex-shrink-0 cursor-pointer"
              >
                Reset Day {currentDay}
              </button>
            </div>

            {/* Reset All */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-heading font-bold text-red-600 dark:text-red-400">Reset Entire Progress</h3>
                <p className="text-xs text-[#64748B] dark:text-[#9E9E96]">Permanently clear all 180-day checklist completions and restart from Day 1.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you ABSOLUTELY SURE you want to reset all curriculum checklist progress?')) {
                    onResetAll();
                  }
                }}
                className="px-4 py-2 rounded-full border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-heading font-bold transition-all flex-shrink-0 cursor-pointer"
              >
                Reset All Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

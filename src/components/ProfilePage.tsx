import React, { useState } from 'react';
import { ArrowLeft, Edit2, Check, Flame, Trophy, CalendarCheck } from 'lucide-react';
import { AttendanceHeatmap } from './AttendanceHeatmap';
import { AvatarIcon, AVATAR_OPTIONS } from './AvatarIcon';
import type { UserProfile } from '../hooks/useProfile';

interface ProfilePageProps {
  onBack: () => void;
  profile: UserProfile;
  onUpdateName: (name: string) => void;
  onUpdateAvatar: (avatarId: string) => void;
  currentStreak: number;
  longestStreak: number;
  attendedDates: string[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onBack,
  profile,
  onUpdateName,
  onUpdateAvatar,
  currentStreak,
  longestStreak,
  attendedDates,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="w-full max-w-5xl space-y-4 animate-fadeIn">
      {/* Top Header: "← Return to Workspace" (Left) and "PROFILE" (Right) */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs sm:text-sm font-heading font-semibold text-[#091424] dark:text-white hover:opacity-75 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Return to Workspace</span>
        </button>
        <span className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
          PROFILE
        </span>
      </div>

      {/* Main Card matching reference image exactly */}
      <div className="w-full rounded-3xl border border-[#E7E2D6] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#282828] p-6 sm:p-8 md:p-10 shadow-sm space-y-8 text-[#091424] dark:text-[#F3F3F0] transition-colors">
        {/* Identity & Main Streak Hero Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
          {/* Left: Avatar Circle + Name + Edit Pencil + Supporting line */}
          <div className="flex items-center space-x-5">
            {/* Avatar circle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                title="Change Profile Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#091424] dark:bg-[#141414] border border-transparent dark:border-white/10 text-white flex items-center justify-center p-4 hover:opacity-90 transition-all cursor-pointer shadow-md"
              >
                <AvatarIcon id={profile.avatarId} className="w-full h-full text-white" strokeWidth={1.4} />
              </button>
            </div>

            {/* Name and supporting subtitle */}
            <div className="space-y-1">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-white dark:bg-[#1f1f1f] border border-[#091424]/30 dark:border-white/20 rounded-lg px-3 py-1 text-2xl font-heading font-bold text-[#091424] dark:text-white focus:outline-none focus:border-[#091424] dark:focus:border-[#FCD34D]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-lg bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] hover:opacity-90"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center space-x-2.5">
                  <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[#091424] dark:text-white">
                    {profile.name}
                  </h1>
                  <button
                    onClick={() => {
                      setNameInput(profile.name);
                      setIsEditingName(true);
                    }}
                    className="p-1 text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white transition-colors"
                    title="Edit Name"
                  >
                    <Edit2 className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              )}

              <p className="text-xs sm:text-[13px] font-heading font-medium text-[#64748B] dark:text-[#9E9E96]">
                RIKE'S SHEET &bull; Personal Preparation Workspace
              </p>
            </div>
          </div>

          {/* Right Hero Card: Golden Drop/Flame + Big Streak count matching reference */}
          <div className="px-6 py-4 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#222222] flex items-center space-x-4 shadow-sm min-w-[170px]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FDE68A] to-[#F59E0B] shadow-[0_0_12px_rgba(251,191,36,0.6)] flex items-center justify-center text-white flex-shrink-0">
              <Flame className="w-5 h-5 fill-white/90 stroke-none" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-heading font-black text-[#091424] dark:text-white leading-none">
                {currentStreak}
              </span>
              <span className="text-xs font-heading font-medium text-[#64748B] dark:text-[#9E9E96] mt-0.5">
                Day Streak
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Avatar Selection Drawer (if toggled) */}
        {isAvatarPickerOpen && (
          <div className="p-4 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-white dark:bg-[#222222] space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-[#091424] dark:text-white">
                Select Profile Avatar
              </span>
              <button
                onClick={() => setIsAvatarPickerOpen(false)}
                className="text-xs font-body text-[#64748B] dark:text-[#9E9E96] hover:text-[#091424] dark:hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {AVATAR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onUpdateAvatar(opt.id);
                    setIsAvatarPickerOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    profile.avatarId === opt.id
                      ? 'border-[#091424] dark:border-[#FCD34D] bg-[#091424] dark:bg-[#FCD34D] text-white dark:text-[#091424] shadow-sm'
                      : 'border-[#E5E0D5] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#1f1f1f] text-[#091424] dark:text-white hover:border-[#091424]'
                  }`}
                >
                  <div className="w-8 h-8 mb-1.5">
                    <AvatarIcon id={opt.id} className="w-full h-full" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-heading font-medium">{opt.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ATTENDANCE SECTION: Heatmap Container */}
        <div className="p-6 sm:p-7 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#222222] shadow-sm">
          <AttendanceHeatmap attendedDates={attendedDates} />
        </div>

        {/* STREAK & CONSISTENCY: The 3 metric cards */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-heading font-bold uppercase tracking-widest text-[#091424] dark:text-white">
            STREAK &amp; CONSISTENCY
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: CURRENT STREAK */}
            <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#222222] flex items-center space-x-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FDE68A] flex items-center justify-center flex-shrink-0 text-[#091424]">
                <Flame className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                  CURRENT STREAK
                </span>
                <div className="text-xl sm:text-2xl font-heading font-black text-[#091424] dark:text-white flex items-baseline space-x-1.5">
                  <span>{currentStreak}</span>
                  <span className="text-xs font-heading font-normal text-[#64748B] dark:text-[#9E9E96]">days</span>
                </div>
                <p className="text-[11px] font-body text-[#64748B] dark:text-[#9E9E96] font-normal">
                  Consecutive daily entries
                </p>
              </div>
            </div>

            {/* Card 2: LONGEST STREAK */}
            <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#222222] flex items-center space-x-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FDE68A] flex items-center justify-center flex-shrink-0 text-[#091424]">
                <Trophy className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                  LONGEST STREAK
                </span>
                <div className="text-xl sm:text-2xl font-heading font-black text-[#091424] dark:text-white flex items-baseline space-x-1.5">
                  <span>{longestStreak}</span>
                  <span className="text-xs font-heading font-normal text-[#64748B] dark:text-[#9E9E96]">days</span>
                </div>
                <p className="text-[11px] font-body text-[#64748B] dark:text-[#9E9E96] font-normal">
                  Best consistency milestone
                </p>
              </div>
            </div>

            {/* Card 3: DAYS LOGGED */}
            <div className="p-5 rounded-2xl border border-[#E5E0D5] dark:border-[#383838] bg-[#FAF8F5] dark:bg-[#222222] flex items-center space-x-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FDE68A] flex items-center justify-center flex-shrink-0 text-[#091424]">
                <CalendarCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#64748B] dark:text-[#9E9E96]">
                  DAYS LOGGED
                </span>
                <div className="text-xl sm:text-2xl font-heading font-black text-[#091424] dark:text-white flex items-baseline space-x-1.5">
                  <span>{attendedDates.length || 1}</span>
                  <span className="text-xs font-heading font-normal text-[#64748B] dark:text-[#9E9E96]">days</span>
                </div>
                <p className="text-[11px] font-body text-[#64748B] dark:text-[#9E9E96] font-normal">
                  Total successful calendar sessions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Calendar, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import { AvatarIcon } from './AvatarIcon';

interface TopBarProps {
  currentDay: number;
  totalDays: number;
  currentStreak: number;
  avatarId: string;
  onOpenDayPicker: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  totalCompletedCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentDay,
  totalDays,
  currentStreak,
  avatarId,
  onOpenDayPicker,
  onOpenSettings,
  onOpenProfile,
  totalCompletedCount,
}) => {
  return (
    <header className="w-full pt-6 pb-4">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Brand with RIKE'S SHEET title */}
        <div className="flex items-center space-x-3">
          <span className="text-base sm:text-lg font-heading font-light tracking-tight text-app-main">
            RIKE'S <span className="font-normal">SHEET</span>
          </span>
        </div>

        {/* Right controls matching reference: [DAY 001 / 180 ▾] [Tasks: 0] [🔥 7] [Avatar] [Settings] */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Day Dropdown Button */}
          <button
            onClick={onOpenDayPicker}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-heading font-light text-app-main shadow-sm backdrop-blur-md"
            title="Jump to day (Press D)"
          >
            <Calendar className="w-3.5 h-3.5 text-app-dim" />
            <span className="tracking-wide">
              DAY {String(currentDay).padStart(3, '0')} / {totalDays}
            </span>
            <ChevronDown className="w-3 h-3 text-app-dim" />
          </button>

          {/* Tasks counter pill */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-heading text-app-sub shadow-sm backdrop-blur-md">
            <span className="font-light">Tasks:</span>
            <span className="text-app-main font-normal">{totalCompletedCount}</span>
          </div>

          {/* Streak indicator pill with subtle glowing flame */}
          <div
            title={`Current Streak: ${currentStreak} days`}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-heading font-light text-app-main shadow-sm backdrop-blur-md"
          >
            <span className="text-sm filter drop-shadow-[0_0_6px_rgba(244,216,117,0.8)]">🔥</span>
            <span>{currentStreak}</span>
          </div>

          {/* Vertical divider */}
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          {/* Profile Avatar button matching reference (circular emblem) */}
          <button
            onClick={onOpenProfile}
            title="Open Profile"
            aria-label="User Profile"
            className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:border-app-accent/60 flex items-center justify-center text-app-main hover:text-app-accent transition-all shadow-sm backdrop-blur-md p-1.5 group cursor-pointer"
          >
            <AvatarIcon id={avatarId} className="w-full h-full text-app-main group-hover:text-app-accent transition-colors" />
          </button>

          {/* Settings circular button */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 flex items-center justify-center text-app-dim hover:text-app-main transition-all shadow-sm backdrop-blur-md"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};

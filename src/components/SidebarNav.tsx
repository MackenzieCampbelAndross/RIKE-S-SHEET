import React from 'react';
import { Home, BookOpen, CheckSquare, BarChart2, Folder, User, Settings, LogOut } from 'lucide-react';

export type SidebarTab = 'home' | 'notes' | 'tasks' | 'progress' | 'resources' | 'profile' | 'settings';

interface SidebarNavProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  onLogout?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
}) => {
  return (
    <aside className="w-52 md:w-60 bg-[#091424] dark:bg-[#151515] text-white flex flex-col justify-between p-5 md:p-6 z-20 flex-shrink-0 min-h-screen select-none border-r border-transparent dark:border-white/5 transition-colors duration-200">
      {/* Top Branding */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-heading font-black tracking-wider text-white leading-tight uppercase">
              RIKE'S
            </span>
            <span className="text-base sm:text-lg font-heading font-black tracking-wider text-white leading-tight uppercase">
              SHEET
            </span>
          </div>
          {/* Subtle line under logo */}
          <div className="w-6 h-[1.5px] bg-white/20" />
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2 pt-1 font-heading text-xs tracking-wider">
          {/* HOME */}
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-lg transition-all text-left uppercase font-bold text-xs ${
              activeTab === 'home'
                ? 'bg-[#FCD34D] text-[#0D1B2A] shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-4 h-4 stroke-[2.2]" />
            <span>HOME</span>
          </button>

          {/* NOTES */}
          <button
            type="button"
            onClick={() => onSelectTab('notes')}
            className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-lg transition-all text-left uppercase font-bold text-xs ${
              activeTab === 'notes'
                ? 'bg-[#FCD34D] text-[#0D1B2A] shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4 stroke-[2]" />
            <span>NOTES</span>
          </button>

          {/* TASKS */}
          <button
            type="button"
            onClick={() => onSelectTab('tasks')}
            className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-lg transition-all text-left uppercase font-bold text-xs ${
              activeTab === 'tasks'
                ? 'bg-[#FCD34D] text-[#0D1B2A] shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckSquare className="w-4 h-4 stroke-[2]" />
            <span>TASKS</span>
          </button>

          {/* PROGRESS */}
          <button
            type="button"
            onClick={() => onSelectTab('progress')}
            className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-lg transition-all text-left uppercase font-bold text-xs ${
              activeTab === 'progress'
                ? 'bg-[#FCD34D] text-[#0D1B2A] shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart2 className="w-4 h-4 stroke-[2]" />
            <span>PROGRESS</span>
          </button>

          {/* RESOURCES */}
          <button
            type="button"
            onClick={() => onSelectTab('resources')}
            className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-lg transition-all text-left uppercase font-bold text-xs ${
              activeTab === 'resources'
                ? 'bg-[#FCD34D] text-[#0D1B2A] shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Folder className="w-4 h-4 stroke-[2]" />
            <span>RESOURCES</span>
          </button>
        </nav>
      </div>

      {/* Bottom Section: Divider + Profile + Settings + Log Out button */}
      <div className="space-y-3 pt-4">
        <div className="w-6 h-[1.5px] bg-white/20" />

        <div className="space-y-1.5 font-heading text-xs tracking-wider">
          {/* PROFILE Button */}
          <button
            type="button"
            onClick={() => onSelectTab('profile')}
            className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-lg transition-all text-left uppercase font-bold text-xs ${
              activeTab === 'profile'
                ? 'bg-[#FCD34D] text-[#0D1B2A] shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4 stroke-[2.2]" />
            <span>PROFILE</span>
          </button>

          {/* SETTINGS Button */}
          <button
            type="button"
            onClick={() => onSelectTab('settings')}
            className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-lg transition-all text-left uppercase font-bold text-xs ${
              activeTab === 'settings'
                ? 'bg-[#FCD34D] text-[#0D1B2A] shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4 stroke-[2]" />
            <span>SETTINGS</span>
          </button>
        </div>

        {/* LOG OUT Button (replaces bottom verse) */}
        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onLogout}
            title="Log out and return to landing page"
            className="w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-lg text-white/70 hover:text-red-400 hover:bg-white/5 transition-colors text-left uppercase font-heading font-medium text-xs tracking-wider group cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[2] group-hover:translate-x-0.5 transition-transform" />
            <span>LOG OUT</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <aside aria-label="Theme Switcher" className="fixed bottom-6 right-6 z-50">
      <button
        type="button"
        onClick={onToggle}
        aria-label={isDark ? 'Switch to default navy & yellow theme' : 'Switch to dark mode'}
        title={isDark ? 'Switch to Default Theme' : 'Switch to Dark Mode'}
        className="group flex items-center space-x-2 px-3.5 py-2 rounded-full border border-white/10 bg-[#0B1526]/80 hover:bg-[#0E1A2C] text-app-sub hover:text-app-main shadow-2xl backdrop-blur-md transition-all duration-200"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-app-main" />
        ) : (
          <Moon className="w-4 h-4 text-app-sub" />
        )}
        <span className="text-xs font-body font-medium">
          {isDark ? 'Light' : 'Dark mode'}
        </span>
      </button>
    </aside>
  );
};

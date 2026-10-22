import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, Command } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: number;
  onResetToday: () => void;
  onResetAll: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentDay,
  onResetToday,
  onResetAll,
  isDark,
  onToggleTheme,
}) => {
  const [confirmResetAll, setConfirmResetAll] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#0E1727]/95 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl p-6 overflow-hidden text-app-main"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 className="text-lg font-heading font-bold text-app-main">Settings</h2>
          <button
            onClick={() => {
              setConfirmResetAll(false);
              onClose();
            }}
            className="p-1.5 rounded-lg text-app-sub hover:text-app-main hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-6">
          {/* Theme Option in Settings */}
          <div>
            <div className="text-xs font-heading uppercase tracking-wider text-app-dim mb-2.5">
              Theme Appearance
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5">
              <div>
                <div className="text-xs font-heading font-medium text-app-main">
                  {isDark ? 'Dark Mode (Grayscale)' : 'Default (Atmospheric Navy & Butter Yellow)'}
                </div>
                <div className="text-[11px] font-body text-app-dim">
                  {isDark ? '6-color grayscale theme' : 'Atmospheric blue gradient'}
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleTheme}
                className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-heading text-app-main transition-colors"
              >
                Switch to {isDark ? 'Default' : 'Dark'}
              </button>
            </div>
          </div>

          {/* Shortcuts section */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-heading uppercase tracking-wider text-app-dim mb-3">
              <Command className="w-3.5 h-3.5" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="space-y-2 text-xs bg-black/30 p-3.5 rounded-xl border border-white/10 font-body">
              <div className="flex justify-between items-center text-app-sub">
                <span>Previous Day</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-heading text-[11px] text-app-main">← Left</kbd>
              </div>
              <div className="flex justify-between items-center text-app-sub">
                <span>Next Day</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-heading text-[11px] text-app-main">Right →</kbd>
              </div>
              <div className="flex justify-between items-center text-app-sub">
                <span>Open Day Picker</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-heading text-[11px] text-app-main">D</kbd>
              </div>
              <div className="flex justify-between items-center text-app-sub">
                <span>Jump to Today</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-heading text-[11px] text-app-main">T</kbd>
              </div>
              <div className="flex justify-between items-center text-app-sub">
                <span>Close Modals</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-heading text-[11px] text-app-main">ESC</kbd>
              </div>
            </div>
          </div>

          {/* Reset actions */}
          <div>
            <div className="text-xs font-heading uppercase tracking-wider text-app-dim mb-3">
              Manage Progress
            </div>
            <div className="space-y-2.5 font-body">
              <button
                type="button"
                onClick={() => {
                  onResetToday();
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left text-xs text-app-main"
              >
                <span>Reset Day {String(currentDay).padStart(3, '0')} checklist</span>
                <RotateCcw className="w-3.5 h-3.5 text-app-sub" />
              </button>

              {!confirmResetAll ? (
                <button
                  type="button"
                  onClick={() => setConfirmResetAll(true)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors text-left text-xs text-app-sub hover:text-app-main"
                >
                  <span>Reset all 180 days progress...</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-app-dim" />
                </button>
              ) : (
                <div className="p-3.5 rounded-xl border border-white/20 bg-black/40 space-y-3 font-body">
                  <p className="text-xs text-app-sub leading-relaxed">
                    Are you sure? This will permanently erase your checkmarks for all 180 days.
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        onResetAll();
                        setConfirmResetAll(false);
                        onClose();
                      }}
                      className="flex-1 py-1.5 px-3 rounded-full bg-app-accent text-app-accent-text text-xs font-heading font-bold transition-opacity hover:opacity-90"
                    >
                      Yes, reset all
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmResetAll(false)}
                      className="py-1.5 px-3 rounded-full border border-white/10 bg-white/5 text-xs font-body text-app-sub hover:text-app-main transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* System info */}
          <div className="pt-2 border-t border-white/10 text-[11px] font-heading text-app-dim flex justify-between">
            <span>Placement OS v1.0</span>
            <span>{isDark ? 'Dark Mode' : 'Default Navy & Blue Atmosphere'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

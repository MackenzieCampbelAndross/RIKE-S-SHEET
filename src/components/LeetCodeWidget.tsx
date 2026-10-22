import React, { useState } from 'react';
import { ExternalLink, RefreshCw, AlertCircle, CheckCircle2, Flame, Award, Code2 } from 'lucide-react';
import type { LeetCodeData } from '../hooks/useLeetCode';

interface LeetCodeWidgetProps {
  username: string;
  onUpdateUsername: (newUsername: string) => void;
  leetCodeData: LeetCodeData;
  onRefresh: () => void;
}

export const LeetCodeWidget: React.FC<LeetCodeWidgetProps> = ({
  username,
  onUpdateUsername,
  leetCodeData,
  onRefresh,
}) => {
  const [isEditing, setIsEditing] = useState(!username);
  const [inputVal, setInputVal] = useState(username || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onUpdateUsername(inputVal.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-app-accent stroke-[1.5]" />
          <span className="text-xs font-heading font-medium uppercase tracking-wider text-app-main">
            LeetCode Consistency
          </span>
          {leetCodeData.status === 'success' && (
            <span className="text-[10px] font-heading font-light px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-app-dim">
              Verified
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {username && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[11px] font-body text-app-dim hover:text-app-main transition-colors underline underline-offset-4 font-light"
            >
              {isEditing ? 'Cancel' : 'Change handle'}
            </button>
          )}

          {username && (
            <button
              onClick={onRefresh}
              disabled={leetCodeData.status === 'loading'}
              title="Refresh LeetCode data"
              className="p-1 rounded-md text-app-dim hover:text-app-main hover:bg-white/5 transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${leetCodeData.status === 'loading' ? 'animate-spin text-app-accent' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Username configuration form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
          <div className="space-y-1">
            <label htmlFor="leetcode-handle" className="text-xs font-heading font-normal text-app-sub">
              Enter your public LeetCode Username
            </label>
            <p className="text-[11px] font-body text-app-dim font-light">
              Your actual LeetCode submission history will be fetched directly without simulation.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="leetcode-handle"
              type="text"
              placeholder="e.g. neetcode, tourist"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-body text-app-main placeholder:text-app-dim focus:outline-none focus:border-app-accent/60 transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-app-accent text-app-accent-text text-xs font-heading font-medium hover:opacity-95 transition-opacity"
            >
              Connect
            </button>
          </div>
        </form>
      ) : !username ? (
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center space-y-2">
          <p className="text-xs font-body text-app-dim font-light">
            No LeetCode profile connected yet. Connect your handle to track verified problem counts and streaks.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-heading font-medium text-app-main hover:bg-white/10 transition-colors"
          >
            Connect LeetCode
          </button>
        </div>
      ) : (
        /* Connected LeetCode Card */
        <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-app-row/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-heading font-medium text-app-main">
                @{username}
              </span>
              <a
                href={`https://leetcode.com/u/${username}`}
                target="_blank"
                rel="noreferrer"
                className="text-app-dim hover:text-app-accent transition-colors"
                title="View on LeetCode"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <span className="text-[10px] font-heading font-light text-app-dim">
              Source: {leetCodeData.source}
            </span>
          </div>

          {/* Status states */}
          {leetCodeData.status === 'loading' ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-2 text-app-dim">
              <RefreshCw className="w-5 h-5 animate-spin text-app-accent stroke-[1.5]" />
              <span className="text-xs font-body font-light">Fetching verified statistics...</span>
            </div>
          ) : leetCodeData.status === 'error' ? (
            <div className="py-3 px-4 rounded-lg bg-white/5 border border-white/10 flex items-center space-x-2 text-xs font-body text-app-sub">
              <AlertCircle className="w-4 h-4 text-app-dim flex-shrink-0" />
              <span>{leetCodeData.errorMessage || 'User not found. Please verify the handle.'}</span>
            </div>
          ) : leetCodeData.status === 'unavailable' ? (
            <div className="py-3 px-4 rounded-lg bg-white/5 border border-white/10 flex items-center space-x-2 text-xs font-body text-app-sub">
              <AlertCircle className="w-4 h-4 text-app-dim flex-shrink-0" />
              <span>Data unavailable &bull; Unable to connect to public LeetCode endpoint at this time.</span>
            </div>
          ) : (
            /* Verified metrics grid */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {/* LeetCode Streak */}
              <div className="p-3 rounded-lg border border-white/10 bg-black/20 space-y-0.5">
                <div className="flex items-center space-x-1 text-app-dim text-[11px] font-heading font-light">
                  <Flame className="w-3 h-3 text-app-accent" />
                  <span>LC Streak</span>
                </div>
                <div className="text-lg font-heading font-normal text-app-accent">
                  {typeof leetCodeData.currentStreak === 'number' ? (
                    <>
                      {leetCodeData.currentStreak} <span className="text-[11px] font-body text-app-dim font-light">days</span>
                    </>
                  ) : (
                    <span className="text-xs font-body text-app-dim">Unavailable</span>
                  )}
                </div>
              </div>

              {/* Total Solved */}
              <div className="p-3 rounded-lg border border-white/10 bg-black/20 space-y-0.5">
                <div className="flex items-center space-x-1 text-app-dim text-[11px] font-heading font-light">
                  <Award className="w-3 h-3 text-app-sub" />
                  <span>Total Solved</span>
                </div>
                <div className="text-lg font-heading font-normal text-app-main">
                  {typeof leetCodeData.totalSolved === 'number' ? (
                    leetCodeData.totalSolved
                  ) : (
                    <span className="text-xs font-body text-app-dim">Unavailable</span>
                  )}
                </div>
              </div>

              {/* Active Days */}
              <div className="p-3 rounded-lg border border-white/10 bg-black/20 space-y-0.5">
                <div className="flex items-center space-x-1 text-app-dim text-[11px] font-heading font-light">
                  <CheckCircle2 className="w-3 h-3 text-app-sub" />
                  <span>Active Days</span>
                </div>
                <div className="text-lg font-heading font-normal text-app-main">
                  {typeof leetCodeData.activeDaysCount === 'number' ? (
                    leetCodeData.activeDaysCount
                  ) : (
                    <span className="text-xs font-body text-app-dim">Unavailable</span>
                  )}
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="p-3 rounded-lg border border-white/10 bg-black/20 space-y-1">
                <div className="text-app-dim text-[11px] font-heading font-light">
                  Breakdown
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-heading font-light text-app-sub">
                  <span title="Easy">E: {leetCodeData.easySolved ?? '-'}</span>
                  <span title="Medium">M: {leetCodeData.mediumSolved ?? '-'}</span>
                  <span title="Hard">H: {leetCodeData.hardSolved ?? '-'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

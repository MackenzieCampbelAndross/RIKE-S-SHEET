import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const ATTENDANCE_STORAGE_KEY = 'ad2_attendance_v2';

export interface AttendanceState {
  attendedDates: string[]; // Array of unique 'YYYY-MM-DD'
  longestStreak: number;
}

// Helper to get local date string YYYY-MM-DD with zero pad
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Compute consecutive calendar streaks deterministically
export function calculateStreaksFromDates(dates: string[]): { currentStreak: number; longestStreak: number } {
  if (!dates || dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dateSet = new Set(dates);
  const todayStr = getLocalDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  // 1. Current streak: consecutive days ending today (or yesterday if today not entered yet)
  let currentStreak = 0;
  let checkDate = new Date();

  // If today is attended, count backward starting today
  if (dateSet.has(todayStr)) {
    while (dateSet.has(getLocalDateString(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (dateSet.has(yesterdayStr)) {
    // If today is NOT attended yet, current active streak represents unbroken chain up to yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    while (dateSet.has(getLocalDateString(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else {
    // Missed yesterday and not attended today -> 0
    currentStreak = 0;
  }

  // 2. Longest streak: max consecutive sequence across all sorted unique dates
  const sortedDates = Array.from(dateSet).sort();
  let maxStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of sortedDates) {
    const parts = dStr.split('-').map(Number);
    const currentDate = new Date(parts[0], parts[1] - 1, parts[2]);

    if (!prevDate) {
      runningStreak = 1;
    } else {
      const diffMs = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        runningStreak++;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }
    }

    if (runningStreak > maxStreak) {
      maxStreak = runningStreak;
    }
    prevDate = currentDate;
  }

  return { currentStreak, longestStreak: maxStreak };
}

export function useAttendance(currentUser?: User | null) {
  const [attendance, setAttendance] = useState<AttendanceState>(() => {
    try {
      const saved = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.attendedDates)) {
          return {
            attendedDates: parsed.attendedDates,
            longestStreak: typeof parsed.longestStreak === 'number' ? parsed.longestStreak : 0,
          };
        }
      }
      // Migrate from v1 if present
      const v1 = localStorage.getItem('ad2_attendance_v1');
      if (v1) {
        const parsed = JSON.parse(v1);
        if (Array.isArray(parsed.attendedDates)) {
          const { longestStreak } = calculateStreaksFromDates(parsed.attendedDates);
          return {
            attendedDates: parsed.attendedDates,
            longestStreak,
          };
        }
      }
    } catch (e) {
      console.error('Failed to parse attendance state:', e);
    }
    return {
      attendedDates: [],
      longestStreak: 0,
    };
  });

  // Calculate streaks deterministically from attended dates
  const { currentStreak, longestStreak: computedLongest } = calculateStreaksFromDates(attendance.attendedDates);
  const activeLongestStreak = Math.max(attendance.longestStreak, computedLongest);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        ATTENDANCE_STORAGE_KEY,
        JSON.stringify({
          attendedDates: attendance.attendedDates,
          longestStreak: activeLongestStreak,
        })
      );
    } catch (e) {
      console.error('Failed to save attendance state:', e);
    }
  }, [attendance, activeLongestStreak]);

  // Sync with Supabase when authenticated
  useEffect(() => {
    if (!currentUser) return;
    let mounted = true;

    async function loadCloudAttendance() {
      try {
        const { data, error } = await supabase
          .from('attendance_records')
          .select('attended_date')
          .eq('user_id', currentUser!.id)
          .order('attended_date', { ascending: true });

        if (error) {
          console.error('Failed to fetch cloud attendance:', error);
          return;
        }

        if (mounted && data) {
          const cloudDates = data.map((r: { attended_date: string }) => r.attended_date);

          // If cloud has dates, merge them with local dates
          if (cloudDates.length > 0) {
            const merged = Array.from(new Set([...attendance.attendedDates, ...cloudDates])).sort();
            const { longestStreak } = calculateStreaksFromDates(merged);
            setAttendance({
              attendedDates: merged,
              longestStreak: Math.max(activeLongestStreak, longestStreak),
            });
          } else if (attendance.attendedDates.length > 0) {
            // If cloud is empty but local has dates, migrate local to cloud
            const rows = attendance.attendedDates.map((d) => ({
              user_id: currentUser!.id,
              attended_date: d,
            }));
            await supabase.from('attendance_records').upsert(rows, { onConflict: 'user_id,attended_date' });
            await supabase.from('user_streaks').upsert({
              user_id: currentUser!.id,
              current_streak: currentStreak,
              longest_streak: activeLongestStreak,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
          }
        }
      } catch (err) {
        console.error('Error syncing cloud attendance:', err);
      }
    }

    loadCloudAttendance();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  // ONLY triggered when ENTER is clicked on landing page
  const recordAttendanceOnEnter = useCallback(async () => {
    const todayStr = getLocalDateString();
    let updatedDates = attendance.attendedDates;

    if (!attendance.attendedDates.includes(todayStr)) {
      updatedDates = [...attendance.attendedDates, todayStr];
      const { currentStreak: newCurrent, longestStreak: newLongest } = calculateStreaksFromDates(updatedDates);
      const finalLongest = Math.max(activeLongestStreak, newLongest);

      setAttendance({
        attendedDates: updatedDates,
        longestStreak: finalLongest,
      });

      // Sync to Supabase if authenticated
      if (currentUser) {
        try {
          await supabase.from('attendance_records').insert({
            user_id: currentUser.id,
            attended_date: todayStr,
          });

          await supabase.from('user_streaks').upsert({
            user_id: currentUser.id,
            current_streak: newCurrent,
            longest_streak: finalLongest,
            last_attended_date: todayStr,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
        } catch (err) {
          console.error('Failed to record attendance to cloud:', err);
        }
      }
    }
  }, [attendance.attendedDates, activeLongestStreak, currentUser]);

  const hasAttendedToday = attendance.attendedDates.includes(getLocalDateString());

  return {
    attendedDates: attendance.attendedDates,
    currentStreak,
    longestStreak: activeLongestStreak,
    hasAttendedToday,
    recordAttendanceOnEnter,
  };
}

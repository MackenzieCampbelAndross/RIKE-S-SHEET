import { useState, useEffect, useCallback } from 'react';
import { getLocalDateString } from './useAttendance';

export interface LeetCodeData {
  username: string;
  totalSolved: number | null;
  easySolved: number | null;
  mediumSolved: number | null;
  hardSolved: number | null;
  currentStreak: number | null;
  activeDaysCount: number | null;
  submissionCalendar: Record<string, number> | null; // unix timestamp -> count
  status: 'idle' | 'loading' | 'success' | 'error' | 'unavailable';
  errorMessage?: string;
  source: string;
}

// Convert unix timestamps from LeetCode to local YYYY-MM-DD calendar dates and count consecutive active days
export function calculateLeetCodeStreak(submissionCalendar: Record<string, number>): { currentStreak: number; activeDaysCount: number } {
  if (!submissionCalendar || Object.keys(submissionCalendar).length === 0) {
    return { currentStreak: 0, activeDaysCount: 0 };
  }

  // Set of unique YYYY-MM-DD dates where submission count >= 1
  const activeDateSet = new Set<string>();

  for (const [timestampStr, count] of Object.entries(submissionCalendar)) {
    if (count > 0) {
      const tsNum = parseInt(timestampStr, 10);
      if (!isNaN(tsNum)) {
        // LeetCode timestamps are in seconds
        const date = new Date(tsNum * 1000);
        activeDateSet.add(getLocalDateString(date));
      }
    }
  }

  const activeDaysCount = activeDateSet.size;
  if (activeDaysCount === 0) {
    return { currentStreak: 0, activeDaysCount: 0 };
  }

  const todayStr = getLocalDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  let streak = 0;
  let checkDate = new Date();

  // If active today, count backward from today
  if (activeDateSet.has(todayStr)) {
    while (activeDateSet.has(getLocalDateString(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (activeDateSet.has(yesterdayStr)) {
    // If active yesterday (user hasn't submitted yet today), streak represents unbroken chain through yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    while (activeDateSet.has(getLocalDateString(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else {
    streak = 0;
  }

  return { currentStreak: streak, activeDaysCount };
}

export function useLeetCode(username: string) {
  const [data, setData] = useState<LeetCodeData>({
    username: username || '',
    totalSolved: null,
    easySolved: null,
    mediumSolved: null,
    hardSolved: null,
    currentStreak: null,
    activeDaysCount: null,
    submissionCalendar: null,
    status: 'idle',
    source: 'Public LeetCode API',
  });

  const fetchLeetCodeData = useCallback(async (user: string) => {
    if (!user || !user.trim()) {
      setData({
        username: '',
        totalSolved: null,
        easySolved: null,
        mediumSolved: null,
        hardSolved: null,
        currentStreak: null,
        activeDaysCount: null,
        submissionCalendar: null,
        status: 'idle',
        source: 'Public LeetCode API',
      });
      return;
    }

    setData((prev) => ({ ...prev, username: user, status: 'loading', errorMessage: undefined }));

    try {
      // Use verified public open-source LeetCode proxy endpoint
      // fallback to leetcode-stats-api or alfa-leetcode-api
      const endpoint = `https://leetcode-stats-api.herokuapp.com/${encodeURIComponent(user)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      if (json.status === 'error' || json.message === 'user does not exist') {
        setData({
          username: user,
          totalSolved: null,
          easySolved: null,
          mediumSolved: null,
          hardSolved: null,
          currentStreak: null,
          activeDaysCount: null,
          submissionCalendar: null,
          status: 'error',
          errorMessage: 'User not found on LeetCode',
          source: 'Public LeetCode API',
        });
        return;
      }

      // Calculate streak from submissionCalendar
      const subCal = json.submissionCalendar || {};
      const { currentStreak, activeDaysCount } = calculateLeetCodeStreak(subCal);

      setData({
        username: user,
        totalSolved: typeof json.totalSolved === 'number' ? json.totalSolved : null,
        easySolved: typeof json.easySolved === 'number' ? json.easySolved : null,
        mediumSolved: typeof json.mediumSolved === 'number' ? json.mediumSolved : null,
        hardSolved: typeof json.hardSolved === 'number' ? json.hardSolved : null,
        currentStreak,
        activeDaysCount,
        submissionCalendar: subCal,
        status: 'success',
        source: 'Verified LeetCode Profile',
      });
    } catch (err: any) {
      console.warn('LeetCode API unavailable:', err);
      setData((prev) => ({
        ...prev,
        username: user,
        totalSolved: null,
        easySolved: null,
        mediumSolved: null,
        hardSolved: null,
        currentStreak: null,
        activeDaysCount: null,
        submissionCalendar: null,
        status: 'unavailable',
        errorMessage: 'Data unavailable (could not connect to LeetCode service)',
        source: 'Public LeetCode API',
      }));
    }
  }, []);

  useEffect(() => {
    if (username) {
      fetchLeetCodeData(username);
    } else {
      setData((prev) => ({ ...prev, status: 'idle', username: '' }));
    }
  }, [username, fetchLeetCodeData]);

  return {
    leetCodeData: data,
    refreshLeetCode: () => fetchLeetCodeData(username),
  };
}

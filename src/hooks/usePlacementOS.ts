import { useState, useEffect, useCallback } from 'react';
import type { AppProgress } from '../types/curriculum';

const STORAGE_KEY = 'placementOS_v1';

const defaultProgress: AppProgress = {
  currentDay: 1,
  completedTasks: {},
};

export function usePlacementOS() {
  const [progress, setProgress] = useState<AppProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.currentDay === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
    }
    return defaultProgress;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [progress]);

  const toggleTask = useCallback((dayNumber: number, taskId: string) => {
    setProgress((prev) => {
      const dayTasks = { ...(prev.completedTasks[dayNumber] || {}) };
      dayTasks[taskId] = !dayTasks[taskId];
      return {
        ...prev,
        completedTasks: {
          ...prev.completedTasks,
          [dayNumber]: dayTasks,
        },
      };
    });
  }, []);

  const setCurrentDay = useCallback((day: number) => {
    const clamped = Math.max(1, Math.min(180, day));
    setProgress((prev) => ({
      ...prev,
      currentDay: clamped,
    }));
  }, []);

  const resetToday = useCallback((dayNumber: number) => {
    setProgress((prev) => {
      const updated = { ...prev.completedTasks };
      delete updated[dayNumber];
      return {
        ...prev,
        completedTasks: updated,
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    setProgress({
      currentDay: 1,
      completedTasks: {},
    });
  }, []);

  const isTaskCompleted = useCallback(
    (dayNumber: number, taskId: string) => {
      return Boolean(progress.completedTasks[dayNumber]?.[taskId]);
    },
    [progress.completedTasks]
  );

  const getDayCompletedCount = useCallback(
    (dayNumber: number) => {
      const dayMap = progress.completedTasks[dayNumber];
      if (!dayMap) return 0;
      return Object.values(dayMap).filter(Boolean).length;
    },
    [progress.completedTasks]
  );

  const isDayFullyCompleted = useCallback(
    (dayNumber: number, totalDayTasks: number) => {
      if (totalDayTasks <= 0) return false;
      return getDayCompletedCount(dayNumber) >= totalDayTasks;
    },
    [getDayCompletedCount]
  );

  const totalCompletedTasksCount = Object.values(progress.completedTasks).reduce((acc, curr) => {
    return acc + Object.values(curr).filter(Boolean).length;
  }, 0);

  return {
    currentDay: progress.currentDay,
    completedTasks: progress.completedTasks,
    setCurrentDay,
    toggleTask,
    resetToday,
    resetAll,
    isTaskCompleted,
    getDayCompletedCount,
    isDayFullyCompleted,
    totalCompletedTasksCount,
  };
}

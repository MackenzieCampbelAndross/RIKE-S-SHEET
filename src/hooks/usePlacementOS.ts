import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import type {
  CourseId,
  CourseProgress,
  MultiCourseStorage,
  CourseStats,
  DayPlan,
} from '../types/curriculum';
import { COURSES, COURSE_LIST, CURRICULA, TOTAL_DAYS } from '../data/curriculum';
import { supabase } from '../lib/supabase';
import { getTaskDifficulty } from '../lib/scoring';

const MULTI_STORAGE_KEY = 'placementOS_multi_v1';
const LEGACY_STORAGE_KEY = 'placementOS_v1';

const defaultCourseProgress = (): CourseProgress => ({
  currentDay: 1,
  completedTasks: {},
});

const defaultStorageState: MultiCourseStorage = {
  selectedCourseId: 'cpp-heavy',
  courses: {
    'cpp-heavy': defaultCourseProgress(),
    'java-heavy': defaultCourseProgress(),
    'python': defaultCourseProgress(),
  },
};

function loadAndMigrateStorage(): MultiCourseStorage {
  try {
    // 1. Check if multi-course storage exists
    const savedMulti = localStorage.getItem(MULTI_STORAGE_KEY);
    if (savedMulti) {
      const parsed = JSON.parse(savedMulti);
      if (parsed && typeof parsed === 'object') {
        const selectedCourseId: CourseId =
          parsed.selectedCourseId in COURSES ? parsed.selectedCourseId : 'cpp-heavy';

        const courses: Record<CourseId, CourseProgress> = {
          'cpp-heavy': {
            currentDay: Math.max(1, Math.min(TOTAL_DAYS, parsed.courses?.['cpp-heavy']?.currentDay || 1)),
            completedTasks: parsed.courses?.['cpp-heavy']?.completedTasks || {},
          },
          'java-heavy': {
            currentDay: Math.max(1, Math.min(TOTAL_DAYS, parsed.courses?.['java-heavy']?.currentDay || 1)),
            completedTasks: parsed.courses?.['java-heavy']?.completedTasks || {},
          },
          'python': {
            currentDay: Math.max(1, Math.min(TOTAL_DAYS, parsed.courses?.['python']?.currentDay || 1)),
            completedTasks: parsed.courses?.['python']?.completedTasks || {},
          },
        };

        return { selectedCourseId, courses };
      }
    }

    // 2. Migration: Check if legacy single-course C++ data exists
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsedLegacy = JSON.parse(legacy);
      if (parsedLegacy && typeof parsedLegacy === 'object') {
        const legacyDay =
          typeof parsedLegacy.currentDay === 'number'
            ? Math.max(1, Math.min(TOTAL_DAYS, parsedLegacy.currentDay))
            : 1;
        const legacyCompleted =
          parsedLegacy.completedTasks && typeof parsedLegacy.completedTasks === 'object'
            ? parsedLegacy.completedTasks
            : {};

        const migrated: MultiCourseStorage = {
          selectedCourseId: 'cpp-heavy',
          courses: {
            'cpp-heavy': {
              currentDay: legacyDay,
              completedTasks: legacyCompleted,
            },
            'java-heavy': defaultCourseProgress(),
            'python': defaultCourseProgress(),
          },
        };

        localStorage.setItem(MULTI_STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch (e) {
    console.error('Failed to load or migrate placement storage:', e);
  }

  return defaultStorageState;
}

function saveToLocalStorage(data: MultiCourseStorage): void {
  try {
    localStorage.setItem(MULTI_STORAGE_KEY, JSON.stringify(data));
    const cppState = data.courses['cpp-heavy'];
    if (cppState) {
      localStorage.setItem(
        LEGACY_STORAGE_KEY,
        JSON.stringify({
          currentDay: cppState.currentDay,
          completedTasks: cppState.completedTasks,
        })
      );
    }
  } catch (e) {
    console.error('Failed to save placement storage:', e);
  }
}

export function usePlacementOS(
  currentUser?: User | null,
  onRatingUpdated?: (newRating: number) => void
) {
  const [state, setState] = useState<MultiCourseStorage>(() => loadAndMigrateStorage());

  // Keep localStorage continuously synced whenever state changes
  useEffect(() => {
    saveToLocalStorage(state);
  }, [state]);

  // Track the synced user ID and sync lock to prevent race conditions or re-sync loops
  const syncedUserIdRef = useRef<string | null>(null);
  const isSyncingRef = useRef<boolean>(false);

  // Synchronize with Supabase Cloud safely when authenticated
  useEffect(() => {
    if (!currentUser) {
      syncedUserIdRef.current = null;
      return;
    }

    let mounted = true;

    async function syncCloudProgress() {
      if (!currentUser || isSyncingRef.current) return;
      isSyncingRef.current = true;

      try {
        // 1. Fetch course progress (current day for each course)
        const { data: progressData, error: progressErr } = await supabase
          .from('course_progress')
          .select('course_id, current_day')
          .eq('user_id', currentUser.id);

        if (progressErr) {
          console.error('Error fetching cloud course progress (sync aborted to protect local progress):', progressErr);
          return;
        }

        // 2. Fetch completed tasks
        const { data: tasksData, error: tasksErr } = await supabase
          .from('completed_tasks')
          .select('course_id, day_number, task_id')
          .eq('user_id', currentUser.id);

        if (tasksErr) {
          console.error('Error fetching cloud completed tasks (sync aborted to protect local progress):', tasksErr);
          return;
        }

        if (!mounted) return;

        // Map cloud progress by course
        const cloudCourseMap: Record<CourseId, { currentDay: number; completedTasks: Record<number, Record<string, boolean>> }> = {
          'cpp-heavy': { currentDay: 1, completedTasks: {} },
          'java-heavy': { currentDay: 1, completedTasks: {} },
          'python': { currentDay: 1, completedTasks: {} },
        };

        (progressData || []).forEach((p: { course_id: CourseId; current_day: number }) => {
          if (cloudCourseMap[p.course_id]) {
            cloudCourseMap[p.course_id].currentDay = Math.max(1, Math.min(TOTAL_DAYS, p.current_day));
          }
        });

        (tasksData || []).forEach((t: { course_id: CourseId; day_number: number; task_id: string }) => {
          if (cloudCourseMap[t.course_id]) {
            if (!cloudCourseMap[t.course_id].completedTasks[t.day_number]) {
              cloudCourseMap[t.course_id].completedTasks[t.day_number] = {};
            }
            cloudCourseMap[t.course_id].completedTasks[t.day_number][t.task_id] = true;
          }
        });

        const missingInCloud: Array<{
          courseId: CourseId;
          dayNumber: number;
          taskId: string;
        }> = [];

        // Reconcile state non-destructively: UNION of local and cloud tasks
        setState((prev) => {
          const courseIds: CourseId[] = ['cpp-heavy', 'java-heavy', 'python'];
          const reconciledCourses: Record<CourseId, CourseProgress> = {
            'cpp-heavy': defaultCourseProgress(),
            'java-heavy': defaultCourseProgress(),
            'python': defaultCourseProgress(),
          };

          for (const cId of courseIds) {
            const localProg = prev.courses[cId] || defaultCourseProgress();
            const cloudProg = cloudCourseMap[cId];

            // Reconcile current day: take highest day achieved
            const effectiveDay = Math.max(localProg.currentDay || 1, cloudProg.currentDay || 1);

            // Reconcile completed tasks: Merge local and cloud
            const mergedTasksMap: Record<number, Record<string, boolean>> = {};

            // 1. Copy over local completed tasks
            for (const [dayStr, tMap] of Object.entries(localProg.completedTasks || {})) {
              const dNum = parseInt(dayStr, 10);
              if (!mergedTasksMap[dNum]) mergedTasksMap[dNum] = {};
              for (const [tId, val] of Object.entries(tMap)) {
                if (val) {
                  mergedTasksMap[dNum][tId] = true;
                }
              }
            }

            // 2. Add cloud completed tasks
            for (const [dNum, tMap] of Object.entries(cloudProg.completedTasks)) {
              const dayInt = Number(dNum);
              if (!mergedTasksMap[dayInt]) mergedTasksMap[dayInt] = {};
              for (const [tId, val] of Object.entries(tMap)) {
                if (val) {
                  mergedTasksMap[dayInt][tId] = true;
                }
              }
            }

            reconciledCourses[cId] = {
              currentDay: effectiveDay,
              completedTasks: mergedTasksMap,
            };

            // Detect any tasks completed locally that cloud doesn't have yet
            for (const [dayStr, tMap] of Object.entries(localProg.completedTasks || {})) {
              const dNum = parseInt(dayStr, 10);
              for (const [tId, val] of Object.entries(tMap)) {
                if (val && !cloudProg.completedTasks[dNum]?.[tId]) {
                  missingInCloud.push({ courseId: cId, dayNumber: dNum, taskId: tId });
                }
              }
            }
          }

          const nextState: MultiCourseStorage = {
            selectedCourseId: prev.selectedCourseId in COURSES ? prev.selectedCourseId : 'cpp-heavy',
            courses: reconciledCourses,
          };

          // Immediately persist merged state to localStorage
          saveToLocalStorage(nextState);

          return nextState;
        });

        // 3. Upload missing local tasks to Supabase
        if (missingInCloud.length > 0) {
          for (const item of missingInCloud) {
            try {
              const curriculum = CURRICULA[item.courseId];
              const dayPlan = curriculum.find((d) => d.dayNumber === item.dayNumber);
              const taskObj = dayPlan?.tasks.find((t) => t.id === item.taskId);
              const totalDayTasks = dayPlan?.tasks.length || 0;
              const difficulty = taskObj ? getTaskDifficulty(taskObj, item.dayNumber) : 'EASY';

              await supabase.rpc('record_task_completion_rpc', {
                p_course_id: item.courseId,
                p_day_number: item.dayNumber,
                p_task_id: item.taskId,
                p_difficulty: difficulty,
                p_total_day_tasks: totalDayTasks,
              });
            } catch (rpcErr) {
              console.warn('Background sync upload failed for task:', item, rpcErr);
            }
          }
        }

        // 4. Update cloud current_day if local was ahead
        const courseIds: CourseId[] = ['cpp-heavy', 'java-heavy', 'python'];
        for (const cId of courseIds) {
          const cloudDay = cloudCourseMap[cId]?.currentDay || 1;
          const localDay = state.courses[cId]?.currentDay || 1;
          if (localDay > cloudDay) {
            await supabase.from('course_progress').upsert({
              user_id: currentUser.id,
              course_id: cId,
              current_day: localDay,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id,course_id' });
          }
        }

        syncedUserIdRef.current = currentUser.id;
      } catch (err) {
        console.error('Cloud sync failure:', err);
      } finally {
        isSyncingRef.current = false;
      }
    }

    syncCloudProgress();

    return () => {
      mounted = false;
    };
  }, [currentUser?.id]);

  const selectedCourseId = state.selectedCourseId;
  const activeCourseProgress = state.courses[selectedCourseId] || defaultCourseProgress();
  const currentCurriculum: DayPlan[] = CURRICULA[selectedCourseId] || CURRICULA['cpp-heavy'];
  const currentCourseMeta = COURSES[selectedCourseId] || COURSES['cpp-heavy'];

  // Switch course
  const selectCourse = useCallback((courseId: CourseId) => {
    if (!COURSES[courseId]) return;
    setState((prev) => {
      const next = {
        ...prev,
        selectedCourseId: courseId,
      };
      saveToLocalStorage(next);
      return next;
    });
  }, []);

  // Update current day for active course
  const setCurrentDay = useCallback((day: number) => {
    const clamped = Math.max(1, Math.min(TOTAL_DAYS, day));
    let activeCourse: CourseId = 'cpp-heavy';

    setState((prev) => {
      activeCourse = prev.selectedCourseId;
      const next = {
        ...prev,
        courses: {
          ...prev.courses,
          [activeCourse]: {
            ...prev.courses[activeCourse],
            currentDay: clamped,
          },
        },
      };
      saveToLocalStorage(next);
      return next;
    });

    if (currentUser) {
      supabase.from('course_progress').upsert({
        user_id: currentUser.id,
        course_id: activeCourse,
        current_day: clamped,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' }).then(({ error }) => {
        if (error) console.error('Failed to sync current day:', error);
      });
    }
  }, [currentUser]);

  // Toggle a task with synchronous localStorage persistence and authoritative server-side RPC
  const toggleTask = useCallback(async (dayNumber: number, taskId: string) => {
    let willBeCompleted = false;
    let targetCourse: CourseId = 'cpp-heavy';

    // 1. Instant Synchronous Local Update & Persistence
    setState((prev) => {
      targetCourse = prev.selectedCourseId;
      const cData = prev.courses[targetCourse] || defaultCourseProgress();
      const currentTasksForDay = cData.completedTasks[dayNumber] || {};
      const isCurrentlyCompleted = Boolean(currentTasksForDay[taskId]);
      willBeCompleted = !isCurrentlyCompleted;

      const newDayTasks = { ...currentTasksForDay };
      if (willBeCompleted) {
        newDayTasks[taskId] = true;
      } else {
        delete newDayTasks[taskId];
      }

      const nextState: MultiCourseStorage = {
        ...prev,
        courses: {
          ...prev.courses,
          [targetCourse]: {
            ...cData,
            completedTasks: {
              ...cData.completedTasks,
              [dayNumber]: newDayTasks,
            },
          },
        },
      };

      // Write immediately to localStorage
      saveToLocalStorage(nextState);

      return nextState;
    });

    // 2. Authoritative Supabase Cloud Operation
    if (currentUser) {
      try {
        const curriculum = CURRICULA[targetCourse];
        const dayPlan = curriculum.find((d) => d.dayNumber === dayNumber);
        const taskObj = dayPlan?.tasks.find((t) => t.id === taskId);
        const totalDayTasks = dayPlan?.tasks.length || 0;
        const difficulty = taskObj ? getTaskDifficulty(taskObj, dayNumber) : 'EASY';

        if (willBeCompleted) {
          const { error } = await supabase.rpc('record_task_completion_rpc', {
            p_course_id: targetCourse,
            p_day_number: dayNumber,
            p_task_id: taskId,
            p_difficulty: difficulty,
            p_total_day_tasks: totalDayTasks,
          });

          if (error) {
            console.error('Error recording task completion in cloud:', error);
          }
        } else {
          const { error } = await supabase.rpc('revoke_task_completion_rpc', {
            p_course_id: targetCourse,
            p_day_number: dayNumber,
            p_task_id: taskId,
          });

          if (error) {
            console.error('Error revoking task completion in cloud:', error);
          }
        }
      } catch (err) {
        console.error('Failed to sync task toggle to cloud:', err);
      }
    }
  }, [currentUser]);

  // Reset tasks for a specific day in the active course
  const resetToday = useCallback((dayNumber: number) => {
    let activeCourse: CourseId = 'cpp-heavy';

    setState((prev) => {
      activeCourse = prev.selectedCourseId;
      const currentCourseData = prev.courses[activeCourse];
      const updated = { ...currentCourseData.completedTasks };
      delete updated[dayNumber];

      const next = {
        ...prev,
        courses: {
          ...prev.courses,
          [activeCourse]: {
            ...currentCourseData,
            completedTasks: updated,
          },
        },
      };

      saveToLocalStorage(next);
      return next;
    });

    if (currentUser) {
      supabase
        .from('completed_tasks')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('course_id', activeCourse)
        .eq('day_number', dayNumber)
        .then(({ error }) => {
          if (error) console.error('Failed to reset day tasks in cloud:', error);
        });
    }
  }, [currentUser]);

  // Reset all tasks in the active course
  const resetCurrentCourse = useCallback(async () => {
    let activeCourse: CourseId = 'cpp-heavy';

    setState((prev) => {
      activeCourse = prev.selectedCourseId;
      const next = {
        ...prev,
        courses: {
          ...prev.courses,
          [activeCourse]: defaultCourseProgress(),
        },
      };
      saveToLocalStorage(next);
      return next;
    });

    if (currentUser) {
      try {
        const { data, error } = await supabase.rpc('reset_course_progress_rpc', {
          p_course_id: activeCourse,
        });
        if (error) {
          console.error('Error resetting course in cloud:', error);
        } else if (data?.eloRating && onRatingUpdated) {
          onRatingUpdated(data.eloRating);
        }
      } catch (err) {
        console.error('Failed to reset course in cloud:', err);
      }
    }
  }, [currentUser, onRatingUpdated]);

  // Reset all courses completely
  const resetAll = useCallback(async () => {
    const next: MultiCourseStorage = {
      selectedCourseId: 'cpp-heavy',
      courses: {
        'cpp-heavy': defaultCourseProgress(),
        'java-heavy': defaultCourseProgress(),
        'python': defaultCourseProgress(),
      },
    };

    setState(next);
    saveToLocalStorage(next);

    if (currentUser) {
      try {
        const { data, error } = await supabase.rpc('reset_all_tracks_rpc');
        if (error) {
          console.error('Error resetting all tracks in cloud:', error);
        } else if (data?.eloRating && onRatingUpdated) {
          onRatingUpdated(data.eloRating);
        }
      } catch (err) {
        console.error('Failed to reset all tracks in cloud:', err);
      }
    }
  }, [currentUser, onRatingUpdated]);

  // Check if a task is completed in active course
  const isTaskCompleted = useCallback(
    (dayNumber: number, taskId: string) => {
      return Boolean(activeCourseProgress.completedTasks[dayNumber]?.[taskId]);
    },
    [activeCourseProgress.completedTasks]
  );

  // Count completed tasks for a day in active course
  const getDayCompletedCount = useCallback(
    (dayNumber: number) => {
      const dayMap = activeCourseProgress.completedTasks[dayNumber];
      if (!dayMap) return 0;
      return Object.values(dayMap).filter(Boolean).length;
    },
    [activeCourseProgress.completedTasks]
  );

  // Check if day is fully completed in active course
  const isDayFullyCompleted = useCallback(
    (dayNumber: number, totalDayTasks: number) => {
      if (totalDayTasks <= 0) return false;
      const count = getDayCompletedCount(dayNumber);
      return count >= totalDayTasks;
    },
    [getDayCompletedCount]
  );

  // Total completed tasks across active course
  const totalCompletedTasksCount = useMemo(() => {
    let total = 0;
    for (const dayTasks of Object.values(activeCourseProgress.completedTasks)) {
      if (dayTasks) {
        total += Object.values(dayTasks).filter(Boolean).length;
      }
    }
    return total;
  }, [activeCourseProgress.completedTasks]);

  // Statistics for all 3 courses
  const allCourseStats: CourseStats[] = useMemo(() => {
    return COURSE_LIST.map((meta) => {
      const courseId = meta.id;
      const cProg = state.courses[courseId] || defaultCourseProgress();
      const curriculum = CURRICULA[courseId];

      const totalTasksCount = curriculum.reduce((acc, day) => acc + day.tasks.length, 0);

      let completedCount = 0;
      for (const dayTasks of Object.values(cProg.completedTasks)) {
        if (dayTasks) {
          completedCount += Object.values(dayTasks).filter(Boolean).length;
        }
      }

      const percentage =
        totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

      let status: 'Not started' | 'In progress' | 'Completed' = 'Not started';
      if (completedCount >= totalTasksCount && totalTasksCount > 0) {
        status = 'Completed';
      } else if (completedCount > 0 || cProg.currentDay > 1) {
        status = 'In progress';
      }

      return {
        id: courseId,
        name: meta.name,
        description: meta.description,
        tag: meta.tag,
        currentDay: cProg.currentDay,
        completedTasksCount: completedCount,
        totalTasksCount,
        percentage,
        status,
      };
    });
  }, [state.courses]);

  return {
    selectedCourseId,
    selectCourse,
    currentCourseMeta,
    currentCurriculum,
    currentDay: activeCourseProgress.currentDay,
    setCurrentDay,
    toggleTask,
    resetToday,
    resetCurrentCourse,
    resetAll,
    isTaskCompleted,
    getDayCompletedCount,
    isDayFullyCompleted,
    totalCompletedTasksCount,
    allCourseStats,
  };
}

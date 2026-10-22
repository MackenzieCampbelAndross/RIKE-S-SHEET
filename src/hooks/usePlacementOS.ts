import { useState, useEffect, useCallback, useMemo } from 'react';
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

export function usePlacementOS(
  currentUser?: User | null,
  onRatingUpdated?: (newRating: number) => void
) {
  const [state, setState] = useState<MultiCourseStorage>(() => loadAndMigrateStorage());

  // Save changes to localStorage (both multi-course and synced legacy C++ fallback)
  useEffect(() => {
    try {
      localStorage.setItem(MULTI_STORAGE_KEY, JSON.stringify(state));

      // Keep legacy storage key synced for cpp-heavy for backwards compatibility
      const cppState = state.courses['cpp-heavy'];
      localStorage.setItem(
        LEGACY_STORAGE_KEY,
        JSON.stringify({
          currentDay: cppState.currentDay,
          completedTasks: cppState.completedTasks,
        })
      );
    } catch (e) {
      console.error('Failed to save placement storage:', e);
    }
  }, [state]);

  // Synchronize with Supabase Cloud when authenticated
  useEffect(() => {
    if (!currentUser) return;
    let mounted = true;

    async function syncCloudProgress() {
      try {
        // 1. Fetch course progress (current day for each course)
        const { data: progressData, error: progressErr } = await supabase
          .from('course_progress')
          .select('course_id, current_day')
          .eq('user_id', currentUser!.id);

        if (progressErr) console.error('Error fetching cloud course progress:', progressErr);

        // 2. Fetch completed tasks
        const { data: tasksData, error: tasksErr } = await supabase
          .from('completed_tasks')
          .select('course_id, day_number, task_id')
          .eq('user_id', currentUser!.id);

        if (tasksErr) console.error('Error fetching cloud completed tasks:', tasksErr);

        if (mounted) {
          const cloudHasTasks = tasksData && tasksData.length > 0;
          const cloudHasProgress = progressData && progressData.length > 0;

          if (cloudHasTasks || cloudHasProgress) {
            // Build synced state from cloud records
            const syncedCourses: Record<CourseId, CourseProgress> = {
              'cpp-heavy': defaultCourseProgress(),
              'java-heavy': defaultCourseProgress(),
              'python': defaultCourseProgress(),
            };

            // Apply days
            (progressData || []).forEach((p: { course_id: CourseId; current_day: number }) => {
              if (syncedCourses[p.course_id]) {
                syncedCourses[p.course_id].currentDay = p.current_day;
              }
            });

            // Apply completed tasks
            (tasksData || []).forEach((t: { course_id: CourseId; day_number: number; task_id: string }) => {
              if (syncedCourses[t.course_id]) {
                if (!syncedCourses[t.course_id].completedTasks[t.day_number]) {
                  syncedCourses[t.course_id].completedTasks[t.day_number] = {};
                }
                syncedCourses[t.course_id].completedTasks[t.day_number][t.task_id] = true;
              }
            });

            setState((prev) => ({
              ...prev,
              courses: syncedCourses,
            }));
          } else {
            // Cloud is empty for this user: Check if local storage has completed tasks to import
            const courseIds: CourseId[] = ['cpp-heavy', 'java-heavy', 'python'];
            for (const cId of courseIds) {
              const cProg = state.courses[cId];
              if (!cProg) continue;

              // Upsert course day
              if (cProg.currentDay > 1) {
                await supabase.from('course_progress').upsert({
                  user_id: currentUser!.id,
                  course_id: cId,
                  current_day: cProg.currentDay,
                  updated_at: new Date().toISOString(),
                }, { onConflict: 'user_id,course_id' });
              }

              // Idempotently sync local completed tasks
              const curriculum = CURRICULA[cId];
              for (const [dayNumStr, tasksMap] of Object.entries(cProg.completedTasks)) {
                const dayNum = parseInt(dayNumStr, 10);
                const dayPlan = curriculum.find((d) => d.dayNumber === dayNum);
                const totalDayTasks = dayPlan?.tasks.length || 0;

                for (const [taskId, isCompleted] of Object.entries(tasksMap)) {
                  if (isCompleted) {
                    const taskObj = dayPlan?.tasks.find((t) => t.id === taskId);
                    const difficulty = taskObj ? getTaskDifficulty(taskObj, dayNum) : 'EASY';

                    await supabase.rpc('record_task_completion_rpc', {
                      p_course_id: cId,
                      p_day_number: dayNum,
                      p_task_id: taskId,
                      p_difficulty: difficulty,
                      p_total_day_tasks: totalDayTasks,
                    });
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Cloud sync failure:', err);
      }
    }

    syncCloudProgress();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const selectedCourseId = state.selectedCourseId;
  const activeCourseProgress = state.courses[selectedCourseId] || defaultCourseProgress();
  const currentCurriculum: DayPlan[] = CURRICULA[selectedCourseId] || CURRICULA['cpp-heavy'];
  const currentCourseMeta = COURSES[selectedCourseId] || COURSES['cpp-heavy'];

  // Switch course
  const selectCourse = useCallback((courseId: CourseId) => {
    if (!COURSES[courseId]) return;
    setState((prev) => ({
      ...prev,
      selectedCourseId: courseId,
    }));
  }, []);

  // Update current day for active course
  const setCurrentDay = useCallback((day: number) => {
    const clamped = Math.max(1, Math.min(TOTAL_DAYS, day));
    setState((prev) => {
      const activeCourse = prev.selectedCourseId;
      return {
        ...prev,
        courses: {
          ...prev.courses,
          [activeCourse]: {
            ...prev.courses[activeCourse],
            currentDay: clamped,
          },
        },
      };
    });

    if (currentUser) {
      supabase.from('course_progress').upsert({
        user_id: currentUser.id,
        course_id: state.selectedCourseId,
        current_day: clamped,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,course_id' }).then(({ error }) => {
        if (error) console.error('Failed to sync current day:', error);
      });
    }
  }, [currentUser, state.selectedCourseId]);

  // Toggle a task in the currently active course with authoritative server-side rating calculation
  const toggleTask = useCallback(async (dayNumber: number, taskId: string) => {
    const activeCourse = state.selectedCourseId;
    const currentCourseData = state.courses[activeCourse];
    const isCurrentlyCompleted = Boolean(currentCourseData.completedTasks[dayNumber]?.[taskId]);
    const willBeCompleted = !isCurrentlyCompleted;

    // 1. Optimistic Local Update
    setState((prev) => {
      const cData = prev.courses[activeCourse];
      const dayTasks = { ...(cData.completedTasks[dayNumber] || {}) };
      dayTasks[taskId] = willBeCompleted;

      return {
        ...prev,
        courses: {
          ...prev.courses,
          [activeCourse]: {
            ...cData,
            completedTasks: {
              ...cData.completedTasks,
              [dayNumber]: dayTasks,
            },
          },
        },
      };
    });

    // 2. Authoritative Supabase Cloud Operation
    if (currentUser) {
      try {
        const curriculum = CURRICULA[activeCourse];
        const dayPlan = curriculum.find((d) => d.dayNumber === dayNumber);
        const taskObj = dayPlan?.tasks.find((t) => t.id === taskId);
        const totalDayTasks = dayPlan?.tasks.length || 0;
        const difficulty = taskObj ? getTaskDifficulty(taskObj, dayNumber) : 'EASY';

        if (willBeCompleted) {
          const { error } = await supabase.rpc('record_task_completion_rpc', {
            p_course_id: activeCourse,
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
            p_course_id: activeCourse,
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
  }, [state.selectedCourseId, state.courses, currentUser, onRatingUpdated]);

  // Reset tasks for a specific day in the active course
  const resetToday = useCallback((dayNumber: number) => {
    setState((prev) => {
      const activeCourse = prev.selectedCourseId;
      const currentCourseData = prev.courses[activeCourse];
      const updated = { ...currentCourseData.completedTasks };
      delete updated[dayNumber];

      return {
        ...prev,
        courses: {
          ...prev.courses,
          [activeCourse]: {
            ...currentCourseData,
            completedTasks: updated,
          },
        },
      };
    });
  }, []);

  // Reset all tasks in the active course
  const resetCurrentCourse = useCallback(async () => {
    const activeCourse = state.selectedCourseId;
    setState((prev) => {
      return {
        ...prev,
        courses: {
          ...prev.courses,
          [activeCourse]: defaultCourseProgress(),
        },
      };
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
  }, [state.selectedCourseId, currentUser, onRatingUpdated]);

  // Reset all courses completely
  const resetAll = useCallback(async () => {
    setState({
      selectedCourseId: 'cpp-heavy',
      courses: {
        'cpp-heavy': defaultCourseProgress(),
        'java-heavy': defaultCourseProgress(),
        'python': defaultCourseProgress(),
      },
    });

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

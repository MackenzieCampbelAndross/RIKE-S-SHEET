import type { Task } from '../types/curriculum';

export type TaskDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'ASSESSMENT';

/**
 * RIKE'S SHEET: Weekly ELO Rating Policy Constants
 */
export const WEEKLY_ELO_POLICY = {
  BASE_ELO: 1000,
  MAX_ELO: 3000,
  
  // Credits per task difficulty
  CREDITS: {
    EASY: 1,
    MEDIUM: 2,
    HARD: 4,
    ASSESSMENT: 4,
  },

  // Component weights
  WEIGHTS: {
    WORK: 0.40,
    TIME: 0.25,
    EFFICIENCY: 0.20,
    CONSISTENCY: 0.15,
  },

  // Normalization caps
  WORK_CREDIT_CAP: 30,
  SELF_REPORTED_CREDIT_CAP: 7.5, // 25% of 30 credits
  ACTIVE_MINUTES_CAP: 480,       // 8 hours
  PRODUCTIVE_DAYS_CAP: 5,        // 5 productive study days

  // Minimum Eligibility Requirements
  MIN_ACTIVE_MINUTES: 60,
  MIN_DISTINCT_TASKS: 3,
  MIN_PRODUCTIVE_DAYS: 2,
  MIN_DAY_ACTIVE_MINUTES: 15,    // 15 mins needed to count as a productive day

  // Neutral efficiency fallback
  NEUTRAL_EFFICIENCY: 0.5,
  MAX_RAW_GAIN_BASE: 50,
} as const;

/**
 * Legacy scoring constants for backwards compatibility
 */
export const SCORING_POLICY = {
  BASE_ELO: 1000,
  MAX_ELO: 3000,
  EASY_POINTS: 2,
  MEDIUM_POINTS: 4,
  HARD_POINTS: 7,
  DAY_COMPLETION_BONUS: 5,
  ASSESSMENT_POINTS: 15,
} as const;

/**
 * Determines task difficulty deterministically based on curriculum metadata,
 * phase, and keywords.
 */
export function getTaskDifficulty(task: Task, dayNumber: number): TaskDifficulty {
  if (task.category === 'ASSESSMENT') {
    return 'ASSESSMENT';
  }

  const titleLower = task.title.toLowerCase();

  if (
    titleLower.includes('assessment') ||
    titleLower.includes('mock interview') ||
    titleLower.includes('oa simulation')
  ) {
    return 'ASSESSMENT';
  }

  if (
    titleLower.includes('hard') ||
    titleLower.includes('advanced') ||
    dayNumber >= 90
  ) {
    return 'HARD';
  }

  if (
    titleLower.includes('medium') ||
    (dayNumber >= 31 && dayNumber < 90)
  ) {
    return 'MEDIUM';
  }

  return 'EASY';
}

/**
 * Difficulty Multiplier D:
 * D = ((3000 - R) / 2000) ^ 1.5
 * R is clamped between 1000 and 3000.
 */
export function calculateDifficultyMultiplier(rating: number): number {
  const R = Math.max(WEEKLY_ELO_POLICY.BASE_ELO, Math.min(WEEKLY_ELO_POLICY.MAX_ELO, rating));
  return Math.pow((WEEKLY_ELO_POLICY.MAX_ELO - R) / 2000.0, 1.5);
}

/**
 * Minimum Weekly Performance Threshold P_min:
 * x = (R - 1000) / 2000
 * P_min = 0.15 + 0.84 * (x ^ 2)
 */
export function calculateMinimumPerformanceThreshold(rating: number): number {
  const R = Math.max(WEEKLY_ELO_POLICY.BASE_ELO, Math.min(WEEKLY_ELO_POLICY.MAX_ELO, rating));
  const x = (R - WEEKLY_ELO_POLICY.BASE_ELO) / 2000.0;
  return 0.15 + 0.84 * Math.pow(x, 2);
}

/**
 * Component A: Difficulty weighted work score W in [0, 1]
 */
export function calculateWorkScore(
  distinctTasks: { difficulty: TaskDifficulty; isVerified: boolean }[]
): { workScore: number; verifiedCredits: number; selfCredits: number; totalCredits: number } {
  let verifiedCredits = 0;
  let selfCredits = 0;

  for (const t of distinctTasks) {
    const credits = WEEKLY_ELO_POLICY.CREDITS[t.difficulty] || 1;
    if (t.isVerified) {
      verifiedCredits += credits;
    } else {
      selfCredits += credits;
    }
  }

  const effectiveSelfCredits = Math.min(selfCredits, WEEKLY_ELO_POLICY.SELF_REPORTED_CREDIT_CAP);
  const totalCredits = Math.min(WEEKLY_ELO_POLICY.WORK_CREDIT_CAP, verifiedCredits + effectiveSelfCredits);
  const workScore = Math.min(1.0, totalCredits / WEEKLY_ELO_POLICY.WORK_CREDIT_CAP);

  return { workScore, verifiedCredits, selfCredits, totalCredits };
}

/**
 * Component B: Genuine active working time score T in [0, 1]
 */
export function calculateTimeScore(activeMinutes: number): number {
  const validMinutes = Math.max(0, activeMinutes);
  return Math.min(1.0, validMinutes / WEEKLY_ELO_POLICY.ACTIVE_MINUTES_CAP);
}

/**
 * Component C: Solving efficiency score E in [0, 1]
 * For each eligible task:
 * r = actual solving time / expected solving time
 * e = clamp(1.2 - 0.2 * r, 0.5, 1.1)
 * E_task = (e - 0.5) / 0.6
 * Returns weighted average or 0.5 when insufficient data.
 */
export function calculateEfficiencyScore(
  timedTasks: { activeSeconds: number; expectedSeconds: number; difficulty: TaskDifficulty }[]
): number {
  if (!timedTasks || timedTasks.length === 0) {
    return WEEKLY_ELO_POLICY.NEUTRAL_EFFICIENCY;
  }

  let weightedSum = 0;
  let weightSum = 0;

  for (const task of timedTasks) {
    if (task.activeSeconds > 0 && task.expectedSeconds > 0) {
      const weight = WEEKLY_ELO_POLICY.CREDITS[task.difficulty] || 1;
      const r = task.activeSeconds / task.expectedSeconds;
      const e = Math.max(0.5, Math.min(1.1, 1.2 - 0.2 * r));
      const eTask = (e - 0.5) / 0.6;

      weightedSum += eTask * weight;
      weightSum += weight;
    }
  }

  if (weightSum === 0) {
    return WEEKLY_ELO_POLICY.NEUTRAL_EFFICIENCY;
  }

  return Math.max(0.0, Math.min(1.0, weightedSum / weightSum));
}

/**
 * Component D: Weekly consistency score C in [0, 1]
 * Productive day: >= 15 active minutes AND >= 1 completed task on that calendar day
 */
export function calculateConsistencyScore(productiveDaysCount: number): number {
  const validDays = Math.max(0, productiveDaysCount);
  return Math.min(1.0, validDays / WEEKLY_ELO_POLICY.PRODUCTIVE_DAYS_CAP);
}

/**
 * Combined Weekly Performance Score P in [0, 1]
 * P = 0.40 * W + 0.25 * T + 0.20 * E + 0.15 * C
 */
export function calculateCombinedPerformance(components: {
  workScore: number;
  timeScore: number;
  efficiencyScore: number;
  consistencyScore: number;
}): number {
  const P =
    WEEKLY_ELO_POLICY.WEIGHTS.WORK * components.workScore +
    WEEKLY_ELO_POLICY.WEIGHTS.TIME * components.timeScore +
    WEEKLY_ELO_POLICY.WEIGHTS.EFFICIENCY * components.efficiencyScore +
    WEEKLY_ELO_POLICY.WEIGHTS.CONSISTENCY * components.consistencyScore;

  return Math.max(0.0, Math.min(1.0, P));
}

/**
 * Final Weekly Rating Gain Calculation
 */
export function calculateWeeklyRatingGain(params: {
  rating: number;
  performanceScore: number;
  activeMinutes: number;
  distinctTasksCount: number;
  productiveDays: number;
}): {
  gain: number;
  newRating: number;
  isEligible: boolean;
  pMin: number;
  difficultyMultiplier: number;
  ineligibilityReason?: string;
} {
  const R = Math.max(WEEKLY_ELO_POLICY.BASE_ELO, Math.min(WEEKLY_ELO_POLICY.MAX_ELO, params.rating));
  const D = calculateDifficultyMultiplier(R);
  const pMin = calculateMinimumPerformanceThreshold(R);

  // Check 3 minimum eligibility requirements
  if (params.activeMinutes < WEEKLY_ELO_POLICY.MIN_ACTIVE_MINUTES) {
    return {
      gain: 0,
      newRating: R,
      isEligible: false,
      pMin,
      difficultyMultiplier: D,
      ineligibilityReason: `Active minutes (${params.activeMinutes.toFixed(1)}) below minimum requirement (60 mins)`,
    };
  }

  if (params.distinctTasksCount < WEEKLY_ELO_POLICY.MIN_DISTINCT_TASKS) {
    return {
      gain: 0,
      newRating: R,
      isEligible: false,
      pMin,
      difficultyMultiplier: D,
      ineligibilityReason: `Distinct completed tasks (${params.distinctTasksCount}) below minimum requirement (3 tasks)`,
    };
  }

  if (params.productiveDays < WEEKLY_ELO_POLICY.MIN_PRODUCTIVE_DAYS) {
    return {
      gain: 0,
      newRating: R,
      isEligible: false,
      pMin,
      difficultyMultiplier: D,
      ineligibilityReason: `Productive study days (${params.productiveDays}) below minimum requirement (2 days)`,
    };
  }

  // Check performance threshold
  if (params.performanceScore < pMin) {
    return {
      gain: 0,
      newRating: R,
      isEligible: false,
      pMin,
      difficultyMultiplier: D,
      ineligibilityReason: `Performance score (${params.performanceScore.toFixed(4)}) below threshold (${pMin.toFixed(4)})`,
    };
  }

  // Calculate gain
  const rawGain = Math.round(WEEKLY_ELO_POLICY.MAX_RAW_GAIN_BASE * params.performanceScore * D);
  let gain = 0;

  if (R < WEEKLY_ELO_POLICY.MAX_ELO) {
    gain = Math.min(WEEKLY_ELO_POLICY.MAX_ELO - R, Math.max(1, rawGain));
  } else {
    gain = 0;
  }

  const newRating = Math.min(WEEKLY_ELO_POLICY.MAX_ELO, R + gain);

  return {
    gain,
    newRating,
    isEligible: true,
    pMin,
    difficultyMultiplier: D,
  };
}

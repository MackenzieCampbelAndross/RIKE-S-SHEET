export type CourseId = 'cpp-heavy' | 'java-heavy' | 'python';

export interface CourseMetadata {
  id: CourseId;
  name: string;
  tag: string;
  description: string;
  badge: string;
}

export type TaskCategory =
  | 'DSA'
  | 'C++'
  | 'JAVA'
  | 'PYTHON'
  | 'OOP'
  | 'DBMS'
  | 'SQL'
  | 'OS'
  | 'CN'
  | 'APTITUDE'
  | 'SYSTEM DESIGN'
  | 'PROJECTS'
  | 'RESUME'
  | 'INTERVIEW'
  | 'REVISION'
  | 'ASSESSMENT';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  description?: string;
  estimatedMinutes?: number;
}

export interface DayPlan {
  id: number;
  dayNumber: number;
  courseId?: CourseId;
  phase: number;
  phaseName: string;
  title: string;
  focus: string;
  outcome?: string;
  tasks: Task[];
}

export interface DayProgress {
  [taskId: string]: boolean;
}

export interface CourseProgress {
  currentDay: number;
  completedTasks: {
    [dayNumber: number]: DayProgress;
  };
}

export interface AppProgress {
  currentDay: number;
  completedTasks: {
    [dayNumber: number]: DayProgress;
  };
  pinnedNote?: string;
}

export interface MultiCourseStorage {
  selectedCourseId: CourseId;
  courses: {
    [K in CourseId]: CourseProgress;
  };
}

export interface CourseStats {
  id: CourseId;
  name: string;
  description: string;
  tag: string;
  currentDay: number;
  completedTasksCount: number;
  totalTasksCount: number;
  percentage: number;
  status: 'Not started' | 'In progress' | 'Completed';
}

export type TaskCategory =
  | 'DSA'
  | 'C++'
  | 'JAVA'
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
}

export interface DayPlan {
  id: number;
  dayNumber: number;
  phase: number;
  phaseName: string;
  title: string;
  focus: string;
  tasks: Task[];
}

export interface DayProgress {
  [taskId: string]: boolean;
}

export interface AppProgress {
  currentDay: number;
  completedTasks: {
    [dayNumber: number]: DayProgress;
  };
  pinnedNote?: string;
}

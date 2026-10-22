import type { DayPlan, CourseId, CourseMetadata } from '../types/curriculum';
import cppJson from './curricula/cpp.json';
import javaJson from './curricula/java.json';
import pythonJson from './curricula/python.json';

export const COURSES: Record<CourseId, CourseMetadata> = {
  'cpp-heavy': {
    id: 'cpp-heavy',
    name: 'C++ Heavy',
    tag: 'C++',
    badge: 'STL & Core DSA',
    description: 'C++ fundamentals, STL, problem solving, algorithms, data structures, and placement interviews.',
  },
  'java-heavy': {
    id: 'java-heavy',
    name: 'Java Heavy',
    tag: 'Java',
    badge: 'OOP, Collections & JVM',
    description: 'Java fundamentals, object oriented programming, collections, problem solving, data structures, JVM concepts, and placement interviews.',
  },
  'python': {
    id: 'python',
    name: 'Python',
    tag: 'Python',
    badge: 'Idiomatic & Algorithmic',
    description: 'Python fundamentals, core language features, problem solving, data structures, algorithms, and placement interviews.',
  },
};

export const COURSE_LIST: CourseMetadata[] = [
  COURSES['cpp-heavy'],
  COURSES['java-heavy'],
  COURSES['python'],
];

export const CURRICULA: Record<CourseId, DayPlan[]> = {
  'cpp-heavy': cppJson as DayPlan[],
  'java-heavy': javaJson as DayPlan[],
  'python': pythonJson as DayPlan[],
};

export function getCurriculum(courseId: CourseId = 'cpp-heavy'): DayPlan[] {
  return CURRICULA[courseId] || CURRICULA['cpp-heavy'];
}

// Default export maintained for existing components
export const CURRICULUM: DayPlan[] = CURRICULA['cpp-heavy'];

export const TOTAL_DAYS = 180;

export const PHASES = [
  { phase: 1, name: 'FOUNDATION', start: 1, end: 30, desc: 'Language Syntax, Foundations, OOP, Complexity' },
  { phase: 2, name: 'CORE DSA', start: 31, end: 75, desc: 'Arrays, Two Pointers, Sliding Window, Lists, Stacks, Queues' },
  { phase: 3, name: 'ADVANCED DSA + CS CORE', start: 76, end: 120, desc: 'Trees, BST, Heaps, Greedy, Intervals, Tries, 1D DP' },
  { phase: 4, name: 'INTERVIEW LEVEL', start: 121, end: 150, desc: 'Graphs, 2D DP, DBMS, SQL, OS, Networks, Deep Dives' },
  { phase: 5, name: 'INTERVIEW SIMULATION', start: 151, end: 170, desc: 'Company Drills, System Design, Projects, Aptitude' },
  { phase: 6, name: 'PLACEMENT MODE', start: 171, end: 180, desc: 'Full OA Simulations, Mock Interviews, Final Placement Day' },
];

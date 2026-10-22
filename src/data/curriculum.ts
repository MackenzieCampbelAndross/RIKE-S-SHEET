import type { DayPlan } from '../types/curriculum';
import curriculumJson from './curriculum.json';

export const CURRICULUM: DayPlan[] = curriculumJson as DayPlan[];

export const TOTAL_DAYS = 180;

export const PHASES = [
  { phase: 1, name: 'FOUNDATION', start: 1, end: 30, desc: 'C++, STL, Basic SQL, OOP, Complexity' },
  { phase: 2, name: 'CORE DSA', start: 31, end: 75, desc: 'Pointers, Lists, Stacks, Trees, Graphs, DP' },
  { phase: 3, name: 'ADVANCED DSA + CS CORE', start: 76, end: 120, desc: 'Graphs, DP, DBMS, OS, Networks, Java' },
  { phase: 4, name: 'INTERVIEW LEVEL', start: 121, end: 150, desc: 'System Design, Projects, Resume, Rapid Fire' },
  { phase: 5, name: 'INTERVIEW SIMULATION', start: 151, end: 170, desc: 'Company Prep, Weakness Repair, Full Mocks' },
  { phase: 6, name: 'PLACEMENT MODE', start: 171, end: 180, desc: 'Full Assessments, Final Placement Readiness' },
];

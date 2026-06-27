import { Project, WorkType } from "../types";
import { MockUser, WeekMeta } from "./types";

export const WEEK_META: WeekMeta[] = [
  {
    id: "w1",
    weekNumber: 1,
    startDate: "2026-01-05",
    endDate: "2026-01-09",
    dateLabel: "5 - 9 January, 2026",
  },
  {
    id: "w2",
    weekNumber: 2,
    startDate: "2026-01-12",
    endDate: "2026-01-16",
    dateLabel: "12 - 16 January, 2026",
  },
  {
    id: "w3",
    weekNumber: 3,
    startDate: "2026-01-19",
    endDate: "2026-01-23",
    dateLabel: "19 - 23 January, 2026",
  },
  {
    id: "w4",
    weekNumber: 4,
    startDate: "2026-01-26",
    endDate: "2026-01-30",
    dateLabel: "26 - 30 January, 2026",
  },
  {
    id: "w5",
    weekNumber: 5,
    startDate: "2026-02-02",
    endDate: "2026-02-06",
    dateLabel: "2 - 6 February, 2026",
  },
  {
    id: "w6",
    weekNumber: 6,
    startDate: "2026-02-09",
    endDate: "2026-02-13",
    dateLabel: "9 - 13 February, 2026",
  },
  {
    id: "w7",
    weekNumber: 7,
    startDate: "2026-02-16",
    endDate: "2026-02-20",
    dateLabel: "16 - 20 February, 2026",
  },
  {
    id: "w8",
    weekNumber: 8,
    startDate: "2026-02-23",
    endDate: "2026-02-27",
    dateLabel: "23 - 27 February, 2026",
  },
  {
    id: "w9",
    weekNumber: 9,
    startDate: "2026-03-02",
    endDate: "2026-03-06",
    dateLabel: "2 - 6 March, 2026",
  },
  {
    id: "w10",
    weekNumber: 10,
    startDate: "2026-03-09",
    endDate: "2026-03-13",
    dateLabel: "9 - 13 March, 2026",
  },
  {
    id: "w11",
    weekNumber: 11,
    startDate: "2026-03-16",
    endDate: "2026-03-20",
    dateLabel: "16 - 20 March, 2026",
  },
  {
    id: "w12",
    weekNumber: 12,
    startDate: "2026-03-23",
    endDate: "2026-03-27",
    dateLabel: "23 - 27 March, 2026",
  },
];

export const TASK_TITLES = [
  "Homepage Development",
  "Navigation bar fixes",
  "Checkout flow refactor",
  "API integration",
  "Unit test coverage",
  "Sprint planning",
  "Design QA pass",
  "Performance profiling",
];

export const PROJECTS: Project[] = [
  { id: "p_1", name: "Homepage Development" },
  { id: "p_2", name: "Mobile App" },
  { id: "p_3", name: "Marketing Website" },
  { id: "p_4", name: "Internal Dashboard" },
  { id: "p_5", name: "API Platform" },
  { id: "p_6", name: "Design System" },
];

export const WORK_TYPES: WorkType[] = [
  { id: "w_1", label: "Bug fixes" },
  { id: "w_2", label: "Feature development" },
  { id: "w_3", label: "Meetings" },
  { id: "w_4", label: "Research" },
  { id: "w_5", label: "Documentation" },
  { id: "w_6", label: "Code review" },
];

export const WEEK_HOURS: Record<string, number> = {
  w1: 40,
  w2: 40,
  w3: 20,
  w4: 40,
  w5: 0,
  w6: 32,
  w7: 40,
  w8: 0,
  w9: 16,
  w10: 40,
  w11: 0,
  w12: 24,
};

export const MOCK_USERS: MockUser[] = [
  {
    id: "u_1",
    name: "Tushar jagi",
    email: "tushar@dev",
    initials: "Tj",
    password: "tushar1234",
  },
];

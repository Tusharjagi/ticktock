export const WEEKLY_TARGET_HOURS = 40;

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export type TimesheetStatus = "completed" | "incomplete" | "missing";

export interface Project {
  id: string;
  name: string;
}

export interface WorkType {
  id: string;
  label: string;
}

export interface TimesheetEntry {
  id: string;
  weekId: string;
  date: string;
  projectId: string;
  projectName: string;
  workTypeId: string;
  workTypeLabel: string;
  description: string;
  hours: number;
}

export interface WeeklyTimesheet {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  dateLabel: string;
  totalHours: number;
  status: TimesheetStatus;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface EntryInput {
  date: string;
  projectId: string;
  workTypeId: string;
  description: string;
  hours: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

import { apiFetch } from "./client";
import type {
  EntryInput,
  Paginated,
  Project,
  TimesheetEntry,
  TimesheetStatus,
  WeeklyTimesheet,
  WorkType,
} from "../types";

export interface TimesheetFilters {
  status?: TimesheetStatus | "all";
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
}

export function fetchTimesheets(
  filters: TimesheetFilters = {},
): Promise<Paginated<WeeklyTimesheet>> {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.perPage) params.set("perPage", String(filters.perPage));
  const qs = params.toString();
  return apiFetch<Paginated<WeeklyTimesheet>>(`/api/timesheets${qs ? `?${qs}` : ""}`);
}

export interface WeekDetail {
  week: WeeklyTimesheet;
  entries: TimesheetEntry[];
}

export function fetchWeekDetail(weekId: string): Promise<WeekDetail> {
  return apiFetch<WeekDetail>(`/api/timesheets/${weekId}/entries`);
}

export function fetchProjects(): Promise<{
  projects: Project[];
  workTypes: WorkType[];
}> {
  return apiFetch(`/api/projects`);
}

export function createEntry(
  weekId: string,
  input: EntryInput,
): Promise<{ entry: TimesheetEntry }> {
  return apiFetch(`/api/timesheets/${weekId}/entries`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateEntry(
  id: string,
  input: EntryInput,
): Promise<{ entry: TimesheetEntry }> {
  return apiFetch(`/api/entries/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteEntry(id: string): Promise<{ ok: true }> {
  return apiFetch(`/api/entries/${id}`, { method: "DELETE" });
}

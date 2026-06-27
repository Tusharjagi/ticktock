import { EntryInput, TimesheetEntry, WeeklyTimesheet } from "../types";
import { deriveStatus } from "../status";
import { getProject, getWorkType, PROJECTS, WORK_TYPES } from "./projects";

interface WeekMeta {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  dateLabel: string;
}

const WEEK_META: WeekMeta[] = [
  { id: "w1", weekNumber: 1, startDate: "2026-01-05", endDate: "2026-01-09", dateLabel: "5 - 9 January, 2026" },
  { id: "w2", weekNumber: 2, startDate: "2026-01-12", endDate: "2026-01-16", dateLabel: "12 - 16 January, 2026" },
  { id: "w3", weekNumber: 3, startDate: "2026-01-19", endDate: "2026-01-23", dateLabel: "19 - 23 January, 2026" },
  { id: "w4", weekNumber: 4, startDate: "2026-01-26", endDate: "2026-01-30", dateLabel: "26 - 30 January, 2026" },
  { id: "w5", weekNumber: 5, startDate: "2026-02-02", endDate: "2026-02-06", dateLabel: "2 - 6 February, 2026" },
  { id: "w6", weekNumber: 6, startDate: "2026-02-09", endDate: "2026-02-13", dateLabel: "9 - 13 February, 2026" },
  { id: "w7", weekNumber: 7, startDate: "2026-02-16", endDate: "2026-02-20", dateLabel: "16 - 20 February, 2026" },
  { id: "w8", weekNumber: 8, startDate: "2026-02-23", endDate: "2026-02-27", dateLabel: "23 - 27 February, 2026" },
  { id: "w9", weekNumber: 9, startDate: "2026-03-02", endDate: "2026-03-06", dateLabel: "2 - 6 March, 2026" },
  { id: "w10", weekNumber: 10, startDate: "2026-03-09", endDate: "2026-03-13", dateLabel: "9 - 13 March, 2026" },
  { id: "w11", weekNumber: 11, startDate: "2026-03-16", endDate: "2026-03-20", dateLabel: "16 - 20 March, 2026" },
  { id: "w12", weekNumber: 12, startDate: "2026-03-23", endDate: "2026-03-27", dateLabel: "23 - 27 March, 2026" },
];

const TASK_TITLES = [
  "Homepage Development",
  "Navigation bar fixes",
  "Checkout flow refactor",
  "API integration",
  "Unit test coverage",
  "Sprint planning",
  "Design QA pass",
  "Performance profiling",
];

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function seedEntries(week: WeekMeta, totalHours: number): TimesheetEntry[] {
  const count = Math.round(totalHours / 4);
  const entries: TimesheetEntry[] = [];
  for (let i = 0; i < count; i++) {
    const dayOffset = i % 5;
    const project = PROJECTS[i % PROJECTS.length];
    const workType = WORK_TYPES[i % WORK_TYPES.length];
    entries.push({
      id: `${week.id}-e${i + 1}`,
      weekId: week.id,
      date: addDays(week.startDate, dayOffset),
      projectId: project.id,
      projectName: project.name,
      workTypeId: workType.id,
      workTypeLabel: workType.label,
      description: TASK_TITLES[i % TASK_TITLES.length],
      hours: 4,
    });
  }
  return entries;
}

const WEEK_HOURS: Record<string, number> = {
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

let entries: TimesheetEntry[] = WEEK_META.flatMap((w) =>
  seedEntries(w, WEEK_HOURS[w.id] ?? 0),
);

let idCounter = 1000;
function nextId(): string {
  idCounter += 1;
  return `e_${idCounter}`;
}

function toWeeklyTimesheet(meta: WeekMeta): WeeklyTimesheet {
  const totalHours = entries
    .filter((e) => e.weekId === meta.id)
    .reduce((sum, e) => sum + e.hours, 0);
  return {
    id: meta.id,
    weekNumber: meta.weekNumber,
    startDate: meta.startDate,
    endDate: meta.endDate,
    dateLabel: meta.dateLabel,
    totalHours,
    status: deriveStatus(totalHours),
  };
}

export function listWeeks(): WeeklyTimesheet[] {
  return WEEK_META.map(toWeeklyTimesheet);
}

export function getWeek(id: string): WeeklyTimesheet | undefined {
  const meta = WEEK_META.find((w) => w.id === id);
  return meta ? toWeeklyTimesheet(meta) : undefined;
}

export function getEntriesForWeek(weekId: string): TimesheetEntry[] {
  return entries
    .filter((e) => e.weekId === weekId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function resolveNames(input: EntryInput) {
  const project = getProject(input.projectId);
  const workType = getWorkType(input.workTypeId);
  if (!project) throw new Error(`Unknown project: ${input.projectId}`);
  if (!workType) throw new Error(`Unknown work type: ${input.workTypeId}`);
  return { project, workType };
}

export function addEntry(weekId: string, input: EntryInput): TimesheetEntry {
  const { project, workType } = resolveNames(input);
  const entry: TimesheetEntry = {
    id: nextId(),
    weekId,
    date: input.date,
    projectId: project.id,
    projectName: project.name,
    workTypeId: workType.id,
    workTypeLabel: workType.label,
    description: input.description,
    hours: input.hours,
  };
  entries.push(entry);
  return entry;
}

export function updateEntry(
  id: string,
  input: EntryInput,
): TimesheetEntry | undefined {
  const existing = entries.find((e) => e.id === id);
  if (!existing) return undefined;
  const { project, workType } = resolveNames(input);
  existing.date = input.date;
  existing.projectId = project.id;
  existing.projectName = project.name;
  existing.workTypeId = workType.id;
  existing.workTypeLabel = workType.label;
  existing.description = input.description;
  existing.hours = input.hours;
  return existing;
}

export function deleteEntry(id: string): boolean {
  const before = entries.length;
  entries = entries.filter((e) => e.id !== id);
  return entries.length < before;
}

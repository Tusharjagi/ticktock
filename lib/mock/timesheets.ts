import { EntryInput, TimesheetEntry, WeeklyTimesheet } from "../types";
import { deriveStatus } from "../status";
import { getProject, getWorkType } from "./projects";
import {
  PROJECTS,
  TASK_TITLES,
  WEEK_HOURS,
  WEEK_META,
  WORK_TYPES,
} from "./constants";
import { WeekMeta } from "./types";
import { addDays } from "@/utils/DatesFormatter";

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
      date: String(addDays(week.startDate, dayOffset)),
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

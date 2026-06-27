import { Project, WorkType } from "../types";
import { PROJECTS, WORK_TYPES } from "./constants";

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getWorkType(id: string): WorkType | undefined {
  return WORK_TYPES.find((w) => w.id === id);
}

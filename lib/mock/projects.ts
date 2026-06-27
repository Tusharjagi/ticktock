import { Project, WorkType } from "../types";

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

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getWorkType(id: string): WorkType | undefined {
  return WORK_TYPES.find((w) => w.id === id);
}

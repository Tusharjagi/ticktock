import { TimesheetStatus, WEEKLY_TARGET_HOURS } from "./types";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

export function deriveStatus(totalHours: number): TimesheetStatus {
  if (totalHours <= 0) return "missing";
  if (totalHours >= WEEKLY_TARGET_HOURS) return "completed";
  return "incomplete";
}

export const STATUS_META: Record<
  TimesheetStatus,
  { label: string; className: string }
> = {
  completed: {
    label: TEXT.status.completed,
    className: "bg-ok-bg text-ok-fg",
  },
  incomplete: {
    label: TEXT.status.incomplete,
    className: "bg-warn-bg text-warn-fg",
  },
  missing: {
    label: TEXT.status.missing,
    className: "bg-bad-bg text-bad-fg",
  },
};

export function actionForStatus(status: TimesheetStatus): string {
  if (status === "completed") return TEXT.actions.view;
  if (status === "incomplete") return TEXT.actions.update;
  return TEXT.actions.create;
}

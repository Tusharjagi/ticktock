"use client";

import { Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import type { TimesheetEntry } from "@/lib/types";
import { formatDayLabel } from "@/utils/DatesFormatter";

interface DayGroupProps {
  date: string;
  entries: TimesheetEntry[];
  onAddTask: (date: string) => void;
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (entry: TimesheetEntry) => void;
}

export function DayGroup({
  date,
  entries,
  onAddTask,
  onEdit,
  onDelete,
}: DayGroupProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
      <div className="shrink-0 pt-2 text-sm font-semibold text-ink sm:w-16">
        {formatDayLabel(date)}
      </div>
      <div className="flex-1 space-y-3">
        {entries.map((entry) => (
          <TaskCard
            key={entry.id}
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        <button
          type="button"
          onClick={() => onAddTask(date)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line py-3 text-sm font-medium text-muted transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
        >
          <Plus className="h-4 w-4" />
          {TEXT.task.addNewTask}
        </button>
      </div>
    </div>
  );
}

"use client";

import { Tag } from "@/components/ui/Badge";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import type { TimesheetEntry } from "@/lib/types";

interface TaskCardProps {
  entry: TimesheetEntry;
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (entry: TimesheetEntry) => void;
}

export function TaskCard({ entry, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3">
      <p className="truncate pr-4 text-sm font-medium text-ink">
        {entry.description}
      </p>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm text-faint">
          {entry.hours} {TEXT.units.hours}
        </span>
        <Tag>{entry.projectName}</Tag>
        <DropdownMenu
          items={[
            { label: TEXT.task.edit, onSelect: () => onEdit(entry) },
            {
              label: TEXT.task.delete,
              onSelect: () => onDelete(entry),
              danger: true,
            },
          ]}
        />
      </div>
    </div>
  );
}

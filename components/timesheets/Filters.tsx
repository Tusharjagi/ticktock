"use client";

import { memo } from "react";
import { Select } from "@/components/ui/Select";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import type { TimesheetStatus } from "@/lib/types";

/** Preset date ranges — each spans multiple weeks to exercise the overlap filter. */
export interface DateRange {
  id: string;
  label: string;
  from?: string;
  to?: string;
}

export const DATE_RANGES: DateRange[] = [
  { id: "all", label: "All time" },
  { id: "jan", label: "January 2026", from: "2026-01-01", to: "2026-01-31" },
  { id: "feb", label: "February 2026", from: "2026-02-01", to: "2026-02-28" },
  { id: "mar", label: "March 2026", from: "2026-03-01", to: "2026-03-31" },
  { id: "q1", label: "Q1 2026", from: "2026-01-01", to: "2026-03-31" },
];

export type StatusFilter = TimesheetStatus | "all";

interface FiltersProps {
  rangeId: string;
  status: StatusFilter;
  onRangeChange: (id: string) => void;
  onStatusChange: (status: StatusFilter) => void;
}

export const Filters = memo(function Filters({
  rangeId,
  status,
  onRangeChange,
  onStatusChange,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        aria-label={TEXT.filters.dateRangeAria}
        className="w-44"
        value={rangeId}
        onChange={(e) => onRangeChange(e.target.value)}
      >
        {DATE_RANGES.map((r) => (
          <option key={r.id} value={r.id}>
            {r.id === "all" ? TEXT.filters.dateRangePlaceholder : r.label}
          </option>
        ))}
      </Select>

      <Select
        aria-label={TEXT.filters.statusAria}
        className="w-40"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
      >
        <option value="all">{TEXT.filters.statusPlaceholder}</option>
        <option value="completed">{TEXT.filters.statusCompleted}</option>
        <option value="incomplete">{TEXT.filters.statusIncomplete}</option>
        <option value="missing">{TEXT.filters.statusMissing}</option>
      </Select>
    </div>
  );
});

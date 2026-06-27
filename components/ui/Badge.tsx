import { cn } from "@/utils/cn";
import { STATUS_META } from "@/lib/status";
import type { TimesheetStatus } from "@/lib/types";

/** Coloured status pill used in the timesheets table. */
export function StatusBadge({ status }: { status: TimesheetStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium tracking-wide",
        meta.className,
      )}
    >
      {meta.label}
    </span>
  );
}

/** Soft pill used for the project tag on task cards. */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">
      {children}
    </span>
  );
}

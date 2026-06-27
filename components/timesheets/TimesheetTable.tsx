"use client";

import { memo } from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { actionForStatus } from "@/lib/status";
import { cn } from "@/lib/cn";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import type { WeeklyTimesheet } from "@/lib/types";

interface TableProps {
  weeks: WeeklyTimesheet[];
  isLoading: boolean;
  /** True while a filter/pagination refetch is in-flight (old data still shown). */
  isFetching?: boolean;
}

function HeaderCell({
  children,
  sortable,
  className,
}: {
  children: React.ReactNode;
  sortable?: boolean;
  className?: string;
}) {
  return (
    <th
      className={`whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted ${className ?? ""}`}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && <ArrowDown className="h-3.5 w-3.5 text-faint" aria-hidden />}
      </span>
    </th>
  );
}

export const TimesheetTable = memo(function TimesheetTable({
  weeks,
  isLoading,
  isFetching,
}: TableProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-line transition-opacity duration-150",
        isFetching && !isLoading && "opacity-50",
      )}
    >
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-50">
          <tr className="border-b border-line">
            <HeaderCell sortable>{TEXT.table.colWeek}</HeaderCell>
            <HeaderCell sortable>{TEXT.table.colDate}</HeaderCell>
            <HeaderCell sortable>{TEXT.table.colStatus}</HeaderCell>
            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted">
              {TEXT.table.colActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SkeletonRows />
          ) : weeks.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-sm text-muted">
                {TEXT.table.empty}
              </td>
            </tr>
          ) : (
            weeks.map((week) => (
              <tr
                key={week.id}
                className="border-b border-line last:border-0 hover:bg-gray-50/60"
              >
                <td className="px-6 py-4 text-muted">{week.weekNumber}</td>
                <td className="px-6 py-4 text-body">{week.dateLabel}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={week.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/timesheets/${week.id}`}
                    className="font-medium text-brand hover:underline"
                  >
                    {actionForStatus(week.status)}
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-line last:border-0">
          {Array.from({ length: 4 }).map((__, j) => (
            <td key={j} className="px-6 py-4">
              <div className="h-4 w-full max-w-40 animate-pulse rounded bg-gray-100" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

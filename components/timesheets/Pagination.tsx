"use client";

import { memo } from "react";
import { cn } from "@/utils/cn";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
}

function pageItems(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) items.push("…");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("…");
  items.push(total);
  return items;
}

export const Pagination = memo(function Pagination({
  page,
  totalPages,
  onPageChange,
  isPending,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const items = pageItems(page, totalPages);

  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition-colors";

  return (
    <nav className="flex items-center gap-1" aria-label={TEXT.pagination.aria}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || isPending}
        className={cn(
          btn,
          "border-line text-body hover:bg-gray-50 disabled:opacity-40",
        )}
      >
        {TEXT.pagination.previous}
      </button>

      {items.map((item, i) =>
        item === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-faint">
            {TEXT.pagination.ellipsis}
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            disabled={isPending}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              btn,
              item === page
                ? "border-brand bg-brand-soft font-medium text-brand"
                : "border-line text-body hover:bg-gray-50",
              isPending && "cursor-wait",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages || isPending}
        className={cn(
          btn,
          "border-line text-body hover:bg-gray-50 disabled:opacity-40",
        )}
      >
        {TEXT.pagination.next}
      </button>
    </nav>
  );
});

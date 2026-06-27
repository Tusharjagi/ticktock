"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useState, useTransition } from "react";
import {
  DATE_RANGES,
  Filters,
  type StatusFilter,
} from "@/components/timesheets/Filters";
import { Pagination } from "@/components/timesheets/Pagination";
import { TimesheetTable } from "@/components/timesheets/TimesheetTable";
import { Select } from "@/components/ui/Select";
import { fetchTimesheets } from "@/lib/api/timesheets";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

const PER_PAGE_OPTIONS = [5, 10, 20];

export default function TimesheetsPage() {
  const [rangeId, setRangeId] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [isPending, startTransition] = useTransition();

  const range = DATE_RANGES.find((r) => r.id === rangeId);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["timesheets", { status, rangeId, page, perPage }],
    queryFn: () =>
      fetchTimesheets({
        status,
        from: range?.from,
        to: range?.to,
        page,
        perPage,
      }),
    placeholderData: keepPreviousData,
  });

  const weeks = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  // Wrap every user-driven state update in a transition so React keeps the UI
  // interactive while the new fetch is in-flight.
  const handleRange = useCallback(
    (id: string) => {
      startTransition(() => {
        setRangeId(id);
        setPage(1);
      });
    },
    // startTransition and setState setters are stable — [] is correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleStatus = useCallback((s: StatusFilter) => {
    startTransition(() => {
      setStatus(s);
      setPage(1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePerPage = useCallback((n: number) => {
    startTransition(() => {
      setPerPage(n);
      setPage(1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePage = useCallback((n: number) => {
    startTransition(() => setPage(n));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // isFetching covers in-flight refetches; isPending covers the transition
  // window before React Query even fires the request.
  const isUpdating = isPending || isFetching;

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-xl font-bold text-ink">{TEXT.timesheets.heading}</h1>

      <div className="mt-5">
        <Filters
          rangeId={rangeId}
          status={status}
          onRangeChange={handleRange}
          onStatusChange={handleStatus}
        />
      </div>

      <div className="mt-5">
        {isError ? (
          <div className="rounded-lg border border-bad-bg bg-bad-bg/40 px-4 py-6 text-center text-sm text-bad-fg">
            {error instanceof Error ? error.message : TEXT.timesheets.loadError}
          </div>
        ) : (
          <TimesheetTable
            weeks={weeks}
            isLoading={isLoading}
            isFetching={isUpdating}
          />
        )}
      </div>

      <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Select
          aria-label={TEXT.timesheets.rowsPerPageAria}
          className="w-36"
          value={perPage}
          onChange={(e) => handlePerPage(Number(e.target.value))}
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} {TEXT.timesheets.perPageSuffix}
            </option>
          ))}
        </Select>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePage}
          isPending={isUpdating}
        />
      </div>
    </section>
  );
}

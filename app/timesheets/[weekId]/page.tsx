"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { DayGroup } from "@/components/list/DayGroup";
import { ProgressBar } from "@/components/list/ProgressBar";
import { AddEntryModal } from "@/components/entry/AddEntryModal";
import { Spinner } from "@/components/ui/Spinner";
import { deleteEntry, fetchWeekDetail } from "@/services/api/timesheets";
import { enumerateDays } from "@/lib/date";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import type { TimesheetEntry } from "@/lib/types";

interface ModalState {
  open: boolean;
  date: string;
  entry: TimesheetEntry | null;
}

export default function WeekDetailPage() {
  const { weekId } = useParams<{ weekId: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["week", weekId],
    queryFn: () => fetchWeekDetail(weekId),
    enabled: Boolean(weekId),
  });

  const [modal, setModal] = useState<ModalState>({
    open: false,
    date: "",
    entry: null,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["week", weekId] });
      queryClient.invalidateQueries({ queryKey: ["timesheets"] });
    },
  });

  const handleAdd = (date: string) =>
    setModal({ open: true, date, entry: null });
  const handleEdit = (entry: TimesheetEntry) =>
    setModal({ open: true, date: entry.date, entry });
  const handleDelete = (entry: TimesheetEntry) => {
    if (window.confirm(TEXT.week.deleteConfirm)) {
      deleteMutation.mutate(entry.id);
    }
  };
  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl bg-white shadow-sm">
        <Spinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-sm text-bad-fg shadow-sm">
        {error instanceof Error ? error.message : TEXT.week.loadError}
      </div>
    );
  }

  const { week, entries } = data;
  const days = enumerateDays(week.startDate, week.endDate);
  const entriesByDate = (date: string) =>
    entries.filter((e) => e.date === date);

  return (
    <>
      <section className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink">{TEXT.week.heading}</h1>
            <p className="mt-1 text-sm text-muted">{week.dateLabel}</p>
          </div>
          <ProgressBar total={week.totalHours} />
        </div>

        {/* Day groups */}
        <div className="mt-8 space-y-8">
          {days.map((date) => (
            <DayGroup
              key={date}
              date={date}
              entries={entriesByDate(date)}
              onAddTask={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>

      <AddEntryModal
        open={modal.open}
        onClose={closeModal}
        weekId={weekId}
        date={modal.date}
        entry={modal.entry}
      />
    </>
  );
}

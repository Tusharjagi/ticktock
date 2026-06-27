"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Input";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { createEntry, fetchProjects, updateEntry } from "@/lib/api/timesheets";
import { ApiError } from "@/lib/api/client";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import type { EntryInput, TimesheetEntry } from "@/lib/types";

interface AddEntryModalProps {
  open: boolean;
  onClose: () => void;
  weekId: string;
  /** Day the entry is being added/edited for (ISO date). */
  date: string;
  /** When provided, the modal is in "edit" mode. */
  entry?: TimesheetEntry | null;
}

/**
 * The form is a separate component rendered as the Modal's child. Because the
 * Modal unmounts its children when closed, the form's state initialises fresh
 * from props on every open — no reset effect needed.
 */
export function AddEntryModal({
  open,
  onClose,
  weekId,
  date,
  entry,
}: AddEntryModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={entry ? TEXT.modal.editTitle : TEXT.modal.addTitle}
    >
      <EntryForm
        key={entry?.id ?? "new"}
        weekId={weekId}
        date={date}
        entry={entry ?? null}
        onClose={onClose}
      />
    </Modal>
  );
}

interface FormState {
  projectId: string;
  workTypeId: string;
  description: string;
  hours: number;
}

function initialForm(entry: TimesheetEntry | null): FormState {
  if (!entry) {
    return { projectId: "", workTypeId: "", description: "", hours: 12 };
  }
  return {
    projectId: entry.projectId,
    workTypeId: entry.workTypeId,
    description: entry.description,
    hours: entry.hours,
  };
}

function EntryForm({
  weekId,
  date,
  entry,
  onClose,
}: {
  weekId: string;
  date: string;
  entry: TimesheetEntry | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(entry);

  const [form, setForm] = useState<FormState>(() => initialForm(entry));
  const [error, setError] = useState<string | null>(null);

  const { data: options } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const mutation = useMutation({
    mutationFn: (input: EntryInput) =>
      isEdit && entry
        ? updateEntry(entry.id, input)
        : createEntry(weekId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["week", weekId] });
      queryClient.invalidateQueries({ queryKey: ["timesheets"] });
      onClose();
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : TEXT.modal.saveError);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.projectId) return setError(TEXT.modal.errProject);
    if (!form.workTypeId) return setError(TEXT.modal.errWorkType);
    if (!form.description.trim()) return setError(TEXT.modal.errDescription);

    mutation.mutate({
      date,
      projectId: form.projectId,
      workTypeId: form.workTypeId,
      description: form.description.trim(),
      hours: form.hours,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label={TEXT.modal.selectProject} htmlFor="project" required info>
        <Select
          id="project"
          value={form.projectId}
          placeholderSelected={!form.projectId}
          onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
        >
          <option value="" disabled>
            {TEXT.modal.projectPlaceholder}
          </option>
          {options?.projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={TEXT.modal.typeOfWork} htmlFor="work-type" required info>
        <Select
          id="work-type"
          value={form.workTypeId}
          placeholderSelected={!form.workTypeId}
          onChange={(e) => setForm((f) => ({ ...f, workTypeId: e.target.value }))}
        >
          <option value="" disabled>
            {TEXT.modal.workTypePlaceholder}
          </option>
          {options?.workTypes.map((w) => (
            <option key={w.id} value={w.id}>
              {w.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label={TEXT.modal.taskDescription}
        htmlFor="description"
        required
        hint={TEXT.modal.descriptionHint}
      >
        <Textarea
          id="description"
          rows={4}
          placeholder={TEXT.modal.descriptionPlaceholder}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
      </Field>

      <Field label={TEXT.modal.hours} required>
        <Stepper
          value={form.hours}
          onChange={(hours) => setForm((f) => ({ ...f, hours }))}
        />
      </Field>

      {error && (
        <p className="text-sm text-bad-fg" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="submit" className="flex-1" loading={mutation.isPending}>
          {isEdit ? TEXT.modal.saveChanges : TEXT.modal.addEntry}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onClose}
        >
          {TEXT.common.cancel}
        </Button>
      </div>
    </form>
  );
}

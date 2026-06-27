"use client";

import { Minus, Plus } from "lucide-react";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

/** Numeric stepper: − [value] + (used for "Hours" in the entry modal). */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 24,
  step = 1,
}: StepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const set = (n: number) => onChange(clamp(n));

  return (
    <div className="inline-flex w-fit items-stretch self-start overflow-hidden rounded-lg border border-line">
      <button
        type="button"
        aria-label={TEXT.stepper.decreaseAria}
        onClick={() => set(value - step)}
        disabled={value <= min}
        className="flex w-10 items-center justify-center bg-gray-50 text-muted transition-colors hover:bg-gray-100 disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        aria-label={TEXT.stepper.valueAria}
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) set(n);
        }}
        className="w-14 border-x border-line text-center text-sm text-ink focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label={TEXT.stepper.increaseAria}
        onClick={() => set(value + step)}
        disabled={value >= max}
        className="flex w-10 items-center justify-center bg-gray-50 text-muted transition-colors hover:bg-gray-100 disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

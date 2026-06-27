import { Info } from "lucide-react";
import { cn } from "@/utils/cn";
import { FieldProps } from "./types";

export function Field({
  label,
  htmlFor,
  required,
  info,
  hint,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-sm font-medium text-ink"
      >
        {label}
        {required && <span aria-hidden>*</span>}
        {info && <Info className="h-3.5 w-3.5 text-faint" aria-hidden />}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-bad-fg">{error}</p>
      ) : hint ? (
        <p className="text-xs text-faint">{hint}</p>
      ) : null}
    </div>
  );
}

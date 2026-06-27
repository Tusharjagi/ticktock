import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const baseField =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-faint shadow-sm transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-gray-50";

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(baseField, invalid && "border-bad-fg focus:ring-bad-fg", className)}
      {...props}
    />
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(baseField, "resize-none", invalid && "border-bad-fg focus:ring-bad-fg", className)}
      {...props}
    />
  );
});

export { baseField };

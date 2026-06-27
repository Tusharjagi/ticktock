import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  placeholderSelected?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { className, invalid, placeholderSelected, children, ...props },
    ref,
  ) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-lg border border-line bg-white px-3.5 py-2.5 pr-10 text-sm shadow-sm transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-gray-50",
            placeholderSelected ? "text-faint" : "text-ink",
            invalid && "border-bad-fg focus:ring-bad-fg",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
      </div>
    );
  },
);

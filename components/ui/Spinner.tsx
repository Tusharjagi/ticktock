import { cn } from "@/utils/cn";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label={TEXT.common.loadingAria}
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand",
        className,
      )}
    />
  );
}

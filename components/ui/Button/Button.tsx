import { cn } from "@/utils/cn";
import { Spinner } from "../Spinner";
import { ButtonProps } from "./types";
import { SIZES, VARIANTS } from "./constants";

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Spinner className="h-4 w-4 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}

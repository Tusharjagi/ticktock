import { cn } from "@/utils/cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover disabled:bg-brand/60 shadow-sm",
  secondary:
    "bg-white text-body border border-line hover:bg-gray-50 disabled:opacity-60",
  ghost: "bg-transparent text-brand hover:bg-brand-soft disabled:opacity-60",
};

const SIZES: Record<Size, string> = {
  md: "h-11 px-4 text-sm",
  sm: "h-9 px-3 text-sm",
};

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

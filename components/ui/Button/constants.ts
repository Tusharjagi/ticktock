import { Size, Variant } from "./types";

export const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover disabled:bg-brand/60 shadow-sm",
  secondary:
    "bg-white text-body border border-line hover:bg-gray-50 disabled:opacity-60",
  ghost: "bg-transparent text-brand hover:bg-brand-soft disabled:opacity-60",
};

export const SIZES: Record<Size, string> = {
  md: "h-11 px-4 text-sm",
  sm: "h-9 px-3 text-sm",
};

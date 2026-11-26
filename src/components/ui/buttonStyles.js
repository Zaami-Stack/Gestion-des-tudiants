import { cn } from "../../utils/format";

const variants = {
  primary: "border-transparent bg-accent text-white active:bg-accent",
  secondary: "border-line bg-surface text-ink active:bg-surface-2",
  ghost: "border-transparent bg-transparent text-ink active:bg-surface-2",
  danger: "border-transparent bg-danger text-white active:bg-danger",
  subtle: "border-transparent bg-accent-soft text-accent active:bg-accent-soft",
};

const sizes = {
  sm: "h-8 px-2.5 text-[12px]",
  md: "h-9 px-3 text-[13px]",
  lg: "h-10 px-4 text-[14px]",
};

export function buttonClass(variant = "primary", size = "md", className = "") {
  return cn(
    "inline-flex items-center justify-center gap-1.5 rounded-[10px] border font-semibold transition duration-150 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );
}

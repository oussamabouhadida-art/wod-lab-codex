import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "muted";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[4px] px-4 py-2 text-sm font-semibold transition",
        variant === "primary" && "bg-lime text-black hover:brightness-110",
        variant === "ghost" && "border border-divider bg-transparent text-heading hover:border-lime/20",
        variant === "muted" && "bg-surface-2 text-body hover:bg-surface-1",
        className,
      )}
      {...props}
    />
  );
}

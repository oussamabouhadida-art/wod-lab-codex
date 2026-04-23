import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] border border-divider bg-surface-2 px-2 py-1 text-xs uppercase tracking-wide text-body",
        className,
      )}
      {...props}
    />
  );
}

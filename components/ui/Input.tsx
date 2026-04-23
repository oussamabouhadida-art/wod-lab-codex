import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-[4px] border border-divider bg-surface-2 px-3 py-2 text-sm text-body outline-none ring-lime/30 focus:ring",
        props.className,
      )}
    />
  );
}

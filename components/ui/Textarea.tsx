import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-[4px] border border-divider bg-surface-2 px-3 py-2 font-mono text-sm text-body outline-none ring-lime/30 focus:ring",
        props.className,
      )}
    />
  );
}

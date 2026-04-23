import { wodTypeColors, wodTypeLabel, WodType } from "@/lib/utils/wod-types";

export function WodTypeBadge({ type }: { type: WodType }) {
  return (
    <span
      className="inline-flex rounded-[4px] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-black"
      style={{ backgroundColor: wodTypeColors[type] }}
    >
      {wodTypeLabel[type]}
    </span>
  );
}

"use client";

import { motion } from "framer-motion";
import { CalendarDays, Dumbbell } from "lucide-react";
import { Wod } from "@/lib/utils/wod-types";
import { WodTypeBadge } from "@/components/wod/WodTypeBadge";

export function WodCard({ wod, index, title, onClick }: { wod: Wod; index: number; title: string; onClick: () => void }) {
  const formattedDate = wod.published_at ? new Date(wod.published_at).toLocaleDateString() : "-";

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      onClick={onClick}
      className="wod-card group rounded-[4px] border border-divider bg-surface-1 p-4 text-left transition hover:-translate-y-0.5 hover:lime-outline"
      style={{ borderLeftColor: "var(--lime)" }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-display text-3xl uppercase leading-none text-heading">{title}</h3>
        <WodTypeBadge type={wod.wod_type} />
      </div>
      <div className="mb-2 flex items-center gap-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1"><Dumbbell size={12} />{wod.objective}</span>
        <span className="inline-flex items-center gap-1"><CalendarDays size={12} />{formattedDate}</span>
      </div>
      <p className="line-clamp-3 text-sm text-body/90">{wod.content_en}</p>
    </motion.button>
  );
}

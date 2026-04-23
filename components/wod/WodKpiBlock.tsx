"use client";

import { Activity, BarChart2, Flame, Heart, Moon, Timer, TrendingUp, Zap } from "lucide-react";
import { animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { WodKpi } from "@/lib/utils/wod-types";

function Count({ value }: { value: number }) {
  const motion = useMotionValue(0);
  const rounded = useTransform(motion, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(motion, value, { duration: 1.2, ease: "easeOut" });
    return () => controls.stop();
  }, [motion, value]);

  return <span>{rounded.get()}</span>;
}

export function WodKpiBlock({ kpi }: { kpi: WodKpi | null }) {
  if (!kpi) {
    return <div className="grid grid-cols-2 gap-2 rounded-[4px] bg-[#0f0f0f] p-4 sm:grid-cols-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded bg-surface-2" />)}</div>;
  }

  const items = [
    { label: "Duration", icon: Timer, value: kpi.estimated_duration_min, unit: "min" },
    { label: "Avg HR", icon: Heart, value: kpi.avg_heart_rate, unit: "bpm" },
    { label: "Max HR", icon: Activity, value: kpi.max_heart_rate, unit: "bpm" },
    { label: "Calories", icon: Flame, value: kpi.estimated_calories, unit: "kcal" },
    { label: "Training Effect", icon: Zap, value: kpi.training_effect, unit: "" },
    { label: "Intensity", icon: BarChart2, value: kpi.intensity_level, unit: "" },
    { label: "Recovery", icon: Moon, value: kpi.recovery_time_hours, unit: "h" },
    { label: "Training Load", icon: TrendingUp, value: kpi.training_load, unit: "" },
  ];

  return (
    <div className="rounded-[4px] bg-[#0f0f0f] p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-[4px] border border-divider bg-surface-1 p-2">
            <div className="mb-2 flex items-center gap-1 text-xs text-muted"><item.icon size={12} />{item.label}</div>
            <div className="font-display text-2xl text-lime">
              {typeof item.value === "number" ? <Count value={item.value} /> : (item.value ?? "-")}
              {item.unit ? <span className="ml-1 font-sans text-xs text-body">{item.unit}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

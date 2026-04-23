"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";

const tabs = [
  { id: "all", label: "All WoDs", color: "#C8FF00" },
  { id: "for_time", label: "For Time", color: "#FF4D00" },
  { id: "amrap", label: "AMRAP", color: "#FF4D00" },
  { id: "emom", label: "EMOM", color: "#00C2FF" },
  { id: "chipper", label: "Chipper", color: "#C8FF00" },
  { id: "ladder", label: "Ladder", color: "#C8FF00" },
  { id: "benchmark_hero", label: "Benchmark", color: "#FFD700" },
];

export function WodTabs({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Tabs.Root value={value} onValueChange={onChange}>
      <Tabs.List className="mb-4 flex flex-wrap gap-2 border-b border-divider pb-2">
        {tabs.map((tab) => (
          <Tabs.Trigger key={tab.id} value={tab.id} className="relative rounded-[4px] px-3 py-1 text-xs uppercase tracking-[0.14em] text-body">
            {tab.label}
            {value === tab.id ? <motion.span layoutId="tab-indicator" className="absolute inset-x-0 -bottom-2 h-[2px]" style={{ backgroundColor: tab.color }} /> : null}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}

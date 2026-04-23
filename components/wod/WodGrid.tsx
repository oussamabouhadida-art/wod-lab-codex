"use client";

import { useMemo, useState } from "react";
import { Wod } from "@/lib/utils/wod-types";
import { WodCard } from "@/components/wod/WodCard";
import { WodDrawer } from "@/components/wod/WodDrawer";
import { FilterState, WodFilters } from "@/components/wod/WodFilters";
import { WodTabs } from "@/components/wod/WodTabs";

export function WodGrid({ wods, locale }: { wods: Wod[]; locale: string }) {
  const [activeTab, setActiveTab] = useState("all");
  const [selected, setSelected] = useState<Wod | null>(null);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});

  const filtered = useMemo(() => {
    return wods.filter((wod) => {
      const tabOk = activeTab === "all" ? true : wod.wod_type === activeTab;
      const typeOk = filters.type ? wod.wod_type === filters.type : true;
      const objectiveOk = filters.objective ? wod.objective === filters.objective : true;
      return tabOk && typeOk && objectiveOk;
    });
  }, [wods, activeTab, filters]);

  return (
    <>
      <WodTabs value={activeTab} onChange={setActiveTab} />
      <WodFilters filters={filters} onChange={setFilters} count={filtered.length} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((wod, index) => (
          <WodCard
            key={wod.id}
            wod={wod}
            index={index}
            title={locale === "fr" ? wod.title_fr : locale === "es" ? wod.title_es : wod.title_en}
            onClick={() => {
              setSelected(wod);
              setOpen(true);
            }}
          />
        ))}
      </div>
      <WodDrawer wod={selected} locale={locale} open={open} onOpenChange={setOpen} />
    </>
  );
}

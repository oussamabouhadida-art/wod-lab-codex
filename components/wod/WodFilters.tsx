"use client";

import { X } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { componentOptions, objectiveOptions, wodTypeOptions } from "@/lib/utils/wod-types";

export interface FilterState {
  type?: string;
  objective?: string;
  component?: string;
}

export function WodFilters({ filters, onChange, count }: { filters: FilterState; onChange: (filters: FilterState) => void; count: number }) {
  const active = Boolean(filters.type || filters.objective || filters.component);

  return (
    <div className="sticky top-[70px] z-20 mb-4 grid gap-2 rounded-[4px] border border-divider bg-surface-1 p-3 sm:grid-cols-4">
      <Select
        value={filters.type}
        onValueChange={(type) => onChange({ ...filters, type: type === "all" ? undefined : type })}
        placeholder="WoD Type"
        options={[{ label: "All", value: "all" }, ...wodTypeOptions.map((value) => ({ label: value, value }))]}
      />
      <Select
        value={filters.component}
        onValueChange={(component) => onChange({ ...filters, component: component === "all" ? undefined : component })}
        placeholder="Movement"
        options={[{ label: "All", value: "all" }, ...componentOptions.map((value) => ({ label: value, value }))]}
      />
      <Select
        value={filters.objective}
        onValueChange={(objective) => onChange({ ...filters, objective: objective === "all" ? undefined : objective })}
        placeholder="Objective"
        options={[{ label: "All", value: "all" }, ...objectiveOptions.map((value) => ({ label: value, value }))]}
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-wide text-muted">Showing {count} WoDs</span>
        {active ? (
          <Button variant="muted" className="px-2 py-1 text-xs" onClick={() => onChange({})}>
            <X size={12} /> Reset
          </Button>
        ) : null}
      </div>
    </div>
  );
}

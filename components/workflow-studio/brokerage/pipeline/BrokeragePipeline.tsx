"use client";
import { useMemo, useState } from "react";
import type { CustomsChannel, CustomsFormCode, Declaration, DeclarationFlag } from "../types";
import type { PipelineProps } from "./types";
import type { PipelineFiltersState } from "./PipelineFilters";
import { PipelineColumn } from "./PipelineColumn";
import { PipelineFilters } from "./PipelineFilters";

export function BrokeragePipeline({ declarations, columns, onCardClick, onCardDragEnd, className }: PipelineProps) {
  const [filters, setFilters] = useState<PipelineFiltersState>({
    search: "",
    forms: new Set<CustomsFormCode>(),
    flags: new Set<DeclarationFlag>(),
    channels: new Set<CustomsChannel>(),
  });

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return declarations.filter((d) => {
      if (filters.forms.size > 0 && !filters.forms.has(d.formCode)) return false;
      if (filters.flags.size > 0 && !d.flags.some((f) => filters.flags.has(f))) return false;
      if (filters.channels.size > 0 && !filters.channels.has(d.channel)) return false;
      if (!q) return true;
      return d.reference.toLowerCase().includes(q) ||
        d.clientName.toLowerCase().includes(q) ||
        d.owningBroker.toLowerCase().includes(q);
    });
  }, [declarations, filters]);

  const byColumn = useMemo(() => {
    const m: Record<string, Declaration[]> = {};
    for (const c of columns) m[c.id] = [];
    for (const d of filtered) (m[d.status] ??= []).push(d);
    return m;
  }, [filtered, columns]);

  return (
    <section className={["flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4", className ?? ""].join(" ")}
             aria-label="Brokerage pipeline">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
          Declaration pipeline · {filtered.length} / {declarations.length}
        </div>
        <PipelineFilters value={filters} onChange={setFilters} />
      </header>
      <div className="flex gap-3 overflow-x-auto pb-3">
        {columns.map((c) => (
          <PipelineColumn key={c.id} column={c} declarations={byColumn[c.id] ?? []}
            onCardClick={onCardClick}
            onDrop={(ref) => {
              const d = declarations.find((x) => x.reference === ref);
              if (d) onCardDragEnd?.(d, c.id);
            }} />
        ))}
      </div>
    </section>
  );
}

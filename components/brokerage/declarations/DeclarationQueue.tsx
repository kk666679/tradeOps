"use client";
import { useMemo, useState } from "react";
import type { Declaration } from "../types";
import { DeclarationCard } from "./DeclarationCard";

export interface DeclarationQueueProps {
  declarations: Declaration[];
  onSelect?: (d: Declaration) => void;
  className?: string;
}

export function DeclarationQueue({ declarations, onSelect, className }: DeclarationQueueProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return declarations;
    return declarations.filter((d) =>
      d.reference.toLowerCase().includes(q) ||
      d.clientName.toLowerCase().includes(q) ||
      d.status.toLowerCase().includes(q));
  }, [declarations, query]);

  return (
    <section className={["flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4", className ?? ""].join(" ")}
             aria-label="Declaration queue">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
          Declarations · {filtered.length} / {declarations.length}
        </div>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search declarations…" aria-label="Search declarations"
          className="w-64 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--text)] outline-none focus:border-emerald-500/50" />
      </header>
      <ul className="flex flex-col gap-1.5">
        {filtered.map((d) => <li key={d.id}><DeclarationCard declaration={d} onClick={() => onSelect?.(d)} /></li>)}
      </ul>
    </section>
  );
}

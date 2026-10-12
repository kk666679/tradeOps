"use client";
import { useState } from "react";
import type { Declaration, PipelineColumnDef } from "../types";
import { PipelineCard } from "./PipelineCard";

export function PipelineColumn({ column, declarations, onCardClick, onDrop }: {
  column: PipelineColumnDef;
  declarations: Declaration[];
  onCardClick?: (d: Declaration) => void;
  onDrop?: (reference: string) => void;
}) {
  const [over, setOver] = useState(false);
  const max = column.maxCards ?? declarations.length;
  const shown = declarations.slice(0, max);
  const hidden = declarations.length - shown.length;

  return (
    <div onDragOver={(e) => { e.preventDefault(); setOver(true); }}
         onDragLeave={() => setOver(false)}
         onDrop={(e) => { e.preventDefault(); setOver(false); const ref = e.dataTransfer.getData("text/plain"); if (ref) onDrop?.(ref); }}
         className={["flex w-[280px] shrink-0 flex-col gap-2 rounded-xl border p-2.5 transition-colors",
           over ? "border-emerald-500/50 bg-emerald-500/[0.04]" : "border-[var(--border)] bg-[var(--bg-subtle)]"].join(" ")}
         aria-label={`Column ${column.label}`}>
      <header className="flex items-center gap-2 px-1">
        <span className="h-2 w-2 rounded-full" style={{ background: column.accent }} />
        <span className="text-[12px] font-semibold text-[var(--text)]">{column.label}</span>
        <span className="ml-auto rounded bg-[var(--bg-elev)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
          {declarations.length}
        </span>
      </header>
      <div className="flex flex-col gap-2">
        {shown.length === 0 && (
          <div className="rounded-lg border border-dashed border-[var(--border)] px-3 py-6 text-center font-mono text-[10px] text-[var(--text-muted)]">
            drop here
          </div>
        )}
        {shown.map((d) => <PipelineCard key={d.id} declaration={d} onClick={() => onCardClick?.(d)} />)}
        {hidden > 0 && <div className="px-1 font-mono text-[10px] text-[var(--text-muted)]">+{hidden} more</div>}
      </div>
    </div>
  );
}

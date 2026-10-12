"use client";
import type { AuditChainEntry } from "../hooks/useAuditChain";

export interface AuditTraceProps {
  entries: AuditChainEntry[];
  eventId: string;
  className?: string;
}

export function AuditTrace({ entries, eventId, className }: AuditTraceProps) {
  const idx = entries.findIndex((e) => e.id === eventId);
  const before = idx >= 0 ? entries.slice(Math.max(0, idx - 3), idx) : [];
  const focus = idx >= 0 ? entries[idx] : null;
  const after = idx >= 0 ? entries.slice(idx + 1, idx + 4) : [];

  return (
    <section className={["flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4", className ?? ""].join(" ")}
             aria-label="Audit trace">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Audit trace · {eventId}</div>
      {!focus && (
        <div className="rounded border border-dashed border-[var(--border)] px-3 py-6 text-center font-mono text-[10.5px] text-[var(--text-muted)]">
          event not found
        </div>
      )}
      {focus && (
        <ol className="flex flex-col gap-1.5">
          {before.map((e) => <Row key={e.id} entry={e} tone="muted" />)}
          <Row entry={focus} tone="focus" />
          {after.map((e) => <Row key={e.id} entry={e} tone="muted" />)}
        </ol>
      )}
    </section>
  );
}

function Row({ entry, tone }: { entry: AuditChainEntry; tone: "focus" | "muted" }) {
  return (
    <li className={["rounded border px-3 py-2",
      tone === "focus" ? "border-emerald-500/40 bg-emerald-500/[0.06]" : "border-[var(--border-subtle)] bg-[var(--bg-subtle)]"].join(" ")}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10.5px] text-[var(--text)]">{entry.action}</span>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">{entry.actor}</span>
        {entry.ruleSetVersion && (
          <span className="rounded bg-purple-500/15 px-1 py-0.5 font-mono text-[8.5px] text-purple-300">{entry.ruleSetVersion}</span>
        )}
        <span className="ml-auto font-mono text-[9.5px] text-[var(--text-muted)]">{new Date(entry.at).toLocaleString()}</span>
      </div>
      <div className="mt-0.5 truncate font-mono text-[10px] text-[var(--text-muted)]">{entry.subject}</div>
    </li>
  );
}

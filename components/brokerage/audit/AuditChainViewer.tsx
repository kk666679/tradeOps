"use client";
import { useState } from "react";
import type { AuditChainEntry } from "../hooks/useAuditChain";

export interface AuditChainViewerProps {
  entries: AuditChainEntry[];
  onVerify?: () => Promise<boolean>;
  className?: string;
}

export function AuditChainViewer({ entries, onVerify, className }: AuditChainViewerProps) {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const runVerify = async () => {
    if (!onVerify) return;
    setBusy(true);
    try { setVerified(await onVerify()); } finally { setBusy(false); }
  };

  return (
    <section className={["flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4", className ?? ""].join(" ")}
             aria-label="Audit chain">
      <header className="flex items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Audit chain · {entries.length} entries
        </div>
        <div className="flex items-center gap-2">
          {verified !== null && (
            <span className={["rounded px-2 py-0.5 font-mono text-[10px]",
              verified ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"].join(" ")}>
              {verified ? "✓ chain intact" : "✕ chain broken"}
            </span>
          )}
          {onVerify && (
            <button type="button" onClick={runVerify} disabled={busy}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-2.5 py-1 font-mono text-[10.5px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-muted)] disabled:opacity-50">
              {busy ? "verifying…" : "Verify"}
            </button>
          )}
        </div>
      </header>
      <ul className="flex flex-col gap-1.5">
        {entries.map((e) => (
          <li key={e.id} className="grid grid-cols-[1fr_auto] gap-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10.5px] text-[var(--text)]">{e.action}</span>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">{e.actor}</span>
                {e.ruleSetVersion && (
                  <span className="rounded bg-purple-500/15 px-1 py-0.5 font-mono text-[8.5px] text-purple-300">
                    {e.ruleSetVersion}
                  </span>
                )}
              </div>
              <div className="mt-0.5 truncate font-mono text-[10px] text-[var(--text-muted)]">{e.subject}</div>
              {e.controlIds && e.controlIds.length > 0 && (
                <div className="mt-0.5 flex flex-wrap gap-1">
                  {e.controlIds.slice(0, 4).map((c) => (
                    <span key={c} className="rounded bg-[var(--bg-elev)] px-1 py-0.5 font-mono text-[8.5px] text-[var(--text-muted)]">{c}</span>
                  ))}
                </div>
              )}
            </div>
            <span className="whitespace-nowrap font-mono text-[9.5px] text-[var(--text-muted)]">
              {new Date(e.at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

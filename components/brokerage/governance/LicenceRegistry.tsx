"use client";
import type { AccreditationData } from "../types";
import { ACCREDITATION_STATUS_META } from "../constants";

export interface LicenceRegistryProps {
  licences: AccreditationData[];
  onRenew?: (licenceNumber: string) => void;
  className?: string;
}

export function LicenceRegistry({ licences, onRenew, className }: LicenceRegistryProps) {
  return (
    <section className={["flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4", className ?? ""].join(" ")}
             aria-label="Licence registry">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Licence registry · {licences.length}</div>
      <ul className="flex flex-col gap-1.5">
        {licences.map((l) => {
          const meta = ACCREDITATION_STATUS_META[l.status];
          const days = Math.floor((new Date(l.expiresAt).getTime() - Date.now()) / 86400000);
          return (
            <li key={l.licenceNumber} className="flex items-center gap-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[11px] text-[var(--text)]">{l.licenceNumber}</div>
                <div className="font-mono text-[10px] text-[var(--text-muted)]">
                  {l.ejenType} · expires {new Date(l.expiresAt).toLocaleDateString()} ({days}d)
                </div>
              </div>
              <span className="rounded px-2 py-0.5 font-mono text-[10px]" style={{ background: meta.bg, color: meta.color }}>
                {meta.label}
              </span>
              {onRenew && (l.status === "active" || l.status === "expiring-soon") && days <= 90 && (
                <button type="button" onClick={() => onRenew(l.licenceNumber)}
                  className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 hover:bg-emerald-500/20">
                  Renew
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

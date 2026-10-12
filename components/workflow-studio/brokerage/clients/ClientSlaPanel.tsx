"use client";
import type { BrokerClient } from "../types";

const SLA_TABLE: Record<BrokerClient["sla"], { draft: string; approve: string }> = {
  critical: { draft: "4h", approve: "12h" },
  priority: { draft: "8h", approve: "1d"  },
  standard: { draft: "1d", approve: "2d"  },
};

export function ClientSlaPanel({ client, breaches = 0, className }: {
  client: BrokerClient; breaches?: number; className?: string;
}) {
  const sla = SLA_TABLE[client.sla];
  return (
    <div className={["flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4", className ?? ""].join(" ")}
         aria-label="Client SLA">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">SLA · {client.sla}</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-2">
          <div className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">Draft deadline</div>
          <div className="font-mono text-[14px] font-semibold text-[var(--text)]">{sla.draft}</div>
        </div>
        <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3 py-2">
          <div className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">Approval deadline</div>
          <div className="font-mono text-[14px] font-semibold text-[var(--text)]">{sla.approve}</div>
        </div>
      </div>
      <div className={["rounded-md px-3 py-2 font-mono text-[10.5px]",
        breaches > 0 ? "border border-red-500/25 bg-red-500/[0.06] text-red-400"
                     : "border border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-400"].join(" ")}>
        {breaches > 0 ? `${breaches} breach(es) in last 90 days` : "No breaches in last 90 days"}
      </div>
    </div>
  );
}

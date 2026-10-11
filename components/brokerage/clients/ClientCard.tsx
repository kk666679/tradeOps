"use client";
import { memo } from "react";
import type { BrokerClient } from "../types";

const TIER_COLOR: Record<BrokerClient["tier"], string> = {
  enterprise: "#a855f7", growth: "#f59e0b", starter: "#94a3b8",
};

function ClientCardImpl({ client, onClick }: { client: BrokerClient; onClick?: () => void }) {
  const tierColor = TIER_COLOR[client.tier];
  return (
    <button type="button" onClick={onClick}
      className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-3.5 text-left transition-colors hover:border-[var(--border-strong)]"
      aria-label={`Client ${client.name}`}>
      <div className="flex items-center gap-2">
        <span className="rounded px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase"
              style={{ background: `${tierColor}22`, color: tierColor }}>{client.tier}</span>
        <span className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[9.5px] text-[var(--text-muted)]">
          SLA {client.sla}
        </span>
        <span className="ml-auto flex items-center gap-1 font-mono text-[9.5px]">
          {client.authorization.written
            ? <><span className="text-emerald-400">✓</span><span className="text-emerald-400">§90(1)(b)</span></>
            : <><span className="text-red-400">✕</span><span className="text-red-400">no auth</span></>}
        </span>
      </div>
      <div className="text-[13px] font-semibold text-[var(--text)]">{client.name}</div>
      <div className="font-mono text-[10px] text-[var(--text-muted)]">
        {client.registrationNumber} · {client.registeredState}, {client.country}
      </div>
      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 font-mono text-[10px] text-[var(--text-muted)]">
        <span>{client.monthlyVolume} decl/mo</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: client.status === "active" ? "#10b981" : "#ef4444" }} />
          {client.status}
        </span>
      </div>
    </button>
  );
}
export const ClientCard = memo(ClientCardImpl);
ClientCard.displayName = "ClientCard";

"use client";
import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ClientNodeData } from "../../types";

const TIER_COLOR: Record<ClientNodeData["tier"], string> = {
  enterprise: "#a855f7", growth: "#f59e0b", starter: "#94a3b8",
};

function ClientNodeImpl({ data }: NodeProps & { data: ClientNodeData }) {
  const tierColor = TIER_COLOR[data.tier];
  return (
    <div role="button" tabIndex={0} aria-label={`Client: ${data.name}`}
      className="flex w-[220px] flex-col rounded-lg border border-blue-500/40 bg-[var(--bg-elev)] px-3 py-2.5 shadow-sm"
      style={{ borderLeftWidth: 4, borderLeftColor: "#3b82f6" }}>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2" />
      <div className="flex items-center gap-1.5">
        <span className="rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase"
              style={{ background: `${tierColor}22`, color: tierColor }}>{data.tier}</span>
        <span className="rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-muted)]">{data.sla}</span>
      </div>
      <span className="mt-1 text-[12px] font-semibold text-[var(--text)]">{data.name}</span>
      <span className="font-mono text-[10px] text-[var(--text-muted)]">{data.registeredState}</span>
      <span className="mt-1.5 flex items-center gap-1 font-mono text-[9.5px]">
        {data.authorized
          ? <><span className="text-emerald-400">✓</span><span className="text-emerald-400">§90(1)(b)</span></>
          : <><span className="text-red-400">✕</span><span className="text-red-400">no written authority</span></>}
      </span>
    </div>
  );
}
export const ClientNode = memo(ClientNodeImpl);
ClientNode.displayName = "ClientNode";

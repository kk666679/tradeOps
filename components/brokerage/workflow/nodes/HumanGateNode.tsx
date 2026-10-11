"use client";
import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { HumanGateNodeData } from "../../types";

function HumanGateNodeImpl({ data }: NodeProps & { data: HumanGateNodeData }) {
  return (
    <div role="button" tabIndex={0} aria-label={`Human gate: ${data.label}`} title={data.description}
      className="flex w-[220px] flex-col rounded-lg border border-amber-500/40 bg-[var(--bg-elev)] px-3 py-2.5 shadow-sm"
      style={{ borderLeftWidth: 4, borderLeftColor: "#f59e0b" }}>
      <Handle type="target" position={Position.Left}  className="!h-2 !w-2" />
      <Handle type="source" position={Position.Right} className="!h-2 !w-2" />
      <span className="font-mono text-[9.5px] uppercase tracking-wider text-amber-400">
        HITL{data.regulation ? ` · ${data.regulation}` : ""}
      </span>
      <span className="mt-0.5 text-[12px] font-semibold text-[var(--text)]">{data.label}</span>
      <span className="mt-0.5 font-mono text-[10px] text-[var(--text-secondary)]">requires {data.requiredRole}</span>
      {data.slaMinutes !== undefined && <span className="mt-0.5 font-mono text-[9.5px] text-[var(--text-muted)]">SLA {data.slaMinutes}m</span>}
    </div>
  );
}
export const HumanGateNode = memo(HumanGateNodeImpl);
HumanGateNode.displayName = "HumanGateNode";

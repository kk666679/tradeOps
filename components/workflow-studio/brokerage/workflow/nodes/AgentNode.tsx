"use client";
import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { AgentNodeData } from "../../types";

const ROLE_COLOR: Record<AgentNodeData["role"], string> = {
  customs: "#10b981", document: "#3b82f6", risk: "#f59e0b", ops: "#8b5cf6", permit: "#06b6d4",
};

function AgentNodeImpl({ data }: NodeProps & { data: AgentNodeData }) {
  const color = ROLE_COLOR[data.role] ?? "#10b981";
  return (
    <div role="button" tabIndex={0} aria-label={`Agent: ${data.name}`}
      className="flex w-[210px] flex-col rounded-lg border bg-[var(--bg-elev)] px-3 py-2.5 shadow-sm"
      style={{ borderColor: `${color}55`, borderLeftWidth: 4, borderLeftColor: color }}>
      <Handle type="target" position={Position.Left}  className="!h-2 !w-2" />
      <Handle type="source" position={Position.Right} className="!h-2 !w-2" />
      <span className="font-mono text-[9.5px] uppercase tracking-wider" style={{ color }}>Agent · {data.role}</span>
      <span className="mt-0.5 text-[12px] font-semibold text-[var(--text)]">{data.name}</span>
      <span className="font-mono text-[9.5px] text-[var(--text-muted)]">{data.agentId}</span>
      <div className="mt-1 flex flex-wrap gap-1">
        {data.capabilities.slice(0, 3).map((c) => (
          <span key={c} className="rounded bg-[var(--bg-subtle)] px-1 py-0.5 font-mono text-[8.5px] text-[var(--text-muted)]">{c}</span>
        ))}
      </div>
    </div>
  );
}
export const AgentNode = memo(AgentNodeImpl);
AgentNode.displayName = "AgentNode";

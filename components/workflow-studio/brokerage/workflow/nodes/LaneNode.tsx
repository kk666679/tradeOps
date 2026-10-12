"use client";
import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { LaneNodeData } from "../../types";

const LAYER_COLOR: Record<LaneNodeData["layer"], string> = {
  operations: "#10b981",
  regulatory: "#ef4444",
  authorization: "#f59e0b",
  engagement: "#3b82f6",
};

function LaneNodeImpl({ data }: NodeProps & { data: LaneNodeData }) {
  const color = LAYER_COLOR[data.layer];
  return (
    <div role="heading" aria-level={3} aria-label={`Lane: ${data.label}`}
      className="flex w-[240px] flex-col gap-1 rounded-lg border bg-[var(--bg-subtle)] px-3 py-2.5"
      style={{ borderLeftWidth: 4, borderLeftColor: color }}>
      <Handle type="source" position={Position.Right} className="!opacity-0" />
      <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wider" style={{ color }}>
        {data.layer}{data.phase ? ` · ${data.phase}` : ""}
      </span>
      <span className="text-[13px] font-semibold text-[var(--text)]">{data.label}</span>
      {data.description && <span className="text-[10.5px] leading-snug text-[var(--text-muted)]">{data.description}</span>}
    </div>
  );
}
export const LaneNode = memo(LaneNodeImpl);
LaneNode.displayName = "LaneNode";

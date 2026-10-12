"use client";
import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ComplianceNodeData } from "../../types";

const CAT_COLOR: Record<ComplianceNodeData["category"], string> = {
  regulatory: "#ef4444", operational: "#f59e0b", "due-diligence": "#8b5cf6",
};

function ComplianceNodeImpl({ data }: NodeProps & { data: ComplianceNodeData }) {
  const color = CAT_COLOR[data.category];
  return (
    <div role="button" tabIndex={0} aria-label={`Compliance: ${data.label}`}
      className="flex w-[210px] flex-col rounded-lg border bg-[var(--bg-elev)] px-3 py-2.5 shadow-sm"
      style={{ borderColor: `${color}55`, borderLeftWidth: 4, borderLeftColor: color }}>
      <Handle type="target" position={Position.Left} className="!h-2 !w-2" />
      <span className="font-mono text-[9.5px] uppercase tracking-wider" style={{ color }}>
        {data.category} · {data.action}
      </span>
      <span className="mt-0.5 text-[11.5px] font-semibold text-[var(--text)]">{data.label}</span>
      <span className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[var(--text-muted)]">{data.description}</span>
      {data.legalRef && <span className="mt-1 font-mono text-[9px] text-[var(--text-muted)]">{data.legalRef}</span>}
    </div>
  );
}
export const ComplianceNode = memo(ComplianceNodeImpl);
ComplianceNode.displayName = "ComplianceNode";

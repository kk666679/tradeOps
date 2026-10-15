"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export function UnsupportedNode({ data }: NodeProps) {
  const nodeData = data as Record<string, unknown>;
  const label = typeof nodeData.label === "string" ? nodeData.label : "Unsupported node";
  const type = typeof nodeData.nodeType === "string" ? nodeData.nodeType : "unknown type";

  return (
    <div className="min-w-40 rounded border border-amber-500/60 bg-slate-950 px-3 py-2 shadow-lg">
      <Handle type="target" position={Position.Left} />
      <div className="font-mono text-[10px] uppercase text-amber-300">Not executable here</div>
      <div className="mt-1 text-xs font-semibold text-slate-100">{label}</div>
      <div className="mt-1 break-all font-mono text-[9px] text-slate-400">{type}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
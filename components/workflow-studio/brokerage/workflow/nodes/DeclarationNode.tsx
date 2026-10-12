"use client";
import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { DeclarationNodeData } from "../../types";
import { CHANNEL_META, DECLARATION_FORM_COLOR, DECLARATION_STATUS_LABEL } from "../../constants";

function DeclarationNodeImpl({ data }: NodeProps & { data: DeclarationNodeData }) {
  const formColor = DECLARATION_FORM_COLOR[data.formCode];
  const channel = CHANNEL_META[data.channel];
  return (
    <div role="button" tabIndex={0} aria-label={`Declaration: ${data.reference}`}
      className="flex w-[260px] flex-col rounded-lg border border-violet-500/40 bg-[var(--bg-elev)] px-3 py-2.5 shadow-sm"
      style={{ borderLeftWidth: 4, borderLeftColor: formColor }}>
      <Handle type="target" position={Position.Left}  className="!h-2 !w-2" />
      <Handle type="source" position={Position.Right} className="!h-2 !w-2" />
      <div className="flex items-center gap-2">
        <span className="rounded px-1.5 py-0.5 font-mono text-[9.5px] font-semibold"
              style={{ background: `${formColor}22`, color: formColor }}>{data.formCode}</span>
        <span className="font-mono text-[9.5px] text-[var(--text-muted)]">{data.type}</span>
        {data.channel !== "UNASSIGNED" && (
          <span className="ml-auto rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold"
                style={{ background: channel.bg, color: channel.color }}>{channel.label}</span>
        )}
      </div>
      <span className="mt-1 font-mono text-[11.5px] font-semibold text-[var(--text)]">{data.reference}</span>
      <span className="text-[10.5px] text-[var(--text-secondary)]">{data.clientName}</span>
      <div className="mt-1.5 flex items-center justify-between font-mono text-[9.5px]">
        <span className="text-[var(--text-muted)]">{DECLARATION_STATUS_LABEL[data.status] ?? data.status}</span>
        {data.gateOutcome && (
          <span className={data.gateOutcome.allowed ? "text-emerald-400" : "text-red-400"}>
            {data.gateOutcome.allowed ? "✓ gate" : `✕ ${data.gateOutcome.blockingCount}`}
          </span>
        )}
      </div>
      {data.flags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {data.flags.slice(0, 3).map((f) => (
            <span key={f} className="rounded bg-[var(--bg-subtle)] px-1 py-0.5 font-mono text-[8.5px] text-[var(--text-muted)]">{f}</span>
          ))}
        </div>
      )}
    </div>
  );
}
export const DeclarationNode = memo(DeclarationNodeImpl);
DeclarationNode.displayName = "DeclarationNode";

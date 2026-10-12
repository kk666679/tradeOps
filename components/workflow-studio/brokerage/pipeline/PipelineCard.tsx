"use client";
import { memo } from "react";
import type { Declaration } from "../types";
import { CHANNEL_META, DECLARATION_FORM_COLOR } from "../constants";

function PipelineCardImpl({ declaration, onClick, draggable = true }: {
  declaration: Declaration; onClick?: () => void; draggable?: boolean;
}) {
  const color = DECLARATION_FORM_COLOR[declaration.formCode];
  const channel = CHANNEL_META[declaration.channel];
  const ageH = Math.floor((Date.now() - new Date(declaration.updatedAt).getTime()) / 3600000);

  return (
    <button type="button" onClick={onClick} draggable={draggable}
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", declaration.reference); e.dataTransfer.effectAllowed = "move"; }}
      className="flex w-full cursor-grab flex-col gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2.5 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)]"
      aria-label={`Declaration ${declaration.reference}`}>
      <div className="flex items-center gap-2">
        <span className="rounded px-1.5 py-0.5 font-mono text-[9.5px] font-semibold"
              style={{ background: `${color}22`, color }}>{declaration.formCode}</span>
        {declaration.channel !== "UNASSIGNED" && (
          <span className="rounded px-1 py-0.5 font-mono text-[8.5px] font-semibold"
                style={{ background: channel.bg, color: channel.color }}>{declaration.channel}</span>
        )}
        <span className="truncate font-mono text-[10.5px] text-[var(--text)]">{declaration.reference}</span>
        <span className="ml-auto font-mono text-[9.5px] text-[var(--text-muted)]">{ageH}h</span>
      </div>
      <div className="truncate text-[11px] text-[var(--text-secondary)]">{declaration.clientName}</div>
      <div className="flex items-center justify-between font-mono text-[9.5px] text-[var(--text-muted)]">
        <span>RM {declaration.totalDeclaredValue.toLocaleString()}</span>
        {declaration.gateResult && (
          <span className={declaration.gateResult.allowedToProceed ? "text-emerald-400" : "text-red-400"}>
            {declaration.gateResult.allowedToProceed ? "✓ gate" : `✕ ${declaration.gateResult.blockingControlIds.length}`}
          </span>
        )}
      </div>
    </button>
  );
}
export const PipelineCard = memo(PipelineCardImpl);
PipelineCard.displayName = "PipelineCard";

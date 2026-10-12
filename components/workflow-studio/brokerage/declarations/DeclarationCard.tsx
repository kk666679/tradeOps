"use client";
import { memo } from "react";
import type { Declaration } from "../types";
import { DECLARATION_FORM_COLOR, DECLARATION_STATUS_LABEL } from "../constants";

function DeclarationCardImpl({ declaration, onClick }: { declaration: Declaration; onClick?: () => void }) {
  const color = DECLARATION_FORM_COLOR[declaration.formCode];
  return (
    <button type="button" onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)]"
      aria-label={`Declaration ${declaration.reference}`}>
      <span className="rounded px-1.5 py-0.5 font-mono text-[9.5px] font-semibold"
            style={{ background: `${color}22`, color }}>{declaration.formCode}</span>
      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-[var(--text)]">{declaration.reference}</span>
      <span className="min-w-0 flex-1 truncate text-[11px] text-[var(--text-secondary)]">{declaration.clientName}</span>
      <span className="whitespace-nowrap font-mono text-[10px] text-[var(--text-muted)]">
        {DECLARATION_STATUS_LABEL[declaration.status]}
      </span>
      {declaration.gateResult && (
        <span className={["font-mono text-[9.5px]",
          declaration.gateResult.allowedToProceed ? "text-emerald-400" : "text-red-400"].join(" ")}>
          {declaration.gateResult.allowedToProceed ? "✓" : `✕${declaration.gateResult.blockingControlIds.length}`}
        </span>
      )}
      {declaration.flags.length > 0 && (
        <span className="font-mono text-[9.5px] text-amber-400">⚑ {declaration.flags.length}</span>
      )}
    </button>
  );
}
export const DeclarationCard = memo(DeclarationCardImpl);
DeclarationCard.displayName = "DeclarationCard";

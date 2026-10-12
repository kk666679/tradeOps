"use client";

import { Handle, Position, NodeResizer } from "@xyflow/react";
import type { ReactNode } from "react";
import type { Provenance } from "../types/workflow";

export type NodeExecutionState = "idle" | "running" | "succeeded" | "failed" | "skipped" | "waiting" | "blocked";

const STATE_COLOR: Record<NodeExecutionState, string> = {
  idle: "#71717a",
  running: "#3b82f6",
  succeeded: "#10b981",
  failed: "#ef4444",
  skipped: "#a1a1aa",
  waiting: "#f59e0b",
  blocked: "#f97316",
};

const PROVENANCE_LABEL: Record<Provenance, string> = {
  production_api: "JKDM",
  manual_observation: "manual",
  synthetic: "SYNTHETIC",
};

export interface NodeShellProps {
  title: string;
  subtitle?: string;
  state?: NodeExecutionState;
  provenance?: Provenance;
  selected?: boolean;
  hasInput?: boolean;
  hasOutput?: boolean;
  outputHandles?: Array<{ id: string; label: string; color?: string }>;
  resizable?: boolean;
  requiresCapability?: boolean;
  capabilityUnavailable?: boolean;
  approvalRequired?: boolean;
  externalSideEffect?: boolean;
  children?: ReactNode;
  width?: number;
}

export function NodeShell({
  title, subtitle, state = "idle", provenance, selected = false,
  hasInput = true, hasOutput = true, outputHandles,
  resizable = true, requiresCapability = false, capabilityUnavailable = false,
  approvalRequired = false, externalSideEffect = false, children, width = 220,
}: NodeShellProps) {
  const accent = STATE_COLOR[state];
  const provenanceTag = provenance ? PROVENANCE_LABEL[provenance] : null;
  const provenanceColor = provenance === "synthetic" ? "#f59e0b"
    : provenance === "manual_observation" ? "#8b5cf6"
    : provenance === "production_api" ? "#10b981" : null;

  return (
    <div
      role="group"
      aria-label={`${title} node`}
      className={[
        "flex h-full w-full flex-col rounded-lg border bg-[var(--bg-elev)] shadow-sm transition-all",
        selected ? "ring-2 ring-emerald-500/40" : "",
        capabilityUnavailable ? "opacity-70" : "",
      ].join(" ")}
      style={{ borderColor: "var(--border)", borderLeftWidth: 4, borderLeftColor: accent, width }}
    >
      {resizable && (
        <NodeResizer
          minWidth={200} minHeight={80} isVisible={selected}
          lineClassName="!border-emerald-500/50"
          handleClassName="!bg-emerald-500 !border-emerald-300"
        />
      )}

      {hasInput && (
        <Handle type="target" position={Position.Left} id="in"
          className="!h-2 !w-2 !border-2 !border-[var(--bg-elev)]" style={{ background: accent }} />
      )}

      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} aria-hidden />
        <span className="truncate text-[12px] font-semibold text-[var(--text)]">{title}</span>

        {approvalRequired && (
          <span title="Requires human approval"
            className="rounded bg-amber-500/15 px-1 py-0.5 font-mono text-[8.5px] text-amber-400">HITL</span>
        )}
        {externalSideEffect && (
          <span title="Can cause external side effects"
            className="rounded bg-red-500/15 px-1 py-0.5 font-mono text-[8.5px] text-red-400">EXT</span>
        )}
        {provenanceTag && provenanceColor && (
          <span title="Provenance" className="ml-auto rounded px-1 py-0.5 font-mono text-[8.5px]"
            style={{ background: `${provenanceColor}22`, color: provenanceColor }}>
            {provenanceTag}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="truncate px-3 pt-1.5 font-mono text-[10px] text-[var(--text-muted)]">{subtitle}</div>
      )}

      {children && <div className="flex-1 overflow-hidden px-3 py-2">{children}</div>}

      {capabilityUnavailable && (
        <div className="border-t border-red-500/25 bg-red-500/[0.06] px-3 py-1 font-mono text-[9.5px] text-red-400">
          JKDM integration unavailable
        </div>
      )}

      {outputHandles
        ? outputHandles.map((h, i) => (
            <Handle key={h.id} type="source" position={Position.Right} id={h.id}
              style={{ background: h.color ?? accent, top: `${30 + i * 30}%` }}
              className="!h-2 !w-2 !border-2 !border-[var(--bg-elev)]" />
          ))
        : hasOutput && (
            <Handle type="source" position={Position.Right} id="out"
              className="!h-2 !w-2 !border-2 !border-[var(--bg-elev)]" style={{ background: accent }} />
          )}
    </div>
  );
}

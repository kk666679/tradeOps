"use client";
import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { AccreditationNodeData } from "../../types";
import { CONTROL_OUTCOME_META, STATUS_COLOR } from "../../constants";

const SEVERITY_META: Record<AccreditationNodeData["severity"], { color: string; bg: string; icon: string }> = {
  info:  { color: "#10b981", bg: "rgba(16,185,129,0.08)", icon: "✓" },
  warn:  { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", icon: "⚠" },
  block: { color: "#ef4444", bg: "rgba(239,68,68,0.08)",  icon: "✕" },
};

function AccreditationNodeImpl({ data, selected }: NodeProps & { data: AccreditationNodeData }) {
  const meta = SEVERITY_META[data.severity];
  const statusColor = STATUS_COLOR[data.status] ?? "#71717a";
  const outcomeMeta = data.outcome ? CONTROL_OUTCOME_META[data.outcome] : null;
  const hasUnverified = data.references?.some((r) => r.verificationStatus !== "VERIFIED");

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Regulatory control: ${data.label}, section ${data.section}, status ${data.status}`}
      title={data.consequence ? `If violated: ${data.consequence}` : undefined}
      className={["group relative flex w-[240px] flex-col rounded-lg border bg-[var(--bg-elev)] shadow-md transition-all",
        selected ? "ring-2 ring-emerald-500/40" : ""].join(" ")}
      style={{
        borderColor: data.status === "active" ? "#3b82f6"
          : data.status === "error" ? "#ef4444"
          : data.status === "blocked" ? "#f59e0b" : "var(--border)",
        borderLeftWidth: 4, borderLeftColor: meta.color,
      }}
    >
      <Handle type="target" position={Position.Left}  className="!h-2 !w-2 !border-2 !border-[var(--bg-elev)] !bg-[var(--border)]" />
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-2 !border-[var(--bg-elev)] !bg-[var(--border)]" />

      <div className="flex items-center gap-2 rounded-t-lg border-b px-3 py-1.5"
           style={{ background: meta.bg, borderColor: `${meta.color}33` }}>
        <span className="font-mono text-[10px]" style={{ color: meta.color }}>{meta.icon}</span>
        <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
          {data.section}
        </span>
        {data.ruleVersion !== undefined && (
          <span className="font-mono text-[8.5px] text-[var(--text-muted)]">v{data.ruleVersion}</span>
        )}
        {outcomeMeta && (
          <span className="ml-auto rounded px-1 py-0.5 font-mono text-[8.5px] font-semibold"
                style={{ background: outcomeMeta.bg, color: outcomeMeta.color }}>
            {outcomeMeta.label}
          </span>
        )}
        {!outcomeMeta && (
          <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: statusColor }} aria-hidden />
        )}
      </div>

      <div className="px-3 py-2.5">
        <div className="text-[12px] font-semibold leading-snug text-[var(--text)]">{data.label}</div>
        <div className="mt-1 line-clamp-2 font-mono text-[9.5px] leading-snug text-[var(--text-muted)]">
          {data.summary}
        </div>

        {data.controlId && (
          <div className="mt-1.5 font-mono text-[8.5px] text-[var(--text-muted)]">
            <span className="opacity-60">control</span> {data.controlId}
          </div>
        )}

        {data.state && (
          <div className="mt-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9.5px]"
               style={{ background: `${meta.color}15`, color: meta.color }}>
            {data.state}
          </div>
        )}

        {data.deadlineDays !== undefined && (
          <div className="mt-1.5 flex items-center gap-1 font-mono text-[9.5px]">
            <span className="text-[var(--text-muted)]">deadline</span>
            <span className={data.deadlineDays < 0 ? "text-red-400" : data.deadlineDays < 30 ? "text-amber-400" : "text-[var(--text-secondary)]"}>
              {data.deadlineDays < 0 ? `${Math.abs(data.deadlineDays)}d overdue` : `${data.deadlineDays}d remaining`}
            </span>
          </div>
        )}

        {hasUnverified && (
          <div className="mt-1.5 flex items-center gap-1 font-mono text-[8.5px] text-amber-400">
            <span>?</span><span>reference not verified</span>
          </div>
        )}
      </div>

      {(data.status === "error" || data.status === "blocked" || data.outcome === "FAIL") && (
        <span aria-hidden className="pointer-events-none absolute -inset-1 -z-10 rounded-lg opacity-50"
              style={{ background: `radial-gradient(circle at 50% 50%, ${meta.color}33, transparent 70%)` }} />
      )}
    </div>
  );
}

export const AccreditationNode = memo(AccreditationNodeImpl);
AccreditationNode.displayName = "AccreditationNode";

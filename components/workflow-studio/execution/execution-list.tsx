"use client";

import type { WorkflowExecution } from "../types/workflow";

export interface ExecutionListProps {
  executions: WorkflowExecution[];
  onSelect?: (executionId: string) => void;
}

const STATUS_COLOR: Record<string, string> = {
  queued: "#a1a1aa",
  running: "#60a5fa",
  succeeded: "#34d399",
  failed: "#f87171",
  cancelled: "#a1a1aa",
  waiting_approval: "#fbbf24",
  waiting_external: "#a78bfa",
  integration_required: "#f87171",
};

export function ExecutionList({ executions, onSelect }: ExecutionListProps) {
  if (executions.length === 0) {
    return <div className="rounded border border-dashed border-[var(--border)] px-3 py-8 text-center font-mono text-[11px] text-[var(--text-muted)]">no executions yet</div>;
  }
  return (
    <ul className="flex flex-col gap-1.5">
      {executions.map((e) => (
        <li key={e.id}>
          <button type="button" onClick={() => onSelect?.(e.id)}
            className="flex w-full items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-2 text-left transition-colors hover:bg-[var(--bg-subtle)]">
            <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLOR[e.status] ?? "#71717a" }} />
            <span className="font-mono text-[11px] text-[var(--text)]">{e.id}</span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">{e.triggerKind} · v{e.workflowVersion}</span>
            <span className="ml-auto font-mono text-[10px] text-[var(--text-muted)]">{new Date(e.startedAt).toLocaleString()}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

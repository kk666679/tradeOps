"use client";

import type { WorkflowExecution } from "../types/workflow";

export interface ExecutionDetailProps {
  execution: WorkflowExecution;
  onSelectNode?: (nodeId: string) => void;
}

export function ExecutionDetail({ execution, onSelectNode }: ExecutionDetailProps) {
  return (
    <div className="flex flex-col gap-3">
      <header className="flex items-center gap-3">
        <span className="font-mono text-[11px] text-[var(--text)]">{execution.id}</span>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">{execution.status}</span>
      </header>
      {execution.error && (
        <pre className="rounded border border-red-500/25 bg-red-500/[0.06] px-3 py-2 font-mono text-[10.5px] text-red-400">{execution.error}</pre>
      )}
      <ul className="flex flex-col gap-1.5">
        {execution.nodeRuns.map((run) => (
          <li key={run.id}>
            <button type="button" onClick={() => onSelectNode?.(run.nodeId)}
              className="flex w-full items-start gap-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-elev)] px-3 py-2 text-left hover:bg-[var(--bg-subtle)]">
              <span className="font-mono text-[10.5px] text-[var(--text)]">{run.nodeId}</span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">{run.status}</span>
              {run.provenance && <span className="font-mono text-[9.5px] text-[var(--text-muted)]">{run.provenance}</span>}
            </button>
          </li>
        ))}
      </ul>
      {execution.output !== undefined && (
        <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-elev)] p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Final output</div>
          <pre className="mt-1 overflow-x-auto font-mono text-[10.5px] text-[var(--text-secondary)]">{JSON.stringify(execution.output, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

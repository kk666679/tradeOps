"use client";

import { useState } from "react";
import type { WorkflowExecution } from "../types/workflow";
import { ManualResponseDialog } from "../runtime/manual-response-dialog";
import type { RecordManualResponseArgs } from "../lib/workflow-executor";

export interface WorkflowConsoleProps {
  execution: WorkflowExecution | null;
  running: boolean;
  error: string | null;
  onSelectNode?: (nodeId: string) => void;
  onRecordManualResponse?: (args: Omit<RecordManualResponseArgs, "executionId">) => Promise<void>;
  manualNodeId?: string;
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    pending: { bg: "rgba(113,113,122,0.15)", color: "#a1a1aa" },
    queued: { bg: "rgba(113,113,122,0.15)", color: "#a1a1aa" },
    running: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
    succeeded: { bg: "rgba(16,185,129,0.15)", color: "#34d399" },
    failed: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
    skipped: { bg: "rgba(161,161,170,0.15)", color: "#a1a1aa" },
    waiting: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24" },
    blocked: { bg: "rgba(249,115,22,0.15)", color: "#fb923c" },
    cancelled: { bg: "rgba(161,161,170,0.15)", color: "#a1a1aa" },
    waiting_approval: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24" },
    waiting_external: { bg: "rgba(139,92,246,0.15)", color: "#a78bfa" },
    integration_required: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
  };
  const s = map[status] ?? map.pending!;
  return (
    <span className="rounded px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider"
      style={{ background: s.bg, color: s.color }}>{status}</span>
  );
}

export function WorkflowConsole({
  execution, running, error, onSelectNode, onRecordManualResponse, manualNodeId,
}: WorkflowConsoleProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const canRecordManual = Boolean(
    execution && execution.status === "integration_required"
      && onRecordManualResponse && manualNodeId,
  );

  return (
    <section className="flex h-[240px] shrink-0 flex-col border-t border-[var(--border)] bg-[var(--bg)]" aria-label="Execution console">
      <header className="flex items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-elev)] px-4 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Console</span>
        {execution && (
          <>
            <StatusPill status={execution.status} />
            <span className="font-mono text-[10px] text-[var(--text-muted)]">{execution.id}</span>
            {execution.durationMs != null && (
              <span className="font-mono text-[10px] text-[var(--text-muted)]">{execution.durationMs} ms</span>
            )}
          </>
        )}
        {running && !execution && <span className="font-mono text-[10px] text-blue-400">queuing…</span>}

        {canRecordManual && (
          <button type="button" onClick={() => setDialogOpen(true)}
            className="ml-auto rounded-md border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 font-mono text-[10.5px] text-violet-300 hover:bg-violet-500/20">
            Record JKDM response manually
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-3">
        {error && (
          <div className="mb-2 rounded border border-red-500/25 bg-red-500/[0.06] px-3 py-2 font-mono text-[11px] text-red-400">{error}</div>
        )}
        {!execution && !error && !running && (
          <div className="py-6 text-center font-mono text-[10.5px] text-[var(--text-muted)]">
            no runs yet — click Run to execute the workflow
          </div>
        )}
        {execution && execution.nodeRuns.length === 0 && execution.status === "running" && (
          <div className="py-6 text-center font-mono text-[10.5px] text-[var(--text-muted)]">queued — waiting for first node…</div>
        )}
        {execution && execution.nodeRuns.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {execution.nodeRuns.map((run) => (
              <li key={run.id}>
                <button type="button" onClick={() => onSelectNode?.(run.nodeId)}
                  className="flex w-full items-start gap-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-elev)] px-3 py-2 text-left transition-colors hover:bg-[var(--bg-subtle)]">
                  <StatusPill status={run.status} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10.5px] text-[var(--text)]">{run.nodeId}</span>
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">{run.nodeType}</span>
                      {run.provenance && (
                        <span className="rounded px-1 py-0.5 font-mono text-[8.5px]"
                          style={{
                            background: run.provenance === "synthetic" ? "rgba(245,158,11,0.15)"
                              : run.provenance === "manual_observation" ? "rgba(139,92,246,0.15)"
                              : "rgba(16,185,129,0.15)",
                            color: run.provenance === "synthetic" ? "#fbbf24"
                              : run.provenance === "manual_observation" ? "#a78bfa" : "#34d399",
                          }}>
                          {run.provenance === "synthetic" ? "SYNTHETIC" : run.provenance === "manual_observation" ? "manual" : "JKDM"}
                        </span>
                      )}
                      {run.durationMs != null && (
                        <span className="ml-auto font-mono text-[9.5px] text-[var(--text-muted)]">{run.durationMs} ms</span>
                      )}
                    </div>
                    {run.error && <div className="mt-0.5 font-mono text-[10px] text-red-400">{run.error}</div>}
                    {run.output !== undefined && run.status === "succeeded" && (
                      <div className="mt-0.5 truncate font-mono text-[9.5px] text-[var(--text-muted)]">
                        → {JSON.stringify(run.output).slice(0, 120)}
                      </div>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {canRecordManual && onRecordManualResponse && execution && manualNodeId && (
        <ManualResponseDialog
          open={dialogOpen}
          executionId={execution.id}
          nodeId={manualNodeId}
          onCancel={() => setDialogOpen(false)}
          onSubmit={async (args) => { await onRecordManualResponse(args); setDialogOpen(false); }}
        />
      )}
    </section>
  );
}

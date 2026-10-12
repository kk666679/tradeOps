"use client";

import type { SaveStatus } from "../hooks/use-workflow-autosave";
import type { JkdmCapabilitySnapshot } from "../types/workflow";

export interface WorkflowToolbarProps {
  name: string;
  onNameChange: (name: string) => void;
  saveStatus: SaveStatus;
  onSave: () => void;
  onRun: () => void;
  onHistory: () => void;
  running: boolean;
  runnable: boolean;
  validationSummary: { errors: number; warnings: number };
  jkdmCaps: JkdmCapabilitySnapshot | null;
}

const SAVE_LABEL: Record<SaveStatus, { label: string; color: string }> = {
  saved:   { label: "Saved",      color: "#10b981" },
  unsaved: { label: "Unsaved",    color: "#f59e0b" },
  saving:  { label: "Saving…",    color: "#3b82f6" },
  error:   { label: "Save error", color: "#ef4444" },
};

export function WorkflowToolbar({
  name, onNameChange, saveStatus, onSave, onRun, onHistory,
  running, runnable, validationSummary, jkdmCaps,
}: WorkflowToolbarProps) {
  const save = SAVE_LABEL[saveStatus];
  const jkdmReady = jkdmCaps?.submitDeclaration === true;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-elev)] px-4 py-2">
      <input type="text" value={name} onChange={(e) => onNameChange(e.target.value)}
        aria-label="Workflow name"
        className="w-64 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-[14px] font-semibold text-[var(--text)] outline-none transition-colors hover:border-[var(--border)] focus:border-emerald-500/50" />

      <span className="flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px]"
        style={{ background: `${save.color}1a`, color: save.color }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: save.color }} />
        {save.label}
      </span>

      {validationSummary.errors > 0 && (
        <span className="rounded bg-red-500/15 px-2 py-0.5 font-mono text-[10px] text-red-400">
          {validationSummary.errors} error{validationSummary.errors === 1 ? "" : "s"}
        </span>
      )}
      {validationSummary.warnings > 0 && (
        <span className="rounded bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] text-amber-400">
          {validationSummary.warnings} warning{validationSummary.warnings === 1 ? "" : "s"}
        </span>
      )}

      {jkdmCaps && (
        <span className="rounded px-2 py-0.5 font-mono text-[10px]"
          style={{
            background: jkdmReady ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
            color: jkdmReady ? "#10b981" : "#f59e0b",
          }}>
          JKDM: {jkdmReady ? "ready" : "manual"}
        </span>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button type="button" onClick={onSave} disabled={saveStatus === "saving"}
          className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] disabled:opacity-50">
          Save
        </button>
        <button type="button" onClick={onRun} disabled={!runnable || running}
          title={!runnable ? "Fix validation errors first" : "Run a test execution"}
          className="rounded-md bg-emerald-500 px-3 py-1 font-mono text-[11px] font-medium text-emerald-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40">
          {running ? "Running…" : "Run"}
        </button>
        <button type="button" onClick={onHistory}
          className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]">
          History
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { RecordManualResponseArgs } from "../lib/workflow-executor";

export interface ManualResponseDialogProps {
  open: boolean;
  executionId: string;
  nodeId: string;
  onCancel: () => void;
  onSubmit: (args: Omit<RecordManualResponseArgs, "executionId" | "nodeId">) => Promise<void>;
}

export function ManualResponseDialog({ open, executionId, nodeId, onCancel, onSubmit }: ManualResponseDialogProps) {
  const [outcome, setOutcome] = useState<RecordManualResponseArgs["outcome"]>("released");
  const [externalRef, setExternalRef] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [officerId, setOfficerId] = useState("");
  const [observedAt, setObservedAt] = useState(new Date().toISOString().slice(0, 16));
  const [evidenceRef, setEvidenceRef] = useState("");
  const [exceptionReason, setExceptionReason] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const evidenceProvided = evidenceRef.trim().length > 0;
  const refProvided = externalRef.trim().length > 0;
  const exceptionProvided = exceptionReason.trim().length > 0;
  const canSubmit = (evidenceProvided || exceptionProvided) && (refProvided || exceptionProvided);

  const handleSubmit = async () => {
    setBusy(true); setError(null);
    try {
      await onSubmit({
        outcome,
        externalRef: refProvided ? externalRef : undefined,
        officerName: officerName || undefined,
        officerId: officerId || undefined,
        observedAt: new Date(observedAt).toISOString(),
        evidenceRef: evidenceProvided ? evidenceRef : undefined,
        exceptionReason: exceptionProvided ? exceptionReason : undefined,
        notes: notes || undefined,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-4">
        <h2 className="text-[14px] font-semibold text-[var(--text)]">Record JKDM response manually</h2>
        <p className="mt-1 text-[11.5px] text-[var(--text-muted)]">
          Use this when JKDM communicated the outcome out-of-band. Everything you record
          is audited. Records start in <span className="font-mono">pending_review</span> until
          a second user confirms them.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Outcome</span>
            <select value={outcome} onChange={(e) => setOutcome(e.target.value as RecordManualResponseArgs["outcome"])}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-[12px]">
              {["query","inspection","released","rejected","amended"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Observed at</span>
            <input type="datetime-local" value={observedAt} onChange={(e) => setObservedAt(e.target.value)}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-[12px]" />
          </label>

          <label className="col-span-2 flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              External reference {!refProvided && <span className="text-amber-400">(or explain below)</span>}
            </span>
            <input type="text" value={externalRef} onChange={(e) => setExternalRef(e.target.value)}
              placeholder="JKDM/PG/2026/0000123"
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 font-mono text-[11px]" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Officer name (optional)</span>
            <input type="text" value={officerName} onChange={(e) => setOfficerName(e.target.value)}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-[12px]" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Officer ID (optional)</span>
            <input type="text" value={officerId} onChange={(e) => setOfficerId(e.target.value)}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 font-mono text-[11px]" />
          </label>

          <label className="col-span-2 flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Evidence reference {!evidenceProvided && <span className="text-amber-400">(or explain below)</span>}
            </span>
            <input type="text" value={evidenceRef} onChange={(e) => setEvidenceRef(e.target.value)}
              placeholder="doc://release-order/JKDM-PG-2026-0000123.pdf"
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 font-mono text-[11px]" />
          </label>

          <label className="col-span-2 flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Exception reason (required if evidence or reference is missing)
            </span>
            <textarea rows={2} value={exceptionReason} onChange={(e) => setExceptionReason(e.target.value)}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-[12px]" />
          </label>

          <label className="col-span-2 flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Notes (optional)</span>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-[12px]" />
          </label>
        </div>

        {error && (
          <div className="mt-3 rounded border border-red-500/25 bg-red-500/[0.06] px-3 py-2 font-mono text-[10.5px] text-red-400">{error}</div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onCancel}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-1 font-mono text-[11px] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]">
            Cancel
          </button>
          <button type="button" onClick={() => void handleSubmit()} disabled={!canSubmit || busy}
            className="rounded-md bg-emerald-500 px-3 py-1 font-mono text-[11px] font-medium text-emerald-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            title={!canSubmit ? "Provide evidence or an exception reason" : ""}>
            {busy ? "Recording…" : "Record response"}
          </button>
        </div>
      </div>
    </div>
  );
}

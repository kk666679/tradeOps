"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  WorkflowExecution, ExecutionStatus, JkdmCapabilitySnapshot,
} from "../types/workflow";
import type { ExecutorClient, RecordManualResponseArgs, SubmitApprovalArgs } from "../lib/workflow-executor";

export interface UseWorkflowExecutionResult {
  running: boolean;
  executionId: string | null;
  status: ExecutionStatus | null;
  execution: WorkflowExecution | null;
  error: string | null;
  caps: JkdmCapabilitySnapshot | null;
  run: (triggerPayload?: unknown) => Promise<void>;
  cancelPolling: () => void;
  submitApproval: (args: Omit<SubmitApprovalArgs, "executionId">) => Promise<void>;
  recordManualResponse: (args: Omit<RecordManualResponseArgs, "executionId">) => Promise<void>;
  refreshCaps: () => Promise<void>;
}

const POLL_START_MS = 500;
const POLL_MAX_MS = 3000;

export function useWorkflowExecution(workflowId: string, client: ExecutorClient): UseWorkflowExecutionResult {
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caps, setCaps] = useState<JkdmCapabilitySnapshot | null>(null);

  const cancelled = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshCaps = useCallback(async () => {
    try { setCaps(await client.getJkdmCapabilities()); } catch { /* leave unknown */ }
  }, [client]);

  useEffect(() => { void refreshCaps(); }, [refreshCaps]);

  const cancelPolling = useCallback(() => {
    cancelled.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setRunning(false);
  }, []);

  const poll = useCallback(async (id: string, intervalMs: number) => {
    if (cancelled.current) return;
    try {
      const exec = await client.getExecution(id);
      setExecution(exec);
      // Terminal states — stop polling.
      if (["succeeded", "failed", "cancelled"].includes(exec.status)) { setRunning(false); return; }
      // Waiting states — keep polling but slower.
      const next = exec.status === "waiting_approval" || exec.status === "waiting_external"
        ? POLL_MAX_MS
        : Math.min(intervalMs * 1.5, POLL_MAX_MS);
      timerRef.current = setTimeout(() => void poll(id, next), next);
    } catch (e) {
      setError((e as Error).message);
      setRunning(false);
    }
  }, [client]);

  const run = useCallback(async (triggerPayload?: unknown) => {
    setError(null); setExecution(null); setExecutionId(null); setRunning(true);
    cancelled.current = false;
    try {
      const { executionId: id, status, reason } = await client.execute({ workflowId, triggerPayload });
      setExecutionId(id);
      if (status === "integration_required") {
        setError(reason ?? "JKDM integration is not configured");
        setRunning(false);
        return;
      }
      timerRef.current = setTimeout(() => void poll(id, POLL_START_MS), POLL_START_MS);
    } catch (e) {
      setError((e as Error).message); setRunning(false);
    }
  }, [client, workflowId, poll]);

  const submitApproval = useCallback(async (args: Omit<SubmitApprovalArgs, "executionId">) => {
    if (!executionId) throw new Error("no active execution");
    await client.submitApproval({ ...args, executionId });
    // Resume polling immediately.
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void poll(executionId, POLL_START_MS), POLL_START_MS);
  }, [client, executionId, poll]);

  const recordManualResponse = useCallback(async (args: Omit<RecordManualResponseArgs, "executionId">) => {
    if (!executionId) throw new Error("no active execution");
    await client.recordManualResponse({ ...args, executionId });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void poll(executionId, POLL_START_MS), POLL_START_MS);
  }, [client, executionId, poll]);

  useEffect(() => () => cancelPolling(), [cancelPolling]);

  return {
    running, executionId, status: execution?.status ?? null, execution, error, caps,
    run, cancelPolling, submitApproval, recordManualResponse, refreshCaps,
  };
}

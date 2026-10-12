// components/workflow-studio/lib/workflow-executor.ts

import type { WorkflowExecution, JkdmCapabilitySnapshot, Provenance } from "../types/workflow";

export interface ExecuteArgs {
  workflowId: string;
  triggerPayload?: unknown;
  /** Payload for a manual trigger. */
  manualInput?: Record<string, unknown>;
}

export interface ExecuteResult {
  executionId: string;
  status: "queued" | "integration_required";
  reason?: string;
}

export interface SubmitApprovalArgs {
  executionId: string;
  nodeId: string;
  decision: "approved" | "rejected";
  comment?: string;
}

export interface RecordManualResponseArgs {
  executionId: string;
  nodeId: string;
  outcome: "query" | "inspection" | "released" | "rejected" | "amended";
  externalRef?: string;
  exceptionReason?: string;
  officerName?: string;
  officerId?: string;
  observedAt: string;
  evidenceRef?: string;
  notes?: string;
}

export interface ExecutorClient {
  /** Snapshot of the JKDM adapter state — read on studio mount. */
  getJkdmCapabilities(): Promise<JkdmCapabilitySnapshot>;
  execute(args: ExecuteArgs): Promise<ExecuteResult>;
  getExecution(executionId: string): Promise<WorkflowExecution>;
  submitApproval(args: SubmitApprovalArgs): Promise<void>;
  recordManualResponse(args: RecordManualResponseArgs): Promise<void>;
}

export function createExecutorClient(impl: ExecutorClient): ExecutorClient {
  return impl;
}

export function isSynthetic(provenance: Provenance | undefined): boolean {
  return provenance === "synthetic";
}

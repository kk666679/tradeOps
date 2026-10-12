// backend/src/integrations/jkdm/audit/audit-events.ts

export type JkdmAuditKind =
  | "jkdm.submission.attempted"
  | "jkdm.submission.acknowledged"
  | "jkdm.submission.failed"
  | "jkdm.status.queried"
  | "jkdm.manual.recorded"
  | "jkdm.manual.reviewed"
  | "jkdm.integration.unavailable"
  | "jkdm.integration.misconfigured";

export interface JkdmAuditEvent {
  kind: JkdmAuditKind;
  at: string;
  tenantId: string;
  actorId: string;
  draftRef?: string;
  externalRef?: string;
  correlationId?: string;
  provenance?: "production_api" | "manual_observation" | "synthetic";
  attemptNumber?: number;
  outcome?: string;
  errorCode?: string;
  evidenceRefs?: string[];
  notes?: string;
}

export interface AuditSink {
  record(event: JkdmAuditEvent): Promise<void>;
}

/**
 * Default sink: structured log only. A real deployment wires this to the
 * platform's append-only audit chain (backend/src/workflow/persist.ts).
 */
export const logOnlyAuditSink: AuditSink = {
  async record(event) {
    // JSON line, redacted by the logger. No credentials, no officer PII.
    process.stderr.write(JSON.stringify({ __audit: true, ...event }) + "\n");
  },
};

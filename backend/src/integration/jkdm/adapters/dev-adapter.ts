// backend/src/integrations/jkdm/adapters/dev-adapter.ts

import { randomUUID } from "node:crypto";
import type {
  JkdmAdapter, JkdmCapabilities, DeclarationSubmission, SubmissionResult,
  DeclarationStatus, ManualResponse, ManualResponseRecord,
} from "../types";
import { DevAdapterRefusedError } from "../types";
import type { AuditSink } from "../audit/audit-events";
import { logOnlyAuditSink } from "../audit/audit-events";

const CAPABILITIES: JkdmCapabilities = {
  submitDeclaration: true,
  queryDeclarationStatus: true,
  submitManifest: false,
  queryManifest: false,
  requiresManualRecording: false,
};

const BANNER =
  "============================================================\n" +
  "  JKDM DEV ADAPTER — SYNTHETIC RESPONSES ONLY\n" +
  "  Not connected to JKDM. Every result carries synthetic:true.\n" +
  "============================================================";

export function createDevAdapter(audit: AuditSink = logOnlyAuditSink): JkdmAdapter {
  if (process.env.NODE_ENV === "production") {
    throw new DevAdapterRefusedError("dev adapter refuses to run when NODE_ENV=production");
  }
  process.stderr.write(BANNER + "\n");

  const channelFor = (cif: number): SubmissionResult["channel"] =>
    cif > 500_000 ? "RED" : cif > 100_000 ? "YELLOW" : "GREEN";

  return {
    mode: "development",
    capabilities: CAPABILITIES,

    async submitDeclaration(input: DeclarationSubmission): Promise<SubmissionResult> {
      const correlationId = randomUUID();
      const ref = `SYNTH-${input.formCode}-${input.draftRef}`;
      await audit.record({
        kind: "jkdm.submission.acknowledged",
        at: new Date().toISOString(),
        tenantId: input.tenantId,
        actorId: "system",
        draftRef: input.draftRef,
        externalRef: ref,
        correlationId,
        provenance: "synthetic",
        outcome: "synthetic_ack",
      });
      return {
        provenance: "synthetic",
        synthetic: true,
        acknowledged: false,
        externalRef: ref,
        channel: channelFor(input.totalCIFMYR),
        submittedAt: new Date().toISOString(),
        correlationId,
      };
    },

    async getDeclarationStatus(declarationRef: string): Promise<DeclarationStatus> {
      return {
        declarationRef,
        provenance: "synthetic",
        synthetic: true,
        channel: "GREEN",
        status: "released",
        releasedAt: new Date().toISOString(),
        lastCheckedAt: new Date().toISOString(),
      };
    },

    async recordManualResponse(input: ManualResponse): Promise<ManualResponseRecord> {
      return {
        recordId: randomUUID(),
        provenance: "manual_observation",
        draftRef: input.draftRef,
        tenantId: input.tenantId,
        recordedBy: input.recordedBy,
        outcome: input.outcome,
        externalRef: input.externalRef,
        exceptionReason: input.exceptionReason,
        officerName: input.officerName,
        officerId: input.officerId,
        notes: input.notes,
        observedAt: input.observedAt,
        evidenceRef: input.evidenceRef,
        additionalEvidenceRefs: input.additionalEvidenceRefs,
        recordedAt: new Date().toISOString(),
        reviewStatus: "pending_review",
      };
    },
  };
}

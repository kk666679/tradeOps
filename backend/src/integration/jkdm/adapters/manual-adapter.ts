// backend/src/integrations/jkdm/adapters/manual-adapter.ts

import { randomUUID } from "node:crypto";
import type {
  JkdmAdapter, JkdmCapabilities, DeclarationSubmission, SubmissionResult,
  DeclarationStatus, ManualResponse, ManualResponseRecord,
} from "../types";
import { IntegrationNotConfiguredError, UnsupportedOperationError } from "../types";
import type { AuditSink } from "../audit/audit-events";
import { logOnlyAuditSink } from "../audit/audit-events";

const CAPABILITIES: JkdmCapabilities = {
  submitDeclaration: false,
  queryDeclarationStatus: false,
  submitManifest: false,
  queryManifest: false,
  requiresManualRecording: true,
};

export function createManualAdapter(audit: AuditSink = logOnlyAuditSink): JkdmAdapter {
  return {
    mode: "manual",
    capabilities: CAPABILITIES,

    async submitDeclaration(input: DeclarationSubmission): Promise<SubmissionResult> {
      await audit.record({
        kind: "jkdm.integration.unavailable",
        at: new Date().toISOString(),
        tenantId: input.tenantId,
        actorId: "system",
        draftRef: input.draftRef,
        notes: "submitDeclaration called on manual adapter",
      });
      throw new IntegrationNotConfiguredError(
        "no JKDM transport configured; submit out-of-band and record the response manually",
      );
    },

    async getDeclarationStatus(declarationRef: string): Promise<DeclarationStatus> {
      throw new UnsupportedOperationError(
        `manual adapter cannot query status for ${declarationRef}; record a manual observation instead`,
      );
    },

    async recordManualResponse(input: ManualResponse): Promise<ManualResponseRecord> {
      // Evidence or a documented exception. No silent acceptance.
      if (!input.evidenceRef && !input.exceptionReason) {
        throw new (await import("../types")).ManualEvidenceRequiredError(
          "manual response requires evidenceRef or an explicit exceptionReason",
        );
      }
      if (!input.externalRef && !input.exceptionReason) {
        throw new (await import("../types")).ManualEvidenceRequiredError(
          "manual response requires externalRef or an explicit exceptionReason",
        );
      }

      const record: ManualResponseRecord = {
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

      await audit.record({
        kind: "jkdm.manual.recorded",
        at: record.recordedAt,
        tenantId: record.tenantId,
        actorId: record.recordedBy,
        draftRef: record.draftRef,
        externalRef: record.externalRef,
        provenance: "manual_observation",
        outcome: record.outcome,
        evidenceRefs: [
          ...(record.evidenceRef ? [record.evidenceRef] : []),
          ...(record.additionalEvidenceRefs ?? []),
        ],
        notes: record.exceptionReason,
      });

      return record;
    },
  };
}

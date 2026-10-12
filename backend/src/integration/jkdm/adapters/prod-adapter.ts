// backend/src/integrations/jkdm/adapters/prod-adapter.ts
//
// Refuses to construct unless the config explicitly marks the transport as
// verified AND production as enabled. Until official JKDM technical
// documentation is available, this adapter has no working transport and
// therefore exposes no capabilities.

import { randomUUID } from "node:crypto";
import type {
  JkdmAdapter, JkdmCapabilities, DeclarationSubmission, SubmissionResult,
  DeclarationStatus, ManualResponse, ManualResponseRecord,
} from "../types";
import { IntegrationUnavailableError } from "../types";
import type { JkdmConfig } from "../config";
import type { AuditSink } from "../audit/audit-events";
import { logOnlyAuditSink } from "../audit/audit-events";

/**
 * No capabilities are enabled until the actual JKDM transport is implemented
 * against official documentation. This is deliberate: config values are not
 * proof of a working integration.
 */
const CAPABILITIES: JkdmCapabilities = {
  submitDeclaration: false,
  queryDeclarationStatus: false,
  submitManifest: false,
  queryManifest: false,
  requiresManualRecording: true,
};

export function createProdAdapter(
  config: JkdmConfig,
  audit: AuditSink = logOnlyAuditSink,
): JkdmAdapter {
  if (
    config.mode !== "production" ||
    !config.productionEnabled ||
    !config.endpoint ||
    !config.clientCertPath ||
    !config.brokerCode
  ) {
    throw new IntegrationUnavailableError(
      "prod adapter requires mode=production, productionEnabled=true, and full credentials",
    );
  }

  // Transport is intentionally not implemented. When official JKDM
  // documentation and credentials are available, replace the two throws
  // below with real HTTPS calls to the verified endpoint, adding:
  //   - schema validation on request and response
  //   - bounded retries with idempotency keys
  //   - correlation id propagation
  //   - redaction of credentials and commercial data in logs
  //   - reconciliation for ambiguous network outcomes
  const transportNotImplemented = (): never => {
    throw new IntegrationUnavailableError(
      "JKDM production transport is not yet implemented; awaiting official documentation",
    );
  };

  return {
    mode: "production",
    capabilities: CAPABILITIES,

    async submitDeclaration(input: DeclarationSubmission): Promise<SubmissionResult> {
      const correlationId = randomUUID();
      await audit.record({
        kind: "jkdm.integration.unavailable",
        at: new Date().toISOString(),
        tenantId: input.tenantId,
        actorId: "system",
        draftRef: input.draftRef,
        correlationId,
        notes: "prod adapter has no verified transport",
      });
      transportNotImplemented();
    },

    async getDeclarationStatus(_declarationRef: string): Promise<DeclarationStatus> {
      transportNotImplemented();
    },

    async recordManualResponse(_input: ManualResponse): Promise<ManualResponseRecord> {
      throw new IntegrationUnavailableError(
        "prod adapter does not record manual responses; use the manual adapter",
      );
    },
  };
}

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  resolveJkdmConfig, resolveJkdmAdapter, __resetJkdmAdapterForTests,
  IntegrationNotConfiguredError, IntegrationUnavailableError,
  DevAdapterRefusedError, UnsupportedOperationError,
  canTransition,
} from "../../src/integrations/jkdm";
import { SAMPLE_K1 } from "../../src/integrations/jkdm/fixtures/sample-k1";
import {
  DeclarationSubmissionSchema,
  ManualResponseSchema,
} from "../../src/integrations/jkdm/schemas/declaration.schema";

const savedEnv = { ...process.env };

const CLEAN_VARS = [
  "JKDM_ENDPOINT", "JKDM_CLIENT_CERT", "JKDM_CERT_PASSPHRASE", "JKDM_BROKER_CODE",
  "JKDM_PRODUCTION_ENABLED", "JKDM_TRANSPORT_VERIFIED", "JKDM_DEV_ADAPTER",
];

beforeEach(() => {
  __resetJkdmAdapterForTests();
  for (const k of CLEAN_VARS) delete process.env[k];
  process.env.NODE_ENV = "test";
});

afterEach(() => {
  process.env = { ...savedEnv };
  __resetJkdmAdapterForTests();
});

describe("config resolution — fail-closed", () => {
  it("returns manual by default", () => {
    expect(resolveJkdmConfig().mode).toBe("manual");
  });

  it("does NOT enter production when creds are present but flags are not", () => {
    process.env.JKDM_ENDPOINT = "https://myuc.customs.gov.my";
    process.env.JKDM_CLIENT_CERT = "/etc/jkdm/client.pem";
    process.env.JKDM_BROKER_CODE = "EK/PPG/2026/00001";
    // production flags intentionally absent
    expect(resolveJkdmConfig().mode).toBe("manual");
  });

  it("does NOT enter production when only one flag is set", () => {
    process.env.JKDM_ENDPOINT = "https://myuc.customs.gov.my";
    process.env.JKDM_CLIENT_CERT = "/etc/jkdm/client.pem";
    process.env.JKDM_BROKER_CODE = "EK/PPG/2026/00001";
    process.env.JKDM_PRODUCTION_ENABLED = "true";
    // transportVerified intentionally absent
    expect(resolveJkdmConfig().mode).toBe("manual");
  });

  it("enters production only when creds + both flags are set", () => {
    process.env.JKDM_ENDPOINT = "https://myuc.customs.gov.my";
    process.env.JKDM_CLIENT_CERT = "/etc/jkdm/client.pem";
    process.env.JKDM_BROKER_CODE = "EK/PPG/2026/00001";
    process.env.JKDM_PRODUCTION_ENABLED = "true";
    process.env.JKDM_TRANSPORT_VERIFIED = "true";
    expect(resolveJkdmConfig().mode).toBe("production");
  });

  it("enters development only when explicitly opted in and NODE_ENV is not production", () => {
    process.env.JKDM_DEV_ADAPTER = "true";
    process.env.NODE_ENV = "development";
    expect(resolveJkdmConfig().mode).toBe("development");
  });

  it("never falls back to development in production", () => {
    process.env.JKDM_DEV_ADAPTER = "true";
    process.env.NODE_ENV = "production";
    expect(resolveJkdmConfig().mode).toBe("manual");
  });
});

describe("manual adapter", () => {
  it("refuses submitDeclaration", async () => {
    const a = resolveJkdmAdapter();
    await expect(a.submitDeclaration(SAMPLE_K1)).rejects.toBeInstanceOf(IntegrationNotConfiguredError);
  });

  it("refuses getDeclarationStatus", async () => {
    const a = resolveJkdmAdapter();
    await expect(a.getDeclarationStatus("X")).rejects.toBeInstanceOf(UnsupportedOperationError);
  });

  it("requires evidence or an exception to record a manual response", async () => {
    const a = resolveJkdmAdapter();
    await expect(a.recordManualResponse({
      draftRef: "D", idempotencyKey: "k".repeat(16), tenantId: "t", recordedBy: "u",
      outcome: "released", observedAt: "2026-01-01T00:00:00Z",
      // no evidence, no exception
    })).rejects.toBeInstanceOf(Error);
  });

  it("accepts a manual response with evidence", async () => {
    const a = resolveJkdmAdapter();
    const r = await a.recordManualResponse({
      draftRef: "D", idempotencyKey: "k".repeat(16), tenantId: "t", recordedBy: "u",
      outcome: "released",
      externalRef: "JKDM/PG/2026/0000123",
      officerName: "Inspector Ahmad", officerId: "JKDM-04821",
      observedAt: "2026-01-16T09:15:00+08:00",
      evidenceRef: "doc://release-order/JKDM-PG-2026-0000123.pdf",
    });
    expect(r.provenance).toBe("manual_observation");
    expect(r.reviewStatus).toBe("pending_review");
    expect(r.externalRef).toBe("JKDM/PG/2026-0000123");
  });

  it("accepts a manual response with an exception", async () => {
    const a = resolveJkdmAdapter();
    const r = await a.recordManualResponse({
      draftRef: "D", idempotencyKey: "k".repeat(16), tenantId: "t", recordedBy: "u",
      outcome: "query",
      exceptionReason: "Officer declined to provide ID; query communicated verbally.",
      observedAt: "2026-01-16T09:15:00+08:00",
    });
    expect(r.exceptionReason).toMatch(/Officer declined/);
    expect(r.reviewStatus).toBe("pending_review");
  });
});

describe("dev adapter", () => {
  beforeEach(() => {
    process.env.JKDM_DEV_ADAPTER = "true";
    process.env.NODE_ENV = "development";
    __resetJkdmAdapterForTests();
  });

  it("marks every submit result synthetic", async () => {
    const a = resolveJkdmAdapter();
    const r = await a.submitDeclaration(SAMPLE_K1);
    expect(r.synthetic).toBe(true);
    expect(r.provenance).toBe("synthetic");
    expect(r.acknowledged).toBe(false);
    expect(r.externalRef).toMatch(/^SYNTH-K1-/);
  });

  it("marks status responses synthetic", async () => {
    const a = resolveJkdmAdapter();
    const s = await a.getDeclarationStatus("SYNTH-K1-0001");
    expect(s.synthetic).toBe(true);
    expect(s.provenance).toBe("synthetic");
  });

  it("refuses to construct in production", async () => {
    process.env.NODE_ENV = "production";
    process.env.JKDM_DEV_ADAPTER = "true";
    __resetJkdmAdapterForTests();
    const cfg = resolveJkdmConfig();
    expect(cfg.mode).toBe("manual");
  });
});

describe("prod adapter", () => {
  beforeEach(() => {
    process.env.JKDM_ENDPOINT = "https://myuc.customs.gov.my";
    process.env.JKDM_CLIENT_CERT = "/etc/jkdm/client.pem";
    process.env.JKDM_BROKER_CODE = "EK/PPG/2026/00001";
    process.env.JKDM_PRODUCTION_ENABLED = "true";
    process.env.JKDM_TRANSPORT_VERIFIED = "true";
    __resetJkdmAdapterForTests();
  });

  it("exposes no capabilities until the transport is implemented", () => {
    const a = resolveJkdmAdapter();
    expect(a.mode).toBe("production");
    expect(a.capabilities.submitDeclaration).toBe(false);
    expect(a.capabilities.requiresManualRecording).toBe(true);
  });

  it("refuses submitDeclaration with INTEGRATION_UNAVAILABLE", async () => {
    const a = resolveJkdmAdapter();
    await expect(a.submitDeclaration(SAMPLE_K1)).rejects.toBeInstanceOf(IntegrationUnavailableError);
  });

  it("cannot fabricate acknowledgments", async () => {
    const a = resolveJkdmAdapter();
    await expect(a.submitDeclaration(SAMPLE_K1)).rejects.toThrow(/transport is not yet implemented/);
  });
});

describe("declaration state machine", () => {
  it("allows the happy path", () => {
    expect(canTransition("draft", "ready_for_review")).toBe(true);
    expect(canTransition("ready_for_review", "pending_approval")).toBe(true);
    expect(canTransition("pending_approval", "approved_for_submission")).toBe(true);
    expect(canTransition("approved_for_submission", "submission_pending")).toBe(true);
    expect(canTransition("submission_pending", "submitted_unconfirmed")).toBe(true);
    expect(canTransition("submitted_unconfirmed", "acknowledged")).toBe(true);
    expect(canTransition("acknowledged", "released")).toBe(true);
  });

  it("rejects skipped transitions", () => {
    expect(canTransition("draft", "released")).toBe(false);
    expect(canTransition("approved_for_submission", "released")).toBe(false);
    expect(canTransition("released", "acknowledged")).toBe(false);
  });

  it("allows integration_required recovery", () => {
    expect(canTransition("approved_for_submission", "integration_required")).toBe(true);
    expect(canTransition("integration_required", "approved_for_submission")).toBe(true);
  });

  it("allows integration_error reconciliation", () => {
    expect(canTransition("submission_pending", "integration_error")).toBe(true);
    expect(canTransition("integration_error", "approved_for_submission")).toBe(true);
  });
});

describe("schemas", () => {
  it("accepts the sample K1", () => {
    expect(DeclarationSubmissionSchema.safeParse(SAMPLE_K1).success).toBe(true);
  });

  it("rejects invalid HS codes", () => {
    const bad = { ...SAMPLE_K1, lineItems: [{ ...SAMPLE_K1.lineItems[0]!, hsCode: "abc" }] };
    expect(DeclarationSubmissionSchema.safeParse(bad).success).toBe(false);
  });

  it("requires evidence or exception on manual response", () => {
    expect(ManualResponseSchema.safeParse({
      draftRef: "D", idempotencyKey: "k".repeat(16), tenantId: "t", recordedBy: "u",
      outcome: "released", observedAt: "2026-01-01T00:00:00Z",
    }).success).toBe(false);

    expect(ManualResponseSchema.safeParse({
      draftRef: "D", idempotencyKey: "k".repeat(16), tenantId: "t", recordedBy: "u",
      outcome: "released", observedAt: "2026-01-01T00:00:00Z",
      evidenceRef: "doc://x", externalRef: "JKDM/1",
    }).success).toBe(true);

    expect(ManualResponseSchema.safeParse({
      draftRef: "D", idempotencyKey: "k".repeat(16), tenantId: "t", recordedBy: "u",
      outcome: "released", observedAt: "2026-01-01T00:00:00Z",
      exceptionReason: "officer unavailable; verbal confirmation",
    }).success).toBe(true);
  });
});

import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  resolveJkdmAdapter, __resetJkdmAdapterForTests,
} from "../../src/integration/jkdm";
import type { AuditSink, JkdmAuditEvent } from "../../src/integration/jkdm";
import { SAMPLE_K1 } from "../../src/integration/jkdm/fixtures/sample-k1";

function captureSink(): { events: JkdmAuditEvent[]; sink: AuditSink } {
  const events: JkdmAuditEvent[] = [];
  return {
    events,
    sink: { async record(e) { events.push(e); } },
  };
}

beforeEach(() => {
  __resetJkdmAdapterForTests();
  process.env.NODE_ENV = "test";
  delete process.env.JKDM_ENDPOINT;
  delete process.env.JKDM_CLIENT_CERT;
  delete process.env.JKDM_BROKER_CODE;
  delete process.env.JKDM_PRODUCTION_ENABLED;
  delete process.env.JKDM_TRANSPORT_VERIFIED;
  delete process.env.JKDM_DEV_ADAPTER;
});

describe("audit trail", () => {
  it("records an unavailable event when manual submit is attempted", async () => {
    const { events, sink } = captureSink();
    const a = resolveJkdmAdapter(sink);
    await a.submitDeclaration(SAMPLE_K1).catch(() => {});
    expect(events.some((e) => e.kind === "jkdm.integration.unavailable")).toBe(true);
  });

  it("records a manual observation with evidence refs", async () => {
    const { events, sink } = captureSink();
    const a = resolveJkdmAdapter(sink);
    await a.recordManualResponse({
      draftRef: "D", idempotencyKey: "k".repeat(16), tenantId: "t", recordedBy: "broker",
      outcome: "released",
      externalRef: "JKDM/PG/2026/0000123",
      observedAt: "2026-01-16T09:15:00+08:00",
      evidenceRef: "doc://x",
      additionalEvidenceRefs: ["doc://y", "doc://z"],
    });
    const evt = events.find((e) => e.kind === "jkdm.manual.recorded");
    expect(evt).toBeDefined();
    expect(evt?.provenance).toBe("manual_observation");
    expect(evt?.evidenceRefs).toHaveLength(3);
  });
});

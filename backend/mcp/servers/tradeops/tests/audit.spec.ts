import { describe, it, expect } from "vitest";
import { recordAudit, verifyChain, hashInput } from "../src/middleware/audit";

describe("audit chain", () => {
  it("verifies a well-formed chain", () => {
    recordAudit({
      id: "01H0000000000000000000001",
      at: new Date().toISOString(),
      tenantId: "t1",
      actorId: "a1",
      tool: "ledger.entry",
      inputHash: hashInput({ hello: "world" }),
      outputSummary: "ok",
    });
    expect(verifyChain()).toBe(true);
  });
});

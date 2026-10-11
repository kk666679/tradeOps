import { describe, it, expect } from "@jest/globals";
import { AuditChain } from "../../shared/governance/audit-chain";

describe("audit chain", () => {
  it("verifies a well-formed chain", () => {
    const c = new AuditChain();
    c.append({ id: "1", at: new Date().toISOString(), actor: "a", tenantId: "t", tool: "gate.in", inputHash: "h1", outputSummary: "ok" });
    c.append({ id: "2", at: new Date().toISOString(), actor: "a", tenantId: "t", tool: "gate.out", inputHash: "h2", outputSummary: "ok" });
    expect(c.verify()).toBe(true);
  });
});

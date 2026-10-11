import { describe, it, expect } from "@jest/globals";
import { handleGateIn } from "../../servers/tradeops-core/src/tools/gate";
import { isInputRequired } from "../../shared/schemas/mrtr";
import { REQUEST_ID } from "../../servers/tradeops-core/src/mrtr/gate-approval";

describe("tradeops-core gate.in", () => {
  it("returns input_required on weight mismatch", async () => {
    const r = await handleGateIn({
      tenantId: "t1",
      containerId: "C-1",
      plate: "ABC123",
      manifestWeightKg: 1000,
      observedWeightKg: 1500,
      observedPlate: "ABC123",
      zone: "CFS",
    });
    expect(isInputRequired(r)).toBe(true);
    if (isInputRequired(r)) expect(r.inputRequests[REQUEST_ID.WEIGHT_OVERRIDE]).toBeDefined();
  });

  it("completes when broker approves override", async () => {
    const r = await handleGateIn({
      tenantId: "t1",
      containerId: "C-1",
      plate: "ABC123",
      manifestWeightKg: 1000,
      observedWeightKg: 1500,
      observedPlate: "ABC123",
      zone: "CFS",
      inputResponses: {
        [REQUEST_ID.WEIGHT_OVERRIDE]: { approve: true, reason: "manifest_correction" },
      },
    });
    expect(isInputRequired(r)).toBe(false);
  });

  it("completes on clean gate-in", async () => {
    const r = await handleGateIn({
      tenantId: "t1",
      containerId: "C-1",
      plate: "ABC123",
      manifestWeightKg: 1000,
      observedWeightKg: 1010,
      observedPlate: "ABC123",
      zone: "CFS",
    });
    expect(isInputRequired(r)).toBe(false);
  });
});

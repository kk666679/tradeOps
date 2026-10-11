import { describe, it, expect } from "vitest";
import { handleDuty } from "../src/tools/customs";

describe("customs.duty", () => {
  it("returns indicative duty figures", async () => {
    const r = await handleDuty({ tenantId: "t1", hsCode: "85444200", cifValueMYR: 100000, origin: "MY", scheme: "MFN" });
    const parsed = JSON.parse((r.content[0] as { text: string }).text);
    expect(parsed.indicative).toBe(true);
    expect(parsed.hsCode).toBe("85444200");
  });
});

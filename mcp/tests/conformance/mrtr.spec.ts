import { describe, it, expect } from "vitest";
import { inputRequired, complete, isInputRequired } from "../../shared/schemas/mrtr";

describe("MRTR conformance", () => {
  it("builds input_required responses", () => {
    const r = inputRequired(
      { confirm: { kind: "elicitation", prompt: "ok?", schema: { type: "object" } } },
      "please confirm",
    );
    expect(r.resultType).toBe("input_required");
    expect(r.inputRequests.confirm.kind).toBe("elicitation");
  });

  it("builds complete responses", () => {
    const r = complete({ hello: "world" });
    expect(r.resultType).toBe("complete");
    expect(isInputRequired(r)).toBe(false);
  });
});

import { describe, it, expect } from "vitest";
import { ulid, isUlid } from "../src/util/ulid";

describe("ulid", () => {
  it("generates valid ULIDs", () => {
    const id = ulid();
    expect(id).toHaveLength(26);
    expect(isUlid(id)).toBe(true);
  });

  it("rejects invalid ULIDs", () => {
    expect(isUlid("nope")).toBe(false);
    expect(isUlid("01H0000000000000000000000")).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import { extractRequestMeta, META_KEY } from "../src/transport/headers";

describe("transport meta extraction", () => {
  it("extracts protocol version", () => {
    const m = extractRequestMeta({ [META_KEY.PROTOCOL_VERSION]: "2026-07-28" });
    expect(m.protocolVersion).toBe("2026-07-28");
  });

  it("defaults to 2026-07-28", () => {
    const m = extractRequestMeta(undefined);
    expect(m.protocolVersion).toBe("2026-07-28");
  });
});

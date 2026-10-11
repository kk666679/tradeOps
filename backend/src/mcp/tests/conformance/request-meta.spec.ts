import { describe, it, expect } from "@jest/globals";
import { extractRequestMeta, assertProtocolVersion } from "../../shared/schemas/meta";

describe("request metadata conformance", () => {
  it("extracts protocol version from _meta", () => {
    const meta = extractRequestMeta({
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/logLevel": "warn",
    });
    expect(meta.protocolVersion).toBe("2026-07-28");
    expect(meta.logLevel).toBe("warn");
  });

  it("rejects unsupported protocol versions", () => {
    const meta = extractRequestMeta({ "io.modelcontextprotocol/protocolVersion": "2025-03-26" });
    expect(() => assertProtocolVersion(meta, ["2026-07-28"])).toThrow(/Unsupported protocolVersion/);
  });
});

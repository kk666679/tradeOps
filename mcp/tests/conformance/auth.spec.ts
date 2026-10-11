import { describe, it, expect } from "vitest";
import { generatePkce, verifyPkce } from "../../shared/auth/pkce";
import { normalizeResource, assertResourceMatches } from "../../shared/auth/resource-indicator";
import { assertTokenAudience } from "../../shared/auth/token-audience";

describe("auth primitives", () => {
  it("verifies S256 PKCE", () => {
    const { verifier, challenge } = generatePkce();
    expect(verifyPkce(verifier, challenge)).toBe(true);
    expect(verifyPkce(verifier + "x", challenge)).toBe(false);
  });

  it("normalizes resource URIs", () => {
    expect(normalizeResource("https://mcp.local/a/#frag")).toBe("https://mcp.local/a");
  });

  it("enforces resource indicator", () => {
    expect(() => assertResourceMatches("https://a", { canonicalUri: "https://a" })).not.toThrow();
    expect(() => assertResourceMatches("https://b", { canonicalUri: "https://a" })).toThrow();
  });

  it("enforces token audience", () => {
    const payload = { iss: "https://idp", aud: "https://mcp.local", exp: Math.floor(Date.now() / 1000) + 60 };
    expect(() => assertTokenAudience(payload, { expectedAudience: "https://mcp.local", expectedIssuer: "https://idp" })).not.toThrow();
    expect(() => assertTokenAudience(payload, { expectedAudience: "https://other", expectedIssuer: "https://idp" })).toThrow();
  });
});

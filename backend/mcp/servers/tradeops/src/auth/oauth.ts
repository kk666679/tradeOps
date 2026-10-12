// backend/mcp/servers/tradeops/src/auth/oauth.ts
// RFC 8707 resource indicators, S256 PKCE, CIMD client registration.

import { createHash, randomBytes } from "node:crypto";
import { config } from "../config.js";

export interface PkcePair { verifier: string; challenge: string; method: "S256"; }

export function generatePkce(): PkcePair {
  const verifier = base64url(randomBytes(32));
  const challenge = base64url(createHash("sha256").update(verifier).digest());
  return { verifier, challenge, method: "S256" };
}

export function verifyPkce(verifier: string, challenge: string): boolean {
  const computed = base64url(createHash("sha256").update(verifier).digest());
  if (computed.length !== challenge.length) return false;
  let d = 0;
  for (let i = 0; i < computed.length; i++) d |= computed.charCodeAt(i) ^ challenge.charCodeAt(i);
  return d === 0;
}

export function assertResourceIndicator(resource: string | undefined): void {
  if (!resource) throw new Error("resource indicator required (RFC 8707)");
  const norm = (u: string) => new URL(u).toString().replace(/\/$/, "");
  if (norm(resource) !== norm(config.canonicalResource)) {
    throw new Error(`resource mismatch: ${resource}`);
  }
}

export async function resolveClientMetadata(clientId: string): Promise<Record<string, unknown>> {
  if (!/^https:\/\//.test(clientId)) throw new Error("CIMD client_id must be https URL");
  const res = await fetch(clientId, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`CIMD fetch failed: ${res.status}`);
  const doc = (await res.json()) as Record<string, unknown>;
  if (doc.client_id !== clientId) throw new Error("CIMD client_id mismatch");
  return doc;
}

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

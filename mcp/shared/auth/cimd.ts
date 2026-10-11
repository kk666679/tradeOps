// shared/auth/cimd.ts

export interface ClientMetadataDocument {
  client_id: string;
  client_name: string;
  client_uri?: string;
  logo_uri?: string;
  redirect_uris: string[];
  grant_types: string[];
  response_types: string[];
  token_endpoint_auth_method: "none" | "client_secret_basic" | "private_key_jwt";
  scope?: string;
}

const cache = new Map<string, { doc: ClientMetadataDocument; fetchedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function resolveClientMetadata(clientId: string): Promise<ClientMetadataDocument> {
  if (!/^https:\/\//.test(clientId)) {
    throw new Error("CIMD client_id must be an https URL");
  }
  const hit = cache.get(clientId);
  if (hit && Date.now() - hit.fetchedAt < CACHE_TTL_MS) return hit.doc;

  const res = await fetch(clientId, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`CIMD fetch failed: ${res.status}`);
  const doc = (await res.json()) as ClientMetadataDocument;

  if (doc.client_id !== clientId) {
    throw new Error("CIMD document client_id does not match URL");
  }
  if (!Array.isArray(doc.redirect_uris) || doc.redirect_uris.length === 0) {
    throw new Error("CIMD document must declare at least one redirect_uri");
  }
  cache.set(clientId, { doc, fetchedAt: Date.now() });
  return doc;
}

export function validateRedirectUri(doc: ClientMetadataDocument, uri: string): void {
  if (!doc.redirect_uris.includes(uri)) {
    throw new Error(`redirect_uri ${uri} not registered in CIMD document`);
  }
}

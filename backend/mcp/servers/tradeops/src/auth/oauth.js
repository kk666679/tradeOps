import { createHash, randomBytes } from "node:crypto";
import { config } from "../config.js";
export function generatePkce() {
    const verifier = base64url(randomBytes(32));
    const challenge = base64url(createHash("sha256").update(verifier).digest());
    return { verifier, challenge, method: "S256" };
}
export function verifyPkce(verifier, challenge) {
    const computed = base64url(createHash("sha256").update(verifier).digest());
    if (computed.length !== challenge.length)
        return false;
    let d = 0;
    for (let i = 0; i < computed.length; i++)
        d |= computed.charCodeAt(i) ^ challenge.charCodeAt(i);
    return d === 0;
}
export function assertResourceIndicator(resource) {
    if (!resource)
        throw new Error("resource indicator required (RFC 8707)");
    const norm = (u) => new URL(u).toString().replace(/\/$/, "");
    if (norm(resource) !== norm(config.canonicalResource)) {
        throw new Error(`resource mismatch: ${resource}`);
    }
}
export async function resolveClientMetadata(clientId) {
    if (!/^https:\/\//.test(clientId))
        throw new Error("CIMD client_id must be https URL");
    const res = await fetch(clientId, { headers: { Accept: "application/json" } });
    if (!res.ok)
        throw new Error(`CIMD fetch failed: ${res.status}`);
    const doc = (await res.json());
    if (doc.client_id !== clientId)
        throw new Error("CIMD client_id mismatch");
    return doc;
}
function base64url(buf) {
    return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
//# sourceMappingURL=oauth.js.map
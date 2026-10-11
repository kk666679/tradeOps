// shared/auth/index.ts
export { generatePkce, verifyPkce } from "./pkce";
export type { PkcePair } from "./pkce";
export { normalizeResource, assertResourceMatches, withResource } from "./resource-indicator";
export type { ResourceIndicatorConfig } from "./resource-indicator";
export { assertTokenAudience, assertScope } from "./token-audience";
export type { JwtPayloadLike, AudienceCheckOptions } from "./token-audience";
export { resolveClientMetadata, validateRedirectUri } from "./cimd";
export type { ClientMetadataDocument } from "./cimd";

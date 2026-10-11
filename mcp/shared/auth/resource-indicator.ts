// shared/auth/resource-indicator.ts

export interface ResourceIndicatorConfig {
  canonicalUri: string;
}

export function normalizeResource(uri: string): string {
  const u = new URL(uri);
  u.hash = "";
  u.search = "";
  return u.toString().replace(/\/$/, "");
}

export function assertResourceMatches(
  requested: string,
  config: ResourceIndicatorConfig,
): void {
  if (normalizeResource(requested) !== normalizeResource(config.canonicalUri)) {
    throw new Error(
      `resource indicator mismatch: requested=${requested} expected=${config.canonicalUri}`,
    );
  }
}

export function withResource(authUrl: string, canonicalUri: string): string {
  const u = new URL(authUrl);
  u.searchParams.set("resource", canonicalUri);
  return u.toString();
}

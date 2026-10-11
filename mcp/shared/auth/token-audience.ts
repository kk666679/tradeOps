// shared/auth/token-audience.ts

export interface JwtPayloadLike {
  aud?: string | string[];
  iss?: string;
  exp?: number;
  scope?: string;
  [k: string]: unknown;
}

export interface AudienceCheckOptions {
  expectedAudience: string;
  expectedIssuer: string;
  clockSkewSeconds?: number;
}

export function assertTokenAudience(
  payload: JwtPayloadLike,
  opts: AudienceCheckOptions,
): void {
  const now = Math.floor(Date.now() / 1000);
  const skew = opts.clockSkewSeconds ?? 30;

  if (!payload.exp || payload.exp + skew < now) {
    throw new Error("token expired");
  }
  if (payload.iss !== opts.expectedIssuer) {
    throw new Error(`issuer mismatch: ${payload.iss}`);
  }
  const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!auds.includes(opts.expectedAudience)) {
    throw new Error(`audience mismatch: token aud=${auds.join(",")}`);
  }
}

export function assertScope(payload: JwtPayloadLike, required: string): void {
  const scopes = String(payload.scope ?? "").split(/\s+/).filter(Boolean);
  if (!scopes.includes(required)) {
    throw new Error(`missing required scope: ${required}`);
  }
}

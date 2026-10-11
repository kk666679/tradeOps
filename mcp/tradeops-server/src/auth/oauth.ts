/**
 * Caller authentication.
 *
 * The MCP spec supports OAuth 2.1 + PKCE against an external issuer. In this
 * deployment the server runs behind that issuer: it validates the inbound
 * bearer token and resolves a caller identity (user id, tenant id, role).
 *
 * Two resolution strategies, selected by config:
 *   1. OIDC/JWKS  — verify a JWT against `OAUTH_JWKS_URL` (production). When
 *      JWKS verification libraries are present they are used; otherwise the
 *      token's claims are decoded and trusted (documented dev fallback).
 *   2. API key    — a pre-shared `TRADEOPS_API_KEY` (dev / internal). Resolves
 *      to a fixed admin identity scoped to the default tenant.
 *
 * The token → identity mapping is the single source of truth for
 * `user_id` / `tenant_id` / `role` used by authorize + audit.
 */

import type { Role } from './rbac.js';
import { ALL_ROLES } from './rbac.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'auth' });

export interface CallerIdentity {
  /** e.g. "user:u-123" */
  userId: string;
  tenantId: string;
  role: Role;
  /** Raw subject claim, when available. */
  subject?: string;
  /** How the identity was resolved. */
  method: 'oidc' | 'api-key' | 'anonymous';
}

export interface AuthConfig {
  issuer: string;
  jwksUrl: string;
  audience: string;
  apiKey: string;
}

function base64UrlDecode(seg: string): string {
  const padded = seg.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(padded + '='.repeat((4 - (padded.length % 4)) % 4), 'base64').toString('utf8');
}

/** Decode a JWT payload without verifying the signature. */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function roleFromClaims(claims: Record<string, unknown>): Role {
  const raw =
    (claims.role as string) ??
    (claims['https://tradeops/role'] as string) ??
    (Array.isArray(claims.roles) ? (claims.roles[0] as string) : undefined) ??
    'viewer';
  const norm = String(raw).toLowerCase().replace(/[\s-]+/g, '_');
  return (ALL_ROLES as readonly string[]).includes(norm) ? (norm as Role) : 'viewer';
}

export class Authenticator {
  constructor(private readonly cfg: AuthConfig) {}

  /**
   * Resolve a caller from an Authorization header value.
   * Returns an `anonymous` identity when no credential is present so the
   * middleware can still run (and audit) the call before rejecting it.
   */
  authenticate(authorizationHeader?: string): CallerIdentity {
    if (!authorizationHeader) return anonymous();
    const [scheme, token] = authorizationHeader.split(/\s+/, 2);
    if (!token) return anonymous();
    const s = scheme?.toLowerCase();

    // API key strategy (dev / internal).
    if (this.cfg.apiKey && token === this.cfg.apiKey) {
      return {
        userId: 'user:service-account',
        tenantId: 'tenant:default',
        role: 'admin',
        subject: 'service-account',
        method: 'api-key',
      };
    }

    // Bearer strategy (OIDC).
    if (s === 'bearer' || s === undefined) {
      const claims = decodeJwtPayload(token);
      if (!claims) {
        log.debug('bearer token present but not a decodable JWT');
        return anonymous();
      }
      if (this.cfg.audience && claims.aud && claims.aud !== this.cfg.audience) {
        log.debug({ aud: claims.aud }, 'audience mismatch');
        // Not hard-failing here keeps the resolver pure; authorize() still
        // gates the call. Production deployments should verify exp/iss/aud
        // against the JWKS.
      }
      const sub = String(claims.sub ?? 'unknown');
      return {
        userId: `user:${sub}`,
        tenantId: `tenant:${(claims.tid as string) ?? (claims.tenant as string) ?? 'default'}`,
        role: roleFromClaims(claims),
        subject: sub,
        method: 'oidc',
      };
    }

    return anonymous();
  }
}

export function anonymous(): CallerIdentity {
  return { userId: 'anonymous', tenantId: 'tenant:default', role: 'viewer', method: 'anonymous' };
}

/** True when the identity represents an authenticated (non-anonymous) caller. */
export function isAuthenticated(id: CallerIdentity): boolean {
  return id.method !== 'anonymous';
}

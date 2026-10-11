/**
 * Middleware gate 1 — authenticate.
 *
 * Resolves the caller identity from an Authorization header (Bearer token or
 * pre-shared API key). In local stdio dev a single-user admin identity is
 * synthesised so the full zero-trust chain still executes. Returns a pure
 * result the pipeline consumes; anonymous callers are rejected unless running
 * in local-stdio mode.
 *
 * Also exports an Express middleware used by the HTTP transport to resolve the
 * identity (from a Bearer token or a bound MCP session) and attach it to the
 * request before the MCP protocol handler runs.
 */

import type { Request, Response, NextFunction } from 'express';
import type { Authenticator } from '../auth/oauth.js';
import { anonymous, isAuthenticated, type CallerIdentity } from '../auth/oauth.js';
import type { SessionStore } from '../auth/session.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'authenticate' });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      ctx?: { identity: CallerIdentity; requestId: string };
    }
  }
}

export interface AuthenticateResult {
  ok: boolean;
  identity?: CallerIdentity;
  code?: string;
  message?: string;
}

export interface AuthenticateOptions {
  /** When true (local stdio dev), synthesise an admin identity if none given. */
  localStdio?: boolean;
}

/** Pure authenticate gate used by the transport-agnostic pipeline. */
export function authenticateCall(
  auth: Authenticator,
  authorizationHeader: string | undefined,
  opts: AuthenticateOptions = {},
): AuthenticateResult {
  const identity = auth.authenticate(authorizationHeader);
  if (opts.localStdio && !isAuthenticated(identity)) {
    return {
      ok: true,
      identity: {
        userId: 'user:local-dev',
        tenantId: 'tenant:local',
        role: 'admin',
        method: 'api-key',
      },
    };
  }
  if (!isAuthenticated(identity)) {
    return {
      ok: false,
      code: 'unauthenticated',
      message: 'A valid credential is required.',
    };
  }
  return { ok: true, identity };
}

export interface AuthMiddlewareOptions {
  authenticator: Authenticator;
  sessionStore?: SessionStore;
}

/** Express middleware — resolve identity from Bearer token or MCP session id. */
export function createAuthenticateMiddleware(opts: AuthMiddlewareOptions) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const headerReqId = res.getHeader('x-request-id');
    const requestId =
      (typeof headerReqId === 'string' ? headerReqId : undefined) ||
      `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    res.setHeader('x-request-id', requestId);

    const authHeader = req.headers.authorization;
    let identity: CallerIdentity;
    if (authHeader) {
      identity = opts.authenticator.authenticate(authHeader);
    } else {
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      if (sessionId && opts.sessionStore) {
        const session = opts.sessionStore.get(sessionId);
        identity = session ? session.identity : anonymous();
      } else {
        identity = anonymous();
      }
    }
    req.ctx = { identity, requestId };
    log.debug({ userId: identity.userId, method: identity.method, requestId }, 'authenticated');
    next();
  };
}

export { anonymous };

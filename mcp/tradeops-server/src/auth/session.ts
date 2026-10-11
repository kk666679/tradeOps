/**
 * MCP-Session-Id lifecycle.
 *
 * Over Streamable HTTP the server issues an `MCP-Session-Id` at `initialize`
 * and requires it on every subsequent request. Sessions expire per policy
 * (`MCP_SESSION_TTL`). This is an in-memory store keyed by session id; a
 * distributed deployment would back it with Redis, but the contract (issue at
 * initialize, require after, expire by TTL) is identical.
 */

import { randomUUID } from 'node:crypto';
import type { CallerIdentity } from './oauth.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'session' });

export interface Session {
  id: string;
  identity: CallerIdentity;
  createdAt: number;
  expiresAt: number;
  lastSeenAt: number;
}

export interface SessionStoreOptions {
  ttlSeconds: number;
  now?: () => number;
}

export class SessionStore {
  private sessions = new Map<string, Session>();
  private readonly ttlMs: number;
  private readonly now: () => number;

  constructor(opts: SessionStoreOptions) {
    this.ttlMs = opts.ttlSeconds * 1000;
    this.now = opts.now ?? Date.now;
  }

  /** Create a new session bound to a caller identity. */
  create(identity: CallerIdentity): Session {
    const t = this.now();
    const session: Session = {
      id: randomUUID(),
      identity,
      createdAt: t,
      lastSeenAt: t,
      expiresAt: t + this.ttlMs,
    };
    this.sessions.set(session.id, session);
    log.debug({ sessionId: session.id, userId: identity.userId }, 'session created');
    return session;
  }

  /** Look up a live session, expiring it if past its TTL. */
  get(id: string | undefined): Session | undefined {
    if (!id) return undefined;
    const s = this.sessions.get(id);
    if (!s) return undefined;
    if (this.now() > s.expiresAt) {
      this.sessions.delete(id);
      log.debug({ sessionId: id }, 'session expired');
      return undefined;
    }
    s.lastSeenAt = this.now();
    return s;
  }

  /** Extend a session's expiry (sliding window). */
  touch(id: string): Session | undefined {
    const s = this.get(id);
    if (!s) return undefined;
    s.expiresAt = this.now() + this.ttlMs;
    return s;
  }

  revoke(id: string): boolean {
    return this.sessions.delete(id);
  }

  get size(): number {
    this.sweep();
    return this.sessions.size;
  }

  /** Drop all expired sessions. */
  sweep(): void {
    const t = this.now();
    for (const [id, s] of this.sessions) {
      if (t > s.expiresAt) this.sessions.delete(id);
    }
  }
}

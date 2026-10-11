/**
 * Human-in-the-loop approval tokens for write tools.
 *
 * Every `fiz_*`, `fcz_*`, `zone_*`, and `audit_*` tool requires an approval
 * token. The token is minted by `requestApproval` (typically after a human
 * confirms the action out-of-band, or via an approval API), bound to the
 * specific `tool` + `params` fingerprint, short-lived, and single-use.
 *
 * A token is verified by `verifyApproval`: it must exist, be unexpired, unused,
 * and its fingerprint must match the call it is presented for. This prevents a
 * token minted for one action from being replayed for another.
 */

import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { logger } from '../logger.js';

const log = logger.child({ component: 'approval' });

export interface ApprovalToken {
  token: string;
  tool: string;
  /** Fingerprint of the approved params. */
  fingerprint: string;
  userId: string;
  issuedAt: number;
  expiresAt: number;
  used: boolean;
  signature: string;
}

export interface ApprovalServiceOptions {
  /** HMAC secret used to sign tokens. Falls back to a random per-process key. */
  secret?: string;
  ttlSeconds?: number;
  now?: () => number;
}

/** Deterministic fingerprint of a tool + params pair. */
export function fingerprintAction(tool: string, params: unknown): string {
  const canonical = JSON.stringify({ tool, params: params ?? null });
  return createHash('sha256').update(canonical, 'utf8').digest('hex').slice(0, 32);
}


export class ApprovalService {
  private tokens = new Map<string, ApprovalToken>();
  private readonly secret: string;
  private readonly ttlMs: number;
  private readonly now: () => number;

  constructor(opts: ApprovalServiceOptions = {}) {
    this.secret = opts.secret ?? randomUUID();
    this.ttlMs = (opts.ttlSeconds ?? 900) * 1000;
    this.now = opts.now ?? Date.now;
  }

  private sign(payload: string): string {
    return createHmac('sha256', this.secret).update(payload, 'utf8').digest('hex');
  }

  /** Mint an approval token for a specific tool + params. */
  requestApproval(tool: string, params: unknown, userId: string): ApprovalToken {
    const t = this.now();
    const fingerprint = fingerprintAction(tool, params);
    const token = randomUUID();
    const signature = this.sign(`${token}:${tool}:${fingerprint}`);
    const record: ApprovalToken = {
      token,
      tool,
      fingerprint,
      userId,
      issuedAt: t,
      expiresAt: t + this.ttlMs,
      used: false,
      signature,
    };
    this.tokens.set(token, record);
    log.debug({ tool, userId, token: token.slice(0, 8) }, 'approval token minted');
    return record;
  }

  /** Verify and consume an approval token for the given call. Single-use. */
  verifyApproval(token: string, tool: string, params: unknown): { valid: boolean; reason?: string } {
    const rec = this.tokens.get(token);
    if (!rec) return { valid: false, reason: 'unknown approval token' };
    if (rec.used) return { valid: false, reason: 'approval token already used' };
    if (this.now() > rec.expiresAt) return { valid: false, reason: 'approval token expired' };
    if (rec.tool !== tool) return { valid: false, reason: 'approval token bound to a different tool' };

    const expectedFp = fingerprintAction(tool, params);
    const a = Buffer.from(rec.fingerprint);
    const b = Buffer.from(expectedFp);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { valid: false, reason: 'approval token fingerprint mismatch' };
    }
    const expectedSig = this.sign(`${token}:${tool}:${expectedFp}`);
    if (expectedSig !== rec.signature) return { valid: false, reason: 'approval token signature invalid' };

    rec.used = true; // single-use
    log.debug({ tool, token: token.slice(0, 8) }, 'approval token consumed');
    return { valid: true };
  }

  /** Test helper — clear all tokens. */
  reset(): void {
    this.tokens.clear();
  }
}

import 'server-only';

import { createHash, randomBytes } from 'node:crypto';

import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * 32 bytes = 256 bits. This is the standard for auth tokens. Anything less
 * than 16 bytes (128 bits) is considered weak against a determined attacker
 * with a fast hash function.
 */
export const TOKEN_BYTES = 32;

/**
 * 24 hours. Long enough that a user who checks email the next morning can
 * still verify; short enough that a leaked token has a bounded window.
 */
export const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * If set, tokens are cleaned up by a cron job. This is a defense-in-depth
 * measure — verifyEmailToken already refuses to consume expired tokens.
 */
export const CLEANUP_GRACE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days after expiry

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Result of a verification attempt.
 *
 * `ok: true` — the token was valid and the user is now verified. The email
 *              is returned so the UI can display it (masked).
 *
 * `alreadyVerified` is set when the token was already consumed but the user
 * is verified. The caller treats this as a success; it is only returned for
 * a genuine idempotent-retry case.
 *
 * `ok: false` — the token was rejected. `reason` distinguishes expiry from
 *             other failures for the user-facing message, but is not
 *             otherwise significant.
 */
export type VerifyEmailResult =
  | { ok: true; email: string; alreadyVerified: boolean }
  | { ok: false; reason: 'expired' | 'invalid' };

// ---------------------------------------------------------------------------
// Token utilities
// ---------------------------------------------------------------------------

/**
 * Generates a cryptographically random token, base64url encoded so it is
 * safe to include in a URL without further escaping.
 *
 * Base64url uses the alphabet `A-Z a-z 0-9 - _` and omits padding. The
 * resulting string is 43 characters for 32 bytes of input.
 */
export function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url');
}

/**
 * Hashes a token for storage and lookup.
 *
 * SHA-256 is appropriate here (rather than bcrypt or argon2) because the
 * input is 256 bits of cryptographic randomness. There is no dictionary
 * attack against a random 256-bit value; the only viable attack is brute
 * force, which is infeasible against a 2^256 search space. A slow hash
 * would add latency to every lookup without a corresponding security gain.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Reads the application base URL from the environment.
 *
 * Prefers `APP_URL` (server-only) over `NEXT_PUBLIC_APP_URL` (exposed to the
 * browser) so that the verification link is constructed from a value the
 * client cannot influence. Falls back to localhost for development.
 */
export function getBaseUrl(): string {
  const url =
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    'http://localhost:3000';
  return url.replace(/\/+$/, '');
}

// ---------------------------------------------------------------------------
// Public API — verification
// ---------------------------------------------------------------------------

/**
 * Consumes a verification token and marks the associated user as verified.
 *
 * The function is idempotent: presenting a token that was already used, when
 * the user is verified, returns success rather than an error. This handles
 * the case where a user clicks the email link twice, or where an email
 * client pre-fetches the link and the user clicks it later.
 *
 * Concurrent consumption is safe. The token is marked used inside a
 * transaction with a conditional update that only succeeds if `usedAt` is
 * still null. Two simultaneous requests cannot both succeed; the loser
 * observes the winner's success and returns the same result.
 *
 * @param rawToken The token from the verification URL. Must not be trusted
 *                 as well-formed; the function validates it defensively.
 */
export async function verifyEmailToken(
  rawToken: string,
): Promise<VerifyEmailResult> {
  // --- Input validation ---------------------------------------------------
  //
  // Reject anything obviously malformed before touching the database. This
  // is a cheap filter against probes that send arbitrary strings.

  if (
    typeof rawToken !== 'string' ||
    rawToken.length < 20 ||
    rawToken.length > 128
  ) {
    return { ok: false, reason: 'invalid' };
  }

  const now = new Date();

  // --- Lookup -------------------------------------------------------------

  const record = await db.emailVerification.findUnique({
    where: { token: rawToken },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          emailVerifiedAt: true,
        },
      },
    },
  });

  if (!record) {
    // No such token. Could be a fabricated value, a token from a previous
    // deployment whose hash secret changed, or a token that was cleaned up.
    // The user-facing message is the same in all cases.
    return { ok: false, reason: 'invalid' };
  }

  // --- Expiry -------------------------------------------------------------

  if (record.expiresAt.getTime() < now.getTime()) {
    logger.info('verification token expired', {
      userId: record.user.id,
      tokenId: record.id,
      expiredAt: record.expiresAt.toISOString(),
    });
    return { ok: false, reason: 'expired' };
  }

  // --- Idempotent retry ---------------------------------------------------
  //
  // The token was already used. If the user is verified, this is a harmless
  // re-click and we return success. If the user is not verified, the state
  // is inconsistent — perhaps a partial transaction from an earlier failed
  // deployment — and we treat it as invalid rather than guessing.

  if (record.usedAt) {
    if (record.user.emailVerifiedAt) {
      logger.info('verification token re-presented after success', {
        userId: record.user.id,
        tokenId: record.id,
      });
      return {
        ok: true,
        email: record.user.email,
        alreadyVerified: true,
      };
    }
    logger.warn('verification token used but user not verified', {
      userId: record.user.id,
      tokenId: record.id,
    });
    return { ok: false, reason: 'invalid' };
  }

  // --- Atomic consumption -------------------------------------------------
  //
  // Mark the token used and the user verified inside a single transaction.
  // The conditional update on the token is what makes concurrent requests
  // safe: if two requests race, only one update succeeds.

  const race = await db.$transaction(async (tx) => {
    const marked = await tx.emailVerification.updateMany({
      where: {
        id: record.id,
        usedAt: null,
      },
      data: { usedAt: now },
    });

    if (marked.count === 0) {
      // Another request consumed the token between our lookup and now.
      return true;
    }

    await tx.user.update({
      where: { id: record.user.id },
      data: {
        // Set only if not already set. Preserves the timestamp of the
        // original verification if this user has been verified before and
        // is being re-verified after an email change.
        emailVerifiedAt: record.user.emailVerifiedAt ?? now,
      },
    });

    return false;
  });

  if (race) {
    // Lost the race. The other request either succeeded or is about to.
    // Re-read the user to determine the final state.
    const user = await db.user.findUnique({
      where: { id: record.user.id },
      select: { email: true, emailVerifiedAt: true },
    });

    if (user?.emailVerifiedAt) {
      return { ok: true, email: user.email, alreadyVerified: true };
    }

    // The other request failed after marking used. This is a rare failure
    // mode; treat it as invalid and let the user resend.
    logger.error('verification race lost but user not verified', {
      userId: record.user.id,
      tokenId: record.id,
    });
    return { ok: false, reason: 'invalid' };
  }

  logger.info('email verified', {
    userId: record.user.id,
    tokenId: record.id,
  });

  return {
    ok: true,
    email: record.user.email,
    alreadyVerified: false,
  };
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

/**
 * Deletes verification tokens that expired longer ago than the grace window.
 *
 * Intended to be called from a scheduled job (Vercel Cron, a BullMQ worker,
 * or a system crontab). It is safe to call repeatedly and safe to skip —
 * `verifyEmailToken` refuses to consume an expired token regardless of
 * whether it is still in the database.
 *
 * Returns the number of tokens deleted for logging and observability.
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const cutoff = new Date(Date.now() - CLEANUP_GRACE_MS);

  const result = await db.emailVerification.deleteMany({
    where: {
      expiresAt: { lt: cutoff },
    },
  });

  if (result.count > 0) {
    logger.info('cleaned up expired verification tokens', {
      count: result.count,
      cutoff: cutoff.toISOString(),
    });
  }

  return result.count;
}

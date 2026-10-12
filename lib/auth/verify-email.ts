export type VerifyEmailResult =
  | { ok: true; email: string; alreadyVerified: boolean }
  | { ok: false; reason: 'expired' | 'invalid' | 'used' };

import 'server-only';

import { createHash, randomBytes } from 'node:crypto';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * Verify an email-verification token.
 *
 * NOTE: this is a placeholder. The real implementation should:
 *   1. Hash the incoming token with SHA-256
 *   2. Look up the hash in the VerificationToken table
 *   3. Reject if expired or already consumed
 *   4. Mark the token consumed and set user.emailVerifiedAt
 *   5. Return the discriminated union above
 */
export async function verifyEmailToken(
  _token: string,
): Promise<VerifyEmailResult> {
  return { ok: false, reason: 'invalid' };
}

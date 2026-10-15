export type VerifyEmailResult =
  | { ok: true; email: string; alreadyVerified: boolean }
  | { ok: false; reason: 'expired' | 'invalid' | 'used' };

import 'server-only';

import { createHash } from 'node:crypto';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * Verify an email-verification token.
 *
 * 1. Hash the incoming token with SHA-256
 * 2. Look up the hash in the VerificationToken table
 * 3. Reject if expired or already consumed
 * 4. Mark the token consumed and set user.emailVerifiedAt
 * 5. Return the discriminated union above
 */
export async function verifyEmailToken(
  token: string,
): Promise<VerifyEmailResult> {
  const tokenHash = createHash('sha256').update(token).digest('hex');

  const verification = await db.verificationToken.findUnique({
    where: { token: tokenHash },
  });

  if (!verification) {
    return { ok: false, reason: 'invalid' };
  }

  if (verification.expires < new Date()) {
    await db.verificationToken.delete({ where: { token: tokenHash } });
    return { ok: false, reason: 'expired' };
  }

  const userId = verification.userId;
  if (!userId) {
    return { ok: false, reason: 'invalid' };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, emailVerified: true },
  });

  if (!user) {
    return { ok: false, reason: 'invalid' };
  }

  if (user.emailVerified) {
    await db.verificationToken.delete({ where: { token: tokenHash } });
    return { ok: true, email: user.email, alreadyVerified: true };
  }

  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    }),
    db.verificationToken.delete({ where: { token: tokenHash } }),
  ]);

  logger.info('Email verified successfully', { userId });

  return { ok: true, email: user.email, alreadyVerified: false };
}
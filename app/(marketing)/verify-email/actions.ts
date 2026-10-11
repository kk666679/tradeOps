'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email/verify-email';
import { rateLimit } from '@/lib/rate-limit';

/**
 * Resend verification email.
 *
 * Rate limited per IP and per email address. The per-email limit is stricter
 * because a resend endpoint is an easy vector for emailing a stranger
 * repeatedly; the per-IP limit protects against a single source enumerating
 * many addresses.
 *
 * The response is the same whether the email exists in the system or not.
 * This prevents the endpoint from being used as an account-enumeration
 * oracle. See https://owasp.org/www-project-web-security-testing-guide/ for
 * the general principle.
 *
 * The verification token itself is generated server-side and stored hashed.
 * It expires after 24 hours. Only one active token per user is kept: a new
 * resend invalidates the previous one.
 */

const InputSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

type Result =
  | { ok: true }
  | { ok: false; error?: string };

const PER_IP_LIMIT = 10; // per hour
const PER_EMAIL_LIMIT = 3; // per hour

export async function resendVerificationEmail(
  rawInput: unknown,
): Promise<Result> {
  // --- Validate input --------------------------------------------------------

  const parsed = InputSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  const { email } = parsed.data;

  // --- Rate limiting ---------------------------------------------------------

  const hdrs = await headers();
  const ip =
    hdrs.get('x-real-ip') ??
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  const ipLimit = await rateLimit({
    key: `verify-email:ip:${ip}`,
    limit: PER_IP_LIMIT,
    windowSeconds: 3600,
  });
  if (!ipLimit.ok) {
    return {
      ok: false,
      error: 'Too many requests. Please try again in a little while.',
    };
  }

  const emailLimit = await rateLimit({
    key: `verify-email:email:${email}`,
    limit: PER_EMAIL_LIMIT,
    windowSeconds: 3600,
  });
  if (!emailLimit.ok) {
    // Same user-facing message as the IP limit — do not reveal which limit
    // was hit, to avoid leaking that the address is being throttled.
    return {
      ok: false,
      error: 'Too many requests. Please try again in a little while.',
    };
  }

  // --- Look up the user ------------------------------------------------------
  //
  // If the user does not exist, we return success anyway. See the constant-
  // response comment above. If the user exists and is already verified, we
  // also return success — the user should not be able to probe verification
  // state through this endpoint.

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, emailVerifiedAt: true },
  });

  if (!user || user.emailVerifiedAt) {
    return { ok: true };
  }

  // --- Issue a new token -----------------------------------------------------

  try {
    await sendVerificationEmail({ userId: user.id });
  } catch (err) {
    // Log for observability but do not surface the failure to the user. A
    // transient email-provider failure should not leak whether the address
    // exists in the system.
    console.error('[verify-email] resend failed', { userId: user.id, err });
  }

  return { ok: true };
}
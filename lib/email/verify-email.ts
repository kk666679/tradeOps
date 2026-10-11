import 'server-only';

import * as React from 'react';

import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { sendEmail } from '@/lib/email/sender';
import { generateToken, getBaseUrl, TOKEN_TTL_MS } from '@/lib/auth/verify-email';

export type SendVerificationResult =
  | { ok: true }
  | { ok: false; error: string };

interface VerificationEmailProps {
  recipientName: string | null;
  verificationUrl: string;
  expiresInHours: number;
  supportEmail: string;
}

function renderVerificationEmail(props: VerificationEmailProps): string {
  const { recipientName, verificationUrl, expiresInHours, supportEmail } = props;
  const greeting = recipientName ? `Hi ${recipientName},` : 'Hi,';
  const previewText = 'Confirm your email to activate your TradeOps account.';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.55;color:#18181b;">
  <div style="display:none;max-height:0;overflow:hidden;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${previewText}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560;width:100%;background-color:#ffffff;border-radius:12px;border:1px solid #e4e4e7;overflow:hidden;">
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid #e4e4e7;">
              <span style="font-size:16px;font-weight:600;letter-spacing:-0.01em;color:#18181b;">TradeOps</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0;font-size:20px;font-weight:600;letter-spacing:-0.01em;color:#18181b;">Verify your email address</h1>
              <p style="margin:16px 0 0;color:#52525b;">${greeting}</p>
              <p style="margin:12px 0 0;color:#52525b;">Thanks for signing up for TradeOps. Click the button below to confirm your email address and activate your account.</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;">
                <tr>
                  <td style="border-radius:8px;background-color:#18181b;">
                    <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;border-radius:8px;">Verify email address</a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:#71717a;">If the button does not work, copy and paste this link into your browser:</p>
              <p style="margin:8px 0 0;font-size:13px;color:#52525b;word-break:break-all;"><a href="${verificationUrl}" style="color:#52525b;text-decoration:underline;">${verificationUrl}</a></p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0 0;">
                <tr>
                  <td style="padding:12px 16px;background-color:#fafafa;border:1px solid #e4e4e7;border-radius:8px;font-size:13px;color:#52525b;">
                    This link expires in ${expiresInHours} hours. If it expires, you can request a new one from the sign-in page.
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:#71717a;">If you did not sign up for TradeOps, you can safely ignore this email. No account will be created without this verification. If you have questions, contact us at <a href="mailto:${supportEmail}" style="color:#71717a;text-decoration:underline;">${supportEmail}</a>.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #e4e4e7;background-color:#fafafa;font-size:12px;color:#a1a1aa;">
              <p style="margin:0;">TradeOps &middot; [COMPANY ADDRESS]</p>
              <p style="margin:4px 0 0;">This is a transactional email. You received it because someone signed up for a TradeOps account with this address.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

interface SendVerificationEmailInput {
  userId: string;
}

export async function sendVerificationEmail(
  input: SendVerificationEmailInput,
): Promise<SendVerificationResult> {
  const { userId } = input;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, emailVerifiedAt: true },
  });

  if (!user) return { ok: false, error: 'User not found.' };
  if (user.emailVerifiedAt) return { ok: true };

  const token = generateToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await db.$transaction([
    db.emailVerification.deleteMany({ where: { userId: user.id } }),
    db.emailVerification.create({ data: { token, userId: user.id, expiresAt } }),
  ]);

  const verificationUrl = new URL('/verify-email', getBaseUrl());
  verificationUrl.searchParams.set('token', token);
  verificationUrl.searchParams.set('email', user.email);

  const supportEmail = process.env.SUPPORT_EMAIL ?? 'support@tradeops.example';
  const expiresInHours = TOKEN_TTL_MS / (60 * 60 * 1000);

  const html = renderVerificationEmail({
    recipientName: user.name ?? null,
    verificationUrl: verificationUrl.toString(),
    expiresInHours,
    supportEmail,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your TradeOps account',
      html,
      text: [
        user.name ? `Hi ${user.name},` : 'Hi,',
        '',
        'Thanks for signing up for TradeOps. Open the link below to verify your email address and activate your account.',
        '',
        verificationUrl.toString(),
        '',
        `This link expires in ${expiresInHours} hours.`,
        '',
        'If you did not sign up, you can ignore this email.',
        '',
        `Support: ${supportEmail}`,
      ].join('\n'),
    });
  } catch (err) {
    logger.error('failed to send verification email', {
      userId: user.id,
      error: err instanceof Error ? err.message : String(err),
    });
    return { ok: false, error: 'Failed to send verification email.' };
  }

  logger.info('verification email sent', { userId: user.id, expiresAt: expiresAt.toISOString() });
  return { ok: true };
}

import { logger } from '@/lib/logger';

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

interface SendEmailResult {
  ok: boolean;
  error?: string;
  messageId?: string;
}

/**
 * Sends an email using Resend.
 *
 * In development, if RESEND_API_KEY is not set, the email is logged to the
 * console instead of being sent. This allows local development without
 * configuring an email provider.
 *
 * In production, RESEND_API_KEY must be set.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = input.from ?? process.env.EMAIL_FROM ?? 'TradeOps <noreply@tradeops.example>';

  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      logger.info('email not sent (no provider configured)', {
        to: input.to,
        subject: input.subject,
        from,
      });
      return { ok: true };
    }
    logger.error('RESEND_API_KEY not configured');
    return { ok: false, error: 'Email provider not configured' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        reply_to: input.replyTo,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      logger.error('resend send failed', { status: res.status, error });
      return { ok: false, error: `Email provider error: ${res.status}` };
    }

    const data = await res.json();
    return { ok: true, messageId: data.id };
  } catch (err) {
    logger.error('resend send exception', { error: err instanceof Error ? err.message : String(err) });
    return { ok: false, error: 'Failed to send email' };
  }
}
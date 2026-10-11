import { NextResponse } from 'next/server';

/**
 * Contact form submission handler.
 *
 * This route runs on the server. It is responsible for:
 *   1. Validating the incoming payload (the client cannot be trusted).
 *   2. Enforcing rate limiting per IP.
 *   3. Sending the enquiry to the configured recipient by email.
 *   4. Posting a notification to a Discord webhook, if configured.
 *
 * Environment variables required:
 *   RESEND_API_KEY          — or swap for your transactional email provider
 *   CONTACT_RECIPIENT_EMAIL — where enquiries are delivered
 *   DISCORD_WEBHOOK_URL     — optional; Discord channel for notifications
 *
 * Rate limiting: this example uses an in-memory map. In a serverless
 * deployment, replace it with a Redis-backed limiter (Upstash, Vercel KV,
 * etc.) because the process may not be long-lived. The interface is the same.
 */

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  zoneType?: string;
  message?: string;
  honeypot?: string;
};

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5; // per IP per window

// In-memory rate limiter. Replace with Redis in production for serverless.
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const entries = (requestLog.get(ip) ?? []).filter((t) => t > cutoff);

  if (entries.length >= MAX_REQUESTS) {
    requestLog.set(ip, entries);
    return true;
  }

  entries.push(now);
  requestLog.set(ip, entries);
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  // Identify the caller. Prefer the platform-provided header if present,
  // because x-forwarded-for can be spoofed if you do not control the proxy.
  const ip =
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Too many submissions. Please try again later.',
      },
      { status: 429 },
    );
  }

  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  // Honeypot: if the hidden field is filled, silently accept and drop.
  // Returning 200 means the bot does not learn that it was detected.
  if (payload.honeypot && payload.honeypot.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const name = (payload.name ?? '').trim();
  const email = (payload.email ?? '').trim();
  const company = (payload.company ?? '').trim();
  const role = (payload.role ?? '').trim();
  const zoneType = (payload.zoneType ?? '').trim();
  const message = (payload.message ?? '').trim();

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'Your name is required.';
  if (!email) {
    fieldErrors.email = 'Your email address is required.';
  } else if (!isValidEmail(email)) {
    fieldErrors.email = 'Please enter a valid email address.';
  }
  if (!message || message.length < 10) {
    fieldErrors.message = 'Please tell us a little about what you need.';
  }
  if (message.length > 5000) {
    fieldErrors.message = 'Message is too long.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { ok: false, error: 'Please correct the errors below.', fieldErrors },
      { status: 400 },
    );
  }

  const recipient =
    process.env.CONTACT_RECIPIENT_EMAIL ?? 'hello@tradeops.example';

  // ---------------------------------------------------------------------------
  // Email delivery
  // ---------------------------------------------------------------------------
  // This example uses Resend. Swap the fetch below for your provider's API
  // (Postmark, SendGrid, AWS SES, etc.) if you prefer. Keep the API key in an
  // environment variable and never return it in a response.
  const emailApiKey = process.env.RESEND_API_KEY;
  let emailDelivered = false;

  if (emailApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${emailApiKey}`,
        },
        body: JSON.stringify({
          from: 'TradeOps Contact <noreply@tradeops.example>',
          to: [recipient],
          reply_to: email,
          subject: `Contact form: ${name}${company ? ` (${company})` : ''}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            company && `Company: ${company}`,
            role && `Role: ${role}`,
            zoneType && `Zone: ${zoneType}`,
            '',
            'Message:',
            message,
          ]
            .filter(Boolean)
            .join('\n'),
        }),
      });
      emailDelivered = res.ok;
    } catch {
      emailDelivered = false;
    }
  } else {
    // No provider configured. Log to the server console so the enquiry is not
    // lost during local development. In production, configure a provider.
    // eslint-disable-next-line no-console
    console.info('[contact] email provider not configured', {
      name,
      email,
      company,
      role,
      zoneType,
      message,
    });
    emailDelivered = true;
  }

  // ---------------------------------------------------------------------------
  // Discord notification
  // ---------------------------------------------------------------------------
  // Fire-and-forget. A Discord failure must not fail the form submission,
  // because the email is the authoritative record.
  const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
  if (discordWebhook) {
    void fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'TradeOps Contact',
        embeds: [
          {
            title: 'New contact form submission',
            color: 0x10b981,
            fields: [
              { name: 'Name', value: escapeHtml(name) || '—', inline: true },
              { name: 'Email', value: escapeHtml(email) || '—', inline: true },
              { name: 'Company', value: escapeHtml(company) || '—', inline: true },
              { name: 'Role', value: escapeHtml(role) || '—', inline: true },
              { name: 'Zone', value: escapeHtml(zoneType) || '—', inline: true },
              { name: 'Message', value: escapeHtml(message).slice(0, 1024) || '—' },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    }).catch(() => {
      // Intentionally swallowed. See comment above.
    });
  }

  if (!emailDelivered) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'We could not deliver your message. Please try again, or reach us on WhatsApp.',
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
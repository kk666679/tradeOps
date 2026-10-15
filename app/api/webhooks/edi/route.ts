/**
 * /api/webhooks/edi — receives inbound EDI message callbacks.
 * Verifies HMAC-SHA256 when WEBHOOK_SECRET_EDI is set.
 */
import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';

const backendUrl = () => `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/trpc`;

function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  try { return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)); } catch { return false; }
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const secret = process.env.WEBHOOK_SECRET_EDI;

  if (secret) {
    const sig = req.headers.get('x-webhook-signature') ?? null;
    if (!verifySignature(rawBody, sig, secret)) {
      return NextResponse.json({ ok: false, error: 'Invalid signature.' }, { status: 401 });
    }
  }

  let body: unknown;
  try { body = JSON.parse(rawBody); } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    await fetch(`${backendUrl()}/integration.edi.create?batch=1`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ '0': { json: { direction: 'IN', payload: body, source: 'webhook' } } }),
    });
  } catch {
    console.error('[webhook/edi] backend write failed');
  }

  return NextResponse.json({ ok: true, received: true });
}

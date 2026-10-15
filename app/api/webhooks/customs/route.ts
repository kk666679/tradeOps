/**
 * /api/webhooks/customs — receives inbound customs status callbacks.
 * Verifies HMAC-SHA256 signature when WEBHOOK_SECRET_CUSTOMS is set.
 * Forwards verified payloads to the backend integration log via tRPC.
 */
import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';

const backendUrl = () => `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/trpc`;

function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const secret = process.env.WEBHOOK_SECRET_CUSTOMS;

  if (secret) {
    const sig = req.headers.get('x-webhook-signature') ?? req.headers.get('x-hub-signature-256')?.replace('sha256=', '') ?? null;
    if (!verifySignature(rawBody, sig, secret)) {
      return NextResponse.json({ ok: false, error: 'Invalid signature.' }, { status: 401 });
    }
  }

  let body: unknown;
  try { body = JSON.parse(rawBody); } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
  }

  try {
    await fetch(`${backendUrl()}/integration.customs.create?batch=1`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ '0': { json: { direction: 'IN', payload: body, source: 'webhook' } } }),
    });
  } catch {
    // Non-fatal: log and acknowledge. The payload is not lost — the caller
    // should retry on non-2xx, but we must not block on a backend write.
    console.error('[webhook/customs] backend write failed');
  }

  return NextResponse.json({ ok: true, received: true });
}

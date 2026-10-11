import { NextResponse } from 'next/server';

/** /api/webhooks/edi */
export async function POST(req: Request) {
  let body: unknown = null;
  try { body = await req.json(); } catch { /* ignore */ }
  return NextResponse.json({ ok: true, route: '/api/webhooks/edi', received: body });
}

import { NextResponse } from 'next/server';

/** /api/webhooks/customs */
export async function POST(req: Request) {
  let body: unknown = null;
  try { body = await req.json(); } catch { /* ignore */ }
  return NextResponse.json({ ok: true, route: '/api/webhooks/customs', received: body });
}

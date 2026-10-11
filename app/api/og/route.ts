import { NextResponse } from 'next/server';

/** /api/og */
export async function GET(_req: Request) {
  return NextResponse.json({ ok: true, route: '/api/og' });
}

export async function POST(req: Request) {
  let body: unknown = null;
  try { body = await req.json(); } catch { /* ignore */ }
  return NextResponse.json({ ok: true, route: '/api/og', received: body });
}

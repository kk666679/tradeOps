import { NextResponse } from 'next/server';

/** /api/agents/run */
export async function GET(_req: Request) {
  return NextResponse.json({ ok: true, route: '/api/agents/run' });
}

export async function POST(req: Request) {
  let body: unknown = null;
  try { body = await req.json(); } catch { /* ignore */ }
  return NextResponse.json({ ok: true, route: '/api/agents/run', received: body });
}

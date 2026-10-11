import { NextRequest, NextResponse } from 'next/server';

/** agents/orchestrate */
export async function GET(_req: NextRequest) {
  return NextResponse.json({ ok: true, route: 'agents/orchestrate' });
}

export async function POST(req: NextRequest) {
  let body: unknown = null;
  try { body = await req.json(); } catch { /* ignore */ }
  return NextResponse.json({ ok: true, route: 'agents/orchestrate', received: body });
}

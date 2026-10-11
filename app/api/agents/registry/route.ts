import { NextRequest, NextResponse } from 'next/server';

/** agents/registry */
export async function GET(_req: NextRequest) {
  return NextResponse.json({ ok: true, route: 'agents/registry' });
}

export async function POST(req: NextRequest) {
  let body: unknown = null;
  try { body = await req.json(); } catch { /* ignore */ }
  return NextResponse.json({ ok: true, route: 'agents/registry', received: body });
}

import { NextResponse } from 'next/server';

/** /api/cron/exemption-expiry */
export async function GET(_req: Request) {
  // idempotent cron entrypoint
  return NextResponse.json({ ok: true, route: '/api/cron/exemption-expiry', ranAt: new Date().toISOString() });
}

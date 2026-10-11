import { NextResponse } from 'next/server';

/** /api/cron/forecast */
export async function GET(_req: Request) {
  // idempotent cron entrypoint
  return NextResponse.json({ ok: true, route: '/api/cron/forecast', ranAt: new Date().toISOString() });
}

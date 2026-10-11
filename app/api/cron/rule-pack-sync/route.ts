import { NextResponse } from 'next/server';

/** /api/cron/rule-pack-sync */
export async function GET(_req: Request) {
  // idempotent cron entrypoint
  return NextResponse.json({ ok: true, route: '/api/cron/rule-pack-sync', ranAt: new Date().toISOString() });
}

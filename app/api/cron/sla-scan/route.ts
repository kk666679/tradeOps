import { NextResponse } from 'next/server';

/** /api/cron/sla-scan */
export async function GET(_req: Request) {
  // idempotent cron entrypoint
  return NextResponse.json({ ok: true, route: '/api/cron/sla-scan', ranAt: new Date().toISOString() });
}

/**
 * /api/cron/rule-pack-sync
 * Syncs rule pack versions from the backend.
 * Secured by CRON_SECRET.
 */
import { NextResponse } from 'next/server';

const backendUrl = () => `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/trpc`;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
    }
  }

  const ranAt = new Date().toISOString();

  try {
    const input = encodeURIComponent(JSON.stringify({ '0': { json: { take: 100 } } }));
    const res = await fetch(`${backendUrl()}/customAgents.policy.list?batch=1&input=${input}`, {
      headers: process.env.CRON_SERVICE_TOKEN
        ? { authorization: `Bearer ${process.env.CRON_SERVICE_TOKEN}` }
        : {},
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `Backend returned ${res.status}`, ranAt }, { status: 502 });
    }

    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : data;
    const packs = first?.result?.data?.json ?? first?.result?.data ?? [];

    return NextResponse.json({ ok: true, ranAt, synced: Array.isArray(packs) ? packs.length : 0 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err), ranAt }, { status: 502 });
  }
}

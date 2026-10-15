/**
 * /api/cron/forecast
 * Triggers scheduled forecast model runs via the backend.
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
    const res = await fetch(`${backendUrl()}/wms.forecasting.list?batch=1&input=${encodeURIComponent(JSON.stringify({ '0': { json: { take: 10 } } }))}`, {
      headers: process.env.CRON_SERVICE_TOKEN
        ? { authorization: `Bearer ${process.env.CRON_SERVICE_TOKEN}` }
        : {},
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `Backend returned ${res.status}`, ranAt }, { status: 502 });
    }

    return NextResponse.json({ ok: true, ranAt });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err), ranAt }, { status: 502 });
  }
}

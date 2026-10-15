/**
 * /api/cron/exemption-expiry
 * Scans for exemption schemes approaching or past their validTo date.
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
    const input = encodeURIComponent(JSON.stringify({ '0': { json: { take: 200 } } }));
    const res = await fetch(`${backendUrl()}/wms.exemption.list?batch=1&input=${input}`, {
      headers: process.env.CRON_SERVICE_TOKEN
        ? { authorization: `Bearer ${process.env.CRON_SERVICE_TOKEN}` }
        : {},
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `Backend returned ${res.status}`, ranAt }, { status: 502 });
    }

    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : data;
    const exemptions = first?.result?.data?.json ?? first?.result?.data ?? [];
    const now = Date.now();
    const expiring = Array.isArray(exemptions)
      ? exemptions.filter((e: any) => e.validTo && new Date(e.validTo).getTime() - now < 30 * 24 * 60 * 60 * 1000)
      : [];

    return NextResponse.json({ ok: true, ranAt, scanned: Array.isArray(exemptions) ? exemptions.length : 0, expiringSoon: expiring.length });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err), ranAt }, { status: 502 });
  }
}

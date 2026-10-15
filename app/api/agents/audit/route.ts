/**
 * /api/agents/audit — proxies to backend tRPC customAgents.audit.list
 */
import { NextRequest, NextResponse } from 'next/server';

const backendUrl = () => `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/trpc`;

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const headers: Record<string, string> = {};
  if (auth) headers['authorization'] = auth;

  const { searchParams } = new URL(req.url);
  const take = Number(searchParams.get('take') ?? 50);
  const cursor = searchParams.get('cursor') ?? undefined;
  const input = encodeURIComponent(JSON.stringify({ '0': { json: { take, cursor } } }));

  try {
    const res = await fetch(`${backendUrl()}/customAgents.audit.list?batch=1&input=${input}`, { headers });
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : data;
    if (first?.error) return NextResponse.json({ ok: false, error: first.error?.json?.message ?? 'Query failed.' }, { status: 400 });
    return NextResponse.json({ ok: true, result: first?.result?.data?.json ?? first?.result?.data });
  } catch {
    return NextResponse.json({ ok: false, error: 'Backend unreachable.' }, { status: 502 });
  }
}

export async function POST() {
  return NextResponse.json({ ok: false, error: 'Audit log is append-only via tRPC.' }, { status: 405 });
}

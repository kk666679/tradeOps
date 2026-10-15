/**
 * /api/agents/memory — proxies to backend tRPC customAgents.memory
 */
import { NextRequest, NextResponse } from 'next/server';

const backendUrl = () => `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/trpc`;

function authHeader(req: NextRequest): Record<string, string> {
  const auth = req.headers.get('authorization');
  return auth ? { authorization: auth } : {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const take = Number(searchParams.get('take') ?? 50);
  const cursor = searchParams.get('cursor') ?? undefined;
  const input = encodeURIComponent(JSON.stringify({ '0': { json: { take, cursor } } }));
  try {
    const res = await fetch(`${backendUrl()}/customAgents.memory.list?batch=1&input=${input}`, { headers: authHeader(req) });
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : data;
    if (first?.error) return NextResponse.json({ ok: false, error: first.error?.json?.message ?? 'Query failed.' }, { status: 400 });
    return NextResponse.json({ ok: true, result: first?.result?.data?.json ?? first?.result?.data });
  } catch {
    return NextResponse.json({ ok: false, error: 'Backend unreachable.' }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 }); }
  try {
    const res = await fetch(`${backendUrl()}/customAgents.memory.create?batch=1`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...authHeader(req) },
      body: JSON.stringify({ '0': { json: body } }),
    });
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : data;
    if (first?.error) return NextResponse.json({ ok: false, error: first.error?.json?.message ?? 'Create failed.' }, { status: 400 });
    return NextResponse.json({ ok: true, result: first?.result?.data?.json ?? first?.result?.data }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Backend unreachable.' }, { status: 502 });
  }
}

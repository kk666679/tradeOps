/**
 * /api/agents/orchestrate — proxies workflow execution to backend tRPC.
 */
import { NextRequest, NextResponse } from 'next/server';

const backendUrl = () => `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/trpc`;

function authHeader(req: NextRequest): Record<string, string> {
  const auth = req.headers.get('authorization');
  return auth ? { authorization: auth } : {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? undefined;
  const take = Number(searchParams.get('take') ?? 50);
  const input = encodeURIComponent(JSON.stringify({ '0': { json: { q, take } } }));
  try {
    const res = await fetch(`${backendUrl()}/customAgents.orchestration.listWorkflows?batch=1&input=${input}`, { headers: authHeader(req) });
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
    const res = await fetch(`${backendUrl()}/customAgents.orchestration.execute?batch=1`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...authHeader(req) },
      body: JSON.stringify({ '0': { json: body } }),
    });
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : data;
    if (first?.error) return NextResponse.json({ ok: false, error: first.error?.json?.message ?? 'Execution failed.' }, { status: 400 });
    return NextResponse.json({ ok: true, result: first?.result?.data?.json ?? first?.result?.data });
  } catch {
    return NextResponse.json({ ok: false, error: 'Backend unreachable.' }, { status: 502 });
  }
}

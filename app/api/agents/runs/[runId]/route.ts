/**
 * /api/agents/runs/[runId] — proxies to backend tRPC customAgents.orchestration.getRun
 */
import { NextRequest, NextResponse } from 'next/server';

const backendUrl = () => `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/trpc`;

export async function GET(req: NextRequest, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const auth = req.headers.get('authorization');
  const headers: Record<string, string> = {};
  if (auth) headers['authorization'] = auth;

  const input = encodeURIComponent(JSON.stringify({ '0': { json: { runId } } }));
  try {
    const res = await fetch(`${backendUrl()}/customAgents.orchestration.getRun?batch=1&input=${input}`, { headers });
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : data;
    if (first?.error) return NextResponse.json({ ok: false, error: first.error?.json?.message ?? 'Not found.' }, { status: 404 });
    return NextResponse.json({ ok: true, result: first?.result?.data?.json ?? first?.result?.data });
  } catch {
    return NextResponse.json({ ok: false, error: 'Backend unreachable.' }, { status: 502 });
  }
}

export async function POST() {
  return NextResponse.json({ ok: false, error: 'Use GET to retrieve a run.' }, { status: 405 });
}

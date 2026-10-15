/**
 * /api/agents/runs — proxies to backend tRPC customAgents.orchestration.listRuns
 */
import { NextRequest, NextResponse } from 'next/server';

const backendUrl = () => `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/trpc`;

async function proxyQuery(req: NextRequest, procedure: string, input: unknown) {
  const auth = req.headers.get('authorization');
  const headers: Record<string, string> = {};
  if (auth) headers['authorization'] = auth;

  const url = `${backendUrl()}/${procedure}?batch=1&input=${encodeURIComponent(JSON.stringify({ '0': { json: input } }))}`;
  try {
    const res = await fetch(url, { headers });
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : data;
    if (first?.error) return NextResponse.json({ ok: false, error: first.error?.json?.message ?? 'Query failed.' }, { status: 400 });
    return NextResponse.json({ ok: true, result: first?.result?.data?.json ?? first?.result?.data });
  } catch {
    return NextResponse.json({ ok: false, error: 'Backend unreachable.' }, { status: 502 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get('workflowId') ?? '';
  const take = Number(searchParams.get('take') ?? 50);
  return proxyQuery(req, 'customAgents.orchestration.listRuns', { workflowId, take });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: false, error: 'Use GET to list runs.' }, { status: 405 });
}

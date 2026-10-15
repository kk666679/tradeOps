/**
 * /api/agents/run — proxies to the backend tRPC customAgents.orchestration.execute
 * procedure. All agent execution goes through the tRPC surface; this REST
 * shim exists for non-tRPC callers (webhooks, CLI tools).
 */
import { NextResponse } from 'next/server';

const backendUrl = () => `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/trpc`;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const auth = req.headers.get('authorization');
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (auth) headers['authorization'] = auth;

  try {
    const res = await fetch(
      `${backendUrl()}/customAgents.orchestration.execute?batch=1`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ '0': { json: body } }),
      },
    );
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : data;
    if (first?.error) {
      return NextResponse.json({ ok: false, error: first.error?.json?.message ?? 'Agent execution failed.' }, { status: 400 });
    }
    return NextResponse.json({ ok: true, result: first?.result?.data?.json ?? first?.result?.data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Backend unreachable.' }, { status: 502 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'Use POST to trigger an agent run.' }, { status: 405 });
}

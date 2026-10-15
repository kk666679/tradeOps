/**
 * /api/agents/approve — proxies approval decisions to backend tRPC.
 * High-stakes: requires auth. Body must include { approvalId, decision }.
 */
import { NextResponse } from 'next/server';

const backendUrl = () => `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/trpc`;

export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });

  let body: { approvalId?: string; decision?: string; reason?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 }); }

  if (!body.approvalId || !body.decision) {
    return NextResponse.json({ ok: false, error: 'approvalId and decision are required.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${backendUrl()}/customAgents.supervision.update?batch=1`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: auth },
      body: JSON.stringify({ '0': { json: { id: body.approvalId, decision: body.decision, reason: body.reason } } }),
    });
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : data;
    if (first?.error) return NextResponse.json({ ok: false, error: first.error?.json?.message ?? 'Approval failed.' }, { status: 400 });
    return NextResponse.json({ ok: true, result: first?.result?.data?.json ?? first?.result?.data });
  } catch {
    return NextResponse.json({ ok: false, error: 'Backend unreachable.' }, { status: 502 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'Use POST to submit an approval decision.' }, { status: 405 });
}

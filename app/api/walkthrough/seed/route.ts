import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const DEFAULT_ZONE = { code: 'WALKTHROUGH-OPS', name: 'Walkthrough operations zone', kind: 'MISC' };

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { workflowId?: unknown; input?: unknown };
  const workflowId = typeof body.workflowId === 'string' && body.workflowId.trim()
    ? body.workflowId.trim()
    : 'walkthrough-seed';
  const input = body.input && typeof body.input === 'object' ? body.input : {};

  const zone = await db.zone.upsert({
    where: { code: DEFAULT_ZONE.code },
    create: DEFAULT_ZONE,
    update: {},
  });
  const scenario = await db.scenario.create({
    data: {
      zoneId: zone.id,
      name: workflowId,
      description: 'Persisted walkthrough seed execution',
      parameters: { workflowId, input },
      tags: ['walkthrough', workflowId],
    },
  });
  const run = await db.run.create({
    data: {
      scenarioId: scenario.id,
      status: 'RUNNING',
      totalSteps: 1,
      stepIndex: 0,
      events: {
        create: {
          kind: 'AGENT_ACTION',
          severity: 'INFO',
          message: `Seed queued for ${workflowId}`,
          payload: { workflowId, input },
        },
      },
    },
    select: { id: true, status: true },
  });

  return NextResponse.json({ executionId: run.id, status: run.status.toLowerCase() }, { status: 201 });
}

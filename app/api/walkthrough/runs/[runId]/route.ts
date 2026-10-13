import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const run = await db.run.findUnique({
    where: { id: runId },
    select: { id: true, status: true, stepIndex: true, totalSteps: true, startedAt: true, endedAt: true, finalMetrics: true },
  });
  if (!run) return NextResponse.json({ error: 'Execution not found.' }, { status: 404 });
  return NextResponse.json({
    executionId: run.id,
    status: run.status.toLowerCase(),
    stepIndex: run.stepIndex,
    totalSteps: run.totalSteps,
    startedAt: run.startedAt,
    endedAt: run.endedAt,
    finalMetrics: run.finalMetrics,
  });
}

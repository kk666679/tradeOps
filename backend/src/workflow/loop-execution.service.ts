// backend/src/workflow/loop-execution.service.ts
//
// A seed-driven loop run replays one workflow once per seed record. The run
// header (`WorkflowRun`) carries the loop config and progress counters; each
// attempt is a `LoopIteration`; each iteration's messages are `ExecutionLog`.
//
// Design rules this file upholds:
//   1. Idempotent start. `WorkflowRun.idempotencyKey` is UNIQUE, so a retried
//      `start` (double click, network retry) returns the existing run instead
//      of creating a second loop over the same dataset.
//   2. Progress is persisted, never inferred. `totalIterations` is snapshotted
//      at start; `doneIterations` / `failedIterations` are incremented inside
//      the same transaction that finalises the iteration.
//   3. Failures are isolated per record. `continueOnError` decides whether one
//      bad record aborts the loop or is recorded and skipped.
//   4. Tenant isolation is structural: every query carries `tenantId`.

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queues/queue.service';
import { executeWorkflow, validateWorkflow } from '../custom-agents/orchestration/workflow-engine';

/** BullMQ queue name consumed by the loop worker. */
export const LOOP_QUEUE = 'cfs:workflow-loop';

export interface LoopConfig {
  strategy: 'sequential' | 'batch';
  batchSize: number;
  continueOnError: boolean;
  maxRetries: number;
  backoffMs: number;
}

export const DEFAULT_LOOP_CONFIG: LoopConfig = {
  strategy: 'sequential',
  batchSize: 1,
  continueOnError: true,
  maxRetries: 1,
  backoffMs: 0,
};

export interface StartLoopInput {
  workflowId: string;
  seedDatasetId: string;
  loopConfig?: Partial<LoopConfig>;
  /** Client-supplied key. Reusing it returns the existing run. */
  idempotencyKey?: string;
  /** Extra fields merged into every record before execution. */
  sharedInput?: Record<string, unknown>;
}

export interface LoopRunSummary {
  id: string;
  workflowId: string;
  workflowName: string;
  status: string;
  seedDatasetId: string | null;
  loopConfig: unknown;
  totalIterations: number;
  doneIterations: number;
  failedIterations: number;
  startedAt: string;
  endedAt: string | null;
  error: string | null;
}

const MAX_TOTAL_ITERATIONS = 1000;

type IterationWithRecord = Prisma.LoopIterationGetPayload<{
  include: { record: { select: { recordId: true; payload: true } } };
}>;

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}

export function normaliseLoopConfig(partial?: Partial<LoopConfig>): LoopConfig {
  const cfg = { ...DEFAULT_LOOP_CONFIG, ...(partial ?? {}) };
  const batchSize = Number(cfg.batchSize);
  const maxRetries = Number(cfg.maxRetries);
  const backoffMs = Number(cfg.backoffMs);
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 100) {
    throw new BadRequestException('loopConfig.batchSize must be an integer between 1 and 100.');
  }
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) {
    throw new BadRequestException('loopConfig.maxRetries must be an integer between 0 and 5.');
  }
  if (!Number.isFinite(backoffMs) || backoffMs < 0 || backoffMs > 60_000) {
    throw new BadRequestException('loopConfig.backoffMs must be between 0 and 60000 ms.');
  }
  if (cfg.strategy !== 'sequential' && cfg.strategy !== 'batch') {
    throw new BadRequestException("loopConfig.strategy must be 'sequential' or 'batch'.");
  }
  return { ...cfg, batchSize, maxRetries, backoffMs };
}

type RunWithWorkflow = {
  id: string;
  tenantId: string;
  workflowId: string;
  status: string;
  input: unknown;
  output: unknown;
  error: string | null;
  startedAt: Date;
  endedAt: Date | null;
  steps: unknown;
  seedDatasetId: string | null;
  loopConfig: unknown;
  idempotencyKey: string | null;
  totalIterations: number;
  doneIterations: number;
  failedIterations: number;
  workflow: { workflowId: string; name: string; definition: unknown };
};

/** Map a run row to the wire shape the studio consumes. */
export function toLoopSummary(run: RunWithWorkflow): LoopRunSummary {
  return {
    id: run.id,
    workflowId: run.workflow.workflowId,
    workflowName: run.workflow.name,
    status: run.status,
    seedDatasetId: run.seedDatasetId,
    loopConfig: run.loopConfig,
    totalIterations: run.totalIterations,
    doneIterations: run.doneIterations,
    failedIterations: run.failedIterations,
    startedAt: run.startedAt.toISOString(),
    endedAt: run.endedAt?.toISOString() ?? null,
    error: run.error,
  };
}

@Injectable()
export class LoopExecutionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queues: QueueService,
  ) {}

  private async compareAndSetRunStatus(
    runId: string,
    expected: Array<'QUEUED' | 'RUNNING' | 'CANCELLING'>,
    status: 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED',
    extra: Prisma.WorkflowRunUpdateManyMutationInput = {},
  ): Promise<boolean> {
    const result = await this.prisma.workflowRun.updateMany({
      where: { id: runId, status: { in: expected } },
      data: { ...extra, status },
    });
    return result.count === 1;
  }

  private async completeCancellation(runId: string): Promise<string> {
    const activeIterations = await this.prisma.loopIteration.count({
      where: { runId, status: { in: ['RUNNING', 'RETRYING'] } },
    });
    if (activeIterations > 0) return 'CANCELLING';
    const completed = await this.compareAndSetRunStatus(
      runId,
      ['CANCELLING'],
      'CANCELLED',
      { endedAt: new Date() },
    );
    if (completed) return 'CANCELLED';
    const current = await this.prisma.workflowRun.findUnique({
      where: { id: runId },
      select: { status: true },
    });
    return current?.status ?? 'CANCELLED';
  }

  /** Resolve the draft workflow + dataset a loop will run against. */
  private async resolveTargets(tenantId: string, workflowId: string, seedDatasetId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { tenantId, workflowId, version: 'draft' },
      select: { id: true, workflowId: true, name: true, definition: true, updatedAt: true },
    });
    if (!workflow) throw new NotFoundException('Save this workflow before running a loop.');

    const dataset = await this.prisma.seedDataset.findFirst({
      where: { id: seedDatasetId, tenantId },
      select: { id: true, recordCount: true, updatedAt: true },
    });
    if (!dataset) throw new NotFoundException('Seed dataset not found.');

    const totalRecords = await this.prisma.seedRecord.count({ where: { datasetId: dataset.id } });
    if (totalRecords === 0) {
      throw new BadRequestException('This seed dataset has no records to iterate over.');
    }
    const records = await this.prisma.seedRecord.count({
      where: { datasetId: dataset.id, status: 'VALID' },
    });
    if (records === 0) {
      throw new BadRequestException('This seed dataset has no valid records to iterate over.');
    }
    if (records > MAX_TOTAL_ITERATIONS) {
      throw new BadRequestException(
        `A loop may iterate at most ${MAX_TOTAL_ITERATIONS} records; this dataset has ${records}.`,
      );
    }
    return { workflow, dataset, recordCount: records };
  }

  /**
   * Start a seed-driven loop run.
   *
   * Creates the run header with `totalIterations` snapshotted, enqueues the
   * batch job, and returns immediately — the worker performs the iterations so
   * a large dataset cannot time out an HTTP request.
   */
  async startLoop(
    tenantId: string,
    actorId: string,
    input: StartLoopInput,
  ): Promise<LoopRunSummary & { deduplicated: boolean }> {
    if (!this.queues.isEnabled) {
      throw new ServiceUnavailableException(
        'Workflow loop execution requires Redis-backed workers. Configure REDIS_URL and retry.',
      );
    }
    const loopConfig = normaliseLoopConfig(input.loopConfig);
    const { workflow, dataset, recordCount } = await this.resolveTargets(
      tenantId,
      input.workflowId,
      input.seedDatasetId,
    );

    const definition = (workflow.definition as any)?.graph ?? workflow.definition;
    const issues = validateWorkflow(definition as never);
    if (issues.length) {
      throw new BadRequestException(
        `Workflow validation failed: ${issues.map((i) => i.message).join('; ')}`,
      );
    }

    const configHash = createHash('sha256')
      .update(stableJson({
        loopConfig,
        sharedInput: input.sharedInput ?? {},
        workflowDefinition: workflow.definition,
        workflowUpdatedAt: workflow.updatedAt.toISOString(),
        datasetUpdatedAt: dataset.updatedAt.toISOString(),
      }))
      .digest('hex');
    const idempotencyKey = input.idempotencyKey?.trim() || createHash('sha256')
      .update(`${tenantId}:${workflow.workflowId}:${dataset.id}:${configHash}:${actorId}`)
      .digest('hex');

    // Idempotent: an existing run with this key wins. Re-running the same loop
    // must not double-process the dataset.
    const existing = await this.prisma.workflowRun.findUnique({
      where: { idempotencyKey },
      include: { workflow: { select: { name: true, definition: true } } },
    });
    if (existing) {
      if (existing.tenantId !== tenantId) {
        throw new NotFoundException('Run not found.');
      }
      return { ...toLoopSummary(existing as never), deduplicated: true };
    }

    let run;
    try {
      run = await this.prisma.workflowRun.create({
        data: {
          tenantId,
          workflowId: workflow.id,
          status: 'QUEUED',
          input: { sharedInput: input.sharedInput ?? {} } as never,
          steps: [] as never,
          seedDatasetId: dataset.id,
          loopConfig: loopConfig as never,
          idempotencyKey,
          totalIterations: recordCount,
          doneIterations: 0,
          failedIterations: 0,
        },
        include: { workflow: { select: { name: true, definition: true } } },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
        throw error;
      }
      const raced = await this.prisma.workflowRun.findUnique({
        where: { idempotencyKey },
        include: { workflow: { select: { name: true, definition: true } } },
      });
      if (!raced || raced.tenantId !== tenantId) throw error;
      return { ...toLoopSummary(raced as never), deduplicated: true };
    }

    await this.writeLog(run.id, null, 'INFO', `Loop queued over ${recordCount} record(s).`);

    try {
      const dispatch = await this.queues.enqueue(LOOP_QUEUE, 'loop.iterate', {
        tenantId,
        runId: run.id,
        actorId,
        sharedInput: input.sharedInput ?? {},
        loopConfig,
      });
      if (!dispatch.dispatched) {
        throw new ServiceUnavailableException('Redis queue is unavailable; loop was not dispatched.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Queue dispatch failed.';
      await this.prisma.workflowRun.update({
        where: { id: run.id },
        data: { status: 'FAILED', error: message.slice(0, 2000), endedAt: new Date() },
      });
      await this.writeLog(run.id, null, 'ERROR', `Loop dispatch failed: ${message}`);
      throw error;
    }

    return { ...toLoopSummary(run as never), deduplicated: false };
  }

  /** Append a run-scoped execution log line. */
  async writeLog(
    runId: string,
    iterationId: string | null,
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR',
    message: string,
    nodeId?: string,
    payload?: unknown,
  ): Promise<void> {
    const run = await this.prisma.workflowRun.findUnique({
      where: { id: runId },
      select: { tenantId: true },
    });
    if (!run) return;
    await this.prisma.executionLog.create({
      data: {
        tenantId: run.tenantId,
        runId,
        iterationId,
        level,
        message: message.slice(0, 2000),
        nodeId: nodeId ?? null,
        payload: (payload ?? null) as never,
      },
    });
  }

  /** Run detail for the execution monitor, including iteration progress. */
  async getRun(tenantId: string, runId: string): Promise<{
    run: LoopRunSummary;
    iterations: Array<{
      id: string;
      recordId: string;
      status: string;
      attempt: number;
      input: unknown;
      output: unknown;
      error: string | null;
      startedAt: string | null;
      endedAt: string | null;
      durationMs: number | null;
    }>;
    logs: Array<{
      id: string;
      level: string;
      message: string;
      nodeId: string | null;
      at: string;
    }>;
  }> {
    const run = await this.prisma.workflowRun.findFirst({
      where: { id: runId, tenantId },
      include: { workflow: { select: { workflowId: true, name: true, definition: true } } },
    });
    if (!run) throw new NotFoundException('Run not found.');

    const iterations = await this.prisma.loopIteration.findMany({
      where: { runId: run.id },
      orderBy: { startedAt: 'asc' },
      take: 1000,
      include: { record: { select: { recordId: true } } },
    });
    const logs = await this.prisma.executionLog.findMany({
      where: { runId: run.id },
      orderBy: { at: 'desc' },
      take: 200,
    });

    return {
      run: toLoopSummary(run as never),
      iterations: iterations.map((it) => ({
        id: it.id,
        recordId: it.record.recordId,
        status: it.status,
        attempt: it.attempt,
        input: it.input,
        output: it.output,
        error: it.error,
        startedAt: it.startedAt?.toISOString() ?? null,
        endedAt: it.endedAt?.toISOString() ?? null,
        durationMs: it.durationMs,
      })),
      logs: logs.map((l) => ({
        id: l.id,
        level: l.level,
        message: l.message,
        nodeId: l.nodeId,
        at: l.at.toISOString(),
      })),
    };
  }

  /** Recent loop runs for a tenant — powers the Runs page and studio history. */
  async listRuns(
    tenantId: string,
    opts: { workflowId?: string; take?: number } = {},
  ): Promise<LoopRunSummary[]> {
    const workflowFilter = opts.workflowId
      ? {
          workflow: {
            is: { workflowId: opts.workflowId, version: 'draft' },
          },
        }
      : {};

    const runs = await this.prisma.workflowRun.findMany({
      where: {
        tenantId,
        seedDatasetId: { not: null },
        ...workflowFilter,
      },
      orderBy: { startedAt: 'desc' },
      take: Math.min(Math.max(opts.take ?? 50, 1), 200),
      include: { workflow: { select: { workflowId: true, name: true, definition: true } } },
    });
    return runs.map((r) => toLoopSummary(r as never));
  }

  /** Cancel a queued or running loop. Terminal runs are left untouched. */
  async cancelRun(tenantId: string, runId: string): Promise<LoopRunSummary> {
    const run = await this.prisma.workflowRun.findFirst({
      where: { id: runId, tenantId },
      include: { workflow: { select: { workflowId: true, name: true, definition: true } } },
    });
    if (!run) throw new NotFoundException('Run not found.');
    const queuedCancelled = await this.prisma.workflowRun.updateMany({
      where: { id: run.id, tenantId, status: 'QUEUED' },
      data: { status: 'CANCELLED', endedAt: new Date() },
    });
    const runningCancelled = queuedCancelled.count === 0
      ? await this.prisma.workflowRun.updateMany({
          where: { id: run.id, tenantId, status: 'RUNNING' },
          data: { status: 'CANCELLING' },
        })
      : { count: 0 };
    if (queuedCancelled.count === 1 || runningCancelled.count === 1) {
      await this.prisma.loopIteration.updateMany({
        where: { runId: run.id, status: 'PENDING' },
        data: { status: 'SKIPPED', endedAt: new Date() },
      });
      await this.writeLog(run.id, null, 'WARN', queuedCancelled.count === 1
        ? 'Queued loop cancelled.'
        : 'Loop cancellation requested; active iteration will finish.');
    }
    if (runningCancelled.count === 1 || run.status === 'CANCELLING') {
      await this.completeCancellation(run.id);
    }
    const current = await this.prisma.workflowRun.findFirst({
      where: { id: run.id, tenantId },
      include: { workflow: { select: { workflowId: true, name: true, definition: true } } },
    });
    if (!current) throw new NotFoundException('Run not found.');
    return toLoopSummary(current as never);
  }

  /**
   * Process one batch of a loop run. Called by the BullMQ worker.
   *
   * Claims the next `batchSize` PENDING iterations, runs the workflow once per
   * record, and advances the run's counters in the same transaction. When the
   * batch is exhausted the run transitions to SUCCEEDED or FAILED.
   */
  async processBatch(tenantId: string, runId: string): Promise<{
    processed: number;
    remaining: number;
    status: string;
  }> {
    const run = await this.prisma.workflowRun.findFirst({
      where: { id: runId, tenantId },
      include: { workflow: { select: { workflowId: true, name: true, definition: true } } },
    });
    if (!run) throw new NotFoundException('Run not found.');
    if (['SUCCEEDED', 'FAILED', 'CANCELLED'].includes(run.status)) {
      return { processed: 0, remaining: 0, status: run.status };
    }
    if (run.status === 'CANCELLING') {
      const remaining = await this.prisma.loopIteration.count({
        where: { runId: run.id, status: 'PENDING' },
      });
      return { processed: 0, remaining, status: await this.completeCancellation(run.id) };
    }

    const cfg = normaliseLoopConfig((run.loopConfig ?? undefined) as Partial<LoopConfig> | undefined);
    const definition = (run.workflow.definition as any)?.graph ?? run.workflow.definition;
    const sharedInput = ((run.input as any)?.sharedInput ?? {}) as Record<string, unknown>;

    if (run.status === 'QUEUED') {
      const claimed = await this.compareAndSetRunStatus(run.id, ['QUEUED'], 'RUNNING');
      if (!claimed) {
        const latest = await this.prisma.workflowRun.findUnique({
          where: { id: run.id },
          select: { status: true },
        });
        if (latest?.status !== 'RUNNING') {
          return { processed: 0, remaining: 0, status: latest?.status ?? 'CANCELLED' };
        }
      } else {
        await this.writeLog(run.id, null, 'INFO', 'Loop started.');
      }
    }

    await this.ensureIterationsPlanned(run.id, run.seedDatasetId!, cfg);

    const batch = await this.prisma.loopIteration.findMany({
      where: { runId: run.id, status: 'PENDING', run: { is: { status: 'RUNNING' } } },
      orderBy: { record: { recordId: 'asc' } },
      take: cfg.batchSize,
      include: { record: { select: { recordId: true, payload: true } } },
    });

    let processed = 0;
    let aborted = false;

    for (const iteration of batch) {
      // Honour a cancellation that landed mid-batch.
      const fresh = await this.prisma.workflowRun.findUnique({
        where: { id: run.id },
        select: { status: true },
      });
      if (fresh?.status === 'CANCELLED') {
        aborted = true;
        break;
      }
      const outcome = await this.runIteration(run, iteration, cfg, definition, sharedInput);
      if (outcome === 'cancelled') aborted = true;
      const latest = await this.prisma.workflowRun.findUnique({
        where: { id: run.id },
        select: { status: true },
      });
      if (latest?.status === 'CANCELLING' || latest?.status === 'CANCELLED') aborted = true;
      if (aborted) break;
      if (outcome === 'failed' && !cfg.continueOnError) {
        aborted = true;
        break;
      }
      processed += 1;
    }

    if (aborted) {
      const latest = await this.prisma.workflowRun.findUnique({
        where: { id: run.id },
        select: { status: true },
      });
      await this.prisma.loopIteration.updateMany({
        where: { runId: run.id, status: 'PENDING' },
        data: { status: 'SKIPPED', endedAt: new Date() },
      });
      if (latest?.status === 'CANCELLING' || latest?.status === 'CANCELLED') {
        const remaining = await this.prisma.loopIteration.count({
          where: { runId: run.id, status: 'PENDING' },
        });
        return { processed, remaining, status: await this.completeCancellation(run.id) };
      }
    }

    const pendingIterations = await this.prisma.loopIteration.count({
      where: { runId: run.id, status: 'PENDING' },
    });
    const activeIterations = await this.prisma.loopIteration.count({
      where: { runId: run.id, status: { in: ['RUNNING', 'RETRYING'] } },
    });
    const remaining = pendingIterations + activeIterations;
    const status = await this.finaliseIfDrained(run.id, remaining, aborted);

    // Re-enqueue while work remains so the worker drains the run incrementally.
    if (!aborted && pendingIterations > 0) {
      await this.queues.enqueue(LOOP_QUEUE, 'loop.iterate', {
        tenantId,
        runId: run.id,
        loopConfig: cfg,
      });
    }

    return { processed, remaining, status };
  }

  /**
   * Materialise one iteration per seed record the first time the run is worked,
   * so progress is visible before any record has finished. Idempotent: it is a
   * no-op once iterations exist.
   */
  private async ensureIterationsPlanned(
    runId: string,
    datasetId: string,
    cfg: LoopConfig,
  ): Promise<void> {
    const existing = await this.prisma.loopIteration.count({ where: { runId } });
    if (existing > 0) return;

    const records = await this.prisma.seedRecord.findMany({
      where: { datasetId, status: 'VALID' },
      orderBy: { recordId: 'asc' },
      select: { id: true },
    });
    if (records.length) {
      await this.prisma.loopIteration.createMany({
        data: records.map((r) => ({ runId, recordId: r.id, status: 'PENDING' as const })),
        skipDuplicates: true,
      });
    }
    await this.writeLog(
      runId,
      null,
      'INFO',
      `Planned ${records.length} iteration(s) (${cfg.strategy}, batch ${cfg.batchSize}).`,
    );
  }

  /** Execute the workflow once for a single record and persist the outcome. */
  private async runIteration(
    run: RunWithWorkflow,
    iteration: IterationWithRecord,
    cfg: LoopConfig,
    definition: unknown,
    sharedInput: Record<string, unknown>,
  ): Promise<'succeeded' | 'failed' | 'cancelled' | 'not_claimed'> {
    const startedAt = new Date();
    const payload = iteration.record.payload;
    if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new BadRequestException(`Seed record ${iteration.record.recordId} must be a JSON object.`);
    }
    const input = { ...sharedInput, ...(payload as Record<string, unknown>) };

    const claim = await this.prisma.loopIteration.updateMany({
      where: {
        id: iteration.id,
        status: 'PENDING',
        run: { is: { status: 'RUNNING' } },
      },
      data: { status: 'RUNNING', attempt: 1, startedAt, input: payload as never },
    });
    if (claim.count !== 1) return 'not_claimed';

    for (let attempt = 1; attempt <= cfg.maxRetries + 1; attempt += 1) {
      if (attempt > 1) {
        const retryClaim = await this.prisma.loopIteration.updateMany({
          where: {
            id: iteration.id,
            status: 'RETRYING',
            run: { is: { status: 'RUNNING' } },
          },
          data: { status: 'RUNNING', attempt },
        });
        if (retryClaim.count !== 1) {
          const runStatus = await this.prisma.workflowRun.findUnique({
            where: { id: run.id },
            select: { status: true },
          });
          if (runStatus?.status !== 'CANCELLING' && runStatus?.status !== 'CANCELLED') {
            return 'not_claimed';
          }
          const endedAt = new Date();
          await this.prisma.loopIteration.updateMany({
            where: { id: iteration.id, status: 'RETRYING' },
            data: { status: 'SKIPPED', endedAt, durationMs: endedAt.getTime() - startedAt.getTime() },
          });
          return 'cancelled';
        }
      }

      try {
        const result = await executeWorkflow(definition as never, input, {
          executionId: `${run.id}:${iteration.record.recordId}`,
          workflowId: run.workflow.workflowId,
          actorId: 'loop-worker',
        });

        const endedAt = new Date();
        const durationMs = endedAt.getTime() - startedAt.getTime();
        const finalized = await this.prisma.$transaction(async (tx) => {
          const transitioned = await tx.loopIteration.updateMany({
            where: { id: iteration.id, status: 'RUNNING' },
            data: { status: 'SUCCEEDED', output: result.output as never, error: null, endedAt, durationMs },
          });
          if (transitioned.count !== 1) return false;
          await tx.workflowRun.update({
            where: { id: run.id },
            data: { doneIterations: { increment: 1 } },
          });
          return true;
        });
        if (!finalized) return 'not_claimed';

        for (const step of result.steps) {
          await this.writeLog(
            run.id,
            iteration.id,
            step.status === 'FAILED' ? 'ERROR' : 'INFO',
            `[${iteration.record.recordId}] ${step.nodeId}: ${step.status}`,
            step.nodeId,
            step.output,
          );
        }
        return 'succeeded';
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Iteration failed.';
        if (attempt <= cfg.maxRetries) {
          const retrying = await this.prisma.loopIteration.updateMany({
            where: { id: iteration.id, status: 'RUNNING', run: { is: { status: 'RUNNING' } } },
            data: { status: 'RETRYING', attempt, error: message.slice(0, 2000) },
          });
          if (retrying.count !== 1) {
            return this.persistFailedIteration(run.id, iteration, attempt, message, startedAt);
          }
          await this.writeLog(
            run.id,
            iteration.id,
            'WARN',
            `[${iteration.record.recordId}] attempt ${attempt} failed; retry scheduled.`,
          );
          const delayMs = Math.min(cfg.backoffMs * 2 ** (attempt - 1), 60_000);
          if (delayMs > 0) await new Promise<void>((complete) => setTimeout(complete, delayMs));
          continue;
        }

        const endedAt = new Date();
        const durationMs = endedAt.getTime() - startedAt.getTime();
        return this.persistFailedIteration(run.id, iteration, attempt, message, startedAt, endedAt, durationMs);
      }
    }

    return 'failed';
  }

  private async persistFailedIteration(
    runId: string,
    iteration: IterationWithRecord,
    attempt: number,
    message: string,
    startedAt: Date,
    endedAt = new Date(),
    durationMs = endedAt.getTime() - startedAt.getTime(),
  ): Promise<'failed' | 'not_claimed'> {
    const failed = await this.prisma.$transaction(async (tx) => {
      const transitioned = await tx.loopIteration.updateMany({
        where: { id: iteration.id, status: 'RUNNING' },
        data: {
          status: 'FAILED',
          attempt,
          error: message.slice(0, 2000),
          endedAt,
          durationMs,
        },
      });
      if (transitioned.count !== 1) return false;
      await tx.workflowRun.update({
        where: { id: runId },
        data: { failedIterations: { increment: 1 } },
      });
      return true;
    });
    if (!failed) return 'not_claimed';
    await this.writeLog(runId, iteration.id, 'ERROR', `[${iteration.record.recordId}] ${message}`);
    return 'failed';
  }

  /** Close out the run once every iteration is no longer PENDING. */
  private async finaliseIfDrained(
    runId: string,
    remaining: number,
    aborted: boolean,
  ): Promise<string> {
    if (aborted) {
      if (remaining > 0) return 'RUNNING';
      const transitioned = await this.compareAndSetRunStatus(runId, ['RUNNING'], 'FAILED', {
        endedAt: new Date(),
        error: 'Loop aborted: an iteration failed and continueOnError is false.',
      });
      if (!transitioned) {
        const latest = await this.prisma.workflowRun.findUnique({ where: { id: runId }, select: { status: true } });
        if (latest?.status === 'CANCELLING') return this.completeCancellation(runId);
        return latest?.status ?? 'CANCELLED';
      }
      await this.writeLog(runId, null, 'ERROR', 'Loop aborted after a failing iteration.');
      return 'FAILED';
    }
    if (remaining > 0) return 'RUNNING';

    const final = await this.prisma.workflowRun.findUnique({
      where: { id: runId },
      select: { failedIterations: true, totalIterations: true },
    });
    const failed = final?.failedIterations ?? 0;
    const hasFailures = failed > 0;
    const status = hasFailures ? 'FAILED' : 'SUCCEEDED';
    const transitioned = await this.compareAndSetRunStatus(runId, ['RUNNING'], status, {
      endedAt: new Date(),
      error: hasFailures
        ? `${failed} of ${final?.totalIterations ?? 0} iteration(s) failed.`
        : null,
    });
    if (!transitioned) {
      const latest = await this.prisma.workflowRun.findUnique({ where: { id: runId }, select: { status: true } });
      if (latest?.status === 'CANCELLING') return this.completeCancellation(runId);
      return latest?.status ?? 'CANCELLED';
    }
    await this.writeLog(
      runId,
      null,
      hasFailures ? 'WARN' : 'INFO',
      hasFailures ? `Loop finished with ${failed} failure(s).` : 'Loop finished successfully.',
    );
    return status;
  }
}

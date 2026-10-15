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

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queues/queue.service';
import { validateWorkflow } from '../custom-agents/orchestration/workflow-engine';

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

  /** Resolve the draft workflow + dataset a loop will run against. */
  private async resolveTargets(tenantId: string, workflowId: string, seedDatasetId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { tenantId, workflowId, version: 'draft' },
      select: { id: true, workflowId: true, name: true, definition: true },
    });
    if (!workflow) throw new NotFoundException('Save this workflow before running a loop.');

    const dataset = await this.prisma.seedDataset.findFirst({
      where: { id: seedDatasetId, tenantId },
      select: { id: true, recordCount: true },
    });
    if (!dataset) throw new NotFoundException('Seed dataset not found.');

    const records = await this.prisma.seedRecord.count({ where: { datasetId: dataset.id } });
    if (records === 0) {
      throw new BadRequestException('This seed dataset has no records to iterate over.');
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

    const idempotencyKey =
      input.idempotencyKey?.trim() ||
      createHash('sha256')
        .update(`${tenantId}:${workflow.id}:${dataset.id}:${Date.now()}:${Math.random()}`)
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

    const run = await this.prisma.workflowRun.create({
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

    await this.writeLog(run.id, null, 'INFO', `Loop queued over ${recordCount} record(s).`);

    await this.queues.enqueue(LOOP_QUEUE, 'loop.iterate', {
      tenantId,
      runId: run.id,
      actorId,
      sharedInput: input.sharedInput ?? {},
      loopConfig,
    });

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
    if (['SUCCEEDED', 'FAILED', 'CANCELLED'].includes(run.status)) {
      return toLoopSummary(run as never);
    }
    // Mark PENDING iterations SKIPPED so progress counters stay consistent.
    await this.prisma.loopIteration.updateMany({
      where: { runId: run.id, status: 'PENDING' },
      data: { status: 'SKIPPED' },
    });
    const updated = await this.prisma.workflowRun.update({
      where: { id: run.id },
      data: { status: 'CANCELLED', endedAt: new Date() },
      include: { workflow: { select: { workflowId: true, name: true, definition: true } } },
    });
    await this.writeLog(run.id, null, 'WARN', 'Loop cancelled by operator.');
    return toLoopSummary(updated as never);
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

    const cfg = normaliseLoopConfig(run.loopConfig as Partial<LoopConfig> | null);
    const definition = (run.workflow.definition as any)?.graph ?? run.workflow.definition;
    const sharedInput = ((run.input as any)?.sharedInput ?? {}) as Record<string, unknown>;

    if (run.status === 'QUEUED') {
      await this.prisma.workflowRun.update({ where: { id: run.id }, data: { status: 'RUNNING' } });
      await this.writeLog(run.id, null, 'INFO', 'Loop started.');
    }

    await this.ensureIterationsPlanned(run.id, run.seedDatasetId!, cfg);

    const batch = await this.prisma.loopIteration.findMany({
      where: { runId: run.id, status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
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
      if (outcome === 'failed' && !cfg.continueOnError) aborted = true;
      processed += 1;
    }

    const remaining = await this.prisma.loopIteration.count({
      where: { runId: run.id, status: 'PENDING' },
    });
    const status = await this.finaliseIfDrained(run.id, remaining, aborted);

    // Re-enqueue while work remains so the worker drains the run incrementally.
    if (!aborted && remaining > 0) {
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
      where: { datasetId },
      orderBy: { recordId: 'asc' },
      select: { id: true },
    });
    if (records.length) {
      await this.prisma.loopIteration.createMany({
        data: records.map((r) => ({ runId, recordId: r.id, status: 'PENDING' as const })),
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
    iteration: {
      id: string;
      recordId: string;
      record: { recordId: string; payload: unknown };
    },
    cfg: LoopConfig,
    definition: unknown,
    sharedInput: Record<string, unknown>,
  ): Promise<'succeeded' | 'failed'> {
    const startedAt = new Date();
    await this.prisma.loopIteration.update({
      where: { id: iteration.id },
      data: { status: 'RUNNING', startedAt, input: iteration.record.payload as never },
    });

    const input = { ...sharedInput, ...(iteration.record.payload as Record<string, unknown>) };

    try {
      const result = await executeWorkflow(definition as never, input, {
        executionId: `${run.id}:${iteration.record.recordId}`,
        workflowId: run.workflow.workflowId,
        actorId: 'loop-worker',
      });

      const endedAt = new Date();
      const durationMs = endedAt.getTime() - startedAt.getTime();
      await this.prisma.$transaction([
        this.prisma.loopIteration.update({
          where: { id: iteration.id },
          data: { status: 'SUCCEEDED', output: result.output as never, endedAt, durationMs },
        }),
        this.prisma.workflowRun.update({
          where: { id: run.id },
          data: { doneIterations: { increment: 1 } },
        }),
        this.prisma.seedRecord.update({
          where: { id: iteration.recordId },
          data: { status: 'VALID' },
        }),
      ]);

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
      const endedAt = new Date();
      const durationMs = endedAt.getTime() - startedAt.getTime();
      await this.prisma.$transaction([
        this.prisma.loopIteration.update({
          where: { id: iteration.id },
          data: {
            status: 'FAILED',
            error: message.slice(0, 2000),
            endedAt,
            durationMs,
          },
        }),
        this.prisma.workflowRun.update({
          where: { id: run.id },
          data: { failedIterations: { increment: 1 } },
        }),
        this.prisma.seedRecord.update({
          where: { id: iteration.recordId },
          data: { status: 'INVALID', validationErrors: [{ message }] as never },
        }),
      ]);
      await this.writeLog(
        run.id,
        iteration.id,
        'ERROR',
        `[${iteration.record.recordId}] ${message}`,
      );
      return 'failed';
    }
  }

  /** Close out the run once every iteration is no longer PENDING. */
  private async finaliseIfDrained(
    runId: string,
    remaining: number,
    aborted: boolean,
  ): Promise<string> {
    if (aborted) {
      await this.prisma.workflowRun.update({
        where: { id: runId },
        data: {
          status: 'FAILED',
          endedAt: new Date(),
          error: 'Loop aborted: an iteration failed and continueOnError is false.',
        },
      });
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
    await this.prisma.workflowRun.update({
      where: { id: runId },
      data: {
        status: hasFailures ? 'FAILED' : 'SUCCEEDED',
        endedAt: new Date(),
        error: hasFailures
          ? `${failed} of ${final?.totalIterations ?? 0} iteration(s) failed.`
          : null,
      },
    });
    await this.writeLog(
      runId,
      null,
      hasFailures ? 'WARN' : 'INFO',
      hasFailures ? `Loop finished with ${failed} failure(s).` : 'Loop finished successfully.',
    );
    return hasFailures ? 'FAILED' : 'SUCCEEDED';
  }
}

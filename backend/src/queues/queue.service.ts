import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { Queue, Worker, type Job } from 'bullmq';
import IORedis, { type Redis } from 'ioredis';

interface LoopIterateJob {
  tenantId: string;
  runId: string;
  actorId?: string;
  sharedInput?: Record<string, unknown>;
  loopConfig?: unknown;
}

/** Shape of the handler the queue invokes for a job. */
export type JobHandler = (data: any) => Promise<unknown>;

/**
 * BullMQ-backed job queue.
 *
 * A single shared Redis connection is used for the client side; each worker
 * gets its own connection because BullMQ requires blocking connections to be
 * dedicated. When `REDIS_URL` is not configured the service degrades to a
 * no-op so the API still boots in environments without Redis (local dev,
 * tests) — the caller is told nothing was enqueued rather than being misled.
 */
@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private readonly connection: Redis | null = null;
  private readonly queues = new Map<string, Queue>();
  private readonly workers: Worker[] = [];
  private readonly handlers = new Map<string, JobHandler>();

  constructor() {
    const url = process.env.REDIS_URL;
    if (url) {
      // maxRetriesPerRequest must be null for BullMQ's blocking commands.
      this.connection = new IORedis(url, { maxRetriesPerRequest: null });
    } else {
      this.logger.warn(
        'REDIS_URL is not set — background jobs will not be dispatched. ' +
          'Long-running loops must be executed with a configured Redis.',
      );
    }
  }

  get isEnabled(): boolean {
    return this.connection !== null;
  }

  onModuleInit() {
    if (!this.connection) return;
    this.connection.on('error', (err) => this.logger.error(`Redis error: ${err.message}`));
  }

  /** Register the handler used for every job on `queue`. */
  registerWorker(queue: string, handler: JobHandler, concurrency = 1): void {
    this.handlers.set(queue, handler);
    if (!this.connection) return;
    const worker = new Worker(
      queue,
      async (job: Job) => {
        const fn = this.handlers.get(job.name) ?? this.handlers.get(queue);
        if (!fn) throw new Error(`No handler registered for ${queue}#${job.name}`);
        return fn(job.data);
      },
      { connection: this.connection.duplicate(), concurrency },
    );
    worker.on('failed', (job, err) =>
      this.logger.error(`Job ${queue}#${job?.name} failed: ${err.message}`),
    );
    this.workers.push(worker);
  }

  private queueFor(name: string): Queue | null {
    if (!this.connection) return null;
    let q = this.queues.get(name);
    if (!q) {
      q = new Queue(name, { connection: this.connection.duplicate() });
      this.queues.set(name, q);
    }
    return q;
  }

  /**
   * Dispatch a job. Returns `dispatched: false` when Redis is unavailable so
   * callers can surface that work was not backgrounded.
   */
  async enqueue(queue: string, name: string, data: unknown) {
    const q = this.queueFor(queue);
    if (!q) return { queue, name, data, dispatched: false as const };
    const job = await q.add(name, data as object, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: { age: 3600, count: 1000 },
      removeOnFail: { age: 24 * 3600 },
    });
    return { queue, name, data, dispatched: true as const, jobId: job.id };
  }

  async onModuleDestroy() {
    await Promise.all(this.workers.map((w) => w.close()));
    await Promise.all([...this.queues.values()].map((q) => q.close()));
    await this.connection?.quit();
  }
}

export type { LoopIterateJob };


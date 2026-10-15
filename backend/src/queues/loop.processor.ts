// backend/src/queues/loop.processor.ts
//
// Consumes the `cfs:workflow-loop` queue. Each job processes one batch of a
// loop run; the service re-enqueues while iterations remain, so a large
// dataset drains incrementally instead of holding a single long-lived job.

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LoopExecutionService } from '../workflow/loop-execution.service';

export const LOOP_QUEUE = 'cfs:workflow-loop';

@Injectable()
export class LoopProcessor implements OnModuleInit {
  private readonly logger = new Logger(LoopProcessor.name);

  constructor(
    private readonly queues: import('./queue.service').QueueService,
    private readonly loops: LoopExecutionService,
  ) {}

  onModuleInit() {
    this.queues.registerWorker(LOOP_QUEUE, async (data) => {
      const { tenantId, runId } = data as { tenantId: string; runId: string };
      if (!tenantId || !runId) throw new Error('loop.iterate job requires tenantId and runId.');
      const result = await this.loops.processBatch(tenantId, runId);
      this.logger.debug(
        `run ${runId}: processed=${result.processed} remaining=${result.remaining} status=${result.status}`,
      );
      return result;
    });
  }
}

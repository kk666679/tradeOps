import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { LoopExecutionService } from './loop-execution.service';
import { SeedRouter } from './seed.router';

/**
 * Seed datasets + seed-driven loop execution.
 *
 * `LoopExecutionService` depends on `QueueService`, which is exported by
 * `QueuesModule`; importing it here keeps the dependency explicit.
 */
@Module({
  imports: [],
  providers: [SeedService, LoopExecutionService, SeedRouter],
  exports: [SeedService, LoopExecutionService],
})
export class WorkflowModule {}

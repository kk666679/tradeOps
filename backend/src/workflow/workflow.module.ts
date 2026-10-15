import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { QueuesModule } from '../queues/queues.module';
import { LoopProcessor } from '../queues/loop.processor';
import { SeedService } from './seed.service';
import { LoopExecutionService } from './loop-execution.service';

/**
 * Seed datasets + seed-driven loop execution.
 *
 * `LoopExecutionService` depends on `QueueService`, which is exported by
 * `QueuesModule`; importing it here keeps the dependency explicit.
 */
@Module({
  imports: [PrismaModule, QueuesModule],
  providers: [SeedService, LoopExecutionService, LoopProcessor],
  exports: [SeedService, LoopExecutionService],
})
export class WorkflowModule {}

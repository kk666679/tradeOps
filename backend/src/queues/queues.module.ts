import { Module } from '@nestjs/common';
import { EmbeddingProcessor } from './embedding.processor';
import { LlmProcessor } from './llm.processor';
import { ForecastProcessor } from './forecast.processor';
import { AgentProcessor } from './agent.processor';
import { TwinProcessor } from './twin.processor';
import { QueueService } from './queue.service';

@Module({
  providers: [QueueService, EmbeddingProcessor, LlmProcessor, ForecastProcessor, AgentProcessor, TwinProcessor],
  exports: [QueueService],
})
export class QueuesModule {}

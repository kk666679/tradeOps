import { Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { LlmService } from './llm.service';
import { RagService } from './rag.service';
import { ForecastingService } from './forecasting.service';
import { MemoryService } from './memory.service';
import { VectorService } from './vector.service';

@Module({
  providers: [EmbeddingsService, LlmService, RagService, ForecastingService, MemoryService, VectorService],
  exports: [EmbeddingsService, LlmService, RagService, ForecastingService, MemoryService, VectorService],
})
export class AiModule {}

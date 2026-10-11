import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PrismaModule } from '../prisma/prisma.module';
import { EmbeddingWorker } from './embedding.worker';
import { LlmWorker } from './llm.worker';
import { ForecastWorker } from './forecast.worker';
import { AgentWorker } from './agent.worker';
import { TwinWorker } from './twin.worker';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [EmbeddingWorker, LlmWorker, ForecastWorker, AgentWorker, TwinWorker],
})
export class WorkersModule {}

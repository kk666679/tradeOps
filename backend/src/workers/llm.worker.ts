import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class LlmWorker implements OnModuleInit, OnModuleDestroy {
  constructor(private prisma: PrismaService) {}
  async onModuleInit() { /* boot BullMQ Worker('cfs:llm', handler) */ }
  async onModuleDestroy() { /* close */ }
}

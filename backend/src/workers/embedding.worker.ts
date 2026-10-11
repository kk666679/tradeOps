import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class EmbeddingWorker implements OnModuleInit, OnModuleDestroy {
  constructor(private prisma: PrismaService) {}
  async onModuleInit() { /* boot BullMQ Worker('cfs:embedding', handler) */ }
  async onModuleDestroy() { /* close */ }
}

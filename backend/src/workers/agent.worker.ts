import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class AgentWorker implements OnModuleInit, OnModuleDestroy {
  constructor(private prisma: PrismaService) {}
  async onModuleInit() { /* boot BullMQ Worker('cfs:agent', handler) */ }
  async onModuleDestroy() { /* close */ }
}

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class TwinWorker implements OnModuleInit, OnModuleDestroy {
  constructor(private prisma: PrismaService) {}
  async onModuleInit() { /* boot BullMQ Worker('cfs:twin', handler) */ }
  async onModuleDestroy() { /* close */ }
}

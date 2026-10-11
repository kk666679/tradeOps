import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ForecastWorker implements OnModuleInit, OnModuleDestroy {
  constructor(private prisma: PrismaService) {}
  async onModuleInit() { /* boot BullMQ Worker('cfs:forecast', handler) */ }
  async onModuleDestroy() { /* close */ }
}

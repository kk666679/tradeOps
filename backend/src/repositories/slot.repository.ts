import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';

@Injectable()
export class SlotRepository extends BaseRepository<Record<string, unknown>> {
  constructor(prisma: PrismaService) { super(prisma, 'slot' as any); }
}

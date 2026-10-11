import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';

@Injectable()
export class InventoryRepository extends BaseRepository<Record<string, unknown>> {
  constructor(prisma: PrismaService) { super(prisma, 'inventory' as any); }
}

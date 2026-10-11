import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryRepository } from '../repositories/inventory.repository';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService, private repo: InventoryRepository) {}

  list(tenantId: string, args: Record<string, unknown> = {}) { return this.repo.findMany(tenantId, args); }
  byId(tenantId: string, id: string) { return this.repo.findById(tenantId, id); }
  create(tenantId: string, data: Record<string, unknown>) { return this.repo.create(tenantId, data); }
  update(tenantId: string, id: string, data: Record<string, unknown>) { return this.repo.update(tenantId, id, data); }
  remove(tenantId: string, id: string) { return this.repo.remove(tenantId, id); }
}

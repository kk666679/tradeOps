import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OutboundRepository } from '../../repositories/outbound.repository';

@Injectable()
export class OutboundService {
  constructor(private prisma: PrismaService, private repo: OutboundRepository) {}

  list(tenantId: string, args: Record<string, unknown> = {}) { return this.repo.findMany(tenantId, args); }
  byId(tenantId: string, id: string) { return this.repo.findById(tenantId, id); }
  create(tenantId: string, data: Record<string, unknown>) { return this.repo.create(tenantId, data); }
  update(tenantId: string, id: string, data: Record<string, unknown>) { return this.repo.update(tenantId, id, data); }
  remove(tenantId: string, id: string) { return this.repo.remove(tenantId, id); }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}
  snapshot() { return { ok: true, service: 'cfs-wms-backend', at: new Date().toISOString() }; }
  async ready() { try { await this.prisma.$queryRaw`SELECT 1`; return true; } catch { return false; } }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}
  async emit(_entry: Record<string, unknown>) { /* write to prisma.auditLog */ }
}

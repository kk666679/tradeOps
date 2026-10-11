import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateUserInput, UpdateUserInput } from './user.schema';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  list(tenantId: string) { return this.prisma.user.findMany({ where: { tenantId } }); }
  create(tenantId: string, data: CreateUserInput) { return this.prisma.user.create({ data: { ...data, password: 'CHANGE_ME', tenantId } }); }
  update(tenantId: string, id: string, data: UpdateUserInput) { return this.prisma.user.updateMany({ where: { tenantId, id }, data }); }
  remove(tenantId: string, id: string) { return this.prisma.user.deleteMany({ where: { tenantId, id } }); }
}

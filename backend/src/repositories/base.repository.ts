import { PrismaService } from '../prisma/prisma.service';

export class BaseRepository<T> {
  constructor(protected prisma: PrismaService, protected model: keyof PrismaService) {}
  protected delegate(): any { return (this.prisma as any)[this.model]; }
  async findMany(tenantId: string, args: any = {}): Promise<T[]> {
    return this.delegate().findMany({ where: { tenantId, ...(args.where ?? {}) }, ...args });
  }
  async findById(tenantId: string, id: string): Promise<T | null> {
    return this.delegate().findFirst({ where: { tenantId, id } });
  }
  async create(tenantId: string, data: any): Promise<T> {
    return this.delegate().create({ data: { ...data, tenantId } });
  }
  async update(tenantId: string, id: string, data: any): Promise<number> {
    const res = await this.delegate().updateMany({ where: { tenantId, id }, data });
    return res.count;
  }
  async remove(tenantId: string, id: string): Promise<number> {
    const res = await this.delegate().deleteMany({ where: { tenantId, id } });
    return res.count;
  }
}

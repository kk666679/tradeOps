import { z } from 'zod';
import { TrpcService } from './trpc.service';

/** Factory for a tenant-scoped CRUD router bound to a Prisma delegate. */
export function createCrudRouter(trpc: TrpcService, resource: string) {
  return trpc.router({
    list: trpc.procedure
      .input(z.object({ take: z.number().min(1).max(200).default(50), cursor: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const db = ctx.db as any;
        return db[resource].findMany({
          where: { tenantId: ctx.tenantId ?? undefined },
          take: input?.take ?? 50,
          ...(input?.cursor ? { skip: 1, cursor: { id: input.cursor } } : {}),
          orderBy: { createdAt: 'desc' },
        });
      }),
    byId: trpc.procedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
      const db = ctx.db as any;
      return db[resource].findFirst({ where: { id: input.id, tenantId: ctx.tenantId ?? undefined } });
    }),
    create: trpc.procedure.input(z.object({}).passthrough()).mutation(async ({ ctx, input }) => {
      const db = ctx.db as any;
      return db[resource].create({ data: { ...input, tenantId: ctx.tenantId } });
    }),
    update: trpc.procedure.input(z.object({ id: z.string() }).passthrough()).mutation(async ({ ctx, input }) => {
      const db = ctx.db as any;
      const { id, ...data } = input as any;
      return db[resource].updateMany({ where: { id, tenantId: ctx.tenantId ?? undefined }, data });
    }),
    delete: trpc.procedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
      const db = ctx.db as any;
      return db[resource].deleteMany({ where: { id: input.id, tenantId: ctx.tenantId ?? undefined } });
    }),
  });
}

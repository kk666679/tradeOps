import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { TrpcService } from '../../trpc/trpc.service';
import { z } from 'zod';

/**
 * Duty router.
 *
 * Unlike the other TradeOps resources, `DutyCalculation` is NOT tenant-scoped
 * — it is a child of a `Declaration` (cascade relation) and carries no
 * `tenantId` column. The generic `createCrudRouter` assumes a tenant-scoped
 * model, so this router implements CRUD directly without a tenant filter and
 * scopes reads to a declaration when one is provided.
 */
@Injectable()
export class DutyRouter {
  constructor(private trpc: TrpcService) {}

  get router() {
    const db = (ctx: any) => ctx.db as any;

    return this.trpc.router({
      list: this.trpc.procedure
        .input(z.object({ declarationId: z.string().optional(), take: z.number().min(1).max(200).default(50) }).optional())
        .query(async ({ ctx, input }) => {
          const d = db(ctx);
          return d.dutyCalculation.findMany({
            where: input?.declarationId ? { declarationId: input.declarationId } : {},
            take: input?.take ?? 50,
            orderBy: { createdAt: 'desc' },
          });
        }),
      byId: this.trpc.procedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const d = db(ctx);
        return d.dutyCalculation.findUnique({ where: { id: input.id } });
      }),
      create: this.trpc.procedure
        .input(z.object({ declarationId: z.string(), method: z.string(), assessableValue: z.number(), currency: z.string().default('MYR'), duty: z.number().default(0), salesTax: z.number().default(0), excise: z.number().default(0), total: z.number().default(0), breakdown: z.any().optional() }))
        .mutation(async ({ ctx, input }) => {
          const d = db(ctx);
          const declaration = await d.declaration.findUnique({ where: { id: input.declarationId } });
          if (!declaration) throw new TRPCError({ code: 'NOT_FOUND', message: 'Declaration not found' });
          return d.dutyCalculation.create({ data: { ...input } });
        }),
      update: this.trpc.procedure
        .input(z.object({ id: z.string() }).passthrough())
        .mutation(async ({ ctx, input }) => {
          const d = db(ctx);
          const { id, ...data } = input as any;
          return d.dutyCalculation.update({ where: { id }, data });
        }),
      delete: this.trpc.procedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const d = db(ctx);
        return d.dutyCalculation.delete({ where: { id: input.id } });
      }),
    });
  }
}
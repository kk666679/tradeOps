import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { TrpcService } from '../trpc/trpc.service';
import { createCrudRouter } from '../trpc/createCrudRouter';
@Injectable()
export class DashboardRouter {
  constructor(private trpc: TrpcService) {}
  get router() {
    return this.trpc.mergeRouters(
      createCrudRouter(this.trpc, 'dashboard'),
      this.trpc.router({
        getMetrics: this.trpc.procedure.query(async ({ ctx }) => {
          if (!ctx.tenantId) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
          }

          const tenantId = ctx.tenantId;
          const [inventoryCount, cargoCount, activeOutboundCount, warningCount] = await Promise.all([
            ctx.db.inventory.count({ where: { tenantId } }),
            ctx.db.cargo.count({ where: { tenantId } }),
            ctx.db.outboundOrder.count({
              where: { tenantId, status: { in: ['ALLOCATED', 'PICKING', 'PACKED'] } },
            }),
            ctx.db.complianceFinding.count({ where: { tenantId, resolvedAt: null } }),
          ]);

          return { inventoryCount, cargoCount, activeOutboundCount, warningCount };
        }),
      }),
    );
  }
}

import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { TrpcService } from '../../trpc/trpc.service';
import { requireTenant } from '../../trpc/trpc.middleware';

/**
 * TradeOps analytics router.
 *
 * There is no dedicated `analytics` Prisma model — TradeOps analytics are
 * derived aggregates over the trade-ops domain models (declarations, clearance
 * records, compliance findings, permits, trade documents, duty calculations).
 * This router exposes a single `getMetrics` query that returns those aggregates
 * so the frontend can render a dashboard without a CRUD backing table.
 */
@Injectable()
export class AnalyticsRouter {
  constructor(private trpc: TrpcService) {}

  get router() {
    return this.trpc.router({
      getMetrics: this.trpc.procedure.use(requireTenant).query(async ({ ctx }) => {
        const tenantId = ctx.tenantId;
        if (!tenantId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'No tenant' });
        }

        const db = ctx.db as any;
        const [declarations, clearance, findings, permits, documents, duty] = await Promise.all([
          db.declaration.count({ where: { tenantId } }),
          db.clearanceRecord.count({ where: { tenantId } }),
          db.complianceFinding.count({ where: { tenantId, resolvedAt: null } }),
          db.permit.count({ where: { tenantId } }),
          db.tradeDocument.count({ where: { tenantId } }),
          db.dutyCalculation.count({ where: { tenantId } }),
        ]);

        const statusCounts = await db.declaration.groupBy({
          by: ['status'],
          where: { tenantId },
          _count: { _all: true },
        });

        const byStatus: Record<string, number> = {};
        for (const row of statusCounts) {
          byStatus[row.status] = row._count._all;
        }

        return {
          declarations,
          clearance,
          openFindings: findings,
          permits,
          documents,
          dutyCalculations: duty,
          byStatus,
        };
      }),
    });
  }
}
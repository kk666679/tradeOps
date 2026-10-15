// backend/src/digital-twin/digital-twin.router.ts
//
// tRPC surface for the digital twin. Exposes the real `TwinScenario` / `TwinRun`
// / `TwinMetric` models so the TwinForge dashboard and walkthrough pages read
// persisted data instead of demo constants.
//
// Every procedure is tenant-scoped. Nothing here fabricates a run: creating a
// run records a QUEUED row that a worker advances.

import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { TwinRunStatus, type TwinRun } from '@prisma/client';
import { TrpcService } from '../trpc/trpc.service';
import { requireAuth, requireTenant } from '../trpc/trpc.middleware';
import { PrismaService } from '../prisma/prisma.service';

const takeSchema = z.number().int().min(1).max(200).default(50);

@Injectable()
export class DigitalTwinRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly prisma: PrismaService,
  ) {}

  get router() {
    const protectedProcedure = this.trpc.procedure.use(requireAuth).use(requireTenant);
    const readProcedure = this.trpc.procedure.use(requireTenant);

    return this.trpc.router({
      /** Scenarios for the current tenant, newest first. */
      scenarios: readProcedure
        .input(z.object({ take: takeSchema.optional() }).optional())
        .query(async ({ ctx, input }) => {
          const rows = await this.prisma.twinScenario.findMany({
            where: { tenantId: ctx.tenantId! },
            orderBy: { updatedAt: 'desc' },
            take: input?.take ?? 50,
            include: { _count: { select: { runs: true } } },
          });
          return rows.map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            inputs: r.inputs,
            assertions: r.assertions,
            runCount: r._count.runs,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          }));
        }),

      scenario: readProcedure
        .input(z.object({ id: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
          const row = await this.prisma.twinScenario.findFirst({
            where: { id: input.id, tenantId: ctx.tenantId! },
            include: { runs: { orderBy: { startedAt: 'desc' }, take: 50 } },
          });
          if (!row) throw new TRPCError({ code: 'NOT_FOUND', message: 'Scenario not found.' });
          return {
            id: row.id,
            name: row.name,
            description: row.description,
            inputs: row.inputs,
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
            runs: row.runs.map((run) => this.toRun(run)),
          };
        }),

      createScenario: protectedProcedure
        .input(
          z.object({
            name: z.string().trim().min(1).max(200),
            description: z.string().max(2000).optional(),
            inputs: z.record(z.string(), z.unknown()),
            assertions: z.record(z.string(), z.unknown()).optional(),
          }),
        )
        .mutation(async ({ ctx, input }) => {
          const row = await this.prisma.twinScenario.create({
            data: {
              tenantId: ctx.tenantId!,
              name: input.name,
              description: input.description ?? null,
              inputs: input.inputs as never,
              assertions: (input.assertions ?? null) as never,
            },
          });
          return {
            id: row.id,
            name: row.name,
            description: row.description,
            createdAt: row.createdAt.toISOString(),
          };
        }),

      /** Queue a run against an existing scenario. */
      createRun: protectedProcedure
        .input(
          z.object({
            scenarioId: z.string().min(1),
            horizonDays: z.number().int().min(1).max(365).default(30),
          }),
        )
        .mutation(async ({ ctx, input }) => {
          const scenario = await this.prisma.twinScenario.findFirst({
            where: { id: input.scenarioId, tenantId: ctx.tenantId! },
            select: { id: true },
          });
          if (!scenario) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Scenario not found.' });
          }
          const run = await this.prisma.twinRun.create({
            data: {
              tenantId: ctx.tenantId!,
              scenarioId: scenario.id,
              status: TwinRunStatus.QUEUED,
              horizonDays: input.horizonDays,
            },
          });
          return this.toRun(run);
        }),

      /** Runs across the tenant, optionally filtered to one scenario. */
      runs: readProcedure
        .input(
          z
            .object({ scenarioId: z.string().min(1).optional(), take: takeSchema.optional() })
            .optional(),
        )
        .query(async ({ ctx, input }) => {
          const rows = await this.prisma.twinRun.findMany({
            where: {
              tenantId: ctx.tenantId!,
              ...(input?.scenarioId ? { scenarioId: input.scenarioId } : {}),
            },
            orderBy: { startedAt: 'desc' },
            take: input?.take ?? 50,
          });
          return rows.map((r) => this.toRun(r));
        }),

      run: readProcedure
        .input(z.object({ id: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
          const run = await this.prisma.twinRun.findFirst({
            where: { id: input.id, tenantId: ctx.tenantId! },
            include: { metrics: true },
          });
          if (!run) throw new TRPCError({ code: 'NOT_FOUND', message: 'Run not found.' });
          return {
            ...this.toRun(run),
            metrics: run.metrics,
          };
        }),
    });
  }

  private toRun(
    run: Pick<
      TwinRun,
      'id' | 'scenarioId' | 'status' | 'startedAt' | 'endedAt' | 'horizonDays' | 'result' | 'error'
    >,
  ) {
    return {
      id: run.id,
      scenarioId: run.scenarioId,
      status: run.status,
      startedAt: run.startedAt.toISOString(),
      endedAt: run.endedAt?.toISOString() ?? null,
      horizonDays: run.horizonDays,
      finalMetrics: run.result,
      error: run.error,
    };
  }
}

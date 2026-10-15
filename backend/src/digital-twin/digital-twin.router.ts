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
import { RunStatus } from '@prisma/client';
import { TrpcService } from '../trpc/trpc.service';
import { requireAuth, requireTenant } from '../trpc/trpc.middleware';
import { PrismaService } from '../prisma/prisma.service';

const takeSchema = z.number().int().min(1).max(200).default(50);

type RunRow = {
  id: string;
  scenarioId: string;
  status: string;
  startedAt: Date;
  endedAt: Date | null;
  stepIndex: number;
  totalSteps: number;
  finalMetrics: unknown;
};

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
          const tenantRunCounts = await this.prisma.run.groupBy({
            by: ['scenarioId'],
            where: { tenantId: ctx.tenantId! },
            _count: { _all: true },
          });
          const runCounts = new Map(
            tenantRunCounts.map((row) => [
              row.scenarioId,
              typeof row._count === 'object' && row._count !== null
                ? row._count._all ?? 0
                : 0,
            ]),
          );
          const rows = await this.prisma.scenario.findMany({
            where: { id: { in: tenantRunCounts.map((row) => row.scenarioId) } },
            orderBy: { updatedAt: 'desc' },
            take: input?.take ?? 50,
          });
          return rows.map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            inputs: r.parameters,
            assertions: r.assertions,
            runCount: runCounts.get(r.id) ?? 0,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          }));
        }),

      scenario: readProcedure
        .input(z.object({ id: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
          const row = await this.prisma.scenario.findFirst({
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
          const row = await this.prisma.scenario.create({
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
          const scenario = await this.prisma.scenario.findFirst({
            where: { id: input.scenarioId, tenantId: ctx.tenantId! },
            select: { id: true },
          });
          if (!scenario) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Scenario not found.' });
          }
          const run = await this.prisma.run.create({
            data: {
              tenantId: ctx.tenantId!,
              scenarioId: scenario.id,
              status: RunStatus.QUEUED,
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
          const rows = await this.prisma.run.findMany({
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
          const run = await this.prisma.run.findFirst({
            where: { id: input.id, tenantId: ctx.tenantId! },
          });
          if (!run) throw new TRPCError({ code: 'NOT_FOUND', message: 'Run not found.' });
          return {
            ...this.toRun(run),
            metrics: run.finalMetrics,
          };
        }),
    });
  }

  private toRun(run: RunRow) {
    return {
      id: run.id,
      scenarioId: run.scenarioId,
      status: run.status,
      startedAt: run.startedAt.toISOString(),
      endedAt: run.endedAt?.toISOString() ?? null,
      stepIndex: run.stepIndex,
      totalSteps: run.totalSteps,
      finalMetrics: run.finalMetrics,
    };
  }
}

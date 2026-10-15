// backend/src/workflow/seed.router.ts
//
// tRPC surface for seed datasets and seed-driven loop runs. Mounted under
// `customAgents.orchestration` so the Workflow Studio reaches it through the
// same client it already uses for save / execute.
//
// All procedures are authenticated and tenant-scoped. The tenant id always
// comes from the verified JWT context, never from the request body.

import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { TrpcService } from '../trpc/trpc.service';
import { requireAuth, requireTenant } from '../trpc/trpc.middleware';
import { SeedService } from './seed.service';
import { LoopExecutionService } from './loop-execution.service';

const loopConfigSchema = z
  .object({
    strategy: z.enum(['sequential', 'batch']).optional(),
    batchSize: z.number().int().min(1).max(100).optional(),
    continueOnError: z.boolean().optional(),
    maxRetries: z.number().int().min(0).max(5).optional(),
    backoffMs: z.number().int().min(0).max(60000).optional(),
  })
  .optional();

@Injectable()
export class SeedRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly seeds: SeedService,
    private readonly loops: LoopExecutionService,
  ) {}

  get router() {
    const protectedProcedure = this.trpc.procedure.use(requireAuth).use(requireTenant);

    return this.trpc.router({
      listDatasets: protectedProcedure
        .input(z.object({ take: z.number().int().min(1).max(200).optional() }).optional())
        .query(async ({ ctx, input }) =>
          this.seeds.listDatasets(ctx.tenantId!, input?.take ?? 100),
        ),

      getDataset: protectedProcedure
        .input(z.object({ datasetId: z.string().min(1) }))
        .query(async ({ ctx, input }) => this.seeds.getDataset(ctx.tenantId!, input.datasetId)),

      createDataset: protectedProcedure
        .input(
          z.object({
            name: z.string().trim().min(1).max(200),
            description: z.string().max(2000).optional(),
            schema: z.record(z.string(), z.unknown()).optional(),
          }),
        )
        .mutation(async ({ ctx, input }) =>
          this.seeds.createDataset(ctx.tenantId!, {
            name: input.name,
            description: input.description,
            schema: input.schema,
          }),
        ),

      addRecords: protectedProcedure
        .input(
          z.object({
            datasetId: z.string().min(1),
            records: z
              .array(
                z.object({
                  recordId: z.string().min(1).max(200),
                  payload: z.unknown(),
                }),
              )
              .min(1)
              .max(500),
          }),
        )
        .mutation(async ({ ctx, input }) => this.seeds.addRecords(ctx.tenantId!, input)),

      /** Start a seed-driven loop. Idempotent on `idempotencyKey`. */
      startLoop: protectedProcedure
        .input(
          z.object({
            workflowId: z.string().min(1).max(120),
            seedDatasetId: z.string().min(1),
            loopConfig: loopConfigSchema,
            idempotencyKey: z.string().min(8).max(200).optional(),
            sharedInput: z.record(z.string(), z.unknown()).optional(),
          }),
        )
        .mutation(async ({ ctx, input }) =>
          this.loops.startLoop(ctx.tenantId!, ctx.user!.id, input),
        ),

      listLoopRuns: protectedProcedure
        .input(
          z
            .object({
              workflowId: z.string().min(1).max(120).optional(),
              take: z.number().int().min(1).max(200).optional(),
            })
            .optional(),
        )
        .query(async ({ ctx, input }) =>
          this.loops.listRuns(ctx.tenantId!, {
            workflowId: input?.workflowId,
            take: input?.take ?? 50,
          }),
        ),

      getLoopRun: protectedProcedure
        .input(z.object({ runId: z.string().min(1) }))
        .query(async ({ ctx, input }) => this.loops.getRun(ctx.tenantId!, input.runId)),

      cancelLoopRun: protectedProcedure
        .input(z.object({ runId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => this.loops.cancelRun(ctx.tenantId!, input.runId)),
    });
  }
}

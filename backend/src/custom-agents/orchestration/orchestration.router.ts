import { randomUUID } from 'node:crypto';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { requireAuth, requireTenant } from '../../trpc/trpc.middleware';
import { Injectable } from '@nestjs/common';
import { TrpcService } from '../../trpc/trpc.service';
import { executeWorkflow, validateWorkflow } from './workflow-engine';
import { SeedService } from '../../workflow/seed.service';
import { LoopExecutionService } from '../../workflow/loop-execution.service';
import { SeedRouter } from '../../workflow/seed.router';

const workflowIdSchema = z.string().min(1).max(120);
const definitionSchema = z.object({
  schemaVersion: z.number().int().positive().default(1),
  nodes: z.array(z.any()).max(50),
  edges: z.array(z.any()).max(100),
  trigger: z.object({ type: z.literal('manual') }).default({ type: 'manual' }),
  viewport: z.object({ x: z.number(), y: z.number(), zoom: z.number() }).optional(),
}).passthrough();

@Injectable()
export class OrchestrationRouter {
  constructor(
    private trpc: TrpcService,
    private seeds: SeedService,
    private loops: LoopExecutionService,
  ) {}

  get router() {
    const protectedProcedure = this.trpc.procedure.use(requireAuth).use(requireTenant);
    return this.trpc.router({
      seed: new SeedRouter(this.trpc, this.seeds, this.loops).router,

      listWorkflows: protectedProcedure
        .input(z.object({ q: z.string().optional(), take: z.number().int().min(1).max(100).default(50) }).optional())
        .query(async ({ ctx, input }) => {
          const rows = await ctx.db.workflow.findMany({
            where: {
              tenantId: ctx.tenantId!,
              version: 'draft',
              ...(input?.q ? { name: { contains: input.q, mode: 'insensitive' } } : {}),
            },
            orderBy: { updatedAt: 'desc' },
            take: input?.take ?? 50,
          });
          return rows.map((row) => ({
            id: row.workflowId,
            name: row.name,
            description: (row.definition as any)?.description ?? '',
            updatedAt: row.updatedAt.toISOString(),
            active: row.active,
          }));
        }),

      getWorkflow: protectedProcedure
        .input(z.object({ workflowId: workflowIdSchema }))
        .query(async ({ ctx, input }) => {
          const row = await ctx.db.workflow.findFirst({
            where: { tenantId: ctx.tenantId!, workflowId: input.workflowId, version: 'draft' },
          });
          if (!row) throw new TRPCError({ code: 'NOT_FOUND', message: 'Workflow not found.' });
          const stored = row.definition as any;
          return {
            id: row.workflowId,
            name: row.name,
            description: stored?.description ?? '',
            definition: stored?.graph ?? stored,
            updatedAt: row.updatedAt.toISOString(),
          };
        }),

      saveDraft: protectedProcedure
        .input(z.object({
          workflowId: workflowIdSchema.optional(),
          expectedUpdatedAt: z.string().datetime().optional(),
          name: z.string().trim().min(1).max(120),
          description: z.string().max(1000).default(''),
          definition: definitionSchema,
        }))
        .mutation(async ({ ctx, input }) => {
          const workflowId = input.workflowId ?? randomUUID();
          const where = { tenantId: ctx.tenantId!, workflowId, version: 'draft' };
          const existing = await ctx.db.workflow.findFirst({ where });
          if (existing && input.expectedUpdatedAt && existing.updatedAt.toISOString() !== input.expectedUpdatedAt) {
            throw new TRPCError({ code: 'CONFLICT', message: 'This workflow changed on the server. Reload before saving.' });
          }
          const definition = { graph: input.definition, description: input.description };
          const row = existing
            ? await ctx.db.workflow.update({ where: { id: existing.id }, data: { name: input.name, definition: definition as any } })
            : await ctx.db.workflow.create({ data: {
                tenantId: ctx.tenantId!, workflowId, version: 'draft', name: input.name,
                definition: definition as any, active: false,
              } });
          return { id: row.workflowId, name: row.name, description: input.description, updatedAt: row.updatedAt.toISOString() };
        }),

      validate: protectedProcedure
        .input(z.object({ definition: definitionSchema }))
        .mutation(({ input }) => ({ issues: validateWorkflow(input.definition as any) })),

      execute: protectedProcedure
        .input(z.object({ workflowId: workflowIdSchema, input: z.record(z.string(), z.unknown()).default({}) }))
        .mutation(async ({ ctx, input }) => {
          const workflow = await ctx.db.workflow.findFirst({
            where: { tenantId: ctx.tenantId!, workflowId: input.workflowId, version: 'draft' },
          });
          if (!workflow) throw new TRPCError({ code: 'NOT_FOUND', message: 'Save this workflow before running it.' });
          const definition = (workflow.definition as any)?.graph ?? workflow.definition;
          const issues = validateWorkflow(definition as any);
          if (issues.length) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Workflow validation failed.', cause: issues });
          const run = await ctx.db.workflowRun.create({ data: {
            tenantId: ctx.tenantId!, workflowId: workflow.id, status: 'RUNNING', input: input.input as any,
            steps: [] as any,
          } });
          try {
            const result = await executeWorkflow(definition as any, input.input, {
              executionId: run.id, workflowId: workflow.workflowId,
              actorId: ctx.user!.id,
            });
            const completed = await ctx.db.workflowRun.update({
              where: { id: run.id },
              data: { status: 'SUCCEEDED', output: result.output as any, steps: result.steps as any, endedAt: new Date() },
            });
            return { id: completed.id, workflowId: workflow.workflowId, status: completed.status, output: result.output, steps: result.steps, startedAt: completed.startedAt.toISOString(), endedAt: completed.endedAt?.toISOString() ?? null };
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Workflow execution failed.';
            const failed = await ctx.db.workflowRun.update({
              where: { id: run.id },
              data: { status: 'FAILED', error: message, steps: (error as any)?.steps ?? [], endedAt: new Date() },
            });
            return { id: failed.id, workflowId: workflow.workflowId, status: failed.status, output: null, steps: failed.steps, error: message, startedAt: failed.startedAt.toISOString(), endedAt: failed.endedAt?.toISOString() ?? null };
          }
        }),

      listRuns: protectedProcedure
        .input(z.object({ workflowId: workflowIdSchema, take: z.number().int().min(1).max(100).default(25) }))
        .query(async ({ ctx, input }) => {
          const workflow = await ctx.db.workflow.findFirst({ where: { tenantId: ctx.tenantId!, workflowId: input.workflowId, version: 'draft' } });
          if (!workflow) throw new TRPCError({ code: 'NOT_FOUND', message: 'Workflow not found.' });
          const runs = await ctx.db.workflowRun.findMany({ where: { tenantId: ctx.tenantId!, workflowId: workflow.id }, orderBy: { startedAt: 'desc' }, take: input.take });
          return runs.map((run) => ({ id: run.id, status: run.status, input: run.input, output: run.output, error: run.error, steps: run.steps, startedAt: run.startedAt.toISOString(), endedAt: run.endedAt?.toISOString() ?? null }));
        }),

      getRun: protectedProcedure
        .input(z.object({ runId: workflowIdSchema }))
        .query(async ({ ctx, input }) => {
          const run = await ctx.db.workflowRun.findFirst({ where: { id: input.runId, tenantId: ctx.tenantId! }, include: { workflow: true } });
          if (!run) throw new TRPCError({ code: 'NOT_FOUND', message: 'Run not found.' });
          const stored = run.workflow.definition as any;
          return { id: run.id, workflowId: run.workflow.workflowId, workflowName: run.workflow.name, status: run.status, input: run.input, output: run.output, error: run.error, steps: run.steps, definition: stored?.graph ?? stored, startedAt: run.startedAt.toISOString(), endedAt: run.endedAt?.toISOString() ?? null };
        }),
    });
  }
}

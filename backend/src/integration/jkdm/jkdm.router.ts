// backend/src/integration/jkdm/jkdm.router.ts
//
// tRPC surface for the JKDM integration. This is the server that backs the
// Workflow Studio's ExecutorClient. Every procedure is tenant-scoped and
// authenticated. Nothing here enables a submission that the adapter's
// capability model does not already permit.

import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { TrpcService } from '../../trpc/trpc.service';
import { requireAuth, requireTenant } from '../../trpc/trpc.middleware';
import { JkdmService } from './jkdm.service';
import {
  DeclarationSubmissionSchema,
  ManualResponseSchema,
} from './schemas/declaration.schema';

const RecordManualInput = ManualResponseSchema.extend({
  declarationId: z.string().optional(),
});

@Injectable()
export class JkdmRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly jkdm: JkdmService,
  ) {}

  get router() {
    return this.trpc.router({
      /** Read on studio mount. Honest capability snapshot — never faked. */
      capabilities: this.trpc.procedure.use(requireTenant).query(async ({ ctx }) => {
        return this.jkdm.capabilities();
      }),

      /**
       * Execute a declaration submission. Enforces persistent idempotency and
       * returns the adapter result with its provenance. A synthetic result is
       * flagged synthetic:true and must not advance a real clearance.
       */
      submitDeclaration: this.trpc.procedure
        .use(requireAuth)
        .use(requireTenant)
        .input(
          z.object({
            idempotencyKey: z.string().min(8),
            declarationId: z.string().optional(),
            submission: DeclarationSubmissionSchema,
          }),
        )
        .mutation(async ({ ctx, input }) => {
          const tenantId = ctx.tenantId!;
          try {
            const { result, duplicate, operationId } = await this.jkdm.submitDeclaration(
              tenantId,
              ctx.user!.id,
              { idempotencyKey: input.idempotencyKey, submission: input.submission as any, declarationId: input.declarationId },
            );
            return { operationId, duplicate, ...result };
          } catch (err) {
            const e = err as Error & { code?: string };
            throw new TRPCError({
              code: e.code === 'INTEGRATION_NOT_CONFIGURED' || e.code === 'INTEGRATION_UNAVAILABLE' ? 'PRECONDITION_FAILED' : 'BAD_REQUEST',
              message: e.message,
              cause: e.code,
            });
          }
        }),

      queryDeclarationStatus: this.trpc.procedure
        .use(requireAuth)
        .use(requireTenant)
        .input(z.object({ declarationRef: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
          const tenantId = ctx.tenantId!;
          try {
            return await this.jkdm.queryDeclarationStatus(tenantId, ctx.user!.id, input.declarationRef);
          } catch (err) {
            const e = err as Error & { code?: string };
            throw new TRPCError({
              code: e.code === 'UNSUPPORTED_OPERATION' ? 'PRECONDITION_FAILED' : 'BAD_REQUEST',
              message: e.message,
              cause: e.code,
            });
          }
        }),

      /** Record a manual customs response with evidence or a documented exception. */
      recordManualResponse: this.trpc.procedure
        .use(requireAuth)
        .use(requireTenant)
        .input(RecordManualInput)
        .mutation(async ({ ctx, input }) => {
          const tenantId = ctx.tenantId!;
          const { declarationId, ...rest } = input;
          return this.jkdm.recordManualResponse(tenantId, ctx.user!.id, { ...rest, declarationId } as any);
        }),

      /** A second user reviews a pending manual observation. */
      reviewManualResponse: this.trpc.procedure
        .use(requireAuth)
        .use(requireTenant)
        .input(
          z.object({
            recordId: z.string().min(1),
            decision: z.enum(['reviewed', 'rejected']),
          }),
        )
        .mutation(async ({ ctx, input }) => {
          return this.jkdm.reviewManualResponse(ctx.tenantId!, ctx.user!.id, input.recordId, input.decision);
        }),

      listOperations: this.trpc.procedure
        .use(requireTenant)
        .input(z.object({ take: z.number().min(1).max(200).optional(), declarationId: z.string().optional() }).optional())
        .query(async ({ ctx, input }) => {
          return this.jkdm.listOperations(ctx.tenantId!, input ?? {});
        }),

      listManualResponses: this.trpc.procedure
        .use(requireTenant)
        .input(z.object({ take: z.number().min(1).max(200).optional(), declarationId: z.string().optional() }).optional())
        .query(async ({ ctx, input }) => {
          return this.jkdm.listManualResponses(ctx.tenantId!, input ?? {});
        }),
    });
  }
}

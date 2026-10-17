import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '../../trpc/trpc.service';
import {
  FieldReviewInput,
  ProcessDocumentInput,
  RegisterUploadInput,
} from './extraction.schema';
import { ExtractionPipeline } from './extraction.service';

/**
 * tradeOps.documents router.
 *
 * Phase 1 keeps the generic CRUD surface — same procedure names and input
 * shapes as `createCrudRouter(trpc, 'tradeDocument')`, so existing consumers
 * are unaffected — and adds the Module A extraction procedures. New
 * procedures hard-require a tenant: extraction data is tenant-scoped by
 * construction.
 */
@Injectable()
export class DocumentsRouter {
  constructor(private trpc: TrpcService) {}

  get router() {
    return this.trpc.router({
      // --- CRUD (contract-compatible with createCrudRouter) ---
      list: this.trpc.procedure
        .input(z.object({ take: z.number().min(1).max(200).default(50), cursor: z.string().optional() }).optional())
        .query(async ({ ctx, input }) => {
          const db = ctx.db as any;
          return db.tradeDocument.findMany({
            where: { tenantId: ctx.tenantId ?? undefined },
            take: input?.take ?? 50,
            ...(input?.cursor ? { skip: 1, cursor: { id: input.cursor } } : {}),
            orderBy: { createdAt: 'desc' },
          });
        }),
      byId: this.trpc.procedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const db = ctx.db as any;
        return db.tradeDocument.findFirst({ where: { id: input.id, tenantId: ctx.tenantId ?? undefined } });
      }),
      create: this.trpc.procedure.input(z.object({}).passthrough()).mutation(async ({ ctx, input }) => {
        const db = ctx.db as any;
        return db.tradeDocument.create({ data: { ...input, tenantId: ctx.tenantId } });
      }),
      update: this.trpc.procedure.input(z.object({ id: z.string() }).passthrough()).mutation(async ({ ctx, input }) => {
        const db = ctx.db as any;
        const { id, ...data } = input as any;
        return db.tradeDocument.updateMany({ where: { id, tenantId: ctx.tenantId ?? undefined }, data });
      }),
      delete: this.trpc.procedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const db = ctx.db as any;
        return db.tradeDocument.deleteMany({ where: { id: input.id, tenantId: ctx.tenantId ?? undefined } });
      }),

      // --- Module A: registration & extraction ---

      /** Idempotent: same tenant + sha256 returns { duplicate: true, ... }. */
      registerUpload: this.trpc.procedure
        .input(RegisterUploadInput)
        .mutation(async ({ ctx, input }) => {
          if (!ctx.tenantId) throw new Error('Tenant context required');
          const existing = await ctx.db.tradeDocument.findFirst({
            where: { tenantId: ctx.tenantId, sha256: input.sha256 },
          });
          if (existing) return { document: existing, duplicate: true as const };
          const document = await ctx.db.tradeDocument.create({
            data: {
              tenantId: ctx.tenantId,
              kind: input.kind,
              title: input.title,
              url: input.url,
              content: input.text ?? null,
              mimeType: input.mimeType,
              sizeBytes: input.sizeBytes,
              sha256: input.sha256,
              cargoId: input.cargoId ?? null,
            },
          });
          return { document, duplicate: false as const };
        }),

      /** Runs extraction now (inline). Queue-backed runs replace this later. */
      process: this.trpc.procedure
        .input(ProcessDocumentInput)
        .mutation(async ({ ctx, input }) => {
          if (!ctx.tenantId) throw new Error('Tenant context required');
          const doc = await ctx.db.tradeDocument.findFirst({
            where: { id: input.id, tenantId: ctx.tenantId },
          });
          if (!doc) return null;
          const pipeline = new ExtractionPipeline(ctx.db);
          return pipeline.runForDocument(ctx.tenantId, doc, input.text);
        }),

      latestExtraction: this.trpc.procedure
        .input(z.object({ documentId: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
          if (!ctx.tenantId) throw new Error('Tenant context required');
          const pipeline = new ExtractionPipeline(ctx.db);
          return pipeline.latestFor(ctx.tenantId, input.documentId);
        }),

      extractionById: this.trpc.procedure
        .input(z.object({ id: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
          if (!ctx.tenantId) throw new Error('Tenant context required');
          const pipeline = new ExtractionPipeline(ctx.db);
          return pipeline.byId(ctx.tenantId, input.id);
        }),

      /** Accept or correct a field. Corrections never overwrite the original. */
      reviewField: this.trpc.procedure
        .input(FieldReviewInput)
        .mutation(async ({ ctx, input }) => {
          if (!ctx.tenantId) throw new Error('Tenant context required');
          const userId = ctx.user?.id ?? 'unknown';
          const pipeline = new ExtractionPipeline(ctx.db);
          return pipeline.reviewField(ctx.tenantId, input.fieldId, userId, input.correctedValue);
        }),

      /** List extraction revisions for a document (audit trail view). */
      extractionHistory: this.trpc.procedure
        .input(z.object({ documentId: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
          if (!ctx.tenantId) throw new Error('Tenant context required');
          return ctx.db.documentExtraction.findMany({
            where: { tenantId: ctx.tenantId, documentId: input.documentId },
            orderBy: { revision: 'desc' },
            include: { fields: { orderBy: { name: 'asc' } } },
          });
        }),
    });
  }
}

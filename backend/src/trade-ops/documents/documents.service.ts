import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DocumentsRepository } from '../../repositories/documents.repository';
import { ExtractionPipeline } from './extraction.service';
import type { RegisterUploadInput } from './extraction.schema';

@Injectable()
export class DocumentsService {
  private pipeline: ExtractionPipeline;
  constructor(private prisma: PrismaService, private repo: DocumentsRepository) {
    this.pipeline = new ExtractionPipeline(prisma);
  }

  list(tenantId: string, args: Record<string, unknown> = {}) { return this.repo.findMany(tenantId, args); }
  byId(tenantId: string, id: string) { return this.repo.findById(tenantId, id); }
  create(tenantId: string, data: Record<string, unknown>) { return this.repo.create(tenantId, data); }
  update(tenantId: string, id: string, data: Record<string, unknown>) { return this.repo.update(tenantId, id, data); }
  remove(tenantId: string, id: string) { return this.repo.remove(tenantId, id); }

  /**
   * Idempotent upload registration: re-registering the same file (same
   * tenant + sha256) returns the existing record with `duplicate: true`
   * instead of creating a second copy. This is the non-idempotent-write
   * guard required by build-prompt §3.D.
   */
  async registerUpload(tenantId: string, input: RegisterUploadInput) {
    const existing = await this.prisma.tradeDocument.findFirst({
      where: { tenantId, sha256: input.sha256 },
    });
    if (existing) return { document: existing, duplicate: true as const };
    const document = await this.prisma.tradeDocument.create({
      data: {
        tenantId,
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
  }

  /** Runs the extraction pipeline now; queue-backed runs plug in behind this. */
  async process(tenantId: string, documentId: string, textOverride?: string) {
    const doc = await this.prisma.tradeDocument.findFirst({ where: { id: documentId, tenantId } });
    if (!doc) return null;
    return this.pipeline.runForDocument(tenantId, doc, textOverride);
  }

  latestExtraction(tenantId: string, documentId: string) {
    return this.pipeline.latestFor(tenantId, documentId);
  }

  extractionById(tenantId: string, extractionId: string) {
    return this.pipeline.byId(tenantId, extractionId);
  }

  reviewField(tenantId: string, userId: string, fieldId: string, correctedValue?: string) {
    return this.pipeline.reviewField(tenantId, fieldId, userId, correctedValue);
  }
}


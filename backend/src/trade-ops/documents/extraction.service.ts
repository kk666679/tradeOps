import { ExtractionResult as ExtractionResultSchema } from './extraction.schema';
import { ExtractionAdapter, ruleAdapter, AdapterInput } from './rule-extractor';

/**
 * Extraction orchestration (Module A).
 *
 * Plain class (no Nest DI) so the tRPC router can run it against `ctx.db`,
 * matching the existing createCrudRouter convention in this codebase.
 *
 * Runs the configured adapter over a TradeDocument and persists an immutable
 * extraction revision plus per-field rows. Adapter choice:
 *   - EXTRACTION_LLM_PROVIDER unset (default): deterministic `rule@1` adapter.
 *     Never fabricates: no text layer ⇒ NEEDS_TEXT, not invented fields.
 *   - Future LLM adapters register here behind the same interface with their
 *     model/prompt version recorded for provenance.
 */

/** Minimal Prisma-client shape needed; PrismaService satisfies this. */
export interface ExtractionDb {
  documentExtraction: {
    count(args: any): Promise<number>;
    create(args: any): Promise<any>;
    findFirst(args: any): Promise<any>;
  };
  documentExtractedField: {
    findFirst(args: any): Promise<any>;
    update(args: any): Promise<any>;
  };
}

export class ExtractionPipeline {
  private readonly adapters: ExtractionAdapter[] = [ruleAdapter];

  constructor(private db: ExtractionDb) {}

  private pickAdapter(): ExtractionAdapter {
    // LLM adapters are opt-in per deployment; until configured we always use
    // the deterministic adapter. Do not add fallback guessing here.
    return this.adapters[0]!;
  }

  async runForDocument(tenantId: string, doc: any, overrideText?: string) {
    const revision =
      ((await this.db.documentExtraction.count({
        where: { tenantId, documentId: doc.id },
      })) ?? 0) + 1;
    const adapter = this.pickAdapter();
    const text = (overrideText ?? doc.content ?? '').trim();

    if (!text) {
      // Binary/scanned upload with no text layer and no OCR adapter
      // configured. Record the attempt honestly; the UI surfaces
      // "configure an OCR adapter" instead of inventing fields.
      return this.db.documentExtraction.create({
        data: {
          tenantId,
          documentId: doc.id,
          revision,
          status: 'NEEDS_TEXT',
          detectedKind: doc.kind,
          adapter: adapter.name,
          modelVersion: adapter.version,
        },
        include: { fields: true },
      });
    }

    const input: AdapterInput = { title: doc.title, text };
    const raw = await adapter.extract(input);
    const parsed = ExtractionResultSchema.safeParse(raw);
    if (!parsed.success) {
      return this.db.documentExtraction.create({
        data: {
          tenantId,
          documentId: doc.id,
          revision,
          status: 'FAILED',
          adapter: adapter.name,
          modelVersion: adapter.version,
          warnings: JSON.stringify(['Adapter produced an invalid result shape; see adapter logs.']),
        },
        include: { fields: true },
      });
    }

    const result = parsed.data;
    return this.db.documentExtraction.create({
      data: {
        tenantId,
        documentId: doc.id,
        revision,
        status: 'COMPLETED',
        detectedKind: result.detectedKind,
        adapter: adapter.name,
        modelVersion: adapter.version,
        lineItems: JSON.stringify(result.lineItems),
        warnings: JSON.stringify(result.warnings),
        injectionSuspect: result.injectionSuspect,
        fields: {
          create: result.fields.map((f) => ({
            tenantId,
            name: f.name,
            value: f.value,
            confidence: f.confidence,
            page: f.page,
            bbox: f.bbox ? JSON.stringify(f.bbox) : undefined,
            sourceText: f.sourceText,
          })),
        },
      },
      include: { fields: { orderBy: { name: 'asc' } } },
    });
  }

  latestFor(tenantId: string, documentId: string) {
    return this.db.documentExtraction.findFirst({
      where: { tenantId, documentId },
      include: { fields: { orderBy: { name: 'asc' } } },
      orderBy: { revision: 'desc' },
    });
  }

  byId(tenantId: string, id: string) {
    return this.db.documentExtraction.findFirst({
      where: { tenantId, id },
      include: { fields: { orderBy: { name: 'asc' } } },
    });
  }

  async reviewField(tenantId: string, fieldId: string, userId: string, correctedValue?: string) {
    const field = await this.db.documentExtractedField.findFirst({
      where: { tenantId, id: fieldId },
    });
    if (!field) return null;
    const corrected = correctedValue !== undefined;
    return this.db.documentExtractedField.update({
      where: { id: field.id },
      data: {
        reviewStatus: corrected ? 'CORRECTED' : 'ACCEPTED',
        correctedValue: corrected ? correctedValue : null,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    });
  }
}


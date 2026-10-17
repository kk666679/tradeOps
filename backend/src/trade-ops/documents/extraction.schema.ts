import { z } from 'zod';

/**
 * Module A extraction contracts.
 *
 * Shared between the backend adapter pipeline and the review UI. Every
 * extracted field carries a confidence score and a source snippet so the UI
 * can highlight where the value came from (build-prompt §3.A.6–7).
 */

// Must stay in sync with `enum TradeDocKind` in prisma/schema.prisma.
export const TradeDocKindEnum = z.enum([
  'BOL',
  'INVOICE',
  'PACKING_LIST',
  'CERTIFICATE_OF_ORIGIN',
  'CUSTOMS_FORM',
  'PERMIT',
  'INSURANCE',
  'INSPECTION',
  'OTHER',
]);
export type TradeDocKindValue = z.infer<typeof TradeDocKindEnum>;

export const LOW_CONFIDENCE_THRESHOLD = 0.75;

export const ExtractedField = z.object({
  name: z.string().min(1),
  value: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  page: z.number().int().positive().nullable().default(null),
  bbox: z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() }).nullable().default(null),
  sourceText: z.string().nullable().default(null),
});
export type ExtractedField = z.infer<typeof ExtractedField>;

export const ExtractedLineItem = z.object({
  lineNo: z.number().int().positive(),
  description: z.string(),
  hsCode: z.string().nullable().default(null),
  quantity: z.number().nullable().default(null),
  unit: z.string().nullable().default(null),
  unitPrice: z.number().nullable().default(null),
  amount: z.number().nullable().default(null),
  origin: z.string().nullable().default(null),
  sourceText: z.string().nullable().default(null),
});
export type ExtractedLineItem = z.infer<typeof ExtractedLineItem>;

export const ExtractionResult = z.object({
  detectedKind: TradeDocKindEnum,
  fields: z.array(ExtractedField),
  lineItems: z.array(ExtractedLineItem).default([]),
  warnings: z.array(z.string()).default([]),
  injectionSuspect: z.boolean().default(false),
});
export type ExtractionResult = z.infer<typeof ExtractionResult>;

export const RegisterUploadInput = z.object({
  kind: TradeDocKindEnum,
  title: z.string().min(1).max(300),
  url: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  sha256: z.string().regex(/^[0-9a-f]{64}$/, 'sha256 must be a lowercase hex digest'),
  // Text layer of the document when available (digital PDFs, CSV, pasted
  // text). Binary/scanned uploads omit this and are routed to NEEDS_TEXT
  // until an OCR adapter is configured — we never guess at pixels.
  text: z.string().max(500_000).optional(),
  cargoId: z.string().optional(),
});
export type RegisterUploadInput = z.infer<typeof RegisterUploadInput>;

export const ProcessDocumentInput = z.object({
  id: z.string().min(1),
  // Optional corrected/extra text supplied by a reviewer before processing.
  text: z.string().max(500_000).optional(),
});
export type ProcessDocumentInput = z.infer<typeof ProcessDocumentInput>;

export const FieldReviewInput = z.object({
  fieldId: z.string().min(1),
  // Accept the extracted value as-is, or correct it. Empty string clears.
  correctedValue: z.string().max(2000).optional(),
});
export type FieldReviewInput = z.infer<typeof FieldReviewInput>;

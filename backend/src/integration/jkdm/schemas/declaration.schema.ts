// backend/src/integrations/jkdm/schemas/declaration.schema.ts
import { z } from "zod";

export const DeclarationFormCodeSchema = z.enum(["K1", "K2", "K3", "K7", "K8", "K9"]);

export const DeclarationLineItemSchema = z.object({
  lineNumber: z.number().int().positive(),
  hsCode: z.string().regex(/^\d{6,10}$/),
  description: z.string().min(1),
  quantity: z.number().positive(),
  uom: z.string().min(1),
  unitValueMYR: z.number().nonnegative(),
  countryOfOrigin: z.string().length(2),
  preferenceScheme: z.enum(["ATIGA", "ACFTA", "RCEP", "CPTPP", "MJEPA", "MCFTA", "MFN"]).optional(),
  permitRefs: z.array(z.string()).optional(),
});

export const DeclarationSubmissionSchema = z.object({
  draftRef: z.string().min(1),
  idempotencyKey: z.string().min(8),
  tenantId: z.string().min(1),
  brokerCode: z.string().min(1),
  formCode: DeclarationFormCodeSchema,
  procedureCode: z.string().min(1),
  portOfEntry: z.string().min(1),
  importerName: z.string().min(1),
  importerRegistration: z.string().min(1),
  exporterName: z.string().min(1),
  exporterCountry: z.string().length(2),
  blNumber: z.string().min(1),
  invoiceNumber: z.string().min(1),
  invoiceDate: z.string().min(1),
  currency: z.string().length(3),
  totalFOB: z.number().nonnegative(),
  totalFreight: z.number().nonnegative(),
  totalInsurance: z.number().nonnegative(),
  totalCIFMYR: z.number().nonnegative(),
  lineItems: z.array(DeclarationLineItemSchema).min(1),
});

export const ManualResponseSchema = z.object({
  draftRef: z.string().min(1),
  idempotencyKey: z.string().min(8),
  tenantId: z.string().min(1),
  recordedBy: z.string().min(1),
  outcome: z.enum(["query", "inspection", "released", "rejected", "amended"]),
  externalRef: z.string().optional(),
  exceptionReason: z.string().optional(),
  officerName: z.string().optional(),
  officerId: z.string().optional(),
  notes: z.string().optional(),
  observedAt: z.string().min(1),
  evidenceRef: z.string().optional(),
  additionalEvidenceRefs: z.array(z.string()).optional(),
}).refine(
  (v) => Boolean(v.evidenceRef) || Boolean(v.exceptionReason),
  { message: "evidenceRef or exceptionReason is required", path: ["evidenceRef"] },
).refine(
  (v) => Boolean(v.externalRef) || Boolean(v.exceptionReason),
  { message: "externalRef or exceptionReason is required", path: ["externalRef"] },
);

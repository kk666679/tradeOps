// backend/src/workflow/handlers/submit-declaration.ts
import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client";
import { resolveJkdmAdapter, getJkdmConfig } from "../../integrations/jkdm";

export interface SubmitDeclarationInput {
  tenantId: string;
  declarationId: string;
  actorId: string;
  idempotencyKey: string;
}

export interface SubmitDeclarationOutput {
  status: "submitted" | "integration_required" | "synthetic_skipped" | "error";
  externalRef?: string;
  channel?: string;
  correlationId?: string;
  provenance: "production_api" | "manual_observation" | "synthetic";
  reason?: string;
}

export async function handleSubmitDeclaration(
  input: SubmitDeclarationInput,
  db: PrismaClient,
): Promise<SubmitDeclarationOutput> {
  const adapter = resolveJkdmAdapter();
  const config = getJkdmConfig();

  const existing = await db.declarationEvent.findFirst({
    where: {
      tenantId: input.tenantId,
      declarationId: input.declarationId,
      kind: "submitted",
      payload: { path: ["idempotencyKey"], equals: input.idempotencyKey },
    },
  });
  if (existing) {
    return {
      status: "submitted",
      externalRef: existing.externalRef ?? undefined,
      provenance: "production_api",
      reason: "idempotent replay",
    };
  }

  const declaration = await db.declaration.findFirstOrThrow({
    where: { id: input.declarationId, tenantId: input.tenantId },
    include: { lineItems: true, shipment: true },
  });

  if (!adapter.capabilities.submitDeclaration) {
    await db.declaration.update({
      where: { id: declaration.id },
      data: {
        state: "integration_required",
        lastSubmissionAttemptAt: new Date(),
        submissionAttemptCount: { increment: 1 },
      },
    });
    await db.declarationEvent.create({
      data: {
        tenantId: input.tenantId,
        declarationId: declaration.id,
        kind: "integration_required",
        provenance: config.mode === "development" ? "synthetic" : "manual_observation",
        payload: { idempotencyKey: input.idempotencyKey, mode: config.mode },
        recordedBy: input.actorId,
        reviewStatus: "pending_review",
      },
    });
    return {
      status: "integration_required",
      provenance: config.mode === "development" ? "synthetic" : "manual_observation",
      reason: `JKDM integration unavailable (mode=${config.mode})`,
    };
  }

  const correlationId = randomUUID();
  try {
    const result = await adapter.submitDeclaration({
      draftRef: declaration.draftRef,
      idempotencyKey: input.idempotencyKey,
      tenantId: input.tenantId,
      brokerCode: config.brokerCode ?? "",
      formCode: declaration.formCode as never,
      procedureCode: declaration.procedureCode,
      portOfEntry: declaration.shipment.portOfEntry ?? "",
      importerName: declaration.shipment.description ?? "",
      importerRegistration: "",
      exporterName: "",
      exporterCountry: "",
      blNumber: declaration.shipment.billOfLading ?? "",
      invoiceNumber: declaration.shipment.commercialInvoiceRef ?? "",
      invoiceDate: new Date().toISOString().slice(0, 10),
      currency: declaration.shipment.currency,
      totalFOB: Number(declaration.totalFOBMYR),
      totalFreight: Number(declaration.totalFreightMYR),
      totalInsurance: Number(declaration.totalInsuranceMYR),
      totalCIFMYR: Number(declaration.totalCIFMYR),
      lineItems: declaration.lineItems.map((li) => ({
        lineNumber: li.lineNumber,
        hsCode: li.hsCode,
        description: li.description,
        quantity: Number(li.quantity),
        uom: li.uom,
        unitValueMYR: Number(li.unitValueMYR),
        countryOfOrigin: li.countryOfOrigin,
        preferenceScheme: (li.preferenceScheme ?? undefined) as never,
        permitRefs: li.permitRefs,
      })),
    });

    if (result.synthetic) {
      await db.declarationEvent.create({
        data: {
          tenantId: input.tenantId,
          declarationId: declaration.id,
          kind: "synthetic_submission",
          provenance: "synthetic",
          externalRef: result.externalRef,
          correlationId: result.correlationId,
          payload: { note: "synthetic — state unchanged" },
          recordedBy: input.actorId,
        },
      });
      return {
        status: "synthetic_skipped",
        externalRef: result.externalRef,
        correlationId: result.correlationId,
        provenance: "synthetic",
        reason: "synthetic response — real state unchanged",
      };
    }

    await db.declaration.update({
      where: { id: declaration.id },
      data: {
        state: "submitted_unconfirmed",
        lastSubmissionAttemptAt: new Date(),
        submissionAttemptCount: { increment: 1 },
        lastCorrelationId: result.correlationId,
        channel: (result.channel ?? "UNASSIGNED") as never,
      },
    });
    await db.declarationEvent.create({
      data: {
        tenantId: input.tenantId,
        declarationId: declaration.id,
        kind: "submitted",
        provenance: "production_api",
        externalRef: result.externalRef,
        correlationId: result.correlationId,
        payload: { idempotencyKey: input.idempotencyKey, channel: result.channel },
        recordedBy: input.actorId,
      },
    });

    return {
      status: "submitted",
      externalRef: result.externalRef,
      channel: result.channel,
      correlationId: result.correlationId,
      provenance: "production_api",
    };
  } catch (err) {
    await db.declaration.update({
      where: { id: declaration.id },
      data: {
        state: "integration_error",
        lastSubmissionAttemptAt: new Date(),
        submissionAttemptCount: { increment: 1 },
        lastCorrelationId: correlationId,
      },
    });
    await db.declarationEvent.create({
      data: {
        tenantId: input.tenantId,
        declarationId: declaration.id,
        kind: "integration_error",
        provenance: "production_api",
        correlationId,
        payload: { error: (err as Error).message, code: (err as { code?: string }).code },
        recordedBy: input.actorId,
      },
    });
    return {
      status: "error",
      correlationId,
      provenance: "production_api",
      reason: (err as Error).message,
    };
  }
}

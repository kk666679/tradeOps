import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

export interface PrepareDeclarationInput {
  tenantId: string;
  shipmentId: string;
  actorId: string;
  formCode: "K1" | "K2" | "K3" | "K7" | "K8" | "K9";
  procedureCode: string;
}

export async function handlePrepareDeclaration(input: PrepareDeclarationInput, db: PrismaClient) {
  const shipment = await db.shipment.findFirstOrThrow({
    where: { id: input.shipmentId, tenantId: input.tenantId },
    include: { lineItems: true },
  });

  const draftRef = `DRAFT-${input.formCode}-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const dutyMYR = 0, sstMYR = 0, exciseMYR = 0;

  const declaration = await db.declaration.create({
    data: {
      tenantId: input.tenantId,
      shipmentId: shipment.id,
      draftRef,
      formCode: input.formCode as never,
      procedureCode: input.procedureCode,
      totalFOBMYR: 0,
      totalFreightMYR: 0,
      totalInsuranceMYR: 0,
      totalCIFMYR: shipment.declaredValueMYR,
      estimatedDutyMYR: dutyMYR,
      estimatedSSTMYR: sstMYR,
      estimatedExciseMYR: exciseMYR,
      lineItems: {
        create: shipment.lineItems.map((li) => ({
          tenantId: input.tenantId,
          lineNumber: li.lineNumber,
          hsCode: li.hsCode,
          description: li.description,
          quantity: li.quantity,
          uom: li.uom,
          unitValueMYR: li.unitValueMYR,
          countryOfOrigin: li.countryOfOrigin,
          preferenceScheme: li.preferenceScheme,
          permitRefs: li.permitRefs,
        })),
      },
    },
  });

  return {
    declarationId: declaration.id,
    draftRef,
    estimate: { dutyMYR, sstMYR, exciseMYR, totalMYR: 0, source: "tariff_engine" as const },
  };
}

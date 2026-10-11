import { Prisma } from '@prisma/client';
import { z } from "zod";
import type { PrismaService } from "../../../../../prisma/prisma.service";
import { complete, type ToolResult } from "../../../../shared/schemas/mrtr";
import { roundCurrency } from "../database";

export const LedgerEntryInput = z.object({
  tenantId: z.string().min(1),
  containerId: z.string().min(1),
  direction: z.enum(["debit", "credit"]),
  hsCode: z.string().regex(/^\d{6,10}$/),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  cifValueMYR: z.number().nonnegative(),
  dutySuspendedMYR: z.number().nonnegative(),
});
export type LedgerEntryInput = z.infer<typeof LedgerEntryInput>;

export interface LedgerEntry {
  entryId: string;
  tenantId: string;
  containerId: string;
  direction: "debit" | "credit";
  hsCode: string;
  quantity: number;
  unit: string;
  cifValueMYR: number;
  dutySuspendedMYR: number;
  previousBalanceMYR: number;
  newBalanceMYR: number;
  postedAt: string;
}

export async function handleLedgerEntry(
  raw: LedgerEntryInput,
  prisma: PrismaService,
  actorId: string,
): Promise<ToolResult<LedgerEntry>> {
  const input = LedgerEntryInput.parse(raw);
  const entry = await prisma.$transaction(async (tx) => {
    const cargo = await tx.cargo.findFirst({
      where: { tenantId: input.tenantId, containerNo: input.containerId },
      select: { zoneId: true },
    });
    if (!cargo?.zoneId) {
      throw new Error(`container ${input.containerId} is not linked to a zone in this tenant`);
    }

    const zone = await tx.zone.findFirst({
      where: { tenantId: input.tenantId, id: cargo.zoneId, status: "ACTIVE" },
      select: { id: true },
    });
    if (!zone) {
      throw new Error(`container ${input.containerId} is not assigned to an active zone`);
    }

    const previousEntries = await tx.bondedLedger.findMany({
      where: {
        tenantId: input.tenantId,
        zoneId: cargo.zoneId,
        hsCode: input.hsCode,
        kind: { in: ["ENTRY", "WITHDRAWAL"] },
      },
      select: { kind: true, value: true },
    });
    const previousBalanceMYR = roundCurrency(previousEntries.reduce(
      (balance, row) => balance + (row.kind === "ENTRY" ? row.value : -row.value),
      0,
    ));
    if (input.direction === "credit" && input.cifValueMYR > previousBalanceMYR) {
      throw new Error("credit exceeds the available bonded CIF balance");
    }
    const newBalanceMYR = roundCurrency(
      previousBalanceMYR + (input.direction === "debit" ? input.cifValueMYR : -input.cifValueMYR),
    );
    const created = await tx.bondedLedger.create({
      data: {
        tenantId: input.tenantId,
        zoneId: cargo.zoneId,
        kind: input.direction === "debit" ? "ENTRY" : "WITHDRAWAL",
        ref: input.containerId,
        hsCode: input.hsCode,
        qty: input.quantity,
        value: input.cifValueMYR,
        currency: "MYR",
        prevBalance: previousBalanceMYR,
        newBalance: newBalanceMYR,
        actorId,
        metadata: {
          source: "mcp",
          unit: input.unit,
          cifValueMYR: input.cifValueMYR,
          dutySuspendedMYR: input.dutySuspendedMYR,
        },
      },
    });
    return {
      entryId: created.id,
      tenantId: created.tenantId,
      containerId: input.containerId,
      direction: input.direction,
      hsCode: created.hsCode ?? input.hsCode,
      quantity: created.qty,
      unit: input.unit,
      cifValueMYR: created.value,
      dutySuspendedMYR: input.dutySuspendedMYR,
      previousBalanceMYR,
      newBalanceMYR,
      postedAt: created.at.toISOString(),
    };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  return complete(entry);
}

const dateString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "must be a valid ISO date or timestamp",
});

export const ReconcileInput = z.object({
  tenantId: z.string().min(1),
  fromDate: dateString,
  toDate: dateString,
}).refine((value) => Date.parse(value.fromDate) <= Date.parse(value.toDate), {
  message: "toDate must be on or after fromDate",
  path: ["toDate"],
});
export type ReconcileInput = z.infer<typeof ReconcileInput>;

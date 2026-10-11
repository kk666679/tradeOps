import { Prisma } from '@prisma/client';
import { z } from "zod";
import type { PrismaService } from "../../../../../prisma/prisma.service";
import { complete, type ToolResult } from "../../../../shared/schemas/mrtr";
import { requireActiveZone } from "../database";

export const AllocateInput = z.object({
  tenantId: z.string().min(1),
  containerId: z.string().min(1),
  zone: z.enum(["CFS", "FIZ", "FCZ"]),
  priority: z.enum(["standard", "priority", "critical"]).default("standard"),
  requiresReefer: z.boolean().default(false),
});
export type AllocateInput = z.infer<typeof AllocateInput>;

export const QueryInput = z.object({
  tenantId: z.string().min(1),
  lotId: z.string().optional(),
  batchId: z.string().optional(),
  serial: z.string().optional(),
  limit: z.number().int().min(1).max(500).default(100),
});
export type QueryInput = z.infer<typeof QueryInput>;

export interface SlotAllocation {
  allocationId: string;
  slotId: string;
  zone: AllocateInput["zone"];
  containerId: string;
  allocatedAt: string;
  reeferCapable: boolean;
}

export interface InventoryRecord {
  lotId: string | null;
  batchId?: string;
  serial?: string;
  hsCode: string | null;
  quantity: number;
  unit: string;
  location: string | null;
}

function isReeferSlot(slotType: string | null): boolean {
  return slotType?.toUpperCase() === "REEFER";
}

export async function handleAllocate(
  raw: AllocateInput,
  prisma: PrismaService,
): Promise<ToolResult<SlotAllocation>> {
  const input = AllocateInput.parse(raw);
  const allocation = await prisma.$transaction(async (tx) => {
    const zone = await requireActiveZone(tx, input.tenantId, input.zone);
    const cargo = await tx.cargo.findFirst({
      where: {
        tenantId: input.tenantId,
        containerNo: input.containerId,
        zoneId: zone.id,
      },
      select: { id: true },
    });
    if (!cargo) {
      throw new Error(`container ${input.containerId} was not found in zone ${input.zone}`);
    }

    const existing = await tx.slotAllocation.findFirst({
      where: { tenantId: input.tenantId, cargoId: cargo.id, releasedAt: null },
      include: { slot: { select: { id: true, code: true, slotType: true } } },
    });
    if (existing) {
      return {
        allocationId: existing.id,
        slotId: existing.slot.code,
        zone: input.zone,
        containerId: input.containerId,
        allocatedAt: existing.allocatedAt.toISOString(),
        reeferCapable: isReeferSlot(existing.slot.slotType),
      };
    }

    const slots = await tx.slot.findMany({
      where: {
        tenantId: input.tenantId,
        zoneId: zone.id,
        status: "AVAILABLE",
        ...(input.requiresReefer
          ? { slotType: { equals: "REEFER", mode: "insensitive" } }
          : {}),
      },
      orderBy: { code: "asc" },
      select: { id: true, code: true, slotType: true },
    });
    for (const slot of slots) {
      const claim = await tx.slot.updateMany({
        where: { id: slot.id, tenantId: input.tenantId, status: "AVAILABLE" },
        data: { status: "OCCUPIED" },
      });
      if (claim.count !== 1) continue;

      const created = await tx.slotAllocation.create({
        data: {
          tenantId: input.tenantId,
          slotId: slot.id,
          cargoId: cargo.id,
          metadata: {
            source: "mcp",
            containerId: input.containerId,
            priority: input.priority,
            requiresReefer: input.requiresReefer,
          },
        },
      });
      return {
        allocationId: created.id,
        slotId: slot.code,
        zone: input.zone,
        containerId: input.containerId,
        allocatedAt: created.allocatedAt.toISOString(),
        reeferCapable: isReeferSlot(slot.slotType),
      };
    }
    throw new Error(`no free ${input.requiresReefer ? "reefer " : ""}slot in zone ${input.zone}`);
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

  return complete(allocation);
}

function metadataString(metadata: Prisma.JsonValue, key: string): string | undefined {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return undefined;
  const value = metadata[key];
  return typeof value === "string" ? value : undefined;
}

export async function handleQuery(
  raw: QueryInput,
  prisma: PrismaService,
): Promise<ToolResult<InventoryRecord[]>> {
  const input = QueryInput.parse(raw);
  const metadataFilters: Prisma.InventoryWhereInput[] = [];
  if (input.lotId) {
    metadataFilters.push({ metadata: { path: ["lotId"], equals: input.lotId } });
  }
  if (input.batchId) {
    metadataFilters.push({ metadata: { path: ["batchId"], equals: input.batchId } });
  }
  if (input.serial) {
    metadataFilters.push({ metadata: { path: ["serial"], equals: input.serial } });
  }
  const rows = await prisma.inventory.findMany({
    where: { tenantId: input.tenantId, AND: metadataFilters },
    include: { slot: { select: { code: true } } },
    orderBy: { sku: "asc" },
    take: input.limit,
  });
  return complete(rows.map((row) => ({
    lotId: metadataString(row.metadata, "lotId") ?? null,
    batchId: metadataString(row.metadata, "batchId"),
    serial: metadataString(row.metadata, "serial"),
    hsCode: row.hsCode,
    quantity: row.qty,
    unit: row.uom,
    location: row.slot?.code ?? null,
  })));
}

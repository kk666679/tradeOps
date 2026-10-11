// servers/tradeops-core/src/tools/inventory.ts

import { z } from "zod";
import { complete, type ToolResult } from "../../../../shared/schemas/mrtr";

export const AllocateInput = z.object({
  tenantId: z.string(),
  containerId: z.string(),
  zone: z.enum(["CFS", "FIZ", "FCZ"]),
  priority: z.enum(["standard", "priority", "critical"]).default("standard"),
  requiresReefer: z.boolean().default(false),
});
export type AllocateInput = z.infer<typeof AllocateInput>;

export const QueryInput = z.object({
  tenantId: z.string(),
  lotId: z.string().optional(),
  batchId: z.string().optional(),
  serial: z.string().optional(),
});
export type QueryInput = z.infer<typeof QueryInput>;

export interface SlotAllocation {
  slotId: string;
  zone: AllocateInput["zone"];
  containerId: string;
  allocatedAt: string;
  reeferCapable: boolean;
}

export interface InventoryRecord {
  lotId: string;
  batchId?: string;
  serial?: string;
  hsCode: string;
  quantity: number;
  unit: string;
  location: string;
}

const SLOT_REEFER = new Set(["CFS-R-01", "CFS-R-02", "CFS-R-03"]);
const SLOTS_FIZ = ["FIZ-01", "FIZ-02", "FIZ-03", "FIZ-04"];
const SLOTS_FCZ = ["FCZ-01", "FCZ-02", "FCZ-03"];
const SLOTS_CFS = ["CFS-01", "CFS-02", "CFS-03", "CFS-R-01", "CFS-R-02", "CFS-R-03"];

const allocations = new Map<string, SlotAllocation>();

function candidateSlots(zone: AllocateInput["zone"], needsReefer: boolean): string[] {
  const base = zone === "FIZ" ? SLOTS_FIZ : zone === "FCZ" ? SLOTS_FCZ : SLOTS_CFS;
  return needsReefer ? base.filter((s) => SLOT_REEFER.has(s)) : base;
}

export async function handleAllocate(raw: AllocateInput): Promise<ToolResult<SlotAllocation>> {
  const input = AllocateInput.parse(raw);
  const taken = new Set([...allocations.values()].map((a) => a.slotId));
  const candidate = candidateSlots(input.zone, input.requiresReefer).find((s) => !taken.has(s));

  if (!candidate) {
    throw new Error(`no free slot in zone ${input.zone} (requiresReefer=${input.requiresReefer})`);
  }
  const allocation: SlotAllocation = {
    slotId: candidate,
    zone: input.zone,
    containerId: input.containerId,
    allocatedAt: new Date().toISOString(),
    reeferCapable: SLOT_REEFER.has(candidate),
  };
  allocations.set(input.containerId, allocation);
  return complete(allocation);
}

export async function handleQuery(raw: QueryInput): Promise<ToolResult<InventoryRecord[]>> {
  const input = QueryInput.parse(raw);
  const fixtures: InventoryRecord[] = [
    { lotId: "LOT-001", batchId: "B-2026-01", serial: "SN-0001", hsCode: "85444200", quantity: 120, unit: "PCS", location: "CFS-01" },
    { lotId: "LOT-002", batchId: "B-2026-01", serial: "SN-0002", hsCode: "85444200", quantity: 120, unit: "PCS", location: "CFS-02" },
  ];
  const rows = fixtures.filter((r) =>
    (!input.lotId || r.lotId === input.lotId) &&
    (!input.batchId || r.batchId === input.batchId) &&
    (!input.serial || r.serial === input.serial)
  );
  return complete(rows);
}

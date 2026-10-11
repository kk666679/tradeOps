import type { Prisma } from '@prisma/client';
import type { PrismaService } from "../../../../../prisma/prisma.service";

export interface YardZone {
  zone: "CFS" | "FIZ" | "FCZ";
  capacity: number;
  occupied: number;
  dwellP50Hours: number | null;
  dwellP95Hours: number | null;
}

export interface YardSnapshot {
  tenantId: string;
  generatedAt: string;
  ttlSeconds: number;
  zones: YardZone[];
}

function isYardZoneCode(code: string): code is YardZone["zone"] {
  return code === "CFS" || code === "FIZ" || code === "FCZ";
}

export const YARD_URI_TEMPLATE = "tradeops://yard/{tenantId}";
export const YARD_URI = (tenantId: string) => `tradeops://yard/${encodeURIComponent(tenantId)}`;

export function yardResourceDescriptor() {
  return {
    uriTemplate: YARD_URI_TEMPLATE,
    name: "Yard occupancy",
    description: "Current slot occupancy and measured gate-event dwell times by active zone.",
    mimeType: "application/json",
    ttlSeconds: 30,
  };
}

function payloadContainerId(payload: Prisma.JsonValue): string | undefined {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return undefined;
  const value = payload.containerId;
  return typeof value === "string" && value.length ? value : undefined;
}

function percentile(values: number[], quantile: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(quantile * sorted.length) - 1];
}

export async function buildYardSnapshot(
  prisma: PrismaService,
  tenantId: string,
): Promise<YardSnapshot> {
  const zones = await prisma.zone.findMany({
    where: { tenantId, status: "ACTIVE", code: { in: ["CFS", "FIZ", "FCZ"] } },
    orderBy: { code: "asc" },
    select: { id: true, code: true },
  });
  const zoneIds = zones.map((zone) => zone.id);
  const [slots, events] = await Promise.all([
    prisma.slot.findMany({
      where: { tenantId, zoneId: { in: zoneIds } },
      select: { zoneId: true, status: true },
    }),
    prisma.gateEvent.findMany({
      where: {
        tenantId,
        zoneId: { in: zoneIds },
        at: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        direction: { in: ["IN", "OUT"] },
      },
      orderBy: [{ at: "desc" }, { id: "desc" }],
      take: 5000,
      select: { id: true, zoneId: true, direction: true, at: true, payload: true },
    }),
  ]);

  const openEntries = new Map<string, Date>();
  const dwellByZone = new Map<string, number[]>();
  for (const event of events.reverse()) {
    const containerId = payloadContainerId(event.payload);
    if (!containerId) continue;
    const key = `${event.zoneId}\u0000${containerId}`;
    if (event.direction === "IN") {
      openEntries.set(key, event.at);
      continue;
    }
    const enteredAt = openEntries.get(key);
    if (!enteredAt) continue;
    openEntries.delete(key);
    const dwellHours = (event.at.getTime() - enteredAt.getTime()) / 3_600_000;
    if (dwellHours < 0) continue;
    const values = dwellByZone.get(event.zoneId) ?? [];
    values.push(dwellHours);
    dwellByZone.set(event.zoneId, values);
  }

  return {
    tenantId,
    generatedAt: new Date().toISOString(),
    ttlSeconds: 30,
    zones: zones.map((zone) => {
      if (!isYardZoneCode(zone.code)) {
        throw new Error(`unexpected yard zone code ${zone.code}`);
      }
      const zoneSlots = slots.filter((slot) => slot.zoneId === zone.id);
      const usableSlots = zoneSlots.filter(
        (slot) => slot.status !== "MAINTENANCE" && slot.status !== "BLOCKED",
      );
      const occupied = usableSlots.filter(
        (slot) => slot.status === "OCCUPIED" || slot.status === "RESERVED",
      ).length;
      const dwellHours = dwellByZone.get(zone.id) ?? [];
      return {
        zone: zone.code,
        capacity: usableSlots.length,
        occupied,
        dwellP50Hours: percentile(dwellHours, 0.5),
        dwellP95Hours: percentile(dwellHours, 0.95),
      };
    }),
  };
}

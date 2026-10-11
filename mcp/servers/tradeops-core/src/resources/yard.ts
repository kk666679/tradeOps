// servers/tradeops-core/src/resources/yard.ts

export interface YardZone {
  zone: "CFS" | "FIZ" | "FCZ";
  capacity: number;
  occupied: number;
  dwellP50Hours: number;
  dwellP95Hours: number;
}

export interface YardSnapshot {
  tenantId: string;
  generatedAt: string;
  ttlSeconds: number;
  zones: YardZone[];
}

export const YARD_URI = (tenantId: string) => `tradeops://yard/${tenantId}`;

export function buildYardSnapshot(tenantId: string): YardSnapshot {
  return {
    tenantId,
    generatedAt: new Date().toISOString(),
    ttlSeconds: 30,
    zones: [
      { zone: "CFS", capacity: 400, occupied: 312, dwellP50Hours: 18, dwellP95Hours: 71 },
      { zone: "FIZ", capacity: 200, occupied: 143, dwellP50Hours: 26, dwellP95Hours: 88 },
      { zone: "FCZ", capacity: 150, occupied: 61,  dwellP50Hours: 12, dwellP95Hours: 40 },
    ],
  };
}

export function yardResourceDescriptor() {
  return {
    uriTemplate: "tradeops://yard/{tenantId}",
    name: "Yard occupancy",
    description: "Live CFS/FIZ/FCZ occupancy, dwell times, and capacity.",
    mimeType: "application/json",
    ttlSeconds: 30,
  };
}

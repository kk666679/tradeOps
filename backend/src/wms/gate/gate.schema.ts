import { z } from 'zod';
export const GateCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const GateUpdate = GateCreate.partial();
export const GateFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type GateCreate = z.infer<typeof GateCreate>;
export type GateUpdate = z.infer<typeof GateUpdate>;

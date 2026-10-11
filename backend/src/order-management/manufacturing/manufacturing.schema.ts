import { z } from 'zod';
export const ManufacturingCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const ManufacturingUpdate = ManufacturingCreate.partial();
export const ManufacturingFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type ManufacturingCreate = z.infer<typeof ManufacturingCreate>;
export type ManufacturingUpdate = z.infer<typeof ManufacturingUpdate>;

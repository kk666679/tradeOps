import { z } from 'zod';
export const ProductionCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const ProductionUpdate = ProductionCreate.partial();
export const ProductionFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type ProductionCreate = z.infer<typeof ProductionCreate>;
export type ProductionUpdate = z.infer<typeof ProductionUpdate>;

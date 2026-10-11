import { z } from 'zod';
export const ErpCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const ErpUpdate = ErpCreate.partial();
export const ErpFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type ErpCreate = z.infer<typeof ErpCreate>;
export type ErpUpdate = z.infer<typeof ErpUpdate>;

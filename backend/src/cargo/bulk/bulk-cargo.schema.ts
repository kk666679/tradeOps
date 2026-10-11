import { z } from 'zod';
export const BulkCargoCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const BulkCargoUpdate = BulkCargoCreate.partial();
export const BulkCargoFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type BulkCargoCreate = z.infer<typeof BulkCargoCreate>;
export type BulkCargoUpdate = z.infer<typeof BulkCargoUpdate>;

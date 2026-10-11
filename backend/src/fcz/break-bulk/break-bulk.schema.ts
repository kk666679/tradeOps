import { z } from 'zod';
export const BreakBulkCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const BreakBulkUpdate = BreakBulkCreate.partial();
export const BreakBulkFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type BreakBulkCreate = z.infer<typeof BreakBulkCreate>;
export type BreakBulkUpdate = z.infer<typeof BreakBulkUpdate>;

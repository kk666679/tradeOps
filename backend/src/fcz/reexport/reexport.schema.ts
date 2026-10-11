import { z } from 'zod';
export const ReexportCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const ReexportUpdate = ReexportCreate.partial();
export const ReexportFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type ReexportCreate = z.infer<typeof ReexportCreate>;
export type ReexportUpdate = z.infer<typeof ReexportUpdate>;

import { z } from 'zod';
export const EdiCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const EdiUpdate = EdiCreate.partial();
export const EdiFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type EdiCreate = z.infer<typeof EdiCreate>;
export type EdiUpdate = z.infer<typeof EdiUpdate>;

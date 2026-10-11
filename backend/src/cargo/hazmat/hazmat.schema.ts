import { z } from 'zod';
export const HazmatCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const HazmatUpdate = HazmatCreate.partial();
export const HazmatFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type HazmatCreate = z.infer<typeof HazmatCreate>;
export type HazmatUpdate = z.infer<typeof HazmatUpdate>;

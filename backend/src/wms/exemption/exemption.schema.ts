import { z } from 'zod';
export const ExemptionCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const ExemptionUpdate = ExemptionCreate.partial();
export const ExemptionFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type ExemptionCreate = z.infer<typeof ExemptionCreate>;
export type ExemptionUpdate = z.infer<typeof ExemptionUpdate>;

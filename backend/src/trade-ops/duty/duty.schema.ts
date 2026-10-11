import { z } from 'zod';
export const DutyCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const DutyUpdate = DutyCreate.partial();
export const DutyFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type DutyCreate = z.infer<typeof DutyCreate>;
export type DutyUpdate = z.infer<typeof DutyUpdate>;

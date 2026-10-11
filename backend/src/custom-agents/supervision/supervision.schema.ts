import { z } from 'zod';
export const SupervisionCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const SupervisionUpdate = SupervisionCreate.partial();
export const SupervisionFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type SupervisionCreate = z.infer<typeof SupervisionCreate>;
export type SupervisionUpdate = z.infer<typeof SupervisionUpdate>;

import { z } from 'zod';
export const MachineryCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const MachineryUpdate = MachineryCreate.partial();
export const MachineryFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type MachineryCreate = z.infer<typeof MachineryCreate>;
export type MachineryUpdate = z.infer<typeof MachineryUpdate>;

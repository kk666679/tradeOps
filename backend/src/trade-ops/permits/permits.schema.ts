import { z } from 'zod';
export const PermitsCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const PermitsUpdate = PermitsCreate.partial();
export const PermitsFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type PermitsCreate = z.infer<typeof PermitsCreate>;
export type PermitsUpdate = z.infer<typeof PermitsUpdate>;

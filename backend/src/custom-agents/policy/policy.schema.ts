import { z } from 'zod';
export const PolicyCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const PolicyUpdate = PolicyCreate.partial();
export const PolicyFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type PolicyCreate = z.infer<typeof PolicyCreate>;
export type PolicyUpdate = z.infer<typeof PolicyUpdate>;

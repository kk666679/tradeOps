import { z } from 'zod';
export const WastageCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const WastageUpdate = WastageCreate.partial();
export const WastageFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type WastageCreate = z.infer<typeof WastageCreate>;
export type WastageUpdate = z.infer<typeof WastageUpdate>;

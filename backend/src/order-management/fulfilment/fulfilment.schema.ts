import { z } from 'zod';
export const FulfilmentCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const FulfilmentUpdate = FulfilmentCreate.partial();
export const FulfilmentFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type FulfilmentCreate = z.infer<typeof FulfilmentCreate>;
export type FulfilmentUpdate = z.infer<typeof FulfilmentUpdate>;

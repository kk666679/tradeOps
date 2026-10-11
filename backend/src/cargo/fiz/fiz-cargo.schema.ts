import { z } from 'zod';
export const FizCargoCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const FizCargoUpdate = FizCargoCreate.partial();
export const FizCargoFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type FizCargoCreate = z.infer<typeof FizCargoCreate>;
export type FizCargoUpdate = z.infer<typeof FizCargoUpdate>;

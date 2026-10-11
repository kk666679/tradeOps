import { z } from 'zod';
export const FczCargoCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const FczCargoUpdate = FczCargoCreate.partial();
export const FczCargoFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type FczCargoCreate = z.infer<typeof FczCargoCreate>;
export type FczCargoUpdate = z.infer<typeof FczCargoUpdate>;

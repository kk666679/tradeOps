import { z } from 'zod';
export const BondedCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const BondedUpdate = BondedCreate.partial();
export const BondedFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type BondedCreate = z.infer<typeof BondedCreate>;
export type BondedUpdate = z.infer<typeof BondedUpdate>;

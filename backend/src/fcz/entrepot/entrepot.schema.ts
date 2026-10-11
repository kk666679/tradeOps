import { z } from 'zod';
export const EntrepotCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const EntrepotUpdate = EntrepotCreate.partial();
export const EntrepotFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type EntrepotCreate = z.infer<typeof EntrepotCreate>;
export type EntrepotUpdate = z.infer<typeof EntrepotUpdate>;

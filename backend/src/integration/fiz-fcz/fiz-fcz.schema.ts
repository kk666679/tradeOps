import { z } from 'zod';
export const FizFczCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const FizFczUpdate = FizFczCreate.partial();
export const FizFczFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type FizFczCreate = z.infer<typeof FizFczCreate>;
export type FizFczUpdate = z.infer<typeof FizFczUpdate>;

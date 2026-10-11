import { z } from 'zod';
export const TranshipmentCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const TranshipmentUpdate = TranshipmentCreate.partial();
export const TranshipmentFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type TranshipmentCreate = z.infer<typeof TranshipmentCreate>;
export type TranshipmentUpdate = z.infer<typeof TranshipmentUpdate>;

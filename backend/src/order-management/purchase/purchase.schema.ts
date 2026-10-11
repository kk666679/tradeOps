import { z } from 'zod';
export const PurchaseCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const PurchaseUpdate = PurchaseCreate.partial();
export const PurchaseFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type PurchaseCreate = z.infer<typeof PurchaseCreate>;
export type PurchaseUpdate = z.infer<typeof PurchaseUpdate>;

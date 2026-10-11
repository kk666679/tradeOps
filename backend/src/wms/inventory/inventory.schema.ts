import { z } from 'zod';
export const InventoryCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const InventoryUpdate = InventoryCreate.partial();
export const InventoryFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type InventoryCreate = z.infer<typeof InventoryCreate>;
export type InventoryUpdate = z.infer<typeof InventoryUpdate>;

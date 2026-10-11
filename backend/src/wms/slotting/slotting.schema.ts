import { z } from 'zod';
export const SlottingCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const SlottingUpdate = SlottingCreate.partial();
export const SlottingFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type SlottingCreate = z.infer<typeof SlottingCreate>;
export type SlottingUpdate = z.infer<typeof SlottingUpdate>;

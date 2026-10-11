import { z } from 'zod';
export const TmsCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const TmsUpdate = TmsCreate.partial();
export const TmsFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type TmsCreate = z.infer<typeof TmsCreate>;
export type TmsUpdate = z.infer<typeof TmsUpdate>;

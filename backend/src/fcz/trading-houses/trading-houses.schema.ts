import { z } from 'zod';
export const TradingHousesCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const TradingHousesUpdate = TradingHousesCreate.partial();
export const TradingHousesFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type TradingHousesCreate = z.infer<typeof TradingHousesCreate>;
export type TradingHousesUpdate = z.infer<typeof TradingHousesUpdate>;

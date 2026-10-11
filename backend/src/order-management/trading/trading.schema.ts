import { z } from 'zod';
export const TradingCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const TradingUpdate = TradingCreate.partial();
export const TradingFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type TradingCreate = z.infer<typeof TradingCreate>;
export type TradingUpdate = z.infer<typeof TradingUpdate>;

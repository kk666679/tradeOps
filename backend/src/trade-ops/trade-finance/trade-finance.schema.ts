import { z } from 'zod';
export const TradeFinanceCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const TradeFinanceUpdate = TradeFinanceCreate.partial();
export const TradeFinanceFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type TradeFinanceCreate = z.infer<typeof TradeFinanceCreate>;
export type TradeFinanceUpdate = z.infer<typeof TradeFinanceUpdate>;

import { z } from 'zod';
export const LogisticsCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const LogisticsUpdate = LogisticsCreate.partial();
export const LogisticsFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type LogisticsCreate = z.infer<typeof LogisticsCreate>;
export type LogisticsUpdate = z.infer<typeof LogisticsUpdate>;

import { z } from 'zod';
export const AnalyticsCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const AnalyticsUpdate = AnalyticsCreate.partial();
export const AnalyticsFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type AnalyticsCreate = z.infer<typeof AnalyticsCreate>;
export type AnalyticsUpdate = z.infer<typeof AnalyticsUpdate>;

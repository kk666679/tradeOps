import { z } from 'zod';
export const ForecastingCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const ForecastingUpdate = ForecastingCreate.partial();
export const ForecastingFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type ForecastingCreate = z.infer<typeof ForecastingCreate>;
export type ForecastingUpdate = z.infer<typeof ForecastingUpdate>;

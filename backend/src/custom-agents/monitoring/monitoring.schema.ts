import { z } from 'zod';
export const MonitoringCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const MonitoringUpdate = MonitoringCreate.partial();
export const MonitoringFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type MonitoringCreate = z.infer<typeof MonitoringCreate>;
export type MonitoringUpdate = z.infer<typeof MonitoringUpdate>;

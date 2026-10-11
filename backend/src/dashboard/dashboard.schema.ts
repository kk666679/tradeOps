import { z } from 'zod';
export const DashboardCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const DashboardUpdate = DashboardCreate.partial();
export const DashboardFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type DashboardCreate = z.infer<typeof DashboardCreate>;
export type DashboardUpdate = z.infer<typeof DashboardUpdate>;

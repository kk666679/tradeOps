import { z } from 'zod';
export const ComplianceCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const ComplianceUpdate = ComplianceCreate.partial();
export const ComplianceFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type ComplianceCreate = z.infer<typeof ComplianceCreate>;
export type ComplianceUpdate = z.infer<typeof ComplianceUpdate>;

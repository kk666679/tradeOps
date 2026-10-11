import { z } from 'zod';
export const AuditCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const AuditUpdate = AuditCreate.partial();
export const AuditFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type AuditCreate = z.infer<typeof AuditCreate>;
export type AuditUpdate = z.infer<typeof AuditUpdate>;

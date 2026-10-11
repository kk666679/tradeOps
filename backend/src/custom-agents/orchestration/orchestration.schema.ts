import { z } from 'zod';
export const OrchestrationCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const OrchestrationUpdate = OrchestrationCreate.partial();
export const OrchestrationFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type OrchestrationCreate = z.infer<typeof OrchestrationCreate>;
export type OrchestrationUpdate = z.infer<typeof OrchestrationUpdate>;

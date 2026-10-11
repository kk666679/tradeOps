import { z } from 'zod';
export const WebhookCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const WebhookUpdate = WebhookCreate.partial();
export const WebhookFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type WebhookCreate = z.infer<typeof WebhookCreate>;
export type WebhookUpdate = z.infer<typeof WebhookUpdate>;

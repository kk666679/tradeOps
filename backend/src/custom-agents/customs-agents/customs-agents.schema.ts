import { z } from 'zod';
export const CustomsAgentsCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const CustomsAgentsUpdate = CustomsAgentsCreate.partial();
export const CustomsAgentsFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type CustomsAgentsCreate = z.infer<typeof CustomsAgentsCreate>;
export type CustomsAgentsUpdate = z.infer<typeof CustomsAgentsUpdate>;

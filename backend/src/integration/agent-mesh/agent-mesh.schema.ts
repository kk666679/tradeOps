import { z } from 'zod';
export const AgentMeshCreate = z.object({ ref: z.string().optional(), zone: z.enum(['FIZ','FCZ','BONDED']).optional() }).passthrough();
export const AgentMeshUpdate = AgentMeshCreate.partial();
export const AgentMeshFilter = z.object({ q: z.string().optional(), take: z.coerce.number().min(1).max(200).default(50) });
export type AgentMeshCreate = z.infer<typeof AgentMeshCreate>;
export type AgentMeshUpdate = z.infer<typeof AgentMeshUpdate>;

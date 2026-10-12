import { z } from "zod";
export declare const ListAgentsInput: z.ZodObject<{
    tenantId: z.ZodString;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    _meta?: Record<string, unknown> | undefined;
}, {
    tenantId: string;
    _meta?: Record<string, unknown> | undefined;
}>;
export type ListAgentsInput = z.infer<typeof ListAgentsInput>;
export declare function handleListAgents(raw: ListAgentsInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;

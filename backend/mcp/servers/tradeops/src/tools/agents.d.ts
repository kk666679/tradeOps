import { z } from "zod";
export declare const ListAgentsInput: z.ZodObject<{
    tenantId: z.ZodString;
    _meta: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
export type ListAgentsInput = z.infer<typeof ListAgentsInput>;
export declare function handleListAgents(raw: ListAgentsInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;

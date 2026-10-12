import { z } from "zod";
export declare const FczTradeInput: z.ZodObject<{
    tenantId: z.ZodString;
    containerId: z.ZodString;
    operation: z.ZodEnum<["in", "out", "re-export"]>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    containerId: string;
    operation: "out" | "in" | "re-export";
    _meta?: Record<string, unknown> | undefined;
}, {
    tenantId: string;
    containerId: string;
    operation: "out" | "in" | "re-export";
    _meta?: Record<string, unknown> | undefined;
}>;
export type FczTradeInput = z.infer<typeof FczTradeInput>;
export declare function handleFczTrade(raw: FczTradeInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;

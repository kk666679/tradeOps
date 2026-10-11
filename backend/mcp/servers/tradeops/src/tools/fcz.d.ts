import { z } from "zod";
export declare const FczTradeInput: z.ZodObject<{
    tenantId: z.ZodString;
    containerId: z.ZodString;
    operation: z.ZodEnum<{
        out: "out";
        in: "in";
        "re-export": "re-export";
    }>;
    _meta: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
export type FczTradeInput = z.infer<typeof FczTradeInput>;
export declare function handleFczTrade(raw: FczTradeInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;

import { z } from "zod";
export declare const RagSearchInput: z.ZodObject<{
    tenantId: z.ZodString;
    question: z.ZodString;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    question: string;
    _meta?: Record<string, unknown> | undefined;
}, {
    tenantId: string;
    question: string;
    _meta?: Record<string, unknown> | undefined;
}>;
export type RagSearchInput = z.infer<typeof RagSearchInput>;
export declare function handleRagSearch(raw: RagSearchInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export declare const ForecastInput: z.ZodObject<{
    tenantId: z.ZodString;
    horizonWeeks: z.ZodNumber;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    horizonWeeks: number;
    _meta?: Record<string, unknown> | undefined;
}, {
    tenantId: string;
    horizonWeeks: number;
    _meta?: Record<string, unknown> | undefined;
}>;
export type ForecastInput = z.infer<typeof ForecastInput>;
export declare function handleForecast(raw: ForecastInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;

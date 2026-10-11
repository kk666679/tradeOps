import { z } from "zod";
export declare const RagSearchInput: z.ZodObject<{
    tenantId: z.ZodString;
    question: z.ZodString;
    _meta: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
export type RagSearchInput = z.infer<typeof RagSearchInput>;
export declare function handleRagSearch(raw: RagSearchInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
export declare const ForecastInput: z.ZodObject<{
    tenantId: z.ZodString;
    horizonWeeks: z.ZodNumber;
    _meta: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
export type ForecastInput = z.infer<typeof ForecastInput>;
export declare function handleForecast(raw: ForecastInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;

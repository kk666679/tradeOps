import { z } from "zod";
export declare const FizManufactureInput: z.ZodObject<{
    tenantId: z.ZodString;
    workOrderId: z.ZodString;
    action: z.ZodEnum<["start", "complete", "hold"]>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    workOrderId: string;
    action: "complete" | "start" | "hold";
    _meta?: Record<string, unknown> | undefined;
}, {
    tenantId: string;
    workOrderId: string;
    action: "complete" | "start" | "hold";
    _meta?: Record<string, unknown> | undefined;
}>;
export type FizManufactureInput = z.infer<typeof FizManufactureInput>;
export declare function handleFizManufacture(raw: FizManufactureInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;

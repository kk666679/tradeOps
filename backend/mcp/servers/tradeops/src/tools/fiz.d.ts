import { z } from "zod";
export declare const FizManufactureInput: z.ZodObject<{
    tenantId: z.ZodString;
    workOrderId: z.ZodString;
    action: z.ZodEnum<{
        complete: "complete";
        start: "start";
        hold: "hold";
    }>;
    _meta: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
export type FizManufactureInput = z.infer<typeof FizManufactureInput>;
export declare function handleFizManufacture(raw: FizManufactureInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;

import { z } from "zod";
export declare const CrossZoneMoveInput: z.ZodObject<{
    tenantId: z.ZodString;
    containerId: z.ZodString;
    fromZone: z.ZodEnum<{
        CFS: "CFS";
        FIZ: "FIZ";
        FCZ: "FCZ";
    }>;
    toZone: z.ZodEnum<{
        CFS: "CFS";
        FIZ: "FIZ";
        FCZ: "FCZ";
    }>;
    _meta: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
export type CrossZoneMoveInput = z.infer<typeof CrossZoneMoveInput>;
export declare function handleCrossZoneMove(raw: CrossZoneMoveInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;

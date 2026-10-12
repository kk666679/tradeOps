import { z } from "zod";
export declare const CrossZoneMoveInput: z.ZodObject<{
    tenantId: z.ZodString;
    containerId: z.ZodString;
    fromZone: z.ZodEnum<["CFS", "FIZ", "FCZ"]>;
    toZone: z.ZodEnum<["CFS", "FIZ", "FCZ"]>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    containerId: string;
    fromZone: "CFS" | "FIZ" | "FCZ";
    toZone: "CFS" | "FIZ" | "FCZ";
    _meta?: Record<string, unknown> | undefined;
}, {
    tenantId: string;
    containerId: string;
    fromZone: "CFS" | "FIZ" | "FCZ";
    toZone: "CFS" | "FIZ" | "FCZ";
    _meta?: Record<string, unknown> | undefined;
}>;
export type CrossZoneMoveInput = z.infer<typeof CrossZoneMoveInput>;
export declare function handleCrossZoneMove(raw: CrossZoneMoveInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;

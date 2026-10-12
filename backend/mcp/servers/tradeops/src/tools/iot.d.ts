import { z } from "zod";
export declare const DeviceStatusInput: z.ZodObject<{
    tenantId: z.ZodString;
    deviceId: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    _meta?: Record<string, unknown> | undefined;
    deviceId?: string | undefined;
}, {
    tenantId: string;
    _meta?: Record<string, unknown> | undefined;
    deviceId?: string | undefined;
}>;
export type DeviceStatusInput = z.infer<typeof DeviceStatusInput>;
export declare function handleDeviceStatus(raw: DeviceStatusInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export declare const ZoneGraphInput: z.ZodObject<{
    tenantId: z.ZodString;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    _meta?: Record<string, unknown> | undefined;
}, {
    tenantId: string;
    _meta?: Record<string, unknown> | undefined;
}>;
export type ZoneGraphInput = z.infer<typeof ZoneGraphInput>;
export declare function handleZoneGraph(raw: ZoneGraphInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;

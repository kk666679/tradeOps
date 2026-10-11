import { z } from "zod";
export declare const DeviceStatusInput: z.ZodObject<{
    tenantId: z.ZodString;
    deviceId: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
export type DeviceStatusInput = z.infer<typeof DeviceStatusInput>;
export declare function handleDeviceStatus(raw: DeviceStatusInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
export declare const ZoneGraphInput: z.ZodObject<{
    tenantId: z.ZodString;
    _meta: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
export type ZoneGraphInput = z.infer<typeof ZoneGraphInput>;
export declare function handleZoneGraph(raw: ZoneGraphInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;

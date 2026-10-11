import { z } from "zod";
export declare const ClassifyInput: z.ZodObject<{
    tenantId: z.ZodString;
    description: z.ZodString;
    candidates: z.ZodOptional<z.ZodArray<z.ZodString>>;
    _meta: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
export type ClassifyInput = z.infer<typeof ClassifyInput>;
export declare function handleClassify(raw: ClassifyInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
export declare const DutyInput: z.ZodObject<{
    tenantId: z.ZodString;
    hsCode: z.ZodString;
    cifValueMYR: z.ZodNumber;
    origin: z.ZodString;
    scheme: z.ZodDefault<z.ZodEnum<{
        MFN: "MFN";
        ATIGA: "ATIGA";
        ACFTA: "ACFTA";
        RCEP: "RCEP";
        CPTPP: "CPTPP";
        MJEPA: "MJEPA";
        MCFTA: "MCFTA";
    }>>;
    _meta: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
export type DutyInput = z.infer<typeof DutyInput>;
export declare function handleDuty(raw: DutyInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;

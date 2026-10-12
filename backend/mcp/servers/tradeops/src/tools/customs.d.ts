import { z } from "zod";
export declare const ClassifyInput: z.ZodObject<{
    tenantId: z.ZodString;
    description: z.ZodString;
    candidates: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    description: string;
    _meta?: Record<string, unknown> | undefined;
    candidates?: string[] | undefined;
}, {
    tenantId: string;
    description: string;
    _meta?: Record<string, unknown> | undefined;
    candidates?: string[] | undefined;
}>;
export type ClassifyInput = z.infer<typeof ClassifyInput>;
export declare function handleClassify(raw: ClassifyInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export declare const DutyInput: z.ZodObject<{
    tenantId: z.ZodString;
    hsCode: z.ZodString;
    cifValueMYR: z.ZodNumber;
    origin: z.ZodString;
    scheme: z.ZodDefault<z.ZodEnum<["MFN", "ATIGA", "ACFTA", "RCEP", "CPTPP", "MJEPA", "MCFTA"]>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    hsCode: string;
    cifValueMYR: number;
    origin: string;
    scheme: "MFN" | "ATIGA" | "ACFTA" | "RCEP" | "CPTPP" | "MJEPA" | "MCFTA";
    _meta?: Record<string, unknown> | undefined;
}, {
    tenantId: string;
    hsCode: string;
    cifValueMYR: number;
    origin: string;
    _meta?: Record<string, unknown> | undefined;
    scheme?: "MFN" | "ATIGA" | "ACFTA" | "RCEP" | "CPTPP" | "MJEPA" | "MCFTA" | undefined;
}>;
export type DutyInput = z.infer<typeof DutyInput>;
export declare function handleDuty(raw: DutyInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;

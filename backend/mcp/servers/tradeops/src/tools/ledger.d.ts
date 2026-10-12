import { z } from "zod";
export declare const LedgerEntryInput: z.ZodObject<{
    tenantId: z.ZodString;
    containerId: z.ZodString;
    direction: z.ZodEnum<["debit", "credit"]>;
    hsCode: z.ZodString;
    quantity: z.ZodNumber;
    unit: z.ZodString;
    cifValueMYR: z.ZodNumber;
    dutySuspendedMYR: z.ZodNumber;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    containerId: string;
    hsCode: string;
    cifValueMYR: number;
    direction: "debit" | "credit";
    quantity: number;
    unit: string;
    dutySuspendedMYR: number;
    _meta?: Record<string, unknown> | undefined;
}, {
    tenantId: string;
    containerId: string;
    hsCode: string;
    cifValueMYR: number;
    direction: "debit" | "credit";
    quantity: number;
    unit: string;
    dutySuspendedMYR: number;
    _meta?: Record<string, unknown> | undefined;
}>;
export type LedgerEntryInput = z.infer<typeof LedgerEntryInput>;
export declare function handleLedgerEntry(raw: LedgerEntryInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
export declare const LedgerSummaryInput: z.ZodObject<{
    tenantId: z.ZodString;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    _meta?: Record<string, unknown> | undefined;
}, {
    tenantId: string;
    _meta?: Record<string, unknown> | undefined;
}>;
export type LedgerSummaryInput = z.infer<typeof LedgerSummaryInput>;
export declare function handleLedgerSummary(raw: LedgerSummaryInput): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;

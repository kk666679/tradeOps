import { z } from "zod";
export declare const LedgerEntryInput: z.ZodObject<{
    tenantId: z.ZodString;
    containerId: z.ZodString;
    direction: z.ZodEnum<{
        debit: "debit";
        credit: "credit";
    }>;
    hsCode: z.ZodString;
    quantity: z.ZodNumber;
    unit: z.ZodString;
    cifValueMYR: z.ZodNumber;
    dutySuspendedMYR: z.ZodNumber;
    _meta: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
export type LedgerEntryInput = z.infer<typeof LedgerEntryInput>;
export declare function handleLedgerEntry(raw: LedgerEntryInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
export declare const LedgerSummaryInput: z.ZodObject<{
    tenantId: z.ZodString;
    _meta: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
export type LedgerSummaryInput = z.infer<typeof LedgerSummaryInput>;
export declare function handleLedgerSummary(raw: LedgerSummaryInput): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;

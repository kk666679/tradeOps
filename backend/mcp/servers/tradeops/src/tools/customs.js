import { z } from "zod";
import { lookupHs } from "../resources/hs.js";
export const ClassifyInput = z.object({
    tenantId: z.string(),
    description: z.string(),
    candidates: z.array(z.string()).optional(),
    _meta: z.record(z.unknown()).optional(),
});
export async function handleClassify(raw) {
    const input = ClassifyInput.parse(raw);
    const code = input.candidates?.[0] ?? "85444200";
    const rec = lookupHs(code);
    return {
        content: [{
                type: "text",
                text: JSON.stringify({
                    suggestion: code,
                    confidence: 0.62,
                    record: rec,
                    requiresReview: true,
                }),
            }],
    };
}
export const DutyInput = z.object({
    tenantId: z.string(),
    hsCode: z.string().regex(/^\d{6,10}$/),
    cifValueMYR: z.number().nonnegative(),
    origin: z.string().length(2),
    scheme: z.enum(["MFN", "ATIGA", "ACFTA", "RCEP", "CPTPP", "MJEPA", "MCFTA"]).default("MFN"),
    _meta: z.record(z.unknown()).optional(),
});
export async function handleDuty(raw) {
    const input = DutyInput.parse(raw);
    const rec = lookupHs(input.hsCode);
    const duty = rec ? (rec.mfnDuty * input.cifValueMYR) / 100 : 0;
    const sst = rec ? (rec.salesTax * input.cifValueMYR) / 100 : 0;
    return {
        content: [{
                type: "text",
                text: JSON.stringify({
                    hsCode: input.hsCode,
                    scheme: input.scheme,
                    dutyMYR: duty,
                    salesTaxMYR: sst,
                    exciseMYR: rec?.excise ? (rec.excise * input.cifValueMYR) / 100 : 0,
                    source: rec?.source,
                    retrievedAt: rec?.retrievedAt,
                    indicative: true,
                }),
            }],
    };
}
//# sourceMappingURL=customs.js.map
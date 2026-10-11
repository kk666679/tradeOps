export const HS_RESOURCE_URI = "tradeops://hs/{code}";
export function lookupHs(code) {
    if (!/^\d{6,10}$/.test(code))
        return undefined;
    return {
        code,
        description: "Sample record",
        mfnDuty: 0,
        salesTax: 0,
        controlled: false,
        source: "hs-code-data.ts",
        retrievedAt: new Date().toISOString(),
    };
}
//# sourceMappingURL=hs.js.map
export declare const HS_RESOURCE_URI = "tradeops://hs/{code}";
export interface HsRecord {
    code: string;
    description: string;
    mfnDuty: number;
    salesTax: number;
    excise?: number;
    controlled: boolean;
    source: string;
    retrievedAt: string;
}
export declare function lookupHs(code: string): HsRecord | undefined;

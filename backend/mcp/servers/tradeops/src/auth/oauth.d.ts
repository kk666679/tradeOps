export interface PkcePair {
    verifier: string;
    challenge: string;
    method: "S256";
}
export declare function generatePkce(): PkcePair;
export declare function verifyPkce(verifier: string, challenge: string): boolean;
export declare function assertResourceIndicator(resource: string | undefined): void;
export declare function resolveClientMetadata(clientId: string): Promise<Record<string, unknown>>;

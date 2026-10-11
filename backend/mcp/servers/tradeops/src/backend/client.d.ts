export interface BackendRequest {
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    tenantId: string;
    actorId: string;
    body?: unknown;
    idempotencyKey?: string;
}
export declare function callBackend<T>(req: BackendRequest): Promise<T>;

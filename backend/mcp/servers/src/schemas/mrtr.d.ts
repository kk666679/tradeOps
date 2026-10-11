export type ResultType = "complete" | "input_required";
export type InputRequestKind = "elicitation" | "sampling" | "roots";
export interface InputRequest {
    kind: InputRequestKind;
    prompt: string;
    schema?: Record<string, unknown>;
    meta?: Record<string, unknown>;
}
export interface InputRequiredResult {
    resultType: "input_required";
    inputRequests: Record<string, InputRequest>;
    message?: string;
    mrtrToken?: string;
}
export interface CompleteResult<T> {
    resultType: "complete";
    data: T;
}
export type ToolResult<T> = CompleteResult<T> | InputRequiredResult;
export declare function inputRequired(requests: Record<string, InputRequest>, message?: string, mrtrToken?: string): InputRequiredResult;
export declare function complete<T>(data: T): CompleteResult<T>;
export declare function isInputRequired(r: unknown): r is InputRequiredResult;

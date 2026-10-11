// shared/schemas/mrtr.ts
// Multi Round-Trip Request (MRTR) contracts — MCP 2026-07-28.

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

export function inputRequired(
  requests: Record<string, InputRequest>,
  message?: string,
  mrtrToken?: string,
): InputRequiredResult {
  return { resultType: "input_required", inputRequests: requests, message, mrtrToken };
}

export function complete<T>(data: T): CompleteResult<T> {
  return { resultType: "complete", data };
}

export function isInputRequired(r: unknown): r is InputRequiredResult {
  return typeof r === "object" && r !== null && (r as { resultType?: string }).resultType === "input_required";
}

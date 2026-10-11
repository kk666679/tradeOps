// backend/mcp/servers/tradeops/src/middleware/sanitize.ts

export function sanitizeStrings<T>(value: T): T {
  if (typeof value === "string") return stripControl(value) as unknown as T;
  if (Array.isArray(value)) return value.map(sanitizeStrings) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[stripControl(k)] = sanitizeStrings(v);
    }
    return out as unknown as T;
  }
  return value;
}

function stripControl(s: string): string {
  // Strip C0/C1 control characters except \t \n \r
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "");
}

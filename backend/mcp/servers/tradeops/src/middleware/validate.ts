// backend/mcp/servers/tradeops/src/middleware/validate.ts

import type { z } from "zod";

export function validate<S extends z.ZodTypeAny>(schema: S, input: unknown): z.infer<S> {
  const r = schema.safeParse(input);
  if (!r.success) {
    throw new Error(`validation failed: ${r.error.issues.map((i) => i.path.join(".") + ": " + i.message).join("; ")}`);
  }
  return r.data;
}

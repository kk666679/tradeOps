/**
 * Middleware gate 4 - validate (zod input validation).
 *
 * Pure gate: parse the incoming params against the tool zod schema. On failure
 * return a structured validation error (never throw). On success return the
 * coerced params for the handler.
 */

import type { ZodTypeAny, z } from 'zod';

export interface ValidateResult<T> {
  ok: boolean;
  data?: T;
  code?: string;
  message?: string;
  details?: unknown;
}

export function validateCall<T>(schema: ZodTypeAny, params: unknown): ValidateResult<T> {
  const res = (schema as z.ZodType<T>).safeParse(params ?? {});
  if (res.success) return { ok: true, data: res.data };
  return {
    ok: false,
    code: 'validation_error',
    message: 'Request parameters failed validation',
    details: res.error.flatten(),
  };
}
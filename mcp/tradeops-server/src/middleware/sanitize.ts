/**
 * Parameter sanitization for audit records.
 *
 * Tool parameters may contain secrets (API keys, tokens, raw device keys).
 * Before an audit event is written to the ledger, parameters are deep-cloned
 * and sensitive keys redacted, so the ledger never stores a credential.
 */

const SENSITIVE_KEY =
  /(pass|password|secret|token|key|authorization|auth|credential|apikey|api_key|private)/i;

/** True when a key name looks like it holds a secret. */
export function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY.test(key);
}

/**
 * Deep-sanitize a params object: redact values whose key matches the sensitive
 * pattern, recurse into nested objects/arrays, and drop oversized strings so
 * the audit record stays bounded.
 */
export function sanitizeParams(
  params: unknown,
  maxStringLen = 256,
): Record<string, unknown> {
  return sanitizeValue(params, maxStringLen) as Record<string, unknown>;
}

function sanitizeValue(value: unknown, maxStringLen: number): unknown {
  if (value == null) return value;
  if (typeof value === 'string') {
    return value.length > maxStringLen ? `${value.slice(0, maxStringLen)}…[truncated]` : value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) {
    return value.slice(0, 100).map((v) => sanitizeValue(v, maxStringLen));
  }
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = isSensitiveKey(k) ? '[REDACTED]' : sanitizeValue(v, maxStringLen);
    }
    return out;
  }
  return String(value);
}

/** Byte length of a JSON-serialized value (for `output_size_bytes`). */
export function byteLength(value: unknown): number {
  try {
    return Buffer.byteLength(JSON.stringify(value) ?? '', 'utf8');
  } catch {
    return 0;
  }
}

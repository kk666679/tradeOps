/**
 * Canonical Trade OPS bonded-ledger event schema.
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR THE LEDGER EVENT ENVELOPE.
 * ============================================================================
 * Both Part A (the standalone MCP server) and Part B (the IoT webhook layer)
 * import this exact schema. A contract test asserts the two envelopes are
 * structurally identical. Do not fork this file.
 *
 * The envelope is a superset of the platform's existing `BondedLedgerEvent`
 * (see `components/fiz-fcz/workflow/data/ledger.ts`): every field the React
 * workflow already emits is preserved, plus the IoT fields the spec adds
 * (`deviceId`, `payload`) and the extra zone/duty enumerations.
 *
 * Every event is hash-chained: `prevHash` of event N equals `hash` of event
 * N-1, so the sequence is verifiable after the fact and tampering is
 * detectable via `verifyEventChain`.
 */

import { createHash } from 'node:crypto';
import { z } from 'zod';

/**
 * Canonical ledger event schema version. Bump on any breaking change to the
 * envelope. On startup the server compares this against the backend's reported
 * version and refuses to start if they differ (schema-drift guard).
 */
export const LEDGER_SCHEMA_VERSION = '1.0.0' as const;

/** Zones an event can belong to. */
export const LEDGER_ZONES = ['FIZ', 'FCZ', 'CONTROL', 'CROSS', 'IOT'] as const;
export const LedgerZoneSchema = z.enum(LEDGER_ZONES);
export type LedgerZone = z.infer<typeof LedgerZoneSchema>;

/**
 * Duty status carried by a bonded step. Union of the platform values
 * (`suspended | zero | excised | n_a`) and the spec's `paid`.
 */
export const DUTY_STATUSES = [
  'suspended',
  'zero',
  'excised',
  'paid',
  'n_a',
] as const;

export const DutyStatusSchema = z.enum(DUTY_STATUSES);
export type DutyStatus = z.infer<typeof DutyStatusSchema>;

/**
 * The full ledger event envelope.
 *
 * `hash` is intentionally excluded from the input used to compute it, so the
 * parse schema and the hash-computation input stay in lock-step.
 */
export const LedgerEventSchema = z
  .object({
    /** ULID — time-sortable, collision-resistant event id. */
    eventId: z.string().min(1),
    /** e.g. "fiz.raw.received" | "fcz.inbound.received" | "iot.rfid.observed" */
    eventType: z.string().min(1),
    zone: LedgerZoneSchema,
    /** Workflow step number (1..9) or label ("R"/"A"). Absent for IoT events. */
    step: z.union([z.number().int(), z.string()]).optional(),
    /** ISO 8601 UTC timestamp. */
    timestamp: z.string().datetime({ offset: true }),
    /** "user:<id>" | "system:<agent>" | "device:<deviceId>" */
    actor: z.string().min(1),
    /** Agent name if the action was agent-driven. */
    agent: z.string().optional(),
    /** Module overlay the event belongs to (preserved from platform schema). */
    module: z.string().optional(),
    /** Present for IoT events. */
    deviceId: z.string().optional(),
    /** Cross-references: PO, ASN, DECL, SSCC, LOT, etc. */
    refs: z.array(z.string()).default([]),
    hsCode: z.string().optional(),
    qty: z.number().optional(),
    uom: z.string().optional(),
    value: z.number().optional(),
    dutyStatus: DutyStatusSchema.optional(),
    /** SHA-256 of the canonical JSON of this event with `hash` omitted. */
    prevHash: z.string().min(1),
    hash: z.string().min(1),
    /** Normalized device payload or tool result. Never a raw device dump. */
    payload: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

export type LedgerEvent = z.infer<typeof LedgerEventSchema>;

/** The subset of an event that participates in hashing (everything but `hash`). */
export type LedgerEventHashInput = Omit<LedgerEvent, 'hash'>;

/**
 * Produce a deterministic SHA-256 hex digest over the canonical JSON of an
 * event. The canonical form fixes key order and coerces absent optionals to
 * `null` so the hash is stable regardless of insertion order.
 */
export function computeEventHash(event: LedgerEventHashInput): string {
  const canonical = JSON.stringify({
    eventId: event.eventId,
    eventType: event.eventType,
    zone: event.zone,
    step: event.step ?? null,
    timestamp: event.timestamp,
    actor: event.actor,
    agent: event.agent ?? null,
    module: event.module ?? null,
    deviceId: event.deviceId ?? null,
    refs: event.refs ?? [],
    hsCode: event.hsCode ?? null,
    qty: event.qty ?? null,
    uom: event.uom ?? null,
    value: event.value ?? null,
    dutyStatus: event.dutyStatus ?? null,
    prevHash: event.prevHash,
    payload: event.payload ?? null,
  });
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

/** Genesis prevHash — the anchor of every chain. */
export const GENESIS_HASH = '0'.repeat(64);

/**
 * Finalize an event by computing its `hash`. Throws if the resulting event
 * does not validate against the schema.
 */
export function sealEvent(event: LedgerEventHashInput): LedgerEvent {
  const hash = computeEventHash(event);
  // @ts-expect-error - spread operator with omitted field causes TypeScript strict error, but is valid at runtime
  const sealed: LedgerEvent = { ...event, hash };
  return LedgerEventSchema.parse(sealed);
}

/** Result of verifying a hash chain. */
export interface ChainVerification {
  valid: boolean;
  length: number;
  /** Index of the first broken link, or -1 when the whole chain verifies. */
  brokenAt: number;
  reason?: string;
}

/**
 * Verify a hash chain end-to-end.
 *
 * Checks, in order:
 *   1. Each event's recomputed hash equals its stored `hash`.
 *   2. Each event's `prevHash` equals the previous event's `hash`.
 *   3. The first event's `prevHash` equals GENESIS_HASH (when `anchor` is set).
 */
export function verifyEventChain(
  events: readonly LedgerEvent[],
  options: { anchor?: boolean } = {},
): ChainVerification {
  const anchor = options.anchor ?? true;
  if (events.length === 0) {
    return { valid: true, length: 0, brokenAt: -1 };
  }
  let expectedPrev = anchor ? GENESIS_HASH : events[0].prevHash;
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const recomputed = computeEventHash(ev);
    if (recomputed !== ev.hash) {
      return {
        valid: false,
        length: events.length,
        brokenAt: i,
        reason: `hash mismatch at index ${i} (${ev.eventId}): recomputed ${recomputed.slice(0, 12)}... != stored ${ev.hash.slice(0, 12)}...`,
      };
    }
    if (ev.prevHash !== expectedPrev) {
      return {
        valid: false,
        length: events.length,
        brokenAt: i,
        reason: `prevHash break at index ${i} (${ev.eventId}): expected ${expectedPrev.slice(0, 12)}... != ${ev.prevHash.slice(0, 12)}...`,
      };
    }
    expectedPrev = ev.hash;
  }
  return { valid: true, length: events.length, brokenAt: -1 };
}

/** Validate an unknown value as a ledger event. */
export function parseLedgerEvent(value: unknown): LedgerEvent {
  return LedgerEventSchema.parse(value);
}

/** Safe-parse a ledger event without throwing. */
export function safeParseLedgerEvent(
  value: unknown,
):
  | { success: true; data: LedgerEvent }
  | { success: false; error: z.ZodError } {
  const res = LedgerEventSchema.safeParse(value);
  if (res.success) return { success: true, data: res.data };
  return { success: false, error: res.error };
}

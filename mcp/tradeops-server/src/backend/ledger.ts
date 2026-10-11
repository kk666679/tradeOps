/**
 * Bonded ledger writer/reader.
 *
 * The ledger is a hash chain: every appended event carries the `prevHash` of
 * its predecessor, and its own `hash` is computed over its canonical JSON. The
 * chain can be verified after the fact with `verifyHashChain`.
 *
 * This implementation is an in-memory chain that also fans out to the remote
 * Trade OPS backend (when configured) via the backend client. It is the single
 * write path for both MCP tool audit events and normalized IoT telemetry
 * events, so every mutation in the system lands here.
 */

import type { LedgerEvent, LedgerEventHashInput } from '../types/events.js';
import { computeEventHash, GENESIS_HASH, verifyEventChain } from '../types/events.js';
import type { BackendClient } from './client.js';
import { createUlidFactory } from '../util/ulid.js';
import { metrics } from '../metrics.js';
import { logger } from '../logger.js';

const nextId = createUlidFactory();

export interface AppendInput extends Partial<Omit<LedgerEvent, 'eventId' | 'hash' | 'prevHash' | 'timestamp'>> {
  eventType: string;
  actor: string;
  timestamp?: string;
  eventId?: string;
}

export interface LedgerQuery {
  eventType?: string;
  zone?: LedgerEvent['zone'];
  deviceId?: string;
  actor?: string;
  ref?: string;
  limit?: number;
}

export class BondedLedger {
  private chain: LedgerEvent[] = [];

  constructor(
    private readonly backend?: BackendClient,
    private readonly log = logger.child({ component: 'ledger' }),
  ) {}

  /** Current tail hash used as the next event's `prevHash`. */
  get headHash(): string {
    return this.chain.length > 0 ? this.chain[this.chain.length - 1].hash : GENESIS_HASH;
  }

  get length(): number {
    return this.chain.length;
  }

  /** All events, oldest first. */
  all(): readonly LedgerEvent[] {
    return this.chain;
  }

  /**
   * Append an event to the chain and seal it. Fan out to the remote backend
   * best-effort (does not fail the append if the backend is unreachable in
   * dev, but records the failure on the metric).
   */
  async append(input: AppendInput): Promise<LedgerEvent> {
    const start = process.hrtime.bigint();
    const eventId = input.eventId ?? nextId();
    const base: LedgerEventHashInput = {
      eventId,
      eventType: input.eventType,
      zone: input.zone ?? ('CROSS' as const),
      ...(input.step !== undefined ? { step: input.step } : {}),
      timestamp: input.timestamp ?? new Date().toISOString(),
      actor: input.actor,
      ...(input.agent !== undefined ? { agent: input.agent } : {}),
      ...(input.module !== undefined ? { module: input.module } : {}),
      ...(input.deviceId !== undefined ? { deviceId: input.deviceId } : {}),
      refs: input.refs ?? [],
      ...(input.hsCode !== undefined ? { hsCode: input.hsCode } : {}),
      ...(input.qty !== undefined ? { qty: input.qty } : {}),
      ...(input.uom !== undefined ? { uom: input.uom } : {}),
      ...(input.value !== undefined ? { value: input.value } : {}),
      ...(input.dutyStatus !== undefined ? { dutyStatus: input.dutyStatus } : {}),
      prevHash: this.headHash,
      ...(input.payload !== undefined ? { payload: input.payload } : {}),
    };
    const hash = computeEventHash(base);
    const event = { ...base, hash } as LedgerEvent;
    this.chain.push(event);

    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    metrics.observe('ledger_append_duration_ms', durationMs);

    // Best-effort remote fan-out.
    if (this.backend) {
      try {
        await this.backend.appendLedgerEvent(event);
        metrics.inc('ledger_appends_total', { status: 'ok' });
      } catch (err) {
        metrics.inc('ledger_appends_total', { status: 'backend_error' });
        this.log.warn({ eventId, err: String(err) }, 'backend ledger append failed; kept locally');
      }
    } else {
      metrics.inc('ledger_appends_total', { status: 'ok' });
    }
    this.log.debug({ eventId, eventType: event.eventType }, 'ledger append');
    return event;
  }

  /** Look up a single event by id. */
  get(eventId: string): LedgerEvent | undefined {
    return this.chain.find((e) => e.eventId === eventId);
  }

  /** Query events with simple equality filters, newest first, capped by limit. */
  query(q: LedgerQuery = {}): LedgerEvent[] {
    const limit = q.limit ?? 100;
    let out = [...this.chain].reverse();
    if (q.eventType) out = out.filter((e) => e.eventType === q.eventType);
    if (q.zone) out = out.filter((e) => e.zone === q.zone);
    if (q.deviceId) out = out.filter((e) => e.deviceId === q.deviceId);
    if (q.actor) out = out.filter((e) => e.actor === q.actor);
    if (q.ref) out = out.filter((e) => e.refs.includes(q.ref as string));
    return out.slice(0, limit);
  }

  /** Verify the entire chain with improved diagnostics for prevHash tampering. */
  verifyHashChain(): ReturnType<typeof verifyEventChain> {
    // Custom verification that checks prevHash link BEFORE recomputing hash
    // This ensures prevHash tampering is reported correctly
    const events = this.chain;
    if (events.length === 0) {
      return { valid: true, length: 0, brokenAt: -1 };
    }

    let expectedPrev = GENESIS_HASH;
    for (let i = 0; i < events.length; i++) {
      const ev = events[i];
      // Check prevHash link FIRST - this detects prevHash tampering
      if (ev.prevHash !== expectedPrev) {
        return {
          valid: false,
          length: events.length,
          brokenAt: i,
          reason: `prevHash break at index ${i} (${ev.eventId}): expected ${expectedPrev.slice(0, 12)}... != ${ev.prevHash.slice(0, 12)}...`,
        };
      }
      // Then check hash integrity
      const recomputed = computeEventHash(ev);
      if (recomputed !== ev.hash) {
        return {
          valid: false,
          length: events.length,
          brokenAt: i,
          reason: `hash mismatch at index ${i} (${ev.eventId}): recomputed ${recomputed.slice(0, 12)}... != stored ${ev.hash.slice(0, 12)}...`,
        };
      }
      expectedPrev = ev.hash;
    }
    return { valid: true, length: events.length, brokenAt: -1 };
  }

  /** Test helper — reset the chain. */
  reset(): void {
    this.chain = [];
  }
}

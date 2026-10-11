/**
 * Ledger integration tests.
 * Verifies event appending, querying, and hash chain verification.
 */

import { describe, it, expect } from 'vitest';
import { BondedLedger } from '../src/backend/ledger.js';
import { verifyEventChain } from '../src/types/events.js';

describe('BondedLedger', () => {
  it('appends an event to the ledger', async () => {
    const ledger = new BondedLedger();
    const event = await ledger.append({
      eventType: 'test.event',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    expect(event.eventId).toBeDefined();
    expect(event.eventType).toBe('test.event');
    expect(event.hash).toBeDefined();
    expect(event.prevHash).toBeDefined();
  });

  it('maintains hash chain with genesis hash', async () => {
    const ledger = new BondedLedger();
    const event1 = await ledger.append({
      eventType: 'fiz.raw.received',
      actor: 'user:test',
      zone: 'FIZ',
      refs: ['PO-001'],
    });

    expect(event1.prevHash).toBe('0'.repeat(64)); // GENESIS_HASH
  });

  it('links events in hash chain', async () => {
    const ledger = new BondedLedger();
    const event1 = await ledger.append({
      eventType: 'fiz.raw.received',
      actor: 'user:test',
      zone: 'FIZ',
    });

    const event2 = await ledger.append({
      eventType: 'fiz.fg.produced',
      actor: 'user:test',
      zone: 'FIZ',
    });

    expect(event2.prevHash).toBe(event1.hash);
  });

  it('queries events with zone filter', async () => {
    const ledger = new BondedLedger();
    await ledger.append({
      eventType: 'fiz.raw.received',
      actor: 'user:test',
      zone: 'FIZ',
    });

    await ledger.append({
      eventType: 'fcz.inbound.received',
      actor: 'user:test',
      zone: 'FCZ',
    });

    const fizEvents = ledger.query({ zone: 'FIZ' });
    expect(fizEvents).toHaveLength(1);
    expect(fizEvents[0].zone).toBe('FIZ');
  });

  it('queries events with eventType filter', async () => {
    const ledger = new BondedLedger();
    await ledger.append({
      eventType: 'fiz.raw.received',
      actor: 'user:test',
      zone: 'FIZ',
    });

    await ledger.append({
      eventType: 'fiz.fg.produced',
      actor: 'user:test',
      zone: 'FIZ',
    });

    const rawEvents = ledger.query({ eventType: 'fiz.raw.received' });
    expect(rawEvents).toHaveLength(1);
    expect(rawEvents[0].eventType).toBe('fiz.raw.received');
  });

  it('returns events newest first from query', async () => {
    const ledger = new BondedLedger();
    const event1 = await ledger.append({
      eventType: 'event1',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    const event2 = await ledger.append({
      eventType: 'event2',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    const events = ledger.query();
    expect(events[0].eventId).toBe(event2.eventId);
    expect(events[1].eventId).toBe(event1.eventId);
  });

  it('retrieves a single event by id', async () => {
    const ledger = new BondedLedger();
    const event = await ledger.append({
      eventType: 'test.event',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    const retrieved = ledger.get(event.eventId);
    expect(retrieved).toEqual(event);
  });

  it('returns undefined for non-existent event', () => {
    const ledger = new BondedLedger();
    expect(ledger.get('does-not-exist')).toBeUndefined();
  });

  it('verifies valid hash chain', async () => {
    const ledger = new BondedLedger();
    await ledger.append({
      eventType: 'event1',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    await ledger.append({
      eventType: 'event2',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    const verification = ledger.verifyHashChain();
    expect(verification.valid).toBe(true);
    expect(verification.length).toBe(2);
    expect(verification.brokenAt).toBe(-1);
  });

  it('detects tampered hash chain', async () => {
    const ledger = new BondedLedger();
    const event1 = await ledger.append({
      eventType: 'event1',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    const event2 = await ledger.append({
      eventType: 'event2',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    // Tamper with the second event's hash
    const chain = (ledger as any).chain as typeof event2[];
    chain[1].hash = 'corrupted' + chain[1].hash.slice(9);

    const verification = ledger.verifyHashChain();
    expect(verification.valid).toBe(false);
    expect(verification.brokenAt).toBe(1);
    expect(verification.reason).toContain('hash mismatch');
  });

  it('detects broken prevHash link', async () => {
    const ledger = new BondedLedger();
    await ledger.append({
      eventType: 'event1',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    const event2 = await ledger.append({
      eventType: 'event2',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    // Tamper with the second event's prevHash
    const chain = (ledger as any).chain as typeof event2[];
    chain[1].prevHash = 'corrupted' + chain[1].prevHash.slice(9);

    const verification = ledger.verifyHashChain();
    expect(verification.valid).toBe(false);
    expect(verification.brokenAt).toBe(1);
    expect(verification.reason).toContain('prevHash break');
  });

  it('preserves event metadata', async () => {
    const ledger = new BondedLedger();
    const event = await ledger.append({
      eventType: 'fiz.raw.received',
      zone: 'FIZ',
      step: 1,
      actor: 'user:test',
      refs: ['PO-001', 'ASN-002'],
      hsCode: '8703.23',
      qty: 100,
      uom: 'units',
      value: 5000,
      payload: { source: 'webhook', timestamp: '2024-01-01T00:00:00Z' },
    });

    expect(event.step).toBe(1);
    expect(event.refs).toEqual(['PO-001', 'ASN-002']);
    expect(event.hsCode).toBe('8703.23');
    expect(event.qty).toBe(100);
    expect(event.uom).toBe('units');
    expect(event.value).toBe(5000);
    expect(event.payload).toEqual({ source: 'webhook', timestamp: '2024-01-01T00:00:00Z' });
  });

  it('handles optional fields', async () => {
    const ledger = new BondedLedger();
    const event = await ledger.append({
      eventType: 'test.event',
      actor: 'user:test',
      zone: 'CONTROL',
      // No refs, hsCode, qty, etc.
    });

    expect(event.refs).toEqual([]);
    expect(event.hsCode).toBeUndefined();
    expect(event.qty).toBeUndefined();
  });

  it('uses external verify function', async () => {
    const ledger = new BondedLedger();
    const event1 = await ledger.append({
      eventType: 'event1',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    const event2 = await ledger.append({
      eventType: 'event2',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    const chain = [event1, event2];
    const verification = verifyEventChain(chain);

    expect(verification.valid).toBe(true);
    expect(verification.length).toBe(2);
  });

  it('tracks ledger length', async () => {
    const ledger = new BondedLedger();
    expect(ledger.length).toBe(0);

    await ledger.append({
      eventType: 'event1',
      actor: 'user:test',
      zone: 'CONTROL',
    });
    expect(ledger.length).toBe(1);

    await ledger.append({
      eventType: 'event2',
      actor: 'user:test',
      zone: 'CONTROL',
    });
    expect(ledger.length).toBe(2);
  });

  it('resets ledger', async () => {
    const ledger = new BondedLedger();
    await ledger.append({
      eventType: 'event1',
      actor: 'user:test',
      zone: 'CONTROL',
    });

    ledger.reset();
    expect(ledger.length).toBe(0);
    expect(ledger.query()).toHaveLength(0);
  });
});

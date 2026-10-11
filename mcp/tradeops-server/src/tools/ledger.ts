/**
 * Ledger tools — 4 tools for ledger query and verification.
 */

import type { RequestContext } from '../middleware/context.js';
import type { BondedLedger } from '../backend/ledger.js';
import type { BackendClient } from '../backend/client.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'tools.ledger' });

interface ToolDeps {
  backend: BackendClient;
  ledger: BondedLedger;
}

function textResult(data: unknown): { type: 'text'; text: string }[] {
  return [{ type: 'text', text: JSON.stringify(data, null, 2) }];
}

export async function ledger_append_event(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  _approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    const { eventType, zone, actor, refs, payload } = args;
    log.info({ eventType, zone, actor, userId: ctx.identity.userId }, 'ledger_append_event');

    const event = await deps.ledger.append({
      eventType,
      zone,
      actor: actor || `user:${ctx.identity.userId}`,
      refs: refs || [],
      payload,
    });

    return textResult({ ok: true, eventId: event.eventId, hash: event.hash });
  } catch (err) {
    log.error({ err }, 'ledger_append_event failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function ledger_query_events(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  _approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    const { zone, eventType, limit } = args;
    log.info({ zone, eventType, limit, userId: ctx.identity.userId }, 'ledger_query_events');

    const events = deps.ledger.query({ zone, eventType, limit: limit || 10 });
    return textResult({ events, count: events.length });
  } catch (err) {
    log.error({ err }, 'ledger_query_events failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function ledger_get_event(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  _approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    const { eventId } = args;
    log.info({ eventId, userId: ctx.identity.userId }, 'ledger_get_event');

    const event = deps.ledger.get(eventId);
    if (!event) {
      return textResult({ error: 'Event not found' });
    }
    return textResult(event);
  } catch (err) {
    log.error({ err }, 'ledger_get_event failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function ledger_verify_hash_chain(
  _args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  _approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    log.info({ userId: ctx.identity.userId }, 'ledger_verify_hash_chain');

    const result = deps.ledger.verifyHashChain();
    return textResult(result);
  } catch (err) {
    log.error({ err }, 'ledger_verify_hash_chain failed');
    return textResult({ error: (err as Error).message });
  }
}

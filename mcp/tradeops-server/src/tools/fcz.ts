/**
 * FCZ tools — 6 tools for Foreign Commerce Zone operations.
 */

import type { RequestContext } from '../middleware/context.js';
import type { BondedLedger } from '../backend/ledger.js';
import type { BackendClient } from '../backend/client.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'tools.fcz' });

interface ToolDeps {
  backend: BackendClient;
  ledger: BondedLedger;
}

function textResult(data: unknown): { type: 'text'; text: string }[] {
  return [{ type: 'text', text: JSON.stringify(data, null, 2) }];
}

export async function fcz_inbound_receive(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    if (!approvalToken) {
      return textResult({ error: 'approvalToken required for this operation' });
    }
    const { refs, hsCode, qty, uom, value } = args;
    log.info({ refs, hsCode, qty, uom, value, userId: ctx.identity.userId }, 'fcz_inbound_receive');

    const event = await deps.ledger.append({
      eventType: 'fcz.inbound.received',
      zone: 'FCZ',
      actor: `user:${ctx.identity.userId}`,
      refs,
      hsCode,
      qty,
      uom,
      value,
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Inbound receipt recorded' });
  } catch (err) {
    log.error({ err }, 'fcz_inbound_receive failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function fcz_transhipment_complete(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    if (!approvalToken) {
      return textResult({ error: 'approvalToken required for this operation' });
    }
    const { refs } = args;
    log.info({ refs, userId: ctx.identity.userId }, 'fcz_transhipment_complete');

    const event = await deps.ledger.append({
      eventType: 'fcz.transhipment.completed',
      zone: 'FCZ',
      actor: `user:${ctx.identity.userId}`,
      refs,
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Transhipment completed' });
  } catch (err) {
    log.error({ err }, 'fcz_transhipment_complete failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function fcz_breakbulk_split(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    if (!approvalToken) {
      return textResult({ error: 'approvalToken required for this operation' });
    }
    const { refs, splitInto } = args;
    log.info({ refs, splitInto, userId: ctx.identity.userId }, 'fcz_breakbulk_split');

    const event = await deps.ledger.append({
      eventType: 'fcz.breakbulk.split',
      zone: 'FCZ',
      actor: `user:${ctx.identity.userId}`,
      refs: [...refs, ...splitInto],
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Breakbulk split completed' });
  } catch (err) {
    log.error({ err }, 'fcz_breakbulk_split failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function fcz_repack_value_add(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    if (!approvalToken) {
      return textResult({ error: 'approvalToken required for this operation' });
    }
    const { refs, description } = args;
    log.info({ refs, description, userId: ctx.identity.userId }, 'fcz_repack_value_add');

    const event = await deps.ledger.append({
      eventType: 'fcz.repack.value_added',
      zone: 'FCZ',
      actor: `user:${ctx.identity.userId}`,
      refs,
      payload: { description },
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Value added to repack' });
  } catch (err) {
    log.error({ err }, 'fcz_repack_value_add failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function fcz_reexport_confirm(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    if (!approvalToken) {
      return textResult({ error: 'approvalToken required for this operation' });
    }
    const { refs, declId } = args;
    log.info({ refs, declId, userId: ctx.identity.userId }, 'fcz_reexport_confirm');

    const event = await deps.ledger.append({
      eventType: 'fcz.reexport.confirmed',
      zone: 'FCZ',
      actor: `user:${ctx.identity.userId}`,
      refs: [...refs, declId],
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Re-export confirmed' });
  } catch (err) {
    log.error({ err }, 'fcz_reexport_confirm failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function fcz_entrepot_match(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    if (!approvalToken) {
      return textResult({ error: 'approvalToken required for this operation' });
    }
    const { refs, matchedRefs } = args;
    log.info({ refs, matchedRefs, userId: ctx.identity.userId }, 'fcz_entrepot_match');

    const event = await deps.ledger.append({
      eventType: 'fcz.entrepot.matched',
      zone: 'FCZ',
      actor: `user:${ctx.identity.userId}`,
      refs: [...refs, ...matchedRefs],
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Entrepot matched' });
  } catch (err) {
    log.error({ err }, 'fcz_entrepot_match failed');
    return textResult({ error: (err as Error).message });
  }
}

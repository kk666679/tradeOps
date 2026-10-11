/**
 * FIZ tools — 6 tools for Free Industrial Zone operations.
 */

import type { RequestContext } from '../middleware/context.js';
import type { BondedLedger } from '../backend/ledger.js';
import type { BackendClient } from '../backend/client.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'tools.fiz' });

interface ToolDeps {
  backend: BackendClient;
  ledger: BondedLedger;
}

function textResult(data: unknown): { type: 'text'; text: string }[] {
  return [{ type: 'text', text: JSON.stringify(data, null, 2) }];
}

export async function fiz_raw_intake(
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
    log.info({ refs, hsCode, qty, uom, value, userId: ctx.identity.userId }, 'fiz_raw_intake');

    // Emit ledger event
    const event = await deps.ledger.append({
      eventType: 'fiz.raw.received',
      zone: 'FIZ',
      actor: `user:${ctx.identity.userId}`,
      refs,
      hsCode,
      qty,
      uom,
      value,
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Raw intake recorded' });
  } catch (err) {
    log.error({ err }, 'fiz_raw_intake failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function fiz_machinery_approve(
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
    log.info({ refs, userId: ctx.identity.userId }, 'fiz_machinery_approve');

    const event = await deps.ledger.append({
      eventType: 'fiz.machinery.approved',
      zone: 'FIZ',
      actor: `user:${ctx.identity.userId}`,
      refs,
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Machinery approved' });
  } catch (err) {
    log.error({ err }, 'fiz_machinery_approve failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function fiz_production_consume(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    if (!approvalToken) {
      return textResult({ error: 'approvalToken required for this operation' });
    }
    const { refs, qty, uom } = args;
    log.info({ refs, qty, uom, userId: ctx.identity.userId }, 'fiz_production_consume');

    const event = await deps.ledger.append({
      eventType: 'fiz.production.consumed',
      zone: 'FIZ',
      actor: `user:${ctx.identity.userId}`,
      refs,
      qty,
      uom,
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Production consumption recorded' });
  } catch (err) {
    log.error({ err }, 'fiz_production_consume failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function fiz_scrap_excise(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    if (!approvalToken) {
      return textResult({ error: 'approvalToken required for this operation' });
    }
    const { refs, qty, uom, dutyStatus } = args;
    log.info({ refs, qty, uom, dutyStatus, userId: ctx.identity.userId }, 'fiz_scrap_excise');

    const event = await deps.ledger.append({
      eventType: 'fiz.scrap.excised',
      zone: 'FIZ',
      actor: `user:${ctx.identity.userId}`,
      refs,
      qty,
      uom,
      dutyStatus: dutyStatus || 'excised',
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Scrap excised' });
  } catch (err) {
    log.error({ err }, 'fiz_scrap_excise failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function fiz_fg_produce(
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
    log.info({ refs, hsCode, qty, uom, value, userId: ctx.identity.userId }, 'fiz_fg_produce');

    const event = await deps.ledger.append({
      eventType: 'fiz.fg.produced',
      zone: 'FIZ',
      actor: `user:${ctx.identity.userId}`,
      refs,
      hsCode,
      qty,
      uom,
      value,
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Finished goods produced' });
  } catch (err) {
    log.error({ err }, 'fiz_fg_produce failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function fiz_export_confirm(
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
    log.info({ refs, declId, userId: ctx.identity.userId }, 'fiz_export_confirm');

    const event = await deps.ledger.append({
      eventType: 'fiz.export.confirmed',
      zone: 'FIZ',
      actor: `user:${ctx.identity.userId}`,
      refs: [...refs, declId],
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Export confirmed' });
  } catch (err) {
    log.error({ err }, 'fiz_export_confirm failed');
    return textResult({ error: (err as Error).message });
  }
}

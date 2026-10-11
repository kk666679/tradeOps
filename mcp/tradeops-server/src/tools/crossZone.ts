/**
 * Cross-zone tools — 3 tools for cross-zone operations and audit.
 */

import type { RequestContext } from '../middleware/context.js';
import type { BondedLedger } from '../backend/ledger.js';
import type { BackendClient } from '../backend/client.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'tools.crossZone' });

interface ToolDeps {
  backend: BackendClient;
  ledger: BondedLedger;
}

function textResult(data: unknown): { type: 'text'; text: string }[] {
  return [{ type: 'text', text: JSON.stringify(data, null, 2) }];
}

export async function zone_transfer_fiz_fcz(
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
    log.info({ refs, qty, uom, userId: ctx.identity.userId }, 'zone_transfer_fiz_fcz');

    const event = await deps.ledger.append({
      eventType: 'zone.transfer.fiz_fcz',
      zone: 'CROSS',
      actor: `user:${ctx.identity.userId}`,
      refs,
      qty,
      uom,
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Zone transfer completed' });
  } catch (err) {
    log.error({ err }, 'zone_transfer_fiz_fcz failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function ledger_duty_reconcile(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    if (!approvalToken) {
      return textResult({ error: 'approvalToken required for this operation' });
    }
    const { refs, period } = args;
    log.info({ refs, period, userId: ctx.identity.userId }, 'ledger_duty_reconcile');

    const event = await deps.ledger.append({
      eventType: 'ledger.duty.reconciled',
      zone: 'CROSS',
      actor: `user:${ctx.identity.userId}`,
      refs,
      payload: { period },
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Duty reconciliation completed' });
  } catch (err) {
    log.error({ err }, 'ledger_duty_reconcile failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function audit_period_close(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    if (!approvalToken) {
      return textResult({ error: 'approvalToken required for this operation' });
    }
    const { period } = args;
    log.info({ period, userId: ctx.identity.userId }, 'audit_period_close');

    const event = await deps.ledger.append({
      eventType: 'audit.period.closed',
      zone: 'CROSS',
      actor: `user:${ctx.identity.userId}`,
      payload: { period },
    });

    return textResult({ ok: true, eventId: event.eventId, message: 'Audit period closed' });
  } catch (err) {
    log.error({ err }, 'audit_period_close failed');
    return textResult({ error: (err as Error).message });
  }
}

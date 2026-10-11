/**
 * Customs tools — 7 tools for customs declarations, HS classification, and tariff queries.
 */

import type { RequestContext } from '../middleware/context.js';
import type { BondedLedger } from '../backend/ledger.js';
import type { BackendClient } from '../backend/client.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'tools.customs' });

interface ToolDeps {
  backend: BackendClient;
  ledger: BondedLedger;
}

function textResult(data: unknown): { type: 'text'; text: string }[] {
  return [{ type: 'text', text: JSON.stringify(data, null, 2) }];
}

export async function customs_get_declaration_status(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  _approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    const { declId } = args;
    log.info({ declId, userId: ctx.identity.userId }, 'get_declaration_status');
    const result = await deps.backend.getDeclarationStatus(declId);
    return textResult(result);
  } catch (err) {
    log.error({ err }, 'get_declaration_status failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function customs_query_declaration_list(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  _approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    const { status, limit } = args;
    log.info({ status, limit, userId: ctx.identity.userId }, 'query_declaration_list');
    const result = await deps.backend.queryDeclarationList({ status, limit });
    return textResult(result);
  } catch (err) {
    log.error({ err }, 'query_declaration_list failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function customs_create_draft_declaration(
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
    log.info({ refs, hsCode, qty, uom, value, userId: ctx.identity.userId }, 'create_draft_declaration');
    const result = await deps.backend.createDraftDeclaration({ refs, hsCode, qty, uom, value });

    // Emit ledger event
    deps.ledger.append({
      eventType: 'customs.declaration.drafted',
      zone: 'CROSS',
      actor: `user:${ctx.identity.userId}`,
      refs,
      hsCode,
      qty,
      uom,
      value,
    });

    return textResult(result);
  } catch (err) {
    log.error({ err }, 'create_draft_declaration failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function customs_validate_entry(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    if (!approvalToken) {
      return textResult({ error: 'approvalToken required for this operation' });
    }
    const { declId } = args;
    log.info({ declId, userId: ctx.identity.userId }, 'validate_entry');
    const result = await deps.backend.validateEntry(declId);

    // Emit ledger event
    deps.ledger.append({
      eventType: 'customs.entry.validated',
      zone: 'CROSS',
      actor: `user:${ctx.identity.userId}`,
      refs: [declId],
    });

    return textResult(result);
  } catch (err) {
    log.error({ err }, 'validate_entry failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function hs_classify_product(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  _approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    const { description, countryOfOrigin } = args;
    log.info({ description, countryOfOrigin, userId: ctx.identity.userId }, 'classify_product');
    const result = await deps.backend.classifyProduct({ description, countryOfOrigin });
    return textResult(result);
  } catch (err) {
    log.error({ err }, 'classify_product failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function hs_validate_code(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  _approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    const { hsCode } = args;
    log.info({ hsCode, userId: ctx.identity.userId }, 'validate_code');
    const result = await deps.backend.validateHsCode(hsCode);
    return textResult(result);
  } catch (err) {
    log.error({ err }, 'validate_code failed');
    return textResult({ error: (err as Error).message });
  }
}

export async function customs_query_tariff(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  _approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    const { hsCode, countryOfOrigin } = args;
    log.info({ hsCode, countryOfOrigin, userId: ctx.identity.userId }, 'query_tariff');
    const result = await deps.backend.queryTariff({ hsCode, countryOfOrigin });
    return textResult(result);
  } catch (err) {
    log.error({ err }, 'query_tariff failed');
    return textResult({ error: (err as Error).message });
  }
}

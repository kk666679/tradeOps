/**
 * Agent tools — 1 tool for workflow orchestration.
 */

import type { RequestContext } from '../middleware/context.js';
import type { BondedLedger } from '../backend/ledger.js';
import type { BackendClient } from '../backend/client.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'tools.agents' });

interface ToolDeps {
  backend: BackendClient;
  ledger: BondedLedger;
}

function textResult(data: unknown): { type: 'text'; text: string }[] {
  return [{ type: 'text', text: JSON.stringify(data, null, 2) }];
}

export async function orchestrate_workflow(
  args: any,
  ctx: RequestContext,
  deps: ToolDeps,
  _approvalToken?: string,
): Promise<{ type: 'text'; text: string }[]> {
  try {
    const { workflowId, params } = args;
    log.info({ workflowId, userId: ctx.identity.userId }, 'orchestrate_workflow');

    // Emit ledger event
    const event = await deps.ledger.append({
      eventType: 'audit.workflow.orchestrated',
      zone: 'CROSS',
      actor: `user:${ctx.identity.userId}`,
      agent: 'orchestrator',
      payload: { workflowId, params },
    });

    return textResult({
      ok: true,
      workflowId,
      status: 'submitted',
      eventId: event.eventId,
      message: 'Workflow orchestration initiated',
    });
  } catch (err) {
    log.error({ err }, 'orchestrate_workflow failed');
    return textResult({ error: (err as Error).message });
  }
}

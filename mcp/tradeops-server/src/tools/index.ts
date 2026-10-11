/**
 * Tool registration aggregator — registers all 27 tools with the MCP server.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { BondedLedger } from '../backend/ledger.js';
import type { BackendClient } from '../backend/client.js';
import type { RequestContext } from '../middleware/context.js';
import { logger } from '../logger.js';
import { setToolTier } from '../auth/rbac.js';

// Customs tools
import * as customs from './customs.js';

// FIZ tools
import * as fiz from './fiz.js';

// FCZ tools
import * as fcz from './fcz.js';

// Cross-zone tools
import * as crossZone from './crossZone.js';

// Ledger tools
import * as ledgerTools from './ledger.js';

// Agent tools
import * as agents from './agents.js';

const log = logger.child({ component: 'tools' });

const ApprovalTokenSchema = z.string().min(1);

type ToolHandler = (args: unknown, ctx: RequestContext, deps: ToolDeps, approvalToken?: string) => Promise<{ type: 'text'; text: string }[]>;

interface ToolDeps {
  backend: BackendClient;
  ledger: BondedLedger;
}

interface ToolDefinition {
  name: string;
  description: string;
  schema: Record<string, z.ZodTypeAny>;
  handler: ToolHandler;
  requiresApprovalToken?: boolean;
}

const tools: ToolDefinition[] = [
  // Customs tools (7)
  {
    name: 'customs_get_declaration_status',
    description: 'Get customs declaration status',
    schema: { declId: z.string().min(1) },
    handler: customs.customs_get_declaration_status,
  },
  {
    name: 'customs_query_declaration_list',
    description: 'Query customs declarations',
    schema: { status: z.string().optional(), limit: z.number().optional() },
    handler: customs.customs_query_declaration_list,
  },
  {
    name: 'customs_create_draft_declaration',
    description: 'Create draft customs declaration',
    schema: {
      refs: z.array(z.string()),
      hsCode: z.string(),
      qty: z.number(),
      uom: z.string(),
      value: z.number(),
      approvalToken: ApprovalTokenSchema,
    },
    handler: customs.customs_create_draft_declaration,
    requiresApprovalToken: true,
  },
  {
    name: 'customs_validate_entry',
    description: 'Validate customs entry',
    schema: { declId: z.string().min(1), approvalToken: ApprovalTokenSchema },
    handler: customs.customs_validate_entry,
    requiresApprovalToken: true,
  },
  {
    name: 'hs_classify_product',
    description: 'Classify product by HS code',
    schema: { description: z.string().min(1), countryOfOrigin: z.string().optional() },
    handler: customs.hs_classify_product,
  },
  {
    name: 'hs_validate_code',
    description: 'Validate HS code',
    schema: { hsCode: z.string().min(1) },
    handler: customs.hs_validate_code,
  },
  {
    name: 'customs_query_tariff',
    description: 'Query tariff by HS code',
    schema: { hsCode: z.string().min(1), countryOfOrigin: z.string().optional() },
    handler: customs.customs_query_tariff,
  },

  // FIZ tools (6)
  {
    name: 'fiz_raw_intake',
    description: 'Record FIZ raw materials intake',
    schema: {
      refs: z.array(z.string()),
      hsCode: z.string(),
      qty: z.number(),
      uom: z.string(),
      value: z.number(),
      approvalToken: ApprovalTokenSchema,
    },
    handler: fiz.fiz_raw_intake,
    requiresApprovalToken: true,
  },
  {
    name: 'fiz_machinery_approve',
    description: 'Approve FIZ machinery',
    schema: { refs: z.array(z.string()), approvalToken: ApprovalTokenSchema },
    handler: fiz.fiz_machinery_approve,
    requiresApprovalToken: true,
  },
  {
    name: 'fiz_production_consume',
    description: 'Record FIZ production consumption',
    schema: { refs: z.array(z.string()), qty: z.number(), uom: z.string(), approvalToken: ApprovalTokenSchema },
    handler: fiz.fiz_production_consume,
    requiresApprovalToken: true,
  },
  {
    name: 'fiz_scrap_excise',
    description: 'Record FIZ scrap excise',
    schema: {
      refs: z.array(z.string()),
      qty: z.number(),
      uom: z.string(),
      dutyStatus: z.string(),
      approvalToken: ApprovalTokenSchema,
    },
    handler: fiz.fiz_scrap_excise,
    requiresApprovalToken: true,
  },
  {
    name: 'fiz_fg_produce',
    description: 'Record FIZ finished goods production',
    schema: {
      refs: z.array(z.string()),
      hsCode: z.string(),
      qty: z.number(),
      uom: z.string(),
      value: z.number(),
      approvalToken: ApprovalTokenSchema,
    },
    handler: fiz.fiz_fg_produce,
    requiresApprovalToken: true,
  },
  {
    name: 'fiz_export_confirm',
    description: 'Confirm FIZ export',
    schema: { refs: z.array(z.string()), declId: z.string(), approvalToken: ApprovalTokenSchema },
    handler: fiz.fiz_export_confirm,
    requiresApprovalToken: true,
  },

  // FCZ tools (6)
  {
    name: 'fcz_inbound_receive',
    description: 'Record FCZ inbound receipt',
    schema: {
      refs: z.array(z.string()),
      hsCode: z.string().optional(),
      qty: z.number(),
      uom: z.string(),
      value: z.number(),
      approvalToken: ApprovalTokenSchema,
    },
    handler: fcz.fcz_inbound_receive,
    requiresApprovalToken: true,
  },
  {
    name: 'fcz_transhipment_complete',
    description: 'Complete FCZ transhipment',
    schema: { refs: z.array(z.string()), approvalToken: ApprovalTokenSchema },
    handler: fcz.fcz_transhipment_complete,
    requiresApprovalToken: true,
  },
  {
    name: 'fcz_breakbulk_split',
    description: 'Split FCZ breakbulk',
    schema: { refs: z.array(z.string()), splitInto: z.array(z.string()), approvalToken: ApprovalTokenSchema },
    handler: fcz.fcz_breakbulk_split,
    requiresApprovalToken: true,
  },
  {
    name: 'fcz_repack_value_add',
    description: 'Add value to FCZ repack',
    schema: { refs: z.array(z.string()), description: z.string(), approvalToken: ApprovalTokenSchema },
    handler: fcz.fcz_repack_value_add,
    requiresApprovalToken: true,
  },
  {
    name: 'fcz_reexport_confirm',
    description: 'Confirm FCZ re-export',
    schema: { refs: z.array(z.string()), declId: z.string(), approvalToken: ApprovalTokenSchema },
    handler: fcz.fcz_reexport_confirm,
    requiresApprovalToken: true,
  },
  {
    name: 'fcz_entrepot_match',
    description: 'Match FCZ entrepot transfers',
    schema: { refs: z.array(z.string()), matchedRefs: z.array(z.string()), approvalToken: ApprovalTokenSchema },
    handler: fcz.fcz_entrepot_match,
    requiresApprovalToken: true,
  },

  // Cross-zone tools (3)
  {
    name: 'zone_transfer_fiz_fcz',
    description: 'Transfer goods between FIZ and FCZ',
    schema: { refs: z.array(z.string()), qty: z.number(), uom: z.string(), approvalToken: ApprovalTokenSchema },
    handler: crossZone.zone_transfer_fiz_fcz,
    requiresApprovalToken: true,
  },
  {
    name: 'ledger_duty_reconcile',
    description: 'Reconcile ledger duties',
    schema: { refs: z.array(z.string()), period: z.string(), approvalToken: ApprovalTokenSchema },
    handler: crossZone.ledger_duty_reconcile,
    requiresApprovalToken: true,
  },
  {
    name: 'audit_period_close',
    description: 'Close audit period',
    schema: { period: z.string(), approvalToken: ApprovalTokenSchema },
    handler: crossZone.audit_period_close,
    requiresApprovalToken: true,
  },

  // Ledger tools (4)
  {
    name: 'ledger_append_event',
    description: 'Append event to ledger',
    schema: {
      eventType: z.string().min(1),
      zone: z.string().min(1),
      actor: z.string().min(1),
      refs: z.array(z.string()).optional(),
      payload: z.record(z.string(), z.unknown()).optional(),
    },
    handler: ledgerTools.ledger_append_event,
  },
  {
    name: 'ledger_query_events',
    description: 'Query ledger events',
    schema: { zone: z.string().optional(), eventType: z.string().optional(), limit: z.number().optional() },
    handler: ledgerTools.ledger_query_events,
  },
  {
    name: 'ledger_get_event',
    description: 'Get single ledger event',
    schema: { eventId: z.string().min(1) },
    handler: ledgerTools.ledger_get_event,
  },
  {
    name: 'ledger_verify_hash_chain',
    description: 'Verify ledger hash chain integrity',
    schema: {},
    handler: ledgerTools.ledger_verify_hash_chain,
  },

  // Agent tools (1)
  {
    name: 'orchestrate_workflow',
    description: 'Orchestrate workflow execution',
    schema: { workflowId: z.string().min(1), params: z.record(z.string(), z.unknown()).optional() },
    handler: agents.orchestrate_workflow,
  },
];

export function registerAllTools(
  server: McpServer,
  deps: { ledger: BondedLedger; backend: BackendClient },
): void {
  // Register tool tiers for RBAC
  // Read tools: customs/HS read + ledger query tools
  const readTools = [
    'customs_get_declaration_status',
    'customs_query_declaration_list',
    'hs_classify_product',
    'hs_validate_code',
    'customs_query_tariff',
    'ledger_append_event',
    'ledger_query_events',
    'ledger_get_event',
    'ledger_verify_hash_chain',
  ];
  for (const name of readTools) {
    setToolTier(name, 'read');
  }

  // Write tools: FIZ, FCZ, cross-zone operations
  const writeTools = [
    'customs_create_draft_declaration',
    'customs_validate_entry',
    'fiz_raw_intake',
    'fiz_machinery_approve',
    'fiz_production_consume',
    'fiz_scrap_excise',
    'fiz_fg_produce',
    'fiz_export_confirm',
    'fcz_inbound_receive',
    'fcz_transhipment_complete',
    'fcz_breakbulk_split',
    'fcz_repack_value_add',
    'fcz_reexport_confirm',
    'fcz_entrepot_match',
    'zone_transfer_fiz_fcz',
    'ledger_duty_reconcile',
    'audit_period_close',
  ];
  for (const name of writeTools) {
    setToolTier(name, 'write');
  }

  // Agent tool
  setToolTier('orchestrate_workflow', 'agent');

  for (const toolDef of tools) {
    server.tool(
      toolDef.name,
      toolDef.description,
      toolDef.schema as any,
      async (args: any) => {
        // Create a mock RequestContext (in a real implementation, this would come from middleware)
        const ctx: RequestContext = {
          requestId: `req_${Date.now()}`,
          identity: { userId: 'system', tenantId: 'default', role: 'admin', method: 'anonymous' },
          role: 'admin' as any,
          tenantId: 'default',
          startedAt: Date.now(),
        };

        const approvalToken = args.approvalToken as string | undefined;
        const content = await toolDef.handler(args, ctx, { backend: deps.backend, ledger: deps.ledger }, approvalToken);
        return { content };
      },
    );
  }

  log.info({ toolCount: tools.length }, 'registered all tools');
}

export const TOOL_DEFINITIONS = tools;
export const TOOL_COUNT = tools.length;

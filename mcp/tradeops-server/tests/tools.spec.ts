/**
 * Tools registration test.
 * Verifies all 27 tools are registered with correct metadata.
 */

import { describe, it, expect } from 'vitest';
import { TOOL_DEFINITIONS, TOOL_COUNT } from '../src/tools/index.js';

describe('Tool Registration', () => {
  it('registers exactly 27 tools', () => {
    expect(TOOL_COUNT).toBe(27);
    expect(TOOL_DEFINITIONS).toHaveLength(27);
  });

  it('includes all customs tools', () => {
    const customsTools = [
      'customs_get_declaration_status',
      'customs_query_declaration_list',
      'customs_create_draft_declaration',
      'customs_validate_entry',
      'hs_classify_product',
      'hs_validate_code',
      'customs_query_tariff',
    ];
    for (const name of customsTools) {
      expect(TOOL_DEFINITIONS.map((t) => t.name)).toContain(name);
    }
  });

  it('includes all FIZ tools', () => {
    const fizTools = [
      'fiz_raw_intake',
      'fiz_machinery_approve',
      'fiz_production_consume',
      'fiz_scrap_excise',
      'fiz_fg_produce',
      'fiz_export_confirm',
    ];
    for (const name of fizTools) {
      expect(TOOL_DEFINITIONS.map((t) => t.name)).toContain(name);
    }
  });

  it('includes all FCZ tools', () => {
    const fczTools = [
      'fcz_inbound_receive',
      'fcz_transhipment_complete',
      'fcz_breakbulk_split',
      'fcz_repack_value_add',
      'fcz_reexport_confirm',
      'fcz_entrepot_match',
    ];
    for (const name of fczTools) {
      expect(TOOL_DEFINITIONS.map((t) => t.name)).toContain(name);
    }
  });

  it('includes all cross-zone tools', () => {
    const crossZoneTools = ['zone_transfer_fiz_fcz', 'ledger_duty_reconcile', 'audit_period_close'];
    for (const name of crossZoneTools) {
      expect(TOOL_DEFINITIONS.map((t) => t.name)).toContain(name);
    }
  });

  it('includes all ledger tools', () => {
    const ledgerTools = [
      'ledger_append_event',
      'ledger_query_events',
      'ledger_get_event',
      'ledger_verify_hash_chain',
    ];
    for (const name of ledgerTools) {
      expect(TOOL_DEFINITIONS.map((t) => t.name)).toContain(name);
    }
  });

  it('includes agent tools', () => {
    expect(TOOL_DEFINITIONS.map((t) => t.name)).toContain('orchestrate_workflow');
  });

  it('marks write tools as requiring approval tokens', () => {
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
      const tool = TOOL_DEFINITIONS.find((t) => t.name === name);
      expect(tool).toBeDefined();
      expect(tool?.requiresApprovalToken).toBe(true);
    }
  });

  it('does not mark read tools as requiring approval', () => {
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
      'orchestrate_workflow',
    ];

    for (const name of readTools) {
      const tool = TOOL_DEFINITIONS.find((t) => t.name === name);
      expect(tool).toBeDefined();
      expect(tool?.requiresApprovalToken).not.toBe(true);
    }
  });

  it('has descriptions for all tools', () => {
    for (const tool of TOOL_DEFINITIONS) {
      expect(tool.description).toBeDefined();
      expect(tool.description.length).toBeGreaterThan(0);
    }
  });

  it('has schemas for all tools', () => {
    for (const tool of TOOL_DEFINITIONS) {
      expect(tool.schema).toBeDefined();
      expect(typeof tool.schema).toBe('object');
    }
  });
});

import type { Declaration, GraphNode, Mode, NodeDef, Provenance } from './types';
import { HS_BY_CODE } from './hs-catalog';
import { byType } from './node-definitions';

const CAPABILITIES: Record<Mode, string[]> = {
  development: ['submit_declaration','retrieve_declaration_status','record_acknowledgment','record_failure'],
  manual: ['record_external_response','record_acknowledgment','record_failure','record_release_evidence'],
  production: [],
};

const VERIFIED_PRODUCTION_CAPS = ['submit_declaration','retrieve_declaration_status'];

export const ALL_CAPABILITIES = [
  'submit_declaration','retrieve_declaration_status','submit_manifest','retrieve_manifest_status',
  'record_external_response','record_acknowledgment','record_failure','record_release_evidence',
];

export const CAP_LABEL: Record<string, string> = {
  submit_declaration: 'Submit declaration',
  retrieve_declaration_status: 'Retrieve declaration status',
  submit_manifest: 'Submit manifest',
  retrieve_manifest_status: 'Retrieve manifest status',
  record_external_response: 'Record external response',
  record_acknowledgment: 'Record acknowledgment',
  record_failure: 'Record integration failure',
  record_release_evidence: 'Record verified release',
};

export function getSupportedOperations(
  mode: Mode,
  prodEnabled: boolean,
  transport: boolean,
): string[] {
  if (mode === 'production') return (prodEnabled && transport) ? VERIFIED_PRODUCTION_CAPS : [];
  return CAPABILITIES[mode] || [];
}

const DECLARATION_TRANSITIONS: Record<string, string[]> = {
  draft:                            ['ready_for_review','validation_failed','cancelled'],
  validation_failed:                ['draft','cancelled'],
  ready_for_review:                 ['pending_approval','cancelled'],
  pending_approval:                 ['approved_for_submission','ready_for_review','cancelled'],
  approved_for_submission:          ['submission_pending','cancelled'],
  submission_pending:               ['submitted_unconfirmed','integration_error','integration_required'],
  submitted_unconfirmed:            ['acknowledged','rejected','integration_error'],
  acknowledged:                     ['accepted','rejected','additional_information_required','inspection_required'],
  additional_information_required:  ['submitted_unconfirmed','rejected','cancelled'],
  inspection_required:              ['accepted','rejected','released'],
  accepted:                         ['released','cancelled'],
  released:                         [],
  rejected:                         ['draft','cancelled'],
  integration_required:             ['submission_pending','cancelled'],
  integration_error:                ['submission_pending','integration_required','cancelled'],
  cancelled:                        [],
};

export const SENSITIVE_STATES = new Set([
  'acknowledged','accepted','rejected','released','inspection_required',
]);

export const TARGET_MAP: Record<string, string> = {
  acknowledgment: 'acknowledged',
  accepted: 'accepted',
  rejected: 'rejected',
  additional_information_required: 'additional_information_required',
  inspection_required: 'inspection_required',
  released: 'released',
};

export function attemptTransition(
  decl: Declaration,
  target: string,
  provenance: 'synthetic' | 'manual' | 'local' | 'verified',
  meta: { ref?: string; evidence?: string; officer?: string; notes?: string; reviewed?: boolean } = {},
): Declaration {
  if (!target || target === decl.status) return decl;
  const allowed = DECLARATION_TRANSITIONS[decl.status] || [];
  if (!allowed.includes(target)) {
    return { ...decl, history: [...decl.history, {
      kind: 'block', at: Date.now(),
      text: `Illegal transition ${decl.status} → ${target}` }] };
  }
  if (SENSITIVE_STATES.has(target) && provenance === 'synthetic') {
    return { ...decl, history: [...decl.history, {
      kind: 'block', at: Date.now(),
      text: `Blocked: synthetic result cannot transition to "${target}".` }] };
  }
  if (SENSITIVE_STATES.has(target) && provenance === 'manual' && !meta.reviewed) {
    return { ...decl,
      pendingObservation: { target, ref: meta.ref, evidence: meta.evidence,
        officer: meta.officer, notes: meta.notes, at: Date.now() },
      history: [...decl.history, {
        kind: 'hold', at: Date.now(),
        text: `Manual observation recorded. Transition to "${target}" held pending reviewer approval.` }] };
  }
  return { ...decl, status: target, pendingObservation: null,
    history: [...decl.history, {
      kind: 'ok', at: Date.now(), provenance,
      text: `${decl.status} → ${target}` + (meta.ref ? ` · ref ${meta.ref}` : '') }] };
}

export interface EvalResult {
  status: GraphNode['status'];
  provenance: Provenance;
  ref?: string;
  error?: string;
}

export function evaluateNode(
  node: GraphNode,
  supported: string[],
  mode: Mode,
  randRef: (p: string) => string,
): EvalResult {
  const def: NodeDef | undefined = byType[node.type];
  if (!def) return { status: 'failed', provenance: 'blocked', error: 'UNKNOWN_NODE' };

  const needsHs = def.type === 'jkdm.submit_declaration'
    || def.type === 'jkdm.validate_payload'
    || def.type === 'jkdm.validate_hs'
    || def.type === 'jkdm.check_pga';

  if (needsHs) {
    const hs = node.hsCode;
    if (!hs) {
      return { status: 'blocked', provenance: 'blocked', ref: '',
        error: 'HS_CODE_REQUIRED — attach a valid HS code before classification or submission.' };
    }
    const entry = HS_BY_CODE[hs];
    if (!entry) {
      return { status: 'blocked', provenance: 'blocked', ref: '',
        error: `HS_UNVERIFIED — "${hs}" is not in the local catalog. Manual tariff verification required before submission.` };
    }
    if (entry.restricted) {
      return { status: 'blocked', provenance: 'blocked', ref: '',
        error: `HS_RESTRICTED — "${hs}" is a restricted item (${entry.pga.join(', ')}). Submission requires authorized handling.` };
    }
    if (entry.pga.length > 0 && def.type === 'jkdm.submit_declaration' && !node.pgaLicense) {
      return { status: 'blocked', provenance: 'blocked', ref: '',
        error: `PGA_LICENSE_REQUIRED — "${hs}" requires ${entry.pga.join(', ')} approval. Record the license/permit reference on the node before submission.` };
    }
  }

  if (def.group === 'Classification') {
    return { status: 'success', provenance: 'local', ref: '', error: '' };
  }
  if (!def.requires) return { status: 'success', provenance: 'local', ref: '' };
  if (!supported.includes(def.requires)) {
    return { status: 'blocked', provenance: 'blocked', ref: '',
      error: `INTEGRATION_NOT_CONFIGURED — "${def.requires}" unavailable in ${mode} mode.` };
  }
  if (mode === 'development') {
    return { status: 'synthetic', provenance: 'synthetic', ref: randRef('SYNTH'), error: '' };
  }
  if (mode === 'manual') {
    return { status: 'manual', provenance: 'manual', ref: randRef('MAN'), error: '' };
  }
  return { status: 'blocked', provenance: 'blocked', ref: '',
    error: 'No live transport probe implemented in this standalone demo. Submission remains blocked.' };
}

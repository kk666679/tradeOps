import type { LibraryDef } from '@/types';

export const NODE_LIBRARY: LibraryDef[] = [
  /* Flow control */
  { group: 'Flow', type: 'flow.start', label: 'Start', op: 'flow.start', kind: 'start', out: 1 },
  { group: 'Flow', type: 'flow.gate', label: 'Loop Until', op: 'flow.until', kind: 'gate', out: 2,
    help: 'Repeats the loop body until the declaration reaches a target state, or the iteration budget is exhausted.' },
  { group: 'Flow', type: 'flow.end', label: 'End', op: 'flow.end', kind: 'end', out: 0 },

  /* Readiness */
  { group: 'Readiness', type: 'jkdm.check_readiness', label: 'Check JKDM Readiness', op: 'jkdm.check_readiness', out: 1 },
  { group: 'Readiness', type: 'jkdm.validate_payload', label: 'Validate Declaration Payload', op: 'jkdm.validate_payload', out: 1 },
  { group: 'Readiness', type: 'jkdm.check_config', label: 'Check Credentials & Config', op: 'jkdm.check_config', out: 1 },

  /* Declaration */
  { group: 'Declaration', type: 'jkdm.prepare_draft', label: 'Prepare Declaration Draft', op: 'jkdm.prepare_draft', out: 1 },
  { group: 'Declaration', type: 'jkdm.request_approval', label: 'Request Broker Approval', op: 'jkdm.request_approval', human: true, out: 1 },
  { group: 'Declaration', type: 'jkdm.submit_declaration', label: 'Submit Declaration',
    op: 'jkdm.submit_declaration', requires: 'submit_declaration', sideEffect: true, out: 1 },
  { group: 'Declaration', type: 'jkdm.poll_status', label: 'Poll Declaration Status',
    op: 'jkdm.retrieve_declaration_status', requires: 'retrieve_declaration_status', kind: 'poll', out: 1,
    help: 'Loop body member — observes declaration status. Safe to retry.' },
  { group: 'Declaration', type: 'jkdm.record_ack', label: 'Record Submission Acknowledgment',
    op: 'jkdm.record_acknowledgment', requires: 'record_acknowledgment', out: 1, advances: 'acknowledged' },
  { group: 'Declaration', type: 'jkdm.record_manual', label: 'Record Manual Customs Response',
    op: 'jkdm.record_external_response', requires: 'record_external_response', out: 1 },
  { group: 'Declaration', type: 'jkdm.request_docs', label: 'Request Additional Documentation', op: 'jkdm.request_docs', out: 1 },
  { group: 'Declaration', type: 'jkdm.handle_rejection', label: 'Handle Rejection & Correction', op: 'jkdm.handle_rejection', out: 1 },
  { group: 'Declaration', type: 'jkdm.record_release', label: 'Record Verified Release Evidence',
    op: 'jkdm.record_release_evidence', requires: 'record_release_evidence', out: 1, advances: 'released' },

  /* Manifest */
  { group: 'Manifest', type: 'jkdm.prepare_manifest', label: 'Prepare Manifest Data', op: 'jkdm.prepare_manifest', out: 1 },
  { group: 'Manifest', type: 'jkdm.validate_manifest', label: 'Validate Manifest Data', op: 'jkdm.validate_manifest', out: 1 },
  { group: 'Manifest', type: 'jkdm.submit_manifest', label: 'Submit Manifest', op: 'jkdm.submit_manifest',
    requires: 'submit_manifest', sideEffect: true, out: 1 },
  { group: 'Manifest', type: 'jkdm.record_manifest_ack', label: 'Record Manifest Acknowledgment', op: 'jkdm.record_manifest_ack', out: 1 },
];

export const byType: Record<string, LibraryDef> = Object.fromEntries(
  NODE_LIBRARY.map((d) => [d.type, d]),
);

export const GROUPS: string[] = [...new Set(NODE_LIBRARY.map((d) => d.group))];
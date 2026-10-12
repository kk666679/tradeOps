import type { NodeDef } from './types';

export const definitions: NodeDef[] = [
  ['Readiness','jkdm.check_readiness','Check JKDM Readiness','check_readiness',null],
  ['Readiness','jkdm.validate_payload','Validate Declaration Payload','validate_payload',null],
  ['Readiness','jkdm.check_config','Check Credentials & Config','check_config',null],

  ['Classification','jkdm.lookup_hs','Lookup HS Code','lookup_hs',null],
  ['Classification','jkdm.validate_hs','Validate HS Code','validate_hs',null],
  ['Classification','jkdm.check_pga','Check PGA Requirements','check_pga',null],
  ['Classification','jkdm.compute_duty','Compute Duty & Tax','compute_duty',null],

  ['Declaration','jkdm.prepare_draft','Prepare Declaration Draft','prepare_draft',null],
  ['Declaration','jkdm.request_approval','Request Broker Approval','request_approval',null,'human'],
  ['Declaration','jkdm.submit_declaration','Submit Declaration','submit_declaration','submit_declaration','side'],
  ['Declaration','jkdm.retrieve_status','Retrieve Declaration Status','retrieve_declaration_status','retrieve_declaration_status'],
  ['Declaration','jkdm.record_ack','Record Submission Acknowledgment','record_acknowledgment','record_acknowledgment'],
  ['Declaration','jkdm.record_manual','Record Manual Customs Response','record_external_response','record_external_response'],
  ['Declaration','jkdm.request_docs','Request Additional Documentation','request_docs',null],
  ['Declaration','jkdm.handle_rejection','Handle Rejection & Correction','handle_rejection',null],
  ['Declaration','jkdm.record_release','Record Verified Release Evidence','record_release_evidence','record_release_evidence'],

  ['Manifest','jkdm.prepare_manifest','Prepare Manifest Data','prepare_manifest',null],
  ['Manifest','jkdm.validate_manifest','Validate Manifest Data','validate_manifest',null],
  ['Manifest','jkdm.submit_manifest','Submit Manifest','submit_manifest','submit_manifest','side'],
  ['Manifest','jkdm.record_manifest_ack','Record Manifest Acknowledgment','record_manifest_ack',null],
].map((d) => ({
  group: d[0] as string,
  type: d[1] as string,
  label: d[2] as string,
  op: d[3] as string,
  requires: d[4] as string | null,
  human: d[5] === 'human',
  sideEffect: d[5] === 'side',
}));

export const byType: Record<string, NodeDef> = Object.fromEntries(
  definitions.map((d) => [d.type, d]),
);

export const GROUPS: string[] = [...new Set(definitions.map((d) => d.group))];

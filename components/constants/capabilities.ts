import type { Capability, IntegrationMode } from '@/types';

export const CAPABILITIES: Record<IntegrationMode, Capability[]> = {
  development: ['submit_declaration', 'retrieve_declaration_status', 'record_acknowledgment', 'record_failure'],
  manual: ['record_external_response', 'record_acknowledgment', 'record_failure', 'record_release_evidence'],
  production: [],
};

export const VERIFIED_PRODUCTION_CAPS: Capability[] = ['submit_declaration', 'retrieve_declaration_status'];

export const ALL_CAPABILITIES: Capability[] = [
  'submit_declaration', 'retrieve_declaration_status', 'submit_manifest', 'retrieve_manifest_status',
  'record_external_response', 'record_acknowledgment', 'record_failure', 'record_release_evidence',
];

export const CAP_LABEL: Record<Capability, string> = {
  submit_declaration: 'Submit declaration',
  retrieve_declaration_status: 'Poll / retrieve status',
  submit_manifest: 'Submit manifest',
  retrieve_manifest_status: 'Retrieve manifest status',
  record_external_response: 'Record external response',
  record_acknowledgment: 'Record acknowledgment',
  record_failure: 'Record integration failure',
  record_release_evidence: 'Record verified release',
};
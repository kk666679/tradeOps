import type { DeclarationStatus } from '@/types';

export const TRANSITIONS: Record<DeclarationStatus, DeclarationStatus[]> = {
  draft: ['ready_for_review', 'validation_failed', 'cancelled'],
  validation_failed: ['draft', 'cancelled'],
  ready_for_review: ['pending_approval', 'cancelled'],
  pending_approval: ['approved_for_submission', 'ready_for_review', 'cancelled'],
  approved_for_submission: ['submission_pending', 'cancelled'],
  submission_pending: ['submitted_unconfirmed', 'integration_error', 'integration_required'],
  submitted_unconfirmed: ['acknowledged', 'rejected', 'integration_error'],
  acknowledged: ['accepted', 'rejected', 'additional_information_required', 'inspection_required'],
  additional_information_required: ['submitted_unconfirmed', 'rejected', 'cancelled'],
  inspection_required: ['accepted', 'rejected', 'released'],
  accepted: ['released', 'cancelled'],
  released: [],
  rejected: ['draft', 'cancelled'],
  integration_required: ['submission_pending', 'cancelled'],
  integration_error: ['submission_pending', 'integration_required', 'cancelled'],
  cancelled: [],
};

export const SENSITIVE = new Set<DeclarationStatus>([
  'acknowledged', 'accepted', 'rejected', 'released', 'inspection_required',
]);

export const TARGET_MAP: Record<string, DeclarationStatus> = {
  acknowledgment: 'acknowledged',
  accepted: 'accepted',
  rejected: 'rejected',
  additional_information_required: 'additional_information_required',
  inspection_required: 'inspection_required',
  released: 'released',
};
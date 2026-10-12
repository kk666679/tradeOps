// backend/src/integrations/jkdm/state/declaration-state.ts

export type DeclarationState =
  | "draft"
  | "validation_failed"
  | "ready_for_review"
  | "pending_approval"
  | "approved_for_submission"
  | "submission_pending"
  | "submitted_unconfirmed"
  | "acknowledged"
  | "accepted"
  | "rejected"
  | "additional_information_required"
  | "inspection_required"
  | "released"
  | "cancelled"
  | "integration_required"
  | "integration_error";

/** Which transitions are permitted. Fail-closed: anything absent is rejected. */
const TRANSITIONS: Record<DeclarationState, DeclarationState[]> = {
  draft: ["validation_failed", "ready_for_review", "cancelled"],
  validation_failed: ["draft", "cancelled"],
  ready_for_review: ["pending_approval", "draft", "cancelled"],
  pending_approval: ["approved_for_submission", "ready_for_review", "cancelled"],
  approved_for_submission: ["submission_pending", "integration_required", "cancelled"],
  submission_pending: ["submitted_unconfirmed", "integration_error"],
  submitted_unconfirmed: ["acknowledged", "integration_error", "cancelled"],
  acknowledged: ["accepted", "rejected", "additional_information_required", "inspection_required", "released"],
  accepted: ["released", "inspection_required"],
  rejected: ["draft", "cancelled"],
  additional_information_required: ["ready_for_review", "draft", "cancelled"],
  inspection_required: ["accepted", "released", "rejected"],
  released: [],
  cancelled: [],
  integration_required: ["approved_for_submission", "cancelled"],
  integration_error: ["approved_for_submission", "integration_required", "cancelled"],
};

export function canTransition(from: DeclarationState, to: DeclarationState): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertTransition(from: DeclarationState, to: DeclarationState): void {
  if (!canTransition(from, to)) {
    throw new Error(`invalid declaration transition: ${from} → ${to}`);
  }
}

/**
 * A transition is "external-facing" when it changes the declaration's
 * standing with JKDM. These require either a verified production response
 * or a reviewed manual observation.
 */
export function isExternalFacing(state: DeclarationState): boolean {
  return (
    state === "acknowledged" ||
    state === "accepted" ||
    state === "rejected" ||
    state === "released" ||
    state === "inspection_required" ||
    state === "additional_information_required"
  );
}

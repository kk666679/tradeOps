export interface PreClearanceInput {
    tenantId: string;
    declarationId: string;
}
export declare const PRE_CLEARANCE_PROMPT = "You are reviewing a customs declaration before submission.\n\nSteps:\n1. Load the declaration.\n2. Run the regulatory gate.\n3. If blocked, list the blocking controls with citations.\n4. If review-required, list the review controls.\n5. Return a recommendation: proceed to sign-off, or list fixes required.\n\nNever recommend submission without human approval.";

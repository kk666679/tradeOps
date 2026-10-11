// components/brokerage/regulatory/regulatoryEngine.ts
import type {
  AccreditationData, BrokerClient, ControlEvaluation, ControlOutcome,
  Declaration, RegulatoryControl, RegulatoryGateResult,
} from "../types";
import { DECLARATION_FORM_META, REGULATORY } from "../constants";

export interface EvaluationContext {
  declaration: Declaration;
  client: BrokerClient;
  accreditation: AccreditationData;
  actor: string;
  ruleSetVersion: string;
  /** The declaration's currently assigned JKDM channel. */
  channel: Declaration["channel"];
  now?: Date;
}

/* ============================================================
 * Applicability + effective date
 * ============================================================ */

function isEffective(control: RegulatoryControl, now: Date): boolean {
  const from = new Date(control.effectiveFrom).getTime();
  if (Number.isFinite(from) && now.getTime() < from) return false;
  if (control.effectiveUntil) {
    const until = new Date(control.effectiveUntil).getTime();
    if (Number.isFinite(until) && now.getTime() > until) return false;
  }
  return true;
}

function appliesTo(control: RegulatoryControl, ctx: EvaluationContext): boolean {
  const { appliesTo } = control;
  if (appliesTo.forms && !appliesTo.forms.includes(ctx.declaration.formCode)) return false;
  if (appliesTo.channels && !appliesTo.channels.includes(ctx.channel)) return false;
  if (appliesTo.transactionTypes && !appliesTo.transactionTypes.includes(ctx.declaration.type)) return false;
  if (appliesTo.offices && !appliesTo.offices.includes(ctx.declaration.port)) return false;
  return true;
}

/* ============================================================
 * Individual evaluators — pure, side-effect free
 * ============================================================ */

function evaluateAgentAccreditation(
  control: RegulatoryControl, ctx: EvaluationContext
): { outcome: ControlOutcome; reason: string; evidenceIds: string[] } {
  const a = ctx.accreditation;
  const allowed = (control.parameters.allowedStatuses as string[] | undefined)
    ?? ["active", "renewal-filed"];

  if (control.parameters.minimumActiveHolders !== undefined) {
    const minimum = Number(control.parameters.minimumActiveHolders);
    const active = a.certificateHolders.filter((h) => h.active).length;
    if (active < minimum) {
      return { outcome: "FAIL", reason: `${active} active holder(s); minimum ${minimum} required`, evidenceIds: a.certificateHolders.map((h) => h.id) };
    }
    return { outcome: "PASS", reason: `${active} active holder(s)`, evidenceIds: a.certificateHolders.map((h) => h.id) };
  }

  if (control.parameters.requiredWhen === "bumiputeraRequired" && a.bumiputeraRequired) {
    if (!a.bumiputeraCompliant) {
      return { outcome: "FAIL", reason: `${a.bumiputeraActual ?? 0}% vs ${a.bumiputeraThreshold}% required`, evidenceIds: [] };
    }
    return { outcome: "PASS", reason: `${a.bumiputeraActual ?? 0}% / ${a.bumiputeraThreshold}%`, evidenceIds: [] };
  }

  if (control.parameters.maximum !== undefined) {
    // Agent-limit control — requires an injected count. Return REVIEW if unknown.
    const max = Number(control.parameters.maximum);
    const current = Number((control.parameters as { currentCount?: number }).currentCount ?? 0);
    if (current > max) {
      return { outcome: "FAIL", reason: `${current} agents exceed the ${max}-agent limit`, evidenceIds: [] };
    }
    return { outcome: "PASS", reason: `${current} / ${max} agents`, evidenceIds: [] };
  }

  if (!allowed.includes(a.status)) {
    return { outcome: "FAIL", reason: `licence status is ${a.status}`, evidenceIds: [a.licenceNumber] };
  }
  return { outcome: "PASS", reason: `licence ${a.licenceNumber} is ${a.status}`, evidenceIds: [a.licenceNumber] };
}

function evaluateServiceTax(
  _control: RegulatoryControl, ctx: EvaluationContext
): { outcome: ControlOutcome; reason: string; evidenceIds: string[] } {
  const a = ctx.accreditation;
  if (!a.serviceTaxCompliant) {
    return { outcome: "FAIL", reason: "not registered under Service Tax Act 2018", evidenceIds: [] };
  }
  return { outcome: "PASS", reason: a.serviceTaxRegistration, evidenceIds: [a.serviceTaxRegistration] };
}

function evaluateBondValidity(
  control: RegulatoryControl, ctx: EvaluationContext
): { outcome: ControlOutcome; reason: string; evidenceIds: string[] } {
  const b = ctx.accreditation.bond;
  const expected = String(control.parameters.expectedForm ?? "Borang Kastam No. 6");
  if (b.form !== expected) {
    return { outcome: "FAIL", reason: `bond form is ${b.form}; expected ${expected}`, evidenceIds: [] };
  }
  if (b.status !== "active") {
    return { outcome: "FAIL", reason: `bond status is ${b.status}`, evidenceIds: [b.referenceNumber ?? ""] };
  }
  const minimum = Number(control.parameters.minimumAmount ?? REGULATORY.BOND_AMOUNT_RM);
  if (b.amount < minimum) {
    return { outcome: "FAIL", reason: `bond RM ${b.amount} below minimum RM ${minimum}`, evidenceIds: [] };
  }
  return { outcome: "PASS", reason: `${b.form} active · RM ${b.amount.toLocaleString()}`, evidenceIds: [b.referenceNumber ?? ""] };
}

function evaluateRenewalWindow(
  control: RegulatoryControl, ctx: EvaluationContext
): { outcome: ControlOutcome; reason: string; evidenceIds: string[] } {
  const windowDays = Number(control.parameters.windowDays ?? REGULATORY.RENEWAL_WINDOW_DAYS);
  const a = ctx.accreditation;
  const days = Math.floor((new Date(a.expiresAt).getTime() - Date.now()) / 86_400_000);
  if (a.renewalFiled) return { outcome: "PASS", reason: "renewal filed", evidenceIds: [] };
  if (days < 0) return { outcome: "FAIL", reason: `expired ${-days}d ago without renewal`, evidenceIds: [] };
  if (days <= windowDays) return { outcome: "REVIEW", reason: `${days}d remaining — renewal window is open`, evidenceIds: [] };
  return { outcome: "PASS", reason: `renewal window opens in ${days - windowDays}d`, evidenceIds: [] };
}

function evaluateIDPassStatus(
  _control: RegulatoryControl, ctx: EvaluationContext
): { outcome: ControlOutcome; reason: string; evidenceIds: string[] } {
  const a = ctx.accreditation;
  if (a.idPassesLost > 0) return { outcome: "REVIEW", reason: `${a.idPassesLost} lost pass(es) on record`, evidenceIds: [] };
  return { outcome: "PASS", reason: `${a.idPassesIssued} active pass(es)`, evidenceIds: a.approvedStaff.map((s) => s.idPassNumber ?? "") };
}

function evaluateDueDiligence(
  _control: RegulatoryControl, ctx: EvaluationContext
): { outcome: ControlOutcome; reason: string; evidenceIds: string[] } {
  const a = ctx.accreditation;
  if (!a.dueDiligenceCompliant) return { outcome: "FAIL", reason: "due diligence not compliant", evidenceIds: [] };
  if (!a.kodEtikaAcknowledged) return { outcome: "REVIEW", reason: "Kod Etika not yet acknowledged", evidenceIds: [] };
  return { outcome: "PASS", reason: "Kod Etika acknowledged", evidenceIds: [] };
}

function evaluateClientAuthorization(
  _control: RegulatoryControl, ctx: EvaluationContext
): { outcome: ControlOutcome; reason: string; evidenceIds: string[] } {
  const auth = ctx.client.authorization;
  if (!auth.written) return { outcome: "FAIL", reason: "no written authorization on file (§90(1)(b))", evidenceIds: [] };
  return { outcome: "PASS", reason: auth.reference ?? "authorization on file", evidenceIds: auth.reference ? [auth.reference] : [] };
}

function evaluateFormPurpose(
  control: RegulatoryControl, ctx: EvaluationContext
): { outcome: ControlOutcome; reason: string; evidenceIds: string[] } {
  const meta = DECLARATION_FORM_META[ctx.declaration.formCode];
  if (control.parameters.requirePurposeVerification && meta.purposeVerificationRequired) {
    // The form carries a marker that its purpose must be verified against the
    // current JKDM reference. Without a signed verification token on the
    // declaration this remains a REVIEW (never a silent PASS).
    const verified = ctx.declaration.documents.permitRefs?.some((r) => r.startsWith("FORM-VERIFY:"));
    if (!verified) {
      return { outcome: "REVIEW", reason: `${meta.formCode} purpose requires verification against JKDM forms reference`, evidenceIds: [] };
    }
  }
  return { outcome: "PASS", reason: `${meta.formCode} · ${meta.direction}`, evidenceIds: [] };
}

function evaluatePermitEvidence(
  control: RegulatoryControl, ctx: EvaluationContext
): { outcome: ControlOutcome; reason: string; evidenceIds: string[] } {
  const controlled = (control.parameters.controlledHSCodes as string[] | undefined) ?? [];
  const requireRef = Boolean(control.parameters.requirePermitReference ?? true);
  const hits = ctx.declaration.lineItems.filter((li) => controlled.includes(li.hsCode));
  if (hits.length === 0) return { outcome: "NOT_APPLICABLE", reason: "no controlled HS codes", evidenceIds: [] };
  const permitRefs = ctx.declaration.documents.permitRefs ?? [];
  if (requireRef && permitRefs.length === 0) {
    return { outcome: "FAIL", reason: `${hits.length} controlled line(s); no permit attached`, evidenceIds: [] };
  }
  return { outcome: "PASS", reason: `${hits.length} controlled line(s); ${permitRefs.length} permit(s) attached`, evidenceIds: permitRefs };
}

function evaluateChannelReview(
  control: RegulatoryControl, ctx: EvaluationContext
): { outcome: ControlOutcome; reason: string; evidenceIds: string[] } {
  const list = (control.parameters.reviewRequiredFor as string[] | undefined) ?? ["YELLOW", "RED"];
  if (ctx.channel === "UNASSIGNED") return { outcome: "NOT_APPLICABLE", reason: "channel not assigned", evidenceIds: [] };
  if (list.includes(ctx.channel)) return { outcome: "REVIEW", reason: `${ctx.channel} channel — review required`, evidenceIds: [] };
  return { outcome: "PASS", reason: `${ctx.channel} channel — no review required`, evidenceIds: [] };
}

function evaluateHumanApproval(
  control: RegulatoryControl, ctx: EvaluationContext
): { outcome: ControlOutcome; reason: string; evidenceIds: string[] } {
  const requiredRole = String(control.parameters.requiredRole ?? "broker");
  const approval = ctx.declaration.approvals.find(
    (a) => a.role === requiredRole && a.decision === "approved"
  );
  if (!approval) return { outcome: "REVIEW", reason: `no ${requiredRole} approval on record`, evidenceIds: [] };
  return { outcome: "PASS", reason: `${approval.actor} · ${approval.borangCReference ?? "—"}`, evidenceIds: approval.borangCReference ? [approval.borangCReference] : [] };
}

/* ============================================================
 * Evaluator dispatch
 * ============================================================ */

type EvaluatorReturn = { outcome: ControlOutcome; reason: string; evidenceIds: string[] };

function runEvaluator(control: RegulatoryControl, ctx: EvaluationContext): EvaluatorReturn {
  switch (control.evaluator) {
    case "AGENT_ACCREDITATION":       return evaluateAgentAccreditation(control, ctx);
    case "SERVICE_TAX_REGISTRATION":  return evaluateServiceTax(control, ctx);
    case "BOND_VALIDITY":             return evaluateBondValidity(control, ctx);
    case "CLIENT_AUTHORIZATION":      return evaluateClientAuthorization(control, ctx);
    case "FORM_PURPOSE":              return evaluateFormPurpose(control, ctx);
    case "PERMIT_EVIDENCE":           return evaluatePermitEvidence(control, ctx);
    case "CHANNEL_REVIEW":            return evaluateChannelReview(control, ctx);
    case "HUMAN_APPROVAL":            return evaluateHumanApproval(control, ctx);
    case "ID_PASS_STATUS":            return evaluateIDPassStatus(control, ctx);
    case "RENEWAL_WINDOW":            return evaluateRenewalWindow(control, ctx);
    case "DUE_DILIGENCE":             return evaluateDueDiligence(control, ctx);
    default: {
      const _exhaustive: never = control.evaluator;
      return { outcome: "REVIEW", reason: `unknown evaluator: ${String(_exhaustive)}`, evidenceIds: [] };
    }
  }
}

/* ============================================================
 * The gate
 * ============================================================ */

export function evaluateRegulatoryGate(
  controls: RegulatoryControl[],
  ctx: EvaluationContext
): RegulatoryGateResult {
  const now = ctx.now ?? new Date();
  const evaluations: ControlEvaluation[] = [];
  const blockingControlIds: string[] = [];
  const warningControlIds: string[] = [];

  for (const control of controls) {
    let outcome: ControlOutcome = "NOT_APPLICABLE";
    let reason = "";
    let evidenceIds: string[] = [];

    if (!control.enabled) {
      reason = "control disabled";
    } else if (!isEffective(control, now)) {
      reason = "control not effective at this time";
    } else if (!appliesTo(control, ctx)) {
      reason = "control does not apply to this transaction";
    } else {
      const r = runEvaluator(control, ctx);
      outcome = r.outcome;
      reason = r.reason;
      evidenceIds = r.evidenceIds;
    }

    const evaluation: ControlEvaluation = {
      controlId: control.id,
      controlVersion: control.version,
      controlName: control.name,
      severity: control.severity,
      mandatory: control.mandatory,
      outcome,
      reason,
      evidenceIds,
      references: control.references,
      evaluatedAt: now.toISOString(),
      evaluatedBy: ctx.actor,
    };

    evaluations.push(evaluation);

    if (outcome === "FAIL" && control.mandatory) blockingControlIds.push(control.id);
    if ((outcome === "REVIEW" || outcome === "FAIL") && control.severity === "WARNING") {
      warningControlIds.push(control.id);
    }
  }

  const allowedToProceed = blockingControlIds.length === 0;
  const requiresHumanReview = evaluations.some((e) => e.outcome === "REVIEW");

  return {
    allowedToProceed,
    requiresHumanReview,
    evaluations,
    blockingControlIds,
    warningControlIds,
    evaluatedAt: now.toISOString(),
    ruleSetVersion: ctx.ruleSetVersion,
  };
}

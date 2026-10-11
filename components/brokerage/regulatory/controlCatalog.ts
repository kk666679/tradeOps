// components/brokerage/regulatory/controlCatalog.ts
import type { RegulatoryControl, RegulatoryReference } from "../types";
import { REGULATORY } from "../constants";

/* ============================================================
 * Canonical regulatory references
 *
 * Every reference carries verificationStatus. PENDING_REVIEW or
 * SUPERSEDED references must never be presented as authoritative.
 * ============================================================ */

export const REFERENCES = {
  CA1967_S90: {
    id: "ca1967.s90", title: "Customs Act 1967",
    section: "§90", url: REGULATORY.LEGAL_REFS.SECTION_90 as unknown as string,
    verificationStatus: "VERIFIED",
  } as RegulatoryReference,
  CA1967_S90_1_AA: {
    id: "ca1967.s90.1.aa", title: "Customs Act 1967",
    section: "§90(1)(aa)",
    url: "https://www.customs.gov.my/", verificationStatus: "VERIFIED",
  } as RegulatoryReference,
  CA1967_S90_1_B: {
    id: "ca1967.s90.1.b", title: "Customs Act 1967",
    section: "§90(1)(b)",
    url: "https://www.customs.gov.my/", verificationStatus: "VERIFIED",
  } as RegulatoryReference,
  CA1967_S100: {
    id: "ca1967.s100", title: "Customs Act 1967",
    section: "§100", verificationStatus: "VERIFIED",
  } as RegulatoryReference,
  JKDM_GUIDE_S3_1: { id: "jkdm.guide.3.1", title: "Panduan Ejen Kastam (JKDM, 22 Apr 2025)", section: "§3.1", verificationStatus: "VERIFIED" } as RegulatoryReference,
  JKDM_GUIDE_S3_2: { id: "jkdm.guide.3.2", title: "Panduan Ejen Kastam (JKDM, 22 Apr 2025)", section: "§3.2", verificationStatus: "VERIFIED" } as RegulatoryReference,
  JKDM_GUIDE_S3_4: { id: "jkdm.guide.3.4", title: "Panduan Ejen Kastam (JKDM, 22 Apr 2025)", section: "§3.4", verificationStatus: "VERIFIED" } as RegulatoryReference,
  JKDM_GUIDE_S3_5: { id: "jkdm.guide.3.5", title: "Panduan Ejen Kastam (JKDM, 22 Apr 2025)", section: "§3.5", verificationStatus: "VERIFIED" } as RegulatoryReference,
  JKDM_GUIDE_S5:   { id: "jkdm.guide.5",   title: "Panduan Ejen Kastam (JKDM, 22 Apr 2025)", section: "§5",   verificationStatus: "VERIFIED" } as RegulatoryReference,
  JKDM_GUIDE_S8:   { id: "jkdm.guide.8",   title: "Panduan Ejen Kastam (JKDM, 22 Apr 2025)", section: "§8",   verificationStatus: "VERIFIED" } as RegulatoryReference,
  JKDM_GUIDE_S10:  { id: "jkdm.guide.10",  title: "Panduan Ejen Kastam (JKDM, 22 Apr 2025)", section: "§10",  verificationStatus: "VERIFIED" } as RegulatoryReference,
  JKDM_GUIDE_S13:  { id: "jkdm.guide.13",  title: "Panduan Ejen Kastam (JKDM, 22 Apr 2025)", section: "§13",  verificationStatus: "VERIFIED" } as RegulatoryReference,
  JKDM_FORMS_REF: {
    id: "jkdm.forms.ref",
    title: "JKDM Prescribed Customs Forms (ed. 29 Dec 2022)",
    url: REGULATORY.JKDM_FORMS_REFERENCE,
    verificationStatus: "VERIFIED",
  } as RegulatoryReference,
  MACC_ACT: {
    id: "macc.act.2009", title: "Malaysian Anti-Corruption Commission Act 2009",
    verificationStatus: "VERIFIED",
  } as RegulatoryReference,
} as const;

/* ============================================================
 * The canonical JKDM control catalog
 *
 * This is the default registry. It can be replaced at runtime by a
 * jurisdiction-configurable rule set sourced from JKDM or a persisted
 * administration UI. Nothing in the UI hard-codes these rules — they
 * are all data.
 * ============================================================ */

export const JKDM_CONTROL_CATALOG: RegulatoryControl[] = [
  /* -------- Agent accreditation -------- */
  {
    id: "agent.section90.active",
    name: "Section 90 authorization valid",
    description:
      "Agent must hold a valid, unsuspended Section 90 authorization from JKDM. Refer to the JKDM guideline for current status rules.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: { transactionTypes: ["import", "export", "transit", "transhipment", "bonded"] },
    severity: "BLOCK",
    mandatory: true,
    effectiveFrom: "1967-01-01",
    references: [REFERENCES.CA1967_S90],
    evaluator: "AGENT_ACCREDITATION",
    parameters: { allowedStatuses: ["active", "renewal-filed"] },
    version: 1,
  },
  {
    id: "agent.service-tax.registered",
    name: "Service Tax registration (Service Tax Act 2018)",
    description:
      "Agent must be registered as a taxable person under the Service Tax Act 2018, per Customs Act 1967 §90(1)(aa).",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: {},
    severity: "BLOCK",
    mandatory: true,
    effectiveFrom: "2018-09-01",
    references: [REFERENCES.CA1967_S90_1_AA],
    evaluator: "SERVICE_TAX_REGISTRATION",
    parameters: {},
    version: 1,
  },
  {
    id: "agent.cert-holders.minimum",
    name: "Minimum KEK / KEP certificate holders",
    description:
      "At least two active KEK or KEP certificate holders must be maintained. If a holder resigns, a 6-month replacement window applies.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: {},
    severity: "BLOCK",
    mandatory: true,
    effectiveFrom: "2025-04-22",
    references: [REFERENCES.JKDM_GUIDE_S3_2],
    evaluator: "AGENT_ACCREDITATION",
    parameters: { minimumActiveHolders: 2 },
    version: 1,
  },
  {
    id: "agent.bumiputera.threshold",
    name: "Bumiputera participation threshold",
    description:
      "Forwarding Agents must meet the Bumiputera participation threshold for their registration year. Shipping Agents and Freight Forwarders are exempt unless also a Forwarding Agent.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: {},
    severity: "BLOCK",
    mandatory: true,
    effectiveFrom: "2025-04-22",
    references: [REFERENCES.JKDM_GUIDE_S3_4],
    evaluator: "AGENT_ACCREDITATION",
    parameters: { requiredWhen: "bumiputeraRequired" },
    version: 1,
  },
  {
    id: "agent.bond.valid",
    name: "JKDM general bond valid (Kastam No. 6)",
    description:
      "The JKDM general bond under Form Kastam No. 6 must be active and unexpired. Kastam No. 6 is a general bond; it is distinct from Kastam No. 7 (traveller declaration) and must not be conflated.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: {},
    severity: "BLOCK",
    mandatory: true,
    effectiveFrom: "2025-04-22",
    references: [REFERENCES.JKDM_GUIDE_S3_5, REFERENCES.JKDM_FORMS_REF],
    evaluator: "BOND_VALIDITY",
    parameters: { expectedForm: "Borang Kastam No. 6", minimumAmount: 10_000 },
    version: 1,
  },
  {
    id: "agent.renewal.window",
    name: "Renewal filed within §5 window",
    description:
      "Renewal must be filed no later than 90 days before expiry. This control surfaces a warning when the window is open but renewal has not yet been filed, and fails when renewal is overdue.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: {},
    severity: "WARNING",
    mandatory: true,
    effectiveFrom: "2025-04-22",
    references: [REFERENCES.JKDM_GUIDE_S5],
    evaluator: "RENEWAL_WINDOW",
    parameters: { windowDays: 90 },
    version: 1,
  },
  {
    id: "agent.id-pass.active",
    name: "Approved staff ID passes in good standing",
    description:
      "Approved staff must wear an active ID Pass when dealing with JKDM. Lost passes must be reported with a police report.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: {},
    severity: "WARNING",
    mandatory: false,
    effectiveFrom: "2025-04-22",
    references: [REFERENCES.JKDM_GUIDE_S10],
    evaluator: "ID_PASS_STATUS",
    parameters: {},
    version: 1,
  },
  {
    id: "agent.due-diligence.kod-etika",
    name: "Due diligence and Kod Etika Ejen Kastam",
    description:
      "Agent must exercise due diligence and comply with the Kod Etika Ejen Kastam. Violations may be prosecuted under the Customs Act 1967 and the MACC Act 2009.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: {},
    severity: "BLOCK",
    mandatory: true,
    effectiveFrom: "2025-04-22",
    references: [REFERENCES.JKDM_GUIDE_S13, REFERENCES.MACC_ACT],
    evaluator: "DUE_DILIGENCE",
    parameters: {},
    version: 1,
  },

  /* -------- Client engagement -------- */
  {
    id: "client.authorization.written",
    name: "Written client authorization (§90(1)(b))",
    description:
      "The agent may only act for a client who has given written authorization.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: {},
    severity: "BLOCK",
    mandatory: true,
    effectiveFrom: "1967-01-01",
    references: [REFERENCES.CA1967_S90_1_B],
    evaluator: "CLIENT_AUTHORIZATION",
    parameters: {},
    version: 1,
  },
  {
    id: "client.agent-limit-per-state",
    name: "3-agent limit per client per state (§8)",
    description:
      "Importers, exporters, and manufacturers may appoint at most 3 Forwarding or Shipping Agents per state. Freight Forwarders have no limit.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: {},
    severity: "WARNING",
    mandatory: false,
    effectiveFrom: "2025-04-22",
    references: [REFERENCES.JKDM_GUIDE_S8],
    evaluator: "AGENT_ACCREDITATION",
    parameters: { maximum: 3 },
    version: 1,
  },

  /* -------- Form purpose -------- */
  {
    id: "form.purpose.verified",
    name: "Form purpose matches transaction",
    description:
      "Each form code must have a purpose consistent with the transaction. Purpose values are configurable and must be verified against the current JKDM prescribed-forms reference. K7 in particular is documented with a traveller-declaration purpose and must not be assumed to be an interchangeable commercial-goods form.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: { forms: ["K1", "K2", "K3", "K7", "K8", "K9"] },
    severity: "BLOCK",
    mandatory: true,
    effectiveFrom: "2025-04-22",
    references: [REFERENCES.JKDM_FORMS_REF],
    evaluator: "FORM_PURPOSE",
    parameters: { requirePurposeVerification: true },
    version: 1,
  },

  /* -------- Permits -------- */
  {
    id: "permit.required.evidence",
    name: "Required permit evidence attached",
    description:
      "When the HS code maps to a controlled good (SIRIM, MAQIS, MOH, MITI, etc.), a valid permit reference must be attached. This control is data-driven: the HS-to-permit mapping lives in the configuration, not in the UI.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: {},
    severity: "BLOCK",
    mandatory: true,
    effectiveFrom: "2023-01-01",
    references: [REFERENCES.JKDM_FORMS_REF],
    evaluator: "PERMIT_EVIDENCE",
    parameters: { controlledHSCodes: [], requirePermitReference: true },
    version: 1,
  },

  /* -------- Channel -------- */
  {
    id: "channel.review.required",
    name: "Configured review workflow for assigned channel",
    description:
      "The JKDM risk-management channel drives the review workflow. RED requires physical examination, YELLOW requires documentary check, GREEN permits auto-release.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: { channels: ["GREEN", "YELLOW", "RED"] },
    severity: "WARNING",
    mandatory: false,
    effectiveFrom: "2025-04-22",
    references: [REFERENCES.JKDM_FORMS_REF],
    evaluator: "CHANNEL_REVIEW",
    parameters: { reviewRequiredFor: ["YELLOW", "RED"] },
    version: 1,
  },

  /* -------- Human approval -------- */
  {
    id: "human.broker.signoff",
    name: "Licensed broker sign-off present",
    description:
      "A licensed broker on the approved staff register must have signed off. Legal liability attaches at the point of the Borang C / digital signature.",
    jurisdiction: "MY",
    enabled: true,
    appliesTo: {},
    severity: "BLOCK",
    mandatory: true,
    effectiveFrom: "1967-01-01",
    references: [REFERENCES.CA1967_S90],
    evaluator: "HUMAN_APPROVAL",
    parameters: { requiredRole: "broker" },
    version: 1,
  },
];

/** Snapshot of the rule set version shipped with this build. */
export const JKDM_RULE_SET_VERSION = "jkdm-my-2025.04.22.1";

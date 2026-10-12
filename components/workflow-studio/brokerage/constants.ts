// components/brokerage/constants.ts
import type {
  AccreditationStatus, ApprovalPeriod, CustomsChannel, CustomsFormCode,
  ControlOutcome, ControlSeverity, DeclarationFlag, DeclarationFormMeta,
  DeclarationStatus, DeclarationType, EjenType, PipelineColumnDef, RegistrationBand,
} from "./types";

export const STATUS_COLOR: Record<string, string> = {
  pending: "#71717a", active: "#3b82f6", done: "#10b981",
  blocked: "#f59e0b", error: "#ef4444",
};

export const EJEN_TYPE_COLOR: Record<EjenType, string> = {
  penghantaran: "#8b5cf6", perkapalan: "#3b82f6", pengangkut_barang: "#06b6d4",
};

export const ACCREDITATION_STATUS_META: Record<
  AccreditationStatus,
  { label: string; color: string; bg: string; severity: "ok" | "warn" | "err" }
> = {
  active:            { label: "Active",           color: "#10b981", bg: "rgba(16,185,129,0.12)", severity: "ok" },
  "expiring-soon":   { label: "Expiring soon",    color: "#f59e0b", bg: "rgba(245,158,11,0.12)", severity: "warn" },
  "renewal-filed":   { label: "Renewal filed",    color: "#3b82f6", bg: "rgba(59,130,246,0.12)", severity: "ok" },
  "renewal-overdue": { label: "Renewal overdue",  color: "#ef4444", bg: "rgba(239,68,68,0.12)",  severity: "err" },
  suspended:         { label: "Suspended (§12)",  color: "#ef4444", bg: "rgba(239,68,68,0.12)",  severity: "err" },
  cancelled:         { label: "Cancelled (§11)",  color: "#ef4444", bg: "rgba(239,68,68,0.12)",  severity: "err" },
  expired:           { label: "Expired",          color: "#ef4444", bg: "rgba(239,68,68,0.12)",  severity: "err" },
};

export const APPROVAL_PERIOD_LABEL: Record<ApprovalPeriod, string> = {
  "1-year": "1 year · new application (§6)",
  "2-year": "2 years · standard renewal (§6)",
  "5-year": "5 years · track record required (§6)",
};

export const REGISTRATION_BAND_META: Record<
  RegistrationBand,
  { label: string; bumiputeraRequired: boolean; threshold?: number }
> = {
  "pre-1976":       { label: "Registered before 1976",  bumiputeraRequired: true,  threshold: 51 },
  "1976-1990":      { label: "Registered 1976–1990",    bumiputeraRequired: true,  threshold: 30 },
  "post-1990":      { label: "Registered after 1990",   bumiputeraRequired: true,  threshold: 51 },
  "iils":           { label: "IILS-approved forwarder", bumiputeraRequired: true,  threshold: 51 },
  "not-applicable": { label: "Shipping / Freight only", bumiputeraRequired: false },
};

/* ============================================================
 * Configurable form-purpose registry
 *
 * The form code alone does not determine the transaction. The purpose
 * must be validated against the current JKDM prescribed-forms reference.
 * K7 in particular is documented by JKDM with a traveller-declaration
 * purpose in the cited forms reference and must not be assumed to be an
 * interchangeable commercial-goods declaration.
 * ============================================================ */

export const DECLARATION_FORM_META: Record<CustomsFormCode, DeclarationFormMeta> = {
  K1: { formCode: "K1", formName: "Import Declaration",       formNameMs: "Pengikraran Import",       purpose: "Goods imported into Malaysia for home consumption",       direction: "import",    purposeVerificationRequired: true },
  K2: { formCode: "K2", formName: "Export Declaration",       formNameMs: "Pengikraran Eksport",      purpose: "Goods exported from Malaysia",                             direction: "export",    purposeVerificationRequired: true },
  K3: { formCode: "K3", formName: "Removal Declaration",      formNameMs: "Pengikraran Pengeluaran",  purpose: "Movement from principal customs area into a Free Zone",    direction: "movement",  purposeVerificationRequired: true },
  K7: { formCode: "K7", formName: "Traveller Declaration",    formNameMs: "Pengikraran Pengembara",   purpose: "Traveller declaration — refer to current JKDM prescribed-forms reference for exact scope", direction: "traveller", purposeVerificationRequired: true },
  K8: { formCode: "K8", formName: "Transit Declaration",      formNameMs: "Pengikraran Transit",      purpose: "Transit of goods across Malaysia",                         direction: "transit",   purposeVerificationRequired: true },
  K9: { formCode: "K9", formName: "Transhipment Declaration", formNameMs: "Pengikraran Transhipment", purpose: "Transhipment at a Malaysian port",                         direction: "transit",   purposeVerificationRequired: true },
};

export const DECLARATION_FORM_COLOR: Record<CustomsFormCode, string> = {
  K1: "#3b82f6", K2: "#10b981", K3: "#f59e0b",
  K7: "#f97316", K8: "#8b5cf6", K9: "#06b6d4",
};

/* ============================================================
 * JKDM risk-management channels
 * ============================================================ */

export const CHANNEL_META: Record<
  CustomsChannel,
  { label: string; description: string; color: string; bg: string }
> = {
  GREEN:      { label: "Green Lane",      description: "Auto-release. No documentary check, no physical examination.", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  YELLOW:     { label: "Yellow Lane",     description: "Documentary check. JKDM officer reviews the declaration.",     color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  RED:        { label: "Red Lane",        description: "Physical examination required at port.",                        color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  UNASSIGNED: { label: "Unassigned",      description: "Channel not yet assigned by JKDM risk engine.",                 color: "#71717a", bg: "rgba(113,113,122,0.12)" },
};

/* ============================================================
 * Control severity + outcome metadata
 * ============================================================ */

export const CONTROL_SEVERITY_META: Record<
  ControlSeverity,
  { label: string; color: string; bg: string; icon: string }
> = {
  INFO:    { label: "Info",    color: "#3b82f6", bg: "rgba(59,130,246,0.12)", icon: "ℹ" },
  WARNING: { label: "Warning", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "⚠" },
  BLOCK:   { label: "Block",   color: "#ef4444", bg: "rgba(239,68,68,0.12)",  icon: "✕" },
};

export const CONTROL_OUTCOME_META: Record<
  ControlOutcome,
  { label: string; color: string; bg: string; icon: string }
> = {
  PASS:           { label: "Pass",           color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: "✓" },
  FAIL:           { label: "Fail",           color: "#ef4444", bg: "rgba(239,68,68,0.12)",  icon: "✕" },
  REVIEW:         { label: "Review",         color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "…" },
  NOT_APPLICABLE: { label: "N/A",            color: "#71717a", bg: "rgba(113,113,122,0.12)", icon: "–" },
};

/* ============================================================
 * Declaration statuses (workflow — distinct from channel)
 * ============================================================ */

export const DECLARATION_STATUS_COLOR: Record<DeclarationStatus, string> = {
  draft: "#71717a", "awaiting-docs": "#f59e0b",
  classifying: "#8b5cf6", valuing: "#8b5cf6", "origin-check": "#8b5cf6",
  screening: "#06b6d4", "permit-check": "#f59e0b",
  "awaiting-approval": "#f59e0b", approved: "#10b981", filed: "#3b82f6",
  "channel-green": "#10b981", "channel-yellow": "#f59e0b", "channel-red": "#ef4444",
  inspecting: "#ef4444", "duty-paid": "#3b82f6", cleared: "#10b981",
  held: "#f59e0b", amended: "#a855f7", cancelled: "#ef4444", "post-audit": "#f472b6",
};

export const DECLARATION_STATUS_LABEL: Record<DeclarationStatus, string> = {
  draft: "Draft", "awaiting-docs": "Awaiting docs",
  classifying: "Classifying", valuing: "Valuing", "origin-check": "Origin check",
  screening: "Screening", "permit-check": "Permit check",
  "awaiting-approval": "Awaiting approval", approved: "Approved", filed: "Filed",
  "channel-green": "Green Lane", "channel-yellow": "Yellow Lane", "channel-red": "Red Lane",
  inspecting: "Inspecting", "duty-paid": "Duty paid", cleared: "Cleared",
  held: "Held", amended: "Amended", cancelled: "Cancelled", "post-audit": "Post-audit",
};

export const DECLARATION_TYPE_COLOR: Record<DeclarationType, string> = {
  import: "#3b82f6", export: "#10b981", transit: "#f59e0b",
  transhipment: "#8b5cf6", bonded: "#06b6d4",
};

export const FLAG_META: Record<
  DeclarationFlag,
  { label: string; color: string; bg: string; icon: string }
> = {
  "hs-conflict":             { label: "HS conflict",           color: "#f59e0b", bg: "rgba(245,158,11,0.15)", icon: "⚑" },
  "origin-unclear":          { label: "Origin unclear",        color: "#f59e0b", bg: "rgba(245,158,11,0.15)", icon: "⚑" },
  "valuation-review":        { label: "Valuation review",      color: "#f59e0b", bg: "rgba(245,158,11,0.15)", icon: "⚑" },
  "sanctions-hit":           { label: "Sanctions hit",         color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: "✕" },
  "missing-doc":             { label: "Missing doc",           color: "#f59e0b", bg: "rgba(245,158,11,0.15)", icon: "⚑" },
  "sla-breach":              { label: "SLA breach",            color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: "!" },
  "post-audit-risk":         { label: "Post-audit risk",       color: "#f472b6", bg: "rgba(244,114,182,0.15)", icon: "◆" },
  "permit-required":         { label: "Permit required",       color: "#f59e0b", bg: "rgba(245,158,11,0.15)", icon: "⚑" },
  "permit-missing":          { label: "Permit missing",        color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: "✕" },
  "borang-c-inactive":       { label: "Borang C inactive",     color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: "✕" },
  "client-unauthorized":     { label: "Client unauthorized",   color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: "✕" },
  "capital-deficiency":      { label: "Capital deficiency",    color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: "✕" },
  "bond-expired":            { label: "Bond expired",          color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: "✕" },
  "id-pass-invalid":         { label: "ID pass invalid",       color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: "✕" },
  "channel-red":             { label: "Red Lane",              color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: "!" },
  "channel-yellow":          { label: "Yellow Lane",           color: "#f59e0b", bg: "rgba(245,158,11,0.15)", icon: "⚑" },
  "form-purpose-unverified": { label: "Form purpose unverified", color: "#f97316", bg: "rgba(249,115,22,0.15)", icon: "?" },
  "rule-version-superseded": { label: "Rule superseded",       color: "#a855f7", bg: "rgba(168,85,247,0.15)", icon: "↻" },
};

export const DEFAULT_PIPELINE_COLUMNS: PipelineColumnDef[] = [
  { id: "draft",             label: "Draft",             accent: "#71717a", maxCards: 20 },
  { id: "classifying",       label: "Classifying",       accent: "#8b5cf6", maxCards: 20 },
  { id: "valuing",           label: "Valuing",           accent: "#8b5cf6", maxCards: 20 },
  { id: "permit-check",      label: "Permit check",      accent: "#f59e0b", maxCards: 20 },
  { id: "screening",         label: "Screening",         accent: "#06b6d4", maxCards: 20 },
  { id: "awaiting-approval", label: "Awaiting approval", accent: "#f59e0b", maxCards: 20 },
  { id: "approved",          label: "Approved",          accent: "#10b981", maxCards: 20 },
  { id: "filed",             label: "Filed",             accent: "#3b82f6", maxCards: 20 },
  { id: "channel-green",     label: "Green Lane",        accent: "#10b981", maxCards: 20 },
  { id: "channel-yellow",    label: "Yellow Lane",       accent: "#f59e0b", maxCards: 20 },
  { id: "channel-red",       label: "Red Lane",          accent: "#ef4444", maxCards: 20 },
  { id: "inspecting",        label: "Inspecting",        accent: "#ef4444", maxCards: 20 },
  { id: "duty-paid",         label: "Duty paid",         accent: "#3b82f6", maxCards: 20 },
  { id: "cleared",           label: "Cleared",           accent: "#10b981", maxCards: 20 },
];

export const REGULATORY = {
  PAID_UP_CAPITAL: {
    "business-act-1956": 50_000,
    "companies-act-2016": 100_000,
  } as const,
  BOND_AMOUNT_RM: 10_000,
  /** JKDM general bond. Distinct from Kastam No. 7 (traveller declaration). */
  BOND_FORM: "Borang Kastam No. 6" as const,
  /** JKDM traveller declaration. NOT a commercial-goods form. */
  TRAVELLER_FORM: "Borang Kastam No. 7" as const,
  MIN_CERTIFICATE_HOLDERS: 2,
  CERTIFICATE_REPLACEMENT_WINDOW_DAYS: 180,
  RENEWAL_WINDOW_DAYS: 90,
  CHANGE_NOTIFICATION_DAYS: 14,
  APPEAL_WINDOW_DAYS: 30,
  AUDIT_RETENTION_YEARS: 6,
  KOD_ETIKA_URL: "https://www.customs.gov.my/ms/cp/Pages/cp_iimp.aspx",
  JKDM_FORMS_REFERENCE:
    "https://www.customs.gov.my/images/06-prosedur/borang_kastam_bm_29.12.2022_ed_1.pdf",
  MAX_AGENTS_PER_CLIENT_PER_STATE: 3,
  LEGAL_REFS: {
    SECTION_90: "Customs Act 1967 §90",
    SECTION_90_1_AA: "Customs Act 1967 §90(1)(aa) — Service Tax Act 2018 registration required",
    SECTION_90_1_B: "Customs Act 1967 §90(1)(b) — written client authorization required",
    SECTION_90_3: "Customs Act 1967 §90(3) — course and exam requirement",
    SECTION_100: "Customs Act 1967 §100 — 6-year record retention",
    SECTION_143_1: "Customs Act 1967 §143(1) — 30-day appeal window",
    SPRM_ACT_2009: "Malaysian Anti-Corruption Commission Act 2009",
  },
} as const;

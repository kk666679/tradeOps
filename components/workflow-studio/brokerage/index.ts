// components/brokerage/index.ts

/* Types */
export * from "./types";

/* Constants */
export * from "./constants";

/* Registry */
export * from "./registry";

/* Regulatory engine */
export {
  JKDM_CONTROL_CATALOG, JKDM_RULE_SET_VERSION, REFERENCES,
  evaluateRegulatoryGate, DEFAULT_RULE_SET, controlsEffectiveAt,
} from "./regulatory";
export type { EvaluationContext, RuleSet } from "./regulatory";

/* Workflow */
export {
  BrokerageWorkflowExplorer,
  RegulatoryHealthPanel,
  Section90Checklist,
  BorangCTrace,
  brokerageNodeTypes,
  buildBrokerageWorkflowGraph,
  buildAccreditationNodes,
  runBrokerageSimulation,
  SAMPLE_ACCREDITATION,
  SAMPLE_CLIENT,
  SAMPLE_DECLARATION,
  CANONICAL_LANES,
  CANONICAL_AGENTS,
  CANONICAL_COMPLIANCE_RULES,
  CANONICAL_HUMAN_GATES,
  BROKERAGE_LAYOUT,
} from "./workflow";
export type {
  BrokerageWorkflowExplorerProps,
  RegulatoryHealthPanelProps,
  Section90ChecklistProps,
  BorangCTraceProps,
  BuildBrokerageGraphOptions,
} from "./workflow";

/* Hooks */
export {
  useBrokerageGraph, useAccreditationHealth,
  useDeclarationQueue, useClientRegistry, useAuditChain,
} from "./hooks";

/* Sub-modules */
export { BrokeragePipeline } from "./pipeline";
export { ClientRegistry, ClientCard, ClientSlaPanel } from "./clients";
export { DeclarationQueue, DeclarationCard, DeclarationDetail } from "./declarations";
export { AuditChainViewer, EvidencePackBuilder, AuditTrace } from "./audit";
export { LicenceRegistry, DelegationLimits, SpendAuthorityCard, JurisdictionScope } from "./governance";

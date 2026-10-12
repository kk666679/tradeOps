// components/brokerage/regulatory/index.ts
export { JKDM_CONTROL_CATALOG, JKDM_RULE_SET_VERSION, REFERENCES } from "./controlCatalog";
export { evaluateRegulatoryGate } from "./regulatoryEngine";
export type { EvaluationContext } from "./regulatoryEngine";
export { DEFAULT_RULE_SET, controlsEffectiveAt } from "./ruleSet";
export type { RuleSet } from "./ruleSet";

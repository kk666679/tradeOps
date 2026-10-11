// shared/governance/index.ts
export { AuditChain, hashToolInput } from "./audit-chain";
export type { AuditEntry } from "./audit-chain";
export { PolicyEngine, HighValueRequiresApproval, AgentCannotMoveBonded } from "./policy-enforcement";
export type { PolicyContext, PolicyDecision, PolicyRule } from "./policy-enforcement";
export { initTracer, withToolSpan } from "./otel";
export type { ToolSpanAttributes } from "./otel";

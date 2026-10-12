// custom-agents wiring data — part 5 (policy, registry, supervision)
export const CA_5 = [
  ['policy/page.tsx', { title: 'Agent Policy', description: 'Rules, guardrails, jurisdiction, delegation, spend, and data access', layout: 'grid2', components: [
    { name: 'PolicyEditor', path: '@/components/custom-agents/policy/PolicyEditor' },
    { name: 'RulePackList', path: '@/components/custom-agents/policy/RulePackList' },
    { name: 'GuardrailMatrix', path: '@/components/custom-agents/policy/GuardrailMatrix' },
    { name: 'JurisdictionSelector', path: '@/components/custom-agents/policy/JurisdictionSelector' },
    { name: 'DelegationLimits', path: '@/components/custom-agents/policy/DelegationLimits' },
    { name: 'SpendAuthorityCard', path: '@/components/custom-agents/policy/SpendAuthorityCard' },
    { name: 'DataAccessScope', path: '@/components/custom-agents/policy/DataAccessScope' },
  ] }],
  ['policy/rules/page.tsx', { title: 'Policy Rules', description: 'Authoritative policy rule packs', components: [{ name: 'RulePackList', path: '@/components/custom-agents/policy/RulePackList' }] }],
  ['policy/guardrails/page.tsx', { title: 'Guardrails', description: 'Hard limits enforced on agents', components: [{ name: 'GuardrailMatrix', path: '@/components/custom-agents/policy/GuardrailMatrix' }] }],
  ['policy/jurisdiction/page.tsx', { title: 'Jurisdiction', description: 'Applicable jurisdictions', components: [{ name: 'JurisdictionSelector', path: '@/components/custom-agents/policy/JurisdictionSelector' }] }],
  ['policy/delegation/page.tsx', { title: 'Delegation Limits', description: 'What agents may delegate', components: [{ name: 'DelegationLimits', path: '@/components/custom-agents/policy/DelegationLimits' }] }],
  ['policy/spend/page.tsx', { title: 'Spend Authority', description: 'Spending authority granted to agents', components: [{ name: 'SpendAuthorityCard', path: '@/components/custom-agents/policy/SpendAuthorityCard' }] }],
  ['policy/data-access/page.tsx', { title: 'Data Access Scope', description: 'Data accessible to agents', components: [{ name: 'DataAccessScope', path: '@/components/custom-agents/policy/DataAccessScope' }] }],

  ['registry/[agentId]/page.tsx', { title: 'Agent Profile', description: 'Detailed profile for a single agent', dynamic: 'agentId', components: [{ name: 'AgentProfile', path: '@/components/custom-agents/registry/AgentProfile' }] }],
  ['registry/capabilities/page.tsx', { title: 'Capabilities', description: 'Agent capability matrix', components: [{ name: 'AgentCapabilityMatrix', path: '@/components/custom-agents/registry/AgentCapabilityMatrix' }] }],
  ['registry/dependencies/page.tsx', { title: 'Dependencies', description: 'Inter-agent dependency graph', components: [{ name: 'AgentDependencyGraph', path: '@/components/custom-agents/registry/AgentDependencyGraph' }] }],
  ['registry/versions/page.tsx', { title: 'Version History', description: 'Agent version history', components: [{ name: 'AgentVersionHistory', path: '@/components/custom-agents/registry/AgentVersionHistory' }] }],

  ['supervision/page.tsx', { title: 'Supervision', description: 'Approvals, confidence, disagreements, escalations, explainability, and interventions', layout: 'grid2', components: [
    { name: 'AgentSupervisorConsole', path: '@/components/custom-agents/supervision/AgentSupervisorConsole' },
    { name: 'AgentApprovalGate', path: '@/components/custom-agents/supervision/AgentApprovalGate' },
    { name: 'AgentConfidenceGauge', path: '@/components/custom-agents/supervision/AgentConfidenceGauge' },
    { name: 'AgentDisagreementResolver', path: '@/components/custom-agents/supervision/AgentDisagreementResolver' },
    { name: 'AgentEscalationInbox', path: '@/components/custom-agents/supervision/AgentEscalationInbox' },
    { name: 'AgentExplainabilityPanel', path: '@/components/custom-agents/supervision/AgentExplainabilityPanel' },
    { name: 'AgentInterventionPanel', path: '@/components/custom-agents/supervision/AgentInterventionPanel' },
  ] }],
  ['supervision/approvals/page.tsx', { title: 'Approvals', description: 'Pending agent approvals', components: [{ name: 'AgentApprovalGate', path: '@/components/custom-agents/supervision/AgentApprovalGate' }] }],
  ['supervision/confidence/page.tsx', { title: 'Confidence', description: 'Agent confidence distribution', components: [{ name: 'AgentConfidenceGauge', path: '@/components/custom-agents/supervision/AgentConfidenceGauge' }] }],
  ['supervision/disagreements/page.tsx', { title: 'Disagreements', description: 'Resolve inter-agent disagreements', components: [{ name: 'AgentDisagreementResolver', path: '@/components/custom-agents/supervision/AgentDisagreementResolver' }] }],
  ['supervision/escalations/page.tsx', { title: 'Escalations', description: 'Escalated items awaiting a human', components: [{ name: 'AgentEscalationInbox', path: '@/components/custom-agents/supervision/AgentEscalationInbox' }] }],
  ['supervision/explainability/page.tsx', { title: 'Explainability', description: 'Why an agent acted as it did', components: [{ name: 'AgentExplainabilityPanel', path: '@/components/custom-agents/supervision/AgentExplainabilityPanel' }] }],
  ['supervision/interventions/page.tsx', { title: 'Interventions', description: 'Human interventions in agent runs', components: [{ name: 'AgentInterventionPanel', path: '@/components/custom-agents/supervision/AgentInterventionPanel' }] }],
];

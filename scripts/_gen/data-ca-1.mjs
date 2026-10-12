// custom-agents wiring data — part 1 (ai, analytics, audit)
export const CA_1 = [
  ['ai/page.tsx', { title: 'AI Agents', description: 'Router, planner, critic, self-healer, and memory summarizer', layout: 'grid2', components: [
    { name: 'aiAgentRouter', path: '@/components/custom-agents/ai/aiAgentRouter' },
    { name: 'aiAgentPlanner', path: '@/components/custom-agents/ai/aiAgentPlanner' },
    { name: 'aiAgentCritic', path: '@/components/custom-agents/ai/aiAgentCritic' },
    { name: 'aiAgentSelfHealer', path: '@/components/custom-agents/ai/aiAgentSelfHealer' },
    { name: 'aiAgentMemorySummarizer', path: '@/components/custom-agents/ai/aiAgentMemorySummarizer' },
  ] }],
  ['ai/router/page.tsx', { title: 'AI Router', description: 'Task routing and model selection', components: [{ name: 'aiAgentRouter', path: '@/components/custom-agents/ai/aiAgentRouter' }] }],
  ['ai/planner/page.tsx', { title: 'AI Planner', description: 'Multi-step task planning', components: [{ name: 'aiAgentPlanner', path: '@/components/custom-agents/ai/aiAgentPlanner' }] }],
  ['ai/critic/page.tsx', { title: 'AI Critic', description: 'Output review and quality critique', components: [{ name: 'aiAgentCritic', path: '@/components/custom-agents/ai/aiAgentCritic' }] }],
  ['ai/self-healer/page.tsx', { title: 'AI Self-Healer', description: 'Failure detection and automatic recovery', components: [{ name: 'aiAgentSelfHealer', path: '@/components/custom-agents/ai/aiAgentSelfHealer' }] }],
  ['ai/memory/page.tsx', { title: 'AI Memory Summarizer', description: 'Conversation and context summarization', components: [{ name: 'aiAgentMemorySummarizer', path: '@/components/custom-agents/ai/aiAgentMemorySummarizer' }] }],

  ['analytics/automation/page.tsx', { title: 'Automation Rate', description: 'Share of tasks handled without human intervention', components: [{ name: 'AgentAutomationRate', path: '@/components/custom-agents/analytics/AgentAutomationRate' }] }],
  ['analytics/throughput/page.tsx', { title: 'Throughput', description: 'Tasks completed per period', components: [{ name: 'AgentThroughputChart', path: '@/components/custom-agents/analytics/AgentThroughputChart' }] }],
  ['analytics/roi/page.tsx', { title: 'Agent ROI', description: 'Return on investment from agent automation', components: [{ name: 'AgentRoiCard', path: '@/components/custom-agents/analytics/AgentRoiCard' }] }],
  ['analytics/exceptions/page.tsx', { title: 'Exception Pareto', description: 'Most frequent exception categories', components: [{ name: 'AgentExceptionPareto', path: '@/components/custom-agents/analytics/AgentExceptionPareto' }] }],
  ['analytics/benchmark/page.tsx', { title: 'Benchmarks', description: 'Agent performance against baselines', components: [{ name: 'AgentBenchmarkTable', path: '@/components/custom-agents/analytics/AgentBenchmarkTable' }] }],

  ['audit/page.tsx', { title: 'Agent Audit', description: 'Trail, decisions, replay, custody, compliance, and evidence', layout: 'grid2', components: [
    { name: 'AgentAuditTrail', path: '@/components/custom-agents/audit/AgentAuditTrail' },
    { name: 'AgentDecisionLog', path: '@/components/custom-agents/audit/AgentDecisionLog' },
    { name: 'AgentActionReplay', path: '@/components/custom-agents/audit/AgentActionReplay' },
    { name: 'AgentChainOfCustody', path: '@/components/custom-agents/audit/AgentChainOfCustody' },
    { name: 'AgentComplianceReport', path: '@/components/custom-agents/audit/AgentComplianceReport' },
    { name: 'AgentEvidencePack', path: '@/components/custom-agents/audit/AgentEvidencePack' },
  ] }],
  ['audit/trail/page.tsx', { title: 'Audit Trail', description: 'Immutable record of agent actions', components: [{ name: 'AgentAuditTrail', path: '@/components/custom-agents/audit/AgentAuditTrail' }] }],
  ['audit/decisions/page.tsx', { title: 'Decision Log', description: 'Agent decisions and rationale', components: [{ name: 'AgentDecisionLog', path: '@/components/custom-agents/audit/AgentDecisionLog' }] }],
  ['audit/replay/page.tsx', { title: 'Action Replay', description: 'Replay past agent actions', components: [{ name: 'AgentActionReplay', path: '@/components/custom-agents/audit/AgentActionReplay' }] }],
  ['audit/custody/page.tsx', { title: 'Chain of Custody', description: 'Custody transfers across the agent run', components: [{ name: 'AgentChainOfCustody', path: '@/components/custom-agents/audit/AgentChainOfCustody' }] }],
  ['audit/compliance/page.tsx', { title: 'Compliance Report', description: 'Regulatory compliance summary', components: [{ name: 'AgentComplianceReport', path: '@/components/custom-agents/audit/AgentComplianceReport' }] }],
  ['audit/evidence/page.tsx', { title: 'Evidence Pack', description: 'Supporting evidence for audit', components: [{ name: 'AgentEvidencePack', path: '@/components/custom-agents/audit/AgentEvidencePack' }] }],
];

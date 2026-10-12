// custom-agents wiring data — part 3 (customs-agents H–Z, memory)
export const CA_3 = [
  ['customs-agents/clearance/page.tsx', { title: 'Clearance Follow-Up Agent', description: 'Track and follow up clearance', components: [{ name: 'ClearanceFollowUpAgent', path: '@/components/custom-agents/customs-agents/ClearanceFollowUpAgent' }] }],
  ['customs-agents/permits/page.tsx', { title: 'Permit Sourcing Agent', description: 'Source and track permits', components: [{ name: 'PermitSourcingAgent', path: '@/components/custom-agents/customs-agents/PermitSourcingAgent' }] }],
  ['customs-agents/bonded/page.tsx', { title: 'Bonded Ledger Agent', description: 'Maintain bonded stock ledger', components: [{ name: 'BondedLedgerAgent', path: '@/components/custom-agents/customs-agents/BondedLedgerAgent' }] }],
  ['customs-agents/exemption/page.tsx', { title: 'Exemption Reconciliation Agent', description: 'Reconcile duty exemptions', components: [{ name: 'ExemptionReconciliationAgent', path: '@/components/custom-agents/customs-agents/ExemptionReconciliationAgent' }] }],
  ['customs-agents/drawback/page.tsx', { title: 'Drawback Recovery Agent', description: 'Recover duty drawback', components: [{ name: 'DrawbackRecoveryAgent', path: '@/components/custom-agents/customs-agents/DrawbackRecoveryAgent' }] }],
  ['customs-agents/audit/page.tsx', { title: 'Post-Clearance Audit Agent', description: 'Post-clearance audit support', components: [{ name: 'PostAuditAgent', path: '@/components/custom-agents/customs-agents/PostAuditAgent' }] }],
  ['customs-agents/zone-gate/page.tsx', { title: 'Zone Gate Agent', description: 'Coordinate zone gate operations', components: [{ name: 'ZoneGateAgent', path: '@/components/custom-agents/customs-agents/ZoneGateAgent' }] }],

  ['memory/page.tsx', { title: 'Agent Memory', description: 'Store, knowledge, context, embeddings, learning, and feedback', layout: 'grid2', components: [
    { name: 'AgentMemoryStore', path: '@/components/custom-agents/memory/AgentMemoryStore' },
    { name: 'AgentKnowledgeBase', path: '@/components/custom-agents/memory/AgentKnowledgeBase' },
    { name: 'AgentContextInspector', path: '@/components/custom-agents/memory/AgentContextInspector' },
    { name: 'AgentEmbeddingExplorer', path: '@/components/custom-agents/memory/AgentEmbeddingExplorer' },
    { name: 'AgentLearningLog', path: '@/components/custom-agents/memory/AgentLearningLog' },
    { name: 'AgentFeedbackLoop', path: '@/components/custom-agents/memory/AgentFeedbackLoop' },
  ] }],
  ['memory/store/page.tsx', { title: 'Memory Store', description: 'Persisted agent memory', components: [{ name: 'AgentMemoryStore', path: '@/components/custom-agents/memory/AgentMemoryStore' }] }],
  ['memory/knowledge/page.tsx', { title: 'Knowledge Base', description: 'Curated knowledge for agents', components: [{ name: 'AgentKnowledgeBase', path: '@/components/custom-agents/memory/AgentKnowledgeBase' }] }],
  ['memory/context/page.tsx', { title: 'Context Inspector', description: 'Inspect assembled context windows', components: [{ name: 'AgentContextInspector', path: '@/components/custom-agents/memory/AgentContextInspector' }] }],
  ['memory/embeddings/page.tsx', { title: 'Embedding Explorer', description: 'Explore vector embeddings', components: [{ name: 'AgentEmbeddingExplorer', path: '@/components/custom-agents/memory/AgentEmbeddingExplorer' }] }],
  ['memory/learning/page.tsx', { title: 'Learning Log', description: 'What agents have learned over time', components: [{ name: 'AgentLearningLog', path: '@/components/custom-agents/memory/AgentLearningLog' }] }],
  ['memory/feedback/page.tsx', { title: 'Feedback Loop', description: 'Human feedback captured for training', components: [{ name: 'AgentFeedbackLoop', path: '@/components/custom-agents/memory/AgentFeedbackLoop' }] }],
];

// custom-agents wiring data — part 4 (monitoring, orchestration)
export const CA_4 = [
  ['monitoring/page.tsx', { title: 'Agent Monitoring', description: 'Fleet health, latency, success rate, cost, drift, SLA, and incidents', layout: 'grid2', components: [
    { name: 'AgentFleetDashboard', path: '@/components/custom-agents/monitoring/AgentFleetDashboard' },
    { name: 'AgentHealthGrid', path: '@/components/custom-agents/monitoring/AgentHealthGrid' },
    { name: 'AgentLatencyChart', path: '@/components/custom-agents/monitoring/AgentLatencyChart' },
    { name: 'AgentSuccessRateChart', path: '@/components/custom-agents/monitoring/AgentSuccessRateChart' },
    { name: 'AgentCostMeter', path: '@/components/custom-agents/monitoring/AgentCostMeter' },
    { name: 'AgentDriftDetector', path: '@/components/custom-agents/monitoring/AgentDriftDetector' },
    { name: 'AgentSlaBoard', path: '@/components/custom-agents/monitoring/AgentSlaBoard' },
    { name: 'AgentIncidentFeed', path: '@/components/custom-agents/monitoring/AgentIncidentFeed' },
  ] }],
  ['monitoring/fleet/page.tsx', { title: 'Agent Fleet', description: 'Status of the running agent fleet', components: [{ name: 'AgentFleetDashboard', path: '@/components/custom-agents/monitoring/AgentFleetDashboard' }] }],
  ['monitoring/latency/page.tsx', { title: 'Latency', description: 'Agent response latency over time', components: [{ name: 'AgentLatencyChart', path: '@/components/custom-agents/monitoring/AgentLatencyChart' }] }],
  ['monitoring/success-rate/page.tsx', { title: 'Success Rate', description: 'Share of successful agent runs', components: [{ name: 'AgentSuccessRateChart', path: '@/components/custom-agents/monitoring/AgentSuccessRateChart' }] }],
  ['monitoring/cost/page.tsx', { title: 'Cost', description: 'Token and compute cost per agent', components: [{ name: 'AgentCostMeter', path: '@/components/custom-agents/monitoring/AgentCostMeter' }] }],
  ['monitoring/drift/page.tsx', { title: 'Drift Detection', description: 'Detect behavioral drift in agents', components: [{ name: 'AgentDriftDetector', path: '@/components/custom-agents/monitoring/AgentDriftDetector' }] }],
  ['monitoring/sla/page.tsx', { title: 'SLA Board', description: 'Service-level objectives and breaches', components: [{ name: 'AgentSlaBoard', path: '@/components/custom-agents/monitoring/AgentSlaBoard' }] }],
  ['monitoring/incidents/page.tsx', { title: 'Incidents', description: 'Agent incidents and resolution', components: [{ name: 'AgentIncidentFeed', path: '@/components/custom-agents/monitoring/AgentIncidentFeed' }] }],

  ['orchestration/page.tsx', { title: 'Orchestration', description: 'Coordinate agents across queues, canvas, and concurrency', layout: 'grid2', components: [
    { name: 'AgentOrchestrator', path: '@/components/custom-agents/orchestration/AgentOrchestrator' },
    { name: 'AgentQueueBoard', path: '@/components/custom-agents/orchestration/AgentQueueBoard' },
    { name: 'AgentConcurrencyMeter', path: '@/components/custom-agents/orchestration/AgentConcurrencyMeter' },
    { name: 'AgentWorkflowCanvas', path: '@/components/custom-agents/orchestration/AgentWorkflowCanvas' },
  ] }],
  ['orchestration/queue/page.tsx', { title: 'Orchestration Queue', description: 'Queued orchestration work', components: [{ name: 'AgentQueueBoard', path: '@/components/custom-agents/orchestration/AgentQueueBoard' }] }],
  ['orchestration/concurrency/page.tsx', { title: 'Concurrency', description: 'Concurrent agent execution', components: [{ name: 'AgentConcurrencyMeter', path: '@/components/custom-agents/orchestration/AgentConcurrencyMeter' }] }],
  ['orchestration/canvas/page.tsx', { title: 'Orchestration Canvas', description: 'Visual orchestration graph', components: [{ name: 'AgentWorkflowCanvas', path: '@/components/custom-agents/orchestration/AgentWorkflowCanvas' }] }],
  ['orchestration/runs/page.tsx', { title: 'Orchestration Runs', description: 'History of orchestration runs', components: [{ name: 'AgentRunTimeline', path: '@/components/custom-agents/orchestration/AgentRunTimeline' }] }],
  ['orchestration/runs/[runId]/page.tsx', { title: 'Run Detail', description: 'Inspect a single orchestration run', dynamic: 'runId', components: [{ name: 'AgentRunInspector', path: '@/components/custom-agents/orchestration/AgentRunInspector' }] }],
];

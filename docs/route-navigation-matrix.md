# Route and Navigation Matrix

> Generated from the App Router source tree on 12 Oct 2026. There are 342 authenticated page files. Next.js route groups are omitted from URLs. A page file is only evidence that a route exists; it is not evidence that its workflows or permissions work.

## Public marketing navigation

| Item | Destination | Implementing page | Status |
|---|---|---|---|
| Product | `/#product` | `(marketing)/page.tsx` | Anchor destination; verify section id |
| Workflow | `/workflow` | `(marketing)/workflow/page.tsx` | Page exists |
| FIZ | `/solutions/fiz` | `(marketing)/solutions/fiz/page.tsx` | Page exists |
| FCZ | `/solutions/fcz` | `(marketing)/solutions/fcz/page.tsx` | Page exists |
| Pricing | `/pricing` | `(marketing)/pricing/page.tsx` | Page exists |
| API docs | `/api-docs` | `(marketing)/api-docs/page.tsx` | Page exists |
| Customers | `/customers` | `(marketing)/customers/page.tsx` | Page exists |
| Sign in | `/login` | `(marketing)/login/page.tsx` | Page exists; auth configuration not validated |
| Book a demo | `/demo` | `(marketing)/demo/page.tsx` | Page exists |

The public navbar is `components/marketing/shell/Navbar.tsx`; its links were corrected to existing public routes. The authenticated shell uses a separate topbar in `components/marketing/layout/MarketingNavbar.tsx`.

## All authenticated routes

| URL | Page source | Directly imported domain components |
|---|---|---|
| `/admin/audit-log` | `app/(app)/admin/audit-log/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/billing` | `app/(app)/admin/billing/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/roles/matrix` | `app/(app)/admin/roles/matrix/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/roles` | `app/(app)/admin/roles/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/rule-packs/[id]` | `app/(app)/admin/rule-packs/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/rule-packs` | `app/(app)/admin/rule-packs/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/tenants/[id]` | `app/(app)/admin/tenants/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/tenants/new` | `app/(app)/admin/tenants/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/tenants` | `app/(app)/admin/tenants/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/users/[id]` | `app/(app)/admin/users/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/users/new` | `app/(app)/admin/users/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/users` | `app/(app)/admin/users/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/zones/[id]` | `app/(app)/admin/zones/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/zones/new` | `app/(app)/admin/zones/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/admin/zones` | `app/(app)/admin/zones/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/bonded` | `app/(app)/bonded/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/workflow/BondedWorkflowExplorer`, `components/fiz-fcz/workflow/BondedLedgerEventInspector`, `components/fiz-fcz/workflow/ExceptionPathSummary`, `components/fiz-fcz/workflow/AgentOrchestrationMatrix`, `components/fiz-fcz/workflow/DigitalTwinOverlay` |
| `/bonded-workflow` | `app/(app)/bonded-workflow/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/workflow/BondedWorkflowExplorer`, `components/fiz-fcz/workflow/BondedLedgerEventInspector`, `components/fiz-fcz/workflow/ExceptionPathSummary`, `components/fiz-fcz/workflow/AgentOrchestrationMatrix`, `components/fiz-fcz/workflow/DigitalTwinOverlay` |
| `/cargo/[id]` | `app/(app)/cargo/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/analytics` | `app/(app)/cargo/analytics/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/bulk/break-bulk` | `app/(app)/cargo/bulk/break-bulk/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/bulk/containerized` | `app/(app)/cargo/bulk/containerized/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/bulk/dry` | `app/(app)/cargo/bulk/dry/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/bulk/liquid` | `app/(app)/cargo/bulk/liquid/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/bulk` | `app/(app)/cargo/bulk/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/fcz/break-bulk` | `app/(app)/cargo/fcz/break-bulk/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/fcz` | `app/(app)/cargo/fcz/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/fcz/reexport` | `app/(app)/cargo/fcz/reexport/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/fcz/repackaging` | `app/(app)/cargo/fcz/repackaging/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/fcz/transhipment` | `app/(app)/cargo/fcz/transhipment/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/fiz/finished-goods` | `app/(app)/cargo/fiz/finished-goods/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/fiz/machinery` | `app/(app)/cargo/fiz/machinery/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/fiz` | `app/(app)/cargo/fiz/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/fiz/raw-materials` | `app/(app)/cargo/fiz/raw-materials/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/hazmat` | `app/(app)/cargo/hazmat/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/hazmat/segregation` | `app/(app)/cargo/hazmat/segregation/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo/new` | `app/(app)/cargo/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/cargo` | `app/(app)/cargo/page.tsx` | `components/cargo/CargoWorkspace` |
| `/custom-agents/ai/critic` | `app/(app)/custom-agents/ai/critic/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/ai/memory` | `app/(app)/custom-agents/ai/memory/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/ai` | `app/(app)/custom-agents/ai/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/ai/planner` | `app/(app)/custom-agents/ai/planner/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/ai/router` | `app/(app)/custom-agents/ai/router/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/ai/self-healer` | `app/(app)/custom-agents/ai/self-healer/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/analytics/automation` | `app/(app)/custom-agents/analytics/automation/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/analytics/benchmark` | `app/(app)/custom-agents/analytics/benchmark/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/analytics/exceptions` | `app/(app)/custom-agents/analytics/exceptions/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/analytics` | `app/(app)/custom-agents/analytics/page.tsx` | `components/dashboard/page/PageHeader`, `components/custom-agents/analytics/AgentAutomationRate`, `components/custom-agents/analytics/AgentBenchmarkTable`, `components/custom-agents/analytics/AgentExceptionPareto`, `components/custom-agents/analytics/AgentRoiCard`, `components/custom-agents/analytics/AgentThroughputChart` |
| `/custom-agents/analytics/roi` | `app/(app)/custom-agents/analytics/roi/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/analytics/throughput` | `app/(app)/custom-agents/analytics/throughput/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/audit/compliance` | `app/(app)/custom-agents/audit/compliance/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/audit/custody` | `app/(app)/custom-agents/audit/custody/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/audit/decisions` | `app/(app)/custom-agents/audit/decisions/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/audit/evidence` | `app/(app)/custom-agents/audit/evidence/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/audit` | `app/(app)/custom-agents/audit/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/audit/replay` | `app/(app)/custom-agents/audit/replay/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/audit/trail` | `app/(app)/custom-agents/audit/trail/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/builder/[agentId]` | `app/(app)/custom-agents/builder/[agentId]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/builder/new` | `app/(app)/custom-agents/builder/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/builder` | `app/(app)/custom-agents/builder/page.tsx` | `components/dashboard/page/PageHeader`, `components/custom-agents/builder/AgentBuilderExperience` |
| `/custom-agents/builder/publish` | `app/(app)/custom-agents/builder/publish/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/builder/test` | `app/(app)/custom-agents/builder/test/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/audit` | `app/(app)/custom-agents/customs-agents/audit/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/bonded` | `app/(app)/custom-agents/customs-agents/bonded/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/classification` | `app/(app)/custom-agents/customs-agents/classification/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/clearance` | `app/(app)/custom-agents/customs-agents/clearance/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/documents` | `app/(app)/custom-agents/customs-agents/documents/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/drawback` | `app/(app)/custom-agents/customs-agents/drawback/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/duty` | `app/(app)/custom-agents/customs-agents/duty/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/exemption` | `app/(app)/custom-agents/customs-agents/exemption/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/filing` | `app/(app)/custom-agents/customs-agents/filing/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/origin` | `app/(app)/custom-agents/customs-agents/origin/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents` | `app/(app)/custom-agents/customs-agents/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/permits` | `app/(app)/custom-agents/customs-agents/permits/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/screening` | `app/(app)/custom-agents/customs-agents/screening/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/tariff` | `app/(app)/custom-agents/customs-agents/tariff/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/valuation` | `app/(app)/custom-agents/customs-agents/valuation/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/customs-agents/zone-gate` | `app/(app)/custom-agents/customs-agents/zone-gate/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/memory/context` | `app/(app)/custom-agents/memory/context/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/memory/embeddings` | `app/(app)/custom-agents/memory/embeddings/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/memory/feedback` | `app/(app)/custom-agents/memory/feedback/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/memory/knowledge` | `app/(app)/custom-agents/memory/knowledge/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/memory/learning` | `app/(app)/custom-agents/memory/learning/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/memory` | `app/(app)/custom-agents/memory/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/memory/store` | `app/(app)/custom-agents/memory/store/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/monitoring/cost` | `app/(app)/custom-agents/monitoring/cost/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/monitoring/drift` | `app/(app)/custom-agents/monitoring/drift/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/monitoring/fleet` | `app/(app)/custom-agents/monitoring/fleet/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/monitoring/incidents` | `app/(app)/custom-agents/monitoring/incidents/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/monitoring/latency` | `app/(app)/custom-agents/monitoring/latency/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/monitoring` | `app/(app)/custom-agents/monitoring/page.tsx` | `components/dashboard/page/PageHeader`, `components/custom-agents/monitoring/AgentFleetDashboard`, `components/custom-agents/monitoring/AgentHealthGrid`, `components/custom-agents/monitoring/AgentLatencyChart`, `components/custom-agents/monitoring/AgentSuccessRateChart`, `components/custom-agents/monitoring/AgentCostMeter`, `components/custom-agents/monitoring/AgentDriftDetector`, `components/custom-agents/monitoring/AgentSlaBoard`, `components/custom-agents/monitoring/AgentIncidentFeed` |
| `/custom-agents/monitoring/sla` | `app/(app)/custom-agents/monitoring/sla/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/monitoring/success-rate` | `app/(app)/custom-agents/monitoring/success-rate/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/orchestration/canvas` | `app/(app)/custom-agents/orchestration/canvas/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/orchestration/concurrency` | `app/(app)/custom-agents/orchestration/concurrency/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/orchestration` | `app/(app)/custom-agents/orchestration/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/orchestration/queue` | `app/(app)/custom-agents/orchestration/queue/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/orchestration/runs/[runId]` | `app/(app)/custom-agents/orchestration/runs/[runId]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/orchestration/runs` | `app/(app)/custom-agents/orchestration/runs/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents` | `app/(app)/custom-agents/page.tsx` | `components/dashboard/page/PageHeader`, `components/custom-agents/registry/AgentRegistry`, `components/custom-agents/registry/AgentRegistrySearch`, `components/custom-agents/monitoring/AgentFleetDashboard`, `components/custom-agents/monitoring/AgentHealthGrid`, `components/custom-agents/monitoring/AgentLatencyChart`, `components/custom-agents/monitoring/AgentSuccessRateChart`, `components/custom-agents/monitoring/AgentCostMeter`, `components/custom-agents/monitoring/AgentDriftDetector`, `components/custom-agents/monitoring/AgentSlaBoard`, `components/custom-agents/monitoring/AgentIncidentFeed` |
| `/custom-agents/policy/data-access` | `app/(app)/custom-agents/policy/data-access/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/policy/delegation` | `app/(app)/custom-agents/policy/delegation/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/policy/guardrails` | `app/(app)/custom-agents/policy/guardrails/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/policy/jurisdiction` | `app/(app)/custom-agents/policy/jurisdiction/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/policy` | `app/(app)/custom-agents/policy/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/policy/rules` | `app/(app)/custom-agents/policy/rules/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/policy/spend` | `app/(app)/custom-agents/policy/spend/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/registry/[agentId]` | `app/(app)/custom-agents/registry/[agentId]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/registry/capabilities` | `app/(app)/custom-agents/registry/capabilities/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/registry/dependencies` | `app/(app)/custom-agents/registry/dependencies/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/registry` | `app/(app)/custom-agents/registry/page.tsx` | `components/dashboard/page/PageHeader`, `components/custom-agents/registry/AgentRegistry`, `components/custom-agents/registry/AgentRegistrySearch`, `components/custom-agents/registry/AgentCard`, `components/custom-agents/registry/AgentProfile`, `components/custom-agents/registry/AgentCapabilityMatrix`, `components/custom-agents/registry/AgentDependencyGraph`, `components/custom-agents/registry/AgentVersionHistory` |
| `/custom-agents/registry/versions` | `app/(app)/custom-agents/registry/versions/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/supervision/approvals` | `app/(app)/custom-agents/supervision/approvals/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/supervision/confidence` | `app/(app)/custom-agents/supervision/confidence/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/supervision/disagreements` | `app/(app)/custom-agents/supervision/disagreements/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/supervision/escalations` | `app/(app)/custom-agents/supervision/escalations/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/supervision/explainability` | `app/(app)/custom-agents/supervision/explainability/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/supervision/interventions` | `app/(app)/custom-agents/supervision/interventions/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/custom-agents/supervision` | `app/(app)/custom-agents/supervision/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/dashboard/agents` | `app/(app)/dashboard/agents/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/dashboard/alerts` | `app/(app)/dashboard/alerts/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/dashboard/customs` | `app/(app)/dashboard/customs/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/dashboard/operations` | `app/(app)/dashboard/operations/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/dashboard` | `app/(app)/dashboard/page.tsx` | `components/dashboard/page/PageHeader`, `components/dashboard/MetricsOverview`, `components/dashboard/RecentActivity`, `components/ai-composites` |
| `/dashboard/sla` | `app/(app)/dashboard/sla/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/digital-twin/agents/[runId]` | `app/(app)/digital-twin/agents/[runId]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/digital-twin/agents` | `app/(app)/digital-twin/agents/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/agents/TwinAgentList`, `components/digital-twin/agents/TwinAgentInspector` |
| `/digital-twin/analytics` | `app/(app)/digital-twin/analytics/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/analytics/TwinKpiStrip`, `components/digital-twin/analytics/TwinThroughputChart`, `components/digital-twin/analytics/TwinDwellChart`, `components/digital-twin/analytics/TwinUtilizationHeatmap`, `components/digital-twin/analytics/TwinBottleneckPareto`, `components/digital-twin/analytics/TwinCostBreakdown` |
| `/digital-twin/graph` | `app/(app)/digital-twin/graph/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/graph/TwinGraph`, `components/digital-twin/graph/TwinZoomControls`, `components/digital-twin/graph/TwinMiniMap`, `components/digital-twin/graph/TwinLayoutSelector`, `components/digital-twin/graph/TwinLegend` |
| `/digital-twin/live` | `app/(app)/digital-twin/live/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/live/TwinLiveStream`, `components/digital-twin/live/TwinLiveMetrics`, `components/digital-twin/live/TwinLiveAlerts`, `components/digital-twin/live/TwinEventFeed`, `components/digital-twin/live/TwinHeartbeat` |
| `/digital-twin` | `app/(app)/digital-twin/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/digital-twin/twin-canvas`, `components/ai-composites/digital-twin/zone-map`, `components/digital-twin/analytics/TwinKpiStrip`, `components/digital-twin/analytics/TwinThroughputChart`, `components/digital-twin/analytics/TwinDwellChart`, `components/digital-twin/analytics/TwinUtilizationHeatmap`, `components/digital-twin/analytics/TwinBottleneckPareto`, `components/digital-twin/analytics/TwinCostBreakdown` |
| `/digital-twin/reasoning/counterfactual` | `app/(app)/digital-twin/reasoning/counterfactual/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/reasoning/TwinCounterfactualView` |
| `/digital-twin/reasoning` | `app/(app)/digital-twin/reasoning/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/reasoning/TwinReasoning`, `components/digital-twin/reasoning/TwinDecisionTrace`, `components/digital-twin/reasoning/TwinExplainabilityPanel`, `components/digital-twin/reasoning/TwinCounterfactualView` |
| `/digital-twin/reasoning/trace` | `app/(app)/digital-twin/reasoning/trace/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/reasoning/TwinDecisionTrace` |
| `/digital-twin/simulation` | `app/(app)/digital-twin/simulation/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/simulation/TwinScenarioBuilder`, `components/digital-twin/simulation/TwinScenarioLibrary`, `components/digital-twin/simulation/TwinRunControls`, `components/digital-twin/simulation/TwinRunHistory`, `components/digital-twin/simulation/TwinWhatIfPanel`, `components/digital-twin/simulation/TwinRunInspector`, `components/digital-twin/simulation/TwinSandbox` |
| `/digital-twin/simulation/runs/[runId]` | `app/(app)/digital-twin/simulation/runs/[runId]/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/simulation/TwinRunInspector` |
| `/digital-twin/simulation/runs` | `app/(app)/digital-twin/simulation/runs/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/simulation/TwinRunControls`, `components/digital-twin/simulation/TwinRunHistory`, `components/digital-twin/simulation/TwinRunInspector` |
| `/digital-twin/simulation/scenarios/[id]` | `app/(app)/digital-twin/simulation/scenarios/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/simulation/TwinScenarioBuilder` |
| `/digital-twin/simulation/scenarios` | `app/(app)/digital-twin/simulation/scenarios/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/simulation/TwinScenarioBuilder`, `components/digital-twin/simulation/TwinScenarioLibrary` |
| `/digital-twin/simulation/what-if` | `app/(app)/digital-twin/simulation/what-if/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/simulation/TwinWhatIfPanel` |
| `/digital-twin/tasks/board` | `app/(app)/digital-twin/tasks/board/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/tasks/TwinTaskBoard` |
| `/digital-twin/tasks` | `app/(app)/digital-twin/tasks/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/tasks/TwinTaskQueue`, `components/digital-twin/tasks/TwinTaskBoard`, `components/digital-twin/tasks/TwinTaskInspector` |
| `/digital-twin/tasks/queue` | `app/(app)/digital-twin/tasks/queue/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/tasks/TwinTaskQueue` |
| `/digital-twin/zones/bonded` | `app/(app)/digital-twin/zones/bonded/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/zones/TwinBondedLayer` |
| `/digital-twin/zones/fcz` | `app/(app)/digital-twin/zones/fcz/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/zones/TwinFczLayer` |
| `/digital-twin/zones/fiz` | `app/(app)/digital-twin/zones/fiz/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/zones/TwinFizLayer` |
| `/digital-twin/zones` | `app/(app)/digital-twin/zones/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/zones/TwinBondedLayer`, `components/digital-twin/zones/TwinFczLayer`, `components/digital-twin/zones/TwinFizLayer`, `components/digital-twin/zones/TwinGateLayer` |
| `/fcz/analytics` | `app/(app)/fcz/analytics/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/analytics/ZoneThroughputChart`, `components/fiz-fcz/analytics/ZoneDwellTimeChart`, `components/fiz-fcz/analytics/ZoneUtilizationHeatmap`, `components/fiz-fcz/analytics/ZoneTradeBalanceChart`, `components/fiz-fcz/analytics/ZoneRevenueCard`, `components/fiz-fcz/analytics/ZoneTenantMixChart` |
| `/fcz/break-bulk/new` | `app/(app)/fcz/break-bulk/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczBreakBulkPanel` |
| `/fcz/break-bulk` | `app/(app)/fcz/break-bulk/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczBreakBulkPanel` |
| `/fcz/entrepot/matches` | `app/(app)/fcz/entrepot/matches/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczEntrepotTradePanel` |
| `/fcz/entrepot` | `app/(app)/fcz/entrepot/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczEntrepotTradePanel` |
| `/fcz` | `app/(app)/fcz/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczDashboard`, `components/fiz-fcz/fcz/FczBreakBulkPanel`, `components/fiz-fcz/fcz/FczTranshipmentPanel`, `components/fiz-fcz/fcz/FczEntrepotTradePanel`, `components/fiz-fcz/fcz/FczReexportPanel`, `components/fiz-fcz/fcz/FczRepackagingPanel`, `components/fiz-fcz/fcz/FczTradingHouseRegistry`, `components/fiz-fcz/fcz/FczValueAddTracker` |
| `/fcz/reexport/new` | `app/(app)/fcz/reexport/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczReexportPanel` |
| `/fcz/reexport` | `app/(app)/fcz/reexport/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczReexportPanel` |
| `/fcz/repackaging/new` | `app/(app)/fcz/repackaging/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczRepackagingPanel` |
| `/fcz/repackaging` | `app/(app)/fcz/repackaging/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczRepackagingPanel` |
| `/fcz/trading-houses/[id]` | `app/(app)/fcz/trading-houses/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczTradingHouseRegistry` |
| `/fcz/trading-houses/new` | `app/(app)/fcz/trading-houses/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczTradingHouseRegistry` |
| `/fcz/trading-houses` | `app/(app)/fcz/trading-houses/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczTradingHouseRegistry` |
| `/fcz/transhipment/[id]` | `app/(app)/fcz/transhipment/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczTranshipmentPanel` |
| `/fcz/transhipment/new` | `app/(app)/fcz/transhipment/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczTranshipmentPanel` |
| `/fcz/transhipment` | `app/(app)/fcz/transhipment/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczTranshipmentPanel` |
| `/fcz/value-add` | `app/(app)/fcz/value-add/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fcz/FczValueAddTracker` |
| `/fiz/analytics` | `app/(app)/fiz/analytics/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/analytics/ZoneThroughputChart`, `components/fiz-fcz/analytics/ZoneDwellTimeChart`, `components/fiz-fcz/analytics/ZoneUtilizationHeatmap`, `components/fiz-fcz/analytics/ZoneTradeBalanceChart`, `components/fiz-fcz/analytics/ZoneRevenueCard`, `components/fiz-fcz/analytics/ZoneTenantMixChart` |
| `/fiz/approvals/[id]` | `app/(app)/fiz/approvals/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizApprovalWorkflow` |
| `/fiz/approvals` | `app/(app)/fiz/approvals/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizApprovalWorkflow` |
| `/fiz/finished-goods` | `app/(app)/fiz/finished-goods/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizFinishedGoodsRegister` |
| `/fiz/machinery/new` | `app/(app)/fiz/machinery/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizMachineryImport` |
| `/fiz/machinery` | `app/(app)/fiz/machinery/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizMachineryImport` |
| `/fiz/operators/[id]` | `app/(app)/fiz/operators/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/fiz/operators/new` | `app/(app)/fiz/operators/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizOperatorRegistry` |
| `/fiz/operators` | `app/(app)/fiz/operators/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizOperatorRegistry` |
| `/fiz` | `app/(app)/fiz/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizDashboard`, `components/fiz-fcz/fiz/FizRawMaterialLedger`, `components/fiz-fcz/fiz/FizProductionInputTracker`, `components/fiz-fcz/fiz/FizFinishedGoodsRegister`, `components/fiz-fcz/fiz/FizMachineryImport`, `components/fiz-fcz/fiz/FizOperatorRegistry`, `components/fiz-fcz/fiz/FizSubcontractPanel`, `components/fiz-fcz/fiz/FizWastageScrapPanel`, `components/fiz-fcz/fiz/FizApprovalWorkflow` |
| `/fiz/production-inputs/new` | `app/(app)/fiz/production-inputs/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizProductionInputTracker` |
| `/fiz/production-inputs` | `app/(app)/fiz/production-inputs/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizProductionInputTracker` |
| `/fiz/raw-materials/new` | `app/(app)/fiz/raw-materials/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizRawMaterialLedger` |
| `/fiz/raw-materials` | `app/(app)/fiz/raw-materials/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizRawMaterialLedger` |
| `/fiz/subcontract/new` | `app/(app)/fiz/subcontract/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizSubcontractPanel` |
| `/fiz/subcontract` | `app/(app)/fiz/subcontract/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizSubcontractPanel` |
| `/fiz/wastage` | `app/(app)/fiz/wastage/page.tsx` | `components/dashboard/page/PageHeader`, `components/fiz-fcz/fiz/FizWastageScrapPanel` |
| `/integration/agent-mesh/heartbeat` | `app/(app)/integration/agent-mesh/heartbeat/page.tsx` | `components/dashboard/page/PageHeader`, `components/branding/BrandLogo`, `components/ui/button`, `components/integration/core/IntegrationKpiStrip`, `components/integration/core/IntegrationLogTable`, `components/integration/core/IntegrationDetail`, `components/integration/agent-mesh/AgentMeshHeartbeat`, `components/integration/agent-mesh/AgentMeshStatusCard`, `components/ai-elements/message`, `components/ai-elements/reasoning`, `components/ai-elements/queue` |
| `/integration/agent-mesh` | `app/(app)/integration/agent-mesh/page.tsx` | `components/dashboard/page/PageHeader`, `components/integration/AgentMeshGateway` |
| `/integration/agent-mesh/skills` | `app/(app)/integration/agent-mesh/skills/page.tsx` | `components/dashboard/page/PageHeader`, `components/branding/BrandLogo`, `components/ui/button`, `components/ui/card`, `components/ui/badge`, `components/integration/core/IntegrationKpiStrip`, `components/integration/core/IntegrationDetail`, `components/integration/agent-mesh/AgentMeshSkillCatalog`, `components/ai-control/mcp-connection`, `components/ai-elements/plan`, `components/ai-elements/task`, `components/ai-elements/suggestion` |
| `/integration/agent-mesh/topology` | `app/(app)/integration/agent-mesh/topology/page.tsx` | `components/dashboard/page/PageHeader`, `components/branding/BrandLogo`, `components/ui/button`, `components/integration/core/IntegrationKpiStrip`, `components/integration/core/IntegrationHealthGrid`, `components/integration/core/IntegrationDetail`, `components/ai-control/mesh-view`, `components/ai-control/workflow-canvas`, `components/ai-control/scenario-runner`, `components/ai-elements/chain-of-thought`, `components/ai-elements/message` |
| `/integration/auth/api-keys` | `app/(app)/integration/auth/api-keys/page.tsx` | `components/dashboard/page/PageHeader`, `components/branding/BrandLogo`, `components/ui/button`, `components/ui/card`, `components/integration/core/IntegrationKpiStrip`, `components/integration/core/IntegrationDetail`, `components/integration/auth/ApiKeyManager`, `components/ai-elements/message`, `components/ai-elements/environment-variables`, `components/ai-elements/suggestion` |
| `/integration/auth/oauth-clients` | `app/(app)/integration/auth/oauth-clients/page.tsx` | `components/dashboard/page/PageHeader`, `components/branding/BrandLogo`, `components/ui/button`, `components/ui/card`, `components/integration/core/IntegrationKpiStrip`, `components/integration/core/IntegrationDetail`, `components/integration/auth/OAuthClientList`, `components/integration/auth/OAuthClientForm`, `components/ai-elements/plan`, `components/ai-elements/message` |
| `/integration/auth` | `app/(app)/integration/auth/page.tsx` | `components/dashboard/page/PageHeader` |
| `/integration/auth/secrets` | `app/(app)/integration/auth/secrets/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/button`, `components/ui/card`, `components/ui/badge`, `components/integration/core/IntegrationKpiStrip`, `components/integration/core/IntegrationDetail`, `components/integration/auth/IntegrationSecretVault`, `components/ai-elements/message`, `components/ai-elements/environment-variables`, `components/ai-elements/suggestion` |
| `/integration/customs/declarations` | `app/(app)/integration/customs/declarations/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/customs` | `app/(app)/integration/customs/page.tsx` | `components/dashboard/page/PageHeader`, `components/integration/CustomsGateway` |
| `/integration/customs/permits` | `app/(app)/integration/customs/permits/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/customs/tariff` | `app/(app)/integration/customs/tariff/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/edi/asycuda` | `app/(app)/integration/edi/asycuda/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/edi/mappings` | `app/(app)/integration/edi/mappings/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/edi` | `app/(app)/integration/edi/page.tsx` | `components/dashboard/page/PageHeader`, `components/integration/EdiAsycudaMapper` |
| `/integration/edi/segments` | `app/(app)/integration/edi/segments/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/erp/customers` | `app/(app)/integration/erp/customers/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/erp/inventory` | `app/(app)/integration/erp/inventory/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/erp/invoices` | `app/(app)/integration/erp/invoices/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/erp` | `app/(app)/integration/erp/page.tsx` | `components/dashboard/page/PageHeader`, `components/integration`, `components/integration/ERP` |
| `/integration/fiz-fcz/exemption` | `app/(app)/integration/fiz-fcz/exemption/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/fiz-fcz/movement` | `app/(app)/integration/fiz-fcz/movement/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/fiz-fcz` | `app/(app)/integration/fiz-fcz/page.tsx` | `components/dashboard/page/PageHeader`, `components/integration/FizFczGateway` |
| `/integration/health` | `app/(app)/integration/health/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration` | `app/(app)/integration/page.tsx` | `components/dashboard/page/PageHeader`, `components/integration`, `components/integration/ERP`, `components/integration/TMS`, `components/integration/WMS`, `components/integration/CustomsGateway`, `components/integration/FizFczGateway`, `components/integration/AgentMeshGateway`, `components/integration/EdiAsycudaMapper` |
| `/integration/tms/carriers` | `app/(app)/integration/tms/carriers/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/tms` | `app/(app)/integration/tms/page.tsx` | `components/dashboard/page/PageHeader`, `components/integration`, `components/integration/TMS` |
| `/integration/tms/routes` | `app/(app)/integration/tms/routes/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/tms/shipments` | `app/(app)/integration/tms/shipments/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/webhook/deliveries` | `app/(app)/integration/webhook/deliveries/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/webhook` | `app/(app)/integration/webhook/page.tsx` | `components/dashboard/page/PageHeader` |
| `/integration/webhook/subscriptions` | `app/(app)/integration/webhook/subscriptions/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/wms/gate` | `app/(app)/integration/wms/gate/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/wms/movements` | `app/(app)/integration/wms/movements/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/integration/wms` | `app/(app)/integration/wms/page.tsx` | `components/dashboard/page/PageHeader`, `components/integration`, `components/integration/WMS` |
| `/integration/wms/stock` | `app/(app)/integration/wms/stock/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/analytics` | `app/(app)/order-management/analytics/page.tsx` | `components/dashboard/page/PageHeader`, `components/order-management/analytics/OrderAnalytics`, `components/order-management/analytics/OrderVolumeChart`, `components/order-management/analytics/OrderLeadTimeChart`, `components/order-management/analytics/OrderCostBreakdown`, `components/order-management/analytics/OrderExceptionPareto` |
| `/order-management/approvals/escalations` | `app/(app)/order-management/approvals/escalations/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/approvals` | `app/(app)/order-management/approvals/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/orders/purchase-approval-flow` |
| `/order-management/approvals/queue` | `app/(app)/order-management/approvals/queue/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/customs/declarations` | `app/(app)/order-management/customs/declarations/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/customs/duty` | `app/(app)/order-management/customs/duty/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/customs/fta` | `app/(app)/order-management/customs/fta/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/customs/hs` | `app/(app)/order-management/customs/hs/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/customs/origin` | `app/(app)/order-management/customs/origin/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/customs` | `app/(app)/order-management/customs/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/orders/customs-link-panel` |
| `/order-management/customs/permits` | `app/(app)/order-management/customs/permits/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/fulfilment/duty-impact` | `app/(app)/order-management/fulfilment/duty-impact/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/fulfilment` | `app/(app)/order-management/fulfilment/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/orders/order-workbench` |
| `/order-management/fulfilment/planner` | `app/(app)/order-management/fulfilment/planner/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/fulfilment/queue` | `app/(app)/order-management/fulfilment/queue/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/fulfilment/routing` | `app/(app)/order-management/fulfilment/routing/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/manufacturing/[id]` | `app/(app)/order-management/manufacturing/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/manufacturing/bom` | `app/(app)/order-management/manufacturing/bom/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/manufacturing/new` | `app/(app)/order-management/manufacturing/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/manufacturing` | `app/(app)/order-management/manufacturing/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/orders/manufacturing-run-stream` |
| `/order-management/manufacturing/production-input` | `app/(app)/order-management/manufacturing/production-input/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/manufacturing/subcontract` | `app/(app)/order-management/manufacturing/subcontract/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/manufacturing/wastage` | `app/(app)/order-management/manufacturing/wastage/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management` | `app/(app)/order-management/page.tsx` | `components/dashboard/page/PageHeader`, `components/order-management/core/OrderDashboard`, `components/order-management/core/OrderKpiStrip`, `components/ai-composites/orders/order-workbench`, `components/order-management/analytics/OrderAnalytics`, `components/order-management/analytics/OrderVolumeChart`, `components/order-management/analytics/OrderLeadTimeChart`, `components/order-management/analytics/OrderCostBreakdown`, `components/order-management/analytics/OrderExceptionPareto` |
| `/order-management/purchase/[id]` | `app/(app)/order-management/purchase/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/purchase/approvals` | `app/(app)/order-management/purchase/approvals/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/purchase/new` | `app/(app)/order-management/purchase/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/purchase` | `app/(app)/order-management/purchase/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/orders/purchase-approval-flow` |
| `/order-management/purchase/requisition` | `app/(app)/order-management/purchase/requisition/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/trading/[id]` | `app/(app)/order-management/trading/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/trading/entrepot` | `app/(app)/order-management/trading/entrepot/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/trading/new` | `app/(app)/order-management/trading/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/trading` | `app/(app)/order-management/trading/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/orders/trading-match-view` |
| `/order-management/transhipment/break-bulk` | `app/(app)/order-management/transhipment/break-bulk/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/transhipment/manifest` | `app/(app)/order-management/transhipment/manifest/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/transhipment/new` | `app/(app)/order-management/transhipment/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/transhipment` | `app/(app)/order-management/transhipment/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/orders/order-workbench` |
| `/order-management/transhipment/reexport` | `app/(app)/order-management/transhipment/reexport/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/order-management/transhipment/repackaging` | `app/(app)/order-management/transhipment/repackaging/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/search` | `app/(app)/search/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/settings/api-keys` | `app/(app)/settings/api-keys/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/settings/integrations` | `app/(app)/settings/integrations/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/settings/notifications` | `app/(app)/settings/notifications/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/settings/organization` | `app/(app)/settings/organization/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/settings` | `app/(app)/settings/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/settings/profile` | `app/(app)/settings/profile/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/settings/security` | `app/(app)/settings/security/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/trade-ops/analytics` | `app/(app)/trade-ops/analytics/page.tsx` | `components/dashboard/page/PageHeader`, `components/trade-ops/TradeOpsAnalyticsView` |
| `/trade-ops/clearance/[id]` | `app/(app)/trade-ops/clearance/[id]/page.tsx` | `components/trade-ops/TradeOpsDetailView` |
| `/trade-ops/clearance/detention` | `app/(app)/trade-ops/clearance/detention/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/clearance/inspection` | `app/(app)/trade-ops/clearance/inspection/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/trade-ops/clearance` | `app/(app)/trade-ops/clearance/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/compliance/audit` | `app/(app)/trade-ops/compliance/audit/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/compliance/origin` | `app/(app)/trade-ops/compliance/origin/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/compliance` | `app/(app)/trade-ops/compliance/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/compliance/screening` | `app/(app)/trade-ops/compliance/screening/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/compliance/valuation` | `app/(app)/trade-ops/compliance/valuation/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/trade-ops/declarations/[id]` | `app/(app)/trade-ops/declarations/[id]/page.tsx` | `components/trade-ops/TradeOpsDetailView` |
| `/trade-ops/declarations/new` | `app/(app)/trade-ops/declarations/new/page.tsx` | `components/trade-ops/TradeOpsCreatePage` |
| `/trade-ops/declarations` | `app/(app)/trade-ops/declarations/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/documents/[id]` | `app/(app)/trade-ops/documents/[id]/page.tsx` | `components/trade-ops/TradeOpsDetailView` |
| `/trade-ops/documents` | `app/(app)/trade-ops/documents/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/documents/upload` | `app/(app)/trade-ops/documents/upload/page.tsx` | `components/trade-ops/TradeOpsCreatePage` |
| `/trade-ops/duty-calculator` | `app/(app)/trade-ops/duty-calculator/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/hs-classification` | `app/(app)/trade-ops/hs-classification/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/hs-classification/rulings` | `app/(app)/trade-ops/hs-classification/rulings/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/hs-classification/tree` | `app/(app)/trade-ops/hs-classification/tree/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops` | `app/(app)/trade-ops/page.tsx` | `components/trade-ops/dashboard/TradeOpsDashboard` |
| `/trade-ops/permits/[id]` | `app/(app)/trade-ops/permits/[id]/page.tsx` | `components/trade-ops/TradeOpsDetailView` |
| `/trade-ops/permits/new` | `app/(app)/trade-ops/permits/new/page.tsx` | `components/trade-ops/TradeOpsCreatePage` |
| `/trade-ops/permits` | `app/(app)/trade-ops/permits/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/trade-finance/[id]` | `app/(app)/trade-ops/trade-finance/[id]/page.tsx` | `components/trade-ops/TradeOpsDetailView` |
| `/trade-ops/trade-finance/drawback` | `app/(app)/trade-ops/trade-finance/drawback/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/trade-finance/letter-of-credit` | `app/(app)/trade-ops/trade-finance/letter-of-credit/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/trade-finance` | `app/(app)/trade-ops/trade-finance/page.tsx` | `components/trade-ops/TradeOpsListView` |
| `/trade-ops/trade-finance/refunds` | `app/(app)/trade-ops/trade-finance/refunds/page.tsx` | `components/dashboard/page/PageHeader`, `components/ui/card` |
| `/wms/bonded/aging` | `app/(app)/wms/bonded/aging/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/bonded/BondedAgingReport` |
| `/wms/bonded/ledger` | `app/(app)/wms/bonded/ledger/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/bonded/BondedLedgerDashboard` |
| `/wms/bonded` | `app/(app)/wms/bonded/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/bonded/BondedLedgerDashboard`, `components/wms/bonded/BondedStockLedger`, `components/wms/bonded/BondedAgingReport`, `components/wms/bonded/BondedShortageReport`, `components/wms/bonded/BondedGuaranteeCard`, `components/wms/bonded/BondedTransferForm`, `components/wms/bonded/BondedWriteOffPanel` |
| `/wms/bonded/shortage` | `app/(app)/wms/bonded/shortage/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/bonded/BondedShortageReport` |
| `/wms/bonded/transfer` | `app/(app)/wms/bonded/transfer/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/bonded/BondedTransferForm` |
| `/wms/bonded/write-off` | `app/(app)/wms/bonded/write-off/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/bonded/BondedWriteOffPanel` |
| `/wms/exemption/claim` | `app/(app)/wms/exemption/claim/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/wms/exemption-timeline` |
| `/wms/exemption/clawback` | `app/(app)/wms/exemption/clawback/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/wms/exemption-timeline` |
| `/wms/exemption` | `app/(app)/wms/exemption/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/wms/exemption-timeline` |
| `/wms/exemption/reconciliation` | `app/(app)/wms/exemption/reconciliation/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/wms/exemption-timeline` |
| `/wms/exemption/utilization` | `app/(app)/wms/exemption/utilization/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/wms/exemption-timeline` |
| `/wms/forecasting/anomalies` | `app/(app)/wms/forecasting/anomalies/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/live/TwinLiveMetrics` |
| `/wms/forecasting/delays` | `app/(app)/wms/forecasting/delays/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/live/TwinLiveMetrics` |
| `/wms/forecasting` | `app/(app)/wms/forecasting/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/live/TwinLiveMetrics` |
| `/wms/gate/anpr` | `app/(app)/wms/gate/anpr/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/gate/GateAnprFeed` |
| `/wms/gate` | `app/(app)/wms/gate/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/gate` |
| `/wms/gate/passes` | `app/(app)/wms/gate/passes/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/gate` |
| `/wms/gate/queue` | `app/(app)/wms/gate/queue/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/gate/GateQueueMonitor` |
| `/wms/gate/scanner` | `app/(app)/wms/gate/scanner/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/gate/GatePassScanner` |
| `/wms/gate/weighbridge` | `app/(app)/wms/gate/weighbridge/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/gate/GateWeighbridgePanel` |
| `/wms/inbound/[id]` | `app/(app)/wms/inbound/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/inbound/InboundReceiptDetail` |
| `/wms/inbound/asn` | `app/(app)/wms/inbound/asn/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/inbound/InboundAsnList` |
| `/wms/inbound/new` | `app/(app)/wms/inbound/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/inbound/InboundReceiptExperience` |
| `/wms/inbound` | `app/(app)/wms/inbound/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/inbound/InboundDashboard`, `components/wms/inbound/InboundReceiptList`, `components/wms/inbound/InboundAsnList`, `components/wms/inbound/InboundQcPanel`, `components/wms/inbound/InboundPutawayPlanner` |
| `/wms/inbound/qc` | `app/(app)/wms/inbound/qc/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/inbound/InboundQcPanel` |
| `/wms/inventory/[id]` | `app/(app)/wms/inventory/[id]/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/inventory/InventoryDetail` |
| `/wms/inventory/aging` | `app/(app)/wms/inventory/aging/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/inventory/InventoryAgingReport` |
| `/wms/inventory/cycle-count` | `app/(app)/wms/inventory/cycle-count/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/inventory/InventoryCycleCount` |
| `/wms/inventory/holds` | `app/(app)/wms/inventory/holds/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/inventory/InventoryHoldRelease` |
| `/wms/inventory/movements` | `app/(app)/wms/inventory/movements/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/inventory/InventoryMovementLog` |
| `/wms/inventory` | `app/(app)/wms/inventory/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/inventory/InventoryDashboard`, `components/wms/inventory/InventoryList`, `components/wms/inventory/InventoryDetail`, `components/wms/inventory/InventoryAgingReport`, `components/wms/inventory/InventoryBondedVsDomestic`, `components/wms/inventory/InventoryCycleCount`, `components/wms/inventory/InventoryHoldRelease`, `components/wms/inventory/InventoryMovementLog`, `components/wms/inventory/InventorySlotSuggest`, `components/wms/inventory/InventoryValuationCard`, `components/wms/inventory/ReportGenerator` |
| `/wms/logistics` | `app/(app)/wms/logistics/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/zones/TwinMovementLayer` |
| `/wms/logistics/routes` | `app/(app)/wms/logistics/routes/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/zones/TwinMovementLayer` |
| `/wms/logistics/shipments` | `app/(app)/wms/logistics/shipments/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/zones/TwinMovementLayer` |
| `/wms/movement/exceptions` | `app/(app)/wms/movement/exceptions/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/zones/TwinMovementLayer` |
| `/wms/movement/inter-zone` | `app/(app)/wms/movement/inter-zone/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/zones/TwinMovementLayer` |
| `/wms/movement/new` | `app/(app)/wms/movement/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/zones/TwinMovementLayer` |
| `/wms/movement` | `app/(app)/wms/movement/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/zones/TwinMovementLayer` |
| `/wms/movement/tracker` | `app/(app)/wms/movement/tracker/page.tsx` | `components/dashboard/page/PageHeader`, `components/digital-twin/zones/TwinMovementLayer` |
| `/wms/outbound/dispatch` | `app/(app)/wms/outbound/dispatch/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/outbound/OutboundDispatchForm` |
| `/wms/outbound/new` | `app/(app)/wms/outbound/new/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/outbound/OutboundOrderList` |
| `/wms/outbound/pack` | `app/(app)/wms/outbound/pack/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/outbound/OutboundPackPanel` |
| `/wms/outbound` | `app/(app)/wms/outbound/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/outbound/OutboundDashboard`, `components/wms/outbound/OutboundOrderList`, `components/wms/outbound/OutboundPickList`, `components/wms/outbound/OutboundPackPanel`, `components/wms/outbound/OutboundDispatchForm`, `components/wms/outbound/OutboundCustomsLink`, `components/wms/outbound/OutboundDutyCalculator` |
| `/wms/outbound/pick` | `app/(app)/wms/outbound/pick/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/outbound/OutboundPickList` |
| `/wms` | `app/(app)/wms/page.tsx` | `components/dashboard/page/PageHeader`, `components/wms/core/WmsDashboard`, `components/wms/WmsSummaryCard`, `components/wms/core/WmsOperationsPanel` |
| `/wms/slotting/allocation` | `app/(app)/wms/slotting/allocation/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/wms/slot-allocation-canvas` |
| `/wms/slotting/grid` | `app/(app)/wms/slotting/grid/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/wms/slot-allocation-canvas` |
| `/wms/slotting/heatmap` | `app/(app)/wms/slotting/heatmap/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/wms/slot-allocation-canvas` |
| `/wms/slotting/maintenance` | `app/(app)/wms/slotting/maintenance/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/wms/slot-allocation-canvas` |
| `/wms/slotting` | `app/(app)/wms/slotting/page.tsx` | `components/dashboard/page/PageHeader`, `components/ai-composites/wms/slot-allocation-canvas` |

## Known route architecture findings

- `app/(app)/layout.tsx` wraps authenticated-domain pages with `DashboardShell`, `SocketProvider`, and `CommandPalette`. The route group is canonical for product pages.
- `app/(marketing)/layout.tsx` owns public marketing layout. A duplicate root `app/page.tsx` was removed so `/` has one route owner.
- Routes under `(app)` are not currently protected by an app-level session gate. Existing client auth uses a bearer token in local storage; the checked-in NextAuth credentials authorizer returns `null`. Do not interpret the route layout as an authorization boundary.
- Legacy `/integration` and `/trade-ops` names are retained; no URL migration was performed.
- Product capabilities under `components/` are broad; many routes still need backend wiring and integration validation.


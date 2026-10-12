]633;E;echo "";c17e107f-2549-41a4-940e-79d96f81e891]633;C
## Placeholder components (referenced by routes, never authored)

Generated: 2026-10-12T12:17:50+00:00

| Component | Status |
|-----------|--------|
| `components/ai-composites/cargo/hazmat-segregation-view.tsx` | PLACEHOLDER |
| `components/ai-composites/digital-twin/scenario-runner.tsx` | PLACEHOLDER |
| `components/ai-composites/digital-twin/twin-canvas.tsx` | PLACEHOLDER |
| `components/ai-composites/digital-twin/what-if-panel.tsx` | PLACEHOLDER |
| `components/ai-composites/digital-twin/zone-map.tsx` | PLACEHOLDER |
| `components/ai-composites/orders/customs-link-panel.tsx` | PLACEHOLDER |
| `components/ai-composites/orders/manufacturing-run-stream.tsx` | PLACEHOLDER |
| `components/ai-composites/orders/order-workbench.tsx` | PLACEHOLDER |
| `components/ai-composites/orders/purchase-approval-flow.tsx` | PLACEHOLDER |
| `components/ai-composites/orders/trading-match-view.tsx` | PLACEHOLDER |
| `components/digital-twin/agents/TwinAgentHandoffView.tsx` | PLACEHOLDER |
| `components/digital-twin/agents/TwinAgentInspector.tsx` | PLACEHOLDER |
| `components/digital-twin/agents/TwinAgentList.tsx` | PLACEHOLDER |
| `components/digital-twin/agents/TwinAgentRunTimeline.tsx` | PLACEHOLDER |
| `components/digital-twin/analytics/TwinBottleneckPareto.tsx` | PLACEHOLDER |
| `components/digital-twin/analytics/TwinCostBreakdown.tsx` | PLACEHOLDER |
| `components/digital-twin/analytics/TwinDwellChart.tsx` | PLACEHOLDER |
| `components/digital-twin/analytics/TwinKpiStrip.tsx` | PLACEHOLDER |
| `components/digital-twin/analytics/TwinThroughputChart.tsx` | PLACEHOLDER |
| `components/digital-twin/analytics/TwinUtilizationHeatmap.tsx` | PLACEHOLDER |
| `components/digital-twin/graph/TwinGraph.tsx` | PLACEHOLDER |
| `components/digital-twin/graph/TwinLayoutSelector.tsx` | PLACEHOLDER |
| `components/digital-twin/graph/TwinLegend.tsx` | PLACEHOLDER |
| `components/digital-twin/graph/TwinMiniMap.tsx` | PLACEHOLDER |
| `components/digital-twin/graph/TwinZoomControls.tsx` | PLACEHOLDER |
| `components/digital-twin/live/TwinEventFeed.tsx` | PLACEHOLDER |
| `components/digital-twin/live/TwinHeartbeat.tsx` | PLACEHOLDER |
| `components/digital-twin/live/TwinLiveAlerts.tsx` | PLACEHOLDER |
| `components/digital-twin/live/TwinLiveMetrics.tsx` | PLACEHOLDER |
| `components/digital-twin/live/TwinLiveStream.tsx` | PLACEHOLDER |
| `components/digital-twin/reasoning/TwinCounterfactualView.tsx` | PLACEHOLDER |
| `components/digital-twin/reasoning/TwinDecisionTrace.tsx` | PLACEHOLDER |
| `components/digital-twin/reasoning/TwinExplainabilityPanel.tsx` | PLACEHOLDER |
| `components/digital-twin/reasoning/TwinReasoning.tsx` | PLACEHOLDER |
| `components/digital-twin/simulation/TwinRunControls.tsx` | PLACEHOLDER |
| `components/digital-twin/simulation/TwinRunHistory.tsx` | PLACEHOLDER |
| `components/digital-twin/simulation/TwinRunInspector.tsx` | PLACEHOLDER |
| `components/digital-twin/simulation/TwinSandbox.tsx` | PLACEHOLDER |
| `components/digital-twin/simulation/TwinScenarioBuilder.tsx` | PLACEHOLDER |
| `components/digital-twin/simulation/TwinScenarioLibrary.tsx` | PLACEHOLDER |
| `components/digital-twin/simulation/TwinWhatIfPanel.tsx` | PLACEHOLDER |
| `components/digital-twin/tasks/TwinTaskBoard.tsx` | PLACEHOLDER |
| `components/digital-twin/tasks/TwinTaskInspector.tsx` | PLACEHOLDER |
| `components/digital-twin/tasks/TwinTaskQueue.tsx` | PLACEHOLDER |
| `components/digital-twin/zones/TwinBondedLayer.tsx` | PLACEHOLDER |
| `components/digital-twin/zones/TwinFczLayer.tsx` | PLACEHOLDER |
| `components/digital-twin/zones/TwinFizLayer.tsx` | PLACEHOLDER |
| `components/digital-twin/zones/TwinGateLayer.tsx` | PLACEHOLDER |

## Placeholder → real-data conversion tracker

Workflow per placeholder:
1. Read the importing route (props shape)
2. Read the matching procedure in `lib/trpc/router.ts`
3. Write the component with `'use client'`, `trpc.X.Y.useQuery`, and all four states
4. Verify with `npx tsc --noEmit`
5. Delete the row below when the component is real

| # | Component | Domain batch | Status |
|---|-----------|--------------|--------|
| 1 | `ai-composites/wms/exemption-timeline` | wms/exemption | ⬜ |
| 2 | `ai-composites/wms/slot-allocation-canvas` | wms/slotting | ⬜ |
| 3 | `digital-twin/zones/TwinMovementLayer` | wms/movement | ⬜ |
| 4 | `ai-composites/orders/order-workbench` | order-management | ⬜ |
| 5 | `ai-composites/orders/purchase-approval-flow` | order-management | ⬜ |
| 6 | `ai-composites/orders/customs-link-panel` | order-management | ⬜ |
| 7 | `ai-composites/orders/manufacturing-run-stream` | order-management | ⬜ |
| 8 | `ai-composites/orders/trading-match-view` | order-management | ⬜ |
| 9-37 | `digital-twin/**` (29 remaining after TwinMovementLayer) | digital-twin | ⬜ |
| 38-42 | `brokerage/**` (5) | brokerage | ⬜ |
| 43 | `ai-composites/cargo/hazmat-segregation-view` | cargo | ⬜ |
| 44-46 | `ai-composites/digital-twin/**` (3) | digital-twin | ⬜ |

## Type-suppressed files (2026-10-12)

These files have `// @ts-nocheck` as of the baseline commit.
Each must be un-suppressed and fixed when touched for real work:

- `app/(marketing)/verify-email/page.tsx` — `result.reason` narrowing
- `app/(marketing)/verify-email/resend-button.tsx` — `result.error` narrowing
- `components/dashboard/RecentActivity.tsx` — socket payload types
- `components/workflow-studio/edges/workflow-edge.tsx` — custom Edge props
- `components/workflow-studio/types/workflow.ts` — function arity
- `components/workflow-studio/ui/workflow-console.tsx` — args shape mismatch

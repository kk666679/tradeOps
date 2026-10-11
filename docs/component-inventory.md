# Component Inventory

> Source audit generated 12 Oct 2026. Enumerates all 1230 TypeScript component/module files under `components/`. Statuses are conservative source-level findings; they do not claim runtime or security validation.

## Status criteria

- **Production-ready**: requires evidence of real data, permissions, complete interaction states, accessibility, and verification; no component is assigned this status from static enumeration alone.
- **Needs integration**: no direct route-page reference found, or backend/service wiring is unverified.
- **Needs enhancement**: referenced from a page, but static inspection cannot verify the complete production contract.
- **Needs implementation**: source indicates a scaffold, TODO, placeholder, or demo-only capability.
- **Needs consolidation**: duplicate or competing component is known.
- **Feature-gated**: source is visibly controlled by a feature flag.

## Exhaustive file inventory

### `components/ai/`

- `components/ai/LoadingSpinner.tsx` — **needs-integration**

### `components/ai-composites/`

- `components/ai-composites/DigitalTwin.tsx` — **needs-integration**
- `components/ai-composites/Intelligence.tsx` — **needs-integration**
- `components/ai-composites/TradeOps.tsx` — **needs-integration**
- `components/ai-composites/index.ts` — **needs-integration**

### `components/ai-composites/cargo/`

- `components/ai-composites/cargo/bulk-split-canvas.tsx` — **needs-integration**
- `components/ai-composites/cargo/cargo-stream.tsx` — **needs-integration**
- `components/ai-composites/cargo/hazmat-segregation-view.tsx` — **needs-integration**
- `components/ai-composites/cargo/index.ts` — **needs-integration**

### `components/ai-composites/digital-twin/`

- `components/ai-composites/digital-twin/index.ts` — **needs-integration**
- `components/ai-composites/digital-twin/scenario-runner.tsx` — **needs-integration**
- `components/ai-composites/digital-twin/twin-canvas.tsx` — **needs-enhancement**
- `components/ai-composites/digital-twin/what-if-panel.tsx` — **needs-integration**
- `components/ai-composites/digital-twin/zone-map.tsx` — **needs-enhancement**

### `components/ai-composites/fcz/`

- `components/ai-composites/fcz/break-bulk-canvas.tsx` — **needs-integration**
- `components/ai-composites/fcz/entrepot-match-view.tsx` — **needs-integration**
- `components/ai-composites/fcz/index.ts` — **needs-integration**
- `components/ai-composites/fcz/reexport-workbench.tsx` — **needs-integration**
- `components/ai-composites/fcz/repackaging-tracker.tsx` — **needs-integration**
- `components/ai-composites/fcz/transhipment-flow.tsx` — **needs-integration**

### `components/ai-composites/fiz/`

- `components/ai-composites/fiz/bom-viewer.tsx` — **needs-integration**
- `components/ai-composites/fiz/index.ts` — **needs-integration**
- `components/ai-composites/fiz/production-input-stream.tsx` — **needs-integration**
- `components/ai-composites/fiz/raw-material-intake.tsx` — **needs-integration**
- `components/ai-composites/fiz/subcontract-flow.tsx` — **needs-integration**
- `components/ai-composites/fiz/wastage-tracker.tsx` — **needs-integration**

### `components/ai-composites/orders/`

- `components/ai-composites/orders/customs-link-panel.tsx` — **needs-enhancement**
- `components/ai-composites/orders/index.ts` — **needs-integration**
- `components/ai-composites/orders/manufacturing-run-stream.tsx` — **needs-enhancement**
- `components/ai-composites/orders/order-workbench.tsx` — **needs-enhancement**
- `components/ai-composites/orders/purchase-approval-flow.tsx` — **needs-enhancement**
- `components/ai-composites/orders/trading-match-view.tsx` — **needs-enhancement**

### `components/ai-composites/trade-ops/`

- `components/ai-composites/trade-ops/clearance-stream.tsx` — **needs-integration**
- `components/ai-composites/trade-ops/compliance-dashboard.tsx` — **needs-integration**
- `components/ai-composites/trade-ops/declaration-workbench.tsx` — **needs-integration**
- `components/ai-composites/trade-ops/duty-calculator-ui.tsx` — **needs-integration**
- `components/ai-composites/trade-ops/hs-classification-console.tsx` — **needs-integration**
- `components/ai-composites/trade-ops/index.ts` — **needs-integration**
- `components/ai-composites/trade-ops/permit-tracker.tsx` — **needs-integration**

### `components/ai-composites/wms/`

- `components/ai-composites/wms/bonded-ledger-view.tsx` — **needs-integration**
- `components/ai-composites/wms/exemption-timeline.tsx` — **needs-enhancement**
- `components/ai-composites/wms/gate-scanner-stream.tsx` — **needs-integration**
- `components/ai-composites/wms/inbound-stream.tsx` — **needs-integration**
- `components/ai-composites/wms/index.ts` — **needs-integration**
- `components/ai-composites/wms/outbound-pick-stream.tsx` — **needs-integration**
- `components/ai-composites/wms/slot-allocation-canvas.tsx` — **needs-enhancement**

### `components/ai-control/`

- `components/ai-control/edi-viewer.tsx` — **needs-integration**
- `components/ai-control/index.ts` — **needs-integration**
- `components/ai-control/mcp-connection.tsx` — **needs-enhancement**
- `components/ai-control/mesh-view.tsx` — **needs-enhancement**
- `components/ai-control/rule-pack-viewer.tsx` — **needs-integration**
- `components/ai-control/scenario-runner.tsx` — **needs-enhancement**
- `components/ai-control/state-machine-view.tsx` — **needs-integration**
- `components/ai-control/tariff-diff.tsx` — **needs-integration**
- `components/ai-control/webhook-log.tsx` — **needs-integration**
- `components/ai-control/workflow-canvas.tsx` — **needs-enhancement**

### `components/ai-elements/`

- `components/ai-elements/agent.tsx` — **needs-integration**
- `components/ai-elements/artifact.tsx` — **needs-integration**
- `components/ai-elements/attachments.tsx` — **needs-integration**
- `components/ai-elements/audio-player.tsx` — **needs-integration**
- `components/ai-elements/canvas.tsx` — **needs-integration**
- `components/ai-elements/chain-of-thought.tsx` — **needs-enhancement**
- `components/ai-elements/checkpoint.tsx` — **needs-integration**
- `components/ai-elements/code-block.tsx` — **needs-integration**
- `components/ai-elements/commit.tsx` — **needs-integration**
- `components/ai-elements/confirmation.tsx` — **needs-integration**
- `components/ai-elements/connection.tsx` — **needs-integration**
- `components/ai-elements/context.tsx` — **needs-integration**
- `components/ai-elements/controls.tsx` — **needs-integration**
- `components/ai-elements/conversation.tsx` — **needs-integration**
- `components/ai-elements/edge.tsx` — **needs-integration**
- `components/ai-elements/environment-variables.tsx` — **needs-enhancement**
- `components/ai-elements/file-tree.tsx` — **needs-integration**
- `components/ai-elements/image.tsx` — **needs-integration**
- `components/ai-elements/index.ts` — **needs-integration**
- `components/ai-elements/inline-citation.tsx` — **needs-integration**
- `components/ai-elements/jsx-preview.tsx` — **needs-integration**
- `components/ai-elements/logistics-kpi.tsx` — **needs-integration**
- `components/ai-elements/message.tsx` — **needs-enhancement**
- `components/ai-elements/mic-selector.tsx` — **needs-implementation**
- `components/ai-elements/model-selector.tsx` — **needs-integration**
- `components/ai-elements/node.tsx` — **needs-integration**
- `components/ai-elements/open-in-chat.tsx` — **needs-integration**
- `components/ai-elements/package-info.tsx` — **needs-integration**
- `components/ai-elements/panel.tsx` — **needs-integration**
- `components/ai-elements/persona.tsx` — **needs-integration**
- `components/ai-elements/plan.tsx` — **needs-enhancement**
- `components/ai-elements/prompt-input.tsx` — **needs-implementation**
- `components/ai-elements/queue.tsx` — **needs-enhancement**
- `components/ai-elements/reasoning.tsx` — **needs-enhancement**
- `components/ai-elements/sandbox.tsx` — **needs-integration**
- `components/ai-elements/schema-display.tsx` — **needs-integration**
- `components/ai-elements/scm-trends.tsx` — **needs-integration**
- `components/ai-elements/shimmer.tsx` — **needs-integration**
- `components/ai-elements/snippet.tsx` — **needs-integration**
- `components/ai-elements/sources.tsx` — **needs-integration**
- `components/ai-elements/speech-input.tsx` — **needs-integration**
- `components/ai-elements/stack-trace.tsx` — **needs-integration**
- `components/ai-elements/suggestion.tsx` — **needs-enhancement**
- `components/ai-elements/task.tsx` — **needs-enhancement**
- `components/ai-elements/terminal.tsx` — **needs-integration**
- `components/ai-elements/test-results.tsx` — **needs-integration**
- `components/ai-elements/tool.tsx` — **needs-integration**
- `components/ai-elements/toolbar.tsx` — **needs-integration**
- `components/ai-elements/transcription.tsx` — **needs-integration**
- `components/ai-elements/voice-selector.tsx` — **needs-integration**
- `components/ai-elements/web-preview.tsx` — **needs-implementation**

### `components/ai-elements/agent-ui/`

- `components/ai-elements/agent-ui/agent-concurrency-meter.tsx` — **needs-integration**
- `components/ai-elements/agent-ui/agent-cost-meter.tsx` — **needs-integration**
- `components/ai-elements/agent-ui/agent-handoff.tsx` — **needs-integration**
- `components/ai-elements/agent-ui/agent-mesh-graph.tsx` — **needs-integration**
- `components/ai-elements/agent-ui/agent-status.tsx` — **needs-integration**
- `components/ai-elements/agent-ui/index.ts` — **needs-integration**

### `components/ai-elements/audit/`

- `components/ai-elements/audit/audit-trace.tsx` — **needs-integration**
- `components/ai-elements/audit/chain-of-custody.tsx` — **needs-integration**
- `components/ai-elements/audit/decision-log.tsx` — **needs-integration**
- `components/ai-elements/audit/evidence-pack.tsx` — **needs-integration**
- `components/ai-elements/audit/index.ts` — **needs-integration**

### `components/ai-elements/eval/`

- `components/ai-elements/eval/eval-report.tsx` — **needs-integration**
- `components/ai-elements/eval/evals-runner.tsx` — **needs-integration**
- `components/ai-elements/eval/index.ts` — **needs-integration**

### `components/ai-elements/governance/`

- `components/ai-elements/governance/guardrail-badge.tsx` — **needs-integration**
- `components/ai-elements/governance/guardrail-matrix.tsx` — **needs-integration**
- `components/ai-elements/governance/index.ts` — **needs-integration**
- `components/ai-elements/governance/jurisdiction-tag.tsx` — **needs-integration**
- `components/ai-elements/governance/policy-editor.tsx` — **needs-integration**
- `components/ai-elements/governance/spend-authority-card.tsx` — **needs-integration**

### `components/ai-elements/human-loop/`

- `components/ai-elements/human-loop/approval-gate.tsx` — **needs-integration**
- `components/ai-elements/human-loop/escalation-banner.tsx` — **needs-integration**
- `components/ai-elements/human-loop/hitl-prompt.tsx` — **needs-implementation**
- `components/ai-elements/human-loop/index.ts` — **needs-integration**
- `components/ai-elements/human-loop/typed-confirm.tsx` — **needs-integration**

### `components/ai-elements/memory/`

- `components/ai-elements/memory/context-inspector.tsx` — **needs-integration**
- `components/ai-elements/memory/embedding-explorer.tsx` — **needs-integration**
- `components/ai-elements/memory/index.ts` — **needs-integration**
- `components/ai-elements/memory/memory-inspector.tsx` — **needs-integration**

### `components/ai-elements/meta/`

- `components/ai-elements/meta/confidence-gauge.tsx` — **needs-integration**
- `components/ai-elements/meta/cost-meter.tsx` — **needs-integration**
- `components/ai-elements/meta/index.ts` — **needs-integration**
- `components/ai-elements/meta/latency-badge.tsx` — **needs-integration**
- `components/ai-elements/meta/sla-timer.tsx` — **needs-integration**
- `components/ai-elements/meta/token-counter.tsx` — **needs-integration**

### `components/ai-elements/stream/`

- `components/ai-elements/stream/index.ts` — **needs-integration**
- `components/ai-elements/stream/streaming-json.tsx` — **needs-integration**
- `components/ai-elements/stream/streaming-markdown.tsx` — **needs-integration**
- `components/ai-elements/stream/streaming-text.tsx` — **needs-integration**

### `components/ai-theme/`

- `components/ai-theme/index.ts` — **needs-integration**
- `components/ai-theme/motion.ts` — **needs-integration**
- `components/ai-theme/tokens.ts` — **needs-integration**

### `components/bom/`

- `components/bom/index.ts` — **needs-integration**

### `components/bom/ai/`

- `components/bom/ai/aiBomOptimizer.tsx` — **needs-integration**
- `components/bom/ai/aiComponentSubstitution.tsx` — **needs-integration**
- `components/bom/ai/aiCostPredictor.tsx` — **needs-integration**
- `components/bom/ai/aiOriginAdvisor.tsx` — **needs-integration**
- `components/bom/ai/aiWastageAnomalyDetector.tsx` — **needs-integration**
- `components/bom/ai/index.ts` — **needs-integration**

### `components/bom/alternate/`

- `components/bom/alternate/BomAlternateList.tsx` — **needs-integration**
- `components/bom/alternate/BomAlternateMatch.tsx` — **needs-integration**
- `components/bom/alternate/index.ts` — **needs-integration**

### `components/bom/analytics/`

- `components/bom/analytics/BomAnalytics.tsx` — **needs-integration**
- `components/bom/analytics/BomTopComponentsList.tsx` — **needs-integration**
- `components/bom/analytics/BomVolumeChart.tsx` — **needs-integration**
- `components/bom/analytics/index.ts` — **needs-integration**

### `components/bom/approval/`

- `components/bom/approval/BomApprovalCard.tsx` — **needs-integration**
- `components/bom/approval/BomApprovalHistory.tsx` — **needs-integration**
- `components/bom/approval/BomApprovalQueue.tsx` — **needs-integration**
- `components/bom/approval/index.ts` — **needs-integration**

### `components/bom/compare/`

- `components/bom/compare/BomCompare.tsx` — **needs-integration**
- `components/bom/compare/BomDiffView.tsx` — **needs-integration**
- `components/bom/compare/BomRevisionForm.tsx` — **needs-integration**
- `components/bom/compare/BomRevisionList.tsx` — **needs-integration**
- `components/bom/compare/index.ts` — **needs-integration**

### `components/bom/components/`

- `components/bom/components/BomComponentForm.tsx` — **needs-integration**
- `components/bom/components/BomComponentList.tsx` — **needs-integration**
- `components/bom/components/BomComponentPicker.tsx` — **needs-implementation**
- `components/bom/components/BomComponentRow.tsx` — **needs-integration**
- `components/bom/components/index.ts` — **needs-integration**

### `components/bom/core/`

- `components/bom/core/BomDashboard.tsx` — **needs-integration**
- `components/bom/core/BomDetail.tsx` — **needs-integration**
- `components/bom/core/BomEmptyState.tsx` — **needs-integration**
- `components/bom/core/BomFilters.tsx` — **needs-implementation**
- `components/bom/core/BomForm.tsx` — **needs-integration**
- `components/bom/core/BomKpiStrip.tsx` — **needs-integration**
- `components/bom/core/BomList.tsx` — **needs-integration**
- `components/bom/core/BomStatusBadge.tsx` — **needs-integration**
- `components/bom/core/index.ts` — **needs-integration**

### `components/bom/cost/`

- `components/bom/cost/BomCostBreakdownChart.tsx` — **needs-integration**
- `components/bom/cost/BomCostRollup.tsx` — **needs-integration**
- `components/bom/cost/BomCostTrendChart.tsx` — **needs-integration**
- `components/bom/cost/BomDutyImpactCard.tsx` — **needs-integration**
- `components/bom/cost/BomLandedCostCard.tsx` — **needs-integration**
- `components/bom/cost/index.ts` — **needs-integration**

### `components/bom/effectivity/`

- `components/bom/effectivity/BomEffectivityCalendar.tsx` — **needs-integration**
- `components/bom/effectivity/BomEffectivityForm.tsx` — **needs-integration**
- `components/bom/effectivity/index.ts` — **needs-integration**

### `components/bom/io/`

- `components/bom/io/BomCsvMapper.tsx` — **needs-integration**
- `components/bom/io/BomExport.tsx` — **needs-integration**
- `components/bom/io/BomUpload.tsx` — **needs-integration**
- `components/bom/io/index.ts` — **needs-integration**

### `components/bom/origin/`

- `components/bom/origin/BomFtaEligibility.tsx` — **needs-integration**
- `components/bom/origin/BomLocalContentCard.tsx` — **needs-integration**
- `components/bom/origin/BomOriginBreakdown.tsx` — **needs-integration**
- `components/bom/origin/BomOriginMix.tsx` — **needs-integration**
- `components/bom/origin/index.ts` — **needs-integration**

### `components/bom/phantom/`

- `components/bom/phantom/BomPhantomList.tsx` — **needs-integration**
- `components/bom/phantom/BomPhantomToggle.tsx` — **needs-integration**
- `components/bom/phantom/index.ts` — **needs-integration**

### `components/bom/subcontract/`

- `components/bom/subcontract/BomSubcontractLink.tsx` — **needs-integration**
- `components/bom/subcontract/BomSubcontractList.tsx` — **needs-integration**
- `components/bom/subcontract/index.ts` — **needs-integration**

### `components/bom/tree/`

- `components/bom/tree/BomIndentedTree.tsx` — **needs-integration**
- `components/bom/tree/BomLevelIndicator.tsx` — **needs-integration**
- `components/bom/tree/BomMultiLevelView.tsx` — **needs-integration**
- `components/bom/tree/BomTree.tsx` — **needs-integration**
- `components/bom/tree/BomTreeNode.tsx` — **needs-integration**
- `components/bom/tree/index.ts` — **needs-integration**

### `components/bom/where-used/`

- `components/bom/where-used/BomWhereUsed.tsx` — **needs-integration**
- `components/bom/where-used/BomWhereUsedList.tsx` — **needs-integration**
- `components/bom/where-used/index.ts` — **needs-integration**

### `components/bom/yield/`

- `components/bom/yield/BomScrapList.tsx` — **needs-integration**
- `components/bom/yield/BomWastageSummary.tsx` — **needs-integration**
- `components/bom/yield/BomYieldChart.tsx` — **needs-integration**
- `components/bom/yield/BomYieldTracker.tsx` — **needs-integration**
- `components/bom/yield/index.ts` — **needs-integration**

### `components/branding/`

- `components/branding/BrandLogo.tsx` — **needs-enhancement**

### `components/cargo/`

- `components/cargo/CargoWorkspace.tsx` — **needs-implementation**
- `components/cargo/index.ts` — **needs-integration**

### `components/cargo/ai/`

- `components/cargo/ai/aiBreakBulkPlanner.tsx` — **needs-integration**
- `components/cargo/ai/aiCargoAnomalyDetector.tsx` — **needs-integration**
- `components/cargo/ai/aiCargoClassifier.tsx` — **needs-integration**
- `components/cargo/ai/aiCargoRouter.tsx` — **needs-integration**
- `components/cargo/ai/aiDutySuspensionAdvisor.tsx` — **needs-integration**
- `components/cargo/ai/aiHsSuggestion.tsx` — **needs-integration**
- `components/cargo/ai/aiTranshipmentOptimizer.tsx` — **needs-integration**
- `components/cargo/ai/index.ts` — **needs-integration**

### `components/cargo/bulk/`

- `components/cargo/bulk/BulkCargoDashboard.tsx` — **needs-integration**
- `components/cargo/bulk/BulkCargoDetail.tsx` — **needs-integration**
- `components/cargo/bulk/BulkCargoFilters.tsx` — **needs-implementation**
- `components/cargo/bulk/BulkCargoForm.tsx` — **needs-integration**
- `components/cargo/bulk/BulkCargoKpiStrip.tsx` — **needs-integration**
- `components/cargo/bulk/BulkCargoList.tsx` — **needs-integration**
- `components/cargo/bulk/BulkCargoOptimizer.tsx` — **needs-integration**
- `components/cargo/bulk/index.ts` — **needs-integration**

### `components/cargo/bulk/break-bulk/`

- `components/cargo/bulk/break-bulk/BreakBulkDashboard.tsx` — **needs-integration**
- `components/cargo/bulk/break-bulk/BreakBulkDetail.tsx` — **needs-integration**
- `components/cargo/bulk/break-bulk/BreakBulkForm.tsx` — **needs-integration**
- `components/cargo/bulk/break-bulk/BreakBulkList.tsx` — **needs-integration**
- `components/cargo/bulk/break-bulk/BreakBulkSplitPanel.tsx` — **needs-integration**
- `components/cargo/bulk/break-bulk/index.ts` — **needs-integration**

### `components/cargo/bulk/containerized/`

- `components/cargo/bulk/containerized/ContainerizedDashboard.tsx` — **needs-integration**
- `components/cargo/bulk/containerized/ContainerizedDetail.tsx` — **needs-integration**
- `components/cargo/bulk/containerized/ContainerizedForm.tsx` — **needs-integration**
- `components/cargo/bulk/containerized/ContainerizedList.tsx` — **needs-integration**
- `components/cargo/bulk/containerized/ContainerizedSealPanel.tsx` — **needs-integration**
- `components/cargo/bulk/containerized/index.ts` — **needs-integration**

### `components/cargo/bulk/dry/`

- `components/cargo/bulk/dry/DryCargoDashboard.tsx` — **needs-integration**
- `components/cargo/bulk/dry/DryCargoDetail.tsx` — **needs-integration**
- `components/cargo/bulk/dry/DryCargoForm.tsx` — **needs-integration**
- `components/cargo/bulk/dry/DryCargoList.tsx` — **needs-integration**
- `components/cargo/bulk/dry/DryCargoMoisturePanel.tsx` — **needs-integration**
- `components/cargo/bulk/dry/index.ts` — **needs-integration**

### `components/cargo/bulk/liquid/`

- `components/cargo/bulk/liquid/LiquidCargoDashboard.tsx` — **needs-integration**
- `components/cargo/bulk/liquid/LiquidCargoDetail.tsx` — **needs-integration**
- `components/cargo/bulk/liquid/LiquidCargoForm.tsx` — **needs-integration**
- `components/cargo/bulk/liquid/LiquidCargoList.tsx` — **needs-integration**
- `components/cargo/bulk/liquid/LiquidCargoTankPanel.tsx` — **needs-integration**
- `components/cargo/bulk/liquid/index.ts` — **needs-integration**

### `components/cargo/bulk-cargo/`

- `components/cargo/bulk-cargo/BulkCargoDashboard.tsx` — **needs-integration**
- `components/cargo/bulk-cargo/BulkCargoForm.tsx` — **needs-integration**
- `components/cargo/bulk-cargo/BulkCargoList.tsx` — **needs-implementation**
- `components/cargo/bulk-cargo/BulkCargoOptimizer.tsx` — **needs-integration**
- `components/cargo/bulk-cargo/index.ts` — **needs-integration**

### `components/cargo/bulk-cargo/dry-cargo/`

- `components/cargo/bulk-cargo/dry-cargo/DryCargoDashboard.tsx` — **needs-integration**
- `components/cargo/bulk-cargo/dry-cargo/DryCargoForm.tsx` — **needs-integration**
- `components/cargo/bulk-cargo/dry-cargo/DryCargoList.tsx` — **needs-implementation**
- `components/cargo/bulk-cargo/dry-cargo/index.ts` — **needs-integration**

### `components/cargo/bulk-cargo/liquid-cargo/`

- `components/cargo/bulk-cargo/liquid-cargo/LiquidCargoDashboard.tsx` — **needs-integration**
- `components/cargo/bulk-cargo/liquid-cargo/LiquidCargoForm.tsx` — **needs-integration**
- `components/cargo/bulk-cargo/liquid-cargo/LiquidCargoList.tsx` — **needs-integration**
- `components/cargo/bulk-cargo/liquid-cargo/index.ts` — **needs-integration**

### `components/cargo/core/`

- `components/cargo/core/CargoDashboard.tsx` — **needs-integration**
- `components/cargo/core/CargoDetail.tsx` — **needs-integration**
- `components/cargo/core/CargoEmptyState.tsx` — **needs-integration**
- `components/cargo/core/CargoFilters.tsx` — **needs-implementation**
- `components/cargo/core/CargoForm.tsx` — **needs-integration**
- `components/cargo/core/CargoKpiStrip.tsx` — **needs-integration**
- `components/cargo/core/CargoList.tsx` — **needs-integration**
- `components/cargo/core/CargoLoadingSkeleton.tsx` — **needs-integration**
- `components/cargo/core/CargoStatusBadge.tsx` — **needs-integration**
- `components/cargo/core/CargoTimeline.tsx` — **needs-integration**
- `components/cargo/core/index.ts` — **needs-integration**

### `components/cargo/fcz/`

- `components/cargo/fcz/FczBreakBulkForm.tsx` — **needs-integration**
- `components/cargo/fcz/FczCargoDashboard.tsx` — **needs-integration**
- `components/cargo/fcz/FczDutyStatusCard.tsx` — **needs-integration**
- `components/cargo/fcz/FczEntrepotMatch.tsx` — **needs-integration**
- `components/cargo/fcz/FczReexportForm.tsx` — **needs-integration**
- `components/cargo/fcz/FczRepackagingForm.tsx` — **needs-integration**
- `components/cargo/fcz/FczTranshipmentForm.tsx` — **needs-integration**
- `components/cargo/fcz/FczTranshipmentList.tsx` — **needs-integration**
- `components/cargo/fcz/FczValueAddTracker.tsx` — **needs-integration**
- `components/cargo/fcz/index.ts` — **needs-integration**

### `components/cargo/fiz/`

- `components/cargo/fiz/FizBondedStatusCard.tsx` — **needs-integration**
- `components/cargo/fiz/FizCargoDashboard.tsx` — **needs-integration**
- `components/cargo/fiz/FizFinishedGoodsList.tsx` — **needs-integration**
- `components/cargo/fiz/FizMachineryForm.tsx` — **needs-integration**
- `components/cargo/fiz/FizProductionInputIssuer.tsx` — **needs-integration**
- `components/cargo/fiz/FizRawMaterialForm.tsx` — **needs-integration**
- `components/cargo/fiz/FizRawMaterialList.tsx` — **needs-integration**
- `components/cargo/fiz/FizSubcontractCargoForm.tsx` — **needs-integration**
- `components/cargo/fiz/FizWastageForm.tsx` — **needs-integration**
- `components/cargo/fiz/index.ts` — **needs-integration**

### `components/cargo/general/`

- `components/cargo/general/CargoAnalytics.tsx` — **needs-integration**
- `components/cargo/general/CargoDashboard.tsx` — **needs-integration**
- `components/cargo/general/CargoDocumentLinks.tsx` — **needs-integration**
- `components/cargo/general/CargoForm.tsx` — **needs-integration**
- `components/cargo/general/CargoList.tsx` — **needs-implementation**
- `components/cargo/general/CargoOptimizer.tsx` — **needs-implementation**
- `components/cargo/general/CargoReclassifyPanel.tsx` — **needs-integration**
- `components/cargo/general/CargoTracker.tsx` — **needs-integration**
- `components/cargo/general/CargoUpload.tsx` — **needs-integration**
- `components/cargo/general/index.ts` — **needs-integration**

### `components/cargo/hazmat/`

- `components/cargo/hazmat/HazmatCargoDashboard.tsx` — **needs-integration**
- `components/cargo/hazmat/HazmatCargoForm.tsx` — **needs-integration**
- `components/cargo/hazmat/HazmatCargoList.tsx` — **needs-integration**
- `components/cargo/hazmat/HazmatComplianceCard.tsx` — **needs-integration**
- `components/cargo/hazmat/HazmatSegregationView.tsx` — **needs-integration**
- `components/cargo/hazmat/index.ts` — **needs-integration**

### `components/common/`

- `components/common/ProgressBar.tsx` — **needs-integration**
- `components/common/ShipmentCard.tsx` — **needs-integration**
- `components/common/aiaction-card.tsx` — **needs-integration**
- `components/common/aialert.tsx` — **needs-integration**
- `components/common/aiapproval-gate.tsx` — **needs-implementation**
- `components/common/aiaudit-chip.tsx` — **needs-implementation**
- `components/common/aibadge.tsx` — **needs-integration**
- `components/common/aichart-container.tsx` — **needs-implementation**
- `components/common/aichat-assistant.tsx` — **needs-implementation**
- `components/common/aichip.tsx` — **needs-integration**
- `components/common/aicompliance-card.tsx` — **needs-integration**
- `components/common/aiconfidence-bar.tsx` — **needs-implementation**
- `components/common/aidata-point.tsx` — **needs-integration**
- `components/common/aidata-table.tsx` — **needs-integration**
- `components/common/aierror-state.tsx` — **needs-integration**
- `components/common/aifeatures-card.tsx` — **needs-integration**
- `components/common/aiform-generator.tsx` — **needs-implementation**
- `components/common/aiinsight-card.tsx` — **needs-integration**
- `components/common/aijurisdiction-tag.tsx` — **needs-implementation**
- `components/common/ailive-badge.tsx` — **needs-integration**
- `components/common/ailoading-state.tsx` — **needs-integration**
- `components/common/aimetric-card.tsx` — **needs-integration**
- `components/common/ainotification.tsx` — **needs-integration**
- `components/common/aiprogress-card.tsx` — **needs-integration**
- `components/common/airule-pack-card.tsx` — **needs-implementation**
- `components/common/aisearch-bar.tsx` — **needs-implementation**
- `components/common/aistatistic.tsx` — **needs-integration**
- `components/common/aistatus-indicator.tsx` — **needs-integration**
- `components/common/aitabled-fixed.tsx` — **needs-implementation**
- `components/common/aitoggle.tsx` — **needs-integration**
- `components/common/aitooltip.tsx` — **needs-integration**
- `components/common/aizoned-badge.tsx` — **needs-implementation**
- `components/common/analysis-card.tsx` — **needs-integration**
- `components/common/chat-interface.tsx` — **needs-implementation**
- `components/common/document-annotation.tsx` — **needs-implementation**
- `components/common/index.ts` — **needs-integration**
- `components/common/process-timeline.tsx` — **needs-integration**
- `components/common/recommendation-panel.tsx` — **needs-integration**
- `components/common/risk-assessment-card.tsx` — **needs-integration**
- `components/common/version-compare.tsx` — **needs-integration**
- `components/common/workflow-preview.tsx` — **needs-integration**

### `components/custom-agents/`

- `components/custom-agents/index.ts` — **needs-integration**

### `components/custom-agents/ai/`

- `components/custom-agents/ai/aiAgentCritic.tsx` — **needs-implementation**
- `components/custom-agents/ai/aiAgentMemorySummarizer.tsx` — **needs-implementation**
- `components/custom-agents/ai/aiAgentPlanner.tsx` — **needs-implementation**
- `components/custom-agents/ai/aiAgentRouter.tsx` — **needs-implementation**
- `components/custom-agents/ai/aiAgentSelfHealer.tsx` — **needs-implementation**
- `components/custom-agents/ai/index.ts` — **needs-integration**

### `components/custom-agents/analytics/`

- `components/custom-agents/analytics/AgentAutomationRate.tsx` — **needs-implementation**
- `components/custom-agents/analytics/AgentBenchmarkTable.tsx` — **needs-implementation**
- `components/custom-agents/analytics/AgentExceptionPareto.tsx` — **needs-implementation**
- `components/custom-agents/analytics/AgentRoiCard.tsx` — **needs-implementation**
- `components/custom-agents/analytics/AgentThroughputChart.tsx` — **needs-implementation**
- `components/custom-agents/analytics/index.ts` — **needs-integration**

### `components/custom-agents/audit/`

- `components/custom-agents/audit/AgentActionReplay.tsx` — **needs-implementation**
- `components/custom-agents/audit/AgentAuditTrail.tsx` — **needs-implementation**
- `components/custom-agents/audit/AgentChainOfCustody.tsx` — **needs-implementation**
- `components/custom-agents/audit/AgentComplianceReport.tsx` — **needs-implementation**
- `components/custom-agents/audit/AgentDecisionLog.tsx` — **needs-implementation**
- `components/custom-agents/audit/AgentEvidencePack.tsx` — **needs-implementation**
- `components/custom-agents/audit/index.ts` — **needs-integration**

### `components/custom-agents/builder/`

- `components/custom-agents/builder/AgentBuilderExperience.tsx` — **needs-enhancement**
- `components/custom-agents/builder/AgentBuilderWizard.tsx` — **needs-implementation**
- `components/custom-agents/builder/AgentEscalationPolicy.tsx` — **needs-implementation**
- `components/custom-agents/builder/AgentGuardrailEditor.tsx` — **needs-implementation**
- `components/custom-agents/builder/AgentIdentityForm.tsx` — **needs-implementation**
- `components/custom-agents/builder/AgentKnowledgeBinder.tsx` — **needs-implementation**
- `components/custom-agents/builder/AgentPublishPanel.tsx` — **needs-implementation**
- `components/custom-agents/builder/AgentScheduleEditor.tsx` — **needs-implementation**
- `components/custom-agents/builder/AgentSimulationRun.tsx` — **needs-implementation**
- `components/custom-agents/builder/AgentSkillPicker.tsx` — **needs-implementation**
- `components/custom-agents/builder/AgentTestBench.tsx` — **needs-implementation**
- `components/custom-agents/builder/AgentToolBinder.tsx` — **needs-implementation**
- `components/custom-agents/builder/index.ts` — **needs-integration**

### `components/custom-agents/customs-agents/`

- `components/custom-agents/customs-agents/BondedLedgerAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/ClearanceFollowUpAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/CustomsValuationAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/DeclarationFilingAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/DocumentExtractionAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/DrawbackRecoveryAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/DutyOptimizationAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/ExemptionReconciliationAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/HsClassificationAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/OriginDeterminationAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/PermitSourcingAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/PostAuditAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/SanctionScreeningAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/TariffChangeWatcherAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/ZoneGateAgent.tsx` — **needs-implementation**
- `components/custom-agents/customs-agents/index.ts` — **needs-integration**

### `components/custom-agents/memory/`

- `components/custom-agents/memory/AgentContextInspector.tsx` — **needs-implementation**
- `components/custom-agents/memory/AgentEmbeddingExplorer.tsx` — **needs-implementation**
- `components/custom-agents/memory/AgentFeedbackLoop.tsx` — **needs-implementation**
- `components/custom-agents/memory/AgentKnowledgeBase.tsx` — **needs-implementation**
- `components/custom-agents/memory/AgentLearningLog.tsx` — **needs-implementation**
- `components/custom-agents/memory/AgentMemoryStore.tsx` — **needs-implementation**
- `components/custom-agents/memory/index.ts` — **needs-integration**

### `components/custom-agents/monitoring/`

- `components/custom-agents/monitoring/AgentCostMeter.tsx` — **needs-implementation**
- `components/custom-agents/monitoring/AgentDriftDetector.tsx` — **needs-implementation**
- `components/custom-agents/monitoring/AgentFleetDashboard.tsx` — **needs-implementation**
- `components/custom-agents/monitoring/AgentHealthGrid.tsx` — **needs-implementation**
- `components/custom-agents/monitoring/AgentIncidentFeed.tsx` — **needs-implementation**
- `components/custom-agents/monitoring/AgentLatencyChart.tsx` — **needs-implementation**
- `components/custom-agents/monitoring/AgentSlaBoard.tsx` — **needs-implementation**
- `components/custom-agents/monitoring/AgentSuccessRateChart.tsx` — **needs-implementation**
- `components/custom-agents/monitoring/index.ts` — **needs-integration**

### `components/custom-agents/orchestration/`

- `components/custom-agents/orchestration/AgentConcurrencyMeter.tsx` — **needs-implementation**
- `components/custom-agents/orchestration/AgentHandoffEdge.tsx` — **needs-implementation**
- `components/custom-agents/orchestration/AgentHandoffNode.tsx` — **needs-implementation**
- `components/custom-agents/orchestration/AgentOrchestrator.tsx` — **needs-implementation**
- `components/custom-agents/orchestration/AgentQueueBoard.tsx` — **needs-implementation**
- `components/custom-agents/orchestration/AgentRetryPolicyPanel.tsx` — **needs-implementation**
- `components/custom-agents/orchestration/AgentRunInspector.tsx` — **needs-implementation**
- `components/custom-agents/orchestration/AgentRunTimeline.tsx` — **needs-implementation**
- `components/custom-agents/orchestration/AgentWorkflowCanvas.tsx` — **needs-implementation**
- `components/custom-agents/orchestration/index.ts` — **needs-integration**

### `components/custom-agents/policy/`

- `components/custom-agents/policy/DataAccessScope.tsx` — **needs-implementation**
- `components/custom-agents/policy/DelegationLimits.tsx` — **needs-implementation**
- `components/custom-agents/policy/GuardrailMatrix.tsx` — **needs-implementation**
- `components/custom-agents/policy/JurisdictionSelector.tsx` — **needs-implementation**
- `components/custom-agents/policy/PolicyEditor.tsx` — **needs-implementation**
- `components/custom-agents/policy/RulePackList.tsx` — **needs-implementation**
- `components/custom-agents/policy/SpendAuthorityCard.tsx` — **needs-implementation**
- `components/custom-agents/policy/index.ts` — **needs-integration**

### `components/custom-agents/registry/`

- `components/custom-agents/registry/AgentCapabilityMatrix.tsx` — **needs-implementation**
- `components/custom-agents/registry/AgentCard.tsx` — **needs-implementation**
- `components/custom-agents/registry/AgentDependencyGraph.tsx` — **needs-implementation**
- `components/custom-agents/registry/AgentProfile.tsx` — **needs-implementation**
- `components/custom-agents/registry/AgentRegistry.tsx` — **needs-implementation**
- `components/custom-agents/registry/AgentRegistrySearch.tsx` — **needs-implementation**
- `components/custom-agents/registry/AgentVersionHistory.tsx` — **needs-implementation**
- `components/custom-agents/registry/index.ts` — **needs-integration**

### `components/custom-agents/supervision/`

- `components/custom-agents/supervision/AgentApprovalGate.tsx` — **needs-implementation**
- `components/custom-agents/supervision/AgentConfidenceGauge.tsx` — **needs-implementation**
- `components/custom-agents/supervision/AgentDisagreementResolver.tsx` — **needs-implementation**
- `components/custom-agents/supervision/AgentEscalationInbox.tsx` — **needs-implementation**
- `components/custom-agents/supervision/AgentExplainabilityPanel.tsx` — **needs-implementation**
- `components/custom-agents/supervision/AgentHumanInLoop.tsx` — **needs-implementation**
- `components/custom-agents/supervision/AgentInterventionPanel.tsx` — **needs-implementation**
- `components/custom-agents/supervision/AgentSupervisorConsole.tsx` — **needs-implementation**
- `components/custom-agents/supervision/index.ts` — **needs-integration**

### `components/dashboard/`

- `components/dashboard/DashboardGrid.tsx` — **needs-integration**
- `components/dashboard/Header.tsx` — **needs-integration**
- `components/dashboard/MetricsOverview.tsx` — **needs-enhancement**
- `components/dashboard/PageHeader.tsx` — **needs-integration**
- `components/dashboard/RecentActivity.tsx` — **needs-enhancement**
- `components/dashboard/Sidebar.tsx` — **needs-integration**
- `components/dashboard/StatCard.tsx` — **needs-integration**
- `components/dashboard/index.ts` — **needs-integration**

### `components/dashboard/cards/`

- `components/dashboard/cards/AgentStatusCard.tsx` — **needs-integration**
- `components/dashboard/cards/AlertCard.tsx` — **needs-integration**
- `components/dashboard/cards/CustomsStatusCard.tsx` — **needs-integration**
- `components/dashboard/cards/KpiCard.tsx` — **needs-integration**
- `components/dashboard/cards/ProgressCard.tsx` — **needs-integration**
- `components/dashboard/cards/SparklineCard.tsx` — **needs-integration**
- `components/dashboard/cards/StatCard.tsx` — **needs-integration**
- `components/dashboard/cards/TrendCard.tsx` — **needs-integration**
- `components/dashboard/cards/ZoneStatusCard.tsx` — **needs-integration**
- `components/dashboard/cards/index.ts` — **needs-integration**

### `components/dashboard/charts/`

- `components/dashboard/charts/AreaChartTile.tsx` — **needs-integration**
- `components/dashboard/charts/BarChartTile.tsx` — **needs-integration**
- `components/dashboard/charts/DonutChartTile.tsx` — **needs-integration**
- `components/dashboard/charts/HeatmapTile.tsx` — **needs-integration**
- `components/dashboard/charts/LineChartTile.tsx` — **needs-integration**
- `components/dashboard/charts/index.ts` — **needs-integration**

### `components/dashboard/grid/`

- `components/dashboard/grid/DashboardGrid.tsx` — **needs-integration**
- `components/dashboard/grid/GridColumn.tsx` — **needs-integration**
- `components/dashboard/grid/GridRow.tsx` — **needs-integration**
- `components/dashboard/grid/index.ts` — **needs-integration**

### `components/dashboard/logistics/`

- `components/dashboard/logistics/documentUpload.tsx` — **needs-integration**
- `components/dashboard/logistics/page.tsx` — **needs-implementation**

### `components/dashboard/page/`

- `components/dashboard/page/PageActions.tsx` — **needs-integration**
- `components/dashboard/page/PageHeader.tsx` — **needs-enhancement**
- `components/dashboard/page/PageSection.tsx` — **needs-integration**
- `components/dashboard/page/PageTabs.tsx` — **needs-integration**
- `components/dashboard/page/StatCard.tsx` — **needs-integration**
- `components/dashboard/page/index.ts` — **needs-integration**

### `components/dashboard/shell/`

- `components/dashboard/shell/DashboardBreadcrumbs.tsx` — **needs-integration**
- `components/dashboard/shell/DashboardHeader.tsx` — **needs-integration**
- `components/dashboard/shell/DashboardShell.tsx` — **needs-integration**
- `components/dashboard/shell/DashboardSidebar.tsx` — **needs-integration**
- `components/dashboard/shell/DashboardTopbar.tsx` — **needs-integration**
- `components/dashboard/shell/RoleSwitcher.tsx` — **needs-integration**
- `components/dashboard/shell/TenantSwitcher.tsx` — **needs-implementation**
- `components/dashboard/shell/ZoneSwitcher.tsx` — **needs-implementation**
- `components/dashboard/shell/index.ts` — **needs-integration**

### `components/dashboard/states/`

- `components/dashboard/states/EmptyState.tsx` — **needs-integration**
- `components/dashboard/states/ErrorState.tsx` — **needs-integration**
- `components/dashboard/states/LoadingSkeleton.tsx` — **needs-integration**
- `components/dashboard/states/PermissionDenied.tsx` — **needs-integration**
- `components/dashboard/states/index.ts` — **needs-integration**

### `components/dashboard/widgets/`

- `components/dashboard/widgets/AlertsFeed.tsx` — **needs-integration**
- `components/dashboard/widgets/ApprovalsWidget.tsx` — **needs-integration**
- `components/dashboard/widgets/BondedStockWidget.tsx` — **needs-integration**
- `components/dashboard/widgets/DutySuspensionWidget.tsx` — **needs-integration**
- `components/dashboard/widgets/GateTrafficWidget.tsx` — **needs-integration**
- `components/dashboard/widgets/MetricsOverview.tsx` — **needs-integration**
- `components/dashboard/widgets/RecentActivity.tsx` — **needs-integration**
- `components/dashboard/widgets/SlaWidget.tsx` — **needs-integration**
- `components/dashboard/widgets/TasksWidget.tsx` — **needs-integration**
- `components/dashboard/widgets/TranshipmentWidget.tsx` — **needs-integration**
- `components/dashboard/widgets/index.ts` — **needs-integration**

### `components/digital-twin/`

- `components/digital-twin/DigitalTwinProvider.tsx` — **needs-integration**
- `components/digital-twin/Simulator.tsx` — **needs-integration**
- `components/digital-twin/SupplyChainEdge.tsx` — **needs-integration**
- `components/digital-twin/SupplyChainNode.tsx` — **needs-integration**
- `components/digital-twin/TwinAgent.tsx` — **needs-integration**
- `components/digital-twin/TwinGraph.tsx` — **needs-integration**
- `components/digital-twin/TwinLiveStream.tsx` — **needs-integration**
- `components/digital-twin/TwinReasoning.tsx` — **needs-integration**
- `components/digital-twin/TwinSandbox.tsx` — **needs-integration**
- `components/digital-twin/TwinTask.tsx` — **needs-integration**
- `components/digital-twin/index.ts` — **needs-integration**

### `components/digital-twin/agents/`

- `components/digital-twin/agents/TwinAgent.tsx` — **needs-enhancement**
- `components/digital-twin/agents/TwinAgentHandoffView.tsx` — **needs-integration**
- `components/digital-twin/agents/TwinAgentInspector.tsx` — **needs-enhancement**
- `components/digital-twin/agents/TwinAgentList.tsx` — **needs-enhancement**
- `components/digital-twin/agents/TwinAgentRunTimeline.tsx` — **needs-integration**
- `components/digital-twin/agents/index.ts` — **needs-integration**

### `components/digital-twin/ai/`

- `components/digital-twin/ai/aiTwinAnomalyDetector.tsx` — **needs-integration**
- `components/digital-twin/ai/aiTwinBottleneckPredictor.tsx` — **needs-integration**
- `components/digital-twin/ai/aiTwinFlowOptimizer.tsx` — **needs-integration**
- `components/digital-twin/ai/aiTwinReasoningSummarizer.tsx` — **needs-integration**
- `components/digital-twin/ai/aiTwinScenarioRanker.tsx` — **needs-integration**
- `components/digital-twin/ai/index.ts` — **needs-integration**

### `components/digital-twin/analytics/`

- `components/digital-twin/analytics/TwinBottleneckPareto.tsx` — **needs-enhancement**
- `components/digital-twin/analytics/TwinCostBreakdown.tsx` — **needs-enhancement**
- `components/digital-twin/analytics/TwinDwellChart.tsx` — **needs-enhancement**
- `components/digital-twin/analytics/TwinKpiStrip.tsx` — **needs-enhancement**
- `components/digital-twin/analytics/TwinThroughputChart.tsx` — **needs-enhancement**
- `components/digital-twin/analytics/TwinUtilizationHeatmap.tsx` — **needs-enhancement**
- `components/digital-twin/analytics/index.ts` — **needs-integration**

### `components/digital-twin/chain/`

- `components/digital-twin/chain/SupplyChainEdge.tsx` — **needs-integration**
- `components/digital-twin/chain/SupplyChainLegend.tsx` — **needs-integration**
- `components/digital-twin/chain/SupplyChainNode.tsx` — **needs-integration**
- `components/digital-twin/chain/SupplyChainPath.tsx` — **needs-integration**
- `components/digital-twin/chain/index.ts` — **needs-integration**

### `components/digital-twin/graph/`

- `components/digital-twin/graph/TwinEdge.tsx` — **needs-integration**
- `components/digital-twin/graph/TwinGraph.tsx` — **needs-enhancement**
- `components/digital-twin/graph/TwinLayoutSelector.tsx` — **needs-enhancement**
- `components/digital-twin/graph/TwinLegend.tsx` — **needs-enhancement**
- `components/digital-twin/graph/TwinMiniMap.tsx` — **needs-enhancement**
- `components/digital-twin/graph/TwinNode.tsx` — **needs-integration**
- `components/digital-twin/graph/TwinZoomControls.tsx` — **needs-enhancement**
- `components/digital-twin/graph/index.ts` — **needs-integration**

### `components/digital-twin/live/`

- `components/digital-twin/live/TwinEventFeed.tsx` — **needs-enhancement**
- `components/digital-twin/live/TwinHeartbeat.tsx` — **needs-enhancement**
- `components/digital-twin/live/TwinLiveAlerts.tsx` — **needs-enhancement**
- `components/digital-twin/live/TwinLiveMetrics.tsx` — **needs-enhancement**
- `components/digital-twin/live/TwinLiveStream.tsx` — **needs-enhancement**
- `components/digital-twin/live/index.ts` — **needs-integration**

### `components/digital-twin/provider/`

- `components/digital-twin/provider/DigitalTwinProvider.tsx` — **needs-integration**
- `components/digital-twin/provider/TwinClockControl.tsx` — **needs-integration**
- `components/digital-twin/provider/TwinContext.tsx` — **needs-integration**
- `components/digital-twin/provider/TwinHooks.tsx` — **needs-integration**
- `components/digital-twin/provider/TwinZoneRegistry.tsx` — **needs-integration**
- `components/digital-twin/provider/index.ts` — **needs-integration**

### `components/digital-twin/reasoning/`

- `components/digital-twin/reasoning/TwinCounterfactualView.tsx` — **needs-enhancement**
- `components/digital-twin/reasoning/TwinDecisionTrace.tsx` — **needs-enhancement**
- `components/digital-twin/reasoning/TwinExplainabilityPanel.tsx` — **needs-enhancement**
- `components/digital-twin/reasoning/TwinReasoning.tsx` — **needs-enhancement**
- `components/digital-twin/reasoning/index.ts` — **needs-integration**

### `components/digital-twin/simulation/`

- `components/digital-twin/simulation/Simulator.tsx` — **needs-integration**
- `components/digital-twin/simulation/TwinRunControls.tsx` — **needs-enhancement**
- `components/digital-twin/simulation/TwinRunHistory.tsx` — **needs-enhancement**
- `components/digital-twin/simulation/TwinRunInspector.tsx` — **needs-enhancement**
- `components/digital-twin/simulation/TwinSandbox.tsx` — **needs-enhancement**
- `components/digital-twin/simulation/TwinScenarioBuilder.tsx` — **needs-enhancement**
- `components/digital-twin/simulation/TwinScenarioLibrary.tsx` — **needs-enhancement**
- `components/digital-twin/simulation/TwinWhatIfPanel.tsx` — **needs-enhancement**
- `components/digital-twin/simulation/index.ts` — **needs-integration**

### `components/digital-twin/tasks/`

- `components/digital-twin/tasks/TwinTask.tsx` — **needs-enhancement**
- `components/digital-twin/tasks/TwinTaskBoard.tsx` — **needs-enhancement**
- `components/digital-twin/tasks/TwinTaskInspector.tsx` — **needs-enhancement**
- `components/digital-twin/tasks/TwinTaskQueue.tsx` — **needs-enhancement**
- `components/digital-twin/tasks/index.ts` — **needs-integration**

### `components/digital-twin/zones/`

- `components/digital-twin/zones/TwinBondedLayer.tsx` — **needs-enhancement**
- `components/digital-twin/zones/TwinFczLayer.tsx` — **needs-enhancement**
- `components/digital-twin/zones/TwinFizLayer.tsx` — **needs-enhancement**
- `components/digital-twin/zones/TwinGateLayer.tsx` — **needs-enhancement**
- `components/digital-twin/zones/TwinMovementLayer.tsx` — **needs-enhancement**
- `components/digital-twin/zones/index.ts` — **needs-integration**

### `components/fiz-fcz/`

- `components/fiz-fcz/index.ts` — **needs-integration**

### `components/fiz-fcz/ai/`

- `components/fiz-fcz/ai/aiDwellAnomalyDetector.tsx` — **needs-implementation**
- `components/fiz-fcz/ai/aiExemptionAdvisor.tsx` — **needs-implementation**
- `components/fiz-fcz/ai/aiGatePredictor.tsx` — **needs-implementation**
- `components/fiz-fcz/ai/aiTranshipmentRouter.tsx` — **needs-implementation**
- `components/fiz-fcz/ai/aiZoneCopilot.tsx` — **needs-implementation**
- `components/fiz-fcz/ai/aiZoneFlowOptimizer.tsx` — **needs-implementation**
- `components/fiz-fcz/ai/index.ts` — **needs-integration**

### `components/fiz-fcz/analytics/`

- `components/fiz-fcz/analytics/ZoneDwellTimeChart.tsx` — **needs-implementation**
- `components/fiz-fcz/analytics/ZoneRevenueCard.tsx` — **needs-implementation**
- `components/fiz-fcz/analytics/ZoneTenantMixChart.tsx` — **needs-implementation**
- `components/fiz-fcz/analytics/ZoneThroughputChart.tsx` — **needs-implementation**
- `components/fiz-fcz/analytics/ZoneTradeBalanceChart.tsx` — **needs-implementation**
- `components/fiz-fcz/analytics/ZoneUtilizationHeatmap.tsx` — **needs-implementation**
- `components/fiz-fcz/analytics/index.ts` — **needs-integration**

### `components/fiz-fcz/bonded/`

- `components/fiz-fcz/bonded/BondedAgingReport.tsx` — **needs-implementation**
- `components/fiz-fcz/bonded/BondedGuaranteeCard.tsx` — **needs-implementation**
- `components/fiz-fcz/bonded/BondedLocationMap.tsx` — **needs-implementation**
- `components/fiz-fcz/bonded/BondedShortageReport.tsx` — **needs-implementation**
- `components/fiz-fcz/bonded/BondedStockLedger.tsx` — **needs-implementation**
- `components/fiz-fcz/bonded/BondedTransferForm.tsx` — **needs-implementation**
- `components/fiz-fcz/bonded/BondedWarehouseDashboard.tsx` — **needs-implementation**
- `components/fiz-fcz/bonded/BondedWriteOffPanel.tsx` — **needs-implementation**
- `components/fiz-fcz/bonded/index.ts` — **needs-integration**

### `components/fiz-fcz/duty-exemption/`

- `components/fiz-fcz/duty-exemption/ExemptionClaimForm.tsx` — **needs-implementation**
- `components/fiz-fcz/duty-exemption/ExemptionClawbackPanel.tsx` — **needs-implementation**
- `components/fiz-fcz/duty-exemption/ExemptionExpiryMonitor.tsx` — **needs-implementation**
- `components/fiz-fcz/duty-exemption/ExemptionLedger.tsx` — **needs-implementation**
- `components/fiz-fcz/duty-exemption/ExemptionReconciliation.tsx` — **needs-implementation**
- `components/fiz-fcz/duty-exemption/ExemptionSchemeSelector.tsx` — **needs-implementation**
- `components/fiz-fcz/duty-exemption/ExemptionUtilizationChart.tsx` — **needs-implementation**
- `components/fiz-fcz/duty-exemption/index.ts` — **needs-integration**

### `components/fiz-fcz/fcz/`

- `components/fiz-fcz/fcz/FczBreakBulkPanel.tsx` — **needs-implementation**
- `components/fiz-fcz/fcz/FczDashboard.tsx` — **needs-implementation**
- `components/fiz-fcz/fcz/FczEntrepotTradePanel.tsx` — **needs-implementation**
- `components/fiz-fcz/fcz/FczReexportPanel.tsx` — **needs-implementation**
- `components/fiz-fcz/fcz/FczRepackagingPanel.tsx` — **needs-implementation**
- `components/fiz-fcz/fcz/FczTradingHouseRegistry.tsx` — **needs-implementation**
- `components/fiz-fcz/fcz/FczTranshipmentPanel.tsx` — **needs-implementation**
- `components/fiz-fcz/fcz/FczValueAddTracker.tsx` — **needs-implementation**
- `components/fiz-fcz/fcz/index.ts` — **needs-integration**

### `components/fiz-fcz/fiz/`

- `components/fiz-fcz/fiz/FizApprovalWorkflow.tsx` — **needs-implementation**
- `components/fiz-fcz/fiz/FizDashboard.tsx` — **needs-implementation**
- `components/fiz-fcz/fiz/FizFinishedGoodsRegister.tsx` — **needs-implementation**
- `components/fiz-fcz/fiz/FizMachineryImport.tsx` — **needs-implementation**
- `components/fiz-fcz/fiz/FizOperatorRegistry.tsx` — **needs-implementation**
- `components/fiz-fcz/fiz/FizProductionInputTracker.tsx` — **needs-implementation**
- `components/fiz-fcz/fiz/FizRawMaterialLedger.tsx` — **needs-implementation**
- `components/fiz-fcz/fiz/FizSubcontractPanel.tsx` — **needs-implementation**
- `components/fiz-fcz/fiz/FizWastageScrapPanel.tsx` — **needs-implementation**
- `components/fiz-fcz/fiz/index.ts` — **needs-integration**

### `components/fiz-fcz/gate/`

- `components/fiz-fcz/gate/GateAccessBadge.tsx` — **needs-implementation**
- `components/fiz-fcz/gate/GateAnprFeed.tsx` — **needs-implementation**
- `components/fiz-fcz/gate/GateExceptionQueue.tsx` — **needs-implementation**
- `components/fiz-fcz/gate/GateLaneAssignment.tsx` — **needs-implementation**
- `components/fiz-fcz/gate/GatePassIssuer.tsx` — **needs-implementation**
- `components/fiz-fcz/gate/GatePassScanner.tsx` — **needs-implementation**
- `components/fiz-fcz/gate/GateQueueMonitor.tsx` — **needs-implementation**
- `components/fiz-fcz/gate/GateSealVerification.tsx` — **needs-implementation**
- `components/fiz-fcz/gate/GateWeighbridgePanel.tsx` — **needs-implementation**
- `components/fiz-fcz/gate/index.ts` — **needs-integration**

### `components/fiz-fcz/inventory/`

- `components/fiz-fcz/inventory/ZoneCycleCount.tsx` — **needs-implementation**
- `components/fiz-fcz/inventory/ZoneHoldReleasePanel.tsx` — **needs-implementation**
- `components/fiz-fcz/inventory/ZoneInventoryBoard.tsx` — **needs-implementation**
- `components/fiz-fcz/inventory/ZoneInventoryValuation.tsx` — **needs-implementation**
- `components/fiz-fcz/inventory/ZoneSlotAllocation.tsx` — **needs-implementation**
- `components/fiz-fcz/inventory/ZoneStockLedger.tsx` — **needs-implementation**
- `components/fiz-fcz/inventory/index.ts` — **needs-integration**

### `components/fiz-fcz/movement/`

- `components/fiz-fcz/movement/InterZoneTransfer.tsx` — **needs-implementation**
- `components/fiz-fcz/movement/MovementCarnetPanel.tsx` — **needs-implementation**
- `components/fiz-fcz/movement/MovementExceptionPanel.tsx` — **needs-implementation**
- `components/fiz-fcz/movement/MovementManifest.tsx` — **needs-implementation**
- `components/fiz-fcz/movement/MovementTimeline.tsx` — **needs-implementation**
- `components/fiz-fcz/movement/MovementTracker.tsx` — **needs-implementation**
- `components/fiz-fcz/movement/ZoneMovementForm.tsx` — **needs-implementation**
- `components/fiz-fcz/movement/index.ts` — **needs-integration**

### `components/fiz-fcz/tenant/`

- `components/fiz-fcz/tenant/TenantComplianceScore.tsx` — **needs-implementation**
- `components/fiz-fcz/tenant/TenantLeaseCard.tsx` — **needs-implementation**
- `components/fiz-fcz/tenant/TenantOnboarding.tsx` — **needs-implementation**
- `components/fiz-fcz/tenant/TenantPortalPanel.tsx` — **needs-implementation**
- `components/fiz-fcz/tenant/TenantRegistry.tsx` — **needs-implementation**
- `components/fiz-fcz/tenant/TenantUtilityMeter.tsx` — **needs-implementation**
- `components/fiz-fcz/tenant/index.ts` — **needs-integration**

### `components/fiz-fcz/workflow/`

- `components/fiz-fcz/workflow/AgentDirectory.tsx` — **needs-implementation**
- `components/fiz-fcz/workflow/AgentOrchestrationMatrix.tsx` — **needs-enhancement**
- `components/fiz-fcz/workflow/BondedEventTimeline.tsx` — **needs-integration**
- `components/fiz-fcz/workflow/BondedLedgerEventInspector.tsx` — **needs-enhancement**
- `components/fiz-fcz/workflow/BondedWorkflowExplorer.tsx` — **needs-enhancement**
- `components/fiz-fcz/workflow/DigitalTwinOverlay.tsx` — **needs-enhancement**
- `components/fiz-fcz/workflow/ExceptionPathSummary.tsx` — **needs-enhancement**
- `components/fiz-fcz/workflow/WorkflowDetailPanel.tsx` — **needs-integration**
- `components/fiz-fcz/workflow/WorkflowStepList.tsx` — **needs-integration**
- `components/fiz-fcz/workflow/WorkflowToolbar.tsx` — **needs-implementation**
- `components/fiz-fcz/workflow/index.ts` — **needs-integration**
- `components/fiz-fcz/workflow/types.ts` — **needs-integration**
- `components/fiz-fcz/workflow/workflowGraph.ts` — **needs-integration**

### `components/fiz-fcz/workflow/data/`

- `components/fiz-fcz/workflow/data/agents.ts` — **needs-integration**
- `components/fiz-fcz/workflow/data/closeOut.ts` — **needs-integration**
- `components/fiz-fcz/workflow/data/fczSteps.ts` — **needs-integration**
- `components/fiz-fcz/workflow/data/fizSteps.ts` — **needs-integration**
- `components/fiz-fcz/workflow/data/ledger.ts` — **needs-implementation**

### `components/fiz-fcz/workflow/nodes/`

- `components/fiz-fcz/workflow/nodes/AgentNode.tsx` — **needs-integration**
- `components/fiz-fcz/workflow/nodes/LaneNode.tsx` — **needs-integration**
- `components/fiz-fcz/workflow/nodes/NoteNode.tsx` — **needs-integration**
- `components/fiz-fcz/workflow/nodes/StepNode.tsx` — **needs-integration**

### `components/fiz-fcz/zone-core/`

- `components/fiz-fcz/zone-core/ZoneBoundaryMap.tsx` — **needs-implementation**
- `components/fiz-fcz/zone-core/ZoneConfigPanel.tsx` — **needs-implementation**
- `components/fiz-fcz/zone-core/ZoneHierarchyTree.tsx` — **needs-implementation**
- `components/fiz-fcz/zone-core/ZoneOperatingHours.tsx` — **needs-implementation**
- `components/fiz-fcz/zone-core/ZoneProfileCard.tsx` — **needs-implementation**
- `components/fiz-fcz/zone-core/ZoneProvider.tsx` — **needs-implementation**
- `components/fiz-fcz/zone-core/ZoneRegistry.tsx` — **needs-implementation**
- `components/fiz-fcz/zone-core/ZoneSwitcher.tsx` — **needs-implementation**
- `components/fiz-fcz/zone-core/index.ts` — **needs-integration**

### `components/integration/`

- `components/integration/AgentMeshGateway.tsx` — **needs-implementation**
- `components/integration/CustomsGateway.tsx` — **needs-implementation**
- `components/integration/ERP.tsx` — **needs-implementation**
- `components/integration/EdiAsycudaMapper.tsx` — **needs-implementation**
- `components/integration/FizFczGateway.tsx` — **needs-implementation**
- `components/integration/IntegrationDashboard.tsx` — **needs-integration**
- `components/integration/TMS.tsx` — **needs-implementation**
- `components/integration/WMS.tsx` — **needs-implementation**
- `components/integration/index.ts` — **needs-integration**

### `components/integration/agent-mesh/`

- `components/integration/agent-mesh/AgentMeshGateway.tsx` — **needs-integration**
- `components/integration/agent-mesh/AgentMeshHeartbeat.tsx` — **needs-enhancement**
- `components/integration/agent-mesh/AgentMeshLogTable.tsx` — **needs-integration**
- `components/integration/agent-mesh/AgentMeshSkillCatalog.tsx` — **needs-enhancement**
- `components/integration/agent-mesh/AgentMeshStatusCard.tsx` — **needs-enhancement**
- `components/integration/agent-mesh/AgentMeshTopologyView.tsx` — **needs-integration**
- `components/integration/agent-mesh/index.ts` — **needs-integration**

### `components/integration/ai/`

- `components/integration/ai/aiIntegrationAnomalyDetector.tsx` — **needs-integration**
- `components/integration/ai/aiIntegrationHealthMonitor.tsx` — **needs-integration**
- `components/integration/ai/aiIntegrationMappingSuggester.tsx` — **needs-integration**
- `components/integration/ai/aiIntegrationRetryAdvisor.tsx` — **needs-integration**
- `components/integration/ai/index.ts` — **needs-integration**

### `components/integration/auth/`

- `components/integration/auth/ApiKeyForm.tsx` — **needs-integration**
- `components/integration/auth/ApiKeyManager.tsx` — **needs-enhancement**
- `components/integration/auth/ApiKeyTable.tsx` — **needs-integration**
- `components/integration/auth/IntegrationSecretVault.tsx` — **needs-enhancement**
- `components/integration/auth/OAuthClientForm.tsx` — **needs-enhancement**
- `components/integration/auth/OAuthClientList.tsx` — **needs-enhancement**
- `components/integration/auth/index.ts` — **needs-integration**

### `components/integration/core/`

- `components/integration/core/IntegrationDashboard.tsx` — **needs-integration**
- `components/integration/core/IntegrationDetail.tsx` — **needs-enhancement**
- `components/integration/core/IntegrationForm.tsx` — **needs-integration**
- `components/integration/core/IntegrationHealthGrid.tsx` — **needs-enhancement**
- `components/integration/core/IntegrationKpiStrip.tsx` — **needs-enhancement**
- `components/integration/core/IntegrationList.tsx` — **needs-integration**
- `components/integration/core/IntegrationLogTable.tsx` — **needs-enhancement**
- `components/integration/core/index.ts` — **needs-integration**

### `components/integration/customs/`

- `components/integration/customs/CustomsDeclarationBridge.tsx` — **needs-integration**
- `components/integration/customs/CustomsEdiMapper.tsx` — **needs-integration**
- `components/integration/customs/CustomsGateway.tsx` — **needs-integration**
- `components/integration/customs/CustomsLogTable.tsx` — **needs-integration**
- `components/integration/customs/CustomsPermitBridge.tsx` — **needs-integration**
- `components/integration/customs/CustomsStatusCard.tsx` — **needs-integration**
- `components/integration/customs/CustomsTariffSync.tsx` — **needs-integration**
- `components/integration/customs/index.ts` — **needs-integration**

### `components/integration/edi/`

- `components/integration/edi/EdiAsycudaLogTable.tsx` — **needs-integration**
- `components/integration/edi/EdiAsycudaMapper.tsx` — **needs-integration**
- `components/integration/edi/EdiAsycudaStatusCard.tsx` — **needs-integration**
- `components/integration/edi/EdiCodeListLookup.tsx` — **needs-integration**
- `components/integration/edi/EdiMappingEditor.tsx` — **needs-integration**
- `components/integration/edi/EdiSegmentInspector.tsx` — **needs-integration**
- `components/integration/edi/index.ts` — **needs-integration**

### `components/integration/erp/`

- `components/integration/erp/ErpCustomerSync.tsx` — **needs-integration**
- `components/integration/erp/ErpGateway.tsx` — **needs-integration**
- `components/integration/erp/ErpInventorySync.tsx` — **needs-integration**
- `components/integration/erp/ErpInvoiceBridge.tsx` — **needs-integration**
- `components/integration/erp/ErpLogTable.tsx` — **needs-integration**
- `components/integration/erp/ErpStatusCard.tsx` — **needs-integration**
- `components/integration/erp/index.ts` — **needs-integration**

### `components/integration/fiz-fcz/`

- `components/integration/fiz-fcz/FczGatewayPanel.tsx` — **needs-integration**
- `components/integration/fiz-fcz/FizFczExemptionBridge.tsx` — **needs-integration**
- `components/integration/fiz-fcz/FizFczGateway.tsx` — **needs-integration**
- `components/integration/fiz-fcz/FizFczLogTable.tsx` — **needs-integration**
- `components/integration/fiz-fcz/FizFczMovementBridge.tsx` — **needs-integration**
- `components/integration/fiz-fcz/FizFczStatusCard.tsx` — **needs-integration**
- `components/integration/fiz-fcz/FizGatewayPanel.tsx` — **needs-integration**
- `components/integration/fiz-fcz/index.ts` — **needs-integration**

### `components/integration/gateway/`

- `components/integration/gateway/GatewayCircuitBreaker.tsx` — **needs-integration**
- `components/integration/gateway/GatewayPayloadInspector.tsx` — **needs-integration**
- `components/integration/gateway/GatewayRateLimiter.tsx` — **needs-integration**
- `components/integration/gateway/GatewayRetryPolicy.tsx` — **needs-integration**
- `components/integration/gateway/GatewayRouter.tsx` — **needs-integration**
- `components/integration/gateway/GatewayShell.tsx` — **needs-integration**
- `components/integration/gateway/index.ts` — **needs-integration**

### `components/integration/tms/`

- `components/integration/tms/TmsCarrierBridge.tsx` — **needs-integration**
- `components/integration/tms/TmsGateway.tsx` — **needs-integration**
- `components/integration/tms/TmsLogTable.tsx` — **needs-integration**
- `components/integration/tms/TmsRouteSync.tsx` — **needs-integration**
- `components/integration/tms/TmsShipmentSync.tsx` — **needs-integration**
- `components/integration/tms/TmsStatusCard.tsx` — **needs-integration**
- `components/integration/tms/index.ts` — **needs-integration**

### `components/integration/webhook/`

- `components/integration/webhook/WebhookDeliveryInspector.tsx` — **needs-integration**
- `components/integration/webhook/WebhookGateway.tsx` — **needs-integration**
- `components/integration/webhook/WebhookLogTable.tsx` — **needs-integration**
- `components/integration/webhook/WebhookStatusCard.tsx` — **needs-integration**
- `components/integration/webhook/WebhookSubscriptionList.tsx` — **needs-integration**
- `components/integration/webhook/index.ts` — **needs-integration**

### `components/integration/wms/`

- `components/integration/wms/WmsGateBridge.tsx` — **needs-integration**
- `components/integration/wms/WmsGateway.tsx` — **needs-integration**
- `components/integration/wms/WmsLogTable.tsx` — **needs-integration**
- `components/integration/wms/WmsMovementSync.tsx` — **needs-integration**
- `components/integration/wms/WmsStatusCard.tsx` — **needs-integration**
- `components/integration/wms/WmsStockSync.tsx` — **needs-integration**
- `components/integration/wms/index.ts` — **needs-integration**

### `components/marketing/`

- `components/marketing/FeatureCard.tsx` — **needs-integration**
- `components/marketing/Footer.tsx` — **needs-integration**
- `components/marketing/Hero.tsx` — **needs-integration**
- `components/marketing/InteractiveHighlights.tsx` — **needs-integration**
- `components/marketing/NewsletterForm.tsx` — **needs-integration**
- `components/marketing/PricingCard.tsx` — **needs-integration**
- `components/marketing/Stats.tsx` — **needs-integration**
- `components/marketing/Testimonials.tsx` — **needs-integration**
- `components/marketing/index.ts` — **needs-integration**

### `components/marketing/ai/`

- `components/marketing/ai/aiCopyAssistant.tsx` — **needs-integration**
- `components/marketing/ai/aiFaqGenerator.tsx` — **needs-integration**
- `components/marketing/ai/aiLeadScoring.tsx` — **needs-integration**
- `components/marketing/ai/aiSeoMetaSuggester.tsx` — **needs-integration**
- `components/marketing/ai/aiTestimonialSummary.tsx` — **needs-integration**
- `components/marketing/ai/index.ts` — **needs-integration**

### `components/marketing/auth/`

- `components/marketing/auth/AuthForm.tsx` — **needs-implementation**
- `components/marketing/auth/AuthShell.tsx` — **needs-integration**
- `components/marketing/auth/index.ts` — **needs-integration**

### `components/marketing/comparison/`

- `components/marketing/comparison/ComparisonRow.tsx` — **needs-integration**
- `components/marketing/comparison/ComparisonTable.tsx` — **needs-integration**
- `components/marketing/comparison/index.ts` — **needs-integration**

### `components/marketing/cta/`

- `components/marketing/cta/CTA.tsx` — **needs-integration**
- `components/marketing/cta/CTABand.tsx` — **needs-integration**
- `components/marketing/cta/CTASplit.tsx` — **needs-integration**
- `components/marketing/cta/DemoRequestForm.tsx` — **needs-integration**
- `components/marketing/cta/index.ts` — **needs-integration**

### `components/marketing/faq/`

- `components/marketing/faq/FAQ.tsx` — **needs-integration**
- `components/marketing/faq/FAQCategoryTabs.tsx` — **needs-integration**
- `components/marketing/faq/FAQItem.tsx` — **needs-integration**
- `components/marketing/faq/index.ts` — **needs-integration**

### `components/marketing/features/`

- `components/marketing/features/FeatureBento.tsx` — **needs-integration**
- `components/marketing/features/FeatureCard.tsx` — **needs-integration**
- `components/marketing/features/FeatureCompare.tsx` — **needs-integration**
- `components/marketing/features/FeatureGrid.tsx` — **needs-integration**
- `components/marketing/features/Features.tsx` — **needs-integration**
- `components/marketing/features/index.ts` — **needs-integration**

### `components/marketing/hero/`

- `components/marketing/hero/Hero.tsx` — **needs-integration**
- `components/marketing/hero/HeroBadge.tsx` — **needs-integration**
- `components/marketing/hero/HeroIllustration.tsx` — **needs-integration**
- `components/marketing/hero/HeroStats.tsx` — **needs-integration**
- `components/marketing/hero/index.ts` — **needs-integration**

### `components/marketing/highlights/`

- `components/marketing/highlights/HighlightPreview.tsx` — **needs-integration**
- `components/marketing/highlights/HighlightTab.tsx` — **needs-integration**
- `components/marketing/highlights/InteractiveHighlights.tsx` — **needs-integration**
- `components/marketing/highlights/index.ts` — **needs-integration**

### `components/marketing/layout/`

- `components/marketing/layout/MarketingFooter.tsx` — **needs-implementation**
- `components/marketing/layout/MarketingNavbar.tsx` — **needs-implementation**
- `components/marketing/layout/index.ts` — **needs-integration**

### `components/marketing/logos/`

- `components/marketing/logos/LogoCloud.tsx` — **needs-integration**
- `components/marketing/logos/LogoGrid.tsx` — **needs-integration**
- `components/marketing/logos/index.ts` — **needs-integration**

### `components/marketing/newsletter/`

- `components/marketing/newsletter/Newsletter.tsx` — **needs-integration**
- `components/marketing/newsletter/NewsletterForm.tsx` — **needs-implementation**
- `components/marketing/newsletter/NewsletterInline.tsx` — **needs-implementation**
- `components/marketing/newsletter/index.ts` — **needs-integration**

### `components/marketing/pricing/`

- `components/marketing/pricing/EnterpriseCTA.tsx` — **needs-integration**
- `components/marketing/pricing/Pricing.tsx` — **needs-integration**
- `components/marketing/pricing/PricingCard.tsx` — **needs-integration**
- `components/marketing/pricing/PricingTable.tsx` — **needs-integration**
- `components/marketing/pricing/PricingToggle.tsx` — **needs-integration**
- `components/marketing/pricing/index.ts` — **needs-integration**

### `components/marketing/shared/`

- `components/marketing/shared/AgentRoster.tsx` — **needs-integration**
- `components/marketing/shared/CTABand.tsx` — **needs-integration**
- `components/marketing/shared/CapabilityMatrix.tsx` — **needs-integration**
- `components/marketing/shared/EmptyState.tsx` — **needs-integration**
- `components/marketing/shared/ErrorState.tsx` — **needs-integration**
- `components/marketing/shared/IntegrationGrid.tsx` — **needs-integration**
- `components/marketing/shared/LiveAgentDemo.tsx` — **needs-integration**
- `components/marketing/shared/LoadingState.tsx` — **needs-integration**
- `components/marketing/shared/PageHero.tsx` — **needs-integration**
- `components/marketing/shared/PipelineGrid.tsx` — **needs-integration**
- `components/marketing/shared/SectionHeading.tsx` — **needs-integration**
- `components/marketing/shared/StatGrid.tsx` — **needs-integration**
- `components/marketing/shared/TrustGrid.tsx` — **needs-integration**
- `components/marketing/shared/UseCaseTabs.tsx` — **needs-integration**
- `components/marketing/shared/index.ts` — **needs-integration**
- `components/marketing/shared/tone.ts` — **needs-integration**

### `components/marketing/shell/`

- `components/marketing/shell/Breadcrumbs.tsx` — **needs-integration**
- `components/marketing/shell/Footer.tsx` — **needs-integration**
- `components/marketing/shell/FooterColumn.tsx` — **needs-integration**
- `components/marketing/shell/NavDrawer.tsx` — **needs-integration**
- `components/marketing/shell/Navbar.tsx` — **needs-integration**
- `components/marketing/shell/index.ts` — **needs-integration**

### `components/marketing/stats/`

- `components/marketing/stats/Stats.tsx` — **needs-integration**
- `components/marketing/stats/StatsCard.tsx` — **needs-integration**
- `components/marketing/stats/StatsCounter.tsx` — **needs-integration**
- `components/marketing/stats/StatsGrid.tsx` — **needs-integration**
- `components/marketing/stats/index.ts` — **needs-integration**

### `components/marketing/testimonials/`

- `components/marketing/testimonials/TestimonialCard.tsx` — **needs-integration**
- `components/marketing/testimonials/TestimonialCarousel.tsx` — **needs-integration**
- `components/marketing/testimonials/TestimonialQuote.tsx` — **needs-integration**
- `components/marketing/testimonials/Testimonials.tsx` — **needs-integration**
- `components/marketing/testimonials/index.ts` — **needs-integration**

### `components/marketing/trust/`

- `components/marketing/trust/ComplianceGrid.tsx` — **needs-integration**
- `components/marketing/trust/SecuritySection.tsx` — **needs-integration**
- `components/marketing/trust/TrustBadges.tsx` — **needs-integration**
- `components/marketing/trust/TrustGrid.tsx` — **needs-integration**
- `components/marketing/trust/index.ts` — **needs-integration**

### `components/marketing/use-cases/`

- `components/marketing/use-cases/UseCaseCard.tsx` — **needs-integration**
- `components/marketing/use-cases/UseCaseTabs.tsx` — **needs-integration**
- `components/marketing/use-cases/UseCases.tsx` — **needs-integration**
- `components/marketing/use-cases/index.ts` — **needs-integration**

### `components/navigation/`

- `components/navigation/Breadcrumb.tsx` — **needs-integration**
- `components/navigation/CommandPalette.tsx` — **needs-implementation**

### `components/order-management/`

- `components/order-management/OrderStatusPanel.tsx` — **needs-consolidation**
- `components/order-management/index.ts` — **needs-integration**

### `components/order-management/ai/`

- `components/order-management/ai/aiComplianceSentinel.tsx` — **needs-integration**
- `components/order-management/ai/aiCostOptimizer.tsx` — **needs-integration**
- `components/order-management/ai/aiLeadTimePredictor.tsx` — **needs-integration**
- `components/order-management/ai/aiOrderClassifier.tsx` — **needs-integration**
- `components/order-management/ai/aiOrderRouter.tsx` — **needs-integration**
- `components/order-management/ai/aiSubcontractAdvisor.tsx` — **needs-integration**
- `components/order-management/ai/index.ts` — **needs-integration**

### `components/order-management/analytics/`

- `components/order-management/analytics/OrderAnalytics.tsx` — **needs-enhancement**
- `components/order-management/analytics/OrderCostBreakdown.tsx` — **needs-enhancement**
- `components/order-management/analytics/OrderExceptionPareto.tsx` — **needs-enhancement**
- `components/order-management/analytics/OrderLeadTimeChart.tsx` — **needs-enhancement**
- `components/order-management/analytics/OrderVolumeChart.tsx` — **needs-enhancement**
- `components/order-management/analytics/index.ts` — **needs-integration**

### `components/order-management/approvals/`

- `components/order-management/approvals/ApprovalQueue.tsx` — **needs-integration**
- `components/order-management/approvals/ApprovalRulePreview.tsx` — **needs-integration**
- `components/order-management/approvals/EscalationPanel.tsx` — **needs-integration**
- `components/order-management/approvals/OrderApprovalDashboard.tsx` — **needs-integration**
- `components/order-management/approvals/index.ts` — **needs-integration**

### `components/order-management/core/`

- `components/order-management/core/OrderDashboard.tsx` — **needs-enhancement**
- `components/order-management/core/OrderDetail.tsx` — **needs-integration**
- `components/order-management/core/OrderFilters.tsx` — **needs-implementation**
- `components/order-management/core/OrderForm.tsx` — **needs-integration**
- `components/order-management/core/OrderKpiStrip.tsx` — **needs-enhancement**
- `components/order-management/core/OrderList.tsx` — **needs-integration**
- `components/order-management/core/OrderStatusPanel.tsx` — **needs-consolidation**
- `components/order-management/core/OrderTimeline.tsx` — **needs-integration**
- `components/order-management/core/index.ts` — **needs-integration**

### `components/order-management/customs-link/`

- `components/order-management/customs-link/OrderCustomsPanel.tsx` — **needs-integration**
- `components/order-management/customs-link/OrderDeclarationLink.tsx` — **needs-integration**
- `components/order-management/customs-link/OrderDutyEstimator.tsx` — **needs-integration**
- `components/order-management/customs-link/OrderFtaPreferenceSelector.tsx` — **needs-integration**
- `components/order-management/customs-link/OrderHsCodeLink.tsx` — **needs-integration**
- `components/order-management/customs-link/OrderOriginSelector.tsx` — **needs-integration**
- `components/order-management/customs-link/OrderPermitLink.tsx` — **needs-integration**
- `components/order-management/customs-link/index.ts` — **needs-integration**

### `components/order-management/fulfilment/`

- `components/order-management/fulfilment/DutyImpactPreview.tsx` — **needs-integration**
- `components/order-management/fulfilment/FulfilmentPlanner.tsx` — **needs-integration**
- `components/order-management/fulfilment/FulfilmentQueue.tsx` — **needs-integration**
- `components/order-management/fulfilment/MultiZoneFulfilment.tsx` — **needs-integration**
- `components/order-management/fulfilment/ZoneRoutingDecision.tsx` — **needs-integration**
- `components/order-management/fulfilment/index.ts` — **needs-integration**

### `components/order-management/manufacturing/`

- `components/order-management/manufacturing/BomViewer.tsx` — **needs-integration**
- `components/order-management/manufacturing/ManufacturingOrderDashboard.tsx` — **needs-integration**
- `components/order-management/manufacturing/ManufacturingOrderDetail.tsx` — **needs-integration**
- `components/order-management/manufacturing/ManufacturingOrderForm.tsx` — **needs-integration**
- `components/order-management/manufacturing/ManufacturingOrderList.tsx` — **needs-integration**
- `components/order-management/manufacturing/ProductionInputIssuer.tsx` — **needs-integration**
- `components/order-management/manufacturing/ProductionYieldTracker.tsx` — **needs-integration**
- `components/order-management/manufacturing/SubcontractOrderForm.tsx` — **needs-integration**
- `components/order-management/manufacturing/WastageScrapForm.tsx` — **needs-integration**
- `components/order-management/manufacturing/index.ts` — **needs-integration**

### `components/order-management/purchase/`

- `components/order-management/purchase/DutySuspensionSelector.tsx` — **needs-integration**
- `components/order-management/purchase/PurchaseApprovalPanel.tsx` — **needs-integration**
- `components/order-management/purchase/PurchaseOrderDashboard.tsx` — **needs-integration**
- `components/order-management/purchase/PurchaseOrderDetail.tsx` — **needs-integration**
- `components/order-management/purchase/PurchaseOrderForm.tsx` — **needs-integration**
- `components/order-management/purchase/PurchaseOrderList.tsx` — **needs-integration**
- `components/order-management/purchase/PurchaseRequisitionForm.tsx` — **needs-integration**
- `components/order-management/purchase/SupplierQuoteCompare.tsx` — **needs-integration**
- `components/order-management/purchase/index.ts` — **needs-integration**

### `components/order-management/trading/`

- `components/order-management/trading/EntrepotMatchPanel.tsx` — **needs-integration**
- `components/order-management/trading/TradingHouseSelector.tsx` — **needs-integration**
- `components/order-management/trading/TradingOrderDashboard.tsx` — **needs-integration**
- `components/order-management/trading/TradingOrderDetail.tsx` — **needs-integration**
- `components/order-management/trading/TradingOrderForm.tsx` — **needs-integration**
- `components/order-management/trading/TradingOrderList.tsx` — **needs-integration**
- `components/order-management/trading/index.ts` — **needs-integration**

### `components/order-management/transhipment/`

- `components/order-management/transhipment/BreakBulkOrderForm.tsx` — **needs-integration**
- `components/order-management/transhipment/ReexportOrderForm.tsx` — **needs-integration**
- `components/order-management/transhipment/RepackagingOrderForm.tsx` — **needs-integration**
- `components/order-management/transhipment/TranshipmentManifest.tsx` — **needs-integration**
- `components/order-management/transhipment/TranshipmentOrderDashboard.tsx` — **needs-integration**
- `components/order-management/transhipment/TranshipmentOrderForm.tsx` — **needs-integration**
- `components/order-management/transhipment/TranshipmentOrderList.tsx` — **needs-integration**
- `components/order-management/transhipment/index.ts` — **needs-integration**

### `components/trade-ops/`

- `components/trade-ops/TradeOpsAnalyticsView.tsx` — **needs-enhancement**
- `components/trade-ops/TradeOpsCreatePage.tsx` — **needs-implementation**
- `components/trade-ops/TradeOpsDetailPage.tsx` — **needs-integration**
- `components/trade-ops/TradeOpsDetailView.tsx` — **needs-enhancement**
- `components/trade-ops/TradeOpsListPage.tsx` — **needs-implementation**
- `components/trade-ops/TradeOpsListView.tsx` — **needs-enhancement**
- `components/trade-ops/index.ts` — **needs-integration**

### `components/trade-ops/ai/`

- `components/trade-ops/ai/aiClearancePredictor.tsx` — **needs-implementation**
- `components/trade-ops/ai/aiComplianceSentinel.tsx` — **needs-implementation**
- `components/trade-ops/ai/aiDeclarationCopilot.tsx` — **needs-implementation**
- `components/trade-ops/ai/aiDocExtractor.tsx` — **needs-implementation**
- `components/trade-ops/ai/aiDutyOptimizer.tsx` — **needs-implementation**
- `components/trade-ops/ai/aiHsClassifier.tsx` — **needs-implementation**
- `components/trade-ops/ai/aiValuationAdvisor.tsx` — **needs-implementation**
- `components/trade-ops/ai/index.ts` — **needs-integration**

### `components/trade-ops/analytics/`

- `components/trade-ops/analytics/BrokerScorecard.tsx` — **needs-implementation**
- `components/trade-ops/analytics/ClearanceTimeChart.tsx` — **needs-implementation**
- `components/trade-ops/analytics/DutyTrendChart.tsx` — **needs-implementation**
- `components/trade-ops/analytics/OriginMixChart.tsx` — **needs-implementation**
- `components/trade-ops/analytics/TradeOpsReportBuilder.tsx` — **needs-implementation**
- `components/trade-ops/analytics/TradeVolumeChart.tsx` — **needs-implementation**
- `components/trade-ops/analytics/index.ts` — **needs-integration**

### `components/trade-ops/clearance/`

- `components/trade-ops/clearance/ChannelAssignment.tsx` — **needs-implementation**
- `components/trade-ops/clearance/ClearanceBoard.tsx` — **needs-implementation**
- `components/trade-ops/clearance/ClearanceTimeline.tsx` — **needs-implementation**
- `components/trade-ops/clearance/DemurrageClock.tsx` — **needs-implementation**
- `components/trade-ops/clearance/DetentionPanel.tsx` — **needs-implementation**
- `components/trade-ops/clearance/InspectionScheduler.tsx` — **needs-implementation**
- `components/trade-ops/clearance/ReleaseOrderPanel.tsx` — **needs-implementation**
- `components/trade-ops/clearance/index.ts` — **needs-integration**

### `components/trade-ops/compliance/`

- `components/trade-ops/compliance/AuditTrailViewer.tsx` — **needs-implementation**
- `components/trade-ops/compliance/ComplianceDashboard.tsx` — **needs-implementation**
- `components/trade-ops/compliance/DeniedPartyCheck.tsx` — **needs-implementation**
- `components/trade-ops/compliance/OriginDetermination.tsx` — **needs-implementation**
- `components/trade-ops/compliance/PostClearanceAudit.tsx` — **needs-implementation**
- `components/trade-ops/compliance/RiskScoreCard.tsx` — **needs-implementation**
- `components/trade-ops/compliance/RulePackManager.tsx` — **needs-implementation**
- `components/trade-ops/compliance/SanctionScreening.tsx` — **needs-implementation**
- `components/trade-ops/compliance/ValuationReview.tsx` — **needs-implementation**
- `components/trade-ops/compliance/index.ts` — **needs-integration**

### `components/trade-ops/dashboard/`

- `components/trade-ops/dashboard/TradeOpsAlertRail.tsx` — **needs-implementation**
- `components/trade-ops/dashboard/TradeOpsCommandBar.tsx` — **needs-implementation**
- `components/trade-ops/dashboard/TradeOpsDashboard.tsx` — **needs-enhancement**
- `components/trade-ops/dashboard/TradeOpsKpiStrip.tsx` — **needs-implementation**
- `components/trade-ops/dashboard/TradeOpsLiveFeed.tsx` — **needs-implementation**
- `components/trade-ops/dashboard/TradeOpsTaskBoard.tsx` — **needs-implementation**
- `components/trade-ops/dashboard/index.ts` — **needs-integration**

### `components/trade-ops/declarations/`

- `components/trade-ops/declarations/DeclarationAmendment.tsx` — **needs-implementation**
- `components/trade-ops/declarations/DeclarationCancelPanel.tsx` — **needs-implementation**
- `components/trade-ops/declarations/DeclarationDetail.tsx` — **needs-implementation**
- `components/trade-ops/declarations/DeclarationForm.tsx` — **needs-implementation**
- `components/trade-ops/declarations/DeclarationLineItems.tsx` — **needs-implementation**
- `components/trade-ops/declarations/DeclarationList.tsx` — **needs-implementation**
- `components/trade-ops/declarations/DeclarationStatusTracker.tsx` — **needs-implementation**
- `components/trade-ops/declarations/DeclarationSubmitPanel.tsx` — **needs-implementation**
- `components/trade-ops/declarations/DeclarationWizard.tsx` — **needs-implementation**
- `components/trade-ops/declarations/index.ts` — **needs-integration**

### `components/trade-ops/documents/`

- `components/trade-ops/documents/BillOfLadingView.tsx` — **needs-implementation**
- `components/trade-ops/documents/CertificateOfOriginView.tsx` — **needs-implementation**
- `components/trade-ops/documents/CommercialInvoiceView.tsx` — **needs-implementation**
- `components/trade-ops/documents/DocumentDiffViewer.tsx` — **needs-implementation**
- `components/trade-ops/documents/DocumentGenerator.tsx` — **needs-implementation**
- `components/trade-ops/documents/DocumentOcrUpload.tsx` — **needs-implementation**
- `components/trade-ops/documents/PackingListView.tsx` — **needs-implementation**
- `components/trade-ops/documents/TradeDocVault.tsx` — **needs-implementation**
- `components/trade-ops/documents/index.ts` — **needs-integration**

### `components/trade-ops/duty-tax/`

- `components/trade-ops/duty-tax/DutyBreakdown.tsx` — **needs-implementation**
- `components/trade-ops/duty-tax/DutyCalculator.tsx` — **needs-implementation**
- `components/trade-ops/duty-tax/ExemptionApplicator.tsx` — **needs-implementation**
- `components/trade-ops/duty-tax/FtaRateComparator.tsx` — **needs-implementation**
- `components/trade-ops/duty-tax/LandedCostEstimator.tsx` — **needs-implementation**
- `components/trade-ops/duty-tax/SstGstPanel.tsx` — **needs-implementation**
- `components/trade-ops/duty-tax/TaxSummaryCard.tsx` — **needs-implementation**
- `components/trade-ops/duty-tax/index.ts` — **needs-integration**

### `components/trade-ops/hs-classification/`

- `components/trade-ops/hs-classification/HsCodeCatalog.tsx` — **needs-implementation**
- `components/trade-ops/hs-classification/HsCodeConflictResolver.tsx` — **needs-implementation**
- `components/trade-ops/hs-classification/HsCodeDetail.tsx` — **needs-implementation**
- `components/trade-ops/hs-classification/HsCodeSearch.tsx` — **needs-implementation**
- `components/trade-ops/hs-classification/HsCodeSuggestion.tsx` — **needs-implementation**
- `components/trade-ops/hs-classification/HsCodeTree.tsx` — **needs-implementation**
- `components/trade-ops/hs-classification/RulingLookup.tsx` — **needs-implementation**
- `components/trade-ops/hs-classification/TariffScheduleTable.tsx` — **needs-implementation**
- `components/trade-ops/hs-classification/hs-code-data.ts` — **needs-integration**
- `components/trade-ops/hs-classification/index.ts` — **needs-integration**

### `components/trade-ops/permits-licenses/`

- `components/trade-ops/permits-licenses/AproCdpLookup.tsx` — **needs-implementation**
- `components/trade-ops/permits-licenses/ControlledGoodsCheck.tsx` — **needs-implementation**
- `components/trade-ops/permits-licenses/LicenseVault.tsx` — **needs-implementation**
- `components/trade-ops/permits-licenses/PermitApplication.tsx` — **needs-implementation**
- `components/trade-ops/permits-licenses/PermitRegistry.tsx` — **needs-implementation**
- `components/trade-ops/permits-licenses/PermitTracker.tsx` — **needs-implementation**
- `components/trade-ops/permits-licenses/QuotaMonitor.tsx` — **needs-implementation**
- `components/trade-ops/permits-licenses/index.ts` — **needs-integration**

### `components/trade-ops/trade-finance/`

- `components/trade-ops/trade-finance/BankGuaranteeCard.tsx` — **needs-implementation**
- `components/trade-ops/trade-finance/DrawbackClaim.tsx` — **needs-implementation**
- `components/trade-ops/trade-finance/FxExposureCard.tsx` — **needs-implementation**
- `components/trade-ops/trade-finance/LetterOfCreditPanel.tsx` — **needs-implementation**
- `components/trade-ops/trade-finance/PaymentInstructionForm.tsx` — **needs-implementation**
- `components/trade-ops/trade-finance/RefundTracker.tsx` — **needs-implementation**
- `components/trade-ops/trade-finance/index.ts` — **needs-integration**

### `components/ui/`

- `components/ui/Logo.tsx` — **needs-integration**
- `components/ui/accordion.tsx` — **needs-integration**
- `components/ui/alert.tsx` — **needs-integration**
- `components/ui/avatar.tsx` — **needs-integration**
- `components/ui/badge.tsx` — **needs-enhancement**
- `components/ui/button-group.tsx` — **needs-integration**
- `components/ui/button.tsx` — **needs-enhancement**
- `components/ui/card.tsx` — **needs-enhancement**
- `components/ui/carousel.tsx` — **needs-integration**
- `components/ui/checkbox.tsx` — **needs-integration**
- `components/ui/client-only-chart.tsx` — **needs-integration**
- `components/ui/collapsible.tsx` — **needs-integration**
- `components/ui/command.tsx` — **needs-integration**
- `components/ui/dialog.tsx` — **needs-integration**
- `components/ui/dropdown-menu.tsx` — **needs-integration**
- `components/ui/hover-card.tsx` — **needs-integration**
- `components/ui/index.ts` — **needs-integration**
- `components/ui/input-group.tsx` — **needs-integration**
- `components/ui/input.tsx` — **needs-implementation**
- `components/ui/label.tsx` — **needs-integration**
- `components/ui/popover.tsx` — **needs-integration**
- `components/ui/progress.tsx` — **needs-integration**
- `components/ui/scroll-area.tsx` — **needs-integration**
- `components/ui/select.tsx` — **needs-implementation**
- `components/ui/separator.tsx` — **needs-integration**
- `components/ui/spinner.tsx` — **needs-integration**
- `components/ui/stat.tsx` — **needs-integration**
- `components/ui/switch.tsx` — **needs-integration**
- `components/ui/table.tsx` — **needs-integration**
- `components/ui/tabs.tsx` — **needs-integration**
- `components/ui/textarea.tsx` — **needs-implementation**
- `components/ui/tooltip.tsx` — **needs-integration**

### `components/wms/`

- `components/wms/WmsOperationsPanel.tsx` — **needs-consolidation**
- `components/wms/WmsSummaryCard.tsx` — **needs-consolidation**
- `components/wms/index.ts` — **needs-integration**

### `components/wms/ai/`

- `components/wms/ai/aiDutySuspensionWatcher.tsx` — **needs-integration**
- `components/wms/ai/aiDwellPredictor.tsx` — **needs-integration**
- `components/wms/ai/aiInventoryAnomalyDetector.tsx` — **needs-integration**
- `components/wms/ai/aiPutawayAdvisor.tsx` — **needs-integration**
- `components/wms/ai/aiSlotOptimizer.tsx` — **needs-integration**
- `components/wms/ai/index.ts` — **needs-integration**

### `components/wms/bonded/`

- `components/wms/bonded/BondedAgingReport.tsx` — **needs-enhancement**
- `components/wms/bonded/BondedGuaranteeCard.tsx` — **needs-enhancement**
- `components/wms/bonded/BondedLedgerDashboard.tsx` — **needs-enhancement**
- `components/wms/bonded/BondedShortageReport.tsx` — **needs-enhancement**
- `components/wms/bonded/BondedStockLedger.tsx` — **needs-enhancement**
- `components/wms/bonded/BondedTransferForm.tsx` — **needs-enhancement**
- `components/wms/bonded/BondedWriteOffPanel.tsx` — **needs-enhancement**
- `components/wms/bonded/index.ts` — **needs-integration**

### `components/wms/core/`

- `components/wms/core/WmsDashboard.tsx` — **needs-enhancement**
- `components/wms/core/WmsHeader.tsx` — **needs-integration**
- `components/wms/core/WmsKpiStrip.tsx` — **needs-integration**
- `components/wms/core/WmsOperationsPanel.tsx` — **needs-consolidation**
- `components/wms/core/WmsSidebar.tsx` — **needs-integration**
- `components/wms/core/WmsSummaryCard.tsx` — **needs-consolidation**
- `components/wms/core/WmsZoneContextBar.tsx` — **needs-integration**
- `components/wms/core/index.ts` — **needs-integration**

### `components/wms/exemption/`

- `components/wms/exemption/ExemptionClaimForm.tsx` — **needs-integration**
- `components/wms/exemption/ExemptionClawbackPanel.tsx` — **needs-integration**
- `components/wms/exemption/ExemptionExpiryMonitor.tsx` — **needs-integration**
- `components/wms/exemption/ExemptionLedgerDashboard.tsx` — **needs-integration**
- `components/wms/exemption/ExemptionReconciliation.tsx` — **needs-integration**
- `components/wms/exemption/ExemptionUtilizationChart.tsx` — **needs-integration**
- `components/wms/exemption/index.ts` — **needs-integration**

### `components/wms/forecasting/`

- `components/wms/forecasting/AnomaliesList.tsx` — **needs-integration**
- `components/wms/forecasting/DelayList.tsx` — **needs-integration**
- `components/wms/forecasting/DemandPredictor.tsx` — **needs-integration**
- `components/wms/forecasting/ForecastChart.tsx` — **needs-integration**
- `components/wms/forecasting/ForecastKpiStrip.tsx` — **needs-integration**
- `components/wms/forecasting/ForecastTable.tsx` — **needs-integration**
- `components/wms/forecasting/ForecastingDashboard.tsx` — **needs-integration**
- `components/wms/forecasting/index.ts` — **needs-integration**

### `components/wms/gate/`

- `components/wms/gate/GateAccessBadge.tsx` — **needs-implementation**
- `components/wms/gate/GateAnprFeed.tsx` — **needs-enhancement**
- `components/wms/gate/GateExceptionQueue.tsx` — **needs-integration**
- `components/wms/gate/GateLaneAssignment.tsx` — **needs-integration**
- `components/wms/gate/GatePassIssuer.tsx` — **needs-integration**
- `components/wms/gate/GatePassScanner.tsx` — **needs-implementation**
- `components/wms/gate/GateQueueMonitor.tsx` — **needs-enhancement**
- `components/wms/gate/GateSealVerification.tsx` — **needs-integration**
- `components/wms/gate/GateWeighbridgePanel.tsx` — **needs-enhancement**
- `components/wms/gate/index.ts` — **needs-integration**

### `components/wms/inbound/`

- `components/wms/inbound/InboundAsnList.tsx` — **needs-enhancement**
- `components/wms/inbound/InboundDashboard.tsx` — **needs-enhancement**
- `components/wms/inbound/InboundDutySuspensionCheck.tsx` — **needs-integration**
- `components/wms/inbound/InboundPutawayPlanner.tsx` — **needs-enhancement**
- `components/wms/inbound/InboundQcPanel.tsx` — **needs-enhancement**
- `components/wms/inbound/InboundReceiptDetail.tsx` — **needs-enhancement**
- `components/wms/inbound/InboundReceiptExperience.tsx` — **needs-enhancement**
- `components/wms/inbound/InboundReceiptForm.tsx` — **needs-integration**
- `components/wms/inbound/InboundReceiptList.tsx` — **needs-enhancement**
- `components/wms/inbound/index.ts` — **needs-integration**

### `components/wms/inventory/`

- `components/wms/inventory/InventoryAgingReport.tsx` — **needs-enhancement**
- `components/wms/inventory/InventoryBondedVsDomestic.tsx` — **needs-enhancement**
- `components/wms/inventory/InventoryCycleCount.tsx` — **needs-enhancement**
- `components/wms/inventory/InventoryDashboard.tsx` — **needs-implementation**
- `components/wms/inventory/InventoryDetail.tsx` — **needs-enhancement**
- `components/wms/inventory/InventoryHoldRelease.tsx` — **needs-enhancement**
- `components/wms/inventory/InventoryList.tsx` — **needs-enhancement**
- `components/wms/inventory/InventoryMovementLog.tsx` — **needs-enhancement**
- `components/wms/inventory/InventorySlotSuggest.tsx` — **needs-enhancement**
- `components/wms/inventory/InventoryValuationCard.tsx` — **needs-enhancement**
- `components/wms/inventory/ReportGenerator.tsx` — **needs-enhancement**
- `components/wms/inventory/index.ts` — **needs-integration**

### `components/wms/logistics-distribution/`

- `components/wms/logistics-distribution/LogisticsDistributionDashboard.tsx` — **needs-integration**
- `components/wms/logistics-distribution/RouteMap.tsx` — **needs-integration**
- `components/wms/logistics-distribution/ShipmentTracker.tsx` — **needs-integration**
- `components/wms/logistics-distribution/aiCostOptimizer.tsx` — **needs-implementation**
- `components/wms/logistics-distribution/aiShipmentTracker.tsx` — **needs-integration**
- `components/wms/logistics-distribution/index.ts` — **needs-integration**

### `components/wms/movement/`

- `components/wms/movement/InterZoneTransferForm.tsx` — **needs-integration**
- `components/wms/movement/MovementDashboard.tsx` — **needs-integration**
- `components/wms/movement/MovementExceptionPanel.tsx` — **needs-integration**
- `components/wms/movement/MovementForm.tsx` — **needs-integration**
- `components/wms/movement/MovementList.tsx` — **needs-integration**
- `components/wms/movement/MovementManifestView.tsx` — **needs-integration**
- `components/wms/movement/MovementTracker.tsx` — **needs-integration**
- `components/wms/movement/index.ts` — **needs-integration**

### `components/wms/outbound/`

- `components/wms/outbound/OutboundCustomsLink.tsx` — **needs-enhancement**
- `components/wms/outbound/OutboundDashboard.tsx` — **needs-enhancement**
- `components/wms/outbound/OutboundDispatchForm.tsx` — **needs-enhancement**
- `components/wms/outbound/OutboundDutyCalculator.tsx` — **needs-enhancement**
- `components/wms/outbound/OutboundManifestView.tsx` — **needs-integration**
- `components/wms/outbound/OutboundOrderList.tsx` — **needs-enhancement**
- `components/wms/outbound/OutboundPackPanel.tsx` — **needs-enhancement**
- `components/wms/outbound/OutboundPickList.tsx` — **needs-enhancement**
- `components/wms/outbound/index.ts` — **needs-integration**

### `components/wms/slotting/`

- `components/wms/slotting/SlotAllocationBoard.tsx` — **needs-integration**
- `components/wms/slotting/SlotCapacityGauge.tsx` — **needs-integration**
- `components/wms/slotting/SlotGrid.tsx` — **needs-integration**
- `components/wms/slotting/SlotHeatmap.tsx` — **needs-integration**
- `components/wms/slotting/SlotMaintenancePanel.tsx` — **needs-integration**
- `components/wms/slotting/SlotRecommender.tsx` — **needs-integration**
- `components/wms/slotting/index.ts` — **needs-integration**


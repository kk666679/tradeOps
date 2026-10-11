"use client"

import * as React from "react"
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type NodeMouseHandler,
  type NodeTypes,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"
import "./workflow.css"

import { AgentNode } from "./nodes/AgentNode"
import { LaneNode } from "./nodes/LaneNode"
import { NoteNode } from "./nodes/NoteNode"
import { StepNode } from "./nodes/StepNode"
import { WorkflowDetailPanel } from "./WorkflowDetailPanel"
import { WorkflowStepList } from "./WorkflowStepList"
import { WorkflowToolbar, type WorkflowView } from "./WorkflowToolbar"
import {
  buildAgentEdges,
  buildBaseEdges,
  buildExceptionEdges,
  buildModuleEdges,
  buildPersonaEdges,
  buildReferenceEdges,
  buildTwinEdges,
  buildWorkflowNodes,
  downstreamOf,
  nextStepId,
  previousStepId,
  resolveWorkflowItem,
  searchWorkflow,
  searchableNodeIds,
  withPathHighlight,
} from "./workflowGraph"
import type { WorkflowEdge, WorkflowNode } from "./types"

/**
 * Typed node registry — must stay module-level so React Flow does not
 * remount every node on re-render.
 */
export const workflowNodeTypes: NodeTypes = {
  step: StepNode,
  lane: LaneNode,
  note: NoteNode,
  agent: AgentNode,
}

function miniMapNodeColor(node: WorkflowNode): string {
  if (node.type === "lane") return "transparent"
  if (node.type === "agent") return "var(--ink-faint)"
  const className = typeof node.className === "string" ? node.className : ""
  if (className.includes("zone-fiz")) return "var(--color-fiz)"
  if (className.includes("zone-fcz")) return "var(--color-fcz)"
  return "var(--color-signal-400)"
}

export interface BondedWorkflowExplorerProps {
  /**
   * `full` exposes the agent directory and agent links; `preview` is the
   * simplified overview suitable for a marketing page.
   */
  variant?: "full" | "preview"
  /**
   * Include the platform overlay nodes (modules, personas, digital twin, ledger,
   * hold). Defaults to `true` for `full` and `false` for `preview`, so the
   * marketing surfaces show the clean bonded workflow only.
   */
  showOverlays?: boolean
  className?: string
  /** Pre-selected node id (used by deep links and the guided walkthrough). */
  initialSelectedId?: string | null
}

function WorkflowExplorerInner({
  variant = "full",
  showOverlays,
  className,
  initialSelectedId = null,
}: BondedWorkflowExplorerProps) {
  const isPreview = variant === "preview"
  const includeAgents = !isPreview
  const renderOverlays = showOverlays ?? includeAgents

  const [dark, setDark] = React.useState(true)
  const [showAgentLinks, setShowAgentLinks] = React.useState(false)
  const [showExceptionEdges, setShowExceptionEdges] = React.useState(true)
  const [showModuleEdges, setShowModuleEdges] = React.useState(false)
  const [showPersonaEdges, setShowPersonaEdges] = React.useState(false)
  const [showTwinEdges, setShowTwinEdges] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [view, setView] = React.useState<WorkflowView>("diagram")
  const [selectedId, setSelectedId] = React.useState<string | null>(initialSelectedId)

  const { fitView } = useReactFlow()

  /* Mobile defaults to the linear step list — hydration-safe switch on mount */
  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(max-width: 767px)").matches) {
      setView("steps")
    }
  }, [])

  /* ---- derived graph state ---------------------------------------------- */

  const onPathIds = React.useMemo(
    () => (selectedId ? downstreamOf(selectedId) : new Set<string>()),
    [selectedId],
  )

  const dimmedIds = React.useMemo<ReadonlySet<string>>(() => {
    const trimmed = query.trim()
    if (trimmed === "") return new Set<string>()
    const matches = searchWorkflow(trimmed)
    const all = searchableNodeIds(includeAgents)
    return new Set(all.filter((id) => !matches.has(id)))
  }, [query, includeAgents])

  const baseEdges = React.useMemo(
    () => (renderOverlays ? buildBaseEdges() : buildReferenceEdges()),
    [renderOverlays],
  )
  const exceptionEdges = React.useMemo(() => buildExceptionEdges(), [])
  const agentEdges = React.useMemo(() => buildAgentEdges(), [])
  const moduleEdges = React.useMemo(() => buildModuleEdges(), [])
  const personaEdges = React.useMemo(() => buildPersonaEdges(), [])
  const twinEdges = React.useMemo(() => buildTwinEdges(), [])

  // Nodes are rebuilt by the effect below whenever options change; the initial
  // value only needs to exist so useNodesState has a starting point.
  const [initialNodes] = React.useState<WorkflowNode[]>(() =>
    buildWorkflowNodes({ includeAgents, showOverlays: renderOverlays }),
  )

  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>(baseEdges)

  /* Rebuild nodes when search / selection / path highlighting changes */
  React.useEffect(() => {
    setNodes(
      buildWorkflowNodes({
        includeAgents,
        showOverlays: renderOverlays,
        dimmedIds,
        onPathIds,
        selectedId,
      }),
    )
  }, [includeAgents, renderOverlays, dimmedIds, onPathIds, selectedId, setNodes])

  /* Toggle animated agent links + exception edges + module/persona/twin overlays, then apply the downstream path highlight */
  React.useEffect(() => {
    const next = [
      ...baseEdges,
      /* Agent links need the agent directory lane to exist */
      ...(showAgentLinks && includeAgents ? agentEdges : []),
      ...(showExceptionEdges ? exceptionEdges : []),
      ...(renderOverlays && showModuleEdges ? moduleEdges : []),
      ...(renderOverlays && showPersonaEdges ? personaEdges : []),
      ...(renderOverlays && showTwinEdges ? twinEdges : []),
    ]
    setEdges(withPathHighlight(next, onPathIds))
  }, [
    showAgentLinks,
    showExceptionEdges,
    showModuleEdges,
    showPersonaEdges,
    showTwinEdges,
    includeAgents,
    renderOverlays,
    baseEdges,
    agentEdges,
    exceptionEdges,
    moduleEdges,
    personaEdges,
    twinEdges,
    onPathIds,
    setEdges,
  ])

  /* ---- handlers ---------------------------------------------------------- */

  const handleNodeClick = React.useCallback<NodeMouseHandler<WorkflowNode>>(
    (_event, node) => {
      if (node.type === "lane" || node.type === "agent") return
      setSelectedId(node.id)
      if (view !== "diagram") setView("diagram")
    },
    [view],
  )

  const handleSelect = React.useCallback(
    (nodeId: string) => {
      setSelectedId(nodeId)
      if (view !== "diagram") setView("diagram")
    },
    [view],
  )

  const handleNavigate = React.useCallback(
    (nodeId: string) => {
      setSelectedId(nodeId)
      requestAnimationFrame(() => fitView({ padding: isPreview ? 0.12 : 0.08, duration: 400 }))
    },
    [fitView, isPreview],
  )

  const handleClearSelection = React.useCallback(() => setSelectedId(null), [])

  const handleFitView = React.useCallback(() => {
    fitView({ padding: isPreview ? 0.12 : 0.08, duration: 400 })
  }, [fitView, isPreview])

  const target = selectedId ? resolveWorkflowItem(selectedId) : undefined

  const matchCount = query.trim() === "" ? 0 : searchWorkflow(query).size
  const totalCount = searchableNodeIds(includeAgents).length

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <WorkflowToolbar
          view={view}
          onViewChange={setView}
          query={query}
          onQueryChange={setQuery}
          matchCount={matchCount}
          totalCount={totalCount}
          showAgentLinks={showAgentLinks}
          onToggleAgentLinks={() => setShowAgentLinks((value) => !value)}
          showExceptionEdges={showExceptionEdges}
          onToggleExceptionEdges={() => setShowExceptionEdges((value) => !value)}
          showModuleEdges={showModuleEdges}
          onToggleModuleEdges={() => setShowModuleEdges((value) => !value)}
          showPersonaEdges={showPersonaEdges}
          onTogglePersonaEdges={() => setShowPersonaEdges((value) => !value)}
          showTwinEdges={showTwinEdges}
          onToggleTwinEdges={() => setShowTwinEdges((value) => !value)}
          dark={dark}
          onToggleDark={() => setDark((value) => !value)}
          onFitView={handleFitView}
          onClearSelection={handleClearSelection}
          hasSelection={target !== undefined}
          agentLinksAvailable={includeAgents}
          overlayTogglesAvailable={renderOverlays}
        />

        <div
          className={`relative ${isPreview ? "h-[400px] sm:h-[520px]" : "h-[560px] lg:h-[720px]"}`}
          role="region"
          aria-label="FIZ and FCZ bonded workflow diagram"
        >
          {view === "diagram" ? (
            <ReactFlow<WorkflowNode, WorkflowEdge>
              nodes={nodes}
              edges={edges}
              nodeTypes={workflowNodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              fitView
              fitViewOptions={{ padding: isPreview ? 0.12 : 0.08 }}
              minZoom={0.08}
              maxZoom={1.6}
              nodesDraggable={false}
              nodesConnectable={false}
              nodesFocusable
              elementsSelectable
              className={dark ? "dark" : ""}
              proOptions={{ hideAttribution: false }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={22}
                size={1.2}
                color={dark ? "var(--line-strong)" : "var(--line)"}
              />
              <Controls showInteractive={false} position="bottom-left" />
              <MiniMap
                pannable
                zoomable
                nodeColor={miniMapNodeColor}
                maskColor={dark ? "color-mix(in srgb, var(--surface-0) 75%, transparent)" : "color-mix(in srgb, var(--surface-0) 75%, transparent)"}
                style={{
                  background: "var(--xy-theme-panel-bg)",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                }}
                position="bottom-right"
              />
            </ReactFlow>
          ) : (
            <WorkflowStepList selectedId={selectedId} onSelect={handleSelect} />
          )}

          {view === "diagram" && target ? (
            <WorkflowDetailPanel
              target={target}
              onSelect={handleSelect}
              onClose={handleClearSelection}
              onNavigate={handleNavigate}
              previousId={selectedId ? previousStepId(selectedId) : undefined}
              nextId={selectedId ? nextStepId(selectedId) : undefined}
            />
          ) : null}
        </div>
      </div>

      <p className="mt-2 px-1 text-[11px] leading-relaxed text-muted-foreground">
        Illustrative sample workflow · 14 operational steps + 3 control notes · 15 ledger events
        {includeAgents ? " · 19 agents" : ""}.{" "}
        {view === "diagram"
          ? "Click any step for its event id, owning agent, and neighbours."
          : "Select a step to see its event id, owning agent, and neighbours."}
      </p>
    </div>
  )
}

export function BondedWorkflowExplorer(props: BondedWorkflowExplorerProps) {
  return (
    <ReactFlowProvider>
      <WorkflowExplorerInner {...props} />
    </ReactFlowProvider>
  )
}

export default BondedWorkflowExplorer

"use client"

import * as React from "react"

export type WorkflowView = "diagram" | "steps"

export interface WorkflowToolbarProps {
  view: WorkflowView
  onViewChange: (view: WorkflowView) => void
  query: string
  onQueryChange: (query: string) => void
  matchCount: number
  totalCount: number
  showAgentLinks: boolean
  onToggleAgentLinks: () => void
  showExceptionEdges: boolean
  onToggleExceptionEdges: () => void
  showModuleEdges: boolean
  onToggleModuleEdges: () => void
  showPersonaEdges: boolean
  onTogglePersonaEdges: () => void
  showTwinEdges: boolean
  onToggleTwinEdges: () => void
  dark: boolean
  onToggleDark: () => void
  onFitView: () => void
  onClearSelection: () => void
  hasSelection: boolean
  /** Hide the agent-links toggle when the agent directory lane is not rendered. */
  agentLinksAvailable?: boolean
  /** Hide the module / persona / twin toggles when overlay nodes are not rendered. */
  overlayTogglesAvailable?: boolean
}

const SEGMENT_BASE =
  "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition"

export function WorkflowToolbar({
  view,
  onViewChange,
  query,
  onQueryChange,
  matchCount,
  totalCount,
  showAgentLinks,
  onToggleAgentLinks,
  showExceptionEdges,
  onToggleExceptionEdges,
  showModuleEdges,
  onToggleModuleEdges,
  showPersonaEdges,
  onTogglePersonaEdges,
  showTwinEdges,
  onToggleTwinEdges,
  dark,
  onToggleDark,
  onFitView,
  onClearSelection,
  hasSelection,
  agentLinksAvailable = true,
  overlayTogglesAvailable = true,
}: WorkflowToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card/60 px-3 py-2.5">
      {/* Diagram / Steps segmented control */}
      <div
        className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-background p-0.5"
        role="tablist"
        aria-label="Workflow view"
      >
        <button
          type="button"
          role="tab"
          aria-selected={view === "diagram"}
          className={`${SEGMENT_BASE} ${view === "diagram" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent"}`}
          onClick={() => onViewChange("diagram")}
        >
          Diagram
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "steps"}
          className={`${SEGMENT_BASE} ${view === "steps" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent"}`}
          onClick={() => onViewChange("steps")}
        >
          Steps
        </button>
      </div>

      {/* Search */}
      <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
        <label htmlFor="workflow-search" className="sr-only">
          Search steps, events, and agents
        </label>
        <input
          id="workflow-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search step, event, agent…"
          className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {query.trim() !== "" ? (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">
            {matchCount}/{totalCount}
          </span>
        ) : null}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {hasSelection ? (
          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition hover:bg-accent"
          >
            Clear selection
          </button>
        ) : null}

        {agentLinksAvailable ? (
          <button
            type="button"
            onClick={onToggleAgentLinks}
            aria-pressed={showAgentLinks}
            className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
              showAgentLinks
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-accent"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${showAgentLinks ? "bg-primary" : "bg-muted-foreground/60"}`}
            />
            Agent links
          </button>
        ) : null}

        <button
          type="button"
          onClick={onToggleExceptionEdges}
          aria-pressed={showExceptionEdges}
          className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
            showExceptionEdges
              ? "border-alert bg-alert/10 text-alert"
              : "border-border bg-background text-muted-foreground hover:bg-accent"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${showExceptionEdges ? "bg-alert" : "bg-muted-foreground/60"}`}
          />
          Exception edges
        </button>

        {overlayTogglesAvailable ? (
          <>
            <button
              type="button"
              onClick={onToggleModuleEdges}
              aria-pressed={showModuleEdges}
              className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
                showModuleEdges
                  ? "border-violet bg-violet/10 text-violet"
                  : "border-border bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${showModuleEdges ? "bg-violet" : "bg-muted-foreground/60"}`}
              />
              Module overlay
            </button>

            <button
              type="button"
              onClick={onTogglePersonaEdges}
              aria-pressed={showPersonaEdges}
              className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
                showPersonaEdges
                  ? "border-amber bg-amber/10 text-amber"
                  : "border-border bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${showPersonaEdges ? "bg-amber" : "bg-muted-foreground/60"}`}
              />
              Persona overlay
            </button>

            <button
              type="button"
              onClick={onToggleTwinEdges}
              aria-pressed={showTwinEdges}
              className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
                showTwinEdges
                  ? "border-cyan bg-cyan/10 text-cyan"
                  : "border-border bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${showTwinEdges ? "bg-cyan" : "bg-muted-foreground/60"}`}
              />
              Digital Twin
            </button>
          </>
        ) : null}

        <button
          type="button"
          onClick={onFitView}
          className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition hover:bg-accent"
        >
          Fit view
        </button>

        <button
          type="button"
          onClick={onToggleDark}
          aria-pressed={dark}
          className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition hover:bg-accent"
        >
          {dark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </div>
  )
}

export default WorkflowToolbar

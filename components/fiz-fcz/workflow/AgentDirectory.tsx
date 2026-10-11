"use client"

import * as React from "react"

import { AGENTS } from "./data/agents"

/**
 * Searchable directory of the 19 workflow agents: primary agents own one event
 * each, cross-cutting agents observe and escalate across every event.
 */
export function AgentDirectory() {
  const [query, setQuery] = React.useState("")

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (needle === "") return AGENTS
    return AGENTS.filter(
      (agent) =>
        agent.name.toLowerCase().includes(needle) ||
        agent.role.toLowerCase().includes(needle) ||
        agent.events.some((event) => event.includes(needle)),
    )
  }, [query])

  const primary = filtered.filter((agent) => agent.events.length > 0)
  const crossCutting = filtered.filter((agent) => agent.events.length === 0)

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Agent directory</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            19 agents · one primary owner per event · supporting + exception agents observe every event.
          </p>
        </div>
        <div className="relative w-full sm:w-56">
          <label htmlFor="agent-directory-search" className="sr-only">
            Search agents
          </label>
          <input
            id="agent-directory-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search agents or events…"
            className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {primary.map((agent) => (
          <div key={agent.id} className="rounded-lg border border-border bg-background p-3">
            <div className="text-sm font-medium text-foreground">{agent.name}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{agent.role}</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {agent.events.map((event) => (
                <code key={event} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                  {event}
                </code>
              ))}
            </div>
          </div>
        ))}
      </div>

      {crossCutting.length > 0 ? (
        <div className="mt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Supporting &amp; exception agents
          </h4>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {crossCutting.map((agent) => (
              <div key={agent.id} className="rounded-lg border border-dashed border-border bg-background p-3">
                <div className="text-sm font-medium text-foreground">{agent.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{agent.role}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No agents match “{query}”.</p>
      ) : null}
    </div>
  )
}

export default AgentDirectory

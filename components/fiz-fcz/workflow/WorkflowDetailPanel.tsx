"use client"

import * as React from "react"

import { NOTE_BY_ID, STEP_BY_ID, downstreamIdsOf, upstreamIdsOf } from "./workflowGraph"
import type { DetailTarget } from "./types"

export interface WorkflowDetailPanelProps {
  target: DetailTarget
  onSelect: (nodeId: string) => void
  onClose: () => void
  onNavigate: (nodeId: string) => void
  previousId?: string
  nextId?: string
}

const ZONE_TAG: Record<string, string> = {
  fiz: "FIZ",
  fcz: "FCZ",
  control: "CONTROL",
}

function RelatedChips({
  label,
  ids,
  onSelect,
}: {
  label: string
  ids: readonly string[]
  onSelect: (nodeId: string) => void
}) {
  const items = ids
    .map((id) => ({ id, item: STEP_BY_ID.get(id) ?? NOTE_BY_ID.get(id) }))
    .filter((entry): entry is { id: string; item: NonNullable<ReturnType<typeof STEP_BY_ID.get>> } =>
      Boolean(entry.item),
    )

  return (
    <div>
      <div className="text-xs font-medium text-foreground">{label}</div>
      {items.length === 0 ? (
        <p className="mt-1 text-xs text-muted-foreground">None — this is where the flow {label === "Fed by" ? "starts" : "ends"}.</p>
      ) : (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {items.map(({ id, item }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
              {item.title}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function WorkflowDetailPanel({
  target,
  onSelect,
  onClose,
  onNavigate,
  previousId,
  nextId,
}: WorkflowDetailPanelProps) {
  const definition = target.kind === "step" ? target.definition : target.note

  const title = definition.title
  const sub = definition.sub
  const event = definition.event
  const zone = definition.zone
  const description = definition.description
  const agent = target.kind === "step" ? target.definition.agent : null
  const stepNumber = target.kind === "step" ? target.definition.step : null

  const upstream = upstreamIdsOf(definition.id)
  const downstream = downstreamIdsOf(definition.id)

  return (
    <aside
      aria-label="Workflow step details"
      className="absolute inset-x-0 bottom-0 max-h-[62%] overflow-y-auto rounded-t-xl border-t border-border bg-card/95 p-4 backdrop-blur-md lg:inset-x-auto lg:top-3 lg:right-3 lg:bottom-3 lg:max-h-none lg:w-[330px] lg:rounded-xl lg:border"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {stepNumber !== null ? (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
              {stepNumber}
            </span>
          ) : null}
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {ZONE_TAG[zone] ?? zone}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="rounded-md p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <h3 className="mt-2 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{description}</p>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Ledger event</dt>
          <dd className="mt-1 break-all rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs text-foreground">
            {event}
          </dd>
        </div>
        {agent ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Owner agent</dt>
            <dd className="mt-1 inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-clear-500" />
              {agent}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-4 space-y-3">
        <RelatedChips label="Fed by" ids={upstream} onSelect={onSelect} />
        <RelatedChips label="Leads to" ids={downstream} onSelect={onSelect} />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
        <button
          type="button"
          disabled={!previousId}
          onClick={() => previousId && onNavigate(previousId)}
          className="inline-flex h-8 items-center rounded-md border border-border bg-background px-2.5 text-xs font-medium text-muted-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          type="button"
          disabled={!nextId}
          onClick={() => nextId && onNavigate(nextId)}
          className="inline-flex h-8 items-center rounded-md border border-border bg-background px-2.5 text-xs font-medium text-muted-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </aside>
  )
}

export default WorkflowDetailPanel

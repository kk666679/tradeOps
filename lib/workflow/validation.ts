/**
 * Graph validation service — shared by the editor (advisory) and the server
 * (authoritative, security boundary). Pure functions over a
 * {@link WorkflowDefinition}; no I/O, no React, no Prisma.
 *
 * Three feedback levels:
 *  - `error`  blocks publication / execution
 *  - `warning` permits progression but surfaces a policy-relevant risk
 *  - `info`   maintainability guidance
 */

import type { NodeTypeDef, WorkflowDefinition, WorkflowEdge, WorkflowNode } from './types'

export type ValidationSeverity = 'error' | 'warning' | 'info'

export interface ValidationIssue {
  severity: ValidationSeverity
  /** Stable machine code, e.g. `disconnected_node`. */
  code: string
  message: string
  /** Affected node id, if any. */
  nodeId?: string
  /** Affected edge id, if any. */
  edgeId?: string
}

export interface ValidationResult {
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
  info: ValidationIssue[]
  ok: boolean
  /** Convenience: all issues flattened, errors first. */
  all: ValidationIssue[]
}

export type NodeRegistryLookup = (type: string) => NodeTypeDef | undefined

export interface ValidateOptions {
  /** Registry lookup for supported node types + port compatibility. */
  registry: NodeRegistryLookup
  /**
   * Set of node types that have an executable server handler. Defaults to every
   * registry entry with a non-null `handler`. The server passes the real set so
   * a registered-but-unwired integration can never be published.
   */
  executableTypes?: Set<string>
}

const issue = (
  severity: ValidationSeverity,
  code: string,
  message: string,
  ref?: { nodeId?: string; edgeId?: string },
): ValidationIssue => ({ severity, code, message, ...ref })

function finalize(errors: ValidationIssue[], warnings: ValidationIssue[], info: ValidationIssue[]): ValidationResult {
  return { errors, warnings, info, ok: errors.length === 0, all: [...errors, ...warnings, ...info] }
}

/** Build adjacency + in/out degree maps for the directed graph. */
function buildAdjacency(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const outgoing = new Map<string, WorkflowEdge[]>()
  const incoming = new Map<string, WorkflowEdge[]>()
  for (const n of nodes) {
    outgoing.set(n.id, [])
    incoming.set(n.id, [])
  }
  for (const e of edges) {
    outgoing.get(e.source)?.push(e)
    incoming.get(e.target)?.push(e)
  }
  return { outgoing, incoming }
}

/** Reachable node ids from the given roots following edge direction. */
function reachable(roots: string[], outgoing: Map<string, WorkflowEdge[]>): Set<string> {
  const seen = new Set<string>()
  const stack = [...roots]
  while (stack.length) {
    const id = stack.pop() as string
    if (seen.has(id)) continue
    seen.add(id)
    for (const e of outgoing.get(id) ?? []) stack.push(e.target)
  }
  return seen
}

/** True when a node type is an explicitly-modelled bounded loop. */
function isLoopNode(def: NodeTypeDef): boolean {
  return def.type === 'logic.loop' || def.type === 'logic.batch'
}

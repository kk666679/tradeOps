import { getWorkflowNode } from './catalog'
import type { NodeTypeDef, WorkflowDefinition, WorkflowEdge } from './types'

export type ValidationSeverity = 'error' | 'warning' | 'info'
export interface ValidationIssue {
  severity: ValidationSeverity
  code: string
  message: string
  nodeId?: string
  edgeId?: string
}
export interface ValidationResult {
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
  info: ValidationIssue[]
  ok: boolean
  all: ValidationIssue[]
}
export type NodeRegistryLookup = (type: string) => NodeTypeDef | undefined
export interface ValidateOptions {
  registry?: NodeRegistryLookup
  executableTypes?: Set<string>
}

export function validateWorkflow(definition: WorkflowDefinition, options: ValidateOptions = {}): ValidationResult {
  const errors: ValidationIssue[] = []
  const warnings: ValidationIssue[] = []
  const info: ValidationIssue[] = []
  const add = (severity: ValidationSeverity, code: string, message: string, ref: Pick<ValidationIssue, 'nodeId' | 'edgeId'> = {}) => {
    ({ error: errors, warning: warnings, info }[severity]).push({ severity, code, message, ...ref })
  }
  const registry = options.registry ?? getWorkflowNode
  const nodes = Array.isArray(definition?.nodes) ? definition.nodes : []
  const edges = Array.isArray(definition?.edges) ? definition.edges : []
  if (!definition || definition.schemaVersion !== 1) add('error', 'schema_version', 'Workflow schema version must be 1.')
  if (nodes.length < 2) add('error', 'graph_too_small', 'Add a trigger and at least one node.')
  if (nodes.length > 50 || edges.length > 100) add('error', 'graph_limit', 'Workflows are limited to 50 nodes and 100 connections.')

  const nodeMap = new Map<string, (typeof nodes)[number]>()
  for (const node of nodes) {
    if (!node.id || nodeMap.has(node.id)) add('error', 'duplicate_node', 'Node IDs must be present and unique.', { nodeId: node.id })
    nodeMap.set(node.id, node)
    const definition = registry(node.type)
    if (!definition) {
      add('error', 'unsupported_node', `Node type “${node.type}” is not registered.`, { nodeId: node.id })
      continue
    }
    if (options.executableTypes && !options.executableTypes.has(node.type)) add('error', 'missing_handler', `Node “${definition.label}” has no execution handler.`, { nodeId: node.id })
    for (const field of definition.config) {
      const value = node.data?.config?.[field.key]
      if (field.required && (value === undefined || value === null || value === '')) add('error', 'required_config', `${field.label} is required.`, { nodeId: node.id })
    }
    if (!Number.isFinite(node.position?.x) || !Number.isFinite(node.position?.y)) add('error', 'invalid_position', 'Node position must be finite.', { nodeId: node.id })
    if (node.type === 'data.transform') {
      const mapping = node.data?.config?.mapping
      if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping) || Object.keys(mapping as object).length === 0) add('error', 'empty_mapping', 'Transform mapping must contain at least one output field.', { nodeId: node.id })
    }
    if (node.type === 'logic.condition' && !String(node.data?.config?.path ?? '').trim()) add('error', 'condition_path', 'Condition value path is required.', { nodeId: node.id })
    const timeout = node.data?.config?.timeoutMs
    if (timeout !== undefined && (!Number.isInteger(timeout) || Number(timeout) < 100 || Number(timeout) > 30_000)) add('error', 'invalid_timeout', 'Timeout must be between 100 and 30,000 ms.', { nodeId: node.id })
  }
  const triggers = nodes.filter((node) => registry(node.type)?.trigger)
  if (triggers.length !== 1) add('error', 'trigger_count', 'A workflow must have exactly one trigger.')
  if (!nodes.some((node) => node.type === 'flow.output')) add('error', 'output_required', 'Add an output node to return a workflow result.')

  const outgoing = new Map<string, WorkflowEdge[]>()
  const incoming = new Map<string, WorkflowEdge[]>()
  nodes.forEach((node) => { outgoing.set(node.id, []); incoming.set(node.id, []) })
  const seenEdges = new Set<string>()
  for (const edge of edges) {
    const source = nodeMap.get(edge.source)
    const target = nodeMap.get(edge.target)
    if (!source || !target) { add('error', 'missing_endpoint', 'Connection references a node that does not exist.', { edgeId: edge.id }); continue }
    if (edge.source === edge.target) add('error', 'self_connection', 'A node cannot connect to itself.', { edgeId: edge.id })
    const key = `${edge.source}:${edge.sourceHandle ?? ''}>${edge.target}:${edge.targetHandle ?? ''}`
    if (seenEdges.has(key)) add('error', 'duplicate_edge', 'Duplicate connections are not allowed.', { edgeId: edge.id })
    seenEdges.add(key)
    const sourcePort = registry(source.type)?.outputs.find((port) => port.id === (edge.sourceHandle ?? 'out'))
    const targetPort = registry(target.type)?.inputs.find((port) => port.id === (edge.targetHandle ?? 'in'))
    if (!sourcePort) add('error', 'invalid_output_handle', 'Connection uses an unknown output port.', { edgeId: edge.id })
    if (!targetPort) add('error', 'invalid_input_handle', 'Connection uses an unknown input port.', { edgeId: edge.id })
    if (sourcePort && targetPort && sourcePort.kind !== targetPort.kind) add('error', 'port_type_mismatch', 'Control and data ports cannot be connected to each other.', { edgeId: edge.id })
    outgoing.get(edge.source)?.push(edge)
    incoming.get(edge.target)?.push(edge)
  }
  for (const node of nodes.filter((entry) => entry.type === 'logic.condition')) {
    const handles = outgoing.get(node.id)?.map((edge) => edge.sourceHandle ?? edge.label) ?? []
    if (!handles.includes('true') || !handles.includes('false')) add('error', 'missing_branch', 'Connect both true and false condition outputs.', { nodeId: node.id })
  }

  const color = new Map<string, 0 | 1 | 2>()
  const visit = (id: string): boolean => {
    color.set(id, 1)
    for (const edge of outgoing.get(id) ?? []) {
      const state = color.get(edge.target) ?? 0
      if (state === 1 || (state === 0 && visit(edge.target))) return true
    }
    color.set(id, 2)
    return false
  }
  for (const node of nodes) if (!color.get(node.id) && visit(node.id)) { add('error', 'cycle', 'Cycles are not supported by this workflow engine.', { nodeId: node.id }); break }

  const trigger = triggers[0]
  if (trigger) {
    const reachable = new Set<string>()
    const stack = [trigger.id]
    while (stack.length) {
      const id = stack.pop()!
      if (reachable.has(id)) continue
      reachable.add(id)
      for (const edge of outgoing.get(id) ?? []) stack.push(edge.target)
    }
    for (const node of nodes) if (!reachable.has(node.id)) add('error', 'unreachable_node', 'Node is not reachable from the trigger.', { nodeId: node.id })
  }
  if (edges.length === 0) add('info', 'no_connections', 'Connect the trigger to the next workflow step.')
  return { errors, warnings, info, ok: errors.length === 0, all: [...errors, ...warnings, ...info] }
}

export function canConnect(connection: { source?: string | null; target?: string | null; sourceHandle?: string | null; targetHandle?: string | null }, nodes: WorkflowDefinition['nodes'], edges: WorkflowEdge[]): boolean {
  if (!connection.source || !connection.target || connection.source === connection.target) return false
  if (edges.some((edge) => edge.source === connection.source && edge.target === connection.target && edge.sourceHandle === connection.sourceHandle && edge.targetHandle === connection.targetHandle)) return false
  const source = nodes.find((node) => node.id === connection.source)
  const target = nodes.find((node) => node.id === connection.target)
  if (!source || !target) return false
  const sourcePort = getWorkflowNode(source.type)?.outputs.find((port) => port.id === (connection.sourceHandle ?? 'out'))
  const targetPort = getWorkflowNode(target.type)?.inputs.find((port) => port.id === (connection.targetHandle ?? 'in'))
  if (!sourcePort || !targetPort || sourcePort.kind !== targetPort.kind) return false
  const adjacency = new Map<string, string[]>()
  nodes.forEach((node) => adjacency.set(node.id, []))
  edges.forEach((edge) => adjacency.get(edge.source)?.push(edge.target))
  const stack = [connection.target]
  const seen = new Set<string>()
  while (stack.length) {
    const id = stack.pop()!
    if (id === connection.source) return false
    if (seen.has(id)) continue
    seen.add(id); stack.push(...(adjacency.get(id) ?? []))
  }
  return true
}

/**
 * Workflow domain contracts.
 *
 * These types are the single source of truth for the visual workflow platform:
 * the React Flow editor, the AI Copilot (proposal + diff), the server-side
 * validator, and the execution engine all speak this vocabulary.
 *
 * The definitions are intentionally serialisable (JSON) so a graph can be
 * persisted verbatim inside `Workflow.definition` and round-tripped between the
 * editor, the server, and an execution run without lossy transforms.
 */

/** Lifecycle of a workflow directory entry (logical workflow). */
export type WorkflowStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'ARCHIVED'

/** Lifecycle of an execution run. */
export type RunStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'WAITING_APPROVAL'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'TIMED_OUT'

/** Lifecycle of a single node within a run. */
export type NodeRunStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'WAITING_APPROVAL'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'SKIPPED'
  | 'RETRYING'
  | 'CANCELLED'

/** Categories drive the node library grouping and iconography. */
export type NodeCategory =
  | 'trigger'
  | 'operational'
  | 'logic'
  | 'ai'
  | 'human'
  | 'integration'
  | 'notification'
  | 'flow'

/** A semantic port. `flow` ports carry control; `data` ports carry payload. */
export interface PortDef {
  id: string
  label: string
  kind: 'control' | 'data'
  /** Loose data-type hint used for connection-compatibility warnings. */
  dataType?: 'any' | 'event' | 'record' | 'document' | 'decision' | 'boolean' | 'text'
}

/** A declarative configuration field rendered by the inspector. */
export interface ConfigField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'switch' | 'secret-ref' | 'json'
  required?: boolean
  placeholder?: string
  help?: string
  options?: { label: string; value: string }[]
  default?: unknown
}

/** Full static description of a node type in the registry. */
export interface NodeTypeDef {
  type: string
  label: string
  description: string
  category: NodeCategory
  /** lucide-react icon name resolved by the client node renderer. */
  icon: string
  inputs: PortDef[]
  outputs: PortDef[]
  config: ConfigField[]
  /**
   * Server-side handler identifier. `null` means the node is a first-class part
   * of the graph but has no executable backend yet (e.g. an integration that is
   * registered but not wired) — it is visibly marked unavailable and blocks
   * publication.
   */
  handler: string | null
  /** Permissions the executing principal must hold. */
  permissions: string[]
  /** Integration dependency key, if any (e.g. `wms`, `customs`). */
  integration?: string
  /** Human interaction checkpoint (persisted as an approval, not just a node). */
  requiresHuman?: boolean
  retryable: boolean
  timeoutCapable: boolean
  dryRunSafe: boolean
  trigger?: boolean
  /** Accent colour token for the canvas renderer. */
  accent?: 'primary' | 'amber' | 'violet' | 'emerald' | 'rose' | 'slate'
}

/** A node instance in a graph definition. */
export interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    config: Record<string, unknown>
    /** Optional free-form notes shown in the inspector. */
    notes?: string
  }
}

/** An edge instance in a graph definition. */
export interface WorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  /** Branch label (e.g. condition outcome). */
  label?: string
  data?: Record<string, unknown>
}

/** Trigger configuration for the logical workflow. */
export interface WorkflowTrigger {
  type: 'manual' | 'schedule' | 'webhook' | 'event'
  cron?: string
  eventTopic?: string
  webhookPath?: string
}

/** The persisted, validated graph definition. */
export interface WorkflowDefinition {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  trigger: WorkflowTrigger
  variables?: { key: string; type: 'text' | 'number' | 'boolean' | 'json'; default?: unknown }[]
}

/** Per-node execution state recorded inside a run. */
export interface NodeRunState {
  nodeId: string
  status: NodeRunStatus
  attempts: number
  startedAt?: string
  endedAt?: string
  input?: unknown
  output?: unknown
  error?: string
  /** Approval checkpoint id, when this node is a human gate. */
  approvalId?: string
}

/** Directory entry returned to the workflow list UI. */
export interface WorkflowDirectoryItem {
  workflowId: string
  draftId: string | null
  name: string
  description: string | null
  category: string | null
  status: WorkflowStatus
  publishedVersion: string | null
  latestVersion: string | null
  triggerType: string | null
  lastRunStatus: RunStatus | null
  lastRunAt: string | null
  runCount: number
  successCount: number
  failureCount: number
  updatedAt: string
  updatedBy: string | null
}

/** Aggregate metrics for the directory header. */
export interface WorkflowStats {
  total: number
  published: number
  draft: number
  paused: number
  runningRuns: number
  failedRuns: number
  successRate: number
  windowDays: number
}

export interface WorkflowRunSummary {
  id: string
  workflowId: string
  version: string
  status: RunStatus
  triggerSource: string
  startedAt: string
  endedAt: string | null
  durationMs: number | null
  error: string | null
  initiatedBy: string | null
}

export interface WorkflowRunDetail extends WorkflowRunSummary {
  input: unknown
  output: unknown
  nodeStates: NodeRunState[]
  definition: WorkflowDefinition
  correlationId: string | null
}

export interface WorkflowApproval {
  id: string
  tenantId: string
  workflowId: string
  runId: string
  nodeId: string
  action: string
  context: Record<string, unknown>
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'
  requestedBy: string | null
  assigneeRole: string | null
  decidedBy: string | null
  decision: string | null
  comment: string | null
  createdAt: string
  decidedAt: string | null
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  prerequisites: string[]
  requiredIntegrations: string[]
  variables: { key: string; type: 'text' | 'number' | 'boolean' | 'json'; default?: unknown }[]
  /** A complete, validated draft definition the template seeds. */
  definition: WorkflowDefinition
  /** True when the template only exercises capabilities that are executable now. */
  executable: boolean
}

/** Proposed, reviewable changes to an existing workflow graph. */
export interface GraphDiff {
  nodes?: {
    add?: WorkflowNode[]
    update?: WorkflowNode[]
    remove?: string[]
  }
  edges?: {
    add?: WorkflowEdge[]
    update?: WorkflowEdge[]
    remove?: string[]
  }
}

/** AI Copilot interaction modes. */
export type CopilotMode = 'generate' | 'edit' | 'explain' | 'debug' | 'optimize' | 'document'

/** A structured, reviewable response from the Copilot. */
export interface CopilotResponse {
  mode: CopilotMode
  /** Human-readable markdown summary / explanation. */
  message: string
  /** Proposed workflow metadata (generate mode). */
  proposal?: {
    name: string
    description: string
    definition: WorkflowDefinition
    missingPrerequisites: string[]
    warnings: string[]
  }
  /** Proposed graph change set (edit mode) — applied only on confirmation. */
  diff?: GraphDiff
  /** Citations / grounded sources, when the backend returns them. */
  sources?: { title: string; href?: string }[]
}

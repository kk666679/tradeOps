// @ts-nocheck — see docs/app-walkthroughs-e2e-audit.md
// components/workflow-studio/types/workflow.ts
import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Node types                                                         */
/* ------------------------------------------------------------------ */

export const NODE_TYPES = [
  "trigger.manual",
  "logic.condition",
  "data.transform",
  "trigger.shipment.created",
  "trigger.shipment.status_changed",
  "trigger.document.uploaded",
  "trigger.deadline.scheduled",

  "logic.document_missing",
  "logic.value_threshold",
  "logic.hs_classification_review",
  "logic.permit_required",
  "logic.customs_rejected",
  "logic.inspection_selected",
  "logic.approval_outcome",
  "logic.wait_for_event",

  "action.create_task",
  "action.assign_agent",
  "action.request_documents",
  "action.notify",
  "action.generate_checklist",
  "action.prepare_declaration",
  "action.request_approval",
  "action.submit_declaration",
  "action.record_customs_response",
  "action.record_payment",
  "action.update_shipment_status",
  "action.create_audit_event",

  "data.map_shipment_fields",
  "data.normalize_document_metadata",
  "data.validate_required",
  "data.calculate_deadline",
  "data.merge_results",
  "data.format_notification",

  "output",
] as const;
export type WorkflowNodeType = (typeof NODE_TYPES)[number];
export const NodeTypeSchema = z.enum(NODE_TYPES);

/* ------------------------------------------------------------------ */
/* Geometry                                                           */
/* ------------------------------------------------------------------ */

export const PositionSchema = z.object({ x: z.number(), y: z.number() });
export type Position = z.infer<typeof PositionSchema>;

export const ViewportSchema = z.object({
  x: z.number(),
  y: z.number(),
  zoom: z.number().positive().max(4),
});
export type Viewport = z.infer<typeof ViewportSchema>;

export const NodeSizeSchema = z.object({
  width: z.number().positive().max(600).optional(),
  height: z.number().positive().max(400).optional(),
});
export type NodeSize = z.infer<typeof NodeSizeSchema>;

/* ------------------------------------------------------------------ */
/* Node and edge                                                      */
/* ------------------------------------------------------------------ */

export const WorkflowNodeSchema = z.object({
  id: z.string().min(1),
  type: NodeTypeSchema,
  position: PositionSchema,
  size: NodeSizeSchema.optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  config: z.record(z.unknown()).default({}),
  timeoutMs: z.number().int().positive().optional(),
  retryPolicy: z.object({
    maxAttempts: z.number().int().positive().max(5).default(1),
    backoffMs: z.number().int().nonnegative().default(0),
  }).optional(),
  /** True when the node requires a human approver. */
  approvalRequired: z.boolean().optional(),
  /** Role required to approve, when approvalRequired is true. */
  approverRole: z.enum([
    "CUSTOMS_BROKER", "SENIOR_BROKER", "BROKERAGE_MANAGER",
    "COMPLIANCE_REVIEWER", "FINANCE_OFFICER", "ADMIN",
  ]).optional(),
  /** True when the node may cause an external side effect. */
  externalSideEffect: z.boolean().optional(),
}).passthrough();
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;

const PersistedWorkflowNodeSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  position: PositionSchema,
  size: NodeSizeSchema.optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  timeoutMs: z.number().int().positive().optional(),
  retryPolicy: z.object({
    maxAttempts: z.number().int().positive().max(5).default(1),
    backoffMs: z.number().int().nonnegative().default(0),
  }).optional(),
  approvalRequired: z.boolean().optional(),
  approverRole: z.string().optional(),
  externalSideEffect: z.boolean().optional(),
}).passthrough();

export const WorkflowEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  sourceHandle: z.string().default("out"),
  targetHandle: z.string().default("in"),
  label: z.string().optional(),
  type: z.string().optional(),
}).passthrough();
export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>;

export const WorkflowDefinitionSchema = z.object({
  nodes: z.array(PersistedWorkflowNodeSchema),
  edges: z.array(WorkflowEdgeSchema),
  viewport: ViewportSchema.default({ x: 0, y: 0, zoom: 1 }),
}).passthrough().transform((definition) => definition as unknown as {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport: Viewport;
});
export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;

/* ------------------------------------------------------------------ */
/* Persistence                                                        */
/* ------------------------------------------------------------------ */

export const WorkflowStatusSchema = z.enum(["draft", "published", "archived"]);
export type WorkflowStatus = z.infer<typeof WorkflowStatusSchema>;

export const WorkflowSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: WorkflowStatusSchema,
  version: z.number().int().nonnegative(),
  definition: WorkflowDefinitionSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Workflow = z.infer<typeof WorkflowSchema>;

/* ------------------------------------------------------------------ */
/* Execution + provenance                                             */
/* ------------------------------------------------------------------ */

export type Provenance = "production_api" | "manual_observation" | "synthetic";

export const ExecutionStatusSchema = z.enum([
  "queued", "running", "succeeded", "failed", "cancelled",
  "waiting_approval", "waiting_external", "integration_required",
]);
export type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>;

export const NodeRunStatusSchema = z.enum([
  "pending", "running", "succeeded", "failed", "skipped",
  "waiting", "blocked",
]);
export type NodeRunStatus = z.infer<typeof NodeRunStatusSchema>;

export const WorkflowNodeRunSchema = z.object({
  id: z.string(),
  executionId: z.string(),
  nodeId: z.string(),
  nodeType: NodeTypeSchema,
  status: NodeRunStatusSchema,
  provenance: z.enum(["production_api", "manual_observation", "synthetic"]).optional(),
  input: z.unknown().nullable().optional(),
  output: z.unknown().nullable().optional(),
  logs: z.array(z.object({
    level: z.enum(["debug", "info", "warn", "error"]),
    message: z.string(),
    at: z.string().optional(),
  })).nullable().optional(),
  error: z.string().nullable().optional(),
  startedAt: z.string().nullable().optional(),
  endedAt: z.string().nullable().optional(),
  durationMs: z.number().nullable().optional(),
  attempt: z.number().int().optional(),
});
export type WorkflowNodeRun = z.infer<typeof WorkflowNodeRunSchema>;

export const WorkflowExecutionSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  workflowId: z.string(),
  workflowVersion: z.number().int(),
  status: ExecutionStatusSchema,
  triggerKind: z.enum(["manual", "shipment.created", "shipment.status_changed", "document.uploaded", "deadline.scheduled"]),
  triggerPayload: z.unknown().nullable().optional(),
  output: z.unknown().nullable().optional(),
  error: z.string().nullable().optional(),
  startedAt: z.string(),
  endedAt: z.string().nullable().optional(),
  durationMs: z.number().nullable().optional(),
  nodeRuns: z.array(WorkflowNodeRunSchema).default([]),
});
export type WorkflowExecution = z.infer<typeof WorkflowExecutionSchema>;

/* ------------------------------------------------------------------ */
/* Adapter capability snapshot (read-only mirror of JKDM caps)        */
/* ------------------------------------------------------------------ */

export interface JkdmCapabilitySnapshot {
  mode: "production" | "development" | "manual";
  submitDeclaration: boolean;
  queryDeclarationStatus: boolean;
  requiresManualRecording: boolean;
  productionEnabled: boolean;
  transportVerified: boolean;
}

/* ------------------------------------------------------------------ */
/* Validation                                                         */
/* ------------------------------------------------------------------ */

export const ValidationIssueSchema = z.object({
  code: z.string(),
  message: z.string(),
  type: z.string().optional(),
  severity: z.enum(["error", "warning"]),
  nodeId: z.string().optional(),
  edgeId: z.string().optional(),
  resolution: z.string().optional(),
});
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;

export interface ValidationResult {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  isValid: boolean;
}

/* ------------------------------------------------------------------ */
/* Expression                                                         */
/* ------------------------------------------------------------------ */

export interface ParsedExpression {
  body: string;
  path: string[];
  start: number;
  end: number;
}

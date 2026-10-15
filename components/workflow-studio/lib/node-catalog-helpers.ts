// components/workflow-studio/lib/node-catalog-helpers.ts
import type { WorkflowNodeType } from "../types/workflow";

export interface CatalogCategory { id: string; label: string; description?: string; }

export interface CatalogEntry {
  type: WorkflowNodeType;
  label: string;
  description: string;
  categoryId: string;
  defaultConfig: Record<string, unknown>;
  /** Which adapter capability gates this node, if any. */
  requiresCapability?: "submitDeclaration" | "queryDeclarationStatus";
  /** True when the node can cause an external side effect. */
  externalSideEffect?: boolean;
  /** True when the node needs a human approver. */
  approvalRequired?: boolean;
  branching?: boolean;
}

export const CATALOG: CatalogEntry[] = [
  // Triggers
  { type: "trigger.manual", label: "Manual trigger", description: "Start the workflow by hand.", categoryId: "triggers", defaultConfig: { samplePayload: {} } },
  { type: "trigger.shipment.created", label: "Shipment created", description: "Fires when a new shipment is created.", categoryId: "triggers", defaultConfig: {} },
  { type: "trigger.shipment.status_changed", label: "Shipment status changed", description: "Fires on a status transition.", categoryId: "triggers", defaultConfig: { toStatuses: [] } },
  { type: "trigger.document.uploaded", label: "Document uploaded", description: "Fires when a document is attached to a shipment.", categoryId: "triggers", defaultConfig: { documentTypes: [] } },
  { type: "trigger.deadline.scheduled", label: "Scheduled deadline check", description: "Cron-style check for approaching deadlines.", categoryId: "triggers", defaultConfig: { cron: "0 9 * * *" } },

  // Logic
  { type: "logic.condition", label: "Condition", description: "Branch on a trigger or upstream value.", categoryId: "logic", defaultConfig: { path: "trigger.value", operator: "isTruthy" }, branching: true },
  { type: "logic.document_missing", label: "Document missing?", description: "Branch on document completeness.", categoryId: "logic", defaultConfig: { documentTypes: [] }, branching: true },
  { type: "logic.value_threshold", label: "Value threshold", description: "Branch when declared value exceeds a threshold.", categoryId: "logic", defaultConfig: { thresholdMYR: 250000 }, branching: true },
  { type: "logic.hs_classification_review", label: "HS review needed?", description: "Branch when HS confidence is below threshold.", categoryId: "logic", defaultConfig: { minConfidence: 0.8 }, branching: true },
  { type: "logic.permit_required", label: "Permit required?", description: "Check the HS code against the control list.", categoryId: "logic", defaultConfig: {}, branching: true },
  { type: "logic.customs_rejected", label: "Customs rejected?", description: "Branch on JKDM rejection.", categoryId: "logic", defaultConfig: {}, branching: true },
  { type: "logic.inspection_selected", label: "Inspection selected?", description: "Red channel or explicit inspection.", categoryId: "logic", defaultConfig: {}, branching: true },
  { type: "logic.approval_outcome", label: "Approval outcome", description: "Branch on the previous approval decision.", categoryId: "logic", defaultConfig: {}, branching: true },
  { type: "logic.wait_for_event", label: "Wait for event", description: "Durable wait for a JKDM response, approval, or document upload.", categoryId: "logic", defaultConfig: { eventKinds: [], timeoutHours: 168 } },

  // Actions
  { type: "action.create_task", label: "Create task", description: "Create a brokerage task.", categoryId: "actions", defaultConfig: { title: "", assigneeRole: "CUSTOMS_BROKER", dueInHours: 24 } },
  { type: "action.assign_agent", label: "Assign agent", description: "Assign a clearance agent to the shipment.", categoryId: "actions", defaultConfig: {} },
  { type: "action.request_documents", label: "Request documents", description: "Notify the client for missing documents.", categoryId: "actions", defaultConfig: { documentTypes: [] }, externalSideEffect: true },
  { type: "action.notify", label: "Notify", description: "Send an approved notification.", categoryId: "actions", defaultConfig: { channel: "in_app", audience: "broker" }, externalSideEffect: true },
  { type: "action.generate_checklist", label: "Generate checklist", description: "Build a document checklist.", categoryId: "actions", defaultConfig: { template: "K1_import" } },
  { type: "action.prepare_declaration", label: "Prepare declaration", description: "Pre-fill a K1/K2/K3/K7/K8/K9 draft.", categoryId: "actions", defaultConfig: { formCode: "K1" } },
  { type: "action.request_approval", label: "Request approval", description: "Route to a human approver.", categoryId: "actions", defaultConfig: { role: "CUSTOMS_BROKER", thresholdRole: "SENIOR_BROKER" }, approvalRequired: true },
  { type: "action.submit_declaration", label: "Submit declaration", description: "Submit to JKDM through the configured adapter.", categoryId: "actions", defaultConfig: {}, requiresCapability: "submitDeclaration", externalSideEffect: true },
  { type: "action.record_customs_response", label: "Record customs response", description: "Record the JKDM response (integration or manual).", categoryId: "actions", defaultConfig: {} },
  { type: "action.record_payment", label: "Record payment", description: "Record payment evidence and reconciliation.", categoryId: "actions", defaultConfig: {} },
  { type: "action.update_shipment_status", label: "Update shipment status", description: "Transition the shipment status.", categoryId: "actions", defaultConfig: { toStatus: "declaration_draft" } },
  { type: "action.create_audit_event", label: "Audit event", description: "Write a custom audit marker.", categoryId: "actions", defaultConfig: { kind: "" } },

  // Data
  { type: "data.transform", label: "Transform", description: "Map trigger fields into a workflow output.", categoryId: "data", defaultConfig: { mapping: { result: "{{trigger}}" } } },
  { type: "data.map_shipment_fields", label: "Map shipment fields", description: "Extract fields from the shipment record.", categoryId: "data", defaultConfig: { mappings: [] } },
  { type: "data.normalize_document_metadata", label: "Normalize document metadata", description: "Normalize dates, currencies, and identifiers.", categoryId: "data", defaultConfig: {} },
  { type: "data.validate_required", label: "Validate required data", description: "Refuse if required fields are missing.", categoryId: "data", defaultConfig: { required: [] } },
  { type: "data.calculate_deadline", label: "Calculate deadline", description: "Compute a deadline in Malaysian working days.", categoryId: "data", defaultConfig: { baseField: "arrivalDate", addWorkingDays: 3 } },
  { type: "data.merge_results", label: "Merge results", description: "Combine multiple branches.", categoryId: "data", defaultConfig: { policy: "last_wins" } },
  { type: "data.format_notification", label: "Format notification", description: "Build the notification body.", categoryId: "data", defaultConfig: { template: "" } },

  // Output
  { type: "output", label: "Output", description: "Final workflow output.", categoryId: "utility", defaultConfig: { value: "" } },
];

export function filterBySupportedTypes(
  catalog: readonly CatalogEntry[],
  supported?: ReadonlySet<string>,
): CatalogEntry[] {
  return supported ? catalog.filter((entry) => supported.has(entry.type)) : [...catalog];
}

export const CATEGORIES: CatalogCategory[] = [
  { id: "triggers", label: "Triggers" },
  { id: "logic",    label: "Logic & branching" },
  { id: "actions",  label: "Actions" },
  { id: "data",     label: "Data" },
  { id: "utility",  label: "Utilities" },
];

export function findCatalogEntry(type: WorkflowNodeType): CatalogEntry | undefined {
  return CATALOG.find((c) => c.type === type);
}

export function catalogByCategory(): Map<string, CatalogEntry[]> {
  const map = new Map<string, CatalogEntry[]>();
  for (const c of CATEGORIES) map.set(c.id, []);
  for (const e of CATALOG) {
    if (!map.has(e.categoryId)) map.set(e.categoryId, []);
    map.get(e.categoryId)!.push(e);
  }
  return map;
}

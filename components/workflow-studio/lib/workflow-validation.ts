// components/workflow-studio/lib/workflow-validation.ts
//
// Same rules as backend/src/workflow/validation.ts, plus brokerage rules:
//   - submit_declaration must be preceded by an approval node
//   - submit_declaration must be preceded by a validation node
//   - record_customs_response must be preceded by submit_declaration OR
//     be reachable from a manual trigger (manual adapter path)
//   - output must have exactly one incoming edge

import type {
  ValidationIssue, ValidationResult, WorkflowDefinition,
  JkdmCapabilitySnapshot,
} from "../types/workflow";
import { topoSort, incomingEdges, outgoingEdges } from "./workflow-graph";

const NODE_LIMIT = 200;

export function validateWorkflow(
  def: WorkflowDefinition,
  caps?: JkdmCapabilitySnapshot,
): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (def.nodes.length > NODE_LIMIT) {
    errors.push({ code: "node_limit", message: `Too many nodes (${def.nodes.length} > ${NODE_LIMIT}).`, severity: "error" });
  }

  const triggers = def.nodes.filter((n) => n.type.startsWith("trigger."));
  if (triggers.length === 0) {
    errors.push({ code: "no_trigger", message: "Workflow must have exactly one trigger.", severity: "error" });
  } else if (triggers.length > 1) {
    for (const t of triggers.slice(1)) errors.push({ code: "multiple_triggers", message: "Only one trigger allowed.", severity: "error", nodeId: t.id });
  }

  const outputs = def.nodes.filter((n) => n.type === "output");
  if (outputs.length === 0) {
    errors.push({ code: "no_output", message: "Workflow must have exactly one Output node.", severity: "error" });
  } else if (outputs.length > 1) {
    for (const o of outputs.slice(1)) errors.push({ code: "multiple_outputs", message: "Only one Output allowed.", severity: "error", nodeId: o.id });
  }

  const { cycle } = topoSort(def);
  for (const id of cycle) errors.push({ code: "cycle", message: "Workflow contains a cycle.", severity: "error", nodeId: id });

  // ---- JKDM-specific rules ----
  const submitNodes = def.nodes.filter((n) => n.type === "action.submit_declaration");
  for (const submit of submitNodes) {
    const ins = incomingEdges(def, submit.id).map((e) => e.source);
    const hasApproval = ins.some((id) => def.nodes.find((n) => n.id === id)?.type === "action.request_approval");
    const hasValidation = ins.some((id) => def.nodes.find((n) => n.id === id)?.type === "data.validate_required");
    if (!hasApproval) {
      errors.push({
        code: "submit_without_approval",
        message: "Submission node must be preceded by a request_approval node.",
        severity: "error",
        nodeId: submit.id,
        resolution: "Insert a 'Request approval' node before 'Submit declaration'.",
      });
    }
    if (!hasValidation) {
      errors.push({
        code: "submit_without_validation",
        message: "Submission node must be preceded by a validate_required node.",
        severity: "error",
        nodeId: submit.id,
        resolution: "Insert a 'Validate required data' node before 'Submit declaration'.",
      });
    }
    // When the adapter cannot submit, warn but do not block — manual path is legal.
    if (caps && !caps.submitDeclaration && caps.mode !== "production") {
      warnings.push({
        code: "submit_adapter_unavailable",
        message: "JKDM submission is not currently available; the workflow will stop at integration_required.",
        severity: "warning",
        nodeId: submit.id,
        resolution: "Enable JKDM_PRODUCTION_ENABLED + JKDM_TRANSPORT_VERIFIED, or accept manual recording.",
      });
    }
  }

  const recordNodes = def.nodes.filter((n) => n.type === "action.record_customs_response");
  for (const rec of recordNodes) {
    const ins = incomingEdges(def, rec.id).map((e) => e.source);
    const fromSubmit = ins.some((id) => def.nodes.find((n) => n.id === id)?.type === "action.submit_declaration");
    const fromManualTrigger = triggers.some((t) => {
      // naive reachability check
      const visited = new Set<string>([t.id]);
      const stack = [t.id];
      while (stack.length) {
        const cur = stack.pop()!;
        if (cur === rec.id) return true;
        for (const e of outgoingEdges(def, cur)) if (!visited.has(e.target)) { visited.add(e.target); stack.push(e.target); }
      }
      return false;
    });
    if (!fromSubmit && !fromManualTrigger) {
      warnings.push({
        code: "record_unreachable",
        message: "record_customs_response is not reachable from a submission or manual trigger.",
        severity: "warning",
        nodeId: rec.id,
      });
    }
  }

  // ---- Required config per node type ----
  for (const node of def.nodes) {
    if (node.type === "data.validate_required") {
      const required = (node.config as { required?: unknown[] }).required;
      if (!Array.isArray(required) || required.length === 0) {
        errors.push({ code: "validate_empty", message: "validate_required has no required fields.", severity: "error", nodeId: node.id });
      }
    }
    if (node.type === "action.create_task") {
      const title = (node.config as { title?: string }).title;
      if (!title?.trim()) errors.push({ code: "task_no_title", message: "create_task requires a title.", severity: "error", nodeId: node.id });
    }
    if (node.type === "logic.value_threshold") {
      const t = (node.config as { thresholdMYR?: number }).thresholdMYR;
      if (typeof t !== "number" || t <= 0) {
        errors.push({ code: "threshold_invalid", message: "value_threshold requires a positive thresholdMYR.", severity: "error", nodeId: node.id });
      }
    }
  }

  return { errors, warnings, isValid: errors.length === 0 };
}

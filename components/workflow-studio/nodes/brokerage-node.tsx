"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { NodeShell } from "./node-shell";
import { findCatalogEntry } from "../lib/node-catalog-helpers";
import type { WorkflowNodeType } from "../types/workflow";
import type { GenericNodeData } from "./generic-node";

function summarize(type: WorkflowNodeType, config: Record<string, unknown>): string {
  switch (type) {
    case "trigger.shipment.status_changed":
      return Array.isArray(config.toStatuses) ? `${config.toStatuses.length} target status(es)` : "Shipment status event";
    case "trigger.document.uploaded":
      return Array.isArray(config.documentTypes) ? `${config.documentTypes.length} document type(s)` : "Document upload event";
    case "trigger.deadline.scheduled":
      return String(config.cron ?? "Scheduled event");
    case "action.create_task":
      return String(config.title ?? "Task details required");
    case "action.assign_agent":
      return String(config.assigneeRole ?? "Assign a clearance agent");
    case "action.request_documents":
      return Array.isArray(config.documentTypes) ? `${config.documentTypes.length} document request(s)` : "Request client documents";
    case "action.notify":
      return `${String(config.channel ?? "in_app")} · ${String(config.audience ?? "broker")}`;
    case "action.generate_checklist":
      return String(config.template ?? "Checklist template required");
    case "action.prepare_declaration":
      return `${String(config.formCode ?? "K1")} draft`;
    case "action.request_approval":
      return `Approval: ${String(config.role ?? "CUSTOMS_BROKER")}`;
    case "action.submit_declaration":
      return "JKDM submission · human approval required";
    case "action.record_customs_response":
      return "Record official or manual response";
    case "action.record_payment":
      return config.amount === undefined ? "Payment evidence required" : `${String(config.currency ?? "MYR")} ${String(config.amount)}`;
    case "action.update_shipment_status":
      return `Set status: ${String(config.toStatus ?? "declaration_draft")}`;
    case "action.create_audit_event":
      return String(config.kind ?? "Audit event type required");
    case "data.validate_required":
      return `${Array.isArray(config.required) ? config.required.length : 0} required field(s)`;
    case "logic.value_threshold":
      return `Threshold: RM ${Number(config.thresholdMYR ?? 0).toLocaleString()}`;
    default:
      return "Brokerage workflow step";
  }
}

function BrokerageNodeImpl({ data, selected }: NodeProps) {
  const nodeData = data as GenericNodeData;
  const type = (nodeData.nodeType ?? "action.create_task") as WorkflowNodeType;
  const entry = findCatalogEntry(type);
  const config = nodeData.config ?? {};
  const branching = entry?.branching === true;
  const outputs = branching
    ? [
        { id: "true", label: "TRUE", color: "#10b981" },
        { id: "false", label: "FALSE", color: "#ef4444" },
      ]
    : undefined;

  return (
    <NodeShell
      family="brokerage"
      title={nodeData.label ?? entry?.label ?? type}
      subtitle={summarize(type, config)}
      state={nodeData.state ?? "idle"}
      provenance={nodeData.provenance}
      selected={selected}
      hasInput={!type.startsWith("trigger.")}
      outputHandles={outputs}
      hasOutput={type !== "output"}
      requiresCapability={Boolean(entry?.requiresCapability)}
      capabilityUnavailable={nodeData.capabilityUnavailable}
      approvalRequired={entry?.approvalRequired}
      externalSideEffect={entry?.externalSideEffect}
    />
  );
}

export const BrokerageNode = memo(BrokerageNodeImpl);
BrokerageNode.displayName = "BrokerageNode";
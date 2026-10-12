"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { NodeShell, type NodeExecutionState } from "./node-shell";
import { findCatalogEntry } from "../lib/node-catalog-helpers";
import type { WorkflowNodeType, Provenance } from "../types/workflow";

export interface GenericNodeData {
  label?: string;
  nodeType?: WorkflowNodeType;
  config?: Record<string, unknown>;
  state?: NodeExecutionState;
  provenance?: Provenance;
  capabilityUnavailable?: boolean;
}

function summarize(nodeType: WorkflowNodeType | undefined, config: Record<string, unknown> | undefined): string {
  if (!nodeType) return "";
  const c = config ?? {};
  switch (nodeType) {
    case "action.create_task": return String(c.title ?? "untitled task");
    case "action.submit_declaration": return "JKDM submission";
    case "action.request_approval": return `role: ${c.role ?? "?"}`;
    case "logic.value_threshold": return `> RM ${Number(c.thresholdMYR ?? 0).toLocaleString()}`;
    case "logic.wait_for_event": return `${(c.eventKinds as string[] | undefined)?.length ?? 0} event(s)`;
    case "data.validate_required": return `${(c.required as unknown[] | undefined)?.length ?? 0} field(s)`;
    case "trigger.deadline.scheduled": return String(c.cron ?? "");
    case "output": return String(c.value ?? "final result");
    default: return "";
  }
}

function GenericNodeImpl({ data, selected }: NodeProps) {
  const d = data as GenericNodeData;
  const nodeType = (d.nodeType ?? "output") as WorkflowNodeType;
  const entry = findCatalogEntry(nodeType);

  const branching = entry?.branching === true;
  const outputs = branching
    ? [
        { id: "true", label: "TRUE", color: "#10b981" },
        { id: "false", label: "FALSE", color: "#ef4444" },
      ]
    : undefined;

  const isTrigger = nodeType.startsWith("trigger.");
  const isOutput = nodeType === "output";

  return (
    <NodeShell
      title={d.label ?? entry?.label ?? nodeType}
      subtitle={summarize(nodeType, d.config)}
      state={d.state ?? "idle"}
      provenance={d.provenance}
      selected={selected}
      hasInput={!isTrigger}
      hasOutput={!isOutput}
      outputHandles={outputs}
      requiresCapability={Boolean(entry?.requiresCapability)}
      capabilityUnavailable={d.capabilityUnavailable}
      approvalRequired={entry?.approvalRequired}
      externalSideEffect={entry?.externalSideEffect}
    />
  );
}

export const GenericNode = memo(GenericNodeImpl);
GenericNode.displayName = "GenericNode";

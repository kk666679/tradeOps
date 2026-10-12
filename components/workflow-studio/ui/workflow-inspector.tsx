"use client";

import type { Node } from "@xyflow/react";
import type { WorkflowNode, ValidationIssue, JkdmCapabilitySnapshot } from "../types/workflow";
import { GenericInspector } from "../inspectors";
import { findCatalogEntry } from "../lib/node-catalog-helpers";

export interface WorkflowInspectorProps {
  selectedNode: Node | null;
  validation: { errors: ValidationIssue[]; warnings: ValidationIssue[] };
  jkdmCaps: JkdmCapabilitySnapshot | null;
  onChange: (id: string, patch: Partial<WorkflowNode>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function toWorkflowNode(n: Node): WorkflowNode {
  const d = (n.data ?? {}) as Record<string, unknown>;
  return {
    id: n.id,
    type: (d.nodeType as WorkflowNode["type"]) ?? (n.type as WorkflowNode["type"]),
    position: { x: n.position.x, y: n.position.y },
    label: typeof d.label === "string" ? d.label : undefined,
    config: (d.config as Record<string, unknown>) ?? {},
  };
}

export function WorkflowInspector({
  selectedNode, validation, jkdmCaps, onChange, onDelete, onDuplicate,
}: WorkflowInspectorProps) {
  if (!selectedNode) {
    return (
      <aside className="flex h-full w-[320px] shrink-0 flex-col gap-3 overflow-y-auto border-l border-[var(--border)] bg-[var(--bg-elev)] p-4" aria-label="Workflow inspector">
        <h3 className="text-[13px] font-semibold text-[var(--text)]">Workflow</h3>
        <p className="text-[11.5px] text-[var(--text-muted)]">
          Select a node to configure it. Validation errors must be resolved before running.
        </p>
        {(validation.errors.length > 0 || validation.warnings.length > 0) && (
          <div className="flex flex-col gap-2">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Validation</h4>
            <ul className="flex flex-col gap-1.5">
              {[...validation.errors, ...validation.warnings].map((issue, i) => (
                <li key={i}
                  className={[
                    "rounded border px-2 py-1.5 font-mono text-[10.5px]",
                    issue.severity === "error"
                      ? "border-red-500/25 bg-red-500/[0.06] text-red-400"
                      : "border-amber-500/25 bg-amber-500/[0.06] text-amber-400",
                  ].join(" ")}>
                  {issue.message}
                  {issue.resolution && (
                    <span className="mt-0.5 block text-[9.5px] text-[var(--text-muted)]">{issue.resolution}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    );
  }

  const node = toWorkflowNode(selectedNode);
  const entry = findCatalogEntry(node.type);
  const capabilityWarning = (() => {
    if (!entry?.requiresCapability || !jkdmCaps) return undefined;
    if (entry.requiresCapability === "submitDeclaration" && !jkdmCaps.submitDeclaration) {
      return "JKDM submission is not currently available. Configure the integration, or use a record_customs_response node for the manual path.";
    }
    if (entry.requiresCapability === "queryDeclarationStatus" && !jkdmCaps.queryDeclarationStatus) {
      return "JKDM status query is not available.";
    }
    return undefined;
  })();

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--bg-elev)] p-4" aria-label="Node inspector">
      <GenericInspector
        node={node}
        onChange={(patch) => onChange(node.id, patch)}
        onDelete={() => onDelete(node.id)}
        onDuplicate={() => onDuplicate(node.id)}
        capabilityWarning={capabilityWarning}
      />
    </aside>
  );
}

// components/workflow-studio/lib/workflow-serialization.ts
import type { Node, Edge } from "@xyflow/react";
import type { WorkflowDefinition, WorkflowNode, WorkflowEdge, Viewport } from "../types/workflow";

export function toReactFlow(def: WorkflowDefinition): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = def.nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    ...(n.size?.width ? { width: n.size.width } : {}),
    ...(n.size?.height ? { height: n.size.height } : {}),
    data: {
      label: n.label, description: n.description, config: n.config,
      nodeType: n.type, timeoutMs: n.timeoutMs, retryPolicy: n.retryPolicy,
      approvalRequired: n.approvalRequired, approverRole: n.approverRole,
      externalSideEffect: n.externalSideEffect,
    },
  }));
  const edges: Edge[] = def.edges.map((e) => ({
    id: e.id, source: e.source, target: e.target,
    sourceHandle: e.sourceHandle, targetHandle: e.targetHandle, label: e.label,
  }));
  return { nodes, edges };
}

export function fromReactFlow(nodes: Node[], edges: Edge[], viewport: Viewport): WorkflowDefinition {
  const outNodes: WorkflowNode[] = nodes.map((n) => {
    const d = (n.data ?? {}) as Record<string, unknown>;
    const w = n.width ?? n.style?.width;
    const h = n.height ?? n.style?.height;
    return {
      id: n.id,
      type: (d.nodeType as WorkflowNode["type"]) ?? (n.type as WorkflowNode["type"]),
      position: { x: n.position.x, y: n.position.y },
      size: (typeof w === "number" || typeof h === "number")
        ? { width: typeof w === "number" ? w : undefined, height: typeof h === "number" ? h : undefined }
        : undefined,
      label: typeof d.label === "string" ? d.label : undefined,
      description: typeof d.description === "string" ? d.description : undefined,
      config: (d.config as Record<string, unknown>) ?? {},
      timeoutMs: typeof d.timeoutMs === "number" ? d.timeoutMs : undefined,
      retryPolicy: d.retryPolicy as WorkflowNode["retryPolicy"],
      approvalRequired: typeof d.approvalRequired === "boolean" ? d.approvalRequired : undefined,
      approverRole: d.approverRole as WorkflowNode["approverRole"],
      externalSideEffect: typeof d.externalSideEffect === "boolean" ? d.externalSideEffect : undefined,
    };
  });
  const outEdges: WorkflowEdge[] = edges.map((e) => ({
    id: e.id, source: e.source, target: e.target,
    sourceHandle: e.sourceHandle ?? "out",
    targetHandle: e.targetHandle ?? "in",
    label: typeof e.label === "string" ? e.label : undefined,
  }));
  return { nodes: outNodes, edges: outEdges, viewport };
}

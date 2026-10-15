// components/workflow-studio/lib/workflow-serialization.ts
import type { Node, Edge } from "@xyflow/react";
import type { WorkflowDefinition, WorkflowNode, WorkflowEdge, Viewport } from "../types/workflow";
import { NODE_TYPES } from "../types/workflow";
import { normalizeNodeType, UNSUPPORTED_NODE_TYPE } from "../nodes/node-types";

type RawRecord = Record<string, unknown>;
export type SerializableGraph = { nodes: Node[]; edges: Edge[] };

function asRecord(value: unknown): RawRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as RawRecord
    : {};
}

function withoutTransientFields(value: unknown): RawRecord {
  const copy = structuredClone(asRecord(value));
  delete copy.selected;
  delete copy.dragging;
  delete copy.resizing;
  delete copy.measured;
  return copy;
}

function equalJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function serializeGraph(graph: unknown): SerializableGraph {
  return structuredClone(graph) as SerializableGraph;
}

export function toReactFlow(
  def: WorkflowDefinition,
  supportedTypes?: ReadonlySet<string>,
): { nodes: Node[]; edges: Edge[] } {
  const saved = serializeGraph(def) as unknown as {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  };
  const supportedNodes = supportedTypes ?? new Set<string>(NODE_TYPES);
  const nodes: Node[] = saved.nodes.map((node) => {
    const original = structuredClone(node) as unknown as RawRecord;
    const originalData = asRecord(original.data);
    const type = normalizeNodeType(typeof original.type === "string" ? original.type : "unknown");
    const data: RawRecord = {
      ...originalData,
      label: node.label ?? originalData.label,
      description: node.description ?? originalData.description,
      config: node.config ?? originalData.config ?? {},
      nodeType: typeof original.type === "string" ? original.type : type,
    };
    const flowNode = {
      ...original,
      id: node.id,
      type: NODE_TYPES.includes(type as (typeof NODE_TYPES)[number]) && supportedNodes.has(type)
        ? type
        : UNSUPPORTED_NODE_TYPE,
      position: structuredClone(node.position),
      ...(node.size?.width ? { width: node.size.width } : {}),
      ...(node.size?.height ? { height: node.size.height } : {}),
      data,
    } as unknown as Node;
    return {
      ...flowNode,
      data: {
        ...data,
        __workflowStudioOriginal: original,
        __workflowStudioBaseline: withoutTransientFields({ ...flowNode, data }),
      },
    };
  });
  const edges: Edge[] = saved.edges.map((edge) => {
    const original = structuredClone(edge) as unknown as RawRecord;
    const originalData = asRecord(original.data);
    const originalType = typeof original.type === "string" ? original.type : undefined;
    const flowEdge = {
      ...original,
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      label: edge.label,
      type: !originalType || originalType === "default" ? "default" : UNSUPPORTED_NODE_TYPE,
      data: { ...originalData, __workflowStudioType: originalType },
    } as unknown as Edge;
    return {
      ...flowEdge,
      data: {
        ...asRecord(flowEdge.data),
        __workflowStudioOriginal: original,
        __workflowStudioBaseline: withoutTransientFields(flowEdge),
      },
    };
  });
  return { nodes, edges };
}

export function fromReactFlow(nodes: Node[], edges: Edge[], viewport: Viewport): WorkflowDefinition {
  const outNodes: WorkflowNode[] = nodes.map((node) => {
    const data = asRecord(node.data);
    const original = asRecord(data.__workflowStudioOriginal);
    const baseline = asRecord(data.__workflowStudioBaseline);
    const persistedData = { ...data };
    delete persistedData.__workflowStudioOriginal;
    delete persistedData.__workflowStudioBaseline;
    const current = withoutTransientFields({ ...node, data: persistedData });
    if (Object.keys(original).length > 0 && equalJson(current, baseline)) {
      return structuredClone(original) as unknown as WorkflowNode;
    }
    const originalData = asRecord(original.data);
    const restoredType = typeof data.nodeType === "string"
      ? data.nodeType
      : typeof original.type === "string"
        ? original.type
        : node.type === UNSUPPORTED_NODE_TYPE
          ? "unknown"
          : node.type;
    return {
      ...original,
      ...current,
      id: node.id,
      type: restoredType as WorkflowNode["type"],
      position: structuredClone(node.position),
      ...(typeof data.label === "string" ? { label: data.label } : {}),
      ...(typeof data.description === "string" ? { description: data.description } : {}),
      data: { ...originalData, ...persistedData },
      ...(data.config !== undefined ? { config: structuredClone(data.config) } : {}),
    } as unknown as WorkflowNode;
  });
  const outEdges: WorkflowEdge[] = edges.map((edge) => {
    const data = asRecord(edge.data);
    const original = asRecord(data.__workflowStudioOriginal);
    const baseline = asRecord(data.__workflowStudioBaseline);
    const persistedData = { ...data };
    delete persistedData.__workflowStudioOriginal;
    delete persistedData.__workflowStudioBaseline;
    const current = withoutTransientFields({ ...edge, data: persistedData });
    if (Object.keys(original).length > 0 && equalJson(current, baseline)) {
      return structuredClone(original) as unknown as WorkflowEdge;
    }
    const originalData = asRecord(original.data);
    const restoredType = typeof data.__workflowStudioType === "string"
      ? data.__workflowStudioType
      : edge.type === UNSUPPORTED_NODE_TYPE
        ? undefined
        : edge.type;
    return {
      ...original,
      ...current,
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: restoredType,
      data: { ...originalData, ...persistedData },
    } as unknown as WorkflowEdge;
  });
  return { nodes: outNodes, edges: outEdges, viewport };
}

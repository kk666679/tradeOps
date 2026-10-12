"use client";

import { useCallback, useMemo, useRef } from "react";
import {
  addEdge as rfAddEdge, applyEdgeChanges, applyNodeChanges,
  useNodesState, useEdgesState,
  type Connection, type Edge, type EdgeChange, type Node, type NodeChange,
} from "@xyflow/react";
import type { WorkflowDefinition, WorkflowNode, Viewport } from "../types/workflow";
import { fromReactFlow, toReactFlow } from "../lib/workflow-serialization";
import { findCatalogEntry } from "../lib/node-catalog-helpers";
import { topoSort } from "../lib/workflow-graph";

let counter = 0;
function newId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter}`;
}

export interface UseWorkflowEditorResult {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (c: NodeChange[]) => void;
  onEdgesChange: (c: EdgeChange[]) => void;
  onConnect: (c: Connection) => void;
  isValidConnection: (c: Connection) => boolean;
  addNodeAt: (type: WorkflowNode["type"], position: { x: number; y: number }) => void;
  updateNode: (id: string, patch: Partial<WorkflowNode>) => void;
  removeNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  toDefinition: (viewport: Viewport) => WorkflowDefinition;
}

export function useWorkflowEditor(initial: WorkflowDefinition): UseWorkflowEditorResult {
  const initialRF = useMemo(() => toReactFlow(initial), [initial]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialRF.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialRF.edges);

  const currentDef = useMemo<WorkflowDefinition>(
    () => fromReactFlow(nodes, edges, initial.viewport),
    [nodes, edges, initial.viewport],
  );
  const currentRef = useRef(currentDef);
  currentRef.current = currentDef;

  const onConnect = useCallback((connection: Connection) => {
    const id = newId("edge");
    setEdges((eds) => rfAddEdge({
      ...connection, id,
      sourceHandle: connection.sourceHandle ?? "out",
      targetHandle: connection.targetHandle ?? "in",
    }, eds));
  }, [setEdges]);

  const isValidConnection = useCallback((c: Connection) => {
    if (!c.source || !c.target) return false;
    if (c.source === c.target) return false;
    const def = currentRef.current;
    const exists = def.edges.some((e) =>
      e.source === c.source && e.target === c.target && e.sourceHandle === (c.sourceHandle ?? "out"));
    if (exists) return false;
    const src = def.nodes.find((n) => n.id === c.source);
    const tgt = def.nodes.find((n) => n.id === c.target);
    if (!src || !tgt) return false;
    if (tgt.type.startsWith("trigger.")) return false;
    if (src.type === "output") return false;
    // Cycle check
    const probe: WorkflowDefinition = { ...def, edges: [...def.edges, {
      id: "__probe__", source: c.source, target: c.target,
      sourceHandle: c.sourceHandle ?? "out", targetHandle: "in",
    }]};
    return topoSort(probe).cycle.length === 0;
  }, []);

  const addNodeAt = useCallback((type: WorkflowNode["type"], position: { x: number; y: number }) => {
    const entry = findCatalogEntry(type);
    const id = newId("node");
    setNodes((ns) => [...ns, {
      id, type, position,
      data: { nodeType: type, label: entry?.label, config: entry?.defaultConfig ?? {} },
    }]);
  }, [setNodes]);

  const updateNode = useCallback((id: string, patch: Partial<WorkflowNode>) => {
    setNodes((ns) => ns.map((n) => {
      if (n.id !== id) return n;
      const d = { ...(n.data ?? {}) };
      if (patch.label !== undefined) d.label = patch.label;
      if (patch.config !== undefined) d.config = patch.config;
      return { ...n, data: d };
    }));
  }, [setNodes]);

  const removeNode = useCallback((id: string) => {
    setNodes((ns) => ns.filter((n) => n.id !== id));
    setEdges((es) => es.filter((e) => e.source !== id && e.target !== id));
  }, [setNodes, setEdges]);

  const duplicateNode = useCallback((id: string) => {
    setNodes((ns) => {
      const source = ns.find((n) => n.id === id);
      if (!source) return ns;
      return [...ns, {
        ...source,
        id: newId("node"),
        position: { x: source.position.x + 40, y: source.position.y + 40 },
        selected: false,
        data: JSON.parse(JSON.stringify(source.data ?? {})),
      }];
    });
  }, [setNodes]);

  const toDefinition = useCallback((viewport: Viewport) => fromReactFlow(nodes, edges, viewport), [nodes, edges]);

  return { nodes, edges, onNodesChange, onEdgesChange, onConnect, isValidConnection, addNodeAt, updateNode, removeNode, duplicateNode, toDefinition };
}

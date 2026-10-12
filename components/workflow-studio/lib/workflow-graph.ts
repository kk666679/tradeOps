// components/workflow-studio/lib/workflow-graph.ts
import type { WorkflowDefinition, WorkflowNode, WorkflowEdge } from "../types/workflow";

export function findNode(def: WorkflowDefinition, id: string): WorkflowNode | undefined {
  return def.nodes.find((n) => n.id === id);
}

export function outgoingEdges(def: WorkflowDefinition, nodeId: string): WorkflowEdge[] {
  return def.edges.filter((e) => e.source === nodeId);
}

export function incomingEdges(def: WorkflowDefinition, nodeId: string): WorkflowEdge[] {
  return def.edges.filter((e) => e.target === nodeId);
}

export function topoSort(def: WorkflowDefinition): { order: string[]; cycle: string[] } {
  const indeg = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of def.nodes) { indeg.set(n.id, 0); adj.set(n.id, []); }
  for (const e of def.edges) {
    if (!indeg.has(e.source) || !indeg.has(e.target)) continue;
    indeg.set(e.target, (indeg.get(e.target) ?? 0) + 1);
    adj.get(e.source)!.push(e.target);
  }
  const queue = [...indeg.entries()].filter(([, d]) => d === 0).map(([id]) => id);
  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    for (const next of adj.get(id) ?? []) {
      indeg.set(next, (indeg.get(next) ?? 1) - 1);
      if (indeg.get(next) === 0) queue.push(next);
    }
  }
  const cycle = def.nodes.map((n) => n.id).filter((id) => !order.includes(id));
  return { order, cycle };
}

export function nodesSkippedByBranch(
  def: WorkflowDefinition, conditionNodeId: string, chosenHandle: "true" | "false",
): Set<string> {
  const taken = new Set<string>();
  const pruned = new Set<string>();
  const stack: string[] = [];
  for (const e of outgoingEdges(def, conditionNodeId)) {
    if (e.sourceHandle === chosenHandle) stack.push(e.target); else pruned.add(e.target);
  }
  while (stack.length) {
    const id = stack.pop()!;
    if (taken.has(id)) continue;
    taken.add(id);
    for (const e of outgoingEdges(def, id)) stack.push(e.target);
  }
  const final = new Set<string>();
  for (const id of pruned) if (!taken.has(id)) final.add(id);
  return final;
}

// components/workflow-studio/nodes/node-types.ts
//
// Explicit render registries for the engine and brokerage families. Unsupported
// entries are kept in a dedicated safety net so a graph can round-trip even when
// the active editor only supports a subset of node types.
import type { NodeTypes } from "@xyflow/react";
import { GenericNode } from "./generic-node";
import { EngineNode } from "./engine-node";
import { BrokerageNode } from "./brokerage-node";
import { UnsupportedNode } from "./UnsupportedNode";
import { NODE_TYPES } from "../types/workflow";

export const UNSUPPORTED_NODE_TYPE = "__unsupported";
export const ENGINE_NODE_TYPES = new Set([
  "trigger.manual",
  "logic.condition",
  "data.transform",
  "output",
]);
export const BROKERAGE_NODE_TYPES = new Set(
  NODE_TYPES.filter((type) => !ENGINE_NODE_TYPES.has(type)),
);

export function normalizeNodeType(type: string | null | undefined): string {
  if (typeof type !== "string") return UNSUPPORTED_NODE_TYPE;
  const clean = type.trim();
  if (!clean) return UNSUPPORTED_NODE_TYPE;
  if (clean === "unsupported") return UNSUPPORTED_NODE_TYPE;
  return clean;
}

export function buildWorkflowNodeTypeRegistry(
  supportedTypes?: ReadonlySet<string>,
): NodeTypes {
  const registry: NodeTypes = {};
  const active = supportedTypes ?? new Set(NODE_TYPES);

  for (const type of NODE_TYPES) {
    if (active.has(type)) {
      registry[type] = ENGINE_NODE_TYPES.has(type) ? EngineNode : BrokerageNode;
    }
  }
  registry[UNSUPPORTED_NODE_TYPE] = UnsupportedNode;
  registry.unsupported = UnsupportedNode;
  return registry;
}

export const engineWorkflowNodeTypes = buildWorkflowNodeTypeRegistry(ENGINE_NODE_TYPES);
export const brokerageWorkflowNodeTypes = buildWorkflowNodeTypeRegistry(BROKERAGE_NODE_TYPES);
export const workflowNodeTypes: NodeTypes = buildWorkflowNodeTypeRegistry();

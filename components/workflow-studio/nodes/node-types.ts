// components/workflow-studio/nodes/node-types.ts
//
// One renderer, many types. React Flow expects a NodeTypes map keyed by the
// `type` field on each node. Every entry points to the same component.
import type { NodeTypes } from "@xyflow/react";
import { GenericNode } from "./generic-node";
import { NODE_TYPES } from "../types/workflow";

export const workflowNodeTypes: NodeTypes = Object.fromEntries(
  NODE_TYPES.map((t) => [t, GenericNode]),
) as NodeTypes;

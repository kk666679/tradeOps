import assert from "node:assert/strict";
import type { WorkflowDefinition } from "../components/workflow-studio/types/workflow";
import {
  BROKERAGE_NODE_TYPES,
  ENGINE_NODE_TYPES,
  UNSUPPORTED_NODE_TYPE,
  brokerageWorkflowNodeTypes,
  engineWorkflowNodeTypes,
} from "../components/workflow-studio/nodes/node-types";
import { BrokerageNode } from "../components/workflow-studio/nodes/brokerage-node";
import { EngineNode } from "../components/workflow-studio/nodes/engine-node";
import { UnsupportedNode } from "../components/workflow-studio/nodes/UnsupportedNode";
import { validateGraphForEngine } from "../components/workflow-studio/lib/workflow-validation";
import { fromReactFlow, toReactFlow } from "../components/workflow-studio/lib/workflow-serialization";

const definition = {
  nodes: [
    { id: "trigger", type: "trigger.manual", position: { x: 0, y: 0 }, config: {} },
    { id: "brokerage", type: "action.record_customs_response", position: { x: 160, y: 0 }, label: "Record response", config: {} },
  ],
  edges: [{ id: "edge", source: "trigger", target: "brokerage", type: "custom-edge" }],
  viewport: { x: 0, y: 0, zoom: 1 },
} as unknown as WorkflowDefinition;

assert.ok(ENGINE_NODE_TYPES.has("logic.condition"));
assert.ok(BROKERAGE_NODE_TYPES.has("action.record_customs_response"));
assert.equal(engineWorkflowNodeTypes["logic.condition"], EngineNode);
assert.equal(brokerageWorkflowNodeTypes["action.record_customs_response"], BrokerageNode);
assert.equal(engineWorkflowNodeTypes[UNSUPPORTED_NODE_TYPE], UnsupportedNode);
assert.equal(brokerageWorkflowNodeTypes[UNSUPPORTED_NODE_TYPE], UnsupportedNode);

assert.equal(validateGraphForEngine(definition).ok, false);
assert.equal(
  validateGraphForEngine(
    definition,
    new Set([...ENGINE_NODE_TYPES, "action.record_customs_response"]),
    new Set(["default", "custom-edge"]),
  ).ok,
  true,
);

const rendered = toReactFlow(definition, ENGINE_NODE_TYPES);
assert.equal(rendered.nodes[1].type, UNSUPPORTED_NODE_TYPE);
assert.equal(rendered.edges[0].type, UNSUPPORTED_NODE_TYPE);

(rendered.nodes[1].data as Record<string, unknown>).label = "Edited response";
const restored = fromReactFlow(rendered.nodes, rendered.edges, definition.viewport);
assert.equal(restored.nodes[1].type, "action.record_customs_response");
assert.equal(restored.nodes[1].label, "Edited response");
assert.equal(restored.edges[0].type, "custom-edge");

const unknownType = toReactFlow({
  nodes: [{ id: "unknown", type: "not.registered", position: { x: 0, y: 0 }, config: {} }],
  edges: [],
} as unknown as WorkflowDefinition, new Set(["not.registered"]));
assert.equal(unknownType.nodes[0].type, UNSUPPORTED_NODE_TYPE);

console.log("Workflow-studio renderer, validation, and serialization checks passed.");
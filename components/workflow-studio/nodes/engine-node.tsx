"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { NodeShell } from "./node-shell";
import { findCatalogEntry } from "../lib/node-catalog-helpers";
import type { GenericNodeData } from "./generic-node";

function EngineNodeImpl({ data, selected }: NodeProps) {
  const nodeData = data as GenericNodeData;
  const type = nodeData.nodeType ?? "output";
  const entry = findCatalogEntry(type);
  const config = nodeData.config ?? {};
  let detail = "";

  if (type === "logic.condition") {
    detail = `${String(config.path ?? "value")} ${String(config.operator ?? "isTruthy")}`;
  } else if (type === "data.transform") {
    const mapping = config.mapping;
    detail = `${mapping && typeof mapping === "object" && !Array.isArray(mapping) ? Object.keys(mapping).length : 0} output mapping(s)`;
  } else if (type === "output") {
    detail = String(config.value ?? "Returns incoming value");
  } else if (type === "trigger.manual") {
    detail = "Starts with a supplied payload";
  }

  const isTrigger = type === "trigger.manual";
  const isOutput = type === "output";

  return (
    <NodeShell
      family="engine"
      title={nodeData.label ?? entry?.label ?? type}
      subtitle={detail}
      state={nodeData.state ?? "idle"}
      provenance={nodeData.provenance}
      selected={selected}
      hasInput={!isTrigger}
      hasOutput={!isOutput}
    />
  );
}

export const EngineNode = memo(EngineNodeImpl);
EngineNode.displayName = "EngineNode";
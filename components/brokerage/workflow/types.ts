// components/brokerage/workflow/types.ts
export type {
  BrokerageNode, BrokerageEdge, BrokerageEdgeData, BrokerageEdgeKind,
  BrokerageNodeStatus, BrokerageNodeType,
  LaneNodeData, ClientNodeData, DeclarationNodeData, AgentNodeData,
  HumanGateNodeData, ComplianceNodeData, AccreditationNodeData,
} from "../types";

export type SimulationTag =
  | "info" | "ok" | "warn" | "err" | "human" | "compliance" | "agent";

export interface SimulationLogEntry {
  ts: number; tag: SimulationTag; message: string;
}

export interface BrokerageSimulationHandle {
  cancel: () => void;
  onUpdate: (nodes: import("../types").BrokerageNode[]) => void;
  onLog: (entry: SimulationLogEntry) => void;
  onDone: () => void;
}

export interface BrokerageSimulationOptions {
  stepDelayMs?: number;
}

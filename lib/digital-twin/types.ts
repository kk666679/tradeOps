import type { Node, Edge } from '@xyflow/react';

export type TwinMode = 'idle' | 'running' | 'paused' | 'stepped' | 'error';
export type TwinSpeed = 0.25 | 0.5 | 1 | 2 | 4 | 8;
export type TwinTab = 'properties' | 'reasoning' | 'live' | 'simulation';

export type TwinNodeKind =
  | 'zone' | 'agent' | 'task' | 'gate' | 'movement' | 'resource' | 'buffer';

export type TwinNodeStatus =
  | 'idle' | 'active' | 'blocked' | 'done' | 'error';

export interface TwinNodeData extends Record<string, unknown> {
  kind: TwinNodeKind;
  label: string;
  zoneId?: string;
  status: TwinNodeStatus;
  metrics?: Record<string, number>;
  meta?: Record<string, unknown>;
}

export interface TwinEdgeData extends Record<string, unknown> {
  kind: 'flow' | 'handoff' | 'dependency' | 'semantic';
  label?: string;
  volume?: number;
}

export type TwinGraphNode = Node<TwinNodeData>;
export type TwinGraphEdge = Edge<TwinEdgeData>;

export interface TwinScenario {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  parameters: Record<string, number | string | boolean>;
  tags: string[];
}

export interface TwinEvent {
  id: string;
  at: number;
  kind: 'log' | 'alert' | 'metric' | 'agent_action' | 'policy_decision' | 'human_intervention';
  severity: 'info' | 'warn' | 'error' | 'critical';
  message: string;
  nodeId?: string;
  agentId?: string;
  payload?: Record<string, unknown>;
}

export interface TwinRun {
  id: string;
  scenarioId: string;
  startedAt: number;
  endedAt?: number;
  status: 'running' | 'paused' | 'completed' | 'failed';
  stepIndex: number;
  totalSteps: number;
  metrics: {
    throughput: number;
    dwell: number;
    utilization: number;
    cost: number;
  };
}

export interface TwinState {
  mode: TwinMode;
  speed: TwinSpeed;
  clock: number;
  tickMs: number;

  nodes: TwinGraphNode[];
  edges: TwinGraphEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  scenarios: TwinScenario[];
  activeScenarioId: string | null;

  runs: TwinRun[];
  activeRunId: string | null;

  events: TwinEvent[];
  maxEvents: number;

  activeTab: TwinTab;
  inspectorOpen: boolean;
  sidebarOpen: boolean;
  dockOpen: boolean;
}

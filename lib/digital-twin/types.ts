import type { Edge, Node } from '@xyflow/react';

export type TwinNodeKind   = 'supplier' | 'plant' | 'dc' | 'customer';
export type TwinNodeStatus = 'ok' | 'warn' | 'error';

export type TwinMode = 'idle' | 'running' | 'paused' | 'error';
export type TwinSpeed = 0.25 | 0.5 | 1 | 2 | 4 | 8;
export type TwinTab = 'properties' | 'reasoning' | 'live' | 'simulation';

export interface TwinGraphNodeData {
  label: string;
  kind: TwinNodeKind;
  status?: TwinNodeStatus;
  metrics?: Record<string, number | string>;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export type TwinGraphNode = Node<TwinGraphNodeData, 'twin'>;

export interface TwinGraphEdgeData {
  kind: 'flow' | 'handoff' | 'dependency' | 'semantic';
  volume?: number;
  [key: string]: unknown;
}

export type TwinGraphEdge = Edge<TwinGraphEdgeData, 'twin'>;

export interface TwinScenario {
  id: string;
  name: string;
  description?: string;
  nodes?: TwinGraphNode[];
  edges?: TwinGraphEdge[];
}

export interface TwinRun {
  id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: number;
  endedAt?: number;
  metrics: {
    throughput: number;
    dwell: number;
    utilization: number;
    cost: number;
  };
}

export interface TwinEvent {
  id: string;
  at: number;
  kind: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  nodeId?: string;
  agentId?: string;
  payload?: Record<string, unknown>;
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

export interface TwinNodeData {
  id: string; label: string; kind: TwinNodeKind; x: number; y: number;
  status?: TwinNodeStatus;
  metrics?: Record<string, number | string>;
  metadata?: Record<string, unknown>;
}
export interface TwinEdgeData { id: string; from: string; to: string; volume?: number; mode?: 'sea' | 'air' | 'road' | 'rail'; }
export interface TwinSnapshot { nodes: TwinNodeData[]; edges: TwinEdgeData[]; updatedAt: string; }

export const SAMPLE_TWIN: TwinSnapshot = {
  updatedAt: new Date().toISOString(),
  nodes: [
    { id: 'n1', label: 'Supplier SG',  kind: 'supplier', x: 100, y: 100, status: 'ok' },
    { id: 'n2', label: 'Plant Penang', kind: 'plant',    x: 300, y: 180, status: 'ok' },
    { id: 'n3', label: 'DC KL',        kind: 'dc',       x: 500, y: 120, status: 'warn' },
    { id: 'n4', label: 'Customer JB',  kind: 'customer', x: 680, y: 220, status: 'ok' },
  ],
  edges: [
    { id: 'e1', from: 'n1', to: 'n2', volume: 120, mode: 'sea' },
    { id: 'e2', from: 'n2', to: 'n3', volume: 340, mode: 'road' },
    { id: 'e3', from: 'n3', to: 'n4', volume: 210, mode: 'road' },
  ],
};

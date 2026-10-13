export type TwinNodeKind   = 'supplier' | 'plant' | 'dc' | 'customer';
export type TwinNodeStatus = 'ok' | 'warn' | 'error';

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
[the block above]

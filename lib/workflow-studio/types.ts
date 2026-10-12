export type Mode = 'development' | 'manual' | 'production';
export type Provenance = 'verified' | 'manual' | 'synthetic' | 'blocked' | 'local' | 'pending';
export type NodeStatus = 'idle' | 'running' | 'success' | 'synthetic' | 'manual' | 'blocked' | 'failed';
export type EdgeStyle = 'bezier' | 'step' | 'straight';
export type Tab = 'integration' | 'hs' | 'declaration' | 'audit' | 'node';

export interface NodeDef {
  group: string;
  type: string;
  label: string;
  op: string;
  requires: string | null;
  human?: boolean;
  sideEffect?: boolean;
}

export interface GraphNode {
  id: string;
  type: string;
  x: number;
  y: number;
  status: NodeStatus;
  provenance: Provenance;
  ref: string;
  error: string;
  hsCode: string;
  pgaLicense: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  provenance: Provenance;
}

export interface Viewport { x: number; y: number; zoom: number }
export interface CanvasSize { w: number; h: number }

export interface HsEntry {
  code: string;
  desc: string;
  chapter: number;
  duty: number;
  sst: number;
  excise: number;
  pga: string[];
  restricted: boolean;
  notes?: string;
}

export interface AuditEvent {
  id: string;
  time: number;
  op: string;
  prov: Provenance;
  msg: string;
  mode: Mode;
  ref?: string;
  hs?: boolean;
}

export interface DeclarationHistoryEntry {
  kind: 'ok' | 'block' | 'hold';
  at: number;
  text: string;
  provenance?: string;
}

export interface Declaration {
  id: string;
  status: string;
  official: string | null;
  pendingObservation: null | {
    target: string;
    ref?: string;
    evidence?: string;
    officer?: string;
    notes?: string;
    at: number;
  };
  history: DeclarationHistoryEntry[];
}

export interface ContextMenuState {
  x: number;
  y: number;
  kind: 'node' | 'edge' | 'canvas';
  target: string | null;
}

export interface DragState {
  ids: string[];
  startPositions: Map<string, { x: number; y: number }>;
  mouseStartFlow: { x: number; y: number };
  nodesBefore: GraphNode[];
  edgesBefore: GraphEdge[];
  moved: boolean;
}

export interface LinkState {
  sourceId: string;
  mouseScreenX: number;
  mouseScreenY: number;
}

export interface MarqueeState {
  startX: number; startY: number;
  endX: number; endY: number;
  additive: boolean;
  baseNodes: Set<string>;
  baseEdges: Set<string>;
}

export interface PanState {
  startScreenX: number;
  startScreenY: number;
  startVp: Viewport;
}

export interface Guides { xs: number[]; ys: number[] }

export interface Snapshot { nodes: GraphNode[]; edges: GraphEdge[] }

export interface ClipboardData { nodes: GraphNode[]; edges: GraphEdge[] }

export interface ManualFormValues {
  ref: string;
  category: string;
  responseAt: string;
  officerName: string;
  officerId: string;
  evidence: string;
  exception: string;
  notes: string;
  reviewed: boolean;
}

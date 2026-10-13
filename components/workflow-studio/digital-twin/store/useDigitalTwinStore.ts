'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  TwinEvent, TwinGraphEdge, TwinGraphNode, TwinMode, TwinRun,
  TwinScenario, TwinSpeed, TwinState, TwinTab,
} from '@/lib/digital-twin/types';

const uid = (p: string) =>
  `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const MAX_EVENTS = 500;

const initialState: TwinState = {
  mode: 'idle',
  speed: 1,
  clock: 0,
  tickMs: 1000,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  scenarios: [],
  activeScenarioId: null,
  runs: [],
  activeRunId: null,
  events: [],
  maxEvents: MAX_EVENTS,
  activeTab: 'properties',
  inspectorOpen: true,
  sidebarOpen: true,
  dockOpen: true,
};

interface Actions {
  setMode: (m: TwinMode) => void;
  setSpeed: (s: TwinSpeed) => void;
  setClock: (t: number) => void;
  advanceClock: (ms: number) => void;

  setNodes: (n: TwinGraphNode[] | ((p: TwinGraphNode[]) => TwinGraphNode[])) => void;
  setEdges: (e: TwinGraphEdge[] | ((p: TwinGraphEdge[]) => TwinGraphEdge[])) => void;
  addNode: (n: TwinGraphNode) => void;
  updateNodeData: (id: string, patch: Partial<TwinGraphNode['data']>) => void;
  removeNode: (id: string) => void;
  addEdge: (e: TwinGraphEdge) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;

  setScenarios: (s: TwinScenario[]) => void;
  addScenario: (s: TwinScenario) => void;
  activateScenario: (id: string | null) => void;

  startRun: (r: TwinRun) => void;
  updateRun: (id: string, patch: Partial<TwinRun>) => void;
  endRun: (id: string, status: TwinRun['status']) => void;

  pushEvent: (e: Omit<TwinEvent, 'id' | 'at'> & { id?: string; at?: number }) => void;
  clearEvents: () => void;

  setActiveTab: (t: TwinTab) => void;
  toggleInspector: () => void;
  toggleSidebar: () => void;
  toggleDock: () => void;

  reset: () => void;
}

export const useDigitalTwinStore = create<TwinState & Actions>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    setMode: (mode) => set({ mode }),
    setSpeed: (speed) => set({ speed }),
    setClock: (clock) => set({ clock }),
    advanceClock: (ms) => set((s) => ({ clock: s.clock + ms })),

    setNodes: (n) => set((s) => ({
      nodes: typeof n === 'function' ? n(s.nodes) : n,
    })),
    setEdges: (e) => set((s) => ({
      edges: typeof e === 'function' ? e(s.edges) : e,
    })),

    addNode: (n) => set((s) => ({ nodes: [...s.nodes, n] })),
    updateNodeData: (id, patch) => set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...patch } } : n),
    })),

    removeNode: (id) => set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    })),

    addEdge: (e) => set((s) => {
      if (s.edges.some((x) => x.source === e.source && x.target === e.target)) return s;
      return { edges: [...s.edges, e] };
    }),
    removeEdge: (id) => set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
      selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
    })),

    selectNode: (id) => set({
      selectedNodeId: id, selectedEdgeId: null, activeTab: 'properties',
    }),
    selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

    setScenarios: (scenarios) => set({ scenarios }),
    addScenario: (sc) => set((s) => ({ scenarios: [...s.scenarios, sc] })),
    activateScenario: (id) => set({ activeScenarioId: id }),

    startRun: (run) => set((s) => ({
      runs: [run, ...s.runs].slice(0, 50),
      activeRunId: run.id,
      mode: 'running',
    })),
    updateRun: (id, patch) => set((s) => ({
      runs: s.runs.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),
    endRun: (id, status) => set((s) => ({
      runs: s.runs.map((r) =>
        r.id === id ? { ...r, status, endedAt: Date.now() } : r),
      mode: status === 'completed' ? 'idle' : 'error',
      activeRunId: null,
    })),

    pushEvent: (e) => set((s) => {
      const event: TwinEvent = {
        id: e.id ?? uid('evt'),
        at: e.at ?? Date.now(),
        kind: e.kind,
        severity: e.severity,
        message: e.message,
        nodeId: e.nodeId,
        agentId: e.agentId,
        payload: e.payload,
      };
      return { events: [event, ...s.events].slice(0, s.maxEvents) };
    }),
    clearEvents: () => set({ events: [] }),

    setActiveTab: (activeTab) => set({ activeTab, inspectorOpen: true }),
    toggleInspector: () => set((s) => ({ inspectorOpen: !s.inspectorOpen })),
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    toggleDock: () => set((s) => ({ dockOpen: !s.dockOpen })),

    reset: () => set({ ...initialState }),
  })),
);

/* ── selectors ────────────────────────────────────────────── */

export const selectSelectedNode = (s: TwinState) =>
  s.selectedNodeId
    ? s.nodes.find((n) => n.id === s.selectedNodeId) ?? null
    : null;

export const selectSelectedEdge = (s: TwinState) =>
  s.selectedEdgeId
    ? s.edges.find((e) => e.id === s.selectedEdgeId) ?? null
    : null;

export const selectActiveRun = (s: TwinState) =>
  s.activeRunId
    ? s.runs.find((r) => r.id === s.activeRunId) ?? null
    : null;

export const selectActiveScenario = (s: TwinState) =>
  s.activeScenarioId
    ? s.scenarios.find((x) => x.id === s.activeScenarioId) ?? null
    : null;

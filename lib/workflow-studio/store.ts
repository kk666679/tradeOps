'use client';
import { create } from 'zustand';
import type {
  AuditEvent, CanvasSize, ClipboardData, ContextMenuState, Declaration,
  DragState, EdgeStyle, GraphEdge, GraphNode, Guides, LinkState, MarqueeState,
  Mode, NodeDef, PanState, Snapshot, Tab, Viewport, ManualFormValues,
} from './types';
import { clamp, GRID_SIZE, MAX_ZOOM, MIN_ZOOM, randRef, uid } from './constants';
import { byType } from './node-definitions';
import { normalizeHsCode, HS_BY_CODE } from './hs-catalog';
import { attemptTransition, evaluateNode, getSupportedOperations, TARGET_MAP } from './logic';
import { computeFitView, topoOrder, wouldCreateCycle } from './graph-utils';

const SEED_TYPES = [
  'jkdm.check_readiness',
  'jkdm.lookup_hs',
  'jkdm.validate_hs',
  'jkdm.check_pga',
  'jkdm.compute_duty',
  'jkdm.validate_payload',
  'jkdm.prepare_draft',
  'jkdm.submit_declaration',
  'jkdm.record_ack',
];

const seedNodes: GraphNode[] = SEED_TYPES.map((type, i) => ({
  id: 'n' + (i + 1),
  type,
  x: 220 + (i % 2) * 320,
  y: 40 + i * 145,
  status: 'idle',
  provenance: 'pending',
  ref: '',
  error: '',
  hsCode: '',
  pgaLicense: '',
}));

const seedEdges: GraphEdge[] = seedNodes.slice(0, -1).map((n, i) => ({
  id: 'e' + i,
  source: n.id,
  target: seedNodes[i + 1].id,
  provenance: 'pending',
}));

interface StudioStore {
  mode: Mode; prodEnabled: boolean; transport: boolean; running: boolean;
  nodes: GraphNode[]; edges: GraphEdge[]; sizes: Record<string, number>;
  viewport: Viewport; canvasSize: CanvasSize;
  selNodes: Set<string>; selEdges: Set<string>;
  dragging: DragState | null; linking: LinkState | null;
  marquee: MarqueeState | null; panning: PanState | null;
  hotPortId: string | null; guides: Guides;
  snapToGrid: boolean; edgeStyle: EdgeStyle; spaceDown: boolean;
  history: { past: Snapshot[]; future: Snapshot[] };
  clipboard: ClipboardData | null;
  audit: AuditEvent[]; decl: Declaration;
  tab: Tab; contextMenu: ContextMenuState | null;
  showShortcuts: boolean; manualModalOpen: boolean; pickerTargetId: string | null;

  setMode: (m: Mode) => void;
  setProdEnabled: (v: boolean) => void;
  setTransport: (v: boolean) => void;
  setRunning: (v: boolean) => void;

  setViewport: (v: Viewport | ((v: Viewport) => Viewport)) => void;
  setCanvasSize: (s: CanvasSize) => void;
  fitView: () => void;

  setSelNodes: (s: Set<string>) => void;
  setSelEdges: (s: Set<string>) => void;

  setNodes: (n: GraphNode[] | ((n: GraphNode[]) => GraphNode[])) => void;
  setEdges: (e: GraphEdge[] | ((e: GraphEdge[]) => GraphEdge[])) => void;
  onMeasure: (id: string, h: number) => void;
  addNode: (def: NodeDef, x?: number, y?: number) => string;
  deleteSelected: () => void;
  snapshot: () => void;
  undo: () => void;
  redo: () => void;
  copySelection: () => void;
  pasteClipboard: () => void;
  duplicateSelection: () => void;
  selectAll: () => void;
  autoLayout: () => void;
  run: () => Promise<void>;

  setDragging: (d: DragState | null | ((d: DragState | null) => DragState | null)) => void;
  setLinking: (l: LinkState | null | ((l: LinkState | null) => LinkState | null)) => void;
  setMarquee: (m: MarqueeState | null | ((m: MarqueeState | null) => MarqueeState | null)) => void;
  setPanning: (p: PanState | null) => void;
  setHotPortId: (id: string | null | ((id: string | null) => string | null)) => void;
  setGuides: (g: Guides) => void;
  setSnapToGrid: (v: boolean | ((v: boolean) => boolean)) => void;
  setEdgeStyle: (s: EdgeStyle) => void;
  setSpaceDown: (v: boolean) => void;

  openHsPicker: (nodeId: string) => void;
  closeHsPicker: () => void;
  applyHsCode: (code: string) => void;
  clearHsCode: () => void;
  setNodeHsFromInspector: (code: string) => void;
  setNodePgaLicense: (license: string) => void;

  addAudit: (op: string, prov: AuditEvent['prov'], msg: string, extra?: Partial<AuditEvent>) => void;

  submitManual: (form: ManualFormValues) => void;
  approveObservation: () => void;

  setTab: (t: Tab) => void;
  setContextMenu: (c: ContextMenuState | null) => void;
  setShowShortcuts: (v: boolean) => void;
  setManualModalOpen: (v: boolean) => void;
}

export const useStudio = create<StudioStore>()((set, get) => ({
  mode: 'development',
  prodEnabled: false,
  transport: false,
  running: false,

  nodes: seedNodes,
  edges: seedEdges,
  sizes: {},

  viewport: { x: 40, y: 20, zoom: 0.85 },
  canvasSize: { w: 800, h: 600 },

  selNodes: new Set<string>(),
  selEdges: new Set<string>(),

  dragging: null, linking: null, marquee: null, panning: null,
  hotPortId: null, guides: { xs: [], ys: [] },
  snapToGrid: false, edgeStyle: 'bezier', spaceDown: false,

  history: { past: [], future: [] },
  clipboard: null,

  audit: [{
    id: uid(), time: Date.now(), op: 'studio.initialized', prov: 'local',
    mode: 'development',
    msg: 'Workflow Studio initialized. No external customs connection has been made.',
  }],

  decl: {
    id: 'DECL-DEMO-' + uid().toUpperCase().slice(0, 6),
    status: 'draft',
    official: null,
    pendingObservation: null,
    history: [{ kind: 'ok', at: Date.now(), provenance: 'system', text: 'Draft created' }],
  },

  tab: 'integration', contextMenu: null,
  showShortcuts: false, manualModalOpen: false, pickerTargetId: null,

  setMode: (m) => {
    set({ mode: m });
    const g = get();
    const label = m === 'development'
      ? 'Development simulation — not connected to JKDM'
      : m === 'manual'
        ? 'Manual processing required — record external responses'
        : (g.prodEnabled && g.transport)
          ? 'Production transport flagged as configured — live probe not performed'
          : 'Production integration unavailable';
    g.addAudit(
      'adapter.mode_changed',
      m === 'development' ? 'synthetic' : m === 'manual' ? 'manual' : 'local',
      `Mode changed to ${m}. ${label}.`,
    );
  },
  setProdEnabled: (v) => set({ prodEnabled: v }),
  setTransport: (v) => set({ transport: v }),
  setRunning: (v) => set({ running: v }),

  setViewport: (v) => set((s) => ({ viewport: typeof v === 'function' ? v(s.viewport) : v })),
  setCanvasSize: (s) => set({ canvasSize: s }),

  fitView: () => {
    const s = get();
    const result = computeFitView(s.nodes, s.sizes, s.canvasSize, MIN_ZOOM, MAX_ZOOM);
    if (result) set({ viewport: result });
  },

  setSelNodes: (sn) => set({ selNodes: sn }),
  setSelEdges: (se) => set({ selEdges: se }),

  setNodes: (n) => set((s) => ({ nodes: typeof n === 'function' ? n(s.nodes) : n })),
  setEdges: (e) => set((s) => ({ edges: typeof e === 'function' ? e(s.edges) : e })),

  onMeasure: (id, h) => set((s) => (s.sizes[id] === h ? s : { sizes: { ...s.sizes, [id]: h } })),

  snapshot: () => set((s) => ({
    history: {
      past: [...s.history.past.slice(-49), { nodes: s.nodes, edges: s.edges }],
      future: [],
    },
  })),

  undo: () => {
    const s = get();
    if (!s.history.past.length) return;
    const prev = s.history.past[s.history.past.length - 1];
    set({
      nodes: prev.nodes, edges: prev.edges,
      selNodes: new Set(), selEdges: new Set(),
      history: {
        past: s.history.past.slice(0, -1),
        future: [{ nodes: s.nodes, edges: s.edges }, ...s.history.future],
      },
    });
    s.addAudit('graph.undo', 'local', 'Undo');
  },

  redo: () => {
    const s = get();
    if (!s.history.future.length) return;
    const next = s.history.future[0];
    set({
      nodes: next.nodes, edges: next.edges,
      selNodes: new Set(), selEdges: new Set(),
      history: {
        past: [...s.history.past, { nodes: s.nodes, edges: s.edges }],
        future: s.history.future.slice(1),
      },
    });
    s.addAudit('graph.redo', 'local', 'Redo');
  },

  addNode: (def, x, y) => {
    const s = get();
    s.snapshot();
    const id = 'n' + uid();
    const ns: GraphNode = {
      id, type: def.type,
      x: x ?? 200 + (s.nodes.length % 3) * 280,
      y: y ?? 80 + Math.floor(s.nodes.length / 3) * 150,
      status: 'idle', provenance: 'pending', ref: '', error: '',
      hsCode: '', pgaLicense: '',
    };
    set({
      nodes: [...s.nodes, ns],
      selNodes: new Set([id]),
      selEdges: new Set(),
      tab: 'node',
    });
    s.addAudit('graph.node.added', 'local', `Added node: ${def.label}`);
    return id;
  },

  deleteSelected: () => {
    const s = get();
    if (!s.selNodes.size && !s.selEdges.size) return;
    s.snapshot();
    const nodeIds = new Set(s.selNodes);
    set({
      nodes: s.nodes.filter((n) => !nodeIds.has(n.id)),
      edges: s.edges.filter((e) =>
        !nodeIds.has(e.source) && !nodeIds.has(e.target) && !s.selEdges.has(e.id)),
      selNodes: new Set(), selEdges: new Set(),
    });
    s.addAudit('graph.deleted', 'local',
      `Deleted ${s.selNodes.size} node(s), ${s.selEdges.size} edge(s)`);
  },

  copySelection: () => {
    const s = get();
    if (!s.selNodes.size) return;
    const ids = new Set(s.selNodes);
    const pickedNodes = s.nodes.filter((n) => ids.has(n.id));
    const pickedEdges = s.edges.filter((e) => ids.has(e.source) && ids.has(e.target));
    set({ clipboard: { nodes: pickedNodes, edges: pickedEdges } });
    s.addAudit('graph.copied', 'local', `Copied ${pickedNodes.length} node(s)`);
  },

  pasteClipboard: () => {
    const s = get();
    if (!s.clipboard || !s.clipboard.nodes.length) return;
    s.snapshot();
    const idMap = new Map<string, string>();
    const newNodes = s.clipboard.nodes.map((n) => {
      const id = 'n' + uid();
      idMap.set(n.id, id);
      return { ...n, id, x: n.x + 30, y: n.y + 30,
        status: 'idle' as const, provenance: 'pending' as const, ref: '', error: '' };
    });
    const newEdges = s.clipboard.edges.map((e) => ({
      ...e, id: 'e' + uid(), source: idMap.get(e.source)!, target: idMap.get(e.target)!,
      provenance: 'pending' as const,
    }));
    set({
      nodes: [...s.nodes, ...newNodes],
      edges: [...s.edges, ...newEdges],
      selNodes: new Set(newNodes.map((n) => n.id)),
      selEdges: new Set(),
    });
    s.addAudit('graph.pasted', 'local', `Pasted ${newNodes.length} node(s)`);
  },

  duplicateSelection: () => {
    const s = get();
    if (!s.selNodes.size) return;
    const ids = new Set(s.selNodes);
    const pickedNodes = s.nodes.filter((n) => ids.has(n.id));
    const pickedEdges = s.edges.filter((e) => ids.has(e.source) && ids.has(e.target));
    s.snapshot();
    const idMap = new Map<string, string>();
    const newNodes = pickedNodes.map((n) => {
      const id = 'n' + uid();
      idMap.set(n.id, id);
      return { ...n, id, x: n.x + 30, y: n.y + 30,
        status: 'idle' as const, provenance: 'pending' as const, ref: '', error: '' };
    });
    const newEdges = pickedEdges.map((e) => ({
      ...e, id: 'e' + uid(), source: idMap.get(e.source)!, target: idMap.get(e.target)!,
      provenance: 'pending' as const,
    }));
    set({
      nodes: [...s.nodes, ...newNodes],
      edges: [...s.edges, ...newEdges],
      selNodes: new Set(newNodes.map((n) => n.id)),
      selEdges: new Set(),
    });
    s.addAudit('graph.duplicated', 'local', `Duplicated ${newNodes.length} node(s)`);
  },

  selectAll: () => {
    const s = get();
    set({
      selNodes: new Set(s.nodes.map((n) => n.id)),
      selEdges: new Set(s.edges.map((e) => e.id)),
    });
  },

  autoLayout: () => {
    const s = get();
    s.snapshot();
    const order = topoOrder(s.nodes, s.edges);
    const layerOf = new Map<string, number>();
    for (const id of order) {
      const incoming = s.edges.filter((e) => e.target === id);
      const d = incoming.length === 0 ? 0
        : Math.max(...incoming.map((e) => (layerOf.get(e.source) ?? 0) + 1));
      layerOf.set(id, d);
    }
    const groups = new Map<number, string[]>();
    for (const n of s.nodes) {
      const l = layerOf.get(n.id) ?? 0;
      if (!groups.has(l)) groups.set(l, []);
      groups.get(l)!.push(n.id);
    }
    const newPositions = new Map<string, { x: number; y: number }>();
    const startX = 140, startY = 60, colGap = 300, rowGap = 30;
    [...groups.keys()].sort((a, b) => a - b).forEach((layer) => {
      let y = startY;
      groups.get(layer)!.forEach((id) => {
        newPositions.set(id, { x: startX + layer * colGap, y });
        y += (s.sizes[id] || 130) + rowGap;
      });
    });
    set({
      nodes: s.nodes.map((n) => {
        const p = newPositions.get(n.id);
        return p ? { ...n, x: p.x, y: p.y } : n;
      }),
    });
    setTimeout(() => get().fitView(), 40);
    s.addAudit('graph.auto_layout', 'local', 'Applied layered auto-layout');
  },

  run: async () => {
    const s = get();
    if (s.running) return;
    set({ running: true });
    s.addAudit('workflow.run.started',
      s.mode === 'development' ? 'synthetic' : s.mode === 'manual' ? 'manual' : 'local',
      `Run started in ${s.mode} mode.`);

    s.snapshot();
    set({
      nodes: s.nodes.map((n) => ({ ...n, status: 'idle', provenance: 'pending', ref: '', error: '' })),
      edges: s.edges.map((e) => ({ ...e, provenance: 'pending' })),
    });
    await new Promise((r) => setTimeout(r, 60));

    const supported = getSupportedOperations(s.mode, s.prodEnabled, s.transport);
    const order = topoOrder(get().nodes, get().edges);

    for (const nodeId of order) {
      set((st) => ({ nodes: st.nodes.map((n) => n.id === nodeId ? { ...n, status: 'running' } : n) }));
      await new Promise((r) => setTimeout(r, 260));

      const node = get().nodes.find((n) => n.id === nodeId);
      if (!node) continue;
      const result = evaluateNode(node, supported, s.mode, randRef);

      set((st) => ({
        nodes: st.nodes.map((n) => n.id === nodeId ? { ...n, ...result } : n),
        edges: st.edges.map((e) => e.source === nodeId ? { ...e, provenance: result.provenance } : e),
      }));

      const def = byType[node.type];
      get().addAudit(def?.op || 'unknown', result.provenance,
        result.error || `${def?.label} → ${result.status}${result.ref ? ' · ' + result.ref : ''}`);

      await new Promise((r) => setTimeout(r, 160));
    }
    get().addAudit('workflow.run.finished', 'local', 'Run finished.');
    set({ running: false });
  },

  setDragging: (d) => set((s) => ({ dragging: typeof d === 'function' ? d(s.dragging) : d })),
  setLinking: (l) => set((s) => ({ linking: typeof l === 'function' ? l(s.linking) : l })),
  setMarquee: (m) => set((s) => ({ marquee: typeof m === 'function' ? m(s.marquee) : m })),
  setPanning: (p) => set({ panning: p }),
  setHotPortId: (id) => set((s) => ({
    hotPortId: typeof id === 'function' ? id(s.hotPortId) : id,
  })),
  setGuides: (g) => set({ guides: g }),
  setSnapToGrid: (v) => set((s) => ({
    snapToGrid: typeof v === 'function' ? v(s.snapToGrid) : v,
  })),
  setEdgeStyle: (s) => set({ edgeStyle: s }),
  setSpaceDown: (v) => set({ spaceDown: v }),

  openHsPicker: (nodeId) => set({ pickerTargetId: nodeId }),
  closeHsPicker: () => set({ pickerTargetId: null }),

  applyHsCode: (code) => {
    const s = get();
    const targetId = s.pickerTargetId;
    if (!targetId) return;
    const canonical = normalizeHsCode(code);
    const entry = HS_BY_CODE[canonical];
    s.snapshot();
    set({
      nodes: s.nodes.map((n) => n.id === targetId ? { ...n, hsCode: canonical, pgaLicense: '' } : n),
      pickerTargetId: null,
    });
    s.addAudit(
      'hs.code.attached',
      entry ? (entry.restricted ? 'blocked' : 'local') : 'local',
      `HS ${canonical} attached to ${targetId}` +
        (entry
          ? ` · ${entry.duty}% duty · ${entry.sst}% SST` +
            (entry.pga.length ? ` · PGA: ${entry.pga.join(', ')}` : '')
          : ' · code not in local catalog'),
      { ref: canonical, hs: true },
    );
  },

  clearHsCode: () => {
    const s = get();
    if (!s.pickerTargetId) return;
    s.snapshot();
    set({
      nodes: s.nodes.map((n) => n.id === s.pickerTargetId ? { ...n, hsCode: '', pgaLicense: '' } : n),
      pickerTargetId: null,
    });
    s.addAudit('hs.code.removed', 'local', `HS code removed from ${s.pickerTargetId}`);
  },

  setNodeHsFromInspector: (code) => {
    const s = get();
    const targetId = s.selNodes.size === 1 ? [...s.selNodes][0] : null;
    if (!targetId) return;
    const canonical = normalizeHsCode(code);
    if (!canonical) return;
    s.snapshot();
    set({ nodes: s.nodes.map((n) => n.id === targetId ? { ...n, hsCode: canonical } : n) });
    s.addAudit('hs.code.attached', 'local',
      `HS ${canonical} attached to ${targetId}`, { ref: canonical, hs: true });
  },

  setNodePgaLicense: (license) => {
    const s = get();
    const targetId = s.selNodes.size === 1 ? [...s.selNodes][0] : null;
    if (!targetId) return;
    set({ nodes: s.nodes.map((n) => n.id === targetId ? { ...n, pgaLicense: license } : n) });
  },

  addAudit: (op, prov, msg, extra = {}) => set((s) => ({
    audit: [{
      id: uid(), time: Date.now(), op, prov, msg, mode: s.mode, ...extra,
    }, ...s.audit].slice(0, 250),
  })),

  submitManual: (form) => {
    const s = get();
    const target = TARGET_MAP[form.category] || 'acknowledged';
    const sensitive = ['acknowledged','accepted','rejected','released','inspection_required'].includes(target);

    s.addAudit('record_external_response', 'manual',
      `Manual observation recorded → ${target}; ` +
      `${form.evidence ? 'evidence ' + form.evidence : 'exception path'}; ` +
      `${form.reviewed ? 'reviewer marked approved' : 'awaiting review'}.`,
      { ref: form.ref });

    set({
      decl: attemptTransition(s.decl, target, 'manual', {
        ref: form.ref,
        evidence: form.evidence || form.exception,
        officer: form.officerName || form.officerId || 'Not provided',
        notes: form.notes,
        reviewed: form.reviewed || !sensitive,
      }),
    });
  },

  approveObservation: () => {
    const s = get();
    const d = s.decl;
    if (!d.pendingObservation) return;
    const { target, ref } = d.pendingObservation;
    s.addAudit('manual.observation.approved', 'manual',
      `Reviewer approved manual observation → ${target}.`, { ref });
    set({ decl: attemptTransition(d, target, 'manual', { ref, reviewed: true }) });
  },

  setTab: (t) => set({ tab: t }),
  setContextMenu: (c) => set({ contextMenu: c }),
  setShowShortcuts: (v) => set({ showShortcuts: v }),
  setManualModalOpen: (v) => set({ manualModalOpen: v }),
}));

export { wouldCreateCycle };

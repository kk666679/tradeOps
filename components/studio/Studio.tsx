'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useNodesInitialized,
  useOnSelectionChange,
  useReactFlow,
  useUpdateNodeInternals,
  MarkerType,
  type Connection,
} from '@xyflow/react';

import type {
  Capability, Declaration, DeclarationStatus, EmitFn, IntegrationMode,
  LibraryDef, ManualResponseForm, Provenance, StudioEdge, StudioEvent, StudioNode,
} from '@/types';
import { byType } from '@/constants/nodeLibrary';
import { CAPABILITIES, VERIFIED_PRODUCTION_CAPS } from '@/constants/capabilities';
import { SENSITIVE, TARGET_MAP } from '@/constants/transitions';
import { PROV_COLOR } from '@/constants/palettes';
import { SEED_DECL, SEED_EDGES, SEED_NODES, makeNode } from '@/lib/graphFactory';
import { attemptTransition } from '@/lib/stateMachine';
import { tarjan } from '@/lib/tarjan';
import { uid } from '@/lib/helpers';
import { useGraphEngine } from '@/hooks/useGraphEngine';
import { useChat } from '@/hooks/useChat';

import TitleBar from './TitleBar';
import TabBar from './TabBar';
import CenterPanel from './CenterPanel';
import ConsolePanel from './ConsolePanel';
import ManualResponseModal from './ManualResponseModal';
import LeftPanel, { type LeftTab } from '@/components/panels/LeftPanel';
import RightPanel, { type RightTab } from '@/components/panels/RightPanel';

function StudioInner() {
  /* ── Layout ── */
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [leftTab, setLeftTab] = useState<LeftTab>('nodes');
  const [rightTab, setRightTab] = useState<RightTab>('chat');

  /* ── Integration ── */
  const [mode, setMode] = useState<IntegrationMode>('development');
  const [prodEnabled, setProdEnabled] = useState(false);
  const [transport, setTransport] = useState(false);

  /* ── Graph ── */
  const [nodes, setNodes, onNodesChange] = useNodesState<StudioNode>(SEED_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<StudioEdge>(SEED_EDGES);

  /* ── Selection ── */
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  /* ── Declaration ── */
  const [decl, setDecl] = useState<Declaration>(SEED_DECL);

  /* ── Events ── */
  const [events, setEvents] = useState<StudioEvent[]>([{
    id: uid(), time: Date.now(), op: 'studio.initialized', prov: 'local',
    mode: 'development',
    msg: 'Workflow Studio initialized. No external customs connection has been made.',
  }]);

  const emit: EmitFn = useCallback((op, prov, msg, extra = {}) => {
    setEvents((ev) => [{ id: uid(), time: Date.now(), op, prov, msg, ...extra }, ...ev].slice(0, 400));
  }, []);

  /* ── Modal ── */
  const [modal, setModal] = useState(false);

  /* ── Refs ── */
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const declRef = useRef(decl);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);
  useEffect(() => { declRef.current = decl; }, [decl]);

  /* ── React Flow helpers ── */
  const rf = useReactFlow<StudioNode>();
  const updateNodeInternals = useUpdateNodeInternals();
  const nodesInitialized = useNodesInitialized();
  const fittedRef = useRef(false);
  useEffect(() => {
    if (nodesInitialized && !fittedRef.current) {
      fittedRef.current = true;
      rf.fitView({ padding: 0.22 });
    }
  }, [nodesInitialized, rf]);

  /* ── Selection sync ── */
  useOnSelectionChange({
    onChange: useCallback(({ nodes: ns, edges: es }: { nodes: StudioNode[]; edges: StudioEdge[] }) => {
      if (es.length > 0) {
        setSelectedEdge(es[0].id);
        setSelectedNode(null);
      } else if (ns.length > 0) {
        setSelectedNode(ns[0].id);
        setSelectedEdge(null);
        setRightTab((prev) => (prev === 'chat' ? 'node' : prev));
      } else {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    }, []),
  });

  /* ── Capabilities ── */
  const supported = useMemo<Capability[]>(() => {
    if (mode === 'production') return prodEnabled && transport ? VERIFIED_PRODUCTION_CAPS : [];
    return CAPABILITIES[mode] || [];
  }, [mode, prodEnabled, transport]);

  const verified = mode === 'production' && prodEnabled && transport;

  const integrationLabel = useMemo(() => {
    if (mode === 'development') return 'Development simulation — not connected to JKDM';
    if (mode === 'manual') return 'Manual processing required — record external responses';
    if (verified) return 'Production transport flagged — live probe not performed';
    return 'Production integration unavailable';
  }, [mode, verified]);

  useEffect(() => {
    emit('adapter.mode_changed',
      mode === 'development' ? 'synthetic' : mode === 'manual' ? 'manual' : 'local',
      `Mode changed to ${mode}. ${integrationLabel}.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, prodEnabled, transport]);

  /* ── Graph mutations ── */
  const addNodeAt = useCallback((def: LibraryDef, pos: { x: number; y: number }) => {
    const id = 'n' + uid();
    setNodes((ns) => [...ns, makeNode(def, id, pos)]);
    setSelectedNode(id);
    setSelectedEdge(null);
    setRightTab('node');
    emit('graph.node.added', 'local', `Added node: ${def.label}`);
  }, [setNodes, emit]);

  const onConnect = useCallback((params: Connection) => {
    const newEdge: StudioEdge = {
      ...params,
      id: 'e' + uid(),
      type: 'provenance',
      data: { provenance: 'pending', isLoop: params.sourceHandle === 'loop' },
      markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: PROV_COLOR.pending },
    };
    setEdges((es) => addEdge(newEdge, es));
    const isLoop = params.sourceHandle === 'loop';
    emit('graph.edge.added', 'local',
      `Wired ${params.source} → ${params.target}${isLoop ? ' (⟲ loop-back)' : ''}`);
  }, [setEdges, emit]);

  const deleteSelection = useCallback(() => {
    if (selectedEdge) {
      setEdges((es) => es.filter((e) => e.id !== selectedEdge));
      emit('graph.edge.removed', 'local', `Removed edge ${selectedEdge}`);
      setSelectedEdge(null);
    } else if (selectedNode) {
      setNodes((ns) => ns.filter((n) => n.id !== selectedNode));
      setEdges((es) => es.filter((e) => e.source !== selectedNode && e.target !== selectedNode));
      emit('graph.node.removed', 'local', `Removed node ${selectedNode}`);
      setSelectedNode(null);
    }
  }, [selectedEdge, selectedNode, setEdges, setNodes, emit]);

  /* ── Drag and drop ── */
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/reactflow');
    if (!raw) return;
    try {
      const { type } = JSON.parse(raw) as { type: string };
      const def = byType[type];
      if (!def) return;
      const pos = rf.screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNodeAt(def, { x: pos.x - 110, y: pos.y - 40 });
    } catch { /* ignore */ }
  }, [rf, addNodeAt]);

  const onDragStart = useCallback((e: React.DragEvent, def: LibraryDef) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ type: def.type }));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  /* ── Engine ── */
  const { run, running, runStats } = useGraphEngine({
    mode, supported, nodesRef, edgesRef, declRef,
    setNodes, setEdges, setDecl, updateNodeInternals, emit,
  });

  /* ── Manual observation ── */
  const submitManual = useCallback((form: ManualResponseForm) => {
    setModal(false);
    const target: DeclarationStatus = TARGET_MAP[form.category] || 'acknowledged';
    const sensitive = SENSITIVE.has(target);
    emit('record_external_response', 'manual',
      `Manual observation recorded → ${target}; ` +
      `${form.evidence ? 'evidence ' + form.evidence : 'exception path'}; ` +
      `${form.reviewed ? 'reviewer marked approved' : 'awaiting review'}.`,
      { ref: form.ref });
    setDecl((d) => attemptTransition(d, target, 'manual', {
      ref: form.ref,
      evidence: form.evidence || form.exception,
      officer: form.officerName || form.officerId || 'Not provided',
      notes: form.notes,
      reviewed: form.reviewed || !sensitive,
    }));
  }, [emit]);

  const approveObservation = useCallback((): boolean => {
    if (!declRef.current.pendingObservation) return false;
    setDecl((d) => {
      if (!d.pendingObservation) return d;
      const { target, ref } = d.pendingObservation;
      emit('manual.observation.approved', 'manual',
        `Reviewer approved manual observation → ${target}.`, { ref });
      return attemptTransition(d, target, 'manual', { ref, reviewed: true });
    });
    return true;
  }, [emit]);

  const advanceDecl = useCallback((target: DeclarationStatus) => {
    emit('declaration.manual_advance', 'local', `Operator advanced declaration → ${target}.`);
    setDecl((d) => attemptTransition(d, target, 'local', {}));
  }, [emit]);

  /* ── Chat ── */
  const { messages: chat, input: chatInput, setInput: setChatInput, send: sendChat } = useChat({
    mode,
    capabilityCount: supported.length,
    onRun: run,
    onOpenManual: () => setModal(true),
    onApprove: approveObservation,
    getStatus: () => ({ id: declRef.current.id, status: declRef.current.status }),
    getLoopInfo: () => {
      const groups = tarjan(nodesRef.current, edgesRef.current).filter((s) => s.length > 1);
      const gate = nodesRef.current.find((n) => n.data.kind === 'gate');
      return {
        groups: groups.length,
        until: (gate?.data.until || []).join(' / '),
        maxIter: gate?.data.maxIter || 8,
      };
    },
  });
  const [approveOn, setApproveOn] = useState(true);

  /* ── Keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.matches('input, textarea, select, [contenteditable]')) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') { e.preventDefault(); setLeftCollapsed((c) => !c); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') { e.preventDefault(); setRightCollapsed((c) => !c); }
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteSelection(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deleteSelection]);

  /* ── Derived ── */
  const chosenNode = nodes.find((n) => n.id === selectedNode);
  const chosenEdge = edges.find((e) => e.id === selectedEdge);
  const blockedNodes = useMemo(() => nodes.filter((n) => n.data.status === 'blocked'), [nodes]);
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const loopGroups = useMemo(() => tarjan(nodes, edges).filter((s) => s.length > 1), [nodes, edges]);

  const banner = useMemo(() => {
    if (mode === 'development') return { cls: 'dev', text: '⚠ DEVELOPMENT SIMULATION — NOT CONNECTED TO JKDM' };
    if (mode === 'production' && !verified) return { cls: 'block', text: '⚠ PRODUCTION INTEGRATION UNAVAILABLE — MANUAL PROCESSING REQUIRED' };
    if (mode === 'production' && verified) return { cls: 'block', text: '⚠ LIVE CONNECTION NOT PROBED — DO NOT TREAT AS CONNECTED' };
    return null;
  }, [mode, verified]);

  const duplicateChosen = useCallback(() => {
    if (!chosenNode) return;
    const newId = 'n' + uid();
    setNodes((ns) => [...ns, {
      ...chosenNode,
      id: newId,
      position: { x: chosenNode.position.x + 40, y: chosenNode.position.y + 40 },
      selected: false,
      data: { ...chosenNode.data, status: 'idle', provenance: 'pending' as Provenance,
        ref: '', error: '', note: '', iterations: 0 },
    }]);
    emit('graph.node.duplicated', 'local', `Duplicated ${chosenNode.data.label}`);
  }, [chosenNode, setNodes, emit]);

  return (
    <div className="grid h-screen grid-rows-[28px_38px_1fr_150px] bg-[#0d1117]">
      <TitleBar nodeCount={nodes.length} edgeCount={edges.length} />

      <TabBar
        mode={mode}
        onModeChange={setMode}
        running={running}
        verified={verified}
        integrationLabel={integrationLabel}
        loopCount={loopGroups.length}
        onOpenManual={() => setModal(true)}
        onRun={run}
        onFitView={() => rf.fitView({ padding: 0.22 })}
        leftCollapsed={leftCollapsed}
        rightCollapsed={rightCollapsed}
        onToggleLeft={() => setLeftCollapsed((c) => !c)}
        onToggleRight={() => setRightCollapsed((c) => !c)}
        onResetLayout={() => { setLeftCollapsed(false); setRightCollapsed(false); }}
      />

      <div className={
        'grid min-h-0 overflow-hidden transition-[grid-template-columns] duration-[180ms] ' +
        (leftCollapsed && rightCollapsed ? 'grid-cols-[36px_1fr_36px]'
          : leftCollapsed ? 'grid-cols-[36px_1fr_400px]'
          : rightCollapsed ? 'grid-cols-[250px_1fr_36px]'
          : 'grid-cols-[250px_1fr_400px]')
      }>
        <LeftPanel
          collapsed={leftCollapsed}
          onToggleCollapsed={() => setLeftCollapsed((c) => !c)}
          tab={leftTab}
          onTabChange={setLeftTab}
          supported={supported}
          mode={mode}
          nodes={nodes}
          nodeById={nodeById}
          loopGroups={loopGroups}
          blockedNodes={blockedNodes}
          selectedNode={selectedNode}
          onSelectNode={(id) => { setSelectedNode(id); setSelectedEdge(null); setRightTab('node'); }}
          onAddNode={(def) => addNodeAt(def, { x: 200 + Math.random() * 400, y: 200 + Math.random() * 400 })}
          onDragStart={onDragStart}
        />

        <CenterPanel
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          running={running}
          runStats={runStats}
          mode={mode}
          supported={supported}
          banner={banner}
          onRun={run}
          onDeleteSelection={deleteSelection}
          onAddNodeAt={addNodeAt}
        />

        <RightPanel
          collapsed={rightCollapsed}
          onToggleCollapsed={() => setRightCollapsed((c) => !c)}
          tab={rightTab}
          onTabChange={setRightTab}
          chat={chat}
          chatInput={chatInput}
          onChatInputChange={setChatInput}
          onSendChat={sendChat}
          approveOn={approveOn}
          onToggleApprove={() => setApproveOn((v) => !v)}
          mode={mode}
          verified={verified}
          prodEnabled={prodEnabled}
          transport={transport}
          onProdEnabledChange={setProdEnabled}
          onTransportChange={setTransport}
          supported={supported}
          nodeCount={nodes.length}
          edgeCount={edges.length}
          loopCount={loopGroups.length}
          blockedNodes={blockedNodes}
          decl={decl}
          onAdvance={advanceDecl}
          onApproveObservation={approveObservation}
          events={events}
          chosenNode={chosenNode}
          chosenEdge={chosenEdge}
          nodeById={nodeById}
          onDuplicate={duplicateChosen}
          onDeleteSelection={deleteSelection}
        />
      </div>

      <ConsolePanel events={events} running={running} />

      {modal && <ManualResponseModal onClose={() => setModal(false)} onSubmit={submitManual} />}
    </div>
  );
}

export default function Studio() {
  return (
    <ReactFlowProvider>
      <StudioInner />
    </ReactFlowProvider>
  );
}
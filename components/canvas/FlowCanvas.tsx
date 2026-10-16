'use client';

import {
  Background, BackgroundVariant, ConnectionMode, ControlButton, Controls,
  MiniMap, Panel, ReactFlow, SelectionMode, MarkerType,
  type OnEdgesChange, type OnNodesChange,
} from '@xyflow/react';
import type {
  Capability, IntegrationMode, LibraryDef, RunStats, StudioEdge, StudioNode,
} from '@/types';
import { PROV_COLOR, STATUS_COLOR } from '@/constants/palettes';
import nodeTypes from '@/components/nodes/nodeTypes';
import edgeTypes from '@/components/edges/edgeTypes';
import ConnectionIndicator from './ConnectionIndicator';
import RunHUD from './RunHUD';
import Legend from './Legend';

export interface FlowCanvasProps {
  nodes: StudioNode[];
  edges: StudioEdge[];
  onNodesChange: OnNodesChange<StudioNode>;
  onEdgesChange: OnEdgesChange<StudioEdge>;
  onConnect: (c: import('@xyflow/react').Connection) => void;
  onDrop: React.DragEventHandler<HTMLDivElement>;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  running: boolean;
  runStats: RunStats;
  mode: IntegrationMode;
  supported: Capability[];
  banner: { cls: string; text: string } | null;
  onRun: () => void;
  onDeleteSelection: () => void;
  onAddNodeAt: (def: LibraryDef, pos: { x: number; y: number }) => void;
}

export default function FlowCanvas({
  nodes, edges, onNodesChange, onEdgesChange, onConnect,
  onDrop, onDragOver, running, runStats, mode, supported, banner,
  onRun, onDeleteSelection,
}: FlowCanvasProps) {
  return (
    <div className="relative min-h-0 flex-1 bg-[#0b1220]" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow<StudioNode, StudioEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Strict}
        selectionMode={SelectionMode.Partial}
        fitView
        fitViewOptions={{ padding: 0.22 }}
        minZoom={0.15}
        maxZoom={2.5}
        snapToGrid
        snapGrid={[8, 8]}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'provenance',
          markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: PROV_COLOR.pending },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#263451" />
        <Background id="cross" variant={BackgroundVariant.Cross} gap={160} size={6} color="#1a2740" />

        <Controls position="bottom-right" showInteractive={false}>
          <ControlButton onClick={onRun} disabled={running} title="Run workflow">
            <svg viewBox="0 0 24 24" width="12" height="12">
              <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
            </svg>
          </ControlButton>
          <ControlButton onClick={onDeleteSelection} title="Delete selection">
            <svg viewBox="0 0 24 24" width="12" height="12">
              <polyline points="3 6 5 6 21 6" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </ControlButton>
        </Controls>

        <MiniMap
          position="bottom-left"
          pannable
          zoomable
          maskColor="rgba(3,7,18,0.75)"
          nodeColor={(n) => STATUS_COLOR[(n as StudioNode).data?.status] ?? STATUS_COLOR.idle}
          nodeStrokeColor={(n) => STATUS_COLOR[(n as StudioNode).data?.status] ?? STATUS_COLOR.idle}
          nodeBorderRadius={4}
          style={{ width: 170, height: 110 }}
        />

        <Panel position="top-left">
          {banner && (
            <div className={
              'pointer-events-none rounded-md px-2.5 py-[7px] text-[10.5px] font-extrabold tracking-wide ' +
              (banner.cls === 'dev'
                ? 'border border-purple-700 bg-[#2e1065] text-[#e9d5ff]'
                : 'border border-amber-700 bg-[#451a03] text-[#fde68a]')
            }>
              {banner.text}
            </div>
          )}
        </Panel>

        <Panel position="top-center"><ConnectionIndicator /></Panel>

        <Panel position="top-right">
          <RunHUD running={running} runStats={runStats} mode={mode} capCount={supported.length} />
        </Panel>

        <Panel position="bottom-center"><Legend /></Panel>
      </ReactFlow>
    </div>
  );
}
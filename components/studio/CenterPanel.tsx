'use client';

import { useReactFlow, type OnEdgesChange, type OnNodesChange } from '@xyflow/react';
import type { Capability, IntegrationMode, LibraryDef, RunStats, StudioEdge, StudioNode } from '@/types';
import FlowCanvas from '@/components/canvas/FlowCanvas';
import ZoomIndicator from '@/components/canvas/ZoomIndicator';

export interface CenterPanelProps {
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

export default function CenterPanel(props: CenterPanelProps) {
  const { nodes, edges, onRun, onDeleteSelection } = props;
  const rf = useReactFlow<StudioNode>();

  return (
    <section className="flex min-w-0 flex-col overflow-hidden bg-[#131921]">
      <div className="flex flex-none items-center gap-1.5 border-b border-[#1f2937] bg-[#0f141b] px-2.5 py-1.5 text-[11px]">
        <div className="h-3.5 w-3.5 rounded-sm bg-gradient-to-br from-blue-500 to-purple-500" />
        <span className="font-medium text-[#e5e7eb]">declaration_clearance_loop.rf</span>
        <span className="text-[10px] text-[#4b5563]">
          {nodes.length} nodes · {edges.length} edges
        </span>
        <div className="flex-1" />
        <ZoomIndicator />
        <button onClick={onDeleteSelection} title="Delete selection (Del)"
          className="grid h-[26px] w-[26px] place-items-center rounded text-[#6b7280] hover:bg-[#1f2731] hover:text-[#e5e7eb]">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        </button>
      </div>

      <div className="flex flex-none items-center gap-0.5 overflow-x-auto border-b border-[#1f2937] bg-[#0f141b] px-2 py-1">
        <button onClick={() => rf.fitView({ padding: 0.22 })} title="Fit view"
          className="grid h-6 w-6 place-items-center rounded text-[#6b7280] hover:bg-[#1f2731] hover:text-[#e5e7eb]">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V3h4M21 7V3h-4M3 17v4h4M21 17v4h-4" />
          </svg>
        </button>
        <button onClick={() => rf.zoomIn()} title="Zoom in"
          className="grid h-6 w-6 place-items-center rounded text-[#6b7280] hover:bg-[#1f2731] hover:text-[#e5e7eb]">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
          </svg>
        </button>
        <button onClick={() => rf.zoomOut()} title="Zoom out"
          className="grid h-6 w-6 place-items-center rounded text-[#6b7280] hover:bg-[#1f2731] hover:text-[#e5e7eb]">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M8 11h6" />
          </svg>
        </button>
        <div className="mx-1 h-4 w-px bg-[#2d3748]" />
        <button className="grid h-6 w-6 place-items-center rounded bg-blue-500/10 text-[#60a5fa]" title="Selection mode">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l7 19 2-8 8-2z" />
          </svg>
        </button>
        <div className="mx-1 h-4 w-px bg-[#2d3748]" />
        <button disabled={props.running} onClick={onRun} title="Run"
          className="grid h-6 w-6 place-items-center rounded text-[#6b7280] hover:bg-[#1f2731] hover:text-[#e5e7eb] disabled:opacity-50">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
        <div className="mx-1 h-4 w-px bg-[#2d3748]" />
        <span className="whitespace-nowrap px-2 text-[10px] text-[#4b5563]">
          Drag from a Handle to wire · Del removes · Ctrl+B / Ctrl+J toggle panels
        </span>
      </div>

      <FlowCanvas {...props} />
    </section>
  );
}
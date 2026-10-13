'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap,
  applyEdgeChanges, applyNodeChanges,
  type NodeMouseHandler, type EdgeMouseHandler,
  type NodeTypes, type EdgeTypes,
  SelectionMode, BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  useDigitalTwinStore,
  selectSelectedEdge,
  selectSelectedNode,
} from '../store/useDigitalTwinStore';
import { TwinNode } from '../graph/TwinNode';
import { TwinEdge } from '../graph/TwinEdge';
import type { TwinGraphEdge, TwinGraphNode } from '@/lib/digital-twin/types';

const nodeTypes: NodeTypes = { twin: TwinNode };
const edgeTypes: EdgeTypes = { twin: TwinEdge };

export function DigitalTwinCanvas() {
  const nodes = useDigitalTwinStore((s) => s.nodes);
  const edges = useDigitalTwinStore((s) => s.edges);
  const setNodes = useDigitalTwinStore((s) => s.setNodes);
  const setEdges = useDigitalTwinStore((s) => s.setEdges);
  const selectNode = useDigitalTwinStore((s) => s.selectNode);
  const selectEdge = useDigitalTwinStore((s) => s.selectEdge);
  const mode = useDigitalTwinStore((s) => s.mode);
  const selectedNode = useDigitalTwinStore(selectSelectedNode);
  const selectedEdge = useDigitalTwinStore(selectSelectedEdge);

  const decoratedNodes = useMemo<TwinGraphNode[]>(
    () =>
      nodes.map((n) => ({
        ...n,
        type: 'twin',
        selected: selectedNode?.id === n.id,
      })),
    [nodes, selectedNode?.id],
  );

  const decoratedEdges = useMemo<TwinGraphEdge[]>(
    () =>
      edges.map((e) => ({
        ...e,
        type: 'twin',
        selected: selectedEdge?.id === e.id,
        animated: e.data?.kind === 'flow' && mode === 'running',
      })),
    [edges, selectedEdge?.id, mode],
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_e, n) => selectNode(n.id),
    [selectNode],
  );

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_e, edge) => selectEdge(edge.id),
    [selectEdge],
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  return (
    <div className="h-full w-full relative">
      {/* marker defs for edges */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {(['flow', 'handoff', 'dependency', 'semantic'] as const).map((k) => {
            const stroke =
              k === 'flow' ? '#3b82f6'
              : k === 'handoff' ? '#a855f7'
              : k === 'dependency' ? '#f59e0b'
              : '#14b8a6';
            return (
              <marker
                key={k}
                id={`twin-arrow-${k}`}
                viewBox="0 0 10 10"
                refX="9" refY="5"
                markerWidth="6" markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={stroke} />
              </marker>
            );
          })}
        </defs>
      </svg>

      <ReactFlow
        nodes={decoratedNodes}
        edges={decoratedEdges}
        onNodesChange={(c) =>
          setNodes((prev) => applyNodeChanges(c, prev) as TwinGraphNode[])
        }
        onEdgesChange={(c) =>
          setEdges((prev) => applyEdgeChanges(c, prev) as TwinGraphEdge[])
        }
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        selectionMode={SelectionMode.Partial}
        proOptions={{ hideAttribution: true }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2.5}
        className="bg-slate-950"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#1e293b"
        />
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          nodeColor={(n) => {
            const d = n.data as { status?: string };
            return d?.status === 'error' ? '#ef4444'
              : d?.status === 'blocked' ? '#f59e0b'
              : d?.status === 'active' ? '#10b981'
              : '#3b82f6';
          }}
          maskColor="rgba(2,6,23,0.7)"
          style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
          }}
        />
      </ReactFlow>
    </div>
  );
}

export default DigitalTwinCanvas;

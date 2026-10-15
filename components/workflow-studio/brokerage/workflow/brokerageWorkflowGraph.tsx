'use client';

import * as React from 'react';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  MarkerType,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeMouseHandler,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import './workflow.css';

import { SAMPLE_ACCREDITATION, SAMPLE_ACCREDITATIONS, SAMPLE_CLIENT, SAMPLE_DECLARATION, SAMPLE_WORKFLOW } from '../data';
import type { Accreditation, BrokerClient, BrokerageWorkflow, Declaration, WorkflowNode, WorkflowEdge } from '../types';

/* ---------------------------------------------------------------- *
 * Re-exports kept for existing consumers
 * ---------------------------------------------------------------- */

export { SAMPLE_ACCREDITATION, SAMPLE_ACCREDITATIONS, SAMPLE_CLIENT, SAMPLE_DECLARATION };

export const EMPTY_WORKFLOW: BrokerageWorkflow = { nodes: [], edges: [] };

/* ---------------------------------------------------------------- *
 * Node/edge rendering
 * ---------------------------------------------------------------- */

const STATUS_STYLE: Record<string, { background: string; border: string; color: string; icon: string }> = {
  done: { background: '#10b98115', border: '#10b981', color: '#10b981', icon: '✓' },
  active: { background: '#3b82f615', border: '#3b82f6', color: '#3b82f6', icon: '●' },
  pending: { background: '#71717a15', border: '#52525b', color: '#a1a1aa', icon: '○' },
  blocked: { background: '#f59e0b15', border: '#f59e0b', color: '#f59e0b', icon: '!' },
  failed: { background: '#ef444415', border: '#ef4444', color: '#ef4444', icon: '×' },
};

const KIND_LABEL: Record<string, string> = {
  start: 'Start',
  end: 'End',
  task: 'Step',
  approval: 'Approval',
  decision: 'Decision',
  event: 'Event',
};

function StepNode({ data, selected }: { data: WorkflowNode; selected?: boolean }) {
  const style = STATUS_STYLE[data.status ?? 'pending'] ?? STATUS_STYLE.pending;
  const kind = KIND_LABEL[data.kind ?? 'task'] ?? 'Step';
  const pendingApproval = data.kind === 'approval' && (data.status ?? 'pending') === 'pending';

  return (
    <div
      className="s90-node"
      data-status={data.status ?? 'pending'}
      style={{
        background: style.background,
        border: `1px solid ${style.border}`,
        color: style.color,
        boxShadow: selected ? `0 0 0 2px ${style.border}` : 'none',
      }}
    >
      <span aria-hidden="true" className="s90-node-icon">{style.icon}</span>
      <span className="s90-node-label">{data.label}</span>
      <span className="s90-node-kind">
        {kind}
        {pendingApproval ? ' · pending' : ''}
      </span>
    </div>
  );
}

const nodeTypes: NodeTypes = { step: StepNode };

/** Convert brokerage nodes to laid-out React Flow nodes (vertical column). */
function toFlowNodes(workflow: BrokerageWorkflow): Node[] {
  const spacing = 96;
  const startY = 40;

  return workflow.nodes.map((node, index) => ({
    id: node.id,
    type: 'step',
    position: { x: 260, y: startY + index * spacing },
    data: node,
    draggable: false,
    connectable: false,
  }));
}

function toFlowEdges(workflow: BrokerageWorkflow, selectedId?: string | null): Edge[] {
  return workflow.edges.map((edge: WorkflowEdge, index) => {
    const onPath =
      selectedId != null &&
      (edge.from === selectedId || edge.to === selectedId);
    return {
      id: `${edge.from}->${edge.to}-${index}`,
      source: edge.from,
      target: edge.to,
      label: edge.label,
      type: 'smoothstep',
      animated: onPath,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' },
      style: {
        stroke: onPath ? '#3b82f6' : '#52525b',
        strokeWidth: onPath ? 2 : 1.5,
      },
      labelStyle: { fill: '#a1a1aa', fontSize: 10 },
      labelBgStyle: { fill: '#18181b' },
    };
  });
}

/* ---------------------------------------------------------------- *
 * Connected surface
 * ---------------------------------------------------------------- */

export interface BrokerageWorkflowGraphProps {
  /** Workflow graph; defaults to the Section 90 declaration lifecycle. */
  workflow?: BrokerageWorkflow;
  /** Accreditations shown in the side rail. */
  accreditations?: Accreditation[];
  className?: string;
  height?: number;
}

function GraphInner({ workflow, accreditations, className, height = 520 }: BrokerageWorkflowGraphProps) {
  const graph = workflow ?? SAMPLE_WORKFLOW;
  const [initialNodes] = React.useState<Node[]>(() => toFlowNodes(graph));
  const [initialEdges] = React.useState<Edge[]>(() => toFlowEdges(graph));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setNodes(toFlowNodes(graph));
    setEdges(toFlowEdges(graph, selectedId));
  }, [graph, selectedId, setNodes, setEdges]);

  const handleNodeClick = React.useCallback<NodeMouseHandler>(
    (_event, node) => {
      setSelectedId((prev) => (prev === node.id ? null : node.id));
    },
    [],
  );

  const done = graph.nodes.filter((n) => n.status === 'done').length;
  const total = graph.nodes.length;

  return (
    <div className={`s90-graph ${className ?? ''}`} style={{ height }}>
      <div className="s90-graph-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onPaneClick={() => setSelectedId(null)}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={1.6}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
        >
          <Background color="#3f3f46" gap={20} size={1} />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeStrokeColor="#52525b"
            nodeColor={(n: Node) => STATUS_STYLE[(n.data as WorkflowNode)?.status ?? 'pending']?.border ?? '#52525b'}
            maskColor="#09090b80"
            style={{ background: '#18181b' }}
          />
        </ReactFlow>
      </div>

      <div className="s90-graph-rail">
        <div className="s90-rail-block">
          <p className="s90-rail-title">Lifecycle progress</p>
          <p className="s90-rail-value">
            {done} / {total} steps complete
          </p>
          <div className="s90-rail-track" role="presentation">
            <span
              className="s90-rail-fill"
              style={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {accreditations && accreditations.length > 0 && (
          <div className="s90-rail-block">
            <p className="s90-rail-title">Accreditations</p>
            <ul className="s90-rail-list">
              {accreditations.map((acc) => (
                <li key={acc.id} className="s90-rail-item">
                  <span className="s90-rail-code">{acc.code}</span>
                  <span className="s90-rail-meta">
                    {acc.ejenType ?? 'ejen'} · {acc.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedId && (
          <div className="s90-rail-block">
            <p className="s90-rail-title">Selected step</p>
            <p className="s90-rail-value">
              {graph.nodes.find((n) => n.id === selectedId)?.label ?? selectedId}
            </p>
          </div>
        )}

        <div className="s90-rail-block">
          <p className="s90-rail-title">Legend</p>
          <ul className="s90-legend">
            {Object.entries(STATUS_STYLE).map(([status, style]) => (
              <li key={status} className="s90-legend-row">
                <span className="s90-legend-dot" style={{ background: style.border }} />
                <span className="s90-legend-label">{style.icon} {status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function BrokerageWorkflowGraph(props: BrokerageWorkflowGraphProps) {
  const accreditations = props.accreditations ?? SAMPLE_ACCREDITATIONS;
  return (
    <ReactFlowProvider>
      <GraphInner {...props} accreditations={accreditations} />
    </ReactFlowProvider>
  );
}

export default BrokerageWorkflowGraph;

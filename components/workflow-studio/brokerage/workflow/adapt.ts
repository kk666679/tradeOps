import type { Edge, Node } from '@xyflow/react';
import type { WorkflowEdge, WorkflowNode } from '../types';
import type { BrokerageNodeData } from '../../nodes/brokerage/BrokerageNode';
import type { BrokerageNodeKind } from '../../nodes/taxonomy';

/**
 * Column per brokerage kind. Left = start, right = end.
 * Swap for ELK / dagre when the graph outgrows this stub layout.
 */
const COLUMN: Record<BrokerageNodeKind, number> = {
  start: 0,
  task: 1,
  approval: 2,
  decision: 3,
  end: 4,
};

const ROW_HEIGHT = 140;
const COL_WIDTH = 280;

function inferKind(n: WorkflowNode): BrokerageNodeKind {
  const k = (n.kind ?? 'task') as BrokerageNodeKind;
  if (k in COLUMN) return k;
  return 'task';
}

export function toXYFlow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): { nodes: Node<BrokerageNodeData>[]; edges: Edge[] } {
  const rowCursor = new Map<BrokerageNodeKind, number>();

  const xyNodes: Node<BrokerageNodeData>[] = nodes.map((n) => {
    const kind = inferKind(n);
    const col = COLUMN[kind];
    const row = rowCursor.get(kind) ?? 0;
    rowCursor.set(kind, row + 1);

    return {
      id: n.id,
      type: 'brokerage',
      position: { x: col * COL_WIDTH, y: row * ROW_HEIGHT },
      data: {
        kind,
        label: n.label,
        status: (n.status ?? 'idle') as BrokerageNodeData['status'],
      },
      draggable: false,
      connectable: false,
    };
  });

  const xyEdges: Edge[] = edges.map((e, i) => ({
    id: `e_${i}_${e.from}_${e.to}`,
    source: e.from,
    target: e.to,
    label: e.label,
    type: 'default',
  }));

  return { nodes: xyNodes, edges: xyEdges };
}

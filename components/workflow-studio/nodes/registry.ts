'use client';

import type { NodeTypes } from '@xyflow/react';
import { BrokerageNode } from './brokerage/BrokerageNode';
import { UnsupportedNode } from './UnsupportedNode';

/**
 * Registered node renderers. Every canvas node type must appear here.
 * Unknown types resolve to UnsupportedNode — never to a generic fallback.
 *
 * To add an executable node (e.g. `transform`), import its renderer
 * and add an entry keyed by its type string.
 */
export const nodeTypes: NodeTypes = {
  brokerage:     BrokerageNode,
  __unsupported: UnsupportedNode,
};

export function resolveNodeRenderer(type: string) {
  return nodeTypes[type] ?? UnsupportedNode;
}

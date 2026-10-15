/**
 * Single source of truth for node-type classification.
 *  - EXECUTABLE_NODE_TYPES: what the TwinForge engine can run.
 *  - BROKERAGE_NODE_KINDS: canvas kinds for brokerage flows (view-only).
 *  - RENDERABLE_NODE_TYPES: everything the canvas knows how to draw.
 */

export const EXECUTABLE_NODE_TYPES = [
  'manual_trigger',
  'transform',
  'condition',
  'output',
] as const;
export type ExecutableNodeType = (typeof EXECUTABLE_NODE_TYPES)[number];

export const BROKERAGE_NODE_KINDS = [
  'start',
  'task',
  'approval',
  'decision',
  'end',
] as const;
export type BrokerageNodeKind = (typeof BROKERAGE_NODE_KINDS)[number];

/** Canvas type for every brokerage node. Kind lives in data.kind. */
export const BROKERAGE_NODE_TYPE = 'brokerage' as const;

export const EXECUTABLE_NODE_SET: ReadonlySet<string> = new Set(
  EXECUTABLE_NODE_TYPES,
);
export const BROKERAGE_NODE_KIND_SET: ReadonlySet<string> = new Set(
  BROKERAGE_NODE_KINDS,
);

export const RENDERABLE_NODE_TYPES: readonly string[] = [
  ...EXECUTABLE_NODE_TYPES,
  BROKERAGE_NODE_TYPE,
  '__unsupported',
];
export const RENDERABLE_NODE_SET: ReadonlySet<string> = new Set(
  RENDERABLE_NODE_TYPES,
);

export function isExecutableNodeType(t: string): t is ExecutableNodeType {
  return EXECUTABLE_NODE_SET.has(t);
}
export function isBrokerageKind(k: string): k is BrokerageNodeKind {
  return BROKERAGE_NODE_KIND_SET.has(k);
}

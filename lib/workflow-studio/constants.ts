import type { NodeStatus, Provenance } from './types';

export const NODE_WIDTH = 220;
export const GRID_SIZE = 20;
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 2.5;
export const SNAP_THRESHOLD_PX = 6;

export const STATUS_COLOR: Record<NodeStatus, string> = {
  idle: '#475569',
  running: '#3b82f6',
  success: '#10b981',
  synthetic: '#a855f7',
  manual: '#f59e0b',
  blocked: '#f59e0b',
  failed: '#ef4444',
};

export const STATUS_TEXT: Record<NodeStatus, string> = {
  idle: 'Idle',
  running: 'Running…',
  success: 'Completed',
  synthetic: 'Synthetic result',
  manual: 'Manual observation',
  blocked: 'Integration required',
  failed: 'Failed',
};

export const PROV_COLOR: Record<Provenance, string> = {
  verified: '#10b981',
  manual: '#f59e0b',
  synthetic: '#a855f7',
  blocked: '#ef4444',
  local: '#3b82f6',
  pending: '#334155',
};

export const uid = (): string => Math.random().toString(36).slice(2, 10);
export const randRef = (p: string): string =>
  `${p}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
export const clock = (t: number = Date.now()): string =>
  new Date(t).toLocaleTimeString('en-GB', { hour12: false });
export const clamp = (v: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, v));

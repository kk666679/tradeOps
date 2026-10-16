import type { NodeStatus, Provenance } from '@/types';

export const STATUS_COLOR: Record<NodeStatus, string> = {
  idle: '#475569', running: '#3b82f6', success: '#10b981', synthetic: '#a855f7',
  manual: '#f59e0b', pending: '#06b6d4', blocked: '#ef4444', failed: '#ef4444', skipped: '#475569',
};

export const STATUS_TEXT: Record<NodeStatus, string> = {
  idle: 'Idle', running: 'Running…', success: 'Completed', synthetic: 'Synthetic result',
  manual: 'Manual observation', pending: 'Waiting', blocked: 'Blocked / integration required',
  failed: 'Failed', skipped: 'Not executed',
};

export const PROV_COLOR: Record<Provenance, string> = {
  verified: '#10b981', manual: '#f59e0b', synthetic: '#a855f7', blocked: '#ef4444',
  local: '#3b82f6', pending: '#334155', skipped: '#475569',
};

export const PROV_LEVEL: Record<Provenance, string> = {
  verified: 'INFO', local: 'INFO', synthetic: 'DEBUG', manual: 'WARN', blocked: 'ERR', skipped: 'DEBUG',
};
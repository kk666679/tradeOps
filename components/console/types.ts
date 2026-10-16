import type { ReactNode } from 'react';

export type ConsoleLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERR' | 'LOOP';

export interface ConsoleEntry {
  id: string;
  time: number;
  op: string;
  prov: string;
  msg: string;
  level?: ConsoleLevel;
  loop?: boolean;
  iter?: number;
  runId?: string;
  ref?: string;
  mode?: string;
}

export interface ConsoleCounts {
  INFO: number;
  DEBUG: number;
  WARN: number;
  ERR: number;
  LOOP: number;
  total: number;
}

export interface ConsoleProps {
  entries: ConsoleEntry[];
  running?: boolean;
  onClear?: () => void;
  pinnedId?: string | null;
  onPin?: (id: string | null) => void;
  maxRows?: number;
  title?: string;
  subtitle?: string;
  onOpClick?: (op: string) => void;
  onRowDoubleClick?: (entry: ConsoleEntry) => void;
  className?: string;
  emptyRender?: ReactNode;
}

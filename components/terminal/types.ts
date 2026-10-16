import type { ReactNode } from 'react';

export type CommandGroup =
  | 'workflow'
  | 'declaration'
  | 'graph'
  | 'integration'
  | 'util';

export type LineKind =
  | 'input'
  | 'output'
  | 'info'
  | 'success'
  | 'error'
  | 'warn'
  | 'table';

export interface TerminalLine {
  id: string;
  kind: LineKind;
  text?: string;
  node?: ReactNode;
  time: number;
  source?: string;
}

export interface CommandOutput {
  lines?: Array<string | { kind?: LineKind; text: string } | ReactNode>;
  clear?: boolean;
  silent?: boolean;
  hint?: string;
}

export interface TerminalContext {
  run: () => void;
  pause: () => void;
  isRunning: () => boolean;

  approve: () => boolean;
  openManual: () => void;
  advanceDecl: (target: string) => boolean;
  getDecl: () => {
    id: string;
    status: string;
    historyLength: number;
    pending: string | null;
  };
  listDeclHistory: (limit?: number) => Array<{ at: number; text: string }>;

  listNodes: () => Array<{ id: string; label: string; status: string }>;
  listEdges: () => Array<{
    id: string;
    source: string;
    target: string;
    port: number;
    provenance: string;
  }>;
  wire: (sourceId: string, targetId: string, port: number) => boolean;
  deleteNode: (id: string) => boolean;
  deleteEdge: (id: string) => boolean;
  renameNode: (id: string, label: string) => boolean;
  focusNode: (id: string) => boolean;

  setMode: (m: 'development' | 'manual' | 'production') => void;
  getMode: () => 'development' | 'manual' | 'production';
  getCapabilities: () => string[];
  lookupHSCode: (query: string) => string | null;
  insertHSCode: (code: string) => boolean;

  emit: (op: string, prov: string, msg: string) => void;
}

export interface CommandSpec {
  name: string;
  aliases?: readonly string[];
  usage: string;
  summary: string;
  group: CommandGroup;
  completions?: (args: string[]) => readonly string[];
  hidden?: boolean;
  handler: (
    args: string[],
    ctx: TerminalContext,
  ) => Promise<CommandOutput> | CommandOutput;
}

export interface TerminalProps {
  context: TerminalContext;
  height?: number;
  greeting?: string[];
  onCommand?: (raw: string, spec: CommandSpec | null) => void;
  className?: string;
  showBanner?: boolean;
}

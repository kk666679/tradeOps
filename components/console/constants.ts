import type { ConsoleLevel } from './types';

export const ALL_LEVELS: readonly ConsoleLevel[] = [
  'INFO',
  'DEBUG',
  'WARN',
  'ERR',
  'LOOP',
] as const;

export const PROV_LEVEL: Readonly<Record<string, ConsoleLevel>> = {
  verified: 'INFO',
  local: 'INFO',
  synthetic: 'DEBUG',
  manual: 'WARN',
  blocked: 'ERR',
  skipped: 'DEBUG',
};

export const LEVEL_TEXT: Readonly<Record<ConsoleLevel, string>> = {
  INFO: 'text-[var(--color-blue-2)]',
  DEBUG: 'text-[var(--color-text-4)]',
  WARN: 'text-[var(--color-amber)]',
  ERR: 'text-[var(--color-red)]',
  LOOP: 'text-[var(--color-cyan)]',
};

export const LEVEL_DOT: Readonly<Record<ConsoleLevel, string>> = {
  INFO: 'bg-[var(--color-blue-2)]',
  DEBUG: 'bg-[var(--color-text-4)]',
  WARN: 'bg-[var(--color-amber)]',
  ERR: 'bg-[var(--color-red)]',
  LOOP: 'bg-[var(--color-cyan)]',
};

export const LEVEL_RING: Readonly<Record<ConsoleLevel, string>> = {
  INFO: 'ring-[var(--color-blue-2)]/40',
  DEBUG: 'ring-[var(--color-text-4)]/40',
  WARN: 'ring-[var(--color-amber)]/40',
  ERR: 'ring-[var(--color-red)]/40',
  LOOP: 'ring-[var(--color-cyan)]/40',
};

export const LEVEL_ABBR: Readonly<Record<ConsoleLevel, string>> = {
  INFO: 'INF',
  DEBUG: 'DBG',
  WARN: 'WRN',
  ERR: 'ERR',
  LOOP: 'LOP',
};

export const DEFAULT_MAX_ROWS = 400;

export const DEFAULT_TITLE = 'Console';
export const DEFAULT_SUBTITLE = 'AI · event bus';

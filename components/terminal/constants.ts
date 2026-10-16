import type { LineKind } from './types';

export const LINE_TEXT: Readonly<Record<LineKind, string>> = {
  input: 'text-[var(--color-text)]',
  output: 'text-[var(--color-text-2)]',
  info: 'text-[var(--color-blue-2)]',
  success: 'text-[var(--color-green-2)]',
  error: 'text-[#fca5a5]',
  warn: 'text-[var(--color-amber)]',
  table: 'text-[var(--color-text-2)]',
};

export const LINE_MARK: Readonly<Record<LineKind, string>> = {
  input: '>>>',
  output: '···',
  info: 'i·',
  success: '✓·',
  error: '✗·',
  warn: '!·',
  table: '··',
};

export const PROMPT_SIGIL = '$';

export const HISTORY_LIMIT = 200;

export const DEFAULT_GREETING: readonly string[] = [
  'twinforge shell v1.0 — type `help` for commands',
  'commands: run · status · ls · wire · rm · decl · approve · manual · mode · hs · attach · clear',
];

export const ASCII_BANNER = String.raw`
  ████████╗██╗    ██╗██╗███╗   ██╗███████╗ ██████╗ ██████╗  ██████╗ ███████╗
  ╚══██╔══╝██║    ██║██║████╗  ██║██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
     ██║   ██║ █╗ ██║██║██╔██╗ ██║█████╗  ██║   ██║██████╔╝██║  ███╗█████╗
     ██║   ██║███╗██║██║██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝
     ██║   ╚███╔███╔╝██║██║ ╚████║██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
     ╚═╝    ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
`;

export const SHELL_HEADER = 'twinforge · brokerdesk-shell v1.0';

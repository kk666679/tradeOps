import { LINE_MARK, LINE_TEXT } from './constants';
import type { LineKind } from './types';

const uid = () => Math.random().toString(36).slice(2, 9);

export const newLineId = uid;

export function formatTime(t: number): string {
  return new Date(t).toLocaleTimeString('en-GB', { hour12: false });
}

export function tokenize(raw: string): string[] {
  const out: string[] = [];
  let buf = '';
  let quote: '"' | "'" | null = null;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (quote) {
      if (ch === quote) quote = null;
      else if (ch === '\\' && i + 1 < raw.length) buf += raw[++i];
      else buf += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (/\s/.test(ch)) {
      if (buf.length) {
        out.push(buf);
        buf = '';
      }
      continue;
    }
    buf += ch;
  }
  if (buf.length) out.push(buf);
  return out;
}

export function inferKind(text: string): LineKind {
  const t = text.trimStart();
  if (t.startsWith('✓')) return 'success';
  if (t.startsWith('✗')) return 'error';
  if (t.startsWith('⚠') || t.startsWith('!')) return 'warn';
  if (/error|fail(ed)?|refus|denied|blocked/i.test(t)) return 'error';
  return 'output';
}

export function table(rows: Array<[string, string]>, padTo = 22): string {
  return rows
    .map(([k, v]) => `${k.padEnd(padTo, ' ')}${v}`)
    .join('\n');
}

export function padEnd(s: string, w: number): string {
  return s.length >= w ? s : s + ' '.repeat(w - s.length);
}

export function padStart(s: string, w: number): string {
  return s.length >= w ? s : ' '.repeat(w - s.length) + s;
}

export function joinArgs(args: string[], limit = 4): string {
  if (args.length <= limit) return args.join(' ');
  return `${args.slice(0, limit).join(' ')} … (+${args.length - limit})`;
}

export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export function historyAt(
  history: readonly string[],
  idx: number,
): string | undefined {
  if (idx < 0 || idx >= history.length) return undefined;
  return history[idx];
}

export function toLine(
  value: string | { kind?: LineKind; text: string },
): { kind: LineKind; text: string } {
  if (typeof value === 'string') return { kind: inferKind(value), text: value };
  return { kind: value.kind ?? inferKind(value.text), text: value.text };
}

export { LINE_TEXT, LINE_MARK };

import { PROV_LEVEL } from './constants';
import type { ConsoleEntry, ConsoleLevel } from './types';

export function levelOf(e: ConsoleEntry): ConsoleLevel {
  if (e.loop) return 'LOOP';
  if (e.level) return e.level;
  return PROV_LEVEL[e.prov] ?? 'INFO';
}

export function formatTime(t: number): string {
  return new Date(t).toLocaleTimeString('en-GB', { hour12: false });
}

export function formatFullTime(t: number): string {
  return new Date(t).toISOString();
}

export function matchEntry(e: ConsoleEntry, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    e.op.toLowerCase().includes(q) ||
    e.msg.toLowerCase().includes(q) ||
    (e.ref ?? '').toLowerCase().includes(q) ||
    (e.runId ?? '').toLowerCase().includes(q)
  );
}

export function parseLevels(input: string): Set<ConsoleLevel> | null {
  const parts = input
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
  if (!parts.length) return null;
  const allowed = new Set<ConsoleLevel>(['INFO', 'DEBUG', 'WARN', 'ERR', 'LOOP']);
  const out = new Set<ConsoleLevel>();
  for (const p of parts) if (allowed.has(p as ConsoleLevel)) out.add(p as ConsoleLevel);
  return out.size ? out : null;
}

export function entryToLine(e: ConsoleEntry): string {
  const t = formatTime(e.time);
  const lv = levelOf(e);
  const iter = e.iter != null ? ` iter=${e.iter}` : '';
  const ref = e.ref ? ` ref=${e.ref}` : '';
  return `[${t}] ${lv} [${e.op}]${iter}${ref} ${e.msg}`;
}

export function bufferToText(entries: ConsoleEntry[]): string {
  return entries.map(entryToLine).join('\n');
}

export async function copyLine(e: ConsoleEntry): Promise<void> {
  try {
    await navigator.clipboard?.writeText(entryToLine(e));
  } catch {
    /* clipboard unavailable — silently ignore */
  }
}

export async function copyBuffer(entries: ConsoleEntry[]): Promise<void> {
  try {
    await navigator.clipboard?.writeText(bufferToText(entries));
  } catch {
    /* ignore */
  }
}

export function downloadLog(
  entries: ConsoleEntry[],
  filename = `twinforge-console-${Date.now()}.log`,
): void {
  const blob = new Blob([bufferToText(entries)], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function capBuffer(entries: ConsoleEntry[], max: number): ConsoleEntry[] {
  if (entries.length <= max) return entries;
  const seen = new Set<string>();
  const out: ConsoleEntry[] = [];
  for (const e of entries) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    out.push(e);
    if (out.length >= max) break;
  }
  return out;
}

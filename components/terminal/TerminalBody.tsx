'use client';

import { type RefObject } from 'react';
import TerminalLine from './TerminalLine';
import type { TerminalLine as TerminalLineModel } from './types';

export interface TerminalBodyProps {
  bodyRef: RefObject<HTMLDivElement | null>;
  lines: TerminalLineModel[];
  busy: boolean;
  onCopy?: (text: string) => void;
  className?: string;
}

export default function TerminalBody({
  bodyRef,
  lines,
  busy,
  onCopy,
  className = '',
}: TerminalBodyProps) {
  return (
    <div
      ref={bodyRef}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      className={
        'min-h-0 flex-1 overflow-y-auto px-3 py-2 font-mono text-[11px] ' +
        'leading-[1.55] ' +
        className
      }
    >
      {lines.map((l) => (
        <TerminalLine key={l.id} line={l} onCopy={onCopy} />
      ))}

      {busy && (
        <div className="flex gap-2 text-[var(--color-text-4)]">
          <span className="flex-none select-none">
            {new Date().toLocaleTimeString('en-GB', { hour12: false })}
          </span>
          <span className="w-8 flex-none select-none">···</span>
          <span className="animate-pulse">running…</span>
        </div>
      )}
    </div>
  );
}

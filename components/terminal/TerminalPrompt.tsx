'use client';

import type { RefObject } from 'react';

export interface TerminalPromptProps {
  inputRef: RefObject<HTMLInputElement | null>;
  mode: 'development' | 'manual' | 'production';
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  busy: boolean;
  ghost: string;
}

export default function TerminalPrompt({
  inputRef,
  mode,
  value,
  onChange,
  onKeyDown,
  busy,
  ghost,
}: TerminalPromptProps) {
  const shortMode = mode.slice(0, 3);
  const showGhost = !busy && !!ghost && !!value && value.trim().length > 0;

  return (
    <div className="relative flex flex-none items-center gap-2 border-t border-[var(--color-line)] bg-[#080b10] px-3 py-1.5 font-mono text-[11px]">
      <span className="select-none text-[var(--color-green-2)]">twinforge</span>
      <span className="select-none text-[var(--color-text-4)]">:</span>
      <span className="select-none text-[var(--color-blue-2)]">{shortMode}</span>
      <span className="select-none text-[var(--color-text-4)]">$</span>

      <div className="relative flex-1">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          disabled={busy}
          placeholder={busy ? 'executing…' : 'type a command — try `help`'}
          className={
            'w-full bg-transparent text-[var(--color-text)] outline-none ' +
            'placeholder:text-[var(--color-text-4)] disabled:opacity-60'
          }
          aria-label="terminal input"
        />

        {showGhost && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-[var(--color-text-4)]"
          >
            <span className="invisible">{value}</span>
            <span>{ghost}</span>
          </span>
        )}
      </div>
    </div>
  );
}

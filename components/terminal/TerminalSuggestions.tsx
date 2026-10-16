'use client';

import { useEffect, useMemo, useRef } from 'react';

export interface TerminalSuggestionsProps {
  input: string;
  commandNames: readonly string[];
  onPick: (value: string) => void;
}

export default function TerminalSuggestions({
  input,
  commandNames,
  onPick,
}: TerminalSuggestionsProps) {
  const head = useMemo(() => input.split(/\s+/)[0].toLowerCase(), [input]);
  const hasArgs = useMemo(() => /\s/.test(input.trim()), [input]);

  const matches = useMemo(() => {
    if (!head) return [];
    if (hasArgs) return [];
    return commandNames
      .filter((n) => n.startsWith(head))
      .filter((n) => n !== head)
      .slice(0, 8);
  }, [head, hasArgs, commandNames]);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [matches.length]);

  if (!matches.length) return null;

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label="command suggestions"
      className={
        'flex flex-none flex-wrap gap-1 border-t border-[var(--color-line)] ' +
        'bg-[#0a0e14] px-3 py-1.5 font-mono text-[10.5px]'
      }
    >
      {matches.map((m) => (
        <button
          key={m}
          role="option"
          aria-selected={false}
          onClick={() => onPick(m + ' ')}
          className={
            'rounded border border-[var(--color-line)] px-1.5 py-[2px] ' +
            'text-[var(--color-text-2)] transition-colors ' +
            'hover:border-[var(--color-line-3)] hover:bg-[var(--color-bg-hover)] ' +
            'hover:text-[var(--color-text)]'
          }
        >
          {m}
        </button>
      ))}
    </div>
  );
}

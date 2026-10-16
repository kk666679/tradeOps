'use client';

import { useEffect, useRef, useState } from 'react';
import type { TerminalEntry } from '@/types';
import { clock } from '@/lib/helpers';

interface TerminalPanelProps {
  entries: TerminalEntry[];
  onExecute: (cmd: string) => void;
  onHistory: (dir: 'up' | 'down') => string;
}

export function TerminalPanel({ entries, onExecute, onHistory }: TerminalPanelProps) {
  const [input, setInput] = useState('');
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [entries.length]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        onExecute(input);
        setInput('');
        setHistoryIdx(-1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const v = onHistory('up');
      if (v !== undefined) {
        setInput(v);
        setHistoryIdx((i) => i + 1);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const v = onHistory('down');
      setInput(v || '');
      setHistoryIdx((i) => Math.max(-1, i - 1));
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onExecute('clear');
    }
  };

  return (
    <>
      <div className="terminal-body" ref={bodyRef}>
        {entries.map((e) => (
          <div className={'term-line ' + e.kind} key={e.id}>
            <span className="mr-2 text-[#4b5563]">{clock(e.time)}</span>
            {e.text}
          </div>
        ))}
      </div>
      <div className="term-prompt">
        <span className="ps1">brokerdesk $</span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="type `help` for commands…"
          spellCheck={false}
        />
      </div>
    </>
  );
}

export default TerminalPanel;
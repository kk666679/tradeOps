'use client';

import { ALL_LEVELS, LEVEL_DOT } from './constants';
import type { ConsoleCounts, ConsoleLevel } from './types';

export interface ConsoleFilterChipsProps {
  activeLevels: Set<ConsoleLevel>;
  counts: ConsoleCounts;
  onToggle: (lv: ConsoleLevel) => void;
  onOnly?: (lv: ConsoleLevel) => void;
  className?: string;
}

export default function ConsoleFilterChips({
  activeLevels,
  counts,
  onToggle,
  onOnly,
  className = '',
}: ConsoleFilterChipsProps) {
  return (
    <div className={'flex items-center gap-1 ' + className}>
      {ALL_LEVELS.map((lv) => {
        const on = activeLevels.has(lv);
        const n = counts[lv];
        return (
          <button
            key={lv}
            onClick={() => onToggle(lv)}
            onContextMenu={(e) => {
              if (!onOnly) return;
              e.preventDefault();
              onOnly(lv);
            }}
            title={
              onOnly
                ? `${lv} (${n}) — click to toggle, right-click to show only`
                : `${lv} (${n})`
            }
            className={
              'flex select-none items-center gap-1 rounded-full border px-2 py-[3px] ' +
              'text-[9px] font-bold tracking-wider transition-colors ' +
              (on
                ? 'border-[var(--color-line-3)] bg-[var(--color-bg-panel-2)] text-[var(--color-text)]'
                : 'border-[var(--color-line)] bg-transparent text-[var(--color-text-4)] hover:text-[var(--color-text-2)]')
            }
          >
            <span
              className={
                'inline-block h-1.5 w-1.5 rounded-full ' +
                (on ? LEVEL_DOT[lv] : 'bg-[var(--color-text-4)]')
              }
            />
            {lv}
            <span className="text-[var(--color-text-4)]">{n}</span>
          </button>
        );
      })}
    </div>
  );
}

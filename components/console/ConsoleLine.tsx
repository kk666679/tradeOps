'use client';

import { memo, useCallback } from 'react';
import { LEVEL_RING, LEVEL_TEXT } from './constants';
import { copyLine, formatTime, levelOf } from './utils';
import type { ConsoleEntry } from './types';

export interface ConsoleLineProps {
  entry: ConsoleEntry;
  wrap: boolean;
  pinned: boolean;
  onPin: (id: string | null) => void;
  onOpClick?: (op: string) => void;
  onDoubleClick?: (entry: ConsoleEntry) => void;
}

function ConsoleLineInner({
  entry,
  wrap,
  pinned,
  onPin,
  onOpClick,
  onDoubleClick,
}: ConsoleLineProps) {
  const lv = levelOf(entry);

  const handlePin = useCallback(() => {
    onPin(pinned ? null : entry.id);
  }, [onPin, pinned, entry.id]);

  const handleDouble = useCallback(() => {
    if (onDoubleClick) onDoubleClick(entry);
    else void copyLine(entry);
  }, [onDoubleClick, entry]);

  const handleOpClick = useCallback(
    (e: React.MouseEvent) => {
      if (!onOpClick) return;
      e.stopPropagation();
      onOpClick(entry.op);
    },
    [onOpClick, entry.op],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={pinned}
      onClick={handlePin}
      onDoubleClick={handleDouble}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePin();
        }
      }}
      title="Click to pin · Double-click to copy"
      className={
        'group flex gap-2 rounded px-1 py-[1px] outline-none transition-colors ' +
        (wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-nowrap') +
        ' cursor-pointer ' +
        (pinned
          ? 'bg-[var(--color-bg-selected)] ring-1 ' + LEVEL_RING[lv]
          : 'hover:bg-[var(--color-bg-hover)] focus-visible:bg-[var(--color-bg-hover)]')
      }
    >
      <span className="flex-none select-none text-[var(--color-text-4)]">
        {formatTime(entry.time)}
      </span>

      <span
        className={
          'w-10 flex-none select-none font-semibold ' + LEVEL_TEXT[lv]
        }
      >
        {lv}
      </span>

      <span
        onClick={handleOpClick}
        className={
          'flex-none select-none text-[var(--color-text-4)] ' +
          (onOpClick
            ? 'cursor-pointer hover:text-[var(--color-blue-2)] hover:underline decoration-dotted'
            : '')
        }
        title={onOpClick ? `Filter by op: ${entry.op}` : entry.op}
      >
        [{entry.op}]
      </span>

      <span className="text-[var(--color-text-2)]">{entry.msg}</span>

      {entry.iter != null && (
        <span className="flex-none select-none text-[var(--color-cyan)]">
          iter {entry.iter}
        </span>
      )}

      {entry.ref && (
        <span className="flex-none select-none font-mono text-[10px] text-[var(--color-text-4)]">
          {entry.ref}
        </span>
      )}

      <span
        className={
          'ml-auto flex flex-none items-center gap-1 opacity-0 transition-opacity ' +
          'group-hover:opacity-100 group-focus-within:opacity-100'
        }
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            void copyLine(entry);
          }}
          title="Copy line"
          className="rounded px-1 text-[10px] text-[var(--color-text-4)] hover:bg-[var(--color-bg-panel-3)] hover:text-[var(--color-text)]"
        >
          copy
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPin(pinned ? null : entry.id);
          }}
          title={pinned ? 'Unpin' : 'Pin'}
          className={
            'rounded px-1 text-[10px] hover:bg-[var(--color-bg-panel-3)] ' +
            (pinned
              ? 'text-[var(--color-blue-2)]'
              : 'text-[var(--color-text-4)] hover:text-[var(--color-text)]')
          }
        >
          {pinned ? 'unpin' : 'pin'}
        </button>
      </span>
    </div>
  );
}

const ConsoleLine = memo(ConsoleLineInner);
ConsoleLine.displayName = 'ConsoleLine';

export default ConsoleLine;

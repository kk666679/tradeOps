'use client';

import { memo } from 'react';
import { LINE_MARK, LINE_TEXT } from './constants';
import { formatTime } from './utils';
import type { LineKind, TerminalLine as TerminalLineModel } from './types';

export interface TerminalLineProps {
  line: TerminalLineModel;
  onCopy?: (text: string) => void;
}

function lineText(l: TerminalLineModel): string {
  return typeof l.text === 'string' ? l.text : '';
}

function TerminalLineInner({ line, onCopy }: TerminalLineProps) {
  const kind: LineKind = line.kind;
  const text = lineText(line);

  return (
    <div
      className="group flex gap-2 rounded px-1 py-[1px] hover:bg-[var(--color-bg-hover)]"
      data-line-kind={kind}
    >
      <span className="flex-none select-none text-[var(--color-text-4)]">
        {formatTime(line.time)}
      </span>
      <span
        className={
          'w-8 flex-none select-none font-semibold ' +
          (kind === 'input'
            ? 'text-[var(--color-green-2)]'
            : 'text-[var(--color-text-4)]')
        }
      >
        {LINE_MARK[kind]}
      </span>
      <span
        className={
          'whitespace-pre-wrap break-words ' + LINE_TEXT[kind]
        }
      >
        {line.node ?? text}
      </span>
      {onCopy && text && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy(text);
          }}
          className={
            'ml-auto flex-none self-start rounded px-1 text-[9.5px] text-[var(--color-text-4)] ' +
            'opacity-0 transition-opacity hover:bg-[var(--color-bg-panel-3)] ' +
            'hover:text-[var(--color-text)] group-hover:opacity-100'
          }
          title="Copy line"
        >
          copy
        </button>
      )}
    </div>
  );
}

const TerminalLine = memo(TerminalLineInner);
TerminalLine.displayName = 'TerminalLine';

export default TerminalLine;

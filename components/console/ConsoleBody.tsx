'use client';

import { type RefObject } from 'react';
import ConsoleEmpty from './ConsoleEmpty';
import ConsoleLine from './ConsoleLine';
import type { ConsoleEntry } from './types';

export interface ConsoleBodyProps {
  bodyRef: RefObject<HTMLDivElement | null>;
  entries: ConsoleEntry[];
  totalCount: number;
  wrap: boolean;
  pinnedId: string | null;
  onPin: (id: string | null) => void;
  onOpClick?: (op: string) => void;
  onRowDoubleClick?: (entry: ConsoleEntry) => void;
  onResetFilters?: () => void;
  emptyRender?: React.ReactNode;
  className?: string;
}

export default function ConsoleBody({
  bodyRef,
  entries,
  totalCount,
  wrap,
  pinnedId,
  onPin,
  onOpClick,
  onRowDoubleClick,
  onResetFilters,
  emptyRender,
  className = '',
}: ConsoleBodyProps) {
  const isEmpty = entries.length === 0;

  return (
    <div
      ref={bodyRef}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      className={
        'min-h-0 flex-1 overflow-y-auto bg-[#080b10] px-3 py-1.5 font-mono ' +
        'text-[10.5px] leading-[1.65] ' +
        className
      }
    >
      {isEmpty ? (
        <ConsoleEmpty
          filtered={totalCount > 0}
          total={totalCount}
          onReset={onResetFilters}
        >
          {emptyRender}
        </ConsoleEmpty>
      ) : (
        entries.map((e) => (
          <ConsoleLine
            key={e.id}
            entry={e}
            wrap={wrap}
            pinned={pinnedId === e.id}
            onPin={onPin}
            onOpClick={onOpClick}
            onDoubleClick={onRowDoubleClick}
          />
        ))
      )}
    </div>
  );
}

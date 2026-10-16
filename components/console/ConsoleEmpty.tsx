'use client';

import type { ReactNode } from 'react';

export interface ConsoleEmptyProps {
  filtered: boolean;
  total: number;
  onReset?: () => void;
  children?: ReactNode;
}

export default function ConsoleEmpty({
  filtered,
  total,
  onReset,
  children,
}: ConsoleEmptyProps) {
  if (children) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-[var(--color-text-4)]">
      <div className="text-[11px]">
        {total === 0
          ? 'No events yet. Run the workflow to populate the bus.'
          : 'No events match the current filter.'}
      </div>
      {filtered && onReset && (
        <button
          onClick={onReset}
          className={
            'rounded border border-[var(--color-line-2)] px-2 py-1 text-[10.5px] ' +
            'text-[var(--color-text-2)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text)]'
          }
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

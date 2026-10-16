'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ConsoleBody from './ConsoleBody';
import ConsoleFilterChips from './ConsoleFilterChips';
import ConsoleSearch from './ConsoleSearch';
import ConsoleStatusPill from './ConsoleStatusPill';
import ConsoleToolbar from './ConsoleToolbar';
import { DEFAULT_MAX_ROWS, DEFAULT_SUBTITLE, DEFAULT_TITLE } from './constants';
import {
  useAutoScroll,
  useConsoleBuffer,
  useConsoleFilter,
} from './hooks';
import { copyBuffer, downloadLog } from './utils';
import type { ConsoleProps } from './types';

export default function Console({
  entries,
  running = false,
  onClear,
  pinnedId = null,
  onPin,
  maxRows = DEFAULT_MAX_ROWS,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  onOpClick,
  onRowDoubleClick,
  className = '',
  emptyRender,
}: ConsoleProps) {
  const [wrap, setWrap] = useState(true);

  const buffer = useConsoleBuffer(entries, maxRows);
  const filter = useConsoleFilter(buffer);

  const { ref: bodyRef, autoScroll, toggle: toggleAutoScroll } = useAutoScroll(
    filter.filtered.length,
  );

  const [localPin, setLocalPin] = useState<string | null>(pinnedId);
  useEffect(() => setLocalPin(pinnedId), [pinnedId]);

  const handlePin = useCallback(
    (id: string | null) => {
      if (onPin) onPin(id);
      else setLocalPin(id);
    },
    [onPin],
  );

  const handleOpClick = useCallback(
    (op: string) => {
      if (onOpClick) onOpClick(op);
      else filter.setQuery(op);
    },
    [onOpClick, filter],
  );

  const handleDownload = useCallback(() => {
    downloadLog(filter.filtered);
  }, [filter.filtered]);

  const handleCopyAll = useCallback(() => {
    void copyBuffer(filter.filtered);
  }, [filter.filtered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() !== 'l') return;
      const t = e.target as HTMLElement | null;
      const inConsole = t?.closest('[data-tf-console]');
      if (!inConsole) return;
      e.preventDefault();
      if (onClear) onClear();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClear]);

  const headerCount = useMemo(() => {
    const shown = filter.filtered.length;
    const total = filter.counts.total;
    if (shown === total) return `${total} events`;
    return `${shown}/${total} shown`;
  }, [filter.filtered.length, filter.counts.total]);

  return (
    <div
      data-tf-console
      className={
        'flex min-h-0 flex-col border-t border-[var(--color-line)] ' +
        'bg-[var(--color-bg-chrome)] ' +
        className
      }
    >
      <div className="flex flex-none items-center gap-3 border-b border-[var(--color-line)] px-3 py-1.5 text-[10.5px]">
        <span className="font-bold uppercase tracking-[.08em] text-[var(--color-text-2)]">
          {title}
        </span>
        <span className="text-[var(--color-text-4)]">{subtitle}</span>

        <ConsoleFilterChips
          activeLevels={filter.activeLevels}
          counts={filter.counts}
          onToggle={filter.toggleLevel}
          onOnly={filter.setOnlyLevel}
        />

        <ConsoleSearch
          value={filter.query}
          onChange={filter.setQuery}
          hint="/"
        />

        <div className="flex-1" />

        <span className="hidden text-[10px] text-[var(--color-text-4)] sm:inline">
          {headerCount}
        </span>

        <ConsoleToolbar
          wrap={wrap}
          onToggleWrap={() => setWrap((w) => !w)}
          autoScroll={autoScroll}
          onToggleAutoScroll={toggleAutoScroll}
          onDownload={handleDownload}
          onCopyAll={handleCopyAll}
          onClear={onClear}
          visibleCount={filter.filtered.length}
        />

        <ConsoleStatusPill running={running} />
      </div>

      <ConsoleBody
        bodyRef={bodyRef}
        entries={filter.filtered}
        totalCount={filter.counts.total}
        wrap={wrap}
        pinnedId={onPin ? pinnedId : localPin}
        onPin={handlePin}
        onOpClick={handleOpClick}
        onRowDoubleClick={onRowDoubleClick}
        onResetFilters={filter.hasFilters ? filter.clearFilters : undefined}
        emptyRender={emptyRender}
      />
    </div>
  );
}

'use client';

export interface ConsoleToolbarProps {
  wrap: boolean;
  onToggleWrap: () => void;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
  onDownload: () => void;
  onClear?: () => void;
  onCopyAll: () => void;
  visibleCount: number;
}

export default function ConsoleToolbar({
  wrap,
  onToggleWrap,
  autoScroll,
  onToggleAutoScroll,
  onDownload,
  onClear,
  onCopyAll,
  visibleCount,
}: ConsoleToolbarProps) {
  const empty = visibleCount === 0;

  const baseBtn =
    'rounded px-1.5 py-1 text-[10px] font-semibold transition-colors ' +
    'disabled:opacity-40 disabled:cursor-not-allowed';

  const toggle = (on: boolean) =>
    on
      ? 'bg-[var(--color-bg-active)] text-[var(--color-text)]'
      : 'text-[var(--color-text-3)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text)]';

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onToggleWrap}
        title="Toggle soft wrap"
        className={baseBtn + ' ' + toggle(wrap)}
      >
        wrap
      </button>
      <button
        onClick={onToggleAutoScroll}
        title="Toggle autoscroll"
        className={baseBtn + ' ' + toggle(autoScroll)}
      >
        auto
      </button>
      <button
        onClick={onCopyAll}
        disabled={empty}
        title="Copy visible buffer"
        className={
          baseBtn +
          ' text-[var(--color-text-3)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text)]'
        }
      >
        copy
      </button>
      <button
        onClick={onDownload}
        disabled={empty}
        title="Download as .log"
        className={
          baseBtn +
          ' text-[var(--color-text-3)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text)]'
        }
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      </button>
      <button
        onClick={onClear}
        disabled={!onClear}
        title="Clear buffer"
        className={
          baseBtn +
          ' text-[var(--color-text-3)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-red)]'
        }
      >
        clear
      </button>
    </div>
  );
}

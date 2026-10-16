'use client';

export interface TerminalHeaderProps {
  title?: string;
  subtitle?: string;
  running: boolean;
  onClear: () => void;
  onExport: () => void;
}

export default function TerminalHeader({
  title = 'Terminal',
  subtitle = 'twinforge-shell · bash-like',
  running,
  onClear,
  onExport,
}: TerminalHeaderProps) {
  const baseBtn =
    'rounded px-1.5 py-1 text-[10px] font-semibold transition-colors ' +
    'text-[var(--color-text-3)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text)]';

  return (
    <div className="flex flex-none items-center gap-2 border-b border-[var(--color-line)] px-3 py-1.5 text-[10.5px]">
      <span className="font-bold uppercase tracking-[.08em] text-[var(--color-text-2)]">
        {title}
      </span>
      <span className="text-[var(--color-text-4)]">{subtitle}</span>

      <div className="flex-1" />

      <span className="hidden text-[10px] text-[var(--color-text-4)] md:inline">
        ↑↓ history · Tab complete · Ctrl+L clear · Ctrl+C cancel
      </span>

      <button onClick={onExport} title="Download transcript" className={baseBtn}>
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
        title="Clear transcript (Ctrl+L)"
        className={
          baseBtn + ' hover:text-[var(--color-red)]'
        }
      >
        clear
      </button>

      <span
        className={
          'flex items-center gap-1.5 text-[10px] font-semibold ' +
          (running
            ? 'text-[var(--color-blue-2)]'
            : 'text-[var(--color-green-2)]')
        }
      >
        <span
          className={
            'inline-block h-[7px] w-[7px] rounded-full ' +
            (running
              ? 'animate-pulse bg-[var(--color-blue-2)] shadow-[0_0_6px_var(--color-blue-2)]'
              : 'bg-[var(--color-green)] shadow-[0_0_6px_var(--color-green)]')
          }
        />
        {running ? 'RUNNING' : 'READY'}
      </span>
    </div>
  );
}

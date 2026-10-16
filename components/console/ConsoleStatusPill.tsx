'use client';

export interface ConsoleStatusPillProps {
  running: boolean;
  label?: string;
  className?: string;
}

export default function ConsoleStatusPill({
  running,
  label,
  className = '',
}: ConsoleStatusPillProps) {
  return (
    <span
      className={
        'flex items-center gap-1.5 text-[10px] font-semibold ' +
        (running
          ? 'text-[var(--color-blue-2)]'
          : 'text-[var(--color-green-2)]') +
        ' ' +
        className
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
      {label ?? (running ? 'RUNNING' : 'LIVE')}
    </span>
  );
}

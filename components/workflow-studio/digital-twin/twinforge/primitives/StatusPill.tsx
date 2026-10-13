type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'muted' | 'violet';

const TONES: Record<Tone, string> = {
  ok:      'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  warn:    'bg-amber-500/15 text-amber-300 border-amber-500/30',
  danger:  'bg-red-500/15 text-red-300 border-red-500/30',
  info:    'bg-blue-500/15 text-blue-300 border-blue-500/30',
  muted:   'bg-slate-800 text-slate-400 border-slate-700',
  violet:  'bg-violet-500/15 text-violet-300 border-violet-500/30',
};

export function StatusPill({
  tone = 'muted', children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

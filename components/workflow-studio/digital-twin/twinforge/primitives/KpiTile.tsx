import type { KpiSnapshot } from '@/lib/twinforge/types';

const TREND_GLYPH = { up: '▲', down: '▼', flat: '●' } as const;
const TREND_COLOR = {
  up: 'text-emerald-400',
  down: 'text-blue-400',
  flat: 'text-slate-500',
} as const;

export function KpiTile({ kpi }: { kpi: KpiSnapshot }) {
  const onTarget =
    kpi.trend === 'down'
      ? kpi.value <= kpi.target
      : kpi.value >= kpi.target;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {kpi.label}
        </span>
        <span
          className={`text-[10px] font-bold ${TREND_COLOR[kpi.trend]}`}
          title={kpi.trend}
        >
          {TREND_GLYPH[kpi.trend]}
        </span>
      </div>

      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="font-mono text-2xl font-semibold tabular-nums text-slate-100">
          {kpi.value}
        </span>
        <span className="text-[11px] text-slate-500">{kpi.unit}</span>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <span className={`text-[10px] ${onTarget ? 'text-emerald-400' : 'text-amber-400'}`}>
          {onTarget ? '✓ on target' : '△ off target'}
        </span>
        <span className="text-[10px] text-slate-600 tabular-nums">
          target {kpi.target}{kpi.unit}
        </span>
      </div>

      <p className="mt-1.5 text-[10px] text-slate-500 leading-relaxed">
        {kpi.note}
      </p>
    </div>
  );
}

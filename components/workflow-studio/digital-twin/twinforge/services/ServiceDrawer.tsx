'use client';

import {
  useTwinForgeStore,
  selectSelectedService,
} from '../store/useTwinForgeStore';
import { StatusPill } from '../primitives/StatusPill';

export function ServiceDrawer() {
  const svc = useTwinForgeStore(selectSelectedService);
  const clear = useTwinForgeStore((s) => s.selectService);

  if (!svc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
      onClick={() => clear(null)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-slate-800 bg-slate-950 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] text-violet-300">{svc.code}</span>
            <h2 className="mt-1 text-base font-semibold text-slate-100">{svc.name}</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              {svc.summary}
            </p>
          </div>
          <button
            onClick={() => clear(null)}
            className="rounded p-1 text-slate-500 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <dl className="mt-5 space-y-4 text-[11px]">
          <Row label="Layer">
            <StatusPill tone="violet">{svc.layer}</StatusPill>
          </Row>
          <Row label="Maturity">
            <StatusPill tone={svc.maturity === 'ga' ? 'ok' : 'info'}>
              {svc.maturity}
            </StatusPill>
          </Row>
          <Row label="SLA">{svc.sla}</Row>
          <Row label="Tags">
            <div className="flex flex-wrap gap-1">
              {svc.tags.map((t) => (
                <span
                  key={t}
                  className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-slate-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </Row>
          <Row label="Deliverables">
            <ul className="mt-1 space-y-1">
              {svc.deliverables.map((d) => (
                <li key={d} className="flex items-center gap-2 text-slate-300">
                  <span className="text-violet-400">◆</span>{d}
                </li>
              ))}
            </ul>
          </Row>
        </dl>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-slate-200">{children}</dd>
    </div>
  );
}

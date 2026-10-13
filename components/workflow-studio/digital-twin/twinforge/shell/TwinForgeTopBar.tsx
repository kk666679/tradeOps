'use client';

import { useTwinForgeStore } from '../store/useTwinForgeStore';

export function TwinForgeTopBar() {
  const query = useTwinForgeStore((s) => s.filters.query);
  const setFilter = useTwinForgeStore((s) => s.setFilter);
  const toggleSidebar = useTwinForgeStore((s) => s.toggleSidebar);

  return (
    <header className="flex h-14 flex-none items-center gap-3 border-b border-slate-800 bg-slate-950 px-4">
      <button
        onClick={toggleSidebar}
        className="rounded px-2 py-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        title="Toggle sidebar"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-violet-500 to-cyan-400 text-[11px] font-bold text-white">
          TF
        </div>
        <div>
          <div className="text-[13.5px] font-semibold leading-tight text-slate-100">
            TwinForge Studio
          </div>
          <div className="text-[9px] tracking-[0.15em] text-slate-500">
            DIGITAL TWIN · INFRASTRUCTURE · AS-A-SERVICE
          </div>
        </div>
      </div>

      <div className="ml-4 max-w-md flex-1">
        <input
          value={query}
          onChange={(e) => setFilter('query', e.target.value)}
          placeholder="Search services, tenants, labs, apps…"
          className="w-full rounded border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-600 focus:border-violet-500"
        />
      </div>

      <div className="flex-1" />

      <span className="hidden rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 sm:inline">
        ● Subscription Active
      </span>

      <span className="hidden rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 md:inline">
        SLA 99.5%
      </span>
    </header>
  );
}

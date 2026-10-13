'use client';

import {
  useDigitalTwinStore,
  selectActiveScenario,
} from '../store/useDigitalTwinStore';

export function DigitalTwinTopBar() {
  const mode = useDigitalTwinStore((s) => s.mode);
  const scenario = useDigitalTwinStore(selectActiveScenario);
  const toggleSidebar = useDigitalTwinStore((s) => s.toggleSidebar);
  const toggleDock = useDigitalTwinStore((s) => s.toggleDock);

  const modeTone =
    mode === 'running' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    : mode === 'paused' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    : mode === 'error' ? 'bg-red-500/20 text-red-300 border-red-500/40'
    : 'bg-slate-800 text-slate-400 border-slate-700';

  return (
    <header className="h-[52px] flex items-center gap-3 px-4 border-b border-slate-800 bg-slate-950">
      <button
        onClick={toggleSidebar}
        className="px-2 py-1 rounded text-slate-400 hover:bg-slate-800 hover:text-white"
        title="Toggle sidebar"
      >
        ☰
      </button>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-purple-500 grid place-items-center text-white text-xs font-bold">
          DT
        </div>
        <div>
          <div className="text-[13.5px] font-semibold text-slate-100 leading-tight">
            Digital Twin Studio
          </div>
          <div className="text-[9px] tracking-wider text-slate-500">
            {scenario ? scenario.name.toUpperCase() : 'NO SCENARIO'}
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <button
        onClick={toggleDock}
        className="px-3 py-1.5 rounded text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700"
      >
        Toggle Dock
      </button>

      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${modeTone}`}>
        {mode}
      </span>
    </header>
  );
}

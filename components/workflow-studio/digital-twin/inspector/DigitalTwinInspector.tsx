'use client';

import { useDigitalTwinStore } from '../store/useDigitalTwinStore';
import type { TwinTab } from '@/lib/digital-twin/types';
import { TwinTaskInspector } from '../tasks/TwinTaskInspector';
import { TwinReasoning } from '../reasoning/TwinReasoning';
import { TwinLiveMetrics } from '../live/TwinLiveMetrics';
import { TwinEventFeed } from '../live/TwinEventFeed';
import { TwinRunHistory } from '../simulation/TwinRunHistory';

const TABS: Array<{ id: TwinTab; label: string; icon: string }> = [
  { id: 'properties', label: 'Props',      icon: '⚙' },
  { id: 'reasoning',  label: 'Reasoning',  icon: '🧠' },
  { id: 'live',       label: 'Live',       icon: '📡' },
  { id: 'simulation', label: 'Sim',        icon: '🧪' },
];

export function DigitalTwinInspector() {
  const open = useDigitalTwinStore((s) => s.inspectorOpen);
  const tab = useDigitalTwinStore((s) => s.activeTab);
  const setTab = useDigitalTwinStore((s) => s.setActiveTab);
  const toggle = useDigitalTwinStore((s) => s.toggleInspector);

  if (!open) {
    return (
      <button
        onClick={toggle}
        className="w-8 border-l border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
        title="Expand inspector"
      >
        ‹
      </button>
    );
  }

  return (
    <aside className="w-[360px] flex flex-col border-l border-slate-800 bg-slate-950 min-h-0">
      <div className="flex items-center border-b border-slate-800 bg-slate-900/60">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-2 py-2.5 text-[10px] font-bold uppercase tracking-wide border-b-2 transition ${
              tab === t.id
                ? 'text-blue-300 border-blue-500 bg-slate-800/60'
                : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        ))}
        <button
          onClick={toggle}
          className="px-2 py-2 text-slate-500 hover:text-white"
          title="Collapse inspector"
        >
          ›
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {tab === 'properties' && <TwinTaskInspector />}
        {tab === 'reasoning'  && <TwinReasoning />}
        {tab === 'live'       && (
          <>
            <TwinLiveMetrics />
            <div className="border-t border-slate-800">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Event Feed
              </div>
              <TwinEventFeed />
            </div>
          </>
        )}
        {tab === 'simulation' && (
          <>
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-500 border-b border-slate-800">
              Run History
            </div>
            <TwinRunHistory />
          </>
        )}
      </div>
    </aside>
  );
}

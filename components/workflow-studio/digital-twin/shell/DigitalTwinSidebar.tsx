'use client';

import { useState } from 'react';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';
import { TwinBondedLayer } from '../zones/TwinBondedLayer';
import { TwinFczLayer } from '../zones/TwinFczLayer';
import { TwinMovementLayer } from '../zones/TwinMovementLayer';
import { TwinTaskQueue } from '../tasks/TwinTaskQueue';

type LayerId = 'tasks' | 'bonded' | 'fcz' | 'movement';

const LAYERS: Array<{ id: LayerId; label: string }> = [
  { id: 'tasks',    label: 'Tasks' },
  { id: 'bonded',   label: 'Bonded' },
  { id: 'fcz',      label: 'FCZ' },
  { id: 'movement', label: 'Movement' },
];

export function DigitalTwinSidebar({ zoneId }: { zoneId: string }) {
  const open = useDigitalTwinStore((s) => s.sidebarOpen);
  const [active, setActive] = useState<LayerId>('tasks');

  if (!open) return null;

  return (
    <aside className="w-[300px] flex-none border-r border-slate-800 bg-slate-950 flex flex-col min-h-0">
      <nav className="flex overflow-x-auto border-b border-slate-800 bg-slate-900/50">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => setActive(l.id)}
            className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wide whitespace-nowrap border-b-2 transition ${
              active === l.id
                ? 'text-blue-300 border-blue-500 bg-slate-800/60'
                : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            {l.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto p-3">
        {active === 'tasks'    && <TwinTaskQueue />}
        {active === 'bonded'   && <TwinBondedLayer   zoneId={zoneId} />}
        {active === 'fcz'      && <TwinFczLayer      zoneId={zoneId} />}
        {active === 'movement' && <TwinMovementLayer zoneId={zoneId} />}
      </div>
    </aside>
  );
}

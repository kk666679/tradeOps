'use client';

import type { Capability, IntegrationMode, LibraryDef } from '@/types';
import { NODE_LIBRARY, GROUPS } from '@/constants/nodeLibrary';

export interface NodesPaletteProps {
  supported: Capability[];
  mode: IntegrationMode;
  onAddNode: (def: LibraryDef) => void;
  onDragStart: (e: React.DragEvent, def: LibraryDef) => void;
}

export default function NodesPalette({ supported, mode, onAddNode, onDragStart }: NodesPaletteProps) {
  return (
    <div className="border-b border-[#1f2937] p-2.5">
      <div className="mb-2 text-[10.5px] leading-relaxed text-[#4b5563]">
        Drag any node onto the canvas, or click to add at a default position.
      </div>

      {GROUPS.map((g) => (
        <div key={g} className="mb-2.5">
          <h5 className="mx-0.5 mb-1.5 mt-2 text-[9.5px] font-extrabold uppercase tracking-widest text-[#4b5563]">{g}</h5>
          {NODE_LIBRARY.filter((d) => d.group === g).map((d) => {
            const avail = !d.requires || supported.includes(d.requires);
            return (
              <button key={d.type}
                draggable
                onDragStart={(e) => onDragStart(e, d)}
                onClick={() => onAddNode(d)}
                title={avail ? (d.help || d.label) : `Unavailable in ${mode} mode`}
                className={
                  'mb-1.5 block w-full cursor-grab rounded border border-[#1f2937] bg-[#131921] px-2 py-[7px] text-left text-[11px] font-medium transition active:cursor-grabbing hover:border-[#374151] hover:bg-[#1f2731] ' +
                  (avail ? '' : 'opacity-50')
                }>
                {d.label}
                <small className={'mt-0.5 block text-[9px] font-semibold tracking-wide ' + (avail ? 'text-[#4b5563]' : 'text-[#fca5a5]')}>
                  {d.requires
                    ? (avail ? 'capability: ' + d.requires : 'unavailable · ' + d.requires)
                    : d.human ? 'human approval'
                    : d.kind === 'gate' ? 'loop control · 2 outputs'
                    : d.sideEffect ? 'external side-effect'
                    : 'local operation'}
                </small>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
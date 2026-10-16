'use client';

import type { StudioEvent } from '@/types';
import { PROV_LEVEL } from '@/constants/palettes';
import { clock } from '@/lib/helpers';

export interface ConsolePanelProps {
  events: StudioEvent[];
  running: boolean;
}

export default function ConsolePanel({ events, running }: ConsolePanelProps) {
  return (
    <div className="flex min-h-0 flex-col border-t border-[#1f2937] bg-[#0a0e14]">
      <div className="flex flex-none items-center gap-2 border-b border-[#1f2937] px-2.5 py-1 text-[10.5px] text-[#6b7280]">
        <span className="font-bold uppercase tracking-wider text-[#9ca3af]">Console</span>
        <span className="text-[#4b5563]">AI · event bus</span>
        <div className="flex-1" />
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#34d399]">
          <span className="h-[7px] w-[7px] rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
          {running ? 'RUNNING' : 'LIVE'}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[#080b10] px-3 py-1.5 font-mono text-[10.5px] leading-[1.6] text-[#9ca3af]">
        {events.slice(0, 100).map((e) => {
          const level = e.loop ? 'LOOP' : (PROV_LEVEL[e.prov as keyof typeof PROV_LEVEL] || 'INFO');
          const levelCls =
            level === 'INFO' ? 'text-[#60a5fa]'
            : level === 'DEBUG' ? 'text-[#4b5563]'
            : level === 'WARN' ? 'text-amber-500'
            : level === 'ERR' ? 'text-red-500'
            : 'text-cyan-500';
          return (
            <div key={e.id} className="flex gap-2 whitespace-pre-wrap break-words">
              <span className="flex-none text-[#4b5563]">{clock(e.time)}</span>
              <span className={`w-[38px] flex-none font-semibold ${levelCls}`}>{level}</span>
              <span>[{e.op}] {e.msg}</span>
            </div>
          );
        })}
        {events.length === 0 && <div className="text-[#4b5563]">No events yet.</div>}
      </div>
    </div>
  );
}
'use client';

import type { IntegrationMode, StudioEvent } from '@/types';
import { clock } from '@/lib/helpers';

export interface AuditPanelProps {
  events: StudioEvent[];
  mode: IntegrationMode;
}

function auditClass(a: StudioEvent): string {
  if (a.loop) return 'border-l-cyan-500';
  if (a.prov === 'synthetic') return 'border-l-purple-500';
  if (a.prov === 'manual') return 'border-l-amber-500';
  if (a.prov === 'verified') return 'border-l-emerald-500';
  if (a.prov === 'blocked') return 'border-l-red-500';
  return 'border-l-blue-500';
}

export default function AuditPanel({ events, mode }: AuditPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-2.5">
      <div className="mb-2 rounded-lg border border-[#1f2937] bg-[#0f1830] p-2.5">
        <h5 className="mb-2 text-[9.5px] font-extrabold uppercase tracking-widest text-[#4b5563]">Audit Trail</h5>
        <div className="flex justify-between py-1 text-[11px]">
          <span className="text-[#6b7280]">Events</span><span className="font-semibold">{events.length}</span>
        </div>
        <div className="flex justify-between py-1 text-[11px]">
          <span className="text-[#6b7280]">Persistent storage</span><span className="font-semibold">no</span>
        </div>
        <div className="flex justify-between py-1 text-[11px]">
          <span className="text-[#6b7280]">Append-only</span><span className="font-semibold">in memory</span>
        </div>
      </div>

      {events.map((a) => (
        <div key={a.id}
          className={'my-1 rounded-r border-l-2 bg-[#0b1424] px-2 py-1.5 text-[10.5px] break-words ' + auditClass(a)}>
          <div>
            <span className="font-semibold text-[#cbd5e1]">{a.op}</span>
            <span className="ml-1.5 text-[9.5px] text-[#4b5563]">
              {clock(a.time)} · {a.mode || mode} · {a.prov}
            </span>
          </div>
          <div className="mt-0.5 leading-snug text-[#9ca3af]">{a.msg}</div>
        </div>
      ))}
    </div>
  );
}
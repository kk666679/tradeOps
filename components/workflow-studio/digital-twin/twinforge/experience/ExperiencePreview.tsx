'use client';

import { Card } from '../primitives/Card';
import { StatusPill } from '../primitives/StatusPill';

const CHANNELS = [
  { id: 'web',       name: 'Web Dashboard',        status: 'ga'       as const, note: 'Command centre · real-time KPIs' },
  { id: 'gis',       name: 'GIS Reality Overlay',  status: 'ga'       as const, note: '3D tiles · building + asset layers' },
  { id: 'xr',        name: 'XR Command Bridge',    status: 'preview'  as const, note: 'VR/AR · NVIDIA Omniverse / Unity' },
  { id: 'mobile',    name: 'Field Mobile App',     status: 'ga'       as const, note: 'Inspections · photo capture · offline' },
  { id: 'voice',     name: 'Voice Ops Console',    status: 'beta'     as const, note: 'Hands-free incident triage' },
  { id: 'bi',        name: 'BI Embed',             status: 'ga'       as const, note: 'Power BI / Grafana embedded' },
];

export function ExperiencePreview() {
  return (
    <Card
      title="Experience Surfaces"
      subtitle="Multi-channel access to the twin"
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CHANNELS.map((c) => (
          <div
            key={c.id}
            className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-[12px] font-semibold text-slate-100">
                {c.name}
              </div>
              <StatusPill tone={c.status === 'ga' ? 'ok' : c.status === 'preview' ? 'info' : 'warn'}>
                {c.status}
              </StatusPill>
            </div>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-slate-500">
              {c.note}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

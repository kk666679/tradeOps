'use client';

import { useDigitalTwinStore } from '../store/useDigitalTwinStore';

const SEVERITY_TONE: Record<string, string> = {
  info:     'text-slate-400',
  warn:     'text-amber-400',
  error:    'text-red-400',
  critical: 'text-red-500 font-bold',
};

export function TwinEventFeed({ limit = 30 }: { limit?: number }) {
  const events = useDigitalTwinStore((s) => s.events);
  const selectNode = useDigitalTwinStore((s) => s.selectNode);

  if (events.length === 0) {
    return (
      <p className="p-3 text-[11px] text-slate-500">
        No events yet. Start a run to see live activity.
      </p>
    );
  }

  return (
    <ol className="space-y-1 p-2" role="log" aria-live="polite">
      {events.slice(0, limit).map((e) => (
        <li
          key={e.id}
          className="text-[11px] flex gap-2 items-start cursor-pointer hover:bg-slate-800/40 rounded px-1 py-0.5"
          onClick={() => e.nodeId && selectNode(e.nodeId)}
        >
          <span className={`mt-0.5 ${SEVERITY_TONE[e.severity]}`}>●</span>
          <div className="flex-1 min-w-0">
            <div className="text-slate-300">{e.message}</div>
            <div className="text-slate-600 text-[9px] mt-0.5 font-mono tabular-nums">
              {new Date(e.at).toLocaleTimeString()}
              {e.nodeId && <span className="ml-2">· {e.nodeId.slice(0, 8)}</span>}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

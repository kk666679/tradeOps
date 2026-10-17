'use client';

import { use } from 'react';
import { useStreaming } from '@/hooks/useStreaming';
import { useRunContext } from '@/providers/RunProvider';
import { StreamingMarkdown } from '@/components/ai/stream/streaming-markdown';
import { ToolCallCard } from '@/components/ai/tool';
import { AuditTrace } from '@/components/ai/audit/audit-trace';

export default function RunDetailPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = use(params);
  const { run, dispatch } = useRunContext();
  const { streaming, start, stop } = useStreaming({
    onEvent: (event) => dispatch({ type: 'event.append', event }),
  });

  return (
    <div className="grid h-full grid-cols-1 gap-3 p-4 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-3">
        <header className="ai-panel flex items-center gap-2 px-3 py-2">
          <div className="ai-panel-title">Run {runId}</div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => start(`/api/stream?runId=${runId}`)}
              disabled={streaming}
              className="ai-chip bg-[#0f3d2e] text-[#a7f3d0]"
            >
              ▶ Attach stream
            </button>
            <button onClick={stop} disabled={!streaming} className="ai-chip bg-[#450a0a] text-[#fca5a5]">
              ⏹ Detach
            </button>
          </div>
        </header>

        <div className="ai-panel min-h-0 flex-1 overflow-auto p-3">
          {run?.events.map((e) =>
            e.kind === 'agent.message' ? (
              <StreamingMarkdown key={e.id} md={(e.payload as { text: string }).text} />
            ) : e.kind === 'agent.tool_call' ? (
              <ToolCallCard key={e.id} call={e.payload as never} />
            ) : null,
          )}
          {!run && <div className="text-[12px] text-[var(--color-text-3)]">No run attached yet.</div>}
        </div>
      </div>

      <aside className="ai-panel overflow-auto p-3">
        <div className="ai-panel-title mb-3">Audit trail</div>
        <AuditTrace entries={(run?.events ?? []).map((e) => ({
          id: e.id, at: e.at, actor: e.agentId ? 'agent' as const : 'system' as const,
          action: e.kind, target: runId, hash: e.id,
        }))} />
      </aside>
    </div>
  );
}

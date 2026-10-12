import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { Button } from '@/components/ui/button';
import { IntegrationKpiStrip } from '@/components/integration/core/IntegrationKpiStrip';
import { IntegrationLogTable } from '@/components/integration/core/IntegrationLogTable';
import { IntegrationDetail } from '@/components/integration/core/IntegrationDetail';
import { AgentMeshHeartbeat } from '@/components/integration/agent-mesh/AgentMeshHeartbeat';
import { AgentMeshStatusCard } from '@/components/integration/agent-mesh/AgentMeshStatusCard';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '@/components/ai-elements/reasoning';
import { Queue, QueueList, QueueItem, QueueItemIndicator, QueueItemContent } from '@/components/ai-elements/queue';

export const metadata: Metadata = { title: 'Agent Mesh · Heartbeat' };

const BEATS = [
  { id: 'gateway', at: '10:42:30', zone: 'ALL', gap: '5s', status: 'ok' },
  { id: 'customs', at: '10:42:28', zone: 'FIZ', gap: '7s', status: 'ok' },
  { id: 'edi', at: '10:42:25', zone: 'ALL', gap: '10s', status: 'ok' },
  { id: 'wms', at: '10:42:29', zone: 'FCZ', gap: '6s', status: 'ok' },
  { id: 'tms', at: '10:40:11', zone: 'FCZ', gap: '139s', status: 'missed' },
] as const;

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mesh heartbeat"
        description="Liveness per agent — gaps, missed beats, and auto-failover queue"
        action={<span className="flex gap-2"><Button asChild variant="outline" size="sm"><Link href="/integration/agent-mesh">Mesh hub</Link></Button><Button asChild variant="outline" size="sm"><Link href="/integration/agent-mesh/topology">Topology</Link></Button><Button asChild variant="outline" size="sm"><Link href="/integration/agent-mesh/skills">Skills</Link></Button></span>}
      >
        <div className="mt-2"><BrandLogo variant="compact" size="xs" /></div>
      </PageHeader>

      <IntegrationKpiStrip items={[
        { label: 'Agents reporting', value: '4 / 5', hint: 'TMS missed 2 beats' },
        { label: 'Worst gap', value: '139 s', hint: 'TMS bridge · FCZ' },
        { label: 'Failovers today', value: '1' },
        { label: 'Beat interval', value: '5 s' },
      ]} />

      <div className="grid gap-4 md:grid-cols-2">
        <AgentMeshHeartbeat title="Heartbeat monitor" value="4 / 5 alive" hint="TMS bridge missed — failover armed" zone="FCZ" />
        <AgentMeshStatusCard title="Mesh status" value="Degraded" hint="1 agent degraded · traffic shifted" zone="FCZ" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <Message from="assistant">
            <MessageContent><MessageResponse>{`TMS bridge missed **2 beats** (gap 139s). Failover to WMS bridge is **armed** — next beat decides.`}</MessageResponse></MessageContent>
          </Message>
          <Reasoning defaultOpen={false}>
            <ReasoningTrigger>Why armed, not failed over?</ReasoningTrigger>
            <ReasoningContent>{`Two misses = degraded (route kept, traffic shifted). Three misses = offline (route removed, drill queued).`}</ReasoningContent>
          </Reasoning>
          <Queue>
            <QueueList>
              {BEATS.map((b) => (
                <QueueItem key={b.id}><span className="flex items-center justify-between gap-2"><span className="flex items-center gap-2"><QueueItemIndicator completed={b.status === 'ok'} /><QueueItemContent completed={false}>{b.id} · {b.zone}</QueueItemContent></span><span className="font-mono text-[11px] text-muted-foreground">{b.at} · gap {b.gap}</span></span></QueueItem>
              ))}
            </QueueList>
          </Queue>
        </div>
        <IntegrationLogTable logs={[
          { id: 'hb-1', at: '10:42:30', direction: 'IN', status: 200, payload: '{"agent":"gateway","gap":"5s"}', zone: 'FIZ' },
          { id: 'hb-2', at: '10:42:28', direction: 'IN', status: 200, payload: '{"agent":"customs","gap":"7s"}', zone: 'FIZ' },
          { id: 'hb-3', at: '10:40:11', direction: 'IN', status: 504, payload: '{"agent":"tms","error":"beat timeout"}', zone: 'FCZ' },
        ]} />
      </div>

      <IntegrationDetail id="mesh-heartbeat" zone="FCZ" />
    </div>
  );
}


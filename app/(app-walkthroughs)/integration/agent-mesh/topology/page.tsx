import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { Button } from '@/components/ui/button';
import { IntegrationKpiStrip } from '@/components/integration/core/IntegrationKpiStrip';
import { IntegrationHealthGrid } from '@/components/integration/core/IntegrationHealthGrid';
import { IntegrationDetail } from '@/components/integration/core/IntegrationDetail';
import { MeshView } from '@/components/ai-control/mesh-view';
import { WorkflowCanvas } from '@/components/ai-control/workflow-canvas';
import { ScenarioRunner } from '@/components/ai-control/scenario-runner';
import { ChainOfThought, ChainOfThoughtHeader, ChainOfThoughtStep, ChainOfThoughtContent } from '@/components/ai-elements/chain-of-thought';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';

export const metadata: Metadata = { title: 'Agent Mesh · Topology' };

const NODES = [
  { id: 'gateway', label: 'Integration gateway', zone: 'FIZ' as const, status: 'ok' as const, x: 60, y: 80 },
  { id: 'customs', label: 'Customs bridge', zone: 'FIZ' as const, status: 'ok' as const, x: 320, y: 60 },
  { id: 'edi', label: 'EDI / ASYCUDA', zone: 'BONDED' as const, status: 'ok' as const, x: 580, y: 60 },
  { id: 'wms', label: 'WMS bridge', zone: 'FCZ' as const, status: 'ok' as const, x: 320, y: 240 },
  { id: 'tms', label: 'TMS bridge', zone: 'FCZ' as const, status: 'warn' as const, x: 580, y: 240 },
];
const EDGES = [
  { from: 'gateway', to: 'customs' },
  { from: 'customs', to: 'edi' },
  { from: 'gateway', to: 'wms' },
  { from: 'gateway', to: 'tms' },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mesh topology"
        description="Live agent graph across FIZ / FCZ / bonded — gateway, customs, EDI, WMS, TMS"
        action={<span className="flex gap-2"><Button asChild variant="outline" size="sm"><Link href="/integration/agent-mesh">Mesh hub</Link></Button><Button asChild variant="outline" size="sm"><Link href="/integration/agent-mesh/skills">Skills</Link></Button><Button asChild variant="outline" size="sm"><Link href="/integration/agent-mesh/heartbeat">Heartbeat</Link></Button></span>}
      >
        <div className="mt-2"><BrandLogo variant="compact" size="xs" /></div>
      </PageHeader>

      <IntegrationKpiStrip items={[
        { label: 'Agents online', value: '5 / 5' },
        { label: 'Links healthy', value: '3 / 4', hint: 'TMS degraded' },
        { label: 'p50 hop latency', value: '180 ms' },
        { label: 'Zone coverage', value: 'FIZ · FCZ · BONDED' },
      ]} />

      <MeshView nodes={NODES} edges={EDGES} title="Agent mesh — FIZ/FCZ/bonded" />

      <div className="grid gap-6 lg:grid-cols-2">
        <WorkflowCanvas title="Join / failover path" />
        <div className="space-y-4">
          <Message from="assistant">
            <MessageContent><MessageResponse>{`TMS bridge is **degraded** — failover goes gateway → WMS → manual dispatch until latency recovers.`}</MessageResponse></MessageContent>
          </Message>
          <ChainOfThought defaultOpen={false}>
            <ChainOfThoughtHeader>How failover is decided</ChainOfThoughtHeader>
            <ChainOfThoughtContent>
              <ChainOfThoughtStep label="Heartbeat missed 2×" status="complete" />
              <ChainOfThoughtStep label="Route marked degraded" status="complete" />
              <ChainOfThoughtStep label="Traffic shifted to WMS bridge" status="active" />
            </ChainOfThoughtContent>
          </ChainOfThought>
        </div>
      </div>

      <IntegrationHealthGrid entries={[
        { id: 'gateway', name: 'Integration gateway', status: 'ok', latencyMs: 42, zone: 'ALL' },
        { id: 'customs', name: 'Customs bridge', status: 'ok', latencyMs: 210, zone: 'FIZ' },
        { id: 'edi', name: 'EDI / ASYCUDA', status: 'ok', latencyMs: 180, zone: 'ALL' },
        { id: 'wms', name: 'WMS bridge', status: 'ok', latencyMs: 96, zone: 'FCZ' },
        { id: 'tms', name: 'TMS bridge', status: 'warn', latencyMs: 1200, zone: 'FCZ' },
      ]} />

      <ScenarioRunner title="Failover drill" />

      <IntegrationDetail id="mesh-topology" zone="FIZ" />
    </div>
  );
}


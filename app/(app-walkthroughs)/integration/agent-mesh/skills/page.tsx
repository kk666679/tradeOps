import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IntegrationKpiStrip } from '@/components/integration/core/IntegrationKpiStrip';
import { IntegrationDetail } from '@/components/integration/core/IntegrationDetail';
import { AgentMeshSkillCatalog } from '@/components/integration/agent-mesh/AgentMeshSkillCatalog';
import { McpConnection } from '@/components/ai-control/mcp-connection';
import { Plan, PlanHeader, PlanTitle, PlanDescription, PlanContent, PlanTrigger } from '@/components/ai-elements/plan';
import { Task, TaskTrigger, TaskContent, TaskItem, TaskItemFile } from '@/components/ai-elements/task';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';

export const metadata: Metadata = { title: 'Agent Mesh · Skills' };

const SKILLS = [
  { id: 'classify_hs', agent: 'Tariff engine', zone: 'FIZ', calls: '1.2k/day', p50: '38 ms', files: ['tariff.json', 'hs-map.json'] },
  { id: 'submit_declaration', agent: 'JKDM bridge', zone: 'FIZ', calls: '640/day', p50: '240 ms', files: ['cusdec.json'] },
  { id: 'stock_sync', agent: 'WMS link', zone: 'FCZ', calls: '3.1k/day', p50: '96 ms', files: ['stock.json'] },
  { id: 'route_plan', agent: 'TMS bridge', zone: 'FCZ', calls: '410/day', p50: '1.2 s', files: ['route.json'] },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mesh skills"
        description="Tool catalog exposed by each mesh agent — HS classification, declarations, stock sync, route planning"
        action={<span className="flex gap-2"><Button asChild variant="outline" size="sm"><Link href="/integration/agent-mesh">Mesh hub</Link></Button><Button asChild variant="outline" size="sm"><Link href="/integration/agent-mesh/topology">Topology</Link></Button><Button asChild variant="outline" size="sm"><Link href="/integration/agent-mesh/heartbeat">Heartbeat</Link></Button></span>}
      >
        <div className="mt-2"><BrandLogo variant="compact" size="xs" /></div>
      </PageHeader>

      <IntegrationKpiStrip items={[
        { label: 'Registered skills', value: String(SKILLS.length * 3), hint: 'across 5 agents' },
        { label: 'Calls today', value: '5.4k' },
        { label: 'p50 latency', value: '180 ms' },
        { label: 'Failing skills', value: '0' },
      ]} />

      <div className="grid gap-4 md:grid-cols-2">
        <AgentMeshSkillCatalog title="Skill catalog" value={`${SKILLS.length * 3} skills`} hint="5 agents · FIZ / FCZ / bonded" zone="FIZ" />
        <Card>
          <CardHeader><CardTitle className="text-sm">Hottest skills</CardTitle><CardDescription>By calls in the last 24h</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {SKILLS.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded border px-2 py-1.5">
                <span className="font-mono text-xs">{s.id}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground"><Badge variant="outline">{s.zone}</Badge>{s.calls} · {s.p50}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Plan defaultOpen>
        <PlanHeader>
          <div><PlanTitle>Skill rollout plan</PlanTitle><PlanDescription>Version, pin, and verify each agent tool before promotion</PlanDescription></div>
          <PlanTrigger />
        </PlanHeader>
        <PlanContent>
          <div className="grid gap-4 md:grid-cols-2">
            {SKILLS.map((s) => (
              <Task key={s.id} defaultOpen={false}>
                <TaskTrigger title={`${s.id} · ${s.agent}`} />
                <TaskContent>
                  <TaskItem>{`Zone ${s.zone} — ${s.calls} · p50 ${s.p50}`}</TaskItem>
                  {s.files.map((f) => <TaskItemFile key={f}>{f}</TaskItemFile>)}
                </TaskContent>
              </Task>
            ))}
          </div>
          <div className="mt-3">
            <Suggestions>
              <Suggestion suggestion="Pin skill versions" />
              <Suggestion suggestion="Replay yesterday's traffic" />
              <Suggestion suggestion="Promote to bonded" />
            </Suggestions>
          </div>
        </PlanContent>
      </Plan>

      <McpConnection title="Skill transports (MCP)" />

      <IntegrationDetail id="mesh-skills" zone="FIZ" />
    </div>
  );
}


'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnvironmentVariables, EnvironmentVariablesHeader, EnvironmentVariablesTitle, EnvironmentVariablesToggle, EnvironmentVariablesContent, EnvironmentVariable } from '@/components/ai-elements/environment-variables';
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool';
import { CodeBlock } from '@/components/ai-elements/code-block';

export interface McpServer { id: string; name: string; transport: 'stdio' | 'sse' | 'http'; status: 'connected' | 'degraded' | 'offline'; tools: string[]; latencyMs?: number }
export interface McpConnectionProps {
  className?: string;
  data?: unknown;
  servers?: McpServer[];
  title?: string;
  onSelect?: (id: string) => void;
}

const DEFAULTS: McpServer[] = [
  { id: 'jkdm-bridge', name: 'JKDM bridge', transport: 'http', status: 'connected', tools: ['submit_declaration', 'query_status'], latencyMs: 240 },
  { id: 'tariff-engine', name: 'Tariff engine', transport: 'stdio', status: 'connected', tools: ['classify_hs', 'compute_duty'], latencyMs: 38 },
  { id: 'wms-link', name: 'WMS link', transport: 'sse', status: 'degraded', tools: ['stock_sync'], latencyMs: 1200 },
];

/** MCP server connections — status grid + tool inspector + env. */
export function McpConnection({ className, data, servers, title = 'MCP connections', onSelect }: McpConnectionProps) {
  const list = servers?.length ? servers : (Array.isArray((data as { servers?: McpServer[] })?.servers) ? (data as { servers: McpServer[] }).servers : DEFAULTS);
  const [sel, setSel] = React.useState(list[0]?.id);
  const current = list.find((s) => s.id === sel) ?? list[0];
  return (
    <Card className={className}>
      <CardHeader><CardTitle>{title}</CardTitle><CardDescription>{`${list.filter((s) => s.status === 'connected').length}/${list.length} connected · transports: stdio / sse / http`}</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 md:grid-cols-3">
          {list.map((s) => (
            <button key={s.id} onClick={() => { setSel(s.id); onSelect?.(s.id); }} className={`rounded-lg border p-3 text-left ${s.id === sel ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}>
              <div className="flex items-center justify-between"><span className="text-sm font-medium">{s.name}</span><Badge variant={s.status === 'connected' ? 'default' : s.status === 'degraded' ? 'secondary' : 'destructive'}>{s.status}</Badge></div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground"><span>{s.transport} · {s.tools.length} tools</span><span>{s.latencyMs ?? '—'} ms</span></div>
            </button>
          ))}
        </div>
        {current ? (
          <Tool defaultOpen>
            <ToolHeader type="tool-mcp" state={current.status === 'connected' ? 'output-available' : 'output-error'} title={current.name} />
            <ToolContent>
              <ToolInput input={{ server: current.id, transport: current.transport }} />
              <div className="flex flex-wrap gap-1.5">{current.tools.map((t) => <Badge key={t} variant="outline" className="font-mono">{t}</Badge>)}</div>
              <ToolOutput output={`${current.tools.length} tools available · p50 ${current.latencyMs ?? '—'} ms`} errorText={current.status === 'offline' ? 'Server offline — check transport' : (undefined as unknown as string)} />
            </ToolContent>
          </Tool>
        ) : null}
        <EnvironmentVariables defaultShowValues={false}>
          <EnvironmentVariablesHeader><EnvironmentVariablesTitle>MCP credentials (vault refs)</EnvironmentVariablesTitle><EnvironmentVariablesToggle /></EnvironmentVariablesHeader>
          <EnvironmentVariablesContent>
            <EnvironmentVariable name="JKDM_API_KEY" value="vault://integration/jkdm/api-key" />
            <EnvironmentVariable name="TARIFF_ENGINE_DSN" value="vault://integration/tariff/dsn" />
          </EnvironmentVariablesContent>
        </EnvironmentVariables>
        <CodeBlock code={JSON.stringify(data ?? { servers: list.length }, null, 2)} language="json" />
      </CardContent>
    </Card>
  );
}

export default McpConnection;


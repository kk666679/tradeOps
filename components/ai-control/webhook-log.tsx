'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Conversation, ConversationContent, ConversationEmptyState } from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool';
import { CodeBlock } from '@/components/ai-elements/code-block';

export interface WebhookEvent { id: string; at: string; endpoint: string; direction: 'IN' | 'OUT'; status: number; payload?: string }
export interface WebhookLogProps {
  className?: string;
  data?: unknown;
  events?: WebhookEvent[];
  title?: string;
  onSelect?: (id: string) => void;
}

const DEFAULTS: WebhookEvent[] = [
  { id: 'wh-1042', at: '10:42:11', endpoint: '/hooks/customs/status', direction: 'IN', status: 200, payload: '{"declaration":"DEC-8812","state":"released"}' },
  { id: 'wh-1041', at: '10:41:02', endpoint: '/hooks/wms/movement', direction: 'OUT', status: 202, payload: '{"container":"MSKU-4412","gate":"OUT"}' },
  { id: 'wh-1039', at: '10:39:47', endpoint: '/hooks/tms/pod', direction: 'IN', status: 500, payload: '{"error":"signature mismatch"}' },
];

/** Webhook delivery log — filterable event stream + payload inspector. */
export function WebhookLog({ className, data, events, title = 'Webhook log', onSelect }: WebhookLogProps) {
  const rows = events?.length ? events : (Array.isArray((data as { events?: WebhookEvent[] })?.events) ? (data as { events: WebhookEvent[] }).events : DEFAULTS);
  const [filter, setFilter] = React.useState<'ALL' | 'IN' | 'OUT' | 'ERR'>('ALL');
  const [sel, setSel] = React.useState(rows[0]?.id);
  const visible = rows.filter((r) => filter === 'ALL' ? true : filter === 'ERR' ? r.status >= 400 : r.direction === filter);
  const current = rows.find((r) => r.id === sel) ?? visible[0];
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div><CardTitle>{title}</CardTitle><CardDescription>{`${visible.length}/${rows.length} deliveries · errors in red`}</CardDescription></div>
        <div className="flex gap-1.5">
          {(['ALL', 'IN', 'OUT', 'ERR'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-2.5 py-0.5 text-[11px] ${filter === f ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>{f}</button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-[1fr_300px]">
        <Conversation>
          <ConversationContent className="gap-2 p-0">
            {visible.length === 0 ? <ConversationEmptyState title="No deliveries" description="No webhook events match this filter" /> : null}
            {visible.map((e) => (
              <button key={e.id} onClick={() => { setSel(e.id); onSelect?.(e.id); }} className={`flex items-center justify-between rounded-md border px-2.5 py-2 text-left text-xs ${e.id === sel ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}>
                <span className="font-mono">{e.at} · {e.endpoint}</span>
                <span className="flex items-center gap-1.5">
                  <Badge variant={e.direction === 'IN' ? 'default' : 'outline'}>{e.direction}</Badge>
                  <Badge variant={e.status < 400 ? 'secondary' : 'destructive'}>{e.status}</Badge>
                </span>
              </button>
            ))}
          </ConversationContent>
        </Conversation>
        {current ? (
          <div className="space-y-2">
            <Message from="assistant"><MessageContent><MessageResponse>{`Delivery **${current.id}** → \`${current.endpoint}\``}</MessageResponse></MessageContent></Message>
            <Tool defaultOpen>
              <ToolHeader type="tool-webhook" state={current.status < 400 ? 'output-available' : 'output-error'} title="Payload" />
              <ToolContent>
                <ToolInput input={{ endpoint: current.endpoint, direction: current.direction, status: current.status }} />
                <ToolOutput output={current.payload ?? '—'} errorText={current.status >= 400 ? 'Delivery failed — retry with backoff' : (undefined as unknown as string)} />
              </ToolContent>
            </Tool>
            <CodeBlock code={JSON.stringify(data ?? current, null, 2)} language="json" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default WebhookLog;


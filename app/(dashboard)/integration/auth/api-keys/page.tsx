'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IntegrationKpiStrip } from '@/components/integration/core/IntegrationKpiStrip';
import { IntegrationDetail } from '@/components/integration/core/IntegrationDetail';
import { ApiKeyManager, type ApiKey } from '@/components/integration/auth/ApiKeyManager';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { EnvironmentVariables, EnvironmentVariablesHeader, EnvironmentVariablesTitle, EnvironmentVariablesToggle, EnvironmentVariablesContent, EnvironmentVariable } from '@/components/ai-elements/environment-variables';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';

const SEED: ApiKey[] = [
  { id: 'key-ops', label: 'Ops gateway', masked: 'sk-ops-••••8f2a', createdAt: '2026-08-14', scopes: ['declarations:read', 'declarations:write'] },
  { id: 'key-wms', label: 'WMS bridge', masked: 'sk-wms-••••41c9', createdAt: '2026-09-02', scopes: ['stock:sync'] },
  { id: 'key-broker', label: 'Broker portal', masked: 'sk-brk-••••d077', createdAt: '2026-09-20', scopes: ['declarations:read'] },
];

export default function ApiKeysClient() {
  const [keys, setKeys] = React.useState<ApiKey[]>(SEED);
  const [notice, setNotice] = React.useState<string | null>(null);
  return (
    <div className="space-y-6">
      <PageHeader
        title="API keys"
        description="Scoped service keys for gateway, WMS/TMS bridges, and broker portal — rotate without downtime"
        action={<span className="flex gap-2"><Button asChild variant="outline" size="sm"><Link href="/integration/auth">Auth hub</Link></Button><Button asChild variant="outline" size="sm"><Link href="/integration/auth/oauth-clients">OAuth clients</Link></Button><Button asChild variant="outline" size="sm"><Link href="/integration/auth/secrets">Secrets</Link></Button></span>}
      >
        <div className="mt-2"><BrandLogo variant="compact" size="xs" /></div>
      </PageHeader>

      <IntegrationKpiStrip items={[
        { label: 'Active keys', value: String(keys.length) },
        { label: 'Scopes granted', value: String(new Set(keys.flatMap((k) => k.scopes)).size) },
        { label: 'Oldest key', value: keys.length ? keys.map((k) => k.createdAt).sort()[0] : '—', hint: 'rotate after 90 days' },
        { label: 'Revocations (30d)', value: '1' },
      ]} />

      {notice ? (
        <Message from="assistant"><MessageContent><MessageResponse>{notice}</MessageResponse></MessageContent></Message>
      ) : null}

      <ApiKeyManager
        keys={keys}
        onCreate={() => { setKeys((k) => [...k, { id: `key-${Date.now()}`, label: 'New service key', masked: 'sk-new-••••0000', createdAt: new Date().toISOString().slice(0, 10), scopes: ['declarations:read'] }]); setNotice('New key issued — copy it now, it will be masked after this session.'); }}
        onRotate={(id) => { setKeys((ks) => ks.map((k) => (k.id === id ? { ...k, masked: `sk-rot-••••${Math.floor(Math.random() * 9000 + 1000)}` } : k))); setNotice(`Key rotated — old value stays valid for 15 min grace. (${id})`); }}
        onRevoke={(id) => { setKeys((ks) => ks.filter((k) => k.id !== id)); setNotice(`Key revoked immediately. (${id})`); }}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">Scope map</CardTitle><CardDescription>Least-privilege per consumer</CardDescription></CardHeader>
          <CardContent className="space-y-1.5 text-xs">
            {keys.map((k) => (
              <div key={k.id} className="flex items-center justify-between rounded border px-2 py-1.5">
                <span className="font-medium">{k.label} <span className="font-mono text-muted-foreground">{k.masked}</span></span>
                <span className="text-muted-foreground">{k.scopes.join(' · ')}</span>
              </div>
            ))}
            {keys.length === 0 ? <p className="text-muted-foreground">No keys — create one to begin.</p> : null}
          </CardContent>
        </Card>
        <EnvironmentVariables defaultShowValues={false}>
          <EnvironmentVariablesHeader><EnvironmentVariablesTitle>Gateway env (vault refs)</EnvironmentVariablesTitle><EnvironmentVariablesToggle /></EnvironmentVariablesHeader>
          <EnvironmentVariablesContent>
            <EnvironmentVariable name="GATEWAY_API_KEY" value="vault://integration/gateway/api-key" />
            <EnvironmentVariable name="KEY_ROTATION_GRACE_S" value="900" />
          </EnvironmentVariablesContent>
        </EnvironmentVariables>
      </div>

      <Suggestions>
        <Suggestion suggestion="Rotate broker key" />
        <Suggestion suggestion="Audit unused scopes" />
      </Suggestions>

      <IntegrationDetail id="auth-api-keys" zone="FIZ" />
    </div>
  );
}


'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IntegrationKpiStrip } from '@/components/integration/core/IntegrationKpiStrip';
import { IntegrationDetail } from '@/components/integration/core/IntegrationDetail';
import { IntegrationSecretVault } from '@/components/integration/auth/IntegrationSecretVault';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { EnvironmentVariables, EnvironmentVariablesHeader, EnvironmentVariablesTitle, EnvironmentVariablesToggle, EnvironmentVariablesContent, EnvironmentVariable } from '@/components/ai-elements/environment-variables';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';

const SEED = [
  { id: 'jkdm-api-key', title: 'JKDM API key', zone: 'FIZ' as const, hint: 'vault://integration/jkdm/api-key · rotates every 90d', value: 'sk-jkdm-••••9a31' },
  { id: 'wms-bridge-secret', title: 'WMS bridge secret', zone: 'FCZ' as const, hint: 'vault://integration/wms/secret · HMAC signing', value: 'whsec-••••77e0' },
  { id: 'edi-sftp-pass', title: 'EDI SFTP password', zone: 'FIZ' as const, hint: 'vault://integration/edi/sftp · ASYCUDA drop', value: '••••••••' },
];

export default function SecretsClient() {
  const [notice, setNotice] = React.useState<string | null>(null);
  const [revealed, setRevealed] = React.useState<string | null>(null);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Secrets vault"
        description="Vault-backed credentials for JKDM, WMS/TMS bridges, and EDI — never stored in env files"
        action={<span className="flex gap-2"><Button asChild variant="outline" size="sm"><Link href="/integration/auth">Auth hub</Link></Button><Button asChild variant="outline" size="sm"><Link href="/integration/auth/api-keys">API keys</Link></Button><Button asChild variant="outline" size="sm"><Link href="/integration/auth/oauth-clients">OAuth clients</Link></Button></span>}
      />

      <IntegrationKpiStrip items={[
        { label: 'Vault secrets', value: String(SEED.length) },
        { label: 'Zones', value: 'FIZ · FCZ' },
        { label: 'Rotation due', value: '1', hint: 'EDI SFTP > 80d' },
        { label: 'Last audit', value: '2026-10-04' },
      ]} />

      {notice ? <Message from="assistant"><MessageContent><MessageResponse>{notice}</MessageResponse></MessageContent></Message> : null}

      <div className="grid gap-4 md:grid-cols-3">
        {SEED.map((s) => (
          <IntegrationSecretVault
            key={s.id}
            title={s.title}
            zone={s.zone}
            hint={s.hint}
            value={
              <span className="flex items-center gap-2">
                <span className="font-mono text-base">{revealed === s.id ? 'revealed-once-•••' : s.value}</span>
                <Button size="sm" variant="outline" onClick={() => { setRevealed(s.id); setNotice(`${s.title} revealed once — re-masked after this session.`); setTimeout(() => setRevealed(null), 8000); }}>Reveal</Button>
                <Button size="sm" variant="outline" onClick={() => setNotice(`${s.title} rotation queued — dual-secret grace 15 min.`)}>Rotate</Button>
              </span>
            }
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EnvironmentVariables defaultShowValues={false}>
          <EnvironmentVariablesHeader><EnvironmentVariablesTitle>Vault references (safe to commit)</EnvironmentVariablesTitle><EnvironmentVariablesToggle /></EnvironmentVariablesHeader>
          <EnvironmentVariablesContent>
            <EnvironmentVariable name="JKDM_API_KEY" value="vault://integration/jkdm/api-key" />
            <EnvironmentVariable name="WMS_BRIDGE_SECRET" value="vault://integration/wms/secret" />
            <EnvironmentVariable name="EDI_SFTP_PASSWORD" value="vault://integration/edi/sftp" />
          </EnvironmentVariablesContent>
        </EnvironmentVariables>
        <Card>
          <CardHeader><CardTitle className="text-sm">Rotation policy</CardTitle><CardDescription>Dual-secret grace avoids downtime</CardDescription></CardHeader>
          <CardContent className="flex flex-wrap gap-2 text-xs">
            <Badge variant="default">90-day rotation</Badge>
            <Badge variant="secondary">15-min grace</Badge>
            <Badge variant="outline">audit on reveal</Badge>
          </CardContent>
        </Card>
      </div>

      <Suggestions>
        <Suggestion suggestion="Rotate EDI SFTP now" />
        <Suggestion suggestion="Audit reveal history" />
      </Suggestions>

      <IntegrationDetail id="auth-secrets" zone="FIZ" />
    </div>
  );
}


'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IntegrationKpiStrip } from '@/components/integration/core/IntegrationKpiStrip';
import { IntegrationDetail } from '@/components/integration/core/IntegrationDetail';
import { OAuthClientList, type OAuthClientListRow } from '@/components/integration/auth/OAuthClientList';
import { OAuthClientForm, type OAuthClientFormValues } from '@/components/integration/auth/OAuthClientForm';
import { Plan, PlanHeader, PlanTitle, PlanDescription, PlanContent, PlanTrigger } from '@/components/ai-elements/plan';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';

const SEED: OAuthClientListRow[] = [
  { id: 'broker-portal', ref: 'broker-portal', zone: 'FIZ', status: 'active', meta: 'redirect: /portal/callback · grant: code' },
  { id: 'wms-bridge', ref: 'wms-bridge', zone: 'FCZ', status: 'active', meta: 'grant: client_credentials · scope stock:sync' },
  { id: 'customs-sandbox', ref: 'customs-sandbox', zone: 'FIZ', status: 'suspended', meta: 'redirect expired — rotate secret' },
];

export default function OAuthClientsClient() {
  const [rows, setRows] = React.useState<OAuthClientListRow[]>(SEED);
  const [sel, setSel] = React.useState<OAuthClientListRow | null>(SEED[0] ?? null);
  const [showForm, setShowForm] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);
  return (
    <div className="space-y-6">
      <PageHeader
        title="OAuth clients"
        description="Confidential + public clients for portal, bridges, and sandbox — grants, redirects, rotation"
        action={<span className="flex gap-2"><Button asChild variant="outline" size="sm"><Link href="/integration/auth">Auth hub</Link></Button><Button asChild variant="outline" size="sm"><Link href="/integration/auth/api-keys">API keys</Link></Button><Button asChild variant="outline" size="sm"><Link href="/integration/auth/secrets">Secrets</Link></Button></span>}
      >
        <div className="mt-2"><BrandLogo variant="compact" size="xs" /></div>
      </PageHeader>

      <IntegrationKpiStrip items={[
        { label: 'Registered clients', value: String(rows.length) },
        { label: 'Active', value: String(rows.filter((r) => r.status === 'active').length) },
        { label: 'Suspended', value: String(rows.filter((r) => r.status !== 'active').length), hint: 'rotate + re-enable' },
        { label: 'Zones', value: 'FIZ · FCZ' },
      ]} />

      {notice ? <Message from="assistant"><MessageContent><MessageResponse>{notice}</MessageResponse></MessageContent></Message> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle className="text-sm">Clients</CardTitle><CardDescription>Select a row to inspect</CardDescription></div>
            <Button size="sm" onClick={() => setShowForm((v) => !v)}>{showForm ? 'Close' : 'Register client'}</Button>
          </CardHeader>
          <CardContent className="h-[300px] p-0">
            <OAuthClientList rows={rows} onSelect={(r) => setSel(r)} />
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Plan defaultOpen>
            <PlanHeader><div><PlanTitle>{sel?.ref ?? 'No client selected'}</PlanTitle><PlanDescription>{sel ? `${sel.zone ?? '—'} · ${sel.status ?? '—'}` : 'Pick a client row'}</PlanDescription></div><PlanTrigger /></PlanHeader>
            <PlanContent>
              <p className="text-xs text-muted-foreground">{sel?.meta ?? '—'}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { if (sel) { setRows((rs) => rs.map((r) => (r.id === sel.id ? { ...r, status: 'active' } : r))); setNotice(`${sel.ref} re-enabled.`); } }}>Re-enable</Button>
                <Button size="sm" variant="destructive" onClick={() => { if (sel) { setRows((rs) => rs.filter((r) => r.id !== sel.id)); setSel(null); setNotice(`${sel.ref} deleted — tokens revoked.`); } }}>Delete</Button>
              </div>
            </PlanContent>
          </Plan>
          {showForm ? (
            <Card>
              <CardHeader><CardTitle className="text-sm">Register client</CardTitle><CardDescription>Reference + zone + redirect</CardDescription></CardHeader>
              <CardContent className="p-0">
                <OAuthClientForm
                  onSubmit={(v: OAuthClientFormValues) => {
                    const ref = String(v.ref ?? `client-${rows.length + 1}`);
                    setRows((rs) => [...rs, { id: ref, ref, zone: String(v.zone ?? 'FIZ') as 'FIZ' | 'FCZ', status: 'active', meta: `grant: code · hs ${String(v.hs ?? '—')}` }]);
                    setShowForm(false);
                    setNotice(`${ref} registered — secret shown once in vault.`);
                  }}
                />
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      <IntegrationDetail id="auth-oauth" zone="FIZ" />
    </div>
  );
}


'use client';

import Link from 'next/link';
import { trpc } from '@/lib/trpc/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SettingsDetailKind = 'profile' | 'organization' | 'security' | 'notifications' | 'api-keys';

const unavailableCopy: Record<Exclude<SettingsDetailKind, 'profile' | 'organization'>, { title: string; message: string }> = {
  security: {
    title: 'Security controls are unavailable',
    message: 'The available authentication API supports identity lookup, sign-in, registration, and token refresh. It does not expose password changes, multi-factor setup, or session management.',
  },
  notifications: {
    title: 'Notification preferences are unavailable',
    message: 'There is no tRPC API for reading or saving notification preferences, so notification controls cannot be changed here.',
  },
  'api-keys': {
    title: 'API key management is unavailable',
    message: 'There is no tRPC API for listing, creating, revoking, or rotating API keys.',
  },
};

function AccountContext({ kind }: { kind: 'profile' | 'organization' }) {
  const account = trpc.auth.me.useQuery();
  const isProfile = kind === 'profile';

  return (
    <div className="mt-6 grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{isProfile ? 'Signed-in account' : 'Current organization context'}</CardTitle>
        </CardHeader>
        <CardContent>
          {account.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading account context…</p>
          ) : account.isError ? (
            <div role="alert" className="space-y-3">
              <p className="text-sm text-destructive">Account context could not be loaded from the authentication API.</p>
              <Button variant="outline" onClick={() => void account.refetch()}>Retry</Button>
            </div>
          ) : !account.data ? (
            <p role="status" className="text-sm text-muted-foreground">No signed-in account is available in this session.</p>
          ) : (
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="mt-1 font-medium">{account.data.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Role</dt>
                <dd className="mt-1 font-medium">{account.data.role}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Tenant ID</dt>
                <dd className="mt-1 break-all font-mono text-xs">{account.data.tenantId}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isProfile ? 'Profile editing unavailable' : 'Organization settings unavailable'}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {isProfile
            ? 'The authentication API provides read-only account identity; there is no self-service profile update endpoint. No profile changes can be saved from this page.'
            : 'The app exposes generic tenant CRUD procedures, but no dedicated organization-settings contract for safely reading or updating organization preferences. This page only shows the tenant context returned by the authentication API.'}
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsDetail({ kind }: { kind: SettingsDetailKind }) {
  if (kind === 'profile' || kind === 'organization') {
    return <AccountContext kind={kind} />;
  }

  const unavailable = unavailableCopy[kind];
  return (
    <Card className="mt-6">
      <CardHeader><CardTitle>{unavailable.title}</CardTitle></CardHeader>
      <CardContent>
        <p role="status" className="text-sm text-muted-foreground">{unavailable.message}</p>
        {kind === 'security' && (
          <Button asChild variant="outline" className="mt-4">
            <Link href="/settings/profile">View signed-in account</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

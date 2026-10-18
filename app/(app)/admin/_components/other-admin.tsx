'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { trpc } from '@/lib/trpc';

export function AdminUnavailable({
  title,
  description,
  source,
}: {
  title: string;
  description: string;
  source: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card>
        <CardHeader><CardTitle>API not available</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{source}</p>
          <p className="text-muted-foreground">No records, forms, or successful actions are shown because the current AppRouter does not expose a matching tenant-scoped API for this operation.</p>
        </CardContent>
      </Card>
    </div>
  );
}

type UserRow = { id: string; email: string; name: string | null; role: string; status: string };
const roleNames = ['SUPER_ADMIN', 'ADMIN', 'OPS_MANAGER', 'WAREHOUSE_STAFF', 'CUSTOMER', 'AGENT', 'AUDITOR'];

export function RoleAssignments({ matrix = false }: { matrix?: boolean }) {
  const query = trpc.user.list.useQuery();
  const users = (query.data ?? []) as UserRow[];
  const counts = users.reduce<Record<string, number>>((result, user) => {
    result[user.role] = (result[user.role] ?? 0) + 1;
    return result;
  }, {});
  const title = matrix ? 'Role assignments' : 'Role Management';

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={matrix
          ? 'Tenant users grouped by their assigned global role; permission rules are not exposed by the AppRouter.'
          : 'View global role values and the roles currently assigned to tenant users.'}
      />
      <Card>
        <CardHeader><CardTitle>{matrix ? 'Assignments by role' : 'Available role values'}</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-xs text-muted-foreground">User source: trpc.user.list (tenant-scoped). Role values: GlobalRole enum. This is not a configurable role or permission matrix.</p>
          {query.isLoading && <p className="text-sm text-muted-foreground">Loading tenant user roles…</p>}
          {query.error && <p role="alert" className="text-sm text-destructive">Could not load tenant role assignments: {query.error.message}</p>}
          {!query.isLoading && !query.error && users.length === 0 && <p className="text-sm text-muted-foreground">The user API returned no tenant users; role assignment counts are empty.</p>}
          {!query.isLoading && !query.error && (
            <Table>
              <TableHeader><TableRow><TableHead>Role</TableHead><TableHead>Assigned users</TableHead><TableHead>Tenant users</TableHead></TableRow></TableHeader>
              <TableBody>
                {roleNames.map((role) => (
                  <TableRow key={role}>
                    <TableCell><Badge variant="outline">{role}</Badge></TableCell>
                    <TableCell>{counts[role] ?? 0}</TableCell>
                    <TableCell>{users.filter((user) => user.role === role).map((user) => user.email).join(', ') || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <p className="mt-4 text-sm text-muted-foreground">Role definitions, permission grants, and matrix editing have no matching API in the current AppRouter.</p>
        </CardContent>
      </Card>
    </div>
  );
}

type TenantBillingRow = {
  id: string;
  name?: string;
  plan?: string;
  status?: string;
  billingEmail?: string | null;
};

export function BillingOverview() {
  const query = trpc.tenant.list.useQuery({ take: 100 });
  const tenants = Array.isArray(query.data) ? query.data as TenantBillingRow[] : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description="Tenant plan and billing-contact information only; invoices and payment history are not exposed here." />
      <Card>
        <CardHeader><CardTitle>Tenant plan details</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-xs text-muted-foreground">Source: trpc.tenant.list (take 100; server applies tenant context).</p>
          {query.isLoading && <p className="text-sm text-muted-foreground">Loading tenant billing details…</p>}
          {query.error && <p role="alert" className="text-sm text-destructive">Could not load tenant billing details: {query.error.message}</p>}
          {!query.isLoading && !query.error && tenants.length === 0 && <p className="text-sm text-muted-foreground">The tenant API returned no records with billing details.</p>}
          {tenants.length > 0 && (
            <Table>
              <TableHeader><TableRow><TableHead>Tenant</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead><TableHead>Billing email</TableHead></TableRow></TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>{tenant.name ?? 'Name unavailable'}</TableCell>
                    <TableCell>{tenant.plan ?? 'Plan unavailable'}</TableCell>
                    <TableCell>{tenant.status ?? 'Status unavailable'}</TableCell>
                    <TableCell>{tenant.billingEmail || 'Not set'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <p className="mt-4 text-sm text-muted-foreground">Invoice, charge, payment-method, and payment-history APIs are not available; no billing actions are offered.</p>
        </CardContent>
      </Card>
    </div>
  );
}

type AuditRow = Record<string, unknown> & { id?: string; createdAt?: string | Date; action?: string; event?: string };

export function AuditLogView() {
  const query = trpc.customAgents.audit.list.useQuery({ take: 100 });
  const records = Array.isArray(query.data) ? query.data as AuditRow[] : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Log" description="Tenant-scoped audit records from the existing audit list procedure." />
      <Card>
        <CardHeader><CardTitle>Audit records</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-xs text-muted-foreground">Source: trpc.customAgents.audit.list (take 100; server applies tenant context).</p>
          {query.isLoading && <p className="text-sm text-muted-foreground">Loading audit records…</p>}
          {query.error && <p role="alert" className="text-sm text-destructive">Could not load audit records: {query.error.message}</p>}
          {!query.isLoading && !query.error && records.length === 0 && <p className="text-sm text-muted-foreground">The audit API returned no records.</p>}
          {records.length > 0 && (
            <Table>
              <TableHeader><TableRow><TableHead>Record</TableHead><TableHead>Action</TableHead><TableHead>Created</TableHead><TableHead>Available fields</TableHead></TableRow></TableHeader>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={record.id ?? index}>
                    <TableCell className="font-mono text-xs">{record.id ?? 'ID unavailable'}</TableCell>
                    <TableCell>{String(record.action ?? record.event ?? 'Action unavailable')}</TableCell>
                    <TableCell>{record.createdAt ? new Date(record.createdAt).toLocaleString() : 'Timestamp unavailable'}</TableCell>
                    <TableCell className="max-w-sm truncate font-mono text-xs">{Object.keys(record).join(', ') || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

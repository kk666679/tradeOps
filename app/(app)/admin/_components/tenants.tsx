'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { trpc } from '@/lib/trpc';

const plans = ['TRIAL', 'STARTER', 'GROWTH', 'OPERATOR', 'ENTERPRISE'] as const;
const statuses = ['ACTIVE', 'SUSPENDED', 'ARCHIVED'] as const;
const isolations = ['POOL', 'SILO', 'CELLULAR'] as const;
type TenantPlan = (typeof plans)[number];
type TenantStatus = (typeof statuses)[number];
type TenantIsolation = (typeof isolations)[number];

type TenantRecord = {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  status: TenantStatus;
  isolation: TenantIsolation;
  region: string;
  locale: string;
  currency: string;
  timezone: string;
  billingEmail: string | null;
  createdAt: string | Date;
};

function TenantQueryState({ loading, error, empty }: { loading: boolean; error?: string; empty?: boolean }) {
  if (loading) return <p className="text-sm text-muted-foreground">Loading tenant data…</p>;
  if (error) return <p role="alert" className="text-sm text-destructive">Could not load tenants: {error}</p>;
  if (empty) return <p className="text-sm text-muted-foreground">The tenant API returned no records.</p>;
  return null;
}

export function TenantList() {
  const query = trpc.tenant.list.useQuery({ take: 100 });
  const tenants = Array.isArray(query.data) ? query.data as TenantRecord[] : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenant Management"
        description="View tenant records available to the authenticated tenant context."
        action={<Button asChild><Link href="/admin/tenants/new">Add tenant</Link></Button>}
      />
      <Card>
        <CardHeader><CardTitle>Tenants</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-xs text-muted-foreground">Source: trpc.tenant.list (take 100; server applies tenant context).</p>
          <TenantQueryState loading={query.isLoading} error={query.error?.message} empty={!query.isLoading && !query.error && tenants.length === 0} />
          {tenants.length > 0 && (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead><TableHead>Region</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.slug}</TableCell>
                    <TableCell><Badge variant="outline">{tenant.plan}</Badge></TableCell>
                    <TableCell>{tenant.status}</TableCell>
                    <TableCell>{tenant.region}</TableCell>
                    <TableCell><Button variant="link" size="sm" asChild><Link href={`/admin/tenants/${tenant.id}`}>Manage</Link></Button></TableCell>
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

export function TenantCreateForm() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.tenant.create.useMutation();
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [plan, setPlan] = React.useState<TenantPlan>('STARTER');
  const [status, setStatus] = React.useState<TenantStatus>('ACTIVE');
  const [isolation, setIsolation] = React.useState<TenantIsolation>('POOL');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await create.mutateAsync({ name, slug, plan, status, isolation });
      await utils.tenant.list.invalidate();
      router.push('/admin/tenants');
    } catch {
      // The mutation error is rendered below.
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Add tenant" description="Create a tenant record using fields accepted by the tenant model." />
      <Card>
        <CardHeader><CardTitle>Tenant details</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-xs text-muted-foreground">Source: trpc.tenant.create. The endpoint applies its authenticated tenant context; cross-tenant provisioning is not exposed here.</p>
          <form onSubmit={submit} className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="tenant-name">Name</Label><Input id="tenant-name" required value={name} onChange={(event) => setName(event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="tenant-slug">Slug</Label><Input id="tenant-slug" required value={slug} onChange={(event) => setSlug(event.target.value)} /></div>
            <div className="space-y-2">
              <Label htmlFor="tenant-plan">Plan</Label>
              <Select value={plan} onValueChange={(value) => setPlan(value as TenantPlan)}><SelectTrigger id="tenant-plan"><SelectValue /></SelectTrigger><SelectContent>{plans.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TenantStatus)}><SelectTrigger id="tenant-status"><SelectValue /></SelectTrigger><SelectContent>{statuses.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-isolation">Isolation</Label>
              <Select value={isolation} onValueChange={(value) => setIsolation(value as TenantIsolation)}><SelectTrigger id="tenant-isolation"><SelectValue /></SelectTrigger><SelectContent>{isolations.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
            </div>
            {create.error && <p role="alert" className="text-sm text-destructive sm:col-span-2">Could not create tenant: {create.error.message}</p>}
            <div className="sm:col-span-2"><Button type="submit" disabled={create.isPending}>{create.isPending ? 'Creating…' : 'Create tenant'}</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function TenantEditor({ id }: { id: string }) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const query = trpc.tenant.byId.useQuery({ id });
  const tenant = query.data as TenantRecord | null | undefined;
  const update = trpc.tenant.update.useMutation();
  const remove = trpc.tenant.delete.useMutation();
  const [name, setName] = React.useState<string | null>(null);
  const [slug, setSlug] = React.useState<string | null>(null);
  const [plan, setPlan] = React.useState<TenantPlan | null>(null);
  const [status, setStatus] = React.useState<TenantStatus | null>(null);

  React.useEffect(() => {
    if (!tenant) return;
    setName(tenant.name);
    setSlug(tenant.slug);
    setPlan(tenant.plan);
    setStatus(tenant.status);
  }, [tenant]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tenant || name === null || slug === null || plan === null || status === null) return;
    try {
      await update.mutateAsync({ id: tenant.id, name, slug, plan, status });
      await utils.tenant.list.invalidate();
      await utils.tenant.byId.invalidate({ id });
    } catch {
      // The mutation error is rendered below.
    }
  }

  async function deleteTenant() {
    if (!tenant || !window.confirm(`Delete tenant ${tenant.name}?`)) return;
    try {
      await remove.mutateAsync({ id: tenant.id });
      await utils.tenant.list.invalidate();
      router.push('/admin/tenants');
    } catch {
      // The mutation error is rendered below.
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Manage tenant" description="Update this tenant record or request its deletion." action={<Button variant="outline" asChild><Link href="/admin/tenants">Back to tenants</Link></Button>} />
      <Card>
        <CardHeader><CardTitle>Tenant details</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-xs text-muted-foreground">Source: trpc.tenant.byId, trpc.tenant.update, trpc.tenant.delete (server applies tenant context).</p>
          <TenantQueryState loading={query.isLoading} error={query.error?.message} empty={query.data === null} />
          {tenant && name !== null && slug !== null && plan !== null && status !== null && (
            <form onSubmit={save} className="grid max-w-2xl gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="tenant-name">Name</Label><Input id="tenant-name" required value={name} onChange={(event) => setName(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="tenant-slug">Slug</Label><Input id="tenant-slug" required value={slug} onChange={(event) => setSlug(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="tenant-plan">Plan</Label><Select value={plan} onValueChange={(value) => setPlan(value as TenantPlan)}><SelectTrigger id="tenant-plan"><SelectValue /></SelectTrigger><SelectContent>{plans.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="tenant-status">Status</Label><Select value={status} onValueChange={(value) => setStatus(value as TenantStatus)}><SelectTrigger id="tenant-status"><SelectValue /></SelectTrigger><SelectContent>{statuses.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
              {update.error && <p role="alert" className="text-sm text-destructive sm:col-span-2">Could not update tenant: {update.error.message}</p>}
              {remove.error && <p role="alert" className="text-sm text-destructive sm:col-span-2">Could not delete tenant: {remove.error.message}</p>}
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <Button type="submit" disabled={update.isPending}>{update.isPending ? 'Saving…' : 'Save changes'}</Button>
                <Button type="button" variant="destructive" disabled={remove.isPending} onClick={deleteTenant}>{remove.isPending ? 'Deleting…' : 'Delete tenant'}</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

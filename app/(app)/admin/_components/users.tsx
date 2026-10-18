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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { trpc } from '@/lib/trpc';

const roles = ['SUPER_ADMIN', 'ADMIN', 'OPS_MANAGER', 'WAREHOUSE_STAFF', 'CUSTOMER', 'AGENT', 'AUDITOR'] as const;
type UserRole = (typeof roles)[number];

function QueryMessage({ loading, error, empty }: { loading: boolean; error?: string; empty?: boolean }) {
  if (loading) return <p className="text-sm text-muted-foreground">Loading tenant users…</p>;
  if (error) return <p role="alert" className="text-sm text-destructive">Could not load users: {error}</p>;
  if (empty) return <p className="text-sm text-muted-foreground">No users were returned for the current tenant.</p>;
  return null;
}

export function UserList() {
  const query = trpc.user.list.useQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Tenant-scoped users and assigned account roles."
        action={<Button asChild><Link href="/admin/users/new">Add user</Link></Button>}
      />
      <Card>
        <CardHeader><CardTitle>Users</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-xs text-muted-foreground">Source: trpc.user.list (tenant-scoped).</p>
          <QueryMessage loading={query.isLoading} error={query.error?.message} empty={query.data?.length === 0} />
          {query.data && query.data.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.name || '—'}</TableCell>
                    <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell><Button variant="link" size="sm" asChild><Link href={`/admin/users/${user.id}`}>Manage</Link></Button></TableCell>
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

export function UserCreateForm() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.user.create.useMutation();
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('WAREHOUSE_STAFF');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await create.mutateAsync({ email, role });
      await utils.user.list.invalidate();
      router.push('/admin/users');
    } catch {
      // The mutation error is rendered below.
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Add user" description="Create a user in the authenticated tenant." />
      <Card>
        <CardHeader><CardTitle>User details</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-xs text-muted-foreground">Source: trpc.user.create (tenant-scoped; admin role required).</p>
          <form onSubmit={submit} className="max-w-xl space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input id="user-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger id="user-role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roles.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {create.error && <p role="alert" className="text-sm text-destructive">Could not create user: {create.error.message}</p>}
            <Button type="submit" disabled={create.isPending}>{create.isPending ? 'Creating…' : 'Create user'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function UserEditor({ id }: { id: string }) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const query = trpc.user.list.useQuery();
  const update = trpc.user.update.useMutation();
  const remove = trpc.user.remove.useMutation();
  const user = query.data?.find((candidate) => candidate.id === id);
  const [name, setName] = React.useState<string | null>(null);
  const [role, setRole] = React.useState<UserRole | null>(null);

  React.useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setRole(user.role);
    }
  }, [user]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || role === null) return;
    try {
      await update.mutateAsync({ id: user.id, name: name ?? '', role });
      await utils.user.list.invalidate();
    } catch {
      // The mutation error is rendered below.
    }
  }

  async function deleteUser() {
    if (!user || !window.confirm(`Remove ${user.email} from this tenant?`)) return;
    try {
      await remove.mutateAsync({ id: user.id });
      await utils.user.list.invalidate();
      router.push('/admin/users');
    } catch {
      // The mutation error is rendered below.
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Manage user" description="Update the account name or role, or remove this tenant user." action={<Button variant="outline" asChild><Link href="/admin/users">Back to users</Link></Button>} />
      <Card>
        <CardHeader><CardTitle>User details</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-xs text-muted-foreground">Source: trpc.user.list, trpc.user.update, trpc.user.remove (tenant-scoped).</p>
          <QueryMessage loading={query.isLoading} error={query.error?.message} empty={Boolean(query.data && !user)} />
          {user && role !== null && (
            <form onSubmit={save} className="max-w-xl space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-email-readonly">Email</Label>
                <Input id="user-email-readonly" value={user.email} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-name">Name</Label>
                <Input id="user-name" value={name ?? ''} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger id="user-role"><SelectValue /></SelectTrigger>
                  <SelectContent>{roles.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {update.error && <p role="alert" className="text-sm text-destructive">Could not update user: {update.error.message}</p>}
              {remove.error && <p role="alert" className="text-sm text-destructive">Could not remove user: {remove.error.message}</p>}
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={update.isPending}>{update.isPending ? 'Saving…' : 'Save changes'}</Button>
                <Button type="button" variant="destructive" disabled={remove.isPending} onClick={deleteUser}>{remove.isPending ? 'Removing…' : 'Remove user'}</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

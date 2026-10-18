import * as React from 'react';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ManufacturingRunStream } from '@/components/ai-composites/orders/manufacturing-run-stream';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = { title: 'Manufacturing Orders' };

function getTenantId(user: unknown): string | null {
  if (typeof user !== 'object' || user === null || !('tenantId' in user)) {
    return null;
  }
  return typeof user.tenantId === 'string' && user.tenantId.length > 0
    ? user.tenantId
    : null;
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  const tenantId = getTenantId(session?.user);
  if (!tenantId) redirect('/login');

  return (
    <div className="space-y-6">
      <PageHeader title="Manufacturing Orders" description="Production planning, work orders, and run tracking" />
      <ManufacturingRunStream tenantId={tenantId} />
    </div>
  );
}
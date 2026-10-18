import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { GatePassIssuer, GateAccessBadge, GateSealVerification } from '@/components/wms/gate';

export const metadata: Metadata = { title: 'Gate Passes' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Gate Passes" description="Gate pass issuance, access badges, and seal verification" />
      <div className="grid gap-4 md:grid-cols-3">
        <GatePassIssuer title="Active Passes" />
        <GateAccessBadge />
        <GateSealVerification />
      </div>
      <WmsCrudSurface resource="gate" title="gate passes records" allowCreate />
    </div>
  );
}
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinBondedLayer } from '@/components/digital-twin/zones/TwinBondedLayer';

export const metadata: Metadata = { title: 'Bonded Zone' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bonded Zone" description="Bonded warehouse digital twin layer" />
      <TwinBondedLayer />
    </div>
  );
}
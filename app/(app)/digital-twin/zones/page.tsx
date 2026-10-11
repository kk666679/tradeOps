import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinBondedLayer } from '@/components/digital-twin/zones/TwinBondedLayer';
import { TwinFczLayer } from '@/components/digital-twin/zones/TwinFczLayer';
import { TwinFizLayer } from '@/components/digital-twin/zones/TwinFizLayer';
import { TwinGateLayer } from '@/components/digital-twin/zones/TwinGateLayer';

export const metadata: Metadata = { title: 'Zone Overview' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Zone Overview" description="Bonded, FCZ, FIZ, and Gate zone digital twin layers" />
      <div className="grid gap-6 lg:grid-cols-2">
        <TwinBondedLayer />
        <TwinFczLayer />
        <TwinFizLayer />
        <TwinGateLayer />
      </div>
    </div>
  );
}
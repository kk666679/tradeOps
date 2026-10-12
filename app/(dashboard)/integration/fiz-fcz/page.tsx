import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizFczGateway } from '@/components/integration/FizFczGateway';

export const metadata: Metadata = { title: 'FIZ/FCZ Integration' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="FIZ/FCZ Integration" description="Free Industrial Zone and Free Commercial Zone gateway integration" />
      <FizFczGateway />
    </div>
  );
}
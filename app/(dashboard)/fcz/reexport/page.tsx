import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczReexportPanel } from '@/components/fiz-fcz/fcz/FczReexportPanel';

export const metadata: Metadata = { title: 'Re-export' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Re-export Operations" description="Re-export documentation and compliance" />
      <FczReexportPanel />
    </div>
  );
}
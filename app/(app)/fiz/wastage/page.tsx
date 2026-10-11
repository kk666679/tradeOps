import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizWastageScrapPanel } from '@/components/fiz-fcz/fiz/FizWastageScrapPanel';

export const metadata: Metadata = { title: 'Wastage & Scrap' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Wastage & Scrap" description="Wastage tracking, scrap management, and yield analysis" />
      <FizWastageScrapPanel />
    </div>
  );
}
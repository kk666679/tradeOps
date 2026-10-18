import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { DocumentExtractionAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Documents' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Documents" description="Route: /custom-agents/customs-agents/documents" />
      <DocumentExtractionAgent />
    </div>
  );
}

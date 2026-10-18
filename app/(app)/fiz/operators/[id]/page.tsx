import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizOperatorDetails } from '../_components/FizOperatorDetails';

export const metadata: Metadata = { title: 'FIZ Operator' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title="FIZ Operator" description="Operator licensing and compliance details." />
      <FizOperatorDetails id={id} />
    </div>
  );
}

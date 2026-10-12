import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizOperatorList } from './_components/FizOperatorList';

export const metadata: Metadata = { title: 'Operators' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Operator Registry" description="FIZ operator licensing and compliance" />
      <FizOperatorList />
    </div>
  );
}
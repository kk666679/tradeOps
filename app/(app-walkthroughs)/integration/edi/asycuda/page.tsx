import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { EdiAsycudaMapper } from '@/components/integration/edi/EdiAsycudaMapper';

export const metadata: Metadata = { title: 'ASYCUDA' };

export function EdiAsycudaPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="ASYCUDA" description="ASYCUDA message mapping surface. Mapping data is not connected to this view." />
      <div className="min-w-0">
                <EdiAsycudaMapper />
      </div>
    </div>
  );
}

export default EdiAsycudaPage;

import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { EdiSegmentInspector } from '@/components/integration/edi/EdiSegmentInspector';

export const metadata: Metadata = { title: 'Segments' };

export function EdiSegmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Segments" description="EDI segment inspection. Segment data is not connected to this view." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <EdiSegmentInspector title="Segment inspector" hint="Segment data is not connected to this view." />
      </div>
    </div>
  );
}

export default EdiSegmentsPage;

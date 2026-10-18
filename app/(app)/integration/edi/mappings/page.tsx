import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { EdiMappingEditor } from '@/components/integration/edi/EdiMappingEditor';

export const metadata: Metadata = { title: 'Mappings' };

export function EdiMappingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Mappings" description="EDI mapping editor. Mapping definitions are not connected to this view." />
      <div className="min-w-0">
                <EdiMappingEditor />
      </div>
    </div>
  );
}

export default EdiMappingsPage;

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BomViewer } from '@/components/order-management/manufacturing/BomViewer';

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bill of Materials" description="Manufacturing bill of materials" />
      <BomViewer />
    </div>
  );
}

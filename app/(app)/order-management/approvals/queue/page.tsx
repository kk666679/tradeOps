'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ApprovalQueue } from '@/components/order-management/approvals/ApprovalQueue';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const utils = trpc.useUtils();
  const approvals = trpc.orderManagement.approvals.list.useQuery({ take: 100 });
  const update = trpc.orderManagement.approvals.update.useMutation({
    onSuccess: async () => utils.orderManagement.approvals.list.invalidate(),
  });
  const rows = (approvals.data ?? []).map((record: any) => ({
    id: record.id,
    ref: String(record.ref ?? record.id),
    reason: String(record.reason ?? record.metadata?.reason ?? record.kind ?? 'Approval required'),
    severity: record.severity === 'high' || record.severity === 'low' ? record.severity : 'medium',
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Queue" description="Review and resolve pending order approvals" />
      <ApprovalQueue
        items={rows}
        onApprove={(id) => update.mutate({ id, status: 'APPROVED' })}
        onReject={(id) => update.mutate({ id, status: 'REJECTED' })}
      />
      {approvals.isLoading ? <p className="text-sm text-muted-foreground">Loading approvals…</p> : null}
      {approvals.error ? <p className="text-sm text-destructive">{approvals.error.message}</p> : null}
    </div>
  );
}

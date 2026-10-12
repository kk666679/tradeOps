'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { EscalationPanel } from '@/components/order-management/approvals/EscalationPanel';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const utils = trpc.useUtils();
  const approvals = trpc.orderManagement.approvals.list.useQuery({ take: 100 });
  const update = trpc.orderManagement.approvals.update.useMutation({
    onSuccess: async () => utils.orderManagement.approvals.list.invalidate(),
  });
  const items = (approvals.data ?? []).map((record: any) => ({
    id: record.id,
    ref: String(record.ref ?? record.id),
    reason: String(record.reason ?? record.metadata?.reason ?? record.kind ?? 'Escalation review required'),
    severity: record.severity === 'high' || record.severity === 'low' ? record.severity : 'medium',
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Escalations" description="Review escalated order approvals" />
      <EscalationPanel
        items={items}
        onApprove={(id) => update.mutate({ id, status: 'APPROVED' })}
        onReject={(id) => update.mutate({ id, status: 'REJECTED' })}
      />
      {approvals.isLoading ? <p className="text-sm text-muted-foreground">Loading escalations…</p> : null}
      {approvals.error ? <p className="text-sm text-destructive">{approvals.error.message}</p> : null}
    </div>
  );
}

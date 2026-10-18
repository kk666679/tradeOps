'use client';

import { use } from 'react';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { PurchaseOrderDetail } from '@/components/order-management/purchase/PurchaseOrderDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const order = trpc.orderManagement.purchase.byId.useQuery({ id }, { enabled: Boolean(id) });

  return (
    <div className="space-y-6">
      <PageHeader title={`Purchase Order ${id}`} description="Purchase order details" />
      <PurchaseOrderDetail id={id} />
      <Card>
        <CardHeader><CardTitle>Order record</CardTitle></CardHeader>
        <CardContent>
          {order.isLoading ? <p className="text-sm text-muted-foreground">Loading order…</p> : null}
          {order.error ? <p className="text-sm text-destructive">{order.error.message}</p> : null}
          {order.data ? <pre className="overflow-auto text-xs">{JSON.stringify(order.data, null, 2)}</pre> : null}
          {!order.isLoading && !order.error && !order.data ? <p className="text-sm text-muted-foreground">Order not found.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}

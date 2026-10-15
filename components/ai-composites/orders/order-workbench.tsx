'use client';

import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Loader2, Package, Truck, Ship, Plane, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Order {
  id: string;
  reference: string;
  type: 'purchase' | 'sales' | 'transfer' | 'manufacturing';
  status: 'draft' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  customerId: string;
  customerName: string;
  totalValue: number;
  currency: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  expectedDate?: string;
}

interface OrderItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export function OrderWorkbench({ tenantId = '', className = '' }: { tenantId?: string; className?: string }) {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', tenantId],
    queryFn: () => trpc.orderManagement.purchase.list.query({ tenantId, limit: 50 }),
    enabled: !!tenantId,
  });

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  const typeIcons: Record<string, React.ReactNode> = {
    purchase: <Package className="w-4 h-4" />,
    sales: <Truck className="w-4 h-4" />,
    transfer: <Ship className="w-4 h-4" />,
    manufacturing: <Plane className="w-4 h-4" />,
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className={className}>
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Order Workbench</h2>
            <p className="text-sm text-muted-foreground">Manage and track all orders across the operation</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search orders..." className="w-[250px]" />
            <Button>Create Order</Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="list" className="p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List View ({orders?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order: Order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.reference}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        {typeIcons[order.type]}
                        <span className="capitalize">{order.type}</span>
                      </span>
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[order.status]}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={priorityColors[order.priority]}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {order.currency} {order.totalValue.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {order.expectedDate ? format(new Date(order.expectedDate), 'MMM d, yyyy') : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="kanban">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {['draft', 'pending', 'confirmed', 'in_progress'].map((status) => (
              <div key={status} className="bg-muted/50 rounded-lg p-3 min-h-[400px]">
                <h3 className="font-medium text-sm mb-2 capitalize">{status.replace('_', ' ')}</h3>
                <div className="space-y-2">
                  {orders?.filter((o: Order) => o.status === status).map((order: Order) => (
                    <div key={order.id} className="bg-background border rounded p-3 shadow-sm">
                      <p className="font-mono text-xs font-medium">{order.reference}</p>
                      <p className="text-xs text-muted-foreground">{order.customerName}</p>
                      <p className="text-xs font-medium">{order.currency} {order.totalValue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default OrderWorkbench;
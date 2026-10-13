'use client';

import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc/client';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, formatDistanceToNow } from 'date-fns';
import { Loader2, Factory, Timer, CheckCircle, AlertTriangle, RotateCcw, TrendingUp } from 'lucide-react';

interface ManufacturingRun {
  id: string;
  reference: string;
  productSku: string;
  productName: string;
  status: 'scheduled' | 'in_progress' | 'paused' | 'completed' | 'failed' | 'cancelled';
  plannedQty: number;
  completedQty: number;
  rejectedQty: number;
  startTime?: string;
  endTime?: string;
  estimatedEndTime?: string;
  workCenter: string;
  operator?: string;
  batchNumber?: string;
  qualityChecks: QualityCheck[];
  steps: ManufacturingStep[];
}

interface QualityCheck {
  id: string;
  name: string;
  status: 'pending' | 'passed' | 'failed';
  value?: number;
  target?: number;
  unit?: string;
  checkedAt?: string;
  checkedBy?: string;
}

interface ManufacturingStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  duration?: number;
  startTime?: string;
  endTime?: string;
}

export function ManufacturingRunStream({ tenantId, className = '' }: { tenantId: string; className?: string }) {
  const { data: runs, isLoading } = useQuery({
    queryKey: ['manufacturing-runs', tenantId],
    queryFn: () => trpc.orderManagement.manufacturing.listRuns.query({ tenantId, limit: 20 }),
    enabled: !!tenantId,
    refetchInterval: 10000,
  });

  const statusColors: Record<string, string> = {
    scheduled: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    scheduled: <Timer className="w-4 h-4" />,
    in_progress: <RotateCcw className="w-4 h-4 animate-spin" />,
    paused: <Timer className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    failed: <AlertTriangle className="w-4 h-4" />,
    cancelled: <AlertTriangle className="w-4 h-4" />,
  };

  const activeRuns = runs?.filter((r: ManufacturingRun) => 
    ['in_progress', 'paused'].includes(r.status)
  ) ?? [];

  const completedRuns = runs?.filter((r: ManufacturingRun) => 
    ['completed', 'failed', 'cancelled'].includes(r.status)
  ) ?? [];

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
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Factory className="w-5 h-5" />
              Manufacturing Run Stream
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time visibility into production runs across work centers
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                {activeRuns.length} Active
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                {completedRuns.length} Completed Today
              </span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="active" className="p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Runs ({activeRuns.length})</TabsTrigger>
          <TabsTrigger value="history">History ({completedRuns.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeRuns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Factory className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No active manufacturing runs</p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {activeRuns.map((run: ManufacturingRun) => (
                <Card key={run.id} className="border-l-4 border-blue-500">
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {statusIcons[run.status]}
                        </div>
                        <div>
                          <p className="font-semibold">{run.reference}</p>
                          <p className="text-sm text-muted-foreground">{run.productName} ({run.productSku})</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className={statusColors[run.status]}>
                          {statusIcons[run.status]}
                          {run.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Planned</p>
                        <p className="font-semibold">{run.plannedQty.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Completed</p>
                        <p className="font-semibold text-green-600">{run.completedQty.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Rejected</p>
                        <p className="font-semibold text-red-600">{run.rejectedQty.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <Progress 
                          value={run.plannedQty > 0 ? (run.completedQty / run.plannedQty) * 100 : 0} 
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Work Center</p>
                        <p className="font-medium">{run.workCenter}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Operator</p>
                        <p className="font-medium">{run.operator ?? 'Unassigned'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Batch</p>
                        <p className="font-medium">{run.batchNumber ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Started</p>
                        <p className="font-medium">
                          {run.startTime ? formatDistanceToNow(new Date(run.startTime), { addSuffix: true }) : 'Not started'}
                        </p>
                      </div>
                    </div>

                    {run.qualityChecks.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Quality Checks</p>
                        <div className="flex flex-wrap gap-2">
                          {run.qualityChecks.map((check: QualityCheck) => (
                            <Badge 
                              key={check.id} 
                              variant={check.status === 'passed' ? 'default' : check.status === 'failed' ? 'destructive' : 'secondary'}
                              className="gap-1"
                            >
                              {check.name}: {check.status}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="overflow-x-auto mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Planned</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Yield</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Completed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedRuns.map((run: ManufacturingRun) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-mono text-sm">{run.reference}</TableCell>
                    <TableCell>{run.productName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[run.status]}>
                        {run.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{run.plannedQty.toLocaleString()}</TableCell>
                    <TableCell>{run.completedQty.toLocaleString()}</TableCell>
                    <TableCell>
                      {run.plannedQty > 0 
                        ? `${((run.completedQty / run.plannedQty) * 100).toFixed(1)}%`
                        : '0%'}
                    </TableCell>
                    <TableCell>
                      {run.startTime && run.endTime 
                        ? formatDistanceToNow(new Date(run.startTime), { addSuffix: false })
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {run.endTime ? format(new Date(run.endTime), 'MMM d, HH:mm') : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default ManufacturingRunStream;
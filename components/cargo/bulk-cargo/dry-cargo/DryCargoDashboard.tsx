import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { 
  AIStatistic, 
  AIDataTable 
} from '@/components/common';
import { 
  Package, 
  Truck, 
  Thermometer 
} from 'lucide-react';
import { DryCargoList } from './';

interface DryCargoStats {
  totalTons: number;
  inTransit: number;
  moistureAvg: number;
  issues: number;
}

const DryCargoDashboard = () => {
  const { data } = trpc.cargo.bulk.list.useQuery({ take: 200 }, { initialData: [] });
  const dryCargo: DryCargoStats[] = (data ?? [])
    .filter((item: { type?: string }) => item.type === 'dry')
    .map((item: { tons?: number; status?: string; moisture?: number }) => ({
      totalTons: item.tons ?? 0,
      inTransit: item.status === 'transit' ? 1 : 0,
      moistureAvg: item.moisture ?? 0,
      issues: item.status === 'issue' ? 1 : 0,
    }));
  const stats = {
    totalTons: dryCargo.reduce((total, item) => total + item.totalTons, 0),
    inTransit: dryCargo.reduce((total, item) => total + item.inTransit, 0),
    moistureAvg: dryCargo.length
      ? dryCargo.reduce((total, item) => total + item.moistureAvg, 0) / dryCargo.length
      : 0,
    issues: dryCargo.reduce((total, item) => total + item.issues, 0),
  };

  const statsData = [
    { title: 'Total Dry Cargo', value: stats?.totalTons || 0, icon: Package, trend: '+12%' },
    { title: 'In Transit', value: stats?.inTransit || 0, icon: Truck, trend: '-2%' },
    { title: 'Avg Moisture %', value: (stats?.moistureAvg || 0).toFixed(1), icon: Thermometer, trend: '+0.5%' },
    { title: 'Issues', value: stats?.issues || 0, icon: AlertTriangle, trend: '+1' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => (
          <AIStatistic key={i} {...stat} />
        ))}
      </div>
      <DryCargoList />
    </div>
  );
};

export default DryCargoDashboard;

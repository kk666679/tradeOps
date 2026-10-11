import React from 'react';
import { Truck } from 'lucide-react';
import { trpc } from '@/app/_trpc/client';
import { 
  AIStatistic 
} from '@/components/common';
import { 
  Droplets, 
  Thermometer 
} from 'lucide-react';
import { LiquidCargoList } from './';

interface LiquidCargoStats {
  totalTons: number;
  inTransit: number;
  densityAvg: number;
  temperatureAvg: number;
}

const LiquidCargoDashboard = () => {
  const { data } = trpc.cargo.bulk.list.useQuery({ take: 200 }, { initialData: [] });
  const liquidCargo: LiquidCargoStats[] = (data ?? [])
    .filter((item: { type?: string }) => item.type === 'liquid')
    .map((item: { tons?: number; status?: string; density?: number; temperature?: number }) => ({
      totalTons: item.tons ?? 0,
      inTransit: item.status === 'transit' ? 1 : 0,
      densityAvg: item.density ?? 0,
      temperatureAvg: item.temperature ?? 0,
    }));
  const stats = {
    totalTons: liquidCargo.reduce((total, item) => total + item.totalTons, 0),
    inTransit: liquidCargo.reduce((total, item) => total + item.inTransit, 0),
    densityAvg: liquidCargo.length
      ? liquidCargo.reduce((total, item) => total + item.densityAvg, 0) / liquidCargo.length
      : 0,
    temperatureAvg: liquidCargo.length
      ? liquidCargo.reduce((total, item) => total + item.temperatureAvg, 0) / liquidCargo.length
      : 0,
  };

  const statsData = [
    { title: 'Total Liquid Cargo', value: stats?.totalTons || 0, icon: Droplets, trend: '+8%' },
    { title: 'In Transit', value: stats?.inTransit || 0, icon: Truck, trend: '+3%' },
    { title: 'Avg Density', value: (stats?.densityAvg || 0).toFixed(2), icon: Thermometer, trend: '-0.1' },
    { title: 'Avg Temp °C', value: (stats?.temperatureAvg || 0).toFixed(1), icon: Thermometer, trend: '+1.2' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => (
          <AIStatistic key={i} {...stat} />
        ))}
      </div>
<LiquidCargoList />
    </div>
  );
};

export default LiquidCargoDashboard;

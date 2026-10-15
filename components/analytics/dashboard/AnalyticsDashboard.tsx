import { DashboardGrid } from '@/components/dashboard/grid/DashboardGrid';
import { AreaChartTile } from '@/components/dashboard/charts/AreaChartTile';

const DEMO_DATA = [
  { name: 'Mon', value: 42 }, { name: 'Tue', value: 58 }, { name: 'Wed', value: 71 },
  { name: 'Thu', value: 62 }, { name: 'Fri', value: 84 }, { name: 'Sat', value: 41 }, { name: 'Sun', value: 28 },
];

export function AnalyticsDashboard() {
  return (
    <DashboardGrid cols={3}>
      <AreaChartTile title="Throughput" data={DEMO_DATA} dataKey="value" color="#3b82f6" />
      <AreaChartTile title="Clearance time" data={DEMO_DATA} dataKey="value" color="#10b981" />
      <AreaChartTile title="Exceptions" data={DEMO_DATA} dataKey="value" color="#f59e0b" />
    </DashboardGrid>
  );
}
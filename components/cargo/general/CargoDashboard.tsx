'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIMetricCard, AILiveBadge, AIInsightCard } from "@/components/common";
import { trpc } from "@/lib/trpc";
import { Truck, Package, AlertCircle, Activity, BadgeCheck } from "lucide-react";

interface Stat {
  title: string;
  value: string | number;
  trend: { value: number; label: string };
  icon: any;
}

export default function CargoDashboard() {
  const { data: metrics } = trpc.dashboard.getMetrics.useQuery(undefined, {
    initialData: { inventoryCount: 0, cargoCount: 0, activeOutboundCount: 0, warningCount: 0 }
  });

  const stats: Stat[] = [
    { 
      title: "Total Shipments", 
      value: metrics.cargoCount,
      trend: { value: 12, label: "from yesterday" }, 
      icon: Package 
    },
    { 
      title: "Active Cargo", 
      value: metrics.activeOutboundCount,
      trend: { value: 8, label: "from yesterday" }, 
      icon: Truck 
    },
    { 
      title: "Delays", 
      value: metrics.warningCount,
      trend: { value: -2, label: "from yesterday" }, 
      icon: AlertCircle 
    },
    { 
      title: "Inventory Items",
      value: metrics.inventoryCount.toLocaleString(),
      trend: { value: 15, label: "from yesterday" }, 
      icon: Package
    },
  ];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 min-h-screen">
      <div className="flex justify-between items-center animate-fade-in">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100">
            General Cargo Dashboard
          </h1>
          <p className="text-muted-foreground text-lg mt-1">Real-time shipping & logistics overview</p>
        </div>
        <AILiveBadge status="live" pulse className="animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <AIMetricCard 
            key={stat.title} 
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
            className="animate-slide-up hover:scale-[1.02] transition-all duration-300 shadow-lg"
            description="Updated 2 mins ago"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIInsightCard
          title="Operations Overview"
          insight={
            metrics.warningCount > 0
              ? `${metrics.warningCount} operational warning${metrics.warningCount === 1 ? '' : 's'} need review.`
              : 'No active operational warnings.'
          }
          type="info"
          recommendation={metrics.warningCount > 0 ? 'Review the active warnings.' : 'Operations are within normal limits.'}
          className="shadow-xl"
        />
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Activity className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Cargo #1234 departed Shanghai</p>
                  <p className="text-xs text-muted-foreground">2 min ago</p>
                </div>
              </li>
              <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <BadgeCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Delay resolved on #567</p>
                  <p className="text-xs text-muted-foreground">5 min ago</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

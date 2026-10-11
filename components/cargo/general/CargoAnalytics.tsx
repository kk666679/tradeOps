'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIChartContainer } from "@/components/common/aichart-container";
import { AIMetricCard } from "@/components/common/aimetric-card";
import { AIDataTable } from "@/components/common/aidata-table";
import { Package, Truck, DollarSign, Activity, Users, Globe, CheckCircle } from "lucide-react";
import { AILiveBadge } from "@/components/common/ailive-badge";

const analyticsData = {
  kpis: [
    { title: "Total Volume", value: "2.4M tons", trend: { value: 8, label: "month" }, icon: Package },
    { title: "Shipments", value: "1,247", trend: { value: 12, label: "month" }, icon: Truck },
    { title: "Avg Cost/Shipment", value: "$92.5k", trend: { value: -3, label: "month" }, icon: DollarSign },
    { title: "On-Time Delivery", value: "97.2%", trend: { value: 2, label: "month" }, icon: CheckCircle },
  ],
  chartData: [
    { name: "Jan", shipments: 280, revenue: 120000 },
    { name: "Feb", shipments: 320, revenue: 145000 },
    { name: "Mar", shipments: 410, revenue: 180000 },
    { name: "Apr", shipments: 380, revenue: 165000 },
    { name: "May", shipments: 450, revenue: 210000 },
  ],
  recentActivity: [
    { id: "CAR001", action: "Delivered", time: "2h ago", status: "success" },
    { id: "CAR002", action: "Delayed", time: "4h ago", status: "warning" },
    { id: "CAR003", action: "In Transit", time: "6h ago", status: "info" },
  ]
};

const columns = [
  {
    accessorKey: "id",
    header: "Cargo ID",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export default function CargoAnalytics() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-start lg:items-center flex-col lg:flex-row gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Cargo Analytics
          </h1>
          <p className="text-muted-foreground mt-2">Performance metrics and insights</p>
        </div>
        <AILiveBadge status="live" size="lg" className="self-start lg:self-end" />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.kpis.map((kpi, i) => (
          <AIMetricCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            icon={kpi.icon}
            description="Monthly average"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipments vs Revenue Chart */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Shipments & Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AIChartContainer
              data={analyticsData.chartData}
              type="line"
              xKey="name"
              yKeys={["shipments", "revenue"]}
              height={350}
              syncCursor
            />
          </CardContent>
        </Card>

        {/* Recent Activity Table */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <AIDataTable
              columns={columns}
              data={analyticsData.recentActivity}
              enablePagination={false}
              className="h-[350px]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


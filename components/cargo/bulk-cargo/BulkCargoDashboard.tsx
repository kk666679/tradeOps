import React from 'react';
import { AIMetricCard, AILiveBadge, AIStatistic } from '@/components/common';
import { Agent, AgentHeader } from '@/components/ai-elements/agent';
import { Tool, ToolHeader } from '@/components/ai-elements/tool';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, Droplets, Leaf } from 'lucide-react';

const BulkCargoDashboard = () => {
  const metrics = {
    totalTons: 12500,
    dryBulk: 7800,
    liquidBulk: 4700,
    silosUtilization: 87,
    moistureRisk: 2.3,
    loadingEfficiency: 94.5,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AIMetricCard 
          title="Total Bulk Cargo" 
          value={` ${metrics.totalTons.toLocaleString()} tons`}
          icon={Package}
          trend={{ up: true, value: 12 }}
          description="Monthly total handled"
        >
          <AILiveBadge status="live" />
        </AIMetricCard>
        <AIMetricCard 
          title="Dry Bulk" 
          value={`${metrics.dryBulk.toLocaleString()} tons`}
          icon={Package}
          trend={{ up: true, value: 8 }}
          description="Dry cargo handled"
        >
          <AILiveBadge status="live" />
        </AIMetricCard>
        <AIMetricCard 
          title="Liquid Bulk" 
          value={`${metrics.liquidBulk.toLocaleString()} tons`}
          icon={Droplets}
          trend={{ up: false, value: -3 }}
          description="Liquid cargo handled"
        >
          <AILiveBadge status="live" />
        </AIMetricCard>
        <AIMetricCard 
          title="Silos Utilization" 
          value={`${metrics.silosUtilization}%`}
          icon={Truck}
          description="Current capacity usage"
        >
          <AILiveBadge status="live" />
        </AIMetricCard>
        <AIMetricCard 
          title="Moisture Risk" 
          value={`${metrics.moistureRisk}%`}
          icon={Leaf}
          trend={{ up: false, value: -0.5 }}
          description="Risk assessment"
        >
          <AILiveBadge status="live" />
        </AIMetricCard>
        <AIMetricCard 
          title="Loading Efficiency" 
          value={`${metrics.loadingEfficiency}%`}
          icon={Truck}
          trend={{ up: true, value: 2 }}
          description="Operational efficiency"
        >
          <AILiveBadge status="live" />
        </AIMetricCard>
      </div>

      {/* AI Agent for Bulk Cargo Optimization */}
      <Card>
        <CardHeader>
          <CardTitle>AI Cargo Optimizer</CardTitle>
        </CardHeader>
        <CardContent>
          <Agent>
            <AgentHeader name="Bulk Cargo Optimizer" model="GPT-4" />
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                AI agent continuously optimizing cargo loading, routing, and storage allocation.
              </p>
            </div>
          </Agent>
        </CardContent>
      </Card>

{/* AI Tool Execution Status */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <Tool>
            <ToolHeader title="Load Balancing Optimization" type="tool-call" state="output-available" />
            <div className="p-4">
              <p className="text-sm">Optimized silo allocation for 94.5% efficiency improvement.</p>
            </div>
          </Tool>
        </CardContent>
      </Card>
    </div>
  );
};


export default BulkCargoDashboard;

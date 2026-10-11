'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { ScenarioRunner } from '@/components/ai-control/scenario-runner';
import { StateMachineView } from '@/components/ai-control/state-machine-view';
import { Agent, LogisticsKPI, ScmTrends } from '@/components/ai-elements';
import { DigitalTwin } from './DigitalTwin';

export interface IntelligenceProps {
  className?: string;
  zone?: 'FIZ' | 'FCZ' | 'BONDED';
  tenantId?: string;
}

/**
 * Intelligence Composite
 *
 * A comprehensive AI control and intelligence dashboard combining scenario runner,
 * state machine inspection, KPI metrics, and AI elements (Agent, Checkpoint, Plan).
 * Supports multi-zone selection (FIZ, FCZ, BONDED) with responsive grid layout.
 */
export function Intelligence({ className, zone: initialZone = 'FIZ', tenantId }: IntelligenceProps) {
  const [zone, setZone] = React.useState<'FIZ' | 'FCZ' | 'BONDED'>(initialZone);

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Intelligence Center</h2>
            <p className="text-sm text-muted-foreground">
              Scenario planning, state inspection, and operational KPIs
            </p>
          </div>
          {tenantId && (
            <Badge variant="secondary" className="text-xs">
              Tenant: {tenantId}
            </Badge>
          )}
        </div>
      </div>

      {/* Zone Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b pb-4">
        {(['FIZ', 'FCZ', 'BONDED'] as const).map((z) => (
          <button
            key={z}
            onClick={() => setZone(z)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              z === zone
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {z}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <DashboardGrid columns={3} gap="md">
        {/* ScenarioRunner */}
        <div className="lg:col-span-2">
          <ScenarioRunner 
            title="Scenario Runner" 
          />
        </div>

        {/* StateMachineView */}
        <div>
          <StateMachineView 
            title="Declaration States"
          />
        </div>

        {/* LogisticsKPI */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Logistics KPI</CardTitle>
              <CardDescription>Performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <LogisticsKPI />
            </CardContent>
          </Card>
        </div>

        {/* ScmTrends */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SCM Trends</CardTitle>
              <CardDescription>Supply chain metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ScmTrends />
            </CardContent>
          </Card>
        </div>

        {/* Agent */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Agent</CardTitle>
              <CardDescription>Assistant status</CardDescription>
            </CardHeader>
            <CardContent>
              <Agent />
            </CardContent>
          </Card>
        </div>
      </DashboardGrid>

      {/* DigitalTwin Section */}
      <div className="mt-6 space-y-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Digital Twin Simulation</CardTitle>
            <CardDescription>
              Real-time scenario readiness and asset simulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DigitalTwin className="min-h-[200px]" data-zone={zone} />
            <p className="mt-4 text-xs text-muted-foreground">
              Digital Twin simulation for zone {zone}. Configure scenarios above to see live updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Intelligence;

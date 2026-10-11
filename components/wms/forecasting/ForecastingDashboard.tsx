"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AIDataPoint } from "@/components/common/aidata-point"
import { AIActionCard } from "@/components/common/aiaction-card"
import { AIMetricCard } from "@/components/common/aimetric-card"
import { AILiveBadge } from "@/components/common/ailive-badge"
import { Badge } from "@/components/ui/badge"
import { ForecastChart, AnomaliesList, DelayList, DemandPredictor } from "."
import { BarChart3, TrendingUp, AlertTriangle, Zap } from "lucide-react"
import { useState } from "react"

interface ForecastMetric {
  label: string
  value: number
  previousValue?: number
  change?: number
  unit?: string
}

export default function ForecastingDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "forecast" | "anomalies" | "delays" | "predict">("overview")

  const metrics: ForecastMetric[] = [
    {
      label: "Predicted Demand",
      value: 1250,
      previousValue: 1180,
      change: 5.9,
      unit: "containers"
    },
    {
      label: "Forecast Accuracy",
      value: 94.2,
      previousValue: 92.8,
      change: 1.4,
      unit: "%"
    },
    {
      label: "Anomalies Detected",
      value: 12,
      previousValue: 8,
      change: 50,
    },
    {
      label: "Avg Delay",
      value: 1.8,
      previousValue: 2.1,
      change: -14.3,
      unit: "days"
    }
  ]

  const actions = [
    {
      label: "Generate New Forecast",
      onClick: () => setActiveTab("predict"),
      icon: <BarChart3 className="h-4 w-4" />,
      priority: "high" as const
    },
    {
      label: "Review Anomalies",
      onClick: () => setActiveTab("anomalies"),
      icon: <AlertTriangle className="h-4 w-4" />,
      priority: "high" as const
    },
    {
      label: "Predict Delays",
      onClick: () => setActiveTab("delays"),
      icon: <TrendingUp className="h-4 w-4" />,
      status: "pending" as const
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Demand Forecasting</h1>
          <p className="text-muted-foreground">AI-powered container demand predictions and anomaly detection</p>
        </div>
        <AILiveBadge status="live" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <AIMetricCard
            key={metric.label}
            title={metric.label}
            value={metric.value}
            trend={{
              value: metric.change || 0,
              label: metric.unit || ""
            }}
            icon={BarChart3}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <AIActionCard
            key={action.label}
            title={action.label}
            description={`Quick access to ${action.label.toLowerCase()}`}
            actions={[{ label: "Open", onClick: action.onClick, icon: action.icon }]}
            priority={action.priority}
            status={action.status}
          />
        ))}
      </div>

      {/* Main Content Tabs */}
      <Card>
        <div className="flex p-4 border-b">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className="flex-1"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "forecast" ? "default" : "ghost"}
            onClick={() => setActiveTab("forecast")}
            className="flex-1"
          >
            Forecast
          </Button>
          <Button
            variant={activeTab === "anomalies" ? "default" : "ghost"}
            onClick={() => setActiveTab("anomalies")}
            className="flex-1"
          >
            Anomalies
          </Button>
          <Button
            variant={activeTab === "delays" ? "default" : "ghost"}
            onClick={() => setActiveTab("delays")}
            className="flex-1"
          >
            Delays
          </Button>
          <Button
            variant={activeTab === "predict" ? "default" : "ghost"}
            onClick={() => setActiveTab("predict")}
            className="flex-1"
          >
            Predict
          </Button>
        </div>
        <CardContent className="p-4">
          {activeTab === "overview" && <ForecastChart />}
          {activeTab === "forecast" && <div className="text-center py-12 text-muted-foreground">Forecast chart coming soon</div>}
          {activeTab === "anomalies" && <AnomaliesList />}
          {activeTab === "delays" && <DelayList />}
          {activeTab === "predict" && <DemandPredictor />}
        </CardContent>
      </Card>
    </div>
  )
}
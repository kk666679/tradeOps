"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Target, BarChart3, PieChart, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Analysis Types
export interface AnalysisMetric {
  label: string;
  value: number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  target?: number;
}

export interface AnalysisChartData {
  label: string;
  value: number;
  color?: string;
}

export interface AnalysisInsight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
  recommendation?: string;
}

// Analysis Card
interface AIAnalysisCardProps {
  title: string;
  description?: string;
  metrics?: AnalysisMetric[];
  charts?: {
    bar?: AnalysisChartData[];
    pie?: AnalysisChartData[];
    trend?: AnalysisChartData[];
  };
  insights?: AnalysisInsight[];
  className?: string;
}

export function AIAnalysisCard({
  title,
  description,
  metrics,
  charts,
  insights,
  className,
}: AIAnalysisCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-chart-3 to-chart-4">
            <BarChart3 className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics && metrics.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric, idx) => (
              <AnalysisMetricItem key={idx} metric={metric} />
            ))}
          </div>
        )}

        {charts && (
          <Tabs defaultValue="bar" className="w-full">
            <TabsList>
              {charts.bar && <TabsTrigger value="bar">Bar</TabsTrigger>}
              {charts.pie && <TabsTrigger value="pie">Pie</TabsTrigger>}
              {charts.trend && <TabsTrigger value="trend">Trend</TabsTrigger>}
            </TabsList>
            {charts.bar && (
              <TabsContent value="bar" className="mt-4">
                <BarChart data={charts.bar} />
              </TabsContent>
            )}
            {charts.pie && (
              <TabsContent value="pie" className="mt-4">
                <PieChartDisplay data={charts.pie} />
              </TabsContent>
            )}
            {charts.trend && (
              <TabsContent value="trend" className="mt-4">
                <TrendChart data={charts.trend} />
              </TabsContent>
            )}
          </Tabs>
        )}

        {insights && insights.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Key Insights</h4>
            {insights.map((insight) => (
              <AnalysisInsightItem key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Metric Item
function AnalysisMetricItem({ metric }: { metric: AnalysisMetric }) {
  const TrendIcon = metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : null;
  const trendColor = metric.trend === "up" ? "text-success" : metric.trend === "down" ? "text-destructive" : "text-muted-foreground";

  const progressValue = metric.target ? (metric.value / metric.target) * 100 : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border bg-card p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{metric.label}</span>
        {TrendIcon && (
          <TrendIcon className={cn("h-4 w-4", trendColor)} />
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{metric.value}</span>
        {metric.change !== undefined && (
          <span className={cn("text-sm", trendColor)}>
            {metric.change > 0 ? "+" : ""}{metric.change}%
          </span>
        )}
      </div>
      {progressValue !== undefined && (
        <Progress value={Math.min(progressValue, 100)} className="mt-2 h-1.5" />
      )}
    </motion.div>
  );
}

// Insight Item
function AnalysisInsightItem({ insight }: { insight: AnalysisInsight }) {
  const impactColors = {
    high: "border-destructive/30 bg-destructive/5",
    medium: "border-warning/30 bg-warning/5",
    low: "border-info/30 bg-info/5",
  };

  const impactIcons = {
    high: AlertTriangle,
    medium: Target,
    low: Info,
  };

  const ImpactIcon = impactIcons[insight.impact];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "rounded-lg border p-4",
        impactColors[insight.impact]
      )}
    >
      <div className="flex items-start gap-3">
        <ImpactIcon className={cn("h-5 w-5 mt-0.5", 
          insight.impact === "high" ? "text-destructive" : 
          insight.impact === "medium" ? "text-warning" : "text-info"
        )} />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{insight.title}</span>
            <Badge variant="outline" className="text-xs">{insight.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{insight.description}</p>
          {insight.recommendation && (
            <p className="text-xs text-chart-3 mt-2">
              <span className="font-medium">Recommendation:</span> {insight.recommendation}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Simple Bar Chart
function BarChart({ data }: { data: AnalysisChartData[] }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-2">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <span className="w-20 text-xs text-muted-foreground truncate">{item.label}</span>
          <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-chart-3 to-chart-4 transition-all"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <span className="w-12 text-xs text-right font-mono">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// Simple Pie Chart Display
function PieChartDisplay({ data }: { data: AnalysisChartData[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-32 w-32 rounded-full border-4 border-muted">
        {data.map((item, idx) => {
          const percentage = (item.value / total) * 100;
          const prevPercentage = data.slice(0, idx).reduce((sum, i) => sum + (i.value / total) * 100, 0);
          return (
            <div
              key={idx}
              className={cn("absolute inset-0", `bg-${colors[idx]}`)}
              style={{
                clipPath: `conic-gradient(var(--${colors[idx]}) ${percentage}%, transparent ${percentage}%)`,
              }}
            />
          );
        })}
      </div>
      <div className="space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <div className={cn("h-3 w-3 rounded", `bg-${colors[idx]}`)} />
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-mono">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple Trend Chart
function TrendChart({ data }: { data: AnalysisChartData[] }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="relative h-32">
      <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-chart-3"
          points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${50 - (d.value / maxValue) * 45}`).join(" ")}
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * 100}
            cy={50 - (d.value / maxValue) * 45}
            r="2"
            className="fill-chart-3"
          />
        ))}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map((d, i) => (
          <span key={i} className="text-xs text-muted-foreground">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default AIAnalysisCard;


"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, Lightbulb, CheckCircle, ArrowRight, Sparkles, Zap, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Recommendation Types
export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  impact?: string;
  effort?: "low" | "medium" | "high";
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
  }>;
}

export interface AIRecommendationMetrics {
  totalRecommendations: number;
  completedCount: number;
  inProgressCount: number;
  impactScore: number;
}

// Recommendation Panel
interface AIRecommendationPanelProps {
  title?: string;
  recommendations: AIRecommendation[];
  metrics?: AIRecommendationMetrics;
  onActionClick?: (recommendationId: string, actionLabel: string) => void;
  className?: string;
}

export function AIRecommendationPanel({
  title = "AI Recommendations",
  recommendations,
  metrics,
  onActionClick,
  className,
}: AIRecommendationPanelProps) {
  const completionRate = metrics 
    ? Math.round((metrics.completedCount / metrics.totalRecommendations) * 100) 
    : 0;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {recommendations.length} recommendations
              </p>
            </div>
          </div>
          {metrics && (
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-chart-3" />
                <span className="text-2xl font-bold">{metrics.impactScore}</span>
              </div>
              <p className="text-xs text-muted-foreground">Impact Score</p>
            </div>
          )}
        </div>
        
        {metrics && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{metrics.completedCount} completed</span>
              <span>{metrics.inProgressCount} in progress</span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <RecommendationItem 
            key={recommendation.id} 
            recommendation={recommendation}
            index={index}
            onActionClick={onActionClick}
          />
        ))}
      </CardContent>
    </Card>
  );
}

// Recommendation Item
function RecommendationItem({
  recommendation,
  index,
  onActionClick,
}: {
  recommendation: AIRecommendation;
  index: number;
  onActionClick?: (recommendationId: string, actionLabel: string) => void;
}) {
  const priorityConfig = {
    high: { color: "border-destructive/30 bg-destructive/5", badge: "destructive" },
    medium: { color: "border-warning/30 bg-warning/5", badge: "warning" },
    low: { color: "border-info/30 bg-info/5", badge: "secondary" },
  };

  const config = priorityConfig[recommendation.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "rounded-lg border p-4 transition-colors hover:bg-muted/50",
        config.color
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">
              {recommendation.priority}
            </Badge>
            <Badge variant="outline">{recommendation.category}</Badge>
            {recommendation.impact && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                {recommendation.impact}
              </span>
            )}
          </div>
          
          <h4 className="font-medium">{recommendation.title}</h4>
          <p className="text-sm text-muted-foreground">{recommendation.description}</p>
          
          {recommendation.effort && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Effort:</span>
              <EffortIndicator effort={recommendation.effort} />
            </div>
          )}
        </div>
        
        {recommendation.actions && recommendation.actions.length > 0 && (
          <div className="flex flex-col gap-2">
            {recommendation.actions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || "outline"}
                size="sm"
                onClick={() => onActionClick?.(recommendation.id, action.label)}
                className="gap-1"
              >
                {action.label}
                <ArrowRight className="h-3 w-3" />
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Effort Indicator
function EffortIndicator({ effort }: { effort: "low" | "medium" | "high" }) {
  const config = {
    low: { color: "bg-success", label: "Low" },
    medium: { color: "bg-warning", label: "Medium" },
    high: { color: "bg-destructive", label: "High" },
  };
  
  const { color, label } = config[effort];
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        <div className={cn("h-1.5 w-1.5 rounded-full", effort === "low" || effort === "medium" || effort === "high" ? color : "bg-muted")} />
        <div className={cn("h-1.5 w-1.5 rounded-full", effort === "medium" || effort === "high" ? color : "bg-muted")} />
        <div className={cn("h-1.5 w-1.5 rounded-full", effort === "high" ? color : "bg-muted")} />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

// Quick Action Recommendations
interface AIQuickActionsProps {
  actions: Array<{
    id: string;
    icon: React.ElementType;
    label: string;
    description: string;
    onClick: () => void;
  }>;
  className?: string;
}

export function AIQuickActions({ actions, className }: AIQuickActionsProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className="flex items-start gap-3 rounded-lg border p-4 text-left hover:bg-muted/50 transition-colors"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <span className="block font-medium text-sm">{action.label}</span>
              <span className="block text-xs text-muted-foreground">{action.description}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export default AIRecommendationPanel;


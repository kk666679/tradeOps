"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, CheckCircle, Circle, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Timeline Types
export interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  status: "completed" | "current" | "pending" | "skipped" | "failed";
  date?: string;
  duration?: string;
  assignee?: string;
  attachments?: Array<{ name: string; url: string }>;
  comments?: number;
}

export interface TimelineMilestone {
  id: string;
  title: string;
  date: string;
  status: "achieved" | "at-risk" | "missed";
  description?: string;
}

// Process Timeline
interface AIProcessTimelineProps {
  title?: string;
  description?: string;
  steps: TimelineStep[];
  milestones?: TimelineMilestone[];
  currentStepId?: string;
  onStepClick?: (stepId: string) => void;
  className?: string;
}

export function AIProcessTimeline({
  title = "Process Timeline",
  description,
  steps,
  milestones,
  currentStepId,
  onStepClick,
  className,
}: AIProcessTimelineProps) {
  const completedCount = steps.filter(s => s.status === "completed").length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">{progress}%</span>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline Steps */}
        <div className="relative">
          {steps.map((step, index) => (
            <TimelineStepItem 
              key={step.id} 
              step={step} 
              index={index}
              isLast={index === steps.length - 1}
              onClick={() => onStepClick?.(step.id)}
            />
          ))}
        </div>

        {/* Milestones */}
        {milestones && milestones.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Milestones</h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {milestones.map((milestone) => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Timeline Step Item
function TimelineStepItem({
  step,
  index,
  isLast,
  onClick,
}: {
  step: TimelineStep;
  index: number;
  isLast: boolean;
  onClick?: () => void;
}) {
  const statusConfig = {
    completed: { icon: CheckCircle, color: "text-success", bgColor: "bg-success/10" },
    current: { icon: Clock, color: "text-chart-3", bgColor: "bg-chart-3/10" },
    pending: { icon: Circle, color: "text-muted-foreground", bgColor: "bg-muted" },
    skipped: { icon: CheckCircle, color: "text-muted-foreground", bgColor: "bg-muted" },
    failed: { icon: AlertCircle, color: "text-destructive", bgColor: "bg-destructive/10" },
  };

  const config = statusConfig[step.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex gap-4"
    >
      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border" />
      )}

      {/* Icon */}
      <button
        onClick={onClick}
        disabled={step.status === "pending"}
        className={cn(
          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
          config.bgColor,
          config.color,
          step.status === "current" && "ring-2 ring-chart-3 ring-offset-2",
          step.status !== "pending" && "cursor-pointer hover:scale-110"
        )}
      >
        <Icon className="h-4 w-4" />
      </button>

      {/* Content */}
      <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-medium",
                step.status === "completed" && "line-through",
                step.status === "current" && "text-chart-3"
              )}>
                {step.title}
              </span>
              {step.status === "current" && (
                <Badge variant="outline" className="text-xs">In Progress</Badge>
              )}
            </div>
            {step.description && (
              <p className="text-sm text-muted-foreground">{step.description}</p>
            )}
          </div>
          {onClick && step.status !== "pending" && (
            <Button variant="ghost" size="sm" onClick={onClick}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Step Meta */}
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          {step.date && <span>{step.date}</span>}
          {step.duration && <span>Duration: {step.duration}</span>}
          {step.assignee && <span>Assignee: {step.assignee}</span>}
          {step.comments !== undefined && step.comments > 0 && (
            <span>{step.comments} comments</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Milestone Card
function MilestoneCard({ milestone }: { milestone: TimelineMilestone }) {
  const statusConfig = {
    achieved: { color: "border-success/30 bg-success/5", icon: CheckCircle, iconColor: "text-success" },
    "at-risk": { color: "border-warning/30 bg-warning/5", icon: Clock, iconColor: "text-warning" },
    missed: { color: "border-destructive/30 bg-destructive/5", icon: AlertCircle, iconColor: "text-destructive" },
  };

  const config = statusConfig[milestone.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-lg border p-3",
        config.color
      )}
    >
      <div className="flex items-start gap-2">
        <Icon className={cn("h-4 w-4 mt-0.5", config.iconColor)} />
        <div className="flex-1 min-w-0">
          <span className="block font-medium text-sm truncate">{milestone.title}</span>
          <span className="block text-xs text-muted-foreground">{milestone.date}</span>
        </div>
      </div>
      {milestone.description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{milestone.description}</p>
      )}
    </motion.div>
  );
}

// Audit Timeline Specific
interface AIAuditTimelineProps {
  auditId: string;
  startDate: string;
  endDate: string;
  steps: TimelineStep[];
  className?: string;
}

export function AIAuditTimeline({ auditId, startDate, endDate, steps, className }: AIAuditTimelineProps) {
  return (
    <AIProcessTimeline
      title={`Audit Timeline`}
      description={`${startDate} - ${endDate}`}
      steps={steps}
      className={className}
    />
  );
}

export default AIProcessTimeline;


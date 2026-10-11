"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, AlertTriangle, Shield, TrendingDown, TrendingUp, Activity, Target, ChevronDown, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Risk Types
export interface RiskItem {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  likelihood: "rare" | "unlikely" | "possible" | "likely" | "certain";
  impact: "negligible" | "minor" | "moderate" | "major" | "severe";
  category: string;
  mitigation?: string;
  status: "identified" | "mitigating" | "mitigated" | "accepted";
  owner?: string;
  dueDate?: string;
}

export interface RiskMetrics {
  totalRisks: number;
  criticalCount: number;
  highCount: number;
  mitigatedCount: number;
  averageScore: number;
}

// Risk Matrix Calculation
function calculateRiskScore(likelihood: string, impact: string): number {
  const likelihoodScores: Record<string, number> = {
    rare: 1, unlikely: 2, possible: 3, likely: 4, certain: 5,
  };
  const impactScores: Record<string, number> = {
    negligible: 1, minor: 2, moderate: 3, major: 4, severe: 5,
  };
  return (likelihoodScores[likelihood] || 3) * (impactScores[impact] || 3);
}

function getRiskLevel(score: number): "critical" | "high" | "medium" | "low" {
  if (score >= 20) return "critical";
  if (score >= 15) return "high";
  if (score >= 8) return "medium";
  return "low";
}

function getRiskColor(level: string): string {
  const colors: Record<string, string> = {
    critical: "bg-destructive text-white",
    high: "bg-orange-500 text-white",
    medium: "bg-warning text-white",
    low: "bg-success text-white",
  };
  return colors[level] || "bg-muted";
}

// Risk Assessment Card
interface AIRiskAssessmentCardProps {
  title?: string;
  description?: string;
  risks: RiskItem[];
  metrics?: RiskMetrics;
  onRiskClick?: (riskId: string) => void;
  className?: string;
}

export function AIRiskAssessmentCard({
  title = "Risk Assessment",
  description,
  risks,
  metrics,
  onRiskClick,
  className,
}: AIRiskAssessmentCardProps) {
  const [openRisks, setOpenRisks] = React.useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const categories = React.useMemo(() => {
    const cats = new Set(risks.map(r => r.category));
    return ["all", ...Array.from(cats)];
  }, [risks]);

  const filteredRisks = React.useMemo(() => {
    return selectedCategory === "all" 
      ? risks 
      : risks.filter(r => r.category === selectedCategory);
  }, [risks, selectedCategory]);

  const riskDistribution = React.useMemo(() => {
    const dist = { critical: 0, high: 0, medium: 0, low: 0 };
    risks.forEach(r => dist[r.severity]++);
    return dist;
  }, [risks]);

  const toggleRisk = (id: string) => {
    const newOpen = new Set(openRisks);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenRisks(newOpen);
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          </div>
          {metrics && (
            <div className="text-right">
              <span className="text-2xl font-bold">{metrics.averageScore}</span>
              <p className="text-xs text-muted-foreground">Avg Risk Score</p>
            </div>
          )}
        </div>

        {/* Risk Distribution Bar */}
        <div className="mt-4 flex h-3 rounded-full overflow-hidden">
          <div 
            className="bg-destructive" 
            style={{ width: `${(riskDistribution.critical / risks.length) * 100}%` }} 
          />
          <div 
            className="bg-orange-500" 
            style={{ width: `${(riskDistribution.high / risks.length) * 100}%` }} 
          />
          <div 
            className="bg-warning" 
            style={{ width: `${(riskDistribution.medium / risks.length) * 100}%` }} 
          />
          <div 
            className="bg-success" 
            style={{ width: `${(riskDistribution.low / risks.length) * 100}%` }} 
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{riskDistribution.critical} Critical</span>
          <span>{riskDistribution.high} High</span>
          <span>{riskDistribution.medium} Medium</span>
          <span>{riskDistribution.low} Low</span>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {categories.map(cat => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "all" ? "All" : cat}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {filteredRisks.map((risk, index) => (
          <RiskItemCard
            key={risk.id}
            risk={risk}
            index={index}
            isOpen={openRisks.has(risk.id)}
            onToggle={() => toggleRisk(risk.id)}
            onClick={() => onRiskClick?.(risk.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

// Risk Item Card
function RiskItemCard({
  risk,
  index,
  isOpen,
  onToggle,
  onClick,
}: {
  risk: RiskItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onClick?: () => void;
}) {
  const riskScore = calculateRiskScore(risk.likelihood, risk.impact);
  const severity = getRiskLevel(riskScore);

  const statusConfig = {
    identified: { color: "border-destructive/30", label: "Identified" },
    mitigating: { color: "border-warning/30", label: "Mitigating" },
    mitigated: { color: "border-success/30", label: "Mitigated" },
    accepted: { color: "border-muted", label: "Accepted" },
  };

  const config = statusConfig[risk.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "rounded-lg border bg-card transition-colors",
        config.color
      )}
    >
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
            onClick={onClick}
          >
            <div className="flex items-center gap-3">
              <div className={cn("flex h-8 w-8 items-center justify-center rounded text-xs font-bold", getRiskColor(severity))}>
                {riskScore}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{risk.title}</span>
                  <Badge variant="outline" className="text-xs">{risk.category}</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{risk.likelihood} / {risk.impact}</span>
                  {risk.owner && <span>• {risk.owner}</span>}
                  {risk.dueDate && <span>• Due: {risk.dueDate}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{config.label}</Badge>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 border-t pt-4 space-y-3">
            <p className="text-sm text-muted-foreground">{risk.description}</p>
            
            {risk.mitigation && (
              <div className="rounded bg-muted p-3">
                <span className="text-xs font-medium text-muted-foreground">Mitigation Plan:</span>
                <p className="text-sm mt-1">{risk.mitigation}</p>
              </div>
            )}

            <div className="grid gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Likelihood:</span>
                <span className="capitalize">{risk.likelihood}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impact:</span>
                <span className="capitalize">{risk.impact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk Score:</span>
                <span className={cn("font-bold", 
                  severity === "critical" ? "text-destructive" :
                  severity === "high" ? "text-orange-500" :
                  severity === "medium" ? "text-warning" : "text-success"
                )}>
                  {riskScore} ({severity})
                </span>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}

// Quick Risk Summary
interface AIRiskSummaryProps {
  risks: RiskItem[];
  className?: string;
}

export function AIRiskSummary({ risks, className }: AIRiskSummaryProps) {
  const critical = risks.filter(r => r.severity === "critical").length;
  const high = risks.filter(r => r.severity === "high").length;
  const mitigated = risks.filter(r => r.status === "mitigated").length;

  return (
    <div className={cn("grid gap-4 sm:grid-cols-3", className)}>
      <div className="rounded-lg border p-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-2">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <span className="text-2xl font-bold">{critical + high}</span>
        <p className="text-xs text-muted-foreground">Critical & High</p>
      </div>
      
      <div className="rounded-lg border p-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 mx-auto mb-2">
          <Activity className="h-6 w-6 text-warning" />
        </div>
        <span className="text-2xl font-bold">{risks.length - mitigated}</span>
        <p className="text-xs text-muted-foreground">Active Risks</p>
      </div>
      
      <div className="rounded-lg border p-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 mx-auto mb-2">
          <Shield className="h-6 w-6 text-success" />
        </div>
        <span className="text-2xl font-bold">{mitigated}</span>
        <p className="text-xs text-muted-foreground">Mitigated</p>
      </div>
    </div>
  );
}

export default AIRiskAssessmentCard;


'use client';

import { useState } from "react";
import { AIChartContainer, AIInsightCard, AILoadingState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PromptInput } from "@/components/ai-elements/prompt-input";
import { Zap, TrendingUp, Play } from "lucide-react";

const SAMPLE_RESULTS = {
  savings: 23.5,
  newCost: "$89,340",
  oldCost: "$116,720",
  routes: [
    { name: "Optimal Route", value: 89.3, color: "#10b981" },
    { name: "Current Route", value: 116.7, color: "#ef4444" },
  ],
  insights: [
    "Consolidate containers CN001-CN005 for 15% savings",
    "Reroute via Singapore saves 3 days",
    "Switch carrier for EU leg: $12k savings"
  ]
};

export default function CargoOptimizer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof SAMPLE_RESULTS | null>(null);

  const runOptimization = () => {
    if (!query.trim()) return;
    setResults(SAMPLE_RESULTS);
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Cargo Optimization Preview
          </h1>
          <p className="text-muted-foreground">Review an illustrative route and cost optimization scenario.</p>
        </div>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Optimization Query</CardTitle>
        </CardHeader>
        <CardContent>
          <PromptInput
            value={query}
            onValueChange={setQuery}
            onSubmit={runOptimization}
            placeholder="Optimize 10x40ft containers from Shanghai to LA with $120k budget, prefer fastest route..."
            className="min-h-[120px]"
          />
          <div className="flex gap-3 mt-4">
            <Button 
              onClick={runOptimization} 
              disabled={!query.trim()}
              className="gap-2 font-semibold"
            >
              <Play className="h-4 w-4" />
              Show Sample Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <p className="text-sm text-muted-foreground lg:col-span-2">
            These illustrative results are sample data, not a live optimization.
          </p>
          <AIInsightCard 
            title="Optimization Insights"
            insights={results.insights}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Cost Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-green-600">
                  {results.savings}%
                </div>
<div className="text-2xl font-mono">
                  New: {results.newCost} <span className="text-sm text-muted-foreground">(saved ${((parseFloat(results.oldCost.replace(/[$,]/g, '')) - parseFloat(results.newCost.replace(/[$,]/g, ''))).toLocaleString())})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <AIChartContainer
            title="Route Cost Comparison"
            data={results.routes}
            type="bar"
            height={300}
          />
        </div>
      )}
    </div>
  );
}

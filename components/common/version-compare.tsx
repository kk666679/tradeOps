"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowRight, Plus, Minus, RefreshCw, ChevronDown, Eye, Download, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Version Compare Types
export interface VersionDiff {
  type: "added" | "removed" | "unchanged" | "modified";
  lineNumber: number;
  oldLine?: number;
  newLine?: number;
  oldContent?: string;
  newContent?: string;
}

export interface VersionCompareItem {
  id: string;
  version: string;
  date: Date;
  author: string;
  summary: string;
  changes: VersionDiff[];
  stats: {
    added: number;
    removed: number;
    modified: number;
  };
}

// Version Compare Component
interface AIVersionCompareProps {
  items: VersionCompareItem[];
  onVersionSelect?: (versionId: string) => void;
  onExport?: (versionId: string) => void;
  className?: string;
}

export function AIVersionCompare({
  items,
  onVersionSelect,
  onExport,
  className,
}: AIVersionCompareProps) {
  const [selectedVersion, setSelectedVersion] = React.useState<string>(items[0]?.id);
  const [compareWith, setCompareWith] = React.useState<string>(items[1]?.id || items[0]?.id);

  const selected = items.find(i => i.id === selectedVersion);
  const compare = items.find(i => i.id === compareWith);

  const handleVersionSelect = (id: string) => {
    setSelectedVersion(id);
    onVersionSelect?.(id);
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Version Comparison</CardTitle>
            <CardDescription>Compare document versions side by side</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            {onExport && (
              <Button variant="outline" size="sm" onClick={() => onExport(selectedVersion)}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Version Selectors */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">Compare From</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={selectedVersion}
              onChange={(e) => handleVersionSelect(e.target.value)}
            >
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  v{item.version} - {item.date.toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-center pt-5">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">Compare With</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={compareWith}
              onChange={(e) => setCompareWith(e.target.value)}
            >
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  v{item.version} - {item.date.toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {selected && compare && (
          <div className="space-y-4">
            {/* Stats Summary */}
            <div className="grid gap-4 sm:grid-cols-3">
              <VersionStatCard
                type="added"
                count={selected.stats.added}
                label="Lines Added"
              />
              <VersionStatCard
                type="removed"
                count={selected.stats.removed}
                label="Lines Removed"
              />
              <VersionStatCard
                type="modified"
                count={selected.stats.modified}
                label="Lines Modified"
              />
            </div>

            {/* Diff View */}
            <Tabs defaultValue="split" className="w-full">
              <TabsList>
                <TabsTrigger value="split">Split View</TabsTrigger>
                <TabsTrigger value="unified">Unified</TabsTrigger>
              </TabsList>
              
              <TabsContent value="split" className="mt-4">
                <SplitDiffView 
                  oldVersion={compare} 
                  newVersion={selected} 
                />
              </TabsContent>
              
              <TabsContent value="unified" className="mt-4">
                <UnifiedDiffView diff={selected.changes} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Version Stat Card
function VersionStatCard({
  type,
  count,
  label,
}: {
  type: "added" | "removed" | "modified";
  count: number;
  label: string;
}) {
  const config = {
    added: { color: "text-success", bg: "bg-success/10", icon: Plus },
    removed: { color: "text-destructive", bg: "bg-destructive/10", icon: Minus },
    modified: { color: "text-warning", bg: "bg-warning/10", icon: RefreshCw },
  };

  const { color, bg, icon: Icon } = config[type];

  return (
    <div className={cn("rounded-lg border p-4", bg)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={cn("h-4 w-4", color)} />
      </div>
      <span className={cn("text-2xl font-bold", color)}>{count}</span>
    </div>
  );
}

// Split Diff View
function SplitDiffView({
  oldVersion,
  newVersion,
}: {
  oldVersion: VersionCompareItem;
  newVersion: VersionCompareItem;
}) {
  const maxLines = Math.max(
    oldVersion.changes.filter(c => c.type !== "added").length,
    newVersion.changes.filter(c => c.type !== "removed").length
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Old Version */}
      <div className="rounded-lg border overflow-hidden">
        <div className="bg-muted px-4 py-2 border-b">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm">v{oldVersion.version}</span>
            <Badge variant="outline">{oldVersion.date.toLocaleDateString()}</Badge>
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="font-mono text-xs">
            {oldVersion.changes.map((diff, idx) => (
              <DiffLine key={idx} diff={diff} view="old" />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* New Version */}
      <div className="rounded-lg border overflow-hidden">
        <div className="bg-muted px-4 py-2 border-b">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm">v{newVersion.version}</span>
            <Badge variant="outline">{newVersion.date.toLocaleDateString()}</Badge>
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="font-mono text-xs">
            {newVersion.changes.map((diff, idx) => (
              <DiffLine key={idx} diff={diff} view="new" />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// Unified Diff View
function UnifiedDiffView({ diff }: { diff: VersionDiff[] }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <ScrollArea className="h-[400px]">
        <div className="font-mono text-xs">
          {diff.map((line, idx) => (
            <UnifiedDiffLine key={idx} line={line} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// Diff Line
function DiffLine({
  diff,
  view,
}: {
  diff: VersionDiff;
  view: "old" | "new";
}) {
  const getBackground = () => {
    if (view === "old") {
      if (diff.type === "removed") return "bg-destructive/10";
      if (diff.type === "modified") return "bg-warning/10";
    } else {
      if (diff.type === "added") return "bg-success/10";
      if (diff.type === "modified") return "bg-warning/10";
    }
    return "";
  };

  const content = view === "old" ? diff.oldContent : diff.newContent;
  const lineNum = view === "old" ? diff.oldLine : diff.newLine;

  if (view === "old" && diff.type === "added") return null;
  if (view === "new" && diff.type === "removed") return null;

  return (
    <div className={cn("flex hover:bg-muted/50", getBackground())}>
      <span className="w-12 px-2 py-0.5 text-muted-foreground text-right border-r select-none">
        {lineNum || ""}
      </span>
      <span className="w-6 px-1 py-0.5 text-center border-r select-none">
        {diff.type === "added" && "+"}
        {diff.type === "removed" && "-"}
        {diff.type === "modified" && "~"}
      </span>
      <span className="flex-1 px-2 py-0.5 whitespace-pre-wrap break-all">
        {content}
      </span>
    </div>
  );
}

// Unified Diff Line
function UnifiedDiffLine({ line }: { line: VersionDiff }) {
  const getConfig = () => {
    switch (line.type) {
      case "added":
        return { bg: "bg-success/10", prefix: "+", color: "text-success" };
      case "removed":
        return { bg: "bg-destructive/10", prefix: "-", color: "text-destructive" };
      case "modified":
        return { bg: "bg-warning/10", prefix: "~", color: "text-warning" };
      default:
        return { bg: "", prefix: " ", color: "" };
    }
  };

  const config = getConfig();

  return (
    <div className={cn("flex hover:bg-muted/50", config.bg)}>
      <span className="w-12 px-2 py-0.5 text-muted-foreground text-right border-r select-none">
        {line.newLine || ""}
      </span>
      <span className="w-12 px-2 py-0.5 text-muted-foreground text-right border-r select-none">
        {line.oldLine || ""}
      </span>
      <span className={cn("w-6 px-1 py-0.5 text-center border-r select-none", config.color)}>
        {config.prefix}
      </span>
      <span className="flex-1 px-2 py-0.5 whitespace-pre-wrap break-all">
        {line.newContent || line.oldContent}
      </span>
    </div>
  );
}

export default AIVersionCompare;


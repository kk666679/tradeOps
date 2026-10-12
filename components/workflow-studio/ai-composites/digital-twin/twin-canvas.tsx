'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TwinGraph, type TwinGraphNode } from '@/components/digital-twin/graph/TwinGraph';

export interface TwinCanvasProps {
  className?: string;
  nodes?: TwinGraphNode[];
  edges?: { from: string; to: string }[];
}

export function TwinCanvas({ className, nodes = [], edges = [] }: TwinCanvasProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Supply chain topology</CardTitle>
      </CardHeader>
      <CardContent>
        <TwinGraph
          nodes={nodes}
          edges={edges}
          className="relative h-[420px] w-full overflow-hidden rounded border bg-muted/30"
        />
      </CardContent>
    </Card>
  );
}

export default TwinCanvas;

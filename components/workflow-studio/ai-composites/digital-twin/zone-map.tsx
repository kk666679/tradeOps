'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TwinBondedLayer } from '@/components/digital-twin/zones/TwinBondedLayer';
import { TwinFczLayer } from '@/components/digital-twin/zones/TwinFczLayer';
import { TwinFizLayer } from '@/components/digital-twin/zones/TwinFizLayer';
import type { TwinGraphNode } from '@/components/digital-twin/graph/TwinGraph';

export interface ZoneMapProps {
  className?: string;
  zone?: 'FIZ' | 'FCZ' | 'BONDED';
  tenantId?: string;
  nodes?: TwinGraphNode[];
  edges?: { from: string; to: string }[];
}

const zoneLayers = {
  FIZ: TwinFizLayer,
  FCZ: TwinFczLayer,
  BONDED: TwinBondedLayer,
};

export function ZoneMap({
  className,
  zone = 'FIZ',
  tenantId,
  nodes = [],
  edges = [],
}: ZoneMapProps) {
  const ZoneLayer = zoneLayers[zone];
  const zoneNodes = nodes.filter((node) => node.zone === zone);

  return (
    <Card className={className} data-zone={zone} data-tenant={tenantId}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Zone map</CardTitle>
        <span className="text-xs text-muted-foreground">{zone}</span>
      </CardHeader>
      <CardContent>
        <ZoneLayer
          nodes={zoneNodes}
          edges={edges}
          className="relative h-[420px] w-full overflow-hidden rounded border bg-muted/30"
        />
      </CardContent>
    </Card>
  );
}

export default ZoneMap;

'use client';
import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export interface IntegrationDetailProps { id?: string; zone?: 'FIZ' | 'FCZ'; }
export function IntegrationDetail({ id, zone = 'FIZ' }: IntegrationDetailProps) {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold">{id ?? 'IntegrationDetail'}</span>
        <Badge variant={zone === 'FIZ' ? 'default' : 'secondary'}>{zone}</Badge>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customs">Customs</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><p className="text-sm text-muted-foreground">No data.</p></TabsContent>
        <TabsContent value="customs"><p className="text-sm text-muted-foreground">No declarations linked.</p></TabsContent>
        <TabsContent value="activity"><p className="text-sm text-muted-foreground">No events.</p></TabsContent>
      </Tabs>
    </div>
  );
}
export default IntegrationDetail;

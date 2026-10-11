'use client';

/**
 * DocumentExtractionAgent
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type AgentStatus = 'idle' | 'running' | 'paused' | 'error';
export interface DocumentExtractionAgentProps { status?: AgentStatus; onRun?: () => void; onPause?: () => void; }

export function DocumentExtractionAgent({ status = 'idle', onRun, onPause }: DocumentExtractionAgentProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>DocumentExtraction Agent</CardTitle>
        <Badge variant={status === 'error' ? 'destructive' : 'secondary'}>{status}</Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="text-muted-foreground">Autonomous customs agent surface.</p>
        <div className="flex gap-2">
          <button className="rounded bg-primary px-3 py-1 text-primary-foreground" onClick={onRun}>Run</button>
          <button className="rounded border px-3 py-1" onClick={onPause}>Pause</button>
        </div>
      </CardContent>
    </Card>
  );
}

export default DocumentExtractionAgent;

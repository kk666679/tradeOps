'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface HighlightPreviewProps { title: string; body: string; }
export function HighlightPreview({ title, body }: HighlightPreviewProps) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{body}</p>
        <div className="rounded-lg border bg-muted/30 p-3 text-xs">
          <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500" />FIZ</div>
          <div className="mt-2 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" />FCZ</div>
        </div>
      </CardContent>
    </Card>
  );
}
export default HighlightPreview;

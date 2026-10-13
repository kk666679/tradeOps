'use client';
import * as React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props { onZoomIn?: () => void; onZoomOut?: () => void; onReset?: () => void; zoom?: number; }

export function TwinZoomControls({ onZoomIn, onZoomOut, onReset, zoom = 1 }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-md border bg-card p-1 shadow-sm">
      <Button size="icon" variant="ghost" onClick={onZoomOut} aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></Button>
      <span className="min-w-[48px] text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
      <Button size="icon" variant="ghost" onClick={onZoomIn} aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></Button>
      <Button size="icon" variant="ghost" onClick={onReset} aria-label="Fit"><Maximize2 className="h-4 w-4" /></Button>
    </div>
  );
}
export default TwinZoomControls;

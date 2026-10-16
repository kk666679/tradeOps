'use client';

import { useViewport } from '@xyflow/react';

export default function ZoomIndicator() {
  const { zoom } = useViewport();
  return (
    <span className="font-mono text-[10px] text-[#4b5563]">
      {Math.round(zoom * 100)}%
    </span>
  );
}
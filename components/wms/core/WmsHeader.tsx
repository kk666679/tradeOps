'use client';
import * as React from 'react';
export function WmsHeader() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <div className="text-sm font-medium">Warehouse Operations · FIZ / FCZ</div>
      <div className="text-xs text-muted-foreground">Bonded · Duty-suspended</div>
    </header>
  );
}
export default WmsHeader;

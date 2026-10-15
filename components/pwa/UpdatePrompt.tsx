'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function UpdatePrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener('tradeops:sw-update', handler);
    return () => window.removeEventListener('tradeops:sw-update', handler);
  }, []);

  if (!visible) return null;

  const reload = () => {
    navigator.serviceWorker?.controller?.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border bg-card px-3 py-2 text-xs shadow-lg">
      <span className="mr-2 text-muted-foreground">A new version is available.</span>
      <Button size="sm" className="h-6 gap-1 text-[11px]" onClick={reload}>
        <RefreshCw className="h-3 w-3" />
        Reload
      </Button>
    </div>
  );
}
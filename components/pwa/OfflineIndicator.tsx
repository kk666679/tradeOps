'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[11px] font-medium text-amber-300 shadow">
      <WifiOff className="mr-1.5 inline h-3 w-3" />
      You're offline — showing cached data
    </div>
  );
}
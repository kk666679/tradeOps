'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'tradeops.install.dismissed';

export function InstallPrompt() {
  const [event, setEvent] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setEvent(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible || !event) return null;

  const dismiss = () => { localStorage.setItem(DISMISS_KEY, '1'); setVisible(false); };

  const install = async () => {
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === 'accepted') setVisible(false); else dismiss();
  };

  return (
    <Card className="fixed bottom-4 right-4 z-50 flex w-80 items-start gap-3 border bg-card p-3 shadow-lg">
      <Download className="mt-0.5 h-5 w-5 text-primary" />
      <div className="flex-1">
        <div className="text-sm font-semibold">Install TradeOps</div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          Add TradeOps to your home screen for faster access and offline support.
        </div>
        <div className="mt-2 flex gap-2">
          <Button size="sm" className="h-7 text-xs" onClick={install}>Install</Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={dismiss}>Not now</Button>
        </div>
      </div>
      <button onClick={dismiss} className="text-muted-foreground hover:text-foreground">
        <X className="h-3.5 w-3.5" />
      </button>
    </Card>
  );
}
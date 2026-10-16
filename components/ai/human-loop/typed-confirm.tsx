'use client';

/**
 * TypedConfirm
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface TypedConfirmProps { phrase: string; onConfirm: () => void; label?: string; }

export function TypedConfirm({ phrase, onConfirm, label = 'Confirm' }: TypedConfirmProps) {
  const [v, setV] = React.useState('');
  const ok = v === phrase;
  return (
    <div className="SpaceY2 rounded border border-red-300 bg-red-50 p-3 text-sm">
      <p>Type <code className="rounded bg-background Px1">{phrase}</code> to confirm.</p>
      <Input value={v} onChange={(e) => setV(e.target.value)} />
      <Button size="sm" disabled={!ok} onClick={onConfirm}>{label}</Button>
    </div>
  );
}

export default TypedConfirm;

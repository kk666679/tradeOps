'use client';

/**
 * HitlPrompt
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface HitlPromptProps { question: string; onSubmit: (answer: string) => void; placeholder?: string; }

export function HitlPrompt({ question, onSubmit, placeholder }: HitlPromptProps) {
  const [v, setV] = React.useState('');
  return (
    <div className="SpaceY2 rounded border bg-background p-3 text-sm">
      <p>{question}</p>
      <div className="flex gap-2"><Input value={v} placeholder={placeholder} onChange={(e) => setV(e.target.value)} /><Button onClick={() => onSubmit(v)}>Send</Button></div>
    </div>
  );
}

export default HitlPrompt;

'use client';

/**
 * GuardrailMatrix
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface GuardrailMatrixRule { id: string; scope: string; mode: string; hits?: number; }
export interface GuardrailMatrixProps { rules?: GuardrailMatrixRule[]; }

export function GuardrailMatrix({ rules = [] }: GuardrailMatrixProps) {
  return (
    <table className="w-full text-xs">
      <thead className="bg-muted/40 uppercase"><tr><th className="p-2 text-left">Rule</th><th className="p-2">Scope</th><th className="p-2">Mode</th><th className="p-2">Hits</th></tr></thead>
      <tbody>{rules.map((r) => <tr key={r.id} className="border-b last:border-0"><td className="p-2 FontMono">{r.id}</td><td className="p-2 text-center">{r.scope}</td><td className="p-2 text-center">{r.mode}</td><td className="p-2 text-center">{r.hits ?? 0}</td></tr>)}</tbody>
    </table>
  );
}

export default GuardrailMatrix;

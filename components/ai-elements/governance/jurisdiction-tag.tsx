'use client';

/**
 * JurisdictionTag
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface JurisdictionTagProps { code: 'MY' | 'SG' | 'EU' | 'ASEAN' | 'RCEP' | 'global' | string; label?: string; }

export function JurisdictionTag({ code, label }: JurisdictionTagProps) {
  return (
    <span className="inline-flex ItemsCenter gap-1 rounded border Px2 Py0.5 text-xs">
      <span className="FontMono uppercase">{code}</span>
      {label ? <span className="text-muted-foreground">{label}</span> : null}
    </span>
  );
}

export default JurisdictionTag;

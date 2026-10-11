'use client';

/**
 * PolicyEditor
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface PolicyEditorProps { yaml: string; onChange?: (v: string) => void; readOnly?: boolean; }

export function PolicyEditor({ yaml, onChange, readOnly }: PolicyEditorProps) {
  return (
    <textarea
      className="h-72 w-full rounded border bg-muted/20 p-2 FontMono text-xs"
      value={yaml} readOnly={readOnly}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}

export default PolicyEditor;

'use client';

/**
 * StreamingMarkdown
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface StreamingMarkdownProps { md: string; className?: string; }

export function StreamingMarkdown({ md, className }: StreamingMarkdownProps) {
  // Replace with your markdown renderer (ReactMarkdown, marked, etc.)
  return <div className={className ?? 'prose ProseSm max-w-none WhitespacePreWrap'}>{md}</div>;
}

export default StreamingMarkdown;

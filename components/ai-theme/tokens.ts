export const tokens = {
  zone: {
    FIZ: { fg: '#0369a1', bg: '#f0f9ff', border: '#bae6fd' },
    FCZ: { fg: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    BONDED: { fg: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe' },
  },
  status: {
    idle: '#94a3b8',
    thinking: '#0ea5e9',
    tool: '#8b5cf6',
    waiting_approval: '#f59e0b',
    error: '#ef4444',
  },
  severity: {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#dc2626',
  },
} as const;
export type ThemeTokens = typeof tokens;

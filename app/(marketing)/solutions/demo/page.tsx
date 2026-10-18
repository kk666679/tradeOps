'use client';

import {
  Component,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/* ══════════════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════════════ */
type TierKey = 0 | 1 | 2 | 3 | 'cmd';
type AgentStatus = 'healthy' | 'degraded' | 'idle' | 'active' | 'error';
type ColorMode = 'dark' | 'light' | 'system';

interface TierMeta {
  label: string;
  cls: string;
  color: string;
}

interface Telemetry {
  p50?: string;
  p95?: string;
  tokens?: string;
  errors?: string;
}

interface AgentDetails {
  title?: string;
  tier?: number | 'cmd';
  summary?: string;
  status?: AgentStatus;
  model?: string;
  telemetry?: Telemetry;
  responsibilities?: string[];
  skills?: string[];
  allowed?: string[];
  forbidden?: string[];
  a2a?: string[];
  mcp?: string[];
  kv?: Record<string, string>;
}

interface AgentNodeData {
  [key: string]: unknown;
  label: string;
  tier: TierKey;
  kind?: string;
  status?: AgentStatus;
  latency?: string;
  tokens?: string;
  a2a?: boolean;
  mcp?: number;
  approval?: boolean;
}

type AgentNodeType = Node<AgentNodeData, 'agent'>;

interface EdgeOpts {
  label?: string;
  color?: string;
  animated?: boolean;
  dashed?: boolean;
  dotted?: boolean;
  width?: number;
  type?: 'smoothstep' | 'bezier' | 'default' | 'straight' | 'step';
  zIndex?: number;
}

interface BootErrorBoundaryState {
  error: Error | null;
  info: ErrorInfo | null;
}

/* ══════════════════════════════════════════════════════════════
   Styles (unchanged from the HTML file, injected as a string)
   ══════════════════════════════════════════════════════════════ */
const styles = `
:root {
  --bg-canvas: #f6f8fb;
  --bg-surface: #ffffff;
  --bg-subtle: #eef2f7;
  --bg-inset: #e5eaf1;
  --border-subtle: #dde3ec;
  --border-strong: #c8d0dd;
  --text-primary: #0b1220;
  --text-secondary: #4a5568;
  --text-tertiary: #8896ab;
  --text-inverse: #ffffff;

  --tier-0: #dc2626;
  --tier-1: #0891b2;
  --tier-2: #7c3aed;
  --tier-3: #d97706;
  --tier-cmd: #64748b;

  --status-healthy: #10b981;
  --status-degraded: #f59e0b;
  --status-idle: #94a3b8;
  --status-error: #ef4444;
  --status-active: #22d3ee;

  --a2a: #8b5cf6;
  --approval: #f59e0b;

  --shadow-sm: 0 1px 2px rgba(11,18,32,0.04);
  --shadow-md: 0 4px 16px rgba(11,18,32,0.06);
  --shadow-lg: 0 12px 40px rgba(11,18,32,0.08);
  --shadow-glow-cyan: 0 0 0 1px rgba(8,145,178,0.3), 0 0 24px rgba(34,211,238,0.2);
  --radius-sm: 8px;
  --radius-md: 12px;

  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;

  --canvas-bg: radial-gradient(ellipse at 50% 0%, #ffffff 0%, #f0f4f9 55%, #e9eff7 100%);
  --dot-color: #cbd5e1;
  --glass-bg: rgba(255,255,255,0.82);
  --glass-border: rgba(255,255,255,0.6);
  --label-bg: #ffffff;
  --minimap-mask: rgba(246,248,251,0.82);

  --xy-background-color: transparent;
  --xy-theme-selected: #0891b2;
  --xy-handle-background-color-default: #ffffff;
  --xy-handle-border-color-default: #94a3b8;
  --xy-edge-label-color-default: #4a5568;
}

body.dark-mode {
  --bg-canvas: #070b14;
  --bg-surface: #0e1626;
  --bg-subtle: #0b1220;
  --bg-inset: #16223a;
  --border-subtle: #1e2d47;
  --border-strong: #2b3d5c;
  --text-primary: #e8eef7;
  --text-secondary: #9aabc4;
  --text-tertiary: #5f7392;
  --text-inverse: #070b14;

  --tier-0: #f43f5e;
  --tier-1: #22d3ee;
  --tier-2: #a78bfa;
  --tier-3: #fbbf24;
  --tier-cmd: #94a3b8;

  --status-healthy: #34d399;
  --status-degraded: #fbbf24;
  --status-idle: #64748b;
  --status-error: #f87171;
  --status-active: #22d3ee;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.4);
  --shadow-lg: 0 16px 48px rgba(0,0,0,0.5);
  --shadow-glow-cyan: 0 0 0 1px rgba(34,211,238,0.25), 0 0 28px rgba(34,211,238,0.15);

  --canvas-bg: radial-gradient(ellipse at 50% 0%, #0d1628 0%, #080d18 60%, #05080f 100%);
  --dot-color: #1a2942;
  --glass-bg: rgba(14,22,38,0.78);
  --glass-border: rgba(255,255,255,0.06);
  --label-bg: #0e1626;
  --minimap-mask: rgba(7,11,20,0.82);

  --xy-background-color: transparent;
  --xy-theme-selected: #22d3ee;
  --xy-handle-background-color-default: #0e1626;
  --xy-handle-border-color-default: #5f7392;
  --xy-edge-label-color-default: #9aabc4;
}

* { box-sizing: border-box; }
html, body, #root { height: 100%; margin: 0; }
body {
  font-family: var(--font-sans);
  background: var(--bg-canvas);
  color: var(--text-primary);
  overflow: hidden;
  transition: background 0.3s ease, color 0.3s ease;
  -webkit-font-smoothing: antialiased;
}

.app {
  display: grid;
  grid-template-rows: 60px 1fr;
  grid-template-columns: 1fr 420px;
  grid-template-areas: "header header" "graph side";
  height: 100vh;
}
@media (max-width: 1280px) { .app { grid-template-columns: 1fr 360px; } }

.header {
  grid-area: header;
  display: flex; align-items: center; gap: 14px;
  padding: 0 20px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  z-index: 20;
  transition: background 0.3s ease, border-color 0.3s ease;
}
.header .brand { display: flex; align-items: center; gap: 10px; }
.header .logo {
  width: 32px; height: 32px; border-radius: 9px;
  background: linear-gradient(135deg, var(--tier-1), var(--tier-2));
  display: grid; place-items: center;
  font-weight: 800; font-size: 14px; color: #04121c;
  font-family: var(--font-mono);
  box-shadow: 0 4px 14px rgba(34,211,238,0.25);
}
.header h1 { font-size: 14px; font-weight: 650; letter-spacing: -0.2px; margin: 0; }
.header .sub { font-size: 10.5px; color: var(--text-tertiary); font-family: var(--font-mono); letter-spacing: 0.3px; }

.header .demo-pill {
  display: inline-flex; align-items: center; gap: 6px;
  height: 24px; padding: 0 10px; border-radius: 999px;
  background: rgba(245,158,11,0.1);
  border: 1px solid rgba(245,158,11,0.3);
  color: var(--status-degraded);
  font-family: var(--font-mono); font-size: 10px; font-weight: 700;
  letter-spacing: 0.5px; text-transform: uppercase;
}
.header .demo-pill .pulse {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--status-degraded);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(245,158,11,0.5); }
  50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(245,158,11,0); }
}

.header .stats {
  margin-left: auto; display: flex; gap: 22px;
  font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary);
}
.header .stats b { color: var(--text-primary); font-weight: 650; }
.header .stats .metric { display: flex; flex-direction: column; gap: 1px; }
.header .stats .metric small {
  font-size: 9px; color: var(--text-tertiary);
  text-transform: uppercase; letter-spacing: 0.6px;
}

.mode-toggle {
  display: flex; gap: 3px; margin-left: 8px;
  padding: 3px; border-radius: 999px;
  background: var(--bg-subtle); border: 1px solid var(--border-subtle);
}
.mode-toggle button {
  display: inline-flex; align-items: center; justify-content: center;
  height: 26px; padding: 0 11px; border-radius: 999px;
  border: none; background: transparent;
  color: var(--text-tertiary);
  font-family: var(--font-mono); font-size: 10px; font-weight: 650;
  letter-spacing: 0.4px; text-transform: uppercase;
  cursor: pointer; transition: all 0.15s ease;
}
.mode-toggle button:hover { color: var(--text-primary); }
.mode-toggle button.active {
  background: var(--bg-surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.graph-wrap {
  grid-area: graph; position: relative;
  background: var(--canvas-bg);
  transition: background 0.3s ease;
}
.react-flow__attribution { display: none; }
.react-flow__controls {
  border-radius: var(--radius-sm); overflow: hidden;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
  background: var(--bg-surface);
}
.react-flow__controls-button {
  background: var(--bg-surface) !important;
  border: none; border-bottom: 1px solid var(--border-subtle);
  color: var(--text-primary);
  width: 28px; height: 28px;
}
.react-flow__controls-button:hover { background: var(--bg-subtle) !important; }
.react-flow__controls-button svg { fill: var(--text-primary); }
.react-flow__minimap {
  background: var(--bg-surface) !important;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm); overflow: hidden;
}
.react-flow__handle {
  width: 16px; height: 16px;
  background: var(--xy-handle-background-color-default);
  border: 1.5px solid var(--xy-handle-border-color-default);
  transition: border-color 0.15s ease;
}
.react-flow__handle:hover { border-color: var(--xy-theme-selected); }

.node {
  position: relative;
  padding: 11px 14px 10px;
  border-radius: var(--radius-md);
  min-width: 210px;
  font-family: var(--font-mono);
  font-size: 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  box-shadow: var(--shadow-sm);
}
.node:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-strong);
}
.node.selected {
  border-color: var(--tier-1);
  box-shadow: var(--shadow-glow-cyan);
}
.node .top-row { display: flex; align-items: center; gap: 7px; margin-bottom: 6px; }
.node .status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.node .status-dot.healthy { background: var(--status-healthy); box-shadow: 0 0 6px var(--status-healthy); }
.node .status-dot.degraded { background: var(--status-degraded); box-shadow: 0 0 6px var(--status-degraded); }
.node .status-dot.idle { background: var(--status-idle); }
.node .status-dot.active { background: var(--status-active); box-shadow: 0 0 8px var(--status-active); animation: pulse 2s infinite; }
.node .status-dot.error { background: var(--status-error); box-shadow: 0 0 6px var(--status-error); }

.node .tier-tag {
  font-size: 8.5px; letter-spacing: 0.8px; text-transform: uppercase;
  font-weight: 700; opacity: 0.9;
}
.node .name {
  font-size: 13px; font-weight: 650;
  color: var(--text-primary); letter-spacing: -0.2px;
  line-height: 1.3;
}
.node .kind { font-size: 9.5px; color: var(--text-tertiary); margin-top: 2px; line-height: 1.3; }
.node .metric-row { display: flex; gap: 6px; margin-top: 7px; flex-wrap: wrap; }
.node .chip {
  display: inline-flex; align-items: center; gap: 3px;
  height: 18px; padding: 0 6px; border-radius: 5px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-subtle);
  font-size: 9px; font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.2px;
}
.node .chip .dot { width: 3px; height: 3px; border-radius: 50%; background: currentColor; }
.node .chip.a2a { color: var(--a2a); border-color: rgba(139,92,246,0.25); background: rgba(139,92,246,0.06); }
.node .chip.mcp { color: var(--tier-1); border-color: rgba(8,145,178,0.25); background: rgba(8,145,178,0.06); }
.node .chip.approval { color: var(--approval); border-color: rgba(245,158,11,0.25); background: rgba(245,158,11,0.06); }

.node.tier-0 { border-left: 2px solid var(--tier-0); }
.node.tier-1 { border-left: 2px solid var(--tier-1); }
.node.tier-2 { border-left: 2px solid var(--tier-2); }
.node.tier-3 { border-left: 2px solid var(--tier-3); }
.node.tier-cmd { border-left: 2px solid var(--tier-cmd); background: var(--bg-subtle); }
.node.tier-0 .tier-tag { color: var(--tier-0); }
.node.tier-1 .tier-tag { color: var(--tier-1); }
.node.tier-2 .tier-tag { color: var(--tier-2); }
.node.tier-3 .tier-tag { color: var(--tier-3); }
.node.tier-cmd .tier-tag { color: var(--tier-cmd); }

.side {
  grid-area: side;
  border-left: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  overflow-y: auto;
  padding: 0;
  font-size: 12px;
  transition: background 0.3s ease, border-color 0.3s ease;
}
.side::-webkit-scrollbar { width: 6px; }
.side::-webkit-scrollbar-track { background: transparent; }
.side::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }

.side .panel-header {
  position: sticky; top: 0; z-index: 2;
  padding: 16px 18px 12px;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  display: flex; align-items: flex-start; gap: 10px;
}
.side .panel-header > div:first-child { flex: 1; min-width: 0; }
.side .panel-header h2 {
  font-size: 11px; letter-spacing: 0.8px; text-transform: uppercase;
  color: var(--text-tertiary); margin: 0 0 4px; font-weight: 700;
}
.side .panel-header .subtitle {
  font-size: 11px; color: var(--text-secondary);
  font-family: var(--font-mono);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.side .panel-header .close-btn {
  display: none;
  width: 28px; height: 28px; border-radius: 6px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-subtle);
  color: var(--text-secondary);
  font-family: var(--font-mono); font-size: 14px; font-weight: 600;
  cursor: pointer; flex-shrink: 0;
  align-items: center; justify-content: center;
}
.side .panel-header .close-btn:hover { background: var(--bg-inset); color: var(--text-primary); }

.side .panel-body { padding: 18px; }

.side .empty-state {
  text-align: center; padding: 40px 20px;
  color: var(--text-tertiary); line-height: 1.7;
}
.side .empty-state .icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: var(--bg-subtle); border: 1px solid var(--border-subtle);
  display: grid; place-items: center; margin: 0 auto 14px;
  font-size: 18px; color: var(--text-tertiary);
}

.side .pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 9px; border-radius: 999px;
  font-family: var(--font-mono); font-size: 9.5px; font-weight: 700;
  letter-spacing: 0.4px; margin-bottom: 10px;
  text-transform: uppercase;
}
.side .pill .dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.side .pill.t0 { color: var(--tier-0); background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.2); }
.side .pill.t1 { color: var(--tier-1); background: rgba(8,145,178,0.08); border: 1px solid rgba(8,145,178,0.2); }
.side .pill.t2 { color: var(--tier-2); background: rgba(124,58,237,0.08); border: 1px solid rgba(124,58,237,0.2); }
.side .pill.t3 { color: var(--tier-3); background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.2); }

.side h3 {
  font-size: 17px; margin: 0 0 3px;
  color: var(--text-primary); font-family: var(--font-mono); font-weight: 650;
  letter-spacing: -0.3px;
}
.side .desc { color: var(--text-secondary); line-height: 1.65; margin: 8px 0 0; font-size: 12px; }
.side .section-title {
  font-size: 9.5px; text-transform: uppercase; letter-spacing: 1px;
  color: var(--text-tertiary); font-weight: 700;
  margin: 18px 0 8px; display: flex; align-items: center; gap: 6px;
}
.side .section-title::after {
  content: ""; flex: 1; height: 1px; background: var(--border-subtle);
}
.side ul { list-style: none; padding: 0; margin: 0; }
.side ul li {
  padding: 4px 0 4px 16px; position: relative;
  font-family: var(--font-mono); font-size: 10.5px; color: var(--text-secondary); line-height: 1.55;
}
.side ul li::before { content: "›"; position: absolute; left: 0; color: var(--text-tertiary); font-weight: 700; }
.side ul.allowed li::before { content: "✓"; color: var(--status-healthy); }
.side ul.forbidden li::before { content: "✗"; color: var(--status-error); }
.side ul.skills li::before { content: "◆"; color: var(--tier-2); }

.side .kv {
  display: grid; grid-template-columns: 120px 1fr; gap: 6px 12px;
  font-size: 10.5px; font-family: var(--font-mono); margin-top: 4px;
}
.side .kv dt { color: var(--text-tertiary); }
.side .kv dd { margin: 0; color: var(--text-primary); word-break: break-word; }

.telemetry-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px; }
.telemetry-card {
  padding: 9px 10px; border-radius: var(--radius-sm);
  background: var(--bg-subtle);
  border: 1px solid var(--border-subtle);
}
.telemetry-card .label {
  font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.6px;
  color: var(--text-tertiary); font-weight: 700; margin-bottom: 3px;
}
.telemetry-card .value {
  font-family: var(--font-mono); font-size: 14px; font-weight: 650;
  color: var(--text-primary); letter-spacing: -0.3px;
}
.telemetry-card .value small { font-size: 9px; font-weight: 500; color: var(--text-tertiary); }

.trace-feed { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; }
.trace-item {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 8px; border-radius: 6px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-subtle);
  font-family: var(--font-mono); font-size: 9.5px;
}
.trace-item .t { color: var(--text-tertiary); flex-shrink: 0; }
.trace-item .evt { color: var(--text-secondary); flex: 1; }
.trace-item .badge {
  padding: 1px 6px; border-radius: 4px;
  font-size: 8px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.4px;
}
.trace-item .badge.ok { color: var(--status-healthy); background: rgba(16,185,129,0.1); }
.trace-item .badge.warn { color: var(--status-degraded); background: rgba(245,158,11,0.1); }

.tier-summary { display: grid; gap: 6px; margin-top: 4px; }
.tier-summary .r {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: var(--radius-sm);
  background: var(--bg-subtle); border: 1px solid var(--border-subtle);
  font-family: var(--font-mono); font-size: 10.5px;
}
.tier-summary .r:hover { background: var(--bg-inset); }
.tier-summary .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.tier-summary .n { color: var(--text-tertiary); margin-left: auto; font-size: 9.5px; }

.legend {
  background: var(--glass-bg);
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  color: var(--text-secondary);
  line-height: 1.7;
  min-width: 168px;
  box-shadow: var(--shadow-md);
}
.legend h4 {
  margin: 0 0 7px;
  font-size: 8.5px; letter-spacing: 1px;
  text-transform: uppercase; color: var(--text-tertiary); font-weight: 700;
}
.legend .row { display: flex; align-items: center; gap: 8px; margin: 3px 0; }
.legend .swatch {
  width: 9px; height: 9px; border-radius: 3px;
  border: 1.5px solid currentColor; flex-shrink: 0;
}
.legend .line { width: 18px; height: 0; border-top: 2px solid currentColor; flex-shrink: 0; }
.legend .line.dotted { border-top-style: dotted; }

.status-bar {
  position: absolute; bottom: 0; left: 0; right: 0;
  display: flex; align-items: center; gap: 20px;
  padding: 7px 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--border-subtle);
  font-family: var(--font-mono); font-size: 9.5px;
  color: var(--text-tertiary);
  z-index: 5;
  pointer-events: none;
}
.status-bar .item { display: flex; align-items: center; gap: 6px; pointer-events: auto; }
.status-bar .dot { width: 5px; height: 5px; border-radius: 50%; }
.status-bar .val { color: var(--text-secondary); font-weight: 600; }
.status-bar .sim-tag {
  padding: 1px 6px; border-radius: 4px;
  background: rgba(245,158,11,0.1);
  border: 1px solid rgba(245,158,11,0.25);
  color: var(--status-degraded);
  font-size: 8px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.4px;
}

@media (max-width: 900px) {
  .app {
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr;
    grid-template-areas: "header" "graph";
  }
  .side {
    position: fixed;
    top: 60px; right: 0; bottom: 0;
    width: min(380px, 100vw);
    max-width: 100vw;
    border-left: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-lg);
    transform: translateX(100%);
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 40;
    grid-area: unset;
  }
  .side.open { transform: translateX(0); }
  .side .panel-header .close-btn { display: inline-flex; }
  .header { padding: 0 12px; gap: 8px; }
  .header .stats { gap: 10px; }
  .header .stats .metric:nth-child(n+3) { display: none; }
  .header .sub { display: none; }
  .mode-toggle { margin-left: auto; }
  .mode-toggle button { padding: 0 7px; }
  .legend { max-width: 150px; min-width: 130px; font-size: 8px; padding: 10px; }
  .status-bar { gap: 8px; flex-wrap: wrap; font-size: 8px; padding: 6px 10px; }
  .status-bar .item:nth-child(n+4) { display: none; }
}

#root { display: grid; }

.error-screen {
  position: fixed; inset: 0;
  padding: 28px; overflow: auto;
  background: #070b14;
  color: #e8eef7;
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  line-height: 1.65;
  z-index: 9999;
}
.error-screen h1 {
  font-size: 16px; margin: 0 0 16px; color: #f87171;
  letter-spacing: 0.4px;
}
.error-screen pre {
  background: #0e1626;
  border: 1px solid #2b3d5c;
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
  color: #e8eef7;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
  line-height: 1.6;
  margin: 0 0 20px;
}
.error-screen .hint {
  color: #9aabc4; font-size: 12px;
  background: rgba(34,211,238,0.06);
  border: 1px solid rgba(34,211,238,0.15);
  border-radius: 8px;
  padding: 14px 16px;
}
.error-screen .hint ol { margin: 8px 0 0; padding-left: 20px; }
.error-screen .hint a { color: #22d3ee; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`;

/* ══════════════════════════════════════════════════════════════
   Tier metadata
   ══════════════════════════════════════════════════════════════ */
const TIER_META: Record<TierKey, TierMeta> = {
  0:   { label: 'T0 · Orchestrator', cls: 'tier-0', color: '#dc2626' },
  1:   { label: 'T1 · Core Mesh',    cls: 'tier-1', color: '#0891b2' },
  2:   { label: 'T2 · Specialist',   cls: 'tier-2', color: '#7c3aed' },
  3:   { label: 'T3 · Governance',   cls: 'tier-3', color: '#d97706' },
  cmd: { label: 'Command',           cls: 'tier-cmd', color: '#64748b' },
};

/* ══════════════════════════════════════════════════════════════
   Agent details — unchanged from HTML, but with typed shape
   ══════════════════════════════════════════════════════════════ */
const AGENT_DETAILS: Record<string, AgentDetails> = {
  orch: {
    title: '_orchestrator', tier: 0,
    summary: 'Master agent. Deterministic FSM, zero LLM drift. Owns run graph, handoff logic, and rollback semantics.',
    status: 'active', model: 'rules-fsm',
    telemetry: { p50: '12ms', p95: '38ms', tokens: '0', errors: '0.00%' },
    responsibilities: [
      'Resolve tenant + inject isolation context',
      'Enforce RBAC / ABAC before handler dispatch',
      'Route via FSM (mesh.ts) — max 4 handoffs',
      'Sequence AI pipelines: embed → retrieve → rerank → generate',
      'Dispatch BullMQ jobs with idempotency keys',
      'Append-only audit on every state transition',
    ],
    kv: { 'Max handoffs': '4', 'Timeout': '30,000 ms', 'Fallback': 'human-approval-gate', 'Audit': 'audit_log (append-only)', 'A2A endpoint': 'mesh://orch.local' },
  },
  'document-agent': {
    title: 'document-agent', tier: 1,
    summary: 'Extracts structured fields from B/L, packing lists, invoices. RAG summarization with citations.',
    status: 'healthy', model: 'claude-4.5-sonnet',
    telemetry: { p50: '840ms', p95: '1.9s', tokens: '18.2k', errors: '0.12%' },
    skills: ['document-extraction', 'rag-retrieval', 'code-review'],
    allowed: ['document.upload', 'document.extract', 'document.summarise', 'document.embed', 'rag.query', 'rag.cite'],
    forbidden: ['cargo.write', 'inventory.write', 'declaration.submit', 'declaration.amend'],
    a2a: ['vector-analyst'], mcp: ['s3-storage', 'unstructured-io'],
    kv: { 'Approval required': 'amend_declaration, submit_to_jkdm', 'Threshold': 'MYR 50,000', 'Confidence gate': '< 0.85 → human review' },
  },
  'ops-agent': {
    title: 'ops-agent', tier: 1,
    summary: 'Gate-in / gate-out, slot allocation, yard planning, daily ops reporting.',
    status: 'active', model: 'gpt-5.2',
    telemetry: { p50: '410ms', p95: '1.1s', tokens: '9.4k', errors: '0.03%' },
    skills: ['gate-operations', 'slot-allocation', 'logistics', 'rag-retrieval'],
    allowed: ['cargo.read', 'cargo.status.update', 'gate.in', 'gate.out', 'slot.allocate', 'yard.occupancy', 'report.daily_ops'],
    forbidden: ['declaration.submit', 'bonded_ledger.write', 'inventory.adjust'],
    a2a: ['cargo-expert', 'sea-freight-expert', 'network-designer', 'procurement-negotiator'],
    mcp: ['yard-sensors', 'gate-controller'],
    kv: { 'Approval required': 'override_gate, release_without_docs, move_bonded_goods', 'Threshold': 'MYR 25,000' },
  },
  'inventory-agent': {
    title: 'inventory-agent', tier: 1,
    summary: 'Lot / batch / serial tracking, capacity rebalancing, dwell-time anomaly flagging.',
    status: 'healthy', model: 'claude-4.5-sonnet',
    telemetry: { p50: '220ms', p95: '680ms', tokens: '6.1k', errors: '0.01%' },
    skills: ['inventory-tracking', 'slot-allocation', 'inventory-expert', 'anomaly-detection'],
    allowed: ['inventory.read', 'inventory.query', 'inventory.count', 'slot.recommend', 'dwell.read', 'anomaly.flag'],
    forbidden: ['inventory.adjust', 'inventory.write_off', 'zone.movement'],
    a2a: ['order-management-expert', 'network-designer'], mcp: ['wms-core', 'iot-dwell'],
    kv: { 'Approval required': 'adjust_inventory, write_off, reclassify_goods', 'Threshold': 'MYR 10,000' },
  },
  'forecast-agent': {
    title: 'forecast-agent', tier: 1,
    summary: 'Volume, capacity, staffing forecasting. Advisory only — never triggers ops directly.',
    status: 'degraded', model: 'gpt-5.2-mini',
    telemetry: { p50: '2.1s', p95: '5.8s', tokens: '42.7k', errors: '0.42%' },
    skills: ['forecasting-expert', 'demand-forecaster', 'vector'],
    allowed: ['forecast.volume', 'forecast.capacity', 'forecast.staffing', 'twin.scenario.read', 'twin.scenario.write'],
    forbidden: ['ops.write', 'procurement.commit', 'declaration.submit'],
    a2a: ['demand-forecaster', 'digital-twin-engineer', 'procurement-negotiator'],
    mcp: ['timeseries-db', 'twin-engine'],
    kv: { 'Mode': 'advisory_only: true', 'Feature flag': 'FF_AGENTS (+ FF_TWIN)' },
  },
  'risk-agent': {
    title: 'risk-agent', tier: 1,
    summary: 'Anomaly detection, compliance flagging against MAQIS / SIRIM / MITI / MDA / DCA.',
    status: 'healthy', model: 'claude-4.5-sonnet',
    telemetry: { p50: '760ms', p95: '2.2s', tokens: '14.8k', errors: '0.06%' },
    skills: ['anomaly-detection', 'rag-retrieval', 'vector'],
    allowed: ['cargo.read', 'declaration.read', 'control_list.check', 'anomaly.detect', 'bottleneck.identify'],
    forbidden: ['cargo.write', 'declaration.submit', 'gate.release'],
    a2a: ['vector-analyst'], mcp: ['control-list-db', 'anomaly-engine'],
    kv: { 'Approval required': 'block_shipment, quarantine_cargo', 'Always cite': 'true' },
  },
  'customs-agent': {
    title: 'customs-agent', tier: 1,
    summary: 'HS classification, tariff resolution, declaration drafting, broker audit, drawback prep.',
    status: 'active', model: 'gpt-5.2',
    telemetry: { p50: '1.2s', p95: '3.4s', tokens: '31.5k', errors: '0.18%' },
    skills: ['customs-classification', 'tariff-calculation', 'declaration-prep', 'sea-freight', 'order-management'],
    allowed: ['hs.classify', 'tariff.resolve', 'tariff.calculate', 'declaration.prepare', 'declaration.validate', 'declaration.audit', 'drawback.prepare'],
    forbidden: ['declaration.submit', 'declaration.amend', 'declaration.cancel', 'tariff.override', 'jkdm.submit'],
    a2a: ['tariff-expert', 'sea-freight-expert'], mcp: ['hs-code-data', 'jkdm-api'],
    kv: { 'Approval required': 'submit / amend / cancel / file_drawback', 'Threshold': 'MYR 0 (every filing)', 'Must cite source': 'true (source + retrievedAt)', 'Failure modes': 'TARIFF_UNSOURCED · REQUIRES_RULING' },
  },
  'zone-agent': {
    title: 'zone-agent', tier: 1,
    summary: 'FIZ manufacturing + FCZ trading movements, gate passes, bonded ledger, exemption tracking.',
    status: 'healthy', model: 'claude-4.5-sonnet',
    telemetry: { p50: '350ms', p95: '980ms', tokens: '8.9k', errors: '0.04%' },
    skills: ['bonded-ledger', 'gate-operations', 'logistics'],
    allowed: ['zone.fiz_movement', 'zone.fcz_trade', 'zone.gate_pass.issue', 'bonded_ledger.read', 'bonded_ledger.propose', 'exemption.track'],
    forbidden: ['bonded_ledger.write', 'declaration.submit', 'cargo.delete'],
    a2a: ['sea-freight-expert'], mcp: ['fiz-gate', 'bonded-ledger'],
    kv: { 'Approval required': 'move_bonded_goods, adjust_bonded_ledger, release_without_duty', 'Threshold': 'MYR 0 (any bonded movement)' },
  },
  'cargo-expert': {
    title: 'cargo-expert', tier: 2,
    summary: 'Advisory consignment data modeler. Validates cargo manifests, weight/volume consistency, and dangerous-goods flags.',
    status: 'idle', model: 'claude-4.5-sonnet',
    telemetry: { p50: '310ms', p95: '820ms', tokens: '4.2k', errors: '0.02%' },
    skills: ['cargo-modeling', 'dg-classification'],
    allowed: ['cargo.validate', 'cargo.enrich', 'consignment.describe'],
    forbidden: ['cargo.write', 'cargo.delete', 'declaration.submit'],
    a2a: [], mcp: ['cargo-schema'],
    kv: { 'Mode': 'advisory_only: true', 'Citation': 'required' },
  },
  'tariff-expert': {
    title: 'tariff-expert', tier: 2,
    summary: 'Advisory resolver for HS / AHTN 2022 rates. Single source of truth: src/hs-code-data.ts.',
    status: 'healthy', model: 'gpt-5.2',
    telemetry: { p50: '180ms', p95: '450ms', tokens: '3.2k', errors: '0.00%' },
    skills: ['customs-classification', 'tariff-calculation'],
    allowed: ['resolve code + rate', 'return { rate, source, retrievedAt, controlFlags[], citation }'],
    forbidden: ['any state mutation', 'estimate without source'],
    a2a: [], mcp: ['hs-code-data'],
    kv: { 'Source of truth': 'src/hs-code-data.ts', 'Schemes': 'MFN · ATIGA · ACFTA · RCEP · CPTPP · MJEPA · MCFTA', 'Unsourced rate': 'TARIFF_UNSOURCED (fail-closed)', 'Ambiguity': 'REQUIRES_RULING' },
  },
  'sea-freight-expert': {
    title: 'sea-freight-expert', tier: 2,
    summary: 'Interprets B/L clauses, demurrage / detention risk, and port congestion patterns.',
    status: 'idle', model: 'claude-4.5-sonnet',
    telemetry: { p50: '520ms', p95: '1.4s', tokens: '7.8k', errors: '0.05%' },
    skills: ['bl-interpretation', 'freight-analytics'],
    allowed: ['bl.parse', 'demurrage.assess', 'port.congestion.query'],
    forbidden: ['bl.amend', 'shipment.book', 'declaration.submit'],
    a2a: [], mcp: ['port-feed', 'bl-parser'],
    kv: { 'Mode': 'advisory_only: true' },
  },
  'order-management-expert': {
    title: 'order-management-expert', tier: 2,
    summary: 'Models order lifecycle: allocation, fulfilment, backorder handling, cancellations.',
    status: 'idle', model: 'gpt-5.2',
    telemetry: { p50: '340ms', p95: '900ms', tokens: '5.1k', errors: '0.03%' },
    skills: ['order-modeling', 'allocation-logic'],
    allowed: ['order.read', 'order.plan', 'order.simulate'],
    forbidden: ['order.cancel', 'order.allocate', 'inventory.adjust'],
    a2a: [], mcp: ['oms-core'],
    kv: { 'Mode': 'advisory_only: true' },
  },
  'procurement-negotiator': {
    title: 'procurement-negotiator', tier: 2,
    summary: 'Compares vendor quotes, drafts negotiation strategy, flags rate anomalies.',
    status: 'idle', model: 'claude-4.5-sonnet',
    telemetry: { p50: '780ms', p95: '2.1s', tokens: '11.3k', errors: '0.07%' },
    skills: ['rate-analysis', 'negotiation-strategy'],
    allowed: ['vendor.quote.compare', 'strategy.draft', 'rate.anomaly.flag'],
    forbidden: ['vendor.commit', 'po.issue', 'price.override'],
    a2a: [], mcp: ['vendor-db'],
    kv: { 'Mode': 'advisory_only: true', 'Threshold': 'MYR 100,000 → human review' },
  },
  'demand-forecaster': {
    title: 'demand-forecaster', tier: 2,
    summary: 'ML demand forecasts with seasonality + promotion detection. Emits confidence intervals.',
    status: 'degraded', model: 'timeseries-ml',
    telemetry: { p50: '1.4s', p95: '3.2s', tokens: '0', errors: '0.15%' },
    skills: ['ml-forecasting', 'seasonality'],
    allowed: ['demand.forecast', 'confidence.emit'],
    forbidden: ['procurement.commit', 'ops.write'],
    a2a: [], mcp: ['timeseries-db'],
    kv: { 'Mode': 'advisory_only: true', 'Horizon': '90 days', 'Model': 'prophet-ensemble-v4' },
  },
  'vector-analyst': {
    title: 'vector-analyst', tier: 2,
    summary: 'Hybrid BM25 + dense retrieval. Reranks with cross-encoder, returns cited snippets.',
    status: 'healthy', model: 'embedding + rerank',
    telemetry: { p50: '110ms', p95: '310ms', tokens: '0', errors: '0.00%' },
    skills: ['hybrid-search', 'reranking', 'citation'],
    allowed: ['rag.query', 'rag.rerank', 'rag.cite'],
    forbidden: ['any state mutation'],
    a2a: [], mcp: ['vector-db', 'rerank-svc'],
    kv: { 'Vector store': 'pgvector + BM25', 'Reranker': 'bge-reranker-v2' },
  },
  'digital-twin-engineer': {
    title: 'digital-twin-engineer', tier: 2,
    summary: 'What-if simulation for yard / berth / staffing scenarios. Read-only on ops state.',
    status: 'idle', model: 'sim-engine',
    telemetry: { p50: '2.8s', p95: '7.1s', tokens: '0', errors: '0.00%' },
    skills: ['discrete-event-sim', 'scenario-modeling'],
    allowed: ['twin.scenario.run', 'twin.scenario.compare', 'twin.state.read'],
    forbidden: ['twin.state.write.ops', 'ops.write'],
    a2a: [], mcp: ['twin-engine', 'yard-graph'],
    kv: { 'Mode': 'advisory_only: true', 'Max scenarios': '3 per run' },
  },
  'network-designer': {
    title: 'network-designer', tier: 2,
    summary: 'Optimises logistics network topology: hub placement, lane routing, contingency paths.',
    status: 'idle', model: 'claude-4.5-sonnet',
    telemetry: { p50: '1.9s', p95: '4.2s', tokens: '16.4k', errors: '0.08%' },
    skills: ['graph-optimisation', 'lane-routing'],
    allowed: ['network.topology.propose', 'lane.simulate'],
    forbidden: ['lane.commit', 'ops.write'],
    a2a: [], mcp: ['network-graph'],
    kv: { 'Mode': 'advisory_only: true' },
  },
  'wms-implementer': {
    title: 'wms-implementer', tier: 2,
    summary: 'Tenant provisioning, zone layout templates, slot-rule configuration.',
    status: 'idle', model: 'gpt-5.2',
    telemetry: { p50: '5.2s', p95: '12s', tokens: '22.7k', errors: '0.11%' },
    skills: ['tenant-provisioning', 'layout-generation'],
    allowed: ['tenant.provision', 'layout.template.apply', 'slot.rule.configure'],
    forbidden: ['tenant.delete', 'data.export'],
    a2a: [], mcp: ['wms-core', 'tenant-db'],
    kv: { 'Requires approval': 'tenant.provision (ADMIN)', 'Idempotency': 'required' },
  },
  'human-approval-gate': {
    title: 'human-approval-gate', tier: 3,
    summary: 'The single chokepoint for every high-stakes action. No Tier-1 agent may execute a gated action directly.',
    status: 'active', model: 'human',
    telemetry: { p50: '4m 12s', p95: '18m', tokens: '0', errors: '0.00%' },
    allowed: ['execute on explicit human approval', 'write audit record'],
    forbidden: ['be invoked by an AGENT role', 'auto-approve on timeout'],
    kv: { 'Gated actions': 'declaration.submit/amend/cancel · drawback.file · bonded_ledger.write · move_bonded_goods · override_gate', 'Required role': 'OPS_MANAGER or ADMIN', 'Timeout': 'auto-reject (never auto-approve)' },
  },
  'compliance-auditor': {
    title: 'compliance-auditor', tier: 3,
    summary: 'Continuously verifies every agent action. Graph-aware observability with trajectory scoring.',
    status: 'healthy', model: 'rules + eval',
    telemetry: { p50: '90ms', p95: '220ms', tokens: '0', errors: '0.00%' },
    allowed: ['emit structured findings', 'route to security-guardian'],
    forbidden: ['mutate business state', 'modify audit log'],
    kv: { 'Checks': 'scope drift · unsourced rate · missing audit · cross-tenant leak · guardrail bypass', 'Severity': 'HIGH / CRITICAL', 'Trace binding': 'gen_ai.agent.graph.node_id' },
  },
  'security-guardian': {
    title: 'security-guardian', tier: 3,
    summary: 'Monitors prompt injection, scope escalation, exfiltration. Can suspend agent instances at runtime.',
    status: 'idle', model: 'rules + LLM judge',
    telemetry: { p50: '60ms', p95: '180ms', tokens: '0', errors: '0.00%' },
    allowed: ['suspend agent instance', 'revoke scopes at runtime', 'raise incident'],
    forbidden: ['approve gated actions', 'modify audit log', 'delete data'],
    kv: { 'Special watch': 'tariff-data corruption (SECURITY.md §2, HIGH)', 'Suspend latency': '< 500 ms' },
  },
};

/* ══════════════════════════════════════════════════════════════
   Error boundary
   ══════════════════════════════════════════════════════════════ */
class ErrorBoundary extends Component<{ children: ReactNode }, BootErrorBoundaryState> {
  state: BootErrorBoundaryState = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<BootErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ info });
    // eslint-disable-next-line no-console
    console.error('React render error:', error, info);
  }

  render() {
    if (this.state.error) {
      const e = this.state.error;
      const stack = e.stack || String(e);
      return (
        <div className="error-screen">
          <h1>⚠ React Render Error</h1>
          <pre>{stack}</pre>
          {this.state.info && <pre>{this.state.info.componentStack}</pre>}
          <div className="hint">
            <strong>This usually means:</strong>
            <ol>
              <li>A module loaded partially or with a version mismatch</li>
              <li>Duplicate React instances in the bundle</li>
              <li>An unexpected undefined prop from <code>@xyflow/react</code></li>
            </ol>
            Check the DevTools Console and re-install dependencies.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ══════════════════════════════════════════════════════════════
   Custom node
   ══════════════════════════════════════════════════════════════ */
function AgentNode({ data, selected }: NodeProps<AgentNodeType>) {
  const meta = TIER_META[data.tier];
  const showTarget = data.tier !== 'cmd';
  return (
    <div className={`node ${meta.cls} ${selected ? 'selected' : ''}`}>
      {showTarget && <Handle type="target" position={Position.Left} />}
      <div className="top-row">
        <div className={`status-dot ${data.status ?? 'idle'}`} />
        <div className="tier-tag">{meta.label}</div>
      </div>
      <div className="name">{data.label}</div>
      {data.kind && <div className="kind">{data.kind}</div>}
      <div className="metric-row">
        {data.latency && data.latency !== '—' && (
          <span className="chip"><span className="dot" />{data.latency}</span>
        )}
        {data.tokens && <span className="chip">{data.tokens} tok</span>}
        {data.a2a && <span className="chip a2a">A2A</span>}
        {data.mcp && <span className="chip mcp">MCP ×{data.mcp}</span>}
        {data.approval && <span className="chip approval">⛉ gate</span>}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes: NodeTypes = { agent: AgentNode };

/* ══════════════════════════════════════════════════════════════
   Node / edge factories
   ══════════════════════════════════════════════════════════════ */
const N = (
  id: string,
  x: number,
  y: number,
  label: string,
  tier: TierKey,
  kind: string,
  extra: Partial<AgentNodeData> = {},
): AgentNodeType => ({
  id,
  type: 'agent',
  position: { x, y },
  data: { label, tier, kind, ...extra },
});

const initialNodes: AgentNodeType[] = [
  N('cmd-orch',      40,  400, 'orchestrate_supply_chain', 'cmd', 'entry command', { status: 'active' }),
  N('cmd-classify',  40,   30, 'classify_goods',           'cmd', '→ customs-agent', { status: 'idle' }),
  N('cmd-prepare',   40,  120, 'prepare_declaration',      'cmd', '→ customs-agent', { status: 'idle' }),
  N('cmd-forecast',  40,  210, 'forecast_demand',          'cmd', '→ forecast-agent', { status: 'degraded', latency: '2.1s' }),
  N('cmd-audit',     40,  680, 'audit_compliance',         'cmd', '→ compliance-auditor', { status: 'healthy', latency: '90ms' }),
  N('cmd-vector',    40,  770, 'analyze_vector',           'cmd', '→ vector-analyst', { status: 'idle' }),
  N('cmd-twin',      40,  860, 'build_digital_twin',       'cmd', '→ digital-twin-engineer', { status: 'idle' }),
  N('cmd-network',   40,  950, 'design_network',           'cmd', '→ network-designer', { status: 'idle' }),
  N('cmd-wms',       40, 1040, 'implement_wms',            'cmd', '→ wms-implementer', { status: 'idle' }),
  N('cmd-proc',      40, 1130, 'negotiate_procurement',    'cmd', '→ procurement-negotiator', { status: 'idle' }),

  N('orch', 410, 520, '_orchestrator', 0, 'FSM · routing · audit', {
    status: 'active', latency: '38ms', tokens: '0', a2a: true, approval: true,
  }),

  N('document-agent',  820,   40, 'document-agent',  1, 'extraction · RAG', {
    status: 'healthy', latency: '1.9s', tokens: '18.2k', a2a: true, mcp: 2,
  }),
  N('ops-agent',       820,  200, 'ops-agent',       1, 'gate · slot · ops', {
    status: 'active', latency: '1.1s', tokens: '9.4k', a2a: true, mcp: 2,
  }),
  N('inventory-agent', 820,  360, 'inventory-agent', 1, 'lot · batch · serial', {
    status: 'healthy', latency: '680ms', tokens: '6.1k', a2a: true, mcp: 2,
  }),
  N('forecast-agent',  820,  520, 'forecast-agent',  1, 'volume · capacity', {
    status: 'degraded', latency: '5.8s', tokens: '42.7k', a2a: true, mcp: 2,
  }),
  N('risk-agent',      820,  680, 'risk-agent',      1, 'anomaly · compliance', {
    status: 'healthy', latency: '2.2s', tokens: '14.8k', a2a: true, mcp: 2,
  }),
  N('customs-agent',   820,  840, 'customs-agent',   1, 'HS · tariff · declaration', {
    status: 'active', latency: '3.4s', tokens: '31.5k', a2a: true, mcp: 2, approval: true,
  }),
  N('zone-agent',      820, 1000, 'zone-agent',      1, 'FIZ · FCZ · bonded', {
    status: 'healthy', latency: '980ms', tokens: '8.9k', a2a: true, mcp: 2, approval: true,
  }),

  N('cargo-expert',             1330,   40, 'cargo-expert',             2, 'consignment model', { status: 'idle' }),
  N('tariff-expert',            1330,  160, 'tariff-expert',            2, 'HS/AHTN · rates', { status: 'healthy', latency: '450ms', tokens: '3.2k', mcp: 1 }),
  N('sea-freight-expert',       1330,  280, 'sea-freight-expert',       2, 'B/L · demurrage', { status: 'idle' }),
  N('order-management-expert',  1330,  400, 'order-management-expert',  2, 'order lifecycle', { status: 'idle' }),
  N('procurement-negotiator',   1330,  520, 'procurement-negotiator',   2, 'vendor rates', { status: 'idle' }),
  N('demand-forecaster',        1330,  640, 'demand-forecaster',        2, 'ML demand', { status: 'degraded', latency: '1.4s' }),
  N('vector-analyst',           1330,  760, 'vector-analyst',           2, 'hybrid search', { status: 'healthy', latency: '210ms', mcp: 1 }),
  N('digital-twin-engineer',    1330,  880, 'digital-twin-engineer',    2, 'what-if sim', { status: 'idle' }),
  N('network-designer',         1330, 1000, 'network-designer',         2, 'topology', { status: 'idle' }),
  N('wms-implementer',          1330, 1120, 'wms-implementer',          2, 'tenant provisioning', { status: 'idle' }),

  N('human-approval-gate', 1830,  200, 'human-approval-gate', 3, 'gated actions', {
    status: 'active', latency: '4m 12s', approval: true,
  }),
  N('compliance-auditor',  1830,  620, 'compliance-auditor',  3, '5 checks · no mutation', {
    status: 'healthy', latency: '220ms',
  }),
  N('security-guardian',   1830, 1040, 'security-guardian',   3, 'threat · suspend', {
    status: 'idle', latency: '180ms',
  }),
];

const arrow = (color: string) => ({ type: MarkerType.ArrowClosed, color, width: 14, height: 14 });

function edge(id: string, source: string, target: string, opts: EdgeOpts = {}): Edge {
  const {
    label = '',
    color = '#64748b',
    animated = false,
    dashed = false,
    dotted = false,
    width = 1.4,
    type = 'smoothstep',
    zIndex,
  } = opts;
  return {
    id,
    source,
    target,
    type,
    animated,
    zIndex,
    label: label || undefined,
    labelStyle: label
      ? {
          fill: color,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: '0.2px',
        }
      : undefined,
    labelBgStyle: label ? { fill: 'var(--label-bg)', fillOpacity: 0.92 } : undefined,
    labelBgPadding: label ? [6, 3] : undefined,
    labelBgBorderRadius: 4,
    style: {
      stroke: color,
      strokeWidth: width,
      strokeDasharray: dashed ? '6 4' : dotted ? '2 4' : undefined,
    },
    markerEnd: arrow(color),
  };
}

const initialEdges: Edge[] = [
  edge('c1', 'cmd-orch',     'orch', { label: 'intent', color: '#64748b', dashed: true, animated: true }),
  edge('c2', 'cmd-classify', 'orch', { color: '#64748b', dashed: true }),
  edge('c3', 'cmd-prepare',  'orch', { color: '#64748b', dashed: true }),
  edge('c4', 'cmd-forecast', 'orch', { color: '#64748b', dashed: true }),

  edge('c5', 'cmd-audit',   'compliance-auditor',     { label: 'direct', color: '#64748b', dashed: true }),
  edge('c6', 'cmd-vector',  'vector-analyst',         { label: 'direct', color: '#64748b', dashed: true }),
  edge('c7', 'cmd-twin',    'digital-twin-engineer',  { label: 'direct', color: '#64748b', dashed: true }),
  edge('c8', 'cmd-network', 'network-designer',       { label: 'direct', color: '#64748b', dashed: true }),
  edge('c9', 'cmd-wms',     'wms-implementer',        { label: 'direct', color: '#64748b', dashed: true }),
  edge('c10', 'cmd-proc',   'procurement-negotiator', { label: 'direct', color: '#64748b', dashed: true }),

  edge('r1', 'orch', 'document-agent',  { label: 'extract',   color: '#0891b2', animated: true }),
  edge('r2', 'orch', 'ops-agent',       { label: 'gate/slot', color: '#0891b2', animated: true }),
  edge('r3', 'orch', 'inventory-agent', { label: 'inventory', color: '#0891b2', animated: true }),
  edge('r4', 'orch', 'forecast-agent',  { label: 'forecast',  color: '#f59e0b', animated: true }),
  edge('r5', 'orch', 'risk-agent',      { label: 'risk',      color: '#0891b2', animated: true }),
  edge('r6', 'orch', 'customs-agent',   { label: 'customs',   color: '#0891b2', animated: true }),
  edge('r7', 'orch', 'zone-agent',      { label: 'zone',      color: '#0891b2', animated: true }),
  edge('r8', 'orch', 'wms-implementer', { label: 'provision', color: '#0891b2', dashed: true }),

  edge('d1',  'document-agent',  'vector-analyst',          { label: 'A2A', color: '#8b5cf6', dotted: true }),
  edge('d2',  'risk-agent',      'vector-analyst',          { label: 'A2A', color: '#8b5cf6', dotted: true }),
  edge('d3',  'customs-agent',   'tariff-expert',           { label: 'resolve', color: '#8b5cf6', dotted: true, animated: true }),
  edge('d4',  'customs-agent',   'sea-freight-expert',      { label: 'A2A', color: '#8b5cf6', dotted: true }),
  edge('d5',  'ops-agent',       'cargo-expert',            { color: '#8b5cf6', dotted: true }),
  edge('d6',  'ops-agent',       'sea-freight-expert',      { color: '#8b5cf6', dotted: true }),
  edge('d7',  'ops-agent',       'network-designer',        { color: '#8b5cf6', dotted: true }),
  edge('d8',  'ops-agent',       'procurement-negotiator',  { color: '#8b5cf6', dotted: true }),
  edge('d9',  'inventory-agent', 'order-management-expert', { color: '#8b5cf6', dotted: true }),
  edge('d10', 'inventory-agent', 'network-designer',        { color: '#8b5cf6', dotted: true }),
  edge('d11', 'forecast-agent',  'demand-forecaster',       { color: '#8b5cf6', dotted: true }),
  edge('d12', 'forecast-agent',  'digital-twin-engineer',   { label: 'twin', color: '#8b5cf6', dotted: true }),
  edge('d13', 'forecast-agent',  'procurement-negotiator',  { color: '#8b5cf6', dotted: true }),

  edge('g1', 'customs-agent',   'human-approval-gate', { label: 'gate filing',   color: '#f59e0b', width: 2.2, animated: true, zIndex: 0 }),
  edge('g2', 'zone-agent',      'human-approval-gate', { label: 'gate bonded',   color: '#f59e0b', width: 2.2, animated: true, zIndex: 0 }),
  edge('g3', 'ops-agent',       'human-approval-gate', { label: 'gate override', color: '#f59e0b', width: 2, dashed: true, zIndex: 0 }),
  edge('g4', 'inventory-agent', 'human-approval-gate', { label: 'gate adjust',   color: '#f59e0b', width: 2, dashed: true, zIndex: 0 }),

  edge('a1', 'document-agent',  'compliance-auditor', { color: '#7c3aed', dotted: true, type: 'bezier', zIndex: 0 }),
  edge('a2', 'ops-agent',       'compliance-auditor', { color: '#7c3aed', dotted: true, type: 'bezier', zIndex: 0 }),
  edge('a3', 'inventory-agent', 'compliance-auditor', { color: '#7c3aed', dotted: true, type: 'bezier', zIndex: 0 }),
  edge('a4', 'forecast-agent',  'compliance-auditor', { color: '#7c3aed', dotted: true, type: 'bezier', zIndex: 0 }),
  edge('a5', 'risk-agent',      'compliance-auditor', { color: '#7c3aed', dotted: true, type: 'bezier', zIndex: 0 }),
  edge('a6', 'customs-agent',   'compliance-auditor', { color: '#7c3aed', dotted: true, type: 'bezier', zIndex: 0 }),
  edge('a7', 'zone-agent',      'compliance-auditor', { color: '#7c3aed', dotted: true, type: 'bezier', zIndex: 0 }),

  edge('s1', 'customs-agent', 'security-guardian', { color: '#ef4444', dotted: true, type: 'bezier', zIndex: 0 }),
  edge('s2', 'zone-agent',    'security-guardian', { color: '#ef4444', dotted: true, type: 'bezier', zIndex: 0 }),
  edge('s3', 'risk-agent',    'security-guardian', { color: '#ef4444', dotted: true, type: 'bezier', zIndex: 0 }),

  edge('f1', 'human-approval-gate', 'orch', { label: 'approved', color: '#10b981', dashed: true, animated: true }),
  edge('f2', 'compliance-auditor',  'orch', { label: 'findings', color: '#7c3aed', dashed: true }),
  edge('f3', 'security-guardian',   'orch', { label: 'suspend',  color: '#ef4444', dashed: true }),
];

/* ══════════════════════════════════════════════════════════════
   Side panel
   ══════════════════════════════════════════════════════════════ */
interface SidePanelProps {
  selected: string | null;
  nodes: AgentNodeType[];
}

function SidePanel({ selected, nodes }: SidePanelProps) {
  const nodeInfo = nodes.find((n) => n.id === selected);

  if (!selected) {
    const counts = {
      0: nodes.filter((n) => n.data.tier === 0).length,
      1: nodes.filter((n) => n.data.tier === 1).length,
      2: nodes.filter((n) => n.data.tier === 2).length,
      3: nodes.filter((n) => n.data.tier === 3).length,
      cmd: nodes.filter((n) => n.data.tier === 'cmd').length,
    };
    return (
      <div className="panel-body">
        <div className="empty-state">
          <div className="icon">◈</div>
          <div>
            Select an agent node to inspect<br />
            telemetry, guardrails, and handoff contracts.
          </div>
        </div>

        <div className="section-title">Mesh Overview</div>
        <div className="tier-summary">
          {(
            [
              ['Tier 0', 'Orchestrator', 'var(--tier-0)', counts[0]],
              ['Tier 1', 'Core mesh', 'var(--tier-1)', counts[1]],
              ['Tier 2', 'Specialists', 'var(--tier-2)', counts[2]],
              ['Tier 3', 'Governance', 'var(--tier-3)', counts[3]],
              ['Commands', 'Entry points', 'var(--tier-cmd)', counts.cmd],
            ] as const
          ).map(([t, label, c, n]) => (
            <div className="r" key={t}>
              <div className="dot" style={{ background: c }} />
              <div>{t} · {label}</div>
              <div className="n">{n} agent{n === 1 ? '' : 's'}</div>
            </div>
          ))}
        </div>

        <div className="section-title">2026 Invariants</div>
        <ul className="allowed">
          <li>Tenant isolation on every call</li>
          <li>Scope enforced in middleware, not prompts</li>
          <li>High-stakes actions gated by human approval</li>
          <li>Append-only audit on every transition</li>
          <li>Tariff truth only via hs-code-data.ts</li>
          <li>Graph-aware observability on every run</li>
          <li>A2A handoffs preserve state + intent</li>
        </ul>

        <div className="section-title">About this view</div>
        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.6, margin: 0 }}>
          Telemetry values shown here are <strong>simulated</strong>. In production,
          the inspector binds to OpenTelemetry <code>gen_ai.agent.graph.node_id</code> spans
          and live A2A message traces.
        </p>
      </div>
    );
  }

  const fallback: AgentDetails = {
    title: selected || '—',
    tier: (nodeInfo?.data?.tier as AgentDetails['tier']) ?? 2,
    summary: 'No detailed contract configured for this agent yet.',
    status: (nodeInfo?.data?.status as AgentStatus) ?? 'idle',
    model: '—',
    telemetry: { p50: '—', p95: '—', tokens: '0', errors: '—' },
    allowed: [],
    forbidden: [],
  };

  const d = AGENT_DETAILS[selected] ?? fallback;
  const tier: TierKey = (d.tier ?? 2) as TierKey;
  const meta = TIER_META[tier] ?? TIER_META[2];
  const pillCls = tier === 0 ? 't0' : tier === 1 ? 't1' : tier === 2 ? 't2' : 't3';
  const t = d.telemetry ?? {};

  return (
    <div className="panel-body">
      <span className={`pill ${pillCls}`}>
        <span className="dot" />{meta.label}
      </span>
      <h3>{d.title ?? selected}</h3>
      {d.summary && <p className="desc">{d.summary}</p>}

      {d.status && (
        <>
          <div className="section-title">Live telemetry</div>
          <div className="telemetry-grid">
            <div className="telemetry-card">
              <div className="label">Status</div>
              <div className="value" style={{ color: `var(--status-${d.status})` }}>
                {String(d.status).toUpperCase()}
              </div>
            </div>
            <div className="telemetry-card">
              <div className="label">Model</div>
              <div className="value" style={{ fontSize: '11px' }}>{d.model ?? '—'}</div>
            </div>
            <div className="telemetry-card">
              <div className="label">p50 / p95</div>
              <div className="value">
                {t.p50 ?? '—'} <small>/ {t.p95 ?? '—'}</small>
              </div>
            </div>
            <div className="telemetry-card">
              <div className="label">Tokens</div>
              <div className="value">{t.tokens ?? '0'} <small>avg</small></div>
            </div>
            <div className="telemetry-card">
              <div className="label">Error rate</div>
              <div className="value">{t.errors ?? '0.00%'}</div>
            </div>
            <div className="telemetry-card">
              <div className="label">A2A peers</div>
              <div className="value">{d.a2a ? d.a2a.length : 0}</div>
            </div>
          </div>
        </>
      )}

      {d.kv && (
        <>
          <div className="section-title">Contract</div>
          <dl className="kv">
            {Object.entries(d.kv).map(([k, v]) => (
              <Fragment key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </Fragment>
            ))}
          </dl>
        </>
      )}

      {d.responsibilities && (
        <>
          <div className="section-title">Responsibilities</div>
          <ul>{d.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </>
      )}

      {d.skills && (
        <>
          <div className="section-title">Skills</div>
          <ul className="skills">{d.skills.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </>
      )}

      {d.allowed && d.allowed.length > 0 && (
        <>
          <div className="section-title">Allowed procedures</div>
          <ul className="allowed">{d.allowed.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </>
      )}

      {d.forbidden && d.forbidden.length > 0 && (
        <>
          <div className="section-title">Forbidden</div>
          <ul className="forbidden">{d.forbidden.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </>
      )}

      {d.a2a && d.a2a.length > 0 && (
        <>
          <div className="section-title">A2A handoff peers</div>
          <ul>{d.a2a.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </>
      )}

      {d.mcp && d.mcp.length > 0 && (
        <>
          <div className="section-title">MCP tool bindings</div>
          <ul>{d.mcp.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </>
      )}

      <div className="section-title">
        Recent traces
        <span
          style={{
            padding: '1px 5px',
            borderRadius: 3,
            background: 'rgba(245,158,11,0.1)',
            color: 'var(--status-degraded)',
            fontSize: 8,
          }}
        >
          SIM
        </span>
      </div>
      <div className="trace-feed">
        {[
          { t: '14:02:11', evt: 'orch → ' + (d.title ?? selected), badge: 'ok', b: 'route' },
          { t: '14:02:12', evt: 'scope check passed', badge: 'ok', b: 'auth' },
          { t: '14:02:14', evt: 'tool call · ' + (d.mcp?.[0] ?? 'mcp'), badge: 'ok', b: 'mcp' },
          { t: '14:02:18', evt: 'guardrail eval', badge: 'warn', b: 'eval' },
        ].map((x, i) => (
          <div className="trace-item" key={i}>
            <span className="t">{x.t}</span>
            <span className="evt">{x.evt}</span>
            <span className={`badge ${x.badge}`}>{x.b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Color mode hook
   ══════════════════════════════════════════════════════════════ */
const MODES: ColorMode[] = ['dark', 'light', 'system'];

function useColorMode(): [ColorMode, (m: ColorMode) => void, boolean] {
  const [mode, setMode] = useState<ColorMode>(() => {
    try {
      const stored = localStorage.getItem('cfs.colorMode2026');
      if (stored === 'dark' || stored === 'light' || stored === 'system') return stored;
      return 'dark';
    } catch {
      return 'dark';
    }
  });
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const apply = (m: ColorMode) => {
      const dark =
        m === 'dark' ||
        (m === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.body.classList.toggle('dark-mode', dark);
      setIsDark(dark);
    };
    apply(mode);
    try { localStorage.setItem('cfs.colorMode2026', mode); } catch { /* ignore */ }

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => apply('system');
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, [mode]);

  return [mode, setMode, isDark];
}

/* ══════════════════════════════════════════════════════════════
   App
   ══════════════════════════════════════════════════════════════ */
function App() {
  const [nodes, , onNodesChange] = useNodesState<AgentNodeType>(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode, isDark] = useColorMode();
  const [inspectorOpen, setInspectorOpen] = useState(false);

  const onNodeClick = useCallback((_: React.MouseEvent, node: AgentNodeType) => {
    setSelected(node.id);
    setInspectorOpen(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelected(null);
    setInspectorOpen(false);
  }, []);

  const closeInspector = useCallback(() => {
    setInspectorOpen(false);
    setSelected(null);
  }, []);

  const onInit = useCallback((inst: ReactFlowInstance) => {
    setTimeout(() => inst.fitView({ padding: 0.12, duration: 600 }), 60);
  }, []);

  const minimapColor = useCallback((n: Node) => {
    const tier = (n.data as AgentNodeData | undefined)?.tier;
    const m = tier !== undefined ? TIER_META[tier] : undefined;
    return m ? m.color : '#64748b';
  }, []);

  const stats = useMemo(
    () => ({
      nodes: nodes.length,
      edges: edges.length,
      healthy: nodes.filter((n) => n.data?.status === 'healthy' || n.data?.status === 'active').length,
      degraded: nodes.filter((n) => n.data?.status === 'degraded').length,
    }),
    [nodes, edges],
  );

  const backgroundDotColor = isDark ? '#1a2942' : '#cbd5e1';

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="brand">
            <div className="logo">CFS</div>
            <div>
              <h1>TradeOps CFS WMS</h1>
              <div className="sub">Agent Mesh Control Plane · 2026</div>
            </div>
          </div>

          <div className="demo-pill">
            <span className="pulse" /> Demo
          </div>

          <div className="stats">
            <div className="metric"><small>Agents</small><b>{stats.nodes}</b></div>
            <div className="metric"><small>Edges</small><b>{stats.edges}</b></div>
            <div className="metric"><small>Healthy</small><b style={{ color: 'var(--status-healthy)' }}>{stats.healthy}</b></div>
            <div className="metric"><small>Degraded</small><b style={{ color: 'var(--status-degraded)' }}>{stats.degraded}</b></div>
            <div className="metric"><small>Guardrail hits</small><b style={{ color: 'var(--status-degraded)' }}>2</b></div>
          </div>

          <div className="mode-toggle">
            {MODES.map((m) => (
              <button
                key={m}
                className={mode === m ? 'active' : ''}
                onClick={() => setMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </header>

        <div className="graph-wrap">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={onInit}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.15}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{ type: 'smoothstep' }}
            colorMode={isDark ? 'dark' : 'light'}
            className="touch-flow"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color={backgroundDotColor}
            />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={minimapColor}
              nodeStrokeColor={isDark ? '#0e1626' : '#ffffff'}
              nodeBorderRadius={4}
              maskColor={isDark ? 'rgba(7,11,20,0.82)' : 'rgba(246,248,251,0.82)'}
              pannable
              zoomable
              style={{ width: 180, height: 120 }}
            />

            <Panel position="top-left" style={{ margin: 14 }}>
              <div className="legend">
                <h4>Tiers</h4>
                <div className="row"><span className="swatch" style={{ color: 'var(--tier-0)', background: 'rgba(220,38,38,0.1)' }} /> Orchestrator</div>
                <div className="row"><span className="swatch" style={{ color: 'var(--tier-1)', background: 'rgba(8,145,178,0.1)' }} /> Core mesh</div>
                <div className="row"><span className="swatch" style={{ color: 'var(--tier-2)', background: 'rgba(124,58,237,0.1)' }} /> Specialist</div>
                <div className="row"><span className="swatch" style={{ color: 'var(--tier-3)', background: 'rgba(217,119,6,0.1)' }} /> Governance</div>

                <h4 style={{ marginTop: 10 }}>Edge semantics</h4>
                <div className="row"><span className="line" style={{ color: '#0891b2' }} /> A2A route</div>
                <div className="row"><span className="line dotted" style={{ color: '#8b5cf6' }} /> A2A delegate</div>
                <div className="row"><span className="line" style={{ color: '#f59e0b' }} /> Approval gate</div>
                <div className="row"><span className="line dotted" style={{ color: '#7c3aed' }} /> Audit trace</div>
                <div className="row"><span className="line" style={{ color: '#10b981' }} /> Feedback / approved</div>
              </div>
            </Panel>
          </ReactFlow>

          <div className="status-bar">
            <span className="item">
              <span className="dot" style={{ background: 'var(--status-degraded)' }} />{' '}
              <span className="sim-tag">SIMULATED</span>
            </span>
            <span className="item">Run graph <span className="val">#cf-8821</span></span>
            <span className="item">p95 <span className="val">2.8s</span></span>
            <span className="item">A2A hops <span className="val">6 / 12</span></span>
            <span className="item" style={{ marginLeft: 'auto' }}>
              Graph-aware observability <span className="val">ON</span>
            </span>
          </div>
        </div>

        <aside className={`side ${inspectorOpen ? 'open' : ''}`}>
          <div className="panel-header">
            <div>
              <h2>Inspector</h2>
              <div className="subtitle">
                {selected ? (AGENT_DETAILS[selected]?.title ?? selected) : 'No selection'}
              </div>
            </div>
            <button className="close-btn" onClick={closeInspector} title="Close inspector">
              ×
            </button>
          </div>
          <SidePanel selected={selected} nodes={nodes} />
        </aside>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   Default export
   ══════════════════════════════════════════════════════════════ */
export default function CfsWmsPage() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
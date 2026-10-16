'use client';

import type { IntegrationMode } from '@/types';

const MODES: IntegrationMode[] = ['development', 'manual', 'production'];

export interface TabBarProps {
  mode: IntegrationMode;
  onModeChange: (m: IntegrationMode) => void;
  running: boolean;
  verified: boolean;
  integrationLabel: string;
  loopCount: number;
  onOpenManual: () => void;
  onRun: () => void;
  onFitView: () => void;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  onResetLayout: () => void;
}

export default function TabBar({
  mode, onModeChange, running, verified, integrationLabel, loopCount,
  onOpenManual, onRun, onFitView, leftCollapsed, rightCollapsed,
  onToggleLeft, onToggleRight, onResetLayout,
}: TabBarProps) {
  const pillCls = mode === 'development' ? 'dev' : mode === 'manual' ? 'warn' : verified ? 'ok' : 'bad';

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#1f2937] bg-[#0a0e14] px-2 text-[11px]">
      <div className="flex items-center gap-1.5 whitespace-nowrap rounded-t border border-[#1f2937] border-b-0 bg-[#0f141b] px-2.5 py-1.5 text-[#e5e7eb]">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        <span>declaration_clearance_loop</span>
      </div>

      <div className="w-2" />

      <div className="flex rounded-[7px] border border-[#1f2937] bg-[#080f1d] p-[3px]">
        {MODES.map((m) => {
          const on = mode === m;
          const styles = on
            ? m === 'development' ? 'bg-[#3b1d63] text-[#e9d5ff]'
            : m === 'manual' ? 'bg-[#4a3410] text-[#fde68a]'
            : 'bg-[#0f3d2e] text-[#a7f3d0]'
            : 'text-[#6b7280]';
          return (
            <button key={m} disabled={running}
              onClick={() => onModeChange(m)}
              className={'rounded px-2.5 py-1 text-[10.5px] font-semibold disabled:cursor-not-allowed disabled:opacity-50 ' + styles}>
              {m === 'development' ? 'Development' : m === 'manual' ? 'Manual' : 'Production'}
            </button>
          );
        })}
      </div>

      <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-semibold ${
        pillCls === 'dev' ? 'border-[#4c1d95] bg-[#1c1030] text-[#d8b4fe]'
        : pillCls === 'warn' ? 'border-[#5a3d0a] bg-[#231a05] text-[#fcd34d]'
        : pillCls === 'ok' ? 'border-[#134e3a] bg-[#08211a] text-[#6ee7b7]'
        : 'border-[#5b1a1a] bg-[#250d0d] text-[#fca5a5]'
      }`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {integrationLabel}
      </span>

      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#1f2937] px-2 py-1 text-[10px] font-semibold">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
        {loopCount} loop group{loopCount === 1 ? '' : 's'}
      </span>

      <div className="flex-1" />

      <button disabled={running} onClick={onOpenManual}
        className="whitespace-nowrap rounded border border-[#b45309] bg-[#78350f] px-2.5 py-1 text-[11px] font-semibold text-[#fde68a] hover:bg-[#92400e] disabled:opacity-50">
        Record Manual Response
      </button>
      <button disabled={running} onClick={onRun}
        className="whitespace-nowrap rounded border border-blue-500 bg-blue-700 px-2.5 py-1 text-[11px] font-semibold hover:bg-blue-800 disabled:opacity-50">
        {running ? 'Running…' : '▶ Run Workflow'}
      </button>

      <button onClick={onResetLayout} title="Reset layout"
        className="grid h-[26px] w-[26px] place-items-center rounded text-[#6b7280] hover:bg-[#1f2731] hover:text-[#e5e7eb]">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" />
        </svg>
      </button>
      <button onClick={onToggleLeft} title="Toggle left (Ctrl+B)"
        className={`grid h-[26px] w-[26px] place-items-center rounded hover:bg-[#1f2731] hover:text-[#e5e7eb] ${leftCollapsed ? 'text-[#6b7280]' : 'text-[#60a5fa]'}`}>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" />
        </svg>
      </button>
      <button onClick={onToggleRight} title="Toggle right (Ctrl+J)"
        className={`grid h-[26px] w-[26px] place-items-center rounded hover:bg-[#1f2731] hover:text-[#e5e7eb] ${rightCollapsed ? 'text-[#6b7280]' : 'text-[#60a5fa]'}`}>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M15 3v18" />
        </svg>
      </button>
    </div>
  );
}
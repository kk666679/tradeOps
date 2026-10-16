'use client';

import type { Capability, IntegrationMode, StudioNode } from '@/types';
import { ALL_CAPABILITIES, CAP_LABEL, CAPABILITIES } from '@/constants/capabilities';
import { byType } from '@/constants/nodeLibrary';

export interface IntegrationPanelProps {
  mode: IntegrationMode;
  verified: boolean;
  prodEnabled: boolean;
  transport: boolean;
  onProdEnabledChange: (v: boolean) => void;
  onTransportChange: (v: boolean) => void;
  supported: Capability[];
  nodeCount: number;
  edgeCount: number;
  loopCount: number;
  blockedNodes: StudioNode[];
}

export default function IntegrationPanel(props: IntegrationPanelProps) {
  const { mode, verified, prodEnabled, transport, supported, blockedNodes } = props;
  const supportedLive = supported.length ? supported : (CAPABILITIES[mode] || []);

  return (
    <div className="flex-1 overflow-y-auto p-2.5">
      <Card title="Adapter Mode">
        <KV k="Resolved mode" v={mode} />
        <KV k="Verified transport"
          v={verified ? 'flagged configured (not probed)' : 'no'}
          vCls={verified ? 'text-emerald-300' : 'text-[#fca5a5]'} />
        <KV k="External side-effects" v="blocked" vCls="text-[#fca5a5]" />
        <KV k="Synthetic results" v={mode === 'development' ? 'yes' : 'no'} />
        <KV k="Loop groups" v={String(props.loopCount)} />
        <KV k="Nodes / edges" v={`${props.nodeCount} / ${props.edgeCount}`} />
      </Card>

      {mode === 'production' && (
        <Card title="Production Safeguards — Demo Toggles">
          <label className="flex items-center gap-2 py-1 text-[11.5px] font-semibold">
            <input type="checkbox" checked={prodEnabled}
              onChange={(e) => props.onProdEnabledChange(e.target.checked)} />
            <span>Explicit production enablement flag</span>
          </label>
          <label className="flex items-center gap-2 py-1 text-[11.5px] font-semibold">
            <input type="checkbox" checked={transport}
              onChange={(e) => props.onTransportChange(e.target.checked)} />
            <span>Transport implementation placeholder</span>
          </label>
          <div className="mt-2 text-[10.5px] leading-relaxed text-[#4b5563]">
            These local toggles do not implement or verify a real JKDM connection.
            Submission remains simulated/blocked.
          </div>
        </Card>
      )}

      <Card title="Capabilities">
        {ALL_CAPABILITIES.map((c) => {
          const on = supportedLive.includes(c);
          const never = c.includes('manifest');
          const cls = on ? 'text-emerald-300 border-emerald-800'
            : never ? 'text-[#fcd34d] border-[#5a3d0a]'
            : 'text-[#71809a] border-[#17233c]';
          return (
            <div key={c} className={'my-1 flex items-center gap-1.5 rounded border bg-[#0b1424] px-2 py-1 text-[11px] ' + cls}>
              <span className="w-3 text-center font-bold">{on ? '✓' : never ? '!' : '×'}</span>
              <span>{CAP_LABEL[c]}</span>
            </div>
          );
        })}
        <p className="mt-2 text-[10.5px] leading-relaxed text-[#4b5563]">
          Manifest operations remain unavailable — no official JKDM API exists in this build.
          No real customs endpoint is called by this standalone UI.
        </p>
      </Card>

      {blockedNodes.length > 0 && (
        <Card title="Blocked Operations">
          {blockedNodes.map((n) => (
            <div key={n.id} className="mb-2 text-[10.5px]">
              <strong className="text-[#fcd34d]">{byType[n.data.libraryType]?.label}</strong>
              <div className="mt-0.5 text-[#6b7280]">{n.data.error}</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 rounded-lg border border-[#1f2937] bg-[#0f1830] p-2.5">
      <h5 className="mb-2 text-[9.5px] font-extrabold uppercase tracking-widest text-[#4b5563]">{title}</h5>
      {children}
    </div>
  );
}

function KV({ k, v, vCls }: { k: string; v: string; vCls?: string }) {
  return (
    <div className="flex justify-between gap-2 py-1 text-[11px]">
      <span className="text-[#6b7280]">{k}</span>
      <span className={'text-right font-semibold break-words ' + (vCls || '')}>{v}</span>
    </div>
  );
}
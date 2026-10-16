'use client';

import type { Declaration, DeclarationStatus } from '@/types';
import { TRANSITIONS } from '@/constants/transitions';
import { clock } from '@/lib/helpers';

export interface DeclarationPanelProps {
  decl: Declaration;
  onAdvance: (target: DeclarationStatus) => void;
  onApproveObservation: () => void;
}

const HIDDEN: DeclarationStatus[] = [
  'cancelled', 'validation_failed', 'integration_error', 'integration_required',
];

export default function DeclarationPanel({ decl, onAdvance, onApproveObservation }: DeclarationPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-2.5">
      <Card title="Declaration">
        <KV k="Internal ID" v={decl.id} />
        <KV k="Internal status" v={decl.status} vCls="text-[#93c5fd]" />
        <KV k="Official JKDM status" v={decl.official || 'not available'} vCls="text-[#4b5563]" />
      </Card>

      <Card title="Operator Control (demo)">
        <div className="mb-2 text-[10.5px] leading-relaxed text-[#4b5563]">
          Advance the declaration along a legal path to exercise the loop gate.
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(TRANSITIONS[decl.status] || [])
            .filter((s) => !HIDDEN.includes(s))
            .map((s) => (
              <button key={s} onClick={() => onAdvance(s)}
                className="flex-1 rounded border border-[#2d3748] bg-[#131921] px-2 py-1 text-[10px] font-semibold hover:bg-[#1f2731]">
                {s}
              </button>
            ))}
        </div>
        {decl.pendingObservation && (
          <button onClick={onApproveObservation}
            className="mt-2.5 w-full rounded border border-blue-500 bg-blue-700 px-2.5 py-1.5 text-[11px] font-semibold hover:bg-blue-800">
            Approve pending observation → {decl.pendingObservation.target}
          </button>
        )}
      </Card>

      {decl.pendingObservation && (
        <div className="mb-2 rounded-lg border border-[#b45309] bg-[#0f1830] p-2.5">
          <h5 className="mb-2 text-[9.5px] font-extrabold uppercase tracking-widest text-[#fcd34d]">
            Observation Awaiting Review
          </h5>
          <KV k="Target state" v={decl.pendingObservation.target} />
          <KV k="External ref" v={decl.pendingObservation.ref || '—'} />
          <KV k="Officer" v={decl.pendingObservation.officer || '—'} />
          <KV k="Evidence" v={decl.pendingObservation.evidence || 'exception path'} />
        </div>
      )}

      <Card title="State History">
        {[...decl.history].reverse().map((h, i) => (
          <div key={i} className={
            'border-b border-[#17233c] py-1 text-[11px] last:border-b-0 ' +
            (h.kind === 'block' ? 'text-[#fca5a5]' : h.kind === 'hold' ? 'text-[#fcd34d]' : 'text-[#e5e7eb]')
          }>
            <div>{h.text}</div>
            <div className="mt-0.5 text-[10px] text-[#4b5563]">
              {clock(h.at)}{h.provenance ? ` · ${h.provenance}` : ''}
            </div>
          </div>
        ))}
      </Card>

      <Card title="Guard Rules">
        <p className="text-[10.5px] leading-relaxed text-[#4b5563]">
          • Synthetic results can never reach <code>acknowledged</code>,{' '}
          <code>accepted</code>, <code>rejected</code> or <code>released</code>.<br />
          • Manual observations on sensitive states require reviewer approval.<br />
          • Loop groups are bounded and stop on stall or budget exhaustion.<br />
          • Nodes behind an unsatisfied gate are never executed.<br />
          • All state is browser-local and not an authoritative customs record.
        </p>
      </Card>
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
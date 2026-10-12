'use client';
import { useMemo } from 'react';
import { useStudio } from '@/lib/workflow-studio/store';
import { byType } from '@/lib/workflow-studio/node-definitions';
import { HS_BY_CODE, normalizeHsCode } from '@/lib/workflow-studio/hs-catalog';
import { clock } from '@/lib/workflow-studio/constants';

const TABS = ['integration', 'hs', 'declaration', 'audit', 'node'] as const;

export function InspectorPanel() {
  const tab = useStudio((s) => s.tab);
  const setTab = useStudio((s) => s.setTab);
  const mode = useStudio((s) => s.mode);
  const prodEnabled = useStudio((s) => s.prodEnabled);
  const transport = useStudio((s) => s.transport);
  const setProdEnabled = useStudio((s) => s.setProdEnabled);
  const setTransport = useStudio((s) => s.setTransport);
  const supported = useStudio((s) => {
    // import inside selector avoid top-level cycle concerns
    const { getSupportedOperations } = require('@/lib/workflow-studio/logic');
    return getSupportedOperations(s.mode, s.prodEnabled, s.transport);
  });
  const nodes = useStudio((s) => s.nodes);
  const selNodes = useStudio((s) => s.selNodes);
  const decl = useStudio((s) => s.decl);
  const audit = useStudio((s) => s.audit);
  const openHsPicker = useStudio((s) => s.openHsPicker);
  const setNodeHs = useStudio((s) => s.setNodeHsFromInspector);
  const setNodePga = useStudio((s) => s.setNodePgaLicense);

  const selected = useMemo(
    () => (selNodes.size === 1 ? nodes.find((n) => n.id === [...selNodes][0]) : null),
    [selNodes, nodes],
  );

  return (
    <aside className="bws-inspector">
      <div className="bws-tabs">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="bws-inspector-body">
        {tab === 'integration' && (
          <section>
            <h4>Integration</h4>
            <p className="bws-muted">Mode: <strong>{mode}</strong></p>
            <label className="bws-check">
              <input type="checkbox" checked={prodEnabled}
                onChange={(e) => setProdEnabled(e.target.checked)} />
              Production credentials configured
            </label>
            <label className="bws-check">
              <input type="checkbox" checked={transport}
                onChange={(e) => setTransport(e.target.checked)} />
              Live transport enabled
            </label>
            <div className="bws-cap-list">
              <div className="bws-muted">Supported operations in this mode:</div>
              {supported.length
                ? <ul>{supported.map((c) => <li key={c} className="mono">{c}</li>)}</ul>
                : <div className="bws-empty">No operations available. Run in Development or Manual mode.</div>}
            </div>
          </section>
        )}

        {tab === 'hs' && (
          <section>
            <h4>HS code</h4>
            {!selected && <div className="bws-empty">Select exactly one node to attach an HS code.</div>}
            {selected && (
              <>
                <div className="bws-muted">Node <strong>{selected.id}</strong> · {byType[selected.type]?.label || selected.type}</div>
                <label>Code
                  <input
                    className="bws-input mono"
                    defaultValue={selected.hsCode}
                    onBlur={(e) => setNodeHs(e.target.value)}
                    placeholder="8471.30.0000"
                  />
                </label>
                <label>PGA licence / permit
                  <input
                    className="bws-input"
                    defaultValue={selected.pgaLicense}
                    onBlur={(e) => setNodePga(e.target.value)}
                    placeholder="e.g. MITI AP-2024-XXXX"
                  />
                </label>
                <button className="bws-btn" onClick={() => openHsPicker(selected.id)}>
                  Browse HS catalog…
                </button>
                {selected.hsCode && (() => {
                  const e = HS_BY_CODE[normalizeHsCode(selected.hsCode)];
                  if (!e) return <div className="bws-callout warn">Code not in local catalog.</div>;
                  return (
                    <div className="bws-callout">
                      <div><strong>{e.code}</strong> — {e.desc}</div>
                      <div>{e.duty}% duty · {e.sst}% SST · chapter {e.chapter}</div>
                      {e.pga.length > 0 && <div>PGA: {e.pga.join(', ')}</div>}
                      {e.restricted && <div className="err">RESTRICTED — submission blocked.</div>}
                    </div>
                  );
                })()}
              </>
            )}
          </section>
        )}

        {tab === 'declaration' && (
          <section>
            <h4>Declaration</h4>
            <div className="bws-kv"><span>ID</span><span className="mono">{decl.id}</span></div>
            <div className="bws-kv"><span>Status</span><span>{decl.status}</span></div>
            {decl.pendingObservation && (
              <div className="bws-callout warn">
                Pending → {decl.pendingObservation.target}
              </div>
            )}
            <h5>History</h5>
            <ul className="bws-history">
              {decl.history.slice().reverse().map((h, i) => (
                <li key={i} className={h.kind}>
                  <time>{clock(h.at)}</time>
                  <span>{h.text}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === 'audit' && (
          <section>
            <h4>Audit trail</h4>
            <ul className="bws-audit">
              {audit.map((a) => (
                <li key={a.id} className={a.prov}>
                  <time>{clock(a.time)}</time>
                  <span className="op">{a.op}</span>
                  <span className="msg">{a.msg}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === 'node' && (
          <section>
            <h4>Node</h4>
            {!selected && <div className="bws-empty">Select a single node to inspect.</div>}
            {selected && (
              <>
                <div className="bws-kv"><span>ID</span><span className="mono">{selected.id}</span></div>
                <div className="bws-kv"><span>Type</span><span className="mono">{selected.type}</span></div>
                <div className="bws-kv"><span>Status</span><span>{selected.status}</span></div>
                <div className="bws-kv"><span>Provenance</span><span>{selected.provenance}</span></div>
                {selected.ref && <div className="bws-kv"><span>Ref</span><span className="mono">{selected.ref}</span></div>}
                {selected.error && <div className="bws-callout err">{selected.error}</div>}
              </>
            )}
          </section>
        )}
      </div>
    </aside>
  );
}

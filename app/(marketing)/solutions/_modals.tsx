'use client';

import { useEffect } from 'react';
import {
  Integration, Solution, LOGOS,
  iconBg, iconColor, catLabel, dirLabel, dirIcon,
  renderApiSample,
} from '../_data';
import { useToast } from './Toaster';

/* SolutionModal — UNCHANGED */

export function IntegrationModal({ intg, onClose }: { intg: Integration; onClose: () => void }) {
  const { push } = useToast();
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  const notes = intg.status === 'live'
    ? 'Production-ready. Connectors are monitored 24/7 with automatic failover and reconciliation reports.'
    : intg.status === 'beta'
      ? 'Beta connector — functional and battle-tested with early customers. Expect minor field-mapping changes.'
      : 'Coming soon. Join the waitlist and we will reach out when the connector is available.';

  return (
    <div className="imodal open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="imodal-shell">
        <div className="imodal-head">
          <div className="imodal-icon"
            dangerouslySetInnerHTML={{ __html: LOGOS[intg.id] || '' }} />
          <div className="imodal-head-body">
            <div className="imodal-eyebrow">
              <span className="cat">{catLabel(intg.cat)}</span>
              <span className={`int-status ${intg.status}`}><span className="sdot" />{intg.status}</span>
            </div>
            <h2 className="imodal-title">{intg.name}</h2>
            <p className="imodal-sub">{intg.long}</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="imodal-body">
          <div className="imodal-grid">
            <div>
              <h3 className="imodal-section-title">Configuration</h3>
              <div className="imodal-kv-grid">
                <div className="imodal-kv"><div className="l">Status</div><div className="v" style={{ textTransform:'capitalize' }}>{intg.status}</div></div>
                <div className="imodal-kv"><div className="l">Data direction</div><div className="v">{dirIcon(intg.direction)} {dirLabel(intg.direction)}</div></div>
                <div className="imodal-kv"><div className="l">Setup time</div><div className="v">{intg.setup}</div></div>
                <div className="imodal-kv"><div className="l">Auth method</div><div className="v">{intg.auth}</div></div>
              </div>
              <h3 className="imodal-section-title">What syncs</h3>
              <div className="sync-list">
                {intg.capabilities.map((c, i) => (
                  <div key={i} className="sync-item"><span className="check">✓</span><span>{c}</span></div>
                ))}
              </div>
              <h3 className="imodal-section-title">Supported entities</h3>
              <div className="entity-chips">
                {intg.entities.map((e, i) => <span key={i} className="entity-chip">{e}</span>)}
              </div>
            </div>
            <div>
              <h3 className="imodal-section-title">API example <span className="badge">curl</span></h3>
              <div className="api-sample" dangerouslySetInnerHTML={{ __html: renderApiSample(intg) }} />
              <h3 className="imodal-section-title" style={{ marginTop: 20 }}>Notes</h3>
              <div style={{ fontSize: 11.5, color:'var(--muted)', lineHeight: 1.6, padding: 12, borderRadius: 10, background:'rgba(255,255,255,.02)', border:'1px solid var(--line)' }}>{notes}</div>
            </div>
          </div>
          <div className="imodal-actions">
            <button className="connect" onClick={() => {
              push(intg.status === 'coming' ? `Added ${intg.name} to waitlist.` : `${intg.name} connector ready — API key generated.`);
              onClose();
            }}>{intg.status === 'coming' ? 'Join waitlist →' : 'Connect ' + intg.name}</button>
            <a href={`/docs/integrations/${intg.id}`} className="docs">View docs</a>
            <button className="close" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
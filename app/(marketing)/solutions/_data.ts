'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  SOLUTIONS, INTEGRATIONS, INT_CATEGORIES, TICKER_EVENTS, LOGOS,
  Integration, Solution, IntCategory,
  catLabel, dirIcon, dirLabel,
} from '../_data';
import { IntegrationModal } from './_modals';

/* ── Solution Card ── */
function SolutionCard({ sol, onClick }: { sol: Solution; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  };
  return (
    <button ref={ref} className={`sol-card ${sol.id}`} onClick={onClick} onMouseMove={onMove}>
      <div className={`sol-icon ${sol.id}`}>{sol.icon}</div>
      <h3 className="sol-title">{sol.title}</h3>
      <p className="sol-desc">{sol.shortDesc}</p>
      <div className="sol-chips">
        {sol.modules.slice(0, 3).map((m, i) => <span key={i} className="sol-chip">{m.t.split(' ')[0]}</span>)}
      </div>
      <div className="sol-cta">Explore solution <span className="arrow">→</span></div>
      <div className="sol-metrics">
        {sol.metrics.map((m, i) => (
          <div key={i} className={`sol-metric ${sol.id}`}><div className="v">{m.v}</div><div className="l">{m.l}</div></div>
        ))}
      </div>
    </button>
  );
}

/* ── Solutions Section ── */
export function SolutionsSection() {
  const [active, setActive] = useState<Solution | null>(null);
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);
  return (
    <section className="solutions" id="solutions">
      <div className="solutions-grid">
        {SOLUTIONS.map(sol => <SolutionCard key={sol.id} sol={sol} onClick={() => setActive(sol)} />)}
      </div>
      {active && <SolutionModal sol={active} onClose={() => setActive(null)} />}
    </section>
  );
}

/* ── Integration Card — renders SVG logo via dangerouslySetInnerHTML ── */
export function IntegrationCard({ intg, onClick }: { intg: Integration; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  };
  return (
    <button ref={ref} className="int-card" onClick={onClick} onMouseMove={onMove}>
      <div className="int-card-head">
        <div className="int-card-icon"
          dangerouslySetInnerHTML={{ __html: LOGOS[intg.id] || '' }} />
        <span className={`int-status ${intg.status}`}>
          <span className="sdot" />
          {intg.status === 'live' ? 'Live' : intg.status === 'beta' ? 'Beta' : 'Coming'}
        </span>
      </div>
      <div className="int-card-cat">{catLabel(intg.cat)}</div>
      <h3 className="int-card-title">{intg.name}</h3>
      <p className="int-card-desc">{intg.desc}</p>
      <div className="int-card-foot">
        <span className="int-card-dir">{dirIcon(intg.direction)} {dirLabel(intg.direction)}</span>
        <span className="int-card-open">Details <span className="arrow">→</span></span>
      </div>
    </button>
  );
}

/* ── Live Ticker — unchanged ── */
function LiveTicker() {
  const [lines, setLines] = useState<{ time: string; src: string; msg: string; cls: string }[]>([]);
  const idxRef = useRef(0);
  const push = useCallback(() => {
    const ev = TICKER_EVENTS[idxRef.current % TICKER_EVENTS.length];
    idxRef.current++;
    const time = new Date().toLocaleTimeString('en-GB');
    setLines(prev => [{ time, src: ev.src, msg: ev.msg, cls: ev.cls }, ...prev].slice(0, 4));
  }, []);
  useEffect(() => {
    push();
    const id = window.setInterval(push, 3800);
    return () => window.clearInterval(id);
  }, [push]);
  return (
    <div className="int-ticker" aria-live="polite">
      <div className="tt-head"><span className="d" /><span>Live webhook stream</span></div>
      <div>
        {lines.map((l, i) => (
          <div key={i} className="tt-line">
            <span className="tt-time">{l.time}</span>
            <span className="tt-src">{l.src}</span>
            <span className={`tt-msg ${l.cls}`}>{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Integrations Section — unchanged API ── */
interface IntegrationsSectionProps {
  compact?: boolean;
  showFilter?: boolean;
  showTicker?: boolean;
  heading?: React.ReactNode;
  intro?: React.ReactNode;
}
export function IntegrationsSection({
  compact = false, showFilter = true, showTicker = true, heading, intro,
}: IntegrationsSectionProps) {
  const [filter, setFilter] = useState<'all' | IntCategory>('all');
  const [active, setActive] = useState<Integration | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  const health = useMemo(() => ({
    live: INTEGRATIONS.filter(i => i.status === 'live').length,
    beta: INTEGRATIONS.filter(i => i.status === 'beta').length,
    coming: INTEGRATIONS.filter(i => i.status === 'coming').length,
  }), []);

  const filtered = useMemo(
    () => filter === 'all' ? INTEGRATIONS : INTEGRATIONS.filter(i => i.cat === filter),
    [filter]
  );
  const display = compact ? filtered.slice(0, 8) : filtered;

  return (
    <section className="integrations" id="integrations">
      <div className="int-head">
        <div className="eyebrow">🔌 Integrations</div>
        {heading ?? (
          <h2>Plug into the systems <span className="grad">you already run</span>.</h2>
        )}
        {intro ?? (
          <p>{INTEGRATIONS.length} first-class integrations across ERP, accounting, carriers, customs, banking, e-commerce and communications — with bi-directional sync, webhooks, and a shared event bus.</p>
        )}
        <div className="int-health">
          <span className="pill live">
            <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 6px currentColor' }} />
            <span>{health.live} live</span>
          </span>
          <span className="pill beta"><span>{health.beta} beta</span></span>
          <span className="pill coming"><span>{health.coming} coming soon</span></span>
          <div className="sync">
            <span className="dot" />
            <span>All sync endpoints healthy · 1.2M calls this week</span>
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="int-filters">
          {INT_CATEGORIES.map(c => {
            const count = c.id === 'all' ? INTEGRATIONS.length : INTEGRATIONS.filter(i => i.cat === c.id).length;
            return (
              <button key={c.id} className={`int-filter ${c.id === filter ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
                {c.label}<span className="count">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="int-grid">
        {display.map(intg => <IntegrationCard key={intg.id} intg={intg} onClick={() => setActive(intg)} />)}
      </div>

      {compact && (
        <div style={{ textAlign:'center', marginTop: 24 }}>
          <Link href="/solutions/integration" className="btn-ghost">View all {INTEGRATIONS.length} integrations →</Link>
        </div>
      )}

      {showTicker && <LiveTicker />}

      {active && <IntegrationModal intg={active} onClose={() => setActive(null)} />}
    </section>
  );
}
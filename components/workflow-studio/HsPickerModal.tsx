'use client';
import { useMemo, useState } from 'react';
import { useStudio } from '@/lib/workflow-studio/store';
import { HS_CATALOG, HS_CHAPTERS, normalizeHsCode, HS_BY_CODE } from '@/lib/workflow-studio/hs-catalog';

export function HsPickerModal() {
  const targetId = useStudio((s) => s.pickerTargetId);
  const close = useStudio((s) => s.closeHsPicker);
  const apply = useStudio((s) => s.applyHsCode);
  const clear = useStudio((s) => s.clearHsCode);
  const nodes = useStudio((s) => s.nodes);
  const [q, setQ] = useState('');
  const [chapter, setChapter] = useState<number | 'all'>('all');

  const current = useMemo(
    () => (targetId ? nodes.find((n) => n.id === targetId) : null),
    [targetId, nodes],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return HS_CATALOG.filter((h) => {
      if (chapter !== 'all' && h.chapter !== chapter) return false;
      if (!needle) return true;
      return h.code.includes(needle) || h.desc.toLowerCase().includes(needle);
    }).slice(0, 200);
  }, [q, chapter]);

  const chapters = useMemo(
    () => [...new Set(HS_CATALOG.map((h) => h.chapter))].sort((a, b) => a - b),
    [],
  );

  if (!targetId) return null;

  const preview = HS_BY_CODE[normalizeHsCode(q)] || null;

  return (
    <div className="bws-modal-backdrop" onClick={close}>
      <div className="bws-modal wide" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3>Attach HS code to {current ? current.id : targetId}</h3>
          <button className="bws-btn icon" onClick={close}>×</button>
        </header>

        <div className="bws-hs-filters">
          <input
            className="bws-input"
            placeholder="Search code or description…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          <select
            className="bws-input"
            value={chapter}
            onChange={(e) => setChapter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">All chapters</option>
            {chapters.map((c) => (
              <option key={c} value={c}>{c} — {HS_CHAPTERS[c] || ''}</option>
            ))}
          </select>
          <button className="bws-btn primary" onClick={() => apply(q)} disabled={!q.trim()}>
            Attach
          </button>
          {current?.hsCode && (
            <button className="bws-btn warn" onClick={clear}>Remove</button>
          )}
        </div>

        {preview && (
          <div className="bws-hs-preview">
            <strong>{preview.code}</strong> — {preview.desc}
            <span className="rates">
              {preview.duty}% duty · {preview.sst}% SST
              {preview.pga.length ? ` · PGA: ${preview.pga.join(', ')}` : ''}
              {preview.restricted ? ' · RESTRICTED' : ''}
            </span>
          </div>
        )}

        <div className="bws-hs-list">
          <table>
            <thead>
              <tr><th>Code</th><th>Description</th><th>Duty</th><th>SST</th><th>PGA</th><th /></tr>
            </thead>
            <tbody>
              {filtered.map((h) => (
                <tr key={h.code} className={h.restricted ? 'restricted' : ''}>
                  <td className="mono">{h.code}</td>
                  <td>{h.desc}</td>
                  <td>{h.duty}%</td>
                  <td>{h.sst}%</td>
                  <td>{h.pga.join(', ') || '—'}</td>
                  <td>
                    <button className="bws-btn" onClick={() => apply(h.code)}>Attach</button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={6} className="empty">No matching HS codes in the local catalog.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

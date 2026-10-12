'use client';
import { useStudio } from '@/lib/workflow-studio/store';

export function TopBar() {
  const mode = useStudio((s) => s.mode);
  const prodEnabled = useStudio((s) => s.prodEnabled);
  const transport = useStudio((s) => s.transport);
  const running = useStudio((s) => s.running);
  const setMode = useStudio((s) => s.setMode);
  const undo = useStudio((s) => s.undo);
  const redo = useStudio((s) => s.redo);
  const autoLayout = useStudio((s) => s.autoLayout);
  const fitView = useStudio((s) => s.fitView);
  const setShowShortcuts = useStudio((s) => s.setShowShortcuts);
  const setManualModalOpen = useStudio((s) => s.setManualModalOpen);
  const run = useStudio((s) => s.run);
  const history = useStudio((s) => s.history);

  const verified = mode === 'production' && prodEnabled && transport;
  const label = mode === 'development'
    ? 'Development simulation — not connected to JKDM'
    : mode === 'manual'
      ? 'Manual processing required — record external responses'
      : verified
        ? 'Production transport flagged as configured — live probe not performed'
        : 'Production integration unavailable';

  const pillClass =
    mode === 'development' ? 'dev'
    : mode === 'manual' ? 'warn'
    : verified ? 'ok' : 'bad';

  return (
    <header className="bws-header">
      <div className="bws-brand">
        <div className="bws-mark">BS</div>
        <div>
          Brokerage Workflow Studio
          <small>JKDM INTEGRATION · MALAYSIA CUSTOMS</small>
        </div>
      </div>

      <div className="bws-seg">
        {(['development', 'manual', 'production'] as const).map((m) => (
          <button key={m} className={mode === m ? 'on ' + m : ''}
                  disabled={running} onClick={() => setMode(m)}>
            {m === 'development' ? 'Development' : m === 'manual' ? 'Manual' : 'Production'}
          </button>
        ))}
      </div>

      <span className={'bws-pill ' + pillClass}>
        <span className="dot" />{label}
      </span>

      <div className="bws-spacer" />

      <button className="bws-btn icon" title="Undo (Ctrl+Z)"
              onClick={undo} disabled={!history.past.length}>↶</button>
      <button className="bws-btn icon" title="Redo (Ctrl+Shift+Z)"
              onClick={redo} disabled={!history.future.length}>↷</button>
      <button className="bws-btn icon" title="Auto-layout" onClick={autoLayout}>▤</button>
      <button className="bws-btn icon" title="Fit to view (Ctrl+1)" onClick={fitView}>⤢</button>
      <button className="bws-btn icon" title="Shortcuts (?)"
              onClick={() => setShowShortcuts(true)}>?</button>
      <button className="bws-btn warn" disabled={running}
              onClick={() => setManualModalOpen(true)}>
        Record Manual Response
      </button>
      <button className="bws-btn primary" disabled={running} onClick={run}>
        {running ? 'Running…' : '▶ Run Workflow'}
      </button>
    </header>
  );
}

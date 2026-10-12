'use client';
import { useStudio } from '@/lib/workflow-studio/store';

const ROWS: [string, string][] = [
  ['Space + drag', 'Pan canvas'],
  ['Middle-drag', 'Pan canvas'],
  ['Alt + drag', 'Pan canvas'],
  ['Wheel', 'Zoom at cursor'],
  ['Ctrl + + / −', 'Zoom in / out'],
  ['Ctrl + 0', 'Reset zoom to 100%'],
  ['Ctrl + 1', 'Fit to view'],
  ['Ctrl + Z', 'Undo'],
  ['Ctrl + Shift + Z', 'Redo'],
  ['Ctrl + C', 'Copy selection'],
  ['Ctrl + V', 'Paste'],
  ['Ctrl + D', 'Duplicate selection'],
  ['Ctrl + A', 'Select all'],
  ['Ctrl + G', 'Toggle snap-to-grid'],
  ['H', 'Attach HS code (single node)'],
  ['Delete / Backspace', 'Delete selection'],
  ['?', 'Toggle this panel'],
  ['Esc', 'Cancel / close'],
];

export function ShortcutsHelp() {
  const open = useStudio((s) => s.showShortcuts);
  const setOpen = useStudio((s) => s.setShowShortcuts);
  if (!open) return null;
  return (
    <div className="bws-modal-backdrop" onClick={() => setOpen(false)}>
      <div className="bws-modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3>Keyboard shortcuts</h3>
          <button className="bws-btn icon" onClick={() => setOpen(false)}>×</button>
        </header>
        <table className="bws-kbd-table">
          <tbody>
            {ROWS.map(([k, v]) => (
              <tr key={k}><td><kbd>{k}</kbd></td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useStudio } from '@/lib/workflow-studio/store';
import type { ManualFormValues } from '@/lib/workflow-studio/types';

const CATEGORIES = [
  { value: 'acknowledgment', label: 'Acknowledgment received' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'additional_information_required', label: 'Additional information required' },
  { value: 'inspection_required', label: 'Inspection required' },
  { value: 'released', label: 'Released' },
];

const empty: ManualFormValues = {
  ref: '', category: 'acknowledgment', responseAt: '',
  officerName: '', officerId: '', evidence: '', exception: '',
  notes: '', reviewed: false,
};

export function ManualResponseModal() {
  const open = useStudio((s) => s.manualModalOpen);
  const close = useStudio((s) => s.setManualModalOpen);
  const submit = useStudio((s) => s.submitManual);
  const decl = useStudio((s) => s.decl);
  const approve = useStudio((s) => s.approveObservation);
  const [form, setForm] = useState<ManualFormValues>(empty);

  if (!open) return null;

  const set = <K extends keyof ManualFormValues>(k: K, v: ManualFormValues[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submitForm = () => {
    submit(form);
    setForm(empty);
    close(false);
  };

  return (
    <div className="bws-modal-backdrop" onClick={() => close(false)}>
      <div className="bws-modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3>Record manual customs response</h3>
          <button className="bws-btn icon" onClick={() => close(false)}>×</button>
        </header>

        <div className="bws-modal-body">
          <div className="bws-callout">
            Current declaration <strong>{decl.id}</strong> · status <strong>{decl.status}</strong>
          </div>

          <div className="bws-grid-2">
            <label>Reference<input className="bws-input" value={form.ref}
              onChange={(e) => set('ref', e.target.value)} /></label>
            <label>Category
              <select className="bws-input" value={form.category}
                onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </label>
            <label>Response timestamp<input className="bws-input" type="datetime-local"
              value={form.responseAt} onChange={(e) => set('responseAt', e.target.value)} /></label>
            <label>Officer name<input className="bws-input" value={form.officerName}
              onChange={(e) => set('officerName', e.target.value)} /></label>
            <label>Officer ID<input className="bws-input" value={form.officerId}
              onChange={(e) => set('officerId', e.target.value)} /></label>
            <label>Evidence reference<input className="bws-input" value={form.evidence}
              onChange={(e) => set('evidence', e.target.value)} /></label>
          </div>

          <label>Exception / override path
            <input className="bws-input" value={form.exception}
              onChange={(e) => set('exception', e.target.value)} /></label>

          <label>Notes<textarea className="bws-input" rows={3} value={form.notes}
            onChange={(e) => set('notes', e.target.value)} /></label>

          <label className="bws-check">
            <input type="checkbox" checked={form.reviewed}
              onChange={(e) => set('reviewed', e.target.checked)} />
            Reviewer confirms this observation is accurate and approved
          </label>

          {decl.pendingObservation && (
            <div className="bws-callout warn">
              Pending observation → <strong>{decl.pendingObservation.target}</strong>.
              <button className="bws-btn primary" onClick={approve}>Approve pending observation</button>
            </div>
          )}
        </div>

        <footer className="bws-modal-foot">
          <button className="bws-btn" onClick={() => close(false)}>Cancel</button>
          <button className="bws-btn primary" onClick={submitForm} disabled={!form.ref}>
            Record observation
          </button>
        </footer>
      </div>
    </div>
  );
}

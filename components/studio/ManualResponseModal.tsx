'use client';

import { useState } from 'react';
import type { ManualResponseForm } from '@/types';

export interface ManualResponseModalProps {
  onClose: () => void;
  onSubmit: (form: ManualResponseForm) => void;
}

export default function ManualResponseModal({ onClose, onSubmit }: ManualResponseModalProps) {
  const [f, setF] = useState<ManualResponseForm>({
    ref: '', category: 'acknowledgment',
    responseAt: new Date().toISOString().slice(0, 16),
    officerName: '', officerId: '', evidence: '', exception: '', notes: '', reviewed: false,
  });
  const [err, setErr] = useState('');

  const set = (k: keyof ManualResponseForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF({ ...f, [k]: e.target.value });

  const submit = () => {
    if (!f.ref.trim()) return setErr('External declaration reference is required.');
    if (!f.evidence.trim() && !f.exception.trim())
      return setErr('Provide an evidence reference, or an exception reason for authorized review.');
    if (!f.notes.trim()) return setErr("Broker's explanatory notes are required.");
    onSubmit(f);
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-[#030712]/80 p-5 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-xl border border-[#1f2937] bg-[#0f141b] p-[18px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-1 text-[15px] font-semibold">Record Manual Customs Response</h3>
        <p className="mb-3 text-[11.5px] leading-relaxed text-[#6b7280]">
          Creates a <strong>manual observation</strong> — not a digitally verified JKDM API response.
          Officer ID is optional; missing information is recorded explicitly.
        </p>

        <Field label="External declaration reference *">
          <input value={f.ref} onChange={set('ref')} placeholder="e.g. JKDM/K2/2026/0001234" className={inputCls} />
        </Field>
        <Field label="Response category">
          <select value={f.category} onChange={set('category')} className={inputCls}>
            <option value="acknowledgment">Submission acknowledgment</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="additional_information_required">Additional information required</option>
            <option value="inspection_required">Inspection required</option>
            <option value="released">Released</option>
          </select>
        </Field>
        <Field label="Response date & time">
          <input type="datetime-local" value={f.responseAt} onChange={set('responseAt')} className={inputCls} />
        </Field>
        <Field label="Officer name (optional)">
          <input value={f.officerName} onChange={set('officerName')} placeholder="Leave blank if not provided" className={inputCls} />
        </Field>
        <Field label="Officer ID (optional)">
          <input value={f.officerId} onChange={set('officerId')} placeholder="Not applicable" className={inputCls} />
        </Field>
        <Field label="Evidence reference *" hint="A filename alone is not treated as verified evidence.">
          <input value={f.evidence} onChange={set('evidence')} placeholder="Vault path / hash / scan reference" className={inputCls} />
        </Field>
        <Field label="Exception reason (if no evidence obtainable)">
          <textarea value={f.exception} onChange={set('exception')}
            placeholder="Explain why evidence cannot be obtained — requires authorized review." className={inputCls} />
        </Field>
        <Field label="Broker notes *">
          <textarea value={f.notes} onChange={set('notes')}
            placeholder="What was communicated, by whom, and how." className={inputCls} />
        </Field>

        <label className="my-2 flex items-center gap-2 text-[11.5px] font-semibold text-[#e5e7eb]">
          <input type="checkbox" checked={f.reviewed}
            onChange={(e) => setF({ ...f, reviewed: e.target.checked })} />
          Reviewer has approved this observation (demo only)
        </label>

        {err && <div className="mt-2 rounded border border-[#5b1a1a] bg-[#2a0d0d] p-2 text-[11px] text-[#fca5a5]">{err}</div>}

        <div className="mt-3.5 flex justify-end gap-2">
          <button onClick={onClose}
            className="rounded border border-[#2d3748] bg-[#131921] px-2.5 py-1.5 text-[11px] font-semibold hover:bg-[#1f2731]">
            Cancel
          </button>
          <button onClick={submit}
            className="rounded border border-blue-500 bg-blue-700 px-2.5 py-1.5 text-[11px] font-semibold hover:bg-blue-800">
            Record observation
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = 'w-full rounded border border-[#1f2937] bg-[#0b1424] px-2 py-1.5 text-[12px] text-[#e5e7eb] focus:border-blue-500 focus:outline-none';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="my-2">
      <label className="mb-1 block text-[9.5px] font-extrabold uppercase tracking-wider text-[#4b5563]">{label}</label>
      {children}
      {hint && <div className="mt-1 text-[9.5px] text-[#4b5563]">{hint}</div>}
    </div>
  );
}
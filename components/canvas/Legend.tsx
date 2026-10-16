'use client';

const ITEMS = [
  { color: '#10b981', label: 'verified' },
  { color: '#f59e0b', label: 'manual' },
  { color: '#a855f7', label: 'synthetic' },
  { color: '#ef4444', label: 'blocked' },
  { color: '#3b82f6', label: 'local' },
  { color: '#06b6d4', label: '⟲ loop' },
];

export default function Legend() {
  return (
    <div className="rounded-md border border-[#1f2937] bg-[#0b1424ee] px-2.5 py-1.5 text-[9.5px] text-[#9ca3af]">
      {ITEMS.map((i) => (
        <span key={i.label} className="mr-2.5 inline-flex items-center gap-1">
          <i className="inline-block h-[7px] w-[7px] rounded-full" style={{ background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}
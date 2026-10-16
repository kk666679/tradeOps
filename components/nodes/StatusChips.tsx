'use client';

import type { StudioNodeData } from '@/types';

export interface StatusChipsProps {
  data: StudioNodeData;
}

const CHIP_BASE =
  'inline-block rounded px-1 py-0.5 text-[8px] font-extrabold uppercase tracking-wider';

export default function StatusChips({ data }: StatusChipsProps) {
  return (
    <>
      {data.provenance === 'synthetic' && (
        <span className={CHIP_BASE + ' bg-[#2e1065] text-[#d8b4fe]'}>synthetic</span>
      )}
      {data.provenance === 'manual' && (
        <span className={CHIP_BASE + ' bg-[#451a03] text-[#fcd34d]'}>manual</span>
      )}
      {data.provenance === 'verified' && (
        <span className={CHIP_BASE + ' bg-[#052e21] text-[#6ee7b7]'}>verified</span>
      )}
      {(data.status === 'blocked' || data.provenance === 'blocked') && (
        <span className={CHIP_BASE + ' bg-[#450a0a] text-[#fca5a5]'}>blocked</span>
      )}
      {data.human && (
        <span className={CHIP_BASE + ' bg-[#0c2545] text-[#93c5fd]'}>approval</span>
      )}
      {data.kind === 'gate' && data.iterations > 0 && (
        <span className={CHIP_BASE + ' bg-[#0b3a4a] text-[#67e8f9]'}>⟲ {data.iterations}</span>
      )}
    </>
  );
}